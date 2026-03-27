import { Page } from "@playwright/test";

/** Press D-pad Down (ArrowDown) */
export async function dpadDown(page: Page): Promise<void> {
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(150); // Allow norigin to process
}

/** Press D-pad Up (ArrowUp) */
export async function dpadUp(page: Page): Promise<void> {
  await page.keyboard.press("ArrowUp");
  await page.waitForTimeout(150);
}

/** Press D-pad Left (ArrowLeft) */
export async function dpadLeft(page: Page): Promise<void> {
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(150);
}

/** Press D-pad Right (ArrowRight) */
export async function dpadRight(page: Page): Promise<void> {
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(150);
}

/** Press Enter (D-pad center / OK button) */
export async function dpadEnter(page: Page): Promise<void> {
  await page.keyboard.press("Enter");
  await page.waitForTimeout(150);
}

/** Simulate Fire TV back button (keyCode 4) */
export async function dpadBack(page: Page): Promise<void> {
  await page.evaluate(() => {
    const event = new KeyboardEvent("keydown", {
      key: "GoBack",
      code: "GoBack",
      keyCode: 4,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
  });
  await page.waitForTimeout(150);
}

/** Simulate Fire TV DPAD_CENTER (keyCode 23) */
export async function tvDpadCenter(page: Page): Promise<void> {
  await page.evaluate(() => {
    const event = new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      keyCode: 23,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
  });
  await page.waitForTimeout(150);
}

/** Simulate Samsung Tizen back button (keyCode 10009) */
export async function samsungBack(page: Page): Promise<void> {
  await page.evaluate(() => {
    const event = new KeyboardEvent("keydown", {
      key: "XF86Back",
      code: "XF86Back",
      keyCode: 10009,
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
  });
  await page.waitForTimeout(150);
}

/** Get the currently focused element's data-focus-key */
export async function getFocusedKey(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    // Check for norigin focus ring indicators
    const allFocusable = document.querySelectorAll("[data-focus-key]");
    for (const el of allFocusable) {
      const classes = el.className;
      if (
        classes.includes("ring-teal") ||
        classes.includes("border-teal") ||
        classes.includes("scale-[1.08]")
      ) {
        return (el as HTMLElement).dataset.focusKey || null;
      }
    }
    return null;
  });
}

/** Wait until a specific element has focus (by data-focus-key) */
export async function waitForFocus(
  page: Page,
  focusKey: string,
  timeout = 5000,
): Promise<void> {
  await page.waitForFunction(
    (key) => {
      const el = document.querySelector(`[data-focus-key="${key}"]`);
      if (!el) return false;
      const classes = el.className;
      return (
        classes.includes("ring-teal") ||
        classes.includes("border-teal") ||
        classes.includes("scale-[1.08]")
      );
    },
    focusKey,
    { timeout },
  );
}

/** Navigate D-pad down N times, returning focused key after each press */
export async function navigateDown(
  page: Page,
  steps: number,
): Promise<string[]> {
  const keys: string[] = [];
  for (let i = 0; i < steps; i++) {
    await dpadDown(page);
    const key = await getFocusedKey(page);
    keys.push(key || "NONE");
  }
  return keys;
}

/** Navigate D-pad right N times, returning focused key after each press */
export async function navigateRight(
  page: Page,
  steps: number,
): Promise<string[]> {
  const keys: string[] = [];
  for (let i = 0; i < steps; i++) {
    await dpadRight(page);
    const key = await getFocusedKey(page);
    keys.push(key || "NONE");
  }
  return keys;
}
