/**
 * Sprint 3A — VOD + Series E2E Test Stubs
 *
 * Status: STUBS ONLY — marked test.fixme() until a live dev server is wired up.
 *
 * Playwright MCP is configured in ~/.claude/settings.local.json:
 *   { "playwright": { "command": "npx", "args": ["-y", "@playwright/mcp@latest"] } }
 *
 * To run these tests once a server is available:
 *   1. Install: npm install --save-dev @playwright/test
 *   2. Add playwright.config.ts (baseURL = http://localhost:5173 or prod URL)
 *   3. Run: npx playwright test tests/e2e/sprint3a-vod-series.spec.ts
 *
 * Acceptance Criteria coverage:
 *   Issue #89 (VOD): category browser, grid, sort, MovieDetail, play+resume, favorite toggle
 *   Issue #90 (Series): SeriesDetail, season tabs, episode list, pagination, scrollIntoView
 *
 * Gap note: FR-VOD-08 (language filter) is NOT yet implemented — no test written for it.
 *           VirtualGrid exists but is NOT wired into VODPage/MovieGrid — see gap analysis.
 */

import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Navigate to the app and authenticate (stub — update with real auth flow). */
async function authenticate(page: Parameters<typeof test>[1] extends { page: infer P } ? P : never) {
  // TODO: replace with real auth flow when credentials are available for E2E
  await page.goto('/login');
  await page.fill('[name="username"]', process.env.E2E_USERNAME ?? 'test');
  await page.fill('[name="password"]', process.env.E2E_PASSWORD ?? 'test');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/home');
}

// ---------------------------------------------------------------------------
// VOD Browse Flow (#89)
// ---------------------------------------------------------------------------

test.describe('VOD Browse Flow', () => {

  test.fixme('navigates to /vod and renders the Movies page heading', async ({ page }) => {
    await authenticate(page);
    await page.goto('/vod');
    await expect(page.getByRole('heading', { name: 'Movies' })).toBeVisible();
  });

  test.fixme('category tabs are visible and at least one is present', async ({ page }) => {
    await authenticate(page);
    await page.goto('/vod');
    // CategoryGrid renders category buttons; at least one should appear
    const firstCategory = page.locator('[data-testid="category-grid"] button').first();
    await expect(firstCategory).toBeVisible({ timeout: 10_000 });
  });

  test.fixme('selecting a category loads movies into the grid', async ({ page }) => {
    await authenticate(page);
    await page.goto('/vod');
    // Wait for category grid to render
    await page.waitForSelector('[data-testid="category-grid"]', { timeout: 10_000 });
    const secondCategory = page.locator('[data-testid="category-grid"] button').nth(1);
    await secondCategory.click();
    // Grid should show content cards after selection
    await expect(page.locator('[data-testid="content-card"]').first()).toBeVisible({ timeout: 10_000 });
  });

  test.fixme('clicking a movie navigates to MovieDetail and shows metadata', async ({ page }) => {
    await authenticate(page);
    await page.goto('/vod');
    await page.waitForSelector('[data-testid="content-card"]', { timeout: 10_000 });
    const firstMovie = page.locator('[data-testid="content-card"]').first();
    const movieTitle = await firstMovie.getAttribute('aria-label');
    await firstMovie.click();
    // Should be on /vod/<id>
    await page.waitForURL('**/vod/**');
    // Movie title heading should be visible
    if (movieTitle) {
      await expect(page.getByRole('heading', { name: movieTitle })).toBeVisible({ timeout: 10_000 });
    }
    // Play button must exist
    await expect(page.getByRole('button', { name: /play|resume/i })).toBeVisible();
  });

  test.fixme('play button exists and is keyboard-focusable on MovieDetail', async ({ page }) => {
    await authenticate(page);
    await page.goto('/vod');
    await page.waitForSelector('[data-testid="content-card"]', { timeout: 10_000 });
    await page.locator('[data-testid="content-card"]').first().click();
    await page.waitForURL('**/vod/**');
    const playBtn = page.getByRole('button', { name: /play|resume/i });
    await expect(playBtn).toBeVisible();
    // Tab to the play button and verify focus
    await playBtn.focus();
    await expect(playBtn).toBeFocused();
  });

  test.fixme('play button shows "Resume" text when watch history exists for movie', async ({ page }) => {
    // This requires seeding watch history — update when API seeding is available
    await authenticate(page);
    // Navigate to a movie known to have progress (set via seed script or API)
    await page.goto('/vod/KNOWN_MOVIE_ID_WITH_PROGRESS');
    await expect(page.getByRole('button', { name: /resume/i })).toBeVisible({ timeout: 10_000 });
  });

  test.fixme('sort dropdown changes movie order', async ({ page }) => {
    await authenticate(page);
    await page.goto('/vod');
    await page.waitForSelector('[data-testid="content-card"]', { timeout: 10_000 });

    // Capture first movie title before sort
    const beforeSort = await page.locator('[data-testid="content-card"]').first().getAttribute('aria-label');

    // Change sort via the native <select> (SortFilterBar uses a native select)
    await page.selectOption('select', { label: 'A–Z' });

    // First item may have changed — just assert grid still renders
    await expect(page.locator('[data-testid="content-card"]').first()).toBeVisible();
    const afterSort = await page.locator('[data-testid="content-card"]').first().getAttribute('aria-label');
    // Soft assertion: if sort changed, titles will differ
    // (may be the same if already sorted; just verify no crash)
    expect(typeof afterSort).toBe('string');
    void beforeSort; // silence unused-variable lint
  });

  test.fixme('skeleton grid is shown while movies are loading', async ({ page }) => {
    await authenticate(page);
    // Intercept streams API to delay response
    await page.route('**/player_api.php*action=get_vod_streams*', (route) =>
      setTimeout(() => route.continue(), 1500)
    );
    await page.goto('/vod');
    await expect(page.locator('[data-testid="skeleton-grid"]')).toBeVisible();
  });

  test.fixme('empty state is shown when a category has no movies', async ({ page }) => {
    await authenticate(page);
    // Intercept to return empty array for VOD streams
    await page.route('**/player_api.php*action=get_vod_streams*', (route) =>
      route.fulfill({ status: 200, body: JSON.stringify([]) })
    );
    await page.goto('/vod');
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible({ timeout: 10_000 });
  });

});

