import { test, expect } from '@playwright/test';

test.describe('Game Detail Pages', () => {
  test('should load game detail page', async ({ page }) => {
    // Navigate to games list first
    await page.goto('/spil');

    // Click on first game card
    const firstGameLink = page.locator('a[href*="/spil/"]').first();
    await firstGameLink.click();

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Should have game title
    await expect(page.locator('h1')).toBeVisible();

    // Should have game description
    await expect(page.locator('p, div').filter({ hasText: /spil/i }).first()).toBeVisible();
  });

  test('should display game information sections', async ({ page }) => {
    await page.goto('/spil');

    const firstGameLink = page.locator('a[href*="/spil/"]').first();
    await firstGameLink.click();

    await page.waitForLoadState('networkidle');

    // Should have rating/age info (one of these should be present)
    const hasRating = await page.locator('text=/★|rating|vurdering/i').count() > 0;
    const hasAgeInfo = await page.locator('text=/år/i').count() > 0;

    expect(hasRating || hasAgeInfo).toBeTruthy();
  });

  test('should have download/play links for digital games', async ({ page }) => {
    await page.goto('/spil');

    const firstGameLink = page.locator('a[href*="/spil/"]').first();
    await firstGameLink.click();

    await page.waitForLoadState('networkidle');

    // Check for app store links (may not be present on all games)
    const hasAppStoreLink = await page.locator('a[href*="apple.com"], a[href*="play.google"]').count() > 0;
    const hasWebLink = await page.locator('a[href^="http"]').count() > 0;

    // At least some external links should exist
    expect(hasAppStoreLink || hasWebLink).toBeTruthy();
  });
});

test.describe('Board Game Pages', () => {
  test('should load board game page', async ({ page }) => {
    await page.goto('/braetspil');

    // Should show board games
    await expect(page.locator('h1, h2')).toContainText(/brætspil/i);

    // Should have game cards
    const hasGames = await page.locator('article, [class*="card"], a[href*="/braetspil/"]').count() > 0;
    expect(hasGames).toBeTruthy();
  });
});
