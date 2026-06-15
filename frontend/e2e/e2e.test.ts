import { test, expect } from '@playwright/test';

test.describe('ChessOS E2E Core Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3105/');
  });

  test('should load the dashboard and check profile stats', async ({ page }) => {
    // Check main dashboard heading and user card elements
    await expect(page.locator('h1')).toContainText('ChessOS');
    await expect(page.getByText('Mastery Skill Tree')).toBeVisible();
    await expect(page.getByText('Puzzle Elo')).toBeVisible();
    await expect(page.getByText('Streak')).toBeVisible();
  });

  test('should navigate to Foundations University and start Coordinates Lab', async ({ page }) => {
    // Navigate via Sidebar
    await page.click('button:has-text("Foundations Uni")');
    await expect(page.getByText('Chess Foundations University')).toBeVisible();

    // Select Coordinate Lab
    await page.click('button:has-text("Board Coordinates")');
    await expect(page.getByText(/Target Square:/i)).toBeVisible();
  });

  test('should load Tactics University and navigate through categories', async ({ page }) => {
    // Navigate via Sidebar
    await page.click('button:has-text("Tactics Labs")');
    await expect(page.getByText('Tactical Solver Labs')).toBeVisible();

    // Verify category selection and category count indicators
    const forksCategory = page.locator('button:has-text("Forks & Double")');
    await expect(forksCategory).toBeVisible();
    await forksCategory.click();
    
    // Check difficulty metadata display
    await expect(page.getByText(/Difficulty:/i)).toBeVisible();
  });

  test('should navigate to Spaced Review and display due cards', async ({ page }) => {
    await page.click('button:has-text("Spaced Review")');
    await expect(page.getByText('Spaced Repetition System (SRS)')).toBeVisible();
    await expect(page.getByText(/Review Queue/i)).toBeVisible();
  });
});
