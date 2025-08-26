import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // HTML + Zephyr reporters together
  reporter: [
    ['html'],
    ['playwright-zephyr/lib/src/cloud', {
      projectKey: 'DUM',
      authorizationToken: process.env.ZEPHYR_AUTH_TOKEN,
      autoCreateTestCases: true,
    }],
  ],

  use: {
    trace: 'on-first-retry',
    // baseURL: process.env.BASE_URL,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
