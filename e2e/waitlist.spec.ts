import { expect, test } from "@playwright/test";
import { WAITLIST_ENDPOINT } from "../playwright.config";

const entry = {
  name: "Ada Example",
  email: "ada@example.com",
  business: "A bakery that wants online orders",
};

test("links every error to its field and focuses the first one", async ({
  page,
}) => {
  await page.goto("/");
  const form = page.locator("#early-access form");
  await form.locator('button[type="submit"]').click();
  const name = form.locator('input[name="name"]');
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  const errorId = await name.getAttribute("aria-describedby");
  await expect(page.locator(`#${errorId}`)).not.toBeEmpty();
});

test("submits the entry and confirms it", async ({ page }) => {
  const bodies: string[] = [];
  await page.route(WAITLIST_ENDPOINT, async (route) => {
    bodies.push(route.request().postData() ?? "");
    await route.fulfill({ status: 200, json: { ok: true } });
  });
  await page.goto("/");
  const section = page.locator("#early-access");
  await section.locator('input[name="name"]').fill(entry.name);
  await section.locator('input[name="email"]').fill(entry.email);
  await section.locator('input[name="business"]').fill(entry.business);
  await page.keyboard.press("Enter");
  const status = section.locator('[role="status"]');
  await expect(status).toBeVisible();
  await expect(status).toBeFocused();
  expect(bodies.map((body) => JSON.parse(body))).toEqual([entry]);
});

test("says so when the submission fails", async ({ page }) => {
  await page.route(WAITLIST_ENDPOINT, (route) => route.abort());
  await page.goto("/");
  const section = page.locator("#early-access");
  await section.locator('input[name="name"]').fill(entry.name);
  await section.locator('input[name="email"]').fill(entry.email);
  await section.locator('input[name="business"]').fill(entry.business);
  await section.locator('button[type="submit"]').click();
  await expect(section.locator('[role="alert"]')).not.toBeEmpty();
  await expect(section.locator('[role="status"]')).toHaveCount(0);
});
