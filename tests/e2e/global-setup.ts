/**
 * Global setup: logs in once and saves browser storage state (cookies).
 * All test projects reuse this state, avoiding per-test login and rate limiting.
 */
import { chromium, type FullConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const STORAGE_STATE_PATH = "tests/e2e/.auth/storage-state.json";

async function globalSetup(config: FullConfig) {
  const baseURL =
    config.projects[0]?.use?.baseURL ?? "https://streamvault.srinivaskotha.uk";

  const username = process.env.E2E_USERNAME;
  const password = process.env.E2E_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "E2E_USERNAME and E2E_PASSWORD must be set in .env or environment",
    );
  }

  const browser = await chromium.launch();

  // Login with retry — API may be slow or rate-limited
  let context = await browser.newContext({
    baseURL,
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      "X-E2E-Test": process.env.E2E_TEST_KEY || "playwright",
    },
  });
  let page = await context.newPage();
  let loginSuccess = false;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.goto("/login", {
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      });
      await page
        .locator("#username")
        .waitFor({ state: "visible", timeout: 15_000 });
      await page.locator("#username").clear();
      await page.locator("#username").fill(username);
      await page.locator("#password").clear();
      await page.locator("#password").fill(password);
      await page.locator("#login-submit").click();

      await page.waitForURL((url) => !url.pathname.includes("/login"), {
        timeout: 30_000,
        waitUntil: "domcontentloaded",
      });
      loginSuccess = true;
      break;
    } catch (err) {
      console.log(
        `Global setup login attempt ${attempt}/3 failed: ${(err as Error).message}`,
      );
      if (attempt < 3) {
        // Create fresh context for retry
        try {
          await context.close();
        } catch {
          /* ignore */
        }
        context = await browser.newContext({
          baseURL,
          ignoreHTTPSErrors: true,
          extraHTTPHeaders: {
            "X-E2E-Test": process.env.E2E_TEST_KEY || "playwright",
          },
        });
        page = await context.newPage();
        // Wait before retry — longer pause to avoid rate limiting
        await new Promise((r) => setTimeout(r, 10_000));
      }
    }
  }

  if (!loginSuccess) {
    await browser.close();
    throw new Error("Global setup: all login attempts failed");
  }

  // Let the SPA settle (may redirect from / to /language/telugu)
  await page.waitForTimeout(3_000);

  // Save storage state (cookies + localStorage)
  await context.storageState({ path: STORAGE_STATE_PATH });

  await browser.close();
}

export default globalSetup;
