import { defineConfig, devices } from '@playwright/test';

type ReporterTuple = [string, Record<string, unknown>?];
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const reporters: ReporterTuple[] = [
  ['html'],
  ['list'],
  ['./reporters/emailReporter.ts', { dryRun: true }],
];

if (process.env.ZEPHYR_TOKEN) {
  reporters.push([
    'playwright-zephyr/lib/src/cloud',
    {
      projectKey: 'DUM',
      authorizationToken: process.env.ZEPHYR_TOKEN,
    },
  ]);
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: reporters,

  use: {
    trace: 'on-first-retry',
    video: 'on'
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--disable-web-security', '--allow-insecure-localhost'],
        },
      },
    },
  ],
});