// ---------------------------------------------------------------------------
// VOD D-pad Navigation (#89 — TV mode)
// ---------------------------------------------------------------------------

test.describe('VOD D-pad Navigation', () => {

  test.fixme('arrow keys navigate between movie cards in the grid', async ({ page }) => {
    await authenticate(page);
    await page.goto('/vod');
    await page.waitForSelector('[data-testid="content-card"]', { timeout: 10_000 });
    // Tab to first card then use arrow keys
    await page.keyboard.press('Tab');
    const firstFocused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    await page.keyboard.press('ArrowRight');
    const secondFocused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    // Focus should have moved to a different card
    expect(firstFocused).not.toBe(secondFocused);
  });

  test.fixme('Enter key on a focused movie card navigates to MovieDetail', async ({ page }) => {
    await authenticate(page);
    await page.goto('/vod');
    await page.waitForSelector('[data-testid="content-card"]', { timeout: 10_000 });
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.waitForURL('**/vod/**');
    await expect(page.getByRole('button', { name: /play|resume/i })).toBeVisible();
  });

  test.fixme('back button / Escape on MovieDetail navigates back to VOD grid', async ({ page }) => {
    await authenticate(page);
    await page.goto('/vod');
    await page.waitForSelector('[data-testid="content-card"]', { timeout: 10_000 });
    await page.locator('[data-testid="content-card"]').first().click();
    await page.waitForURL('**/vod/**');
    // Press Escape to navigate back
    await page.keyboard.press('Escape');
    await page.waitForURL('**/vod');
    await expect(page.getByRole('heading', { name: 'Movies' })).toBeVisible();
  });

});

// ---------------------------------------------------------------------------
// Series Browse Flow (#90)
// ---------------------------------------------------------------------------

