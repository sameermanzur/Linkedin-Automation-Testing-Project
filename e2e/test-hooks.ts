import { test } from '@playwright/test';

// Capture a full-page screenshot and attach it when a test fails.
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await testInfo.attach('fullpage-on-failure', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
  }
});

