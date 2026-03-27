import { Page, expect } from "@playwright/test";

/** Assert that a specific element has D-pad focus */
export async function expectFocusedOn(
  page: Page,
  focusKey: string,
): Promise<void> {
  const el = page.locator(`[data-focus-key="${focusKey}"]`);
  await expect(el).toBeVisible();
  // Check for focus ring classes
  await expect(el).toHaveClass(/ring-teal|border-teal|scale-\[1\.08\]/);
}

/** Assert that the focus ring (teal glow) is visible on element */
export async function expectFocusRingVisible(
  page: Page,
  focusKey: string,
): Promise<void> {
  const el = page.locator(`[data-focus-key="${focusKey}"]`);
  await expect(el).toBeVisible();
  await expect(el).toHaveClass(/ring-teal/);
}

/** Assert no element currently has D-pad focus */
export async function expectNoFocus(page: Page): Promise<void> {
  const focused = await page.evaluate(() => {
    const allFocusable = document.querySelectorAll("[data-focus-key]");
    for (const el of allFocusable) {
      if (
        el.className.includes("ring-teal") ||
        el.className.includes("scale-[1.08]")
      ) {
        return (el as HTMLElement).dataset.focusKey;
      }
    }
    return null;
  });
  expect(focused).toBeNull();
}

/** Assert URL matches pattern (for navigation verification) */
export async function expectNavigatedTo(
  page: Page,
  urlPattern: RegExp,
  timeout = 5000,
): Promise<void> {
  await page.waitForURL(urlPattern, { timeout });
}
