// tests/hooks.ts
import { test as base } from '@playwright/test';

// Extend the base test to add hooks
const test = base.extend({
  context: async ({ browser }, use) => {
    // Create a brand-new browser context before each test
    const context = await browser.newContext();

    // Cleanup cookies, storage before running test
    await context.clearCookies();
    for (const page of context.pages()) {
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    }

    // Pass context to the test
    await use(context);

    // Close context after each test → clears cache automatically
    await context.close();
  },
});
export { test };
export { expect } from '@playwright/test';
