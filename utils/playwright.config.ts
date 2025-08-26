import { defineConfig } from '@playwright/test';
import 'dotenv/config';

// Always include basic reporters
const reporters: any[] = [
  ['list'],
  ['html'],
];

// Conditionally include Zephyr reporter if env vars exist
if (process.env.ZEPHYR_PROJECT_KEY && process.env.ZEPHYR_AUTH_TOKEN) {
  reporters.push([
    'playwright-zephyr/lib/src/cloud',
    {
      projectKey: process.env.ZEPHYR_PROJECT_KEY,
      authorizationToken: process.env.ZEPHYR_AUTH_TOKEN,
      autoCreateTestCases: true,
    },
  ]);
} else {
  console.warn(
    '[Zephyr Reporter] Skipped because ZEPHYR_PROJECT_KEY or ZEPHYR_AUTH_TOKEN not set.'
  );
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: reporters,

  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...require('@playwright/test').devices['Desktop Chrome'] },
    },
  ],
});
