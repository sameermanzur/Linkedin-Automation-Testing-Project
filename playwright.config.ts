import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html'],
    ['list'],
    
    ['playwright-zephyr/lib/src/cloud', {
      projectKey: 'LWT',
      authorizationToken: process.env.ZEPHYR_ACCESS_TOKEN,
      autoCreateTestCases: true,
      testCycle: {
        name: 'LinkedIn Testing'
      }
    }],
  ],

  use: {
    trace: 'on-first-retry',
    video: 'on', 
    viewport:{width:2500, height:1250}
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