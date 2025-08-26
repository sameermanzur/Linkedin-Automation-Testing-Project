import { Page, Locator } from '@playwright/test';
import BasePage from './basePage';

export class LoginPage extends BasePage {
  private readonly usernameTextBox: Locator;
  private readonly passwordTextBox: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameTextBox = page.locator('#username');
    this.passwordTextBox = page.locator('#password');
    this.loginButton = page.locator('[type="submit"]');
  }

  async enterUserName(userNameText: string) {
    await this.b_fillField(this.usernameTextBox, userNameText);
  }

  async enterPassword(passwordText: string) {
    await this.b_fillField(this.passwordTextBox, passwordText);
  }

  async clickLogin() {
    await this.b_clickElement(this.loginButton);
  }
}

