import { test as base } from '@playwright/test';

/**
 * Extends the base Playwright test to include custom context initialization.
 *
 * This extension ensures a clean state for each test by:
 * 1. Clearing all cookies in the browser context.
 * 2. Adding an initialization script to clear `localStorage` and `sessionStorage` before the page loads.
 *
 * It preserves Playwright's built-in context management while adding these cleanup steps.
 */
const test = base.extend({
  context: async ({ context }, use) => {
    await context.clearCookies();
    context.addInitScript(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await use(context);
  },
});

export { test };
export { expect } from '@playwright/test';
