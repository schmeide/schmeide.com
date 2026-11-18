import { expect, test } from "@playwright/test";
import type { Locator } from "@playwright/test";
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

const fillEntry = async (section: Locator) => {
  await section.locator('input[name="name"]').fill(entry.name);
  await section.locator('input[name="email"]').fill(entry.email);
  await section.locator('input[name="business"]').fill(entry.business);
};

test("says so and keeps the form when the endpoint rejects the entry", async ({
  page,
}) => {
  await page.route(WAITLIST_ENDPOINT, (route) =>
    route.fulfill({ status: 500, json: { ok: false } }),
  );
  await page.goto("/");
  const section = page.locator("#early-access");
  await fillEntry(section);
  await section.locator('button[type="submit"]').click();
  await expect(section.locator('[role="alert"]')).not.toBeEmpty();
  await expect(section.locator('[role="status"]')).toHaveCount(0);
  await expect(section.locator("form")).toBeVisible();
  await expect(section.locator('input[name="email"]')).toHaveValue(entry.email);
});

test("sends nothing on a second click while sending", async ({ page }) => {
  let requests = 0;
  await page.route(WAITLIST_ENDPOINT, async (route) => {
    requests += 1;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await route.fulfill({ status: 200, json: { ok: true } });
  });
  await page.goto("/");
  const section = page.locator("#early-access");
  await fillEntry(section);
  const button = section.locator('button[type="submit"]');
  await button.click();
  await expect(button).toHaveAttribute("aria-disabled", "true");
  await expect(button).toHaveText("Sending");
  await button.click({ force: true });
  await expect(section.locator('[role="status"]')).toBeVisible();
  expect(requests).toBe(1);
});

test("shows saved and sends nothing when the honeypot is filled", async ({
  page,
}) => {
  let requests = 0;
  await page.route(WAITLIST_ENDPOINT, async (route) => {
    requests += 1;
    await route.fulfill({ status: 200, json: { ok: true } });
  });
  await page.goto("/");
  const section = page.locator("#early-access");
  await fillEntry(section);
  await section
    .locator('input[name="website"]')
    .evaluate((input) =>
      Object.assign(input, { value: "https://spam.example" }),
    );
  await section.locator('button[type="submit"]').click();
  await expect(section.locator('[role="status"]')).toBeVisible();
  expect(requests).toBe(0);
});

test("records the starting point a use-case page sent", async ({ page }) => {
  const bodies: string[] = [];
  await page.route(WAITLIST_ENDPOINT, async (route) => {
    bodies.push(route.request().postData() ?? "");
    await route.fulfill({ status: 200, json: { ok: true } });
  });
  for (const search of ["?start=invoices", "?start=payroll"]) {
    await page.goto(`/early-access/${search}`);
    const section = page.locator("#early-access");
    await fillEntry(section);
    await section.locator('button[type="submit"]').click();
    await expect(section.locator('[role="status"]')).toBeVisible();
  }
  expect(bodies.map((body) => JSON.parse(body))).toEqual([
    { ...entry, startingPoint: "invoices" },
    entry,
  ]);
});
