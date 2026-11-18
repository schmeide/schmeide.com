import { defineConfig, devices } from "@playwright/test";

const INVITE_PORT = 4173;

const OPEN_PORT = 4174;

const OPEN_DIR = "out-open";

export const WAITLIST_ENDPOINT = "https://waitlist.invalid/submit";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: `http://localhost:${INVITE_PORT}`,
      },
    },
    {
      name: "chromium-open",
      testMatch: "pages.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: `http://localhost:${OPEN_PORT}`,
      },
    },
  ],
  webServer: {
    command: [
      `rm -rf ${OPEN_DIR}`,
      `NEXT_PUBLIC_LAUNCH_MODE=open next build`,
      `mv out ${OPEN_DIR}`,
      `next build`,
      `(serve ${OPEN_DIR} -l ${OPEN_PORT} & serve out -l ${INVITE_PORT})`,
    ].join(" && "),
    url: `http://localhost:${INVITE_PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 360_000,
    env: { NEXT_PUBLIC_WAITLIST_ENDPOINT: WAITLIST_ENDPOINT },
  },
});
