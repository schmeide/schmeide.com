import { expect, test, type Page } from "@playwright/test";

const content = (page: Page, selector: string) =>
  page.locator(selector).first().getAttribute("content");

for (const path of ["/", "/early-access/", "/privacy/", "/terms/"]) {
  test(`describes ${path} in its Open Graph and Twitter tags`, async ({
    page,
  }) => {
    await page.goto(path);
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    const title = await page.title();
    const description = await content(page, 'meta[name="description"]');

    expect(canonical).toMatch(new RegExp(`${path}$`));
    expect(await content(page, 'meta[property="og:url"]')).toBe(canonical);
    expect(await content(page, 'meta[property="og:title"]')).toBe(title);
    expect(await content(page, 'meta[property="og:description"]')).toBe(
      description,
    );
    expect(await content(page, 'meta[name="twitter:title"]')).toBe(title);
    expect(await content(page, 'meta[name="twitter:description"]')).toBe(
      description,
    );
    await expect(page.locator('meta[property="og:image"]')).not.toHaveCount(0);
  });
}

test("sets no canonical or og:url on the 404 page", async ({ page }) => {
  await page.goto("/404.html");
  const title = await page.title();
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
  expect(await content(page, 'meta[property="og:title"]')).toBe(title);
  expect(await content(page, 'meta[name="twitter:title"]')).toBe(title);
});