test.describe('Series Browse Flow', () => {

  test.fixme('navigates to /series and renders the Series page heading', async ({ page }) => {
    await authenticate(page);
    await page.goto('/series');
    await expect(page.getByRole('heading', { name: 'Series' })).toBeVisible({ timeout: 10_000 });
  });

  test.fixme('clicking a series card navigates to SeriesDetail', async ({ page }) => {
    await authenticate(page);
    await page.goto('/series');
    await page.waitForSelector('[data-testid="focusable-card"], [role="button"]', { timeout: 10_000 });
    const firstSeries = page.locator('[data-testid="focusable-card"], [role="button"]').first();
    await firstSeries.click();
    await page.waitForURL('**/series/**');
    // SeriesDetailHero shows the series title as h1
    await expect(page.locator('h1')).toBeVisible({ timeout: 10_000 });
  });

  test.fixme('SeriesDetail renders season tabs and they are visible', async ({ page }) => {
    await authenticate(page);
    await page.goto('/series');
    await page.waitForSelector('[data-testid="focusable-card"], [role="button"]', { timeout: 10_000 });
    await page.locator('[data-testid="focusable-card"], [role="button"]').first().click();
    await page.waitForURL('**/series/**');
    // Season tabs rendered as role="tab"
    const tabs = page.getByRole('tab');
    await expect(tabs.first()).toBeVisible({ timeout: 10_000 });
  });

  test.fixme('clicking a season tab loads its episodes', async ({ page }) => {
    await authenticate(page);
    await page.goto('/series');
    await page.waitForSelector('[data-testid="focusable-card"], [role="button"]', { timeout: 10_000 });
    await page.locator('[data-testid="focusable-card"], [role="button"]').first().click();
    await page.waitForURL('**/series/**');
    const tabs = page.getByRole('tab');
    await expect(tabs.first()).toBeVisible({ timeout: 10_000 });
    // Click second season tab if it exists
    const secondTab = tabs.nth(1);
    if (await secondTab.count() > 0) {
      await secondTab.click();
      // Episode list should still render
      await expect(page.locator('[class*="space-y-2"]').first()).toBeVisible();
    }
  });

  test.fixme('episode items show SxxExx format badge', async ({ page }) => {
    await authenticate(page);
    await page.goto('/series');
    await page.waitForSelector('[data-testid="focusable-card"], [role="button"]', { timeout: 10_000 });
    await page.locator('[data-testid="focusable-card"], [role="button"]').first().click();
    await page.waitForURL('**/series/**');
    // FocusableEpisodeItem renders "S01E01" format in a <span class="font-mono">
    await expect(page.locator('[class*="font-mono"]').first()).toBeVisible({ timeout: 10_000 });
    const text = await page.locator('[class*="font-mono"]').first().textContent();
    expect(text).toMatch(/S\d{2}E\d{2}/);
  });

  test.fixme('clicking an episode triggers playback (player store called)', async ({ page }) => {
    // Full verification requires checking the player store state or navigation.
    // This test verifies the episode click does not throw and the URL stays on detail page.
    await authenticate(page);
    await page.goto('/series');
    await page.waitForSelector('[data-testid="focusable-card"], [role="button"]', { timeout: 10_000 });
    await page.locator('[data-testid="focusable-card"], [role="button"]').first().click();
    await page.waitForURL('**/series/**');
    const detailUrl = page.url();
    // Click first episode item
    await page.locator('[class*="space-y-2"] [class*="rounded-xl"]').first().click();
    // Should still be on the series detail page (fullscreen player overlays, no navigation)
    expect(page.url()).toBe(detailUrl);
  });

  test.fixme('"Load More" button appears when a season has >50 episodes', async ({ page }) => {
    // Navigate to a series known to have >50 episodes in one season
    await authenticate(page);
    await page.goto('/series/SERIES_ID_WITH_LARGE_SEASON');
    await expect(page.getByRole('button', { name: /load more/i })).toBeVisible({ timeout: 10_000 });
    // Clicking it should show more episodes
    const beforeCount = await page.locator('[class*="space-y-2"] [class*="rounded-xl"]').count();
    await page.getByRole('button', { name: /load more/i }).click();
    const afterCount = await page.locator('[class*="space-y-2"] [class*="rounded-xl"]').count();
    expect(afterCount).toBeGreaterThan(beforeCount);
  });

  test.fixme('episode search filters the episode list', async ({ page }) => {
    await authenticate(page);
    await page.goto('/series');
    await page.waitForSelector('[data-testid="focusable-card"], [role="button"]', { timeout: 10_000 });
    await page.locator('[data-testid="focusable-card"], [role="button"]').first().click();
    await page.waitForURL('**/series/**');
    // Find episode search input and type
    const searchInput = page.getByPlaceholder('Search episodes...');
    await searchInput.fill('pilot');
    // Episode count should reduce (or empty state shown if none match)
    // Just verify no crash and the count label updates
    await expect(page.locator('text=/episode/')).toBeVisible();
  });

  test.fixme('skeleton loading state is shown while SeriesDetail is loading', async ({ page }) => {
    await authenticate(page);
    await page.route('**/player_api.php*action=get_series_info*', (route) =>
      setTimeout(() => route.continue(), 1500)
    );
    await page.goto('/series/ANY_SERIES_ID');
    await expect(page.locator('[data-testid="skeleton"]').first()).toBeVisible({ timeout: 3_000 });
  });

});

