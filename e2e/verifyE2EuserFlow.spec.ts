// e2e/verifyE2EuserFlow.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { SearchPage } from '../pages/searchPage';
import { loadRecruiterData } from '../pages/recruiterReadPage';
import 'dotenv/config';

test.use({ timezoneId: 'Australia/Sydney' });

test('[T6] Verify user flow', async ({ page }) => {
  if (!process.env.BASE_URL || !process.env.APP_USERNAME || !process.env.APP_PASSWORD) {
    throw new Error('Missing BASE_URL, APP_USERNAME, or APP_PASSWORD in .env');
  }

  const login  = new LoginPage(page);
  const search = new SearchPage(page);

  await login.b_navigateTo(process.env.BASE_URL!);
  await login.login(process.env.APP_USERNAME!, process.env.APP_PASSWORD!);
  await login.LinkedinLogo('');
  await search.clickSearch();

  // single callback – no paths in spec
  const { messages, firstRecruiterName } = await loadRecruiterData();

  expect.soft(messages.length).toBeGreaterThan(0);
  expect.soft(firstRecruiterName).not.toBe('');

  await search.searchFor(firstRecruiterName);
});
