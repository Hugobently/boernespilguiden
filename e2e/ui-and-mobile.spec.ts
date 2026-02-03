import { test, expect } from '@playwright/test';

test.describe('UI and Mobile Responsiveness', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Homepage should load
    await expect(page.locator('body')).toBeVisible();

    // Navigation should be accessible (may be in hamburger menu)
    const hasNavigation = await page.locator('nav, header, [class*="menu"]').count() > 0;
    expect(hasNavigation).toBeTruthy();

    // Age buttons should be visible or accessible
    const hasAgeButtons = await page.locator('text=/0-3|3-6|7\\+/').count() > 0;
    expect(hasAgeButtons).toBeTruthy();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();

    // Should have main content
    const hasContent = await page.locator('main, article, [class*="content"]').count() > 0;
    expect(hasContent).toBeTruthy();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();

    // Should have navigation visible
    const navigation = page.locator('nav, header').first();
    await expect(navigation).toBeVisible();
  });
});

test.describe('Cookie Consent', () => {
  test('should handle cookie consent if present', async ({ page }) => {
    await page.goto('/');

    // Check if cookie banner appears
    const cookieBanner = page.locator('text=/cookie|samtykke/i').first();
    const isCookieBannerVisible = await cookieBanner.isVisible().catch(() => false);

    if (isCookieBannerVisible) {
      // Try to accept cookies
      const acceptButton = page.locator('button:has-text("Accepter"), button:has-text("OK")').first();
      if (await acceptButton.isVisible().catch(() => false)) {
        await acceptButton.click();
      }
    }

    // Page should still be functional regardless
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Streaming Section', () => {
  test('should load TV & Film section', async ({ page }) => {
    await page.goto('/');

    // Click on TV & Film link if it exists
    const tvLink = page.getByRole('link', { name: /tv|film/i }).first();
    const hasTvLink = await tvLink.isVisible().catch(() => false);

    if (hasTvLink) {
      await tvLink.click();
      await page.waitForLoadState('networkidle');

      // Should show content
      await expect(page.locator('h1, h2')).toBeVisible();
    }
  });
});
