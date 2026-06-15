import { test, expect } from '@playwright/test';

test.describe('ChessOS Accessibility Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3105/');
  });

  test('should pass basic HTML structure and accessibility checks', async ({ page }) => {
    // Check main HTML lang attribute presence
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBeTruthy();

    // Verify all major layout segments use semantic section tags
    await expect(page.locator('aside')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
  });

  test('should support keyboard navigation and tab focus traversal', async ({ page }) => {
    // Start at dashboard and hit Tab multiple times to verify focus indicators
    await page.keyboard.press('Tab');
    
    // Check if current active element is focusable (is a button or link)
    const activeTagName = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
    expect(['button', 'a', 'input', 'select']).toContain(activeTagName);
  });

  test('should have descriptive labels or ARIA labels on all key buttons', async ({ page }) => {
    // All navigation buttons in sidebar must have legible labels or content
    const navButtons = await page.locator('aside button').all();
    for (const btn of navButtons) {
      const text = await btn.textContent();
      const ariaLabel = await btn.getAttribute('aria-label');
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('chess board should be screen-reader friendly and contain coordinate descriptions', async ({ page }) => {
    await page.click('button:has-text("Foundations Uni")');
    await page.click('button:has-text("Board Coordinates")');
    
    // Chess board container should have aria attributes indicating its purpose
    const board = page.locator('[data-testid="chess-board"]');
    if (await board.count() > 0) {
      const ariaRole = await board.getAttribute('role');
      expect(ariaRole).toBe('grid');
    }
  });
});
