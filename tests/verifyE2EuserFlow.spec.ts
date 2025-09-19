import { test, expect} from './hooks';
import { LoginPage } from './pages/loginPage';
import { LinkedInSearchPage } from './pages/linkedInSearchPage';
import { getRecruiterNames } from './pages/readRecruiterNames';
import ComposeMessagePage from './pages/composeMessage';
import { LogoutPage } from './pages/logoutPage';
import 'dotenv/config';

test('[T6] Verify user flow', async ({ page, browser }) => {
 
  const login = new LoginPage(page);
  const searchRecruiter = new LinkedInSearchPage(page);
  const composeMessage = new ComposeMessagePage(page);
  const logOut = new LogoutPage(page);

  await login.b_navigateTo(process.env.BASE_URL!);
  await login.login(process.env.LINKEDIN_USERNAME!, process.env.LINKEDIN_PASSWORD!);
  await login.LinkedinLogo('');

  // Read recruiter names from Excel and search each
  const names = await getRecruiterNames('data/recruiterList.xlsx');

  // await searchRecruiter.gotoFeed();

  for (const name of names) {
    await searchRecruiter.searchForRecruiterNames(name);
    const messageBtn = page.getByRole('button', { name: /^Message\b/i });
    await messageBtn.click();

    await composeMessage.openMessage();
    await page.pause();
    await composeMessage.fillMessageFromRow({ Name: name });
    await composeMessage.sendMessage();
    await composeMessage.closeMessage();
    // Return to feed for next iteration
    await searchRecruiter.gotoFeed();
  }

  await logOut.navigateButton();
  await logOut.clickSignOut();
  const context = await browser.newContext({ recordVideo: { dir: 'videos' } });
  await page.close();
});
