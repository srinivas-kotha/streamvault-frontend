import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

// Load .env for E2E credentials
dotenv.config();

const STORAGE_STATE = "tests/e2e/.auth/storage-state.json";

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  fullyParallel: false, // Run serial to minimize re-logins on token expiry
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  timeout: 60_000,

  use: {
    baseURL: "https://streamvault.srinivaskotha.uk",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    ignoreHTTPSErrors: true,
    storageState: STORAGE_STATE,
    // Custom header to identify E2E test traffic — backend can use this to
    // relax rate limiting (e.g., skip or raise limit when header is present).
    // Backend change needed: check for X-E2E-Test header in rate limiter middleware.
    extraHTTPHeaders: {
      "X-E2E-Test": process.env.E2E_TEST_KEY || "playwright",
    },
  },

  projects: [
    {
      name: "desktop-chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: "tv-chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        contextOptions: {
          colorScheme: "dark",
        },
      },
    },
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 390, height: 844 },
      },
    },
  ],
});
