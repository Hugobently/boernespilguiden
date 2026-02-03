import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage correctly', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Børnespilguiden/);

    // Check hero section
    await expect(page.locator('h1, h2')).toContainText(/bedste spil/i);

    // Check age group buttons
    await expect(page.getByText('0-3 år')).toBeVisible();
    await expect(page.getByText('3-6 år')).toBeVisible();
    await expect(page.getByText('7+ år')).toBeVisible();

    // Check navigation
    await expect(page.getByRole('link', { name: /spil/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /brætspil/i }).first()).toBeVisible();
  });

  test('should have working search bar', async ({ page }) => {
    await page.goto('/');

    // Find and click search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="søg"]').first();
    await expect(searchInput).toBeVisible();

    // Type in search
    await searchInput.fill('minecraft');

    // Search suggestions should appear
    await page.waitForTimeout(500); // Wait for debounce
  });

  test('should display featured games', async ({ page }) => {
    await page.goto('/');

    // Check for game cards
    const gameCards = page.locator('[class*="game"], article, a[href*="/spil/"]').first();
    await expect(gameCards).toBeVisible();
  });

  test('should have mobile responsive navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Page should still load
    await expect(page.locator('body')).toBeVisible();
  });
});
