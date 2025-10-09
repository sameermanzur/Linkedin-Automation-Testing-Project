import { test } from "./hooks";
import { LoginPage } from "./loginPage";
import { LogoutPage } from "./logoutPage";


test('user is able to login and logout successfully', async ({ page }) => {
  if (!process.env.BASE_URL || !process.env.LINKEDIN_USERNAME || !process.env.LINKEDIN_PASSWORD) {
    throw new Error(" Missing required environment variables (BASE_URL, LINKEDIN_USERNAME, LINKEDIN_PASSWORD)");
  }
  const login = new LoginPage(page);
  const logOut = new LogoutPage(page);

  await login.b_navigateTo(process.env.BASEURL!);
  await login.login(process.env.LINKEDIN_USERNAME!, process.env.LINKEDIN_PASSWORD!);
  await logOut.navigateButton();
  await logOut.clickSignOut();
  await page.close();
})


