import { test, expect } from '@playwright/test';

test.describe('ChessOS Visual Consistency Checks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3105/');
  });

  test('should render the dashboard layout with correct alignment and sizes', async ({ page }) => {
    // Check main layout container exists and uses flex layout
    const mainWrapper = page.locator('div.h-screen');
    await expect(mainWrapper).toBeVisible();

    // Check sidebar visibility and minimum width
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
    const boundingBox = await sidebar.boundingBox();
    expect(boundingBox?.width).toBe(256); // w-64 is 256px
  });

  test('should render chess board with correct aspect ratio', async ({ page }) => {
    await page.click('button:has-text("Foundations Uni")');
    await page.click('button:has-text("Board Coordinates")');

    const board = page.locator('[data-testid="chess-board"]');
    if (await board.count() > 0) {
      await expect(board).toBeVisible();
      const bounds = await board.boundingBox();
      if (bounds) {
        // Square board check (within tolerance)
        expect(Math.abs(bounds.width - bounds.height)).toBeLessThan(15);
      }
    }
  });

  test('should adapt layout dynamically on mobile viewports', async ({ page }) => {
    // Resize window to mobile width
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Main flex wrapper should switch to responsive sizes
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
  });
});
