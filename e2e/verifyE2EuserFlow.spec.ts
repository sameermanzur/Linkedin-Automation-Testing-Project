// e2e/verifyE2EuserFlow.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { LinkedInSearchPage } from '../pages/linkedInSearchPage';
import { getRecruiterNames } from '../pages/readRecruiterNames';
import ComposeMessagePage from '../pages/composeMessage';
  
import 'dotenv/config';



test('[T6] Verify user flow', async ({ page }) => {
  if (!process.env.BASE_URL || !process.env.APP_USERNAME || !process.env.APP_PASSWORD) {
    throw new Error('Missing BASE_URL, APP_USERNAME, or APP_PASSWORD in .env');
  }

  const login  = new LoginPage(page);
  const searchRecruiter = new LinkedInSearchPage(page); 
  const composeMessage = new ComposeMessagePage(page); 

  await login.b_navigateTo(process.env.BASE_URL!);
  await login.login(process.env.APP_USERNAME!, process.env.APP_PASSWORD!);
  await login.LinkedinLogo('');

  // Read recruiter names from Excel and search each
  const names = await getRecruiterNames('data/recruiterList.xlsx');

  await searchRecruiter.gotoFeed();

  for (const name of names) {
    await searchRecruiter.searchForRecruiterNames(name);
    await searchRecruiter.openFirstResult();

    await composeMessage.openMessage();
    await composeMessage.fillMessageFromRow({ Name: name });
    await composeMessage.sendMessage();

    // Return to feed for next iteration
    await searchRecruiter.gotoFeed();
  }
  
});
