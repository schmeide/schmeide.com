import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const blocking = ["serious", "critical"];

test("has no serious accessibility violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((violation) =>
      blocking.includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});

for (const [label, path] of [
  ["the privacy page", "/privacy/"],
  ["the terms page", "/terms/"],
  ["the 404 page", "/no-such-page/"],
] as const) {
  for (const width of [1280, 320]) {
    test(`has no serious accessibility violations on ${label} at ${width}px`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width, height: 800 });
      await page.goto(path);
      const results = await new AxeBuilder({ page }).analyze();
      expect(
        results.violations.filter((violation) =>
          blocking.includes(violation.impact ?? ""),
        ),
      ).toEqual([]);
    });
  }
}

test("has one h1 and an h2 for every section", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  const sections = page.locator("main section");
  const count = await sections.count();
  expect(count).toBeGreaterThan(5);
  await expect(page.locator("main section h2")).toHaveCount(count - 1);
});

test("starts keyboard navigation at the skip link", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.locator('a[href="#main"]');
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("reaches every interactive element with the Tab key", async ({ page }) => {
  await page.goto("/");
  const expected = await page
    .locator("a[href]:visible, button:visible, input:visible, summary:visible")
    .count();
  const reached = new Set<string>();
  for (let presses = 0; presses < expected + 5; presses += 1) {
    await page.keyboard.press("Tab");
    const marker = await page.evaluate(() => {
      const element = document.activeElement;
      if (element === null || element === document.body) {
        return null;
      }
      const rect = element.getBoundingClientRect();
      return `${element.tagName}:${Math.round(rect.top + window.scrollY)}:${Math.round(rect.left)}`;
    });
    if (marker !== null) {
      reached.add(marker);
    }
  }
  expect(reached.size).toBe(expected);
});

test("opens and closes a question with the keyboard", async ({ page }) => {
  await page.goto("/");
  const question = page.locator("#faq details").first();
  await question.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(question).toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(question).not.toHaveAttribute("open", "");
});

test("fits a 320px wide screen without sideways scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("opens the menu on a small screen", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  const menu = page.locator("header details");
  await menu.locator("summary").click();
  await expect(menu.locator('a[href="/#how"]')).toBeVisible();
});

test("closes the menu on a link, on Escape and on a click outside", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  const menu = page.locator("header details");
  const button = menu.locator("summary");
  const link = menu.locator('a[href="/#how"]');

  await button.click();
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/#how$/);
  await expect(menu).not.toHaveAttribute("open", "");
  await expect(link).toBeHidden();

  await button.click();
  await expect(menu).toHaveAttribute("open", "");
  await link.focus();
  await page.keyboard.press("Escape");
  await expect(menu).not.toHaveAttribute("open", "");
  await expect(button).toBeFocused();

  await button.click();
  await expect(menu).toHaveAttribute("open", "");
  await page.locator("main").click({ position: { x: 10, y: 10 } });
  await expect(menu).not.toHaveAttribute("open", "");
});

test("shows no placeholder labels in production", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("mark")).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText(/placeholder/i);
});

test("keeps the legal pages out of search results", async ({ page }) => {
  for (const path of ["/privacy/", "/terms/"]) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator("h1")).toHaveCount(1);
  }
});

test("shows the headline, the accountability line and the main call to action on a phone without scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const heading = page.locator("h1");
  for (const element of [
    heading,
    heading.locator("+ p"),
    page.locator('main a[href="#early-access"]').first(),
  ]) {
    await expect(element).toBeInViewport({ ratio: 1 });
  }
});
