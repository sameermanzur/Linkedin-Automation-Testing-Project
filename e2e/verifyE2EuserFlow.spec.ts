import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { SearchPage } from '../pages/search'; 
import { buildMessagesFromXlsx } from '../pages/readAndGenerate';


import 'dotenv/config';

test('[T6] Verify user flow', async ({ page }) => {

  if (!process.env.BASE_URL || !process.env.APP_USERNAME || !process.env.APP_PASSWORD) {
    throw new Error('Missing BASE_URL, APP_USERNAME, or APP_PASSWORD in .env file');
  }

  const loginPage = new LoginPage(page);
  const search = new SearchPage(page); 

  await loginPage.b_navigateTo(process.env.BASE_URL);

  await loginPage.login(process.env.APP_USERNAME, process.env.APP_PASSWORD);

  await loginPage.LinkedinLogo('');

  await search.clickSearch(); 

  await buildMessagesFromXlsx('e2e/data/recruiterList.xlsx');

});

