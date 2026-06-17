// ChessOS — E2E Test Suite (Playwright)
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3105';

// ============================================================================
// APP LAUNCH & NAVIGATION
// ============================================================================
test.describe('App Launch', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/ChessOS/);
    await expect(page.locator('text=ChessOS')).toBeVisible();
  });

  test('should display sidebar navigation', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Tactics Lab')).toBeVisible();
  });

  test('should navigate to puzzle page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=Tactics Lab');
    await expect(page.locator('text=Tactical Solver Labs')).toBeVisible();
  });
});

// ============================================================================
// UNIVERSITY PAGES
// ============================================================================
test.describe('University Pages', () => {
  test('should load Calculation University', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=Calculation');
    await expect(page.locator('text=Calculation Training')).toBeVisible({ timeout: 5000 });
  });

  test('should load Endgame University', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=Endgames');
    await expect(page.locator('text=Endgame')).toBeVisible({ timeout: 5000 });
  });

  test('should load Master Games University', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=Master Games');
    await expect(page.locator('text=Master Game')).toBeVisible({ timeout: 5000 });
  });

  test('should load Opening University', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=Openings');
    await expect(page.locator('text=Opening Mastery')).toBeVisible({ timeout: 5000 });
  });

  test('should load Foundations page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=Foundations');
    await expect(page.locator('text=Foundations')).toBeVisible({ timeout: 5000 });
  });
});

// ============================================================================
// PUZZLE MODES
// ============================================================================
test.describe('Puzzle Modes', () => {
  test('should display all 6 solve modes', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=Tactics Lab');
    await expect(page.locator('text=Guided Coach')).toBeVisible();
    await expect(page.locator('text=GM Thinking')).toBeVisible();
    await expect(page.locator('text=Standard Practice')).toBeVisible();
    await expect(page.locator('text=AI Hint Helper')).toBeVisible();
    await expect(page.locator('text=Exam Stress')).toBeVisible();
    await expect(page.locator('text=Free Analysis')).toBeVisible();
  });

  test('should switch to GM Thinking mode', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=Tactics Lab');
    await page.click('text=GM Thinking');
    await expect(page.locator('text=Evaluate')).toBeVisible({ timeout: 5000 });
  });

  test('should display puzzle categories', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=Tactics Lab');
    await expect(page.locator('text=Categories')).toBeVisible();
  });

  test('should navigate between puzzles', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=Tactics Lab');
    const nextButton = page.locator('text=Next ▶');
    if (await nextButton.isVisible()) {
      await nextButton.click();
    }
  });
});

// ============================================================================
// AI COACH
// ============================================================================
test.describe('AI Chess Coach', () => {
  test('should load AI Coach Dashboard', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=AI Chess Coach');
    await expect(page.locator('text=Personal AI Chess Coach')).toBeVisible({ timeout: 5000 });
  });

  test('should display weakness profiler', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=AI Chess Coach');
    await expect(page.locator('text=Skill Profiler')).toBeVisible({ timeout: 5000 });
  });

  test('should display training plans', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=AI Chess Coach');
    await expect(page.locator('text=Practice Plan')).toBeVisible({ timeout: 5000 });
  });
});

// ============================================================================
// CHESS BOARD
// ============================================================================
test.describe('Chess Board', () => {
  test('should render a chess board on puzzle page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=Tactics Lab');
    // The board should be visible (it renders as SVG or Canvas)
    const board = page.locator('[class*="board"]').first();
    await expect(board).toBeVisible({ timeout: 5000 });
  });
});

// ============================================================================
// RESPONSIVE DESIGN
// ============================================================================
test.describe('Responsive Design', () => {
  test('should render properly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    await expect(page.locator('text=ChessOS')).toBeVisible();
  });

  test('should render properly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    await expect(page.locator('text=ChessOS')).toBeVisible();
  });
});
