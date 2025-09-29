import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { version } from 'os';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
import globalTearDown from './tests/pages/globalTearDown';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html'],
    ['list'],
    ['allure-playwright'],  
    ['playwright-zephyr/lib/src/cloud', {
      projectKey: 'LWT',
      authorizationToken: process.env.ZEPHYR_AUTH_TOKEN,
      autoCreateTestCases: true,
      testCycle: {
        name: 'Smoke + Happy Path', // update for every run to automate the cycle creation 
        testCaseFolder: 'Smoke', 
        description: 'Covers the end-to-end flow',
        environment: 'Chromium',
        version: 1.0,
        components: 'login, message,search,logout,report'
      }
    }],
  ],

  use: {
    trace: 'on-first-retry',
    video: 'on', 
    viewport:{width:4500, height:3250}
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