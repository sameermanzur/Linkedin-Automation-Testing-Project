import { expect, test } from './pages/hooks'; 
import { LoginPage } from './pages/loginPage';
import { LinkedInSearchPage } from './pages/linkedInSearchPage';
import { getRecruiterNames } from './pages/readRecruiterNames';
import ComposeMessagePage from './pages/composeMessage';
import { LogoutPage } from './pages/logoutPage';
import { sendReportEmail } from './pages/logAndReport';


test.only('[T2] Verify user sends message (end-to-end) flow', async ({ page, browser }) => {

  // Verify env Variables are getting loaded 
  if (!process.env.BASE_URL || !process.env.LINKEDIN_USERNAME || !process.env.LINKEDIN_PASSWORD) {
    throw new Error(" Missing required environment variables (BASE_URL, LINKEDIN_USERNAME, LINKEDIN_PASSWORD)");
  }
  const login = new LoginPage(page);
  const searchRecruiter = new LinkedInSearchPage(page);
  const composeMessage = new ComposeMessagePage(page);
  const logOut = new LogoutPage(page);

  // login Flow 
  await login.b_navigateTo(process.env.BASE_URL!);
  await login.login(process.env.LINKEDIN_USERNAME!, process.env.LINKEDIN_PASSWORD!);

  // // Read recruiter names from Excel and search each
  const names = await getRecruiterNames('data/recruiterList.xlsx');
  for (const name of names) {
    await searchRecruiter.searchForRecruiterNames(name);
    await composeMessage.clickMessage();
    await composeMessage.fillMessageFromRow({ Name: name });
    await composeMessage.sendMessage();
    await composeMessage.closeMessage();

  //   // Return to feed for next iteration
    await searchRecruiter.gotoFeed();
  }
  // Logout when the task is completed 
  await logOut.navigateButton();
  await logOut.clickSignOut();
  await page.close();

  // email logs and report 
  await sendReportEmail();
});