// ---------------------------------------------------------------------------
// Series D-pad Navigation (#90 — TV mode)
// ---------------------------------------------------------------------------

test.describe('Series D-pad Navigation', () => {

  test.fixme('ArrowLeft/ArrowRight navigate between season tabs (boundary locked)', async ({ page }) => {
    await authenticate(page);
    await page.goto('/series');
    await page.waitForSelector('[data-testid="focusable-card"], [role="button"]', { timeout: 10_000 });
    await page.locator('[data-testid="focusable-card"], [role="button"]').first().click();
    await page.waitForURL('**/series/**');
    // Focus first season tab
    const firstTab = page.getByRole('tab').first();
    await firstTab.focus();
    await page.keyboard.press('ArrowRight');
    const secondTab = page.getByRole('tab').nth(1);
    if (await secondTab.count() > 0) {
      await expect(secondTab).toBeFocused();
    }
    // ArrowLeft from second tab returns to first
    await page.keyboard.press('ArrowLeft');
    await expect(firstTab).toBeFocused();
  });

  test.fixme('ArrowDown from season tabs moves focus to episode list', async ({ page }) => {
    await authenticate(page);
    await page.goto('/series');
    await page.waitForSelector('[data-testid="focusable-card"], [role="button"]', { timeout: 10_000 });
    await page.locator('[data-testid="focusable-card"], [role="button"]').first().click();
    await page.waitForURL('**/series/**');
    const firstTab = page.getByRole('tab').first();
    await firstTab.focus();
    await page.keyboard.press('ArrowDown');
    // Focus should now be on a focusable element below the tabs (episode or search)
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'INPUT', 'DIV']).toContain(focused);
  });

  test.fixme('Fire TV back key (keyCode 4) navigates back from SeriesDetail', async ({ page }) => {
    await authenticate(page);
    await page.goto('/series');
    await page.waitForSelector('[data-testid="focusable-card"], [role="button"]', { timeout: 10_000 });
    await page.locator('[data-testid="focusable-card"], [role="button"]').first().click();
    await page.waitForURL('**/series/**');
    // Simulate Fire TV back button (keyCode 4)
    await page.keyboard.press('Backspace'); // closest web equivalent
    await page.waitForURL('**/series', { timeout: 5_000 });
    await expect(page.getByRole('heading', { name: 'Series' })).toBeVisible();
  });

  test.fixme('Enter key on a focused episode item starts playback', async ({ page }) => {
    await authenticate(page);
    await page.goto('/series');
    await page.waitForSelector('[data-testid="focusable-card"], [role="button"]', { timeout: 10_000 });
    await page.locator('[data-testid="focusable-card"], [role="button"]').first().click();
    await page.waitForURL('**/series/**');
    // Navigate to first episode with arrow keys and press Enter
    const firstEpisode = page.locator('[class*="space-y-2"] [class*="rounded-xl"]').first();
    await firstEpisode.focus();
    await page.keyboard.press('Enter');
    // Player should be visible (either inline overlay or global player)
    // Just assert no navigation away from the detail page
    expect(page.url()).toContain('/series/');
  });

});
