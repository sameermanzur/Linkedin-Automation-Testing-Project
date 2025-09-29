import { test, expect } from '@playwright/test';
import { LoginPage } from './loginPage'
import { sendReportEmail } from './logAndReport'; 

test.describe('Login Tests', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.b_navigateTo(process.env.BASE_URL!);
  });

  test('T2] Login with Valid credentials', {tag:'@smoke'}, async ({page }) => {
    const login = new LoginPage(page);
    await login.login(process.env.LINKEDIN_USERNAME!, process.env.LINKEDIN_PASSWORD!);
    // land in linkedIn home feed 
    await expect(page).toHaveURL(/.*feed/);
    await sendReportEmail(); 
  });

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



