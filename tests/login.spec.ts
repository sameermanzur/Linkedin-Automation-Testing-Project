import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/loginPage'
import { sendReportEmail } from './pages/logAndReport'; 

/**
 * Test Suite: Login Tests
 * Contains tests related to the user login functionality.
 */
test.describe('Login Tests', () => {
  /**
   * Before each test, navigate to the base URL.
   */
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.b_navigateTo(process.env.BASE_URL!);
  });

  /**
   * Test Case [T2]: Login with Valid credentials.
   * Tagged as @smoke.
   *
   * Steps:
   * 1. Perform login with valid username and password.
   * 2. Verify that the URL contains "feed", indicating a successful login.
   * 3. Trigger the email report (Note: This might be better placed in a global teardown).
   */
  test('T2] Login with Valid credentials', {tag:'@smoke'}, async ({page }) => {
    const login = new LoginPage(page);
    await login.login(process.env.LINKEDIN_USERNAME!, process.env.LINKEDIN_PASSWORD!);
    // land in linkedIn home feed 
    await expect(page).toHaveURL(/.*feed/);
    await sendReportEmail(); 
  });

  /**
   * Test Case [T3]: Session persistence after login.
   *
   * Steps:
   * 1. Login with valid credentials.
   * 2. Open a new tab (page) in the same context.
   * 3. Navigate to the base URL in the new tab.
   * 4. Verify that the user is still logged in (URL pattern check).
   * 5. Reload the original page and verify persistence.
   */
  test('[T3] Session persistence after login', async ({ page, context }) => {
    const login = new LoginPage(page);
    await login.login(process.env.LINKEDIN_USERNAME!, process.env.LINKEDIN_PASSWORD!);
    
    // new tab check - using network throttle 
    const newPage = await context.newPage();
    await newPage.goto(process.env.BASE_URL!);
    await expect(newPage).toHaveURL(/.*homepage/);
    await page.reload();
    await expect(newPage).toHaveURL(/.*homepage/); 
  });
});
