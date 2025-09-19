import { test } from '@playwright/test';
import { LoginPage } from './pages/loginPage';
import 'dotenv/config';

test('[T1] Verify login with valid credentials', async ({ page }) => {
  console.log('BASE_URL:', process.env.BASE_URL);
  console.log('USERNAME:', process.env.USERNAME);
  console.log('PASSWORD:', process.env.PASSWORD);

  const login = new LoginPage(page);

  await login.b_navigateTo(process.env.BASE_URL!);
  await login.login(process.env.USERNAME!, process.env.PASSWORD!);
  await login.LinkedinLogo('');
});

