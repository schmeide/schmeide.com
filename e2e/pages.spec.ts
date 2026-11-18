import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const PAGES = ["/", "/early-access/", "/privacy/", "/terms/"] as const;

const hrefsOn = async (page: Page): Promise<readonly string[]> =>
  page
    .locator("a[href]")
    .evaluateAll((anchors) =>
      anchors.map((anchor) => anchor.getAttribute("href") ?? ""),
    );

const isInternal = (href: string): boolean =>
  href.startsWith("/") || href.startsWith("#");

test("every in-page and cross-page anchor resolves to an id", async ({
  page,
}) => {
  const checked: string[] = [];
  for (const path of PAGES) {
    await page.goto(path);
    for (const href of await hrefsOn(page)) {
      if (!isInternal(href) || !href.includes("#")) {
        continue;
      }
      const [target, id = ""] = href.split("#");
      if (id === "") {
        continue;
      }
      const targetPath = target === undefined || target === "" ? path : target;
      await page.goto(targetPath);
      await expect(
        page.locator(`[id="${id}"]`),
        `${path} links to ${href}`,
      ).toHaveCount(1);
      checked.push(`${path} -> ${href}`);
      await page.goto(path);
    }
  }
  expect(checked.length).toBeGreaterThan(0);
});

test("every internal link returns 200", async ({ page, request }) => {
  const targets = new Set<string>();
  for (const path of PAGES) {
    await page.goto(path);
    for (const href of await hrefsOn(page)) {
      if (isInternal(href)) {
        targets.add(href.split("#")[0] || path);
      }
    }
  }
  expect(targets.size).toBeGreaterThan(1);
  for (const target of targets) {
    const response = await request.get(target);
    expect(response.status(), target).toBe(200);
  }
});

test("links from the header and footer to pages or to the app, on every page", async ({
  page,
  request,
}) => {
  for (const path of PAGES) {
    await page.goto(path);
    const hrefs = await page
      .locator("header a[href], footer a[href]")
      .evaluateAll((anchors) =>
        anchors.map((anchor) => anchor.getAttribute("href") ?? ""),
      );
    expect(hrefs.length, path).toBeGreaterThan(0);
    for (const href of hrefs) {
      if (isInternal(href)) {
        const target = href.split("#")[0] || path;
        expect((await request.get(target)).status(), `${path}: ${href}`).toBe(
          200,
        );
      } else {
        const url = new URL(href);
        expect(url.protocol, `${path}: ${href}`).toBe("https:");
        expect([...url.searchParams.keys()], href).not.toContain("utm_source");
      }
    }
  }
});

test("sends the main call to action where the launch mode says", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  const toEarlyAccess = page.locator('main a[href="/early-access/"]');
  const toSignUp = page.locator('main a[href$="/sign-up"]');
  if (testInfo.project.name === "chromium-open") {
    await expect(toEarlyAccess).toHaveCount(0);
    await expect(toSignUp).not.toHaveCount(0);
  } else {
    await expect(toEarlyAccess).not.toHaveCount(0);
    await expect(toSignUp).toHaveCount(0);
  }
});

test("leaves unconfirmed use-case pages out of the production build", async ({
  page,
}) => {
  await page.goto("/for/invoicing/");
  await expect(
    page.locator('meta[name="robots"][content*="noindex"]'),
  ).not.toHaveCount(0);
  await expect(page.locator("body")).not.toContainText(/invoices today/i);
  await page.goto("/");
  await expect(page.locator('a[href^="/for/"]')).toHaveCount(0);
});

test("serves a 404 page for an unknown path", async ({ request }) => {
  const response = await request.get("/no-such-page/");
  expect(response.status()).toBe(404);
});

test("serves a sitemap that lists only canonical pages", async ({
  page,
  request,
}) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const locs = [
    ...(await response.text()).matchAll(/<loc>([^<]+)<\/loc>/g),
  ].map((match) => match[1] ?? "");
  expect(locs.length).toBeGreaterThan(0);
  for (const loc of locs) {
    const url = new URL(loc);
    await page.goto(url.pathname);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      loc,
    );
    await expect(
      page.locator('meta[name="robots"][content*="noindex"]'),
    ).toHaveCount(0);
  }
});

test("serves robots.txt that points at the sitemap", async ({
  page,
  request,
}) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toMatch(/User-Agent: \*/i);
  const sitemap = /^Sitemap: (.+)$/im.exec(body)?.[1];
  expect(sitemap).toBeDefined();
  await page.goto("/");
  const canonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  expect(new URL(sitemap ?? "").origin).toBe(new URL(canonical ?? "").origin);
  expect((await request.get(new URL(sitemap ?? "").pathname)).status()).toBe(
    200,
  );
});

test("serves a manifest that agrees with the site", async ({
  page,
  request,
}) => {
  const response = await request.get("/manifest.webmanifest");
  expect(response.status()).toBe(200);
  const manifest = await response.json();
  expect(manifest.start_url).toBe("/");
  await page.goto("/");
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    "href",
    "/manifest.webmanifest",
  );
  expect(manifest.icons.length).toBeGreaterThan(0);
  for (const icon of manifest.icons) {
    expect((await request.get(icon.src)).status(), icon.src).toBe(200);
  }
});
