import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const blocking = ["serious", "critical"];

test("has no serious accessibility violations on the invoicing page", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/for/invoicing/");
  await expect(page.locator("h1")).toHaveCount(1);
  const results = await new AxeBuilder({ page })
    .exclude("nextjs-portal")
    .analyze();
  expect(
    results.violations.filter((violation) =>
      blocking.includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});

test("ends with a call to action that carries the starting point", async ({
  page,
}) => {
  await page.goto("/for/invoicing/");
  await expect(
    page.locator('main a[href="/early-access/?start=invoices"]'),
  ).toHaveCount(1);
});

test("keeps an unconfirmed use case out of search results", async ({
  page,
}) => {
  await page.goto("/for/invoicing/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});
