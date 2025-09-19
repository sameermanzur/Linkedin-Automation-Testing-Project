// tests/hooks.ts
import { test as base } from '@playwright/test';

// Extend the base test without replacing Playwright's built-in context management
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
