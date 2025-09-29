import { Page, Locator, expect } from '@playwright/test';
import BasePage from './basePage';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator("//*[@aria-label='Email or phone']");
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('[type="submit"]');
  }

  async enterUserName(username: string) {
    await this.b_fillField(this.usernameInput, username);
  }

  async enterPassword(password: string) {
    await this.b_fillField(this.passwordInput, password);
  }

  async clickLoginButton() {
    await this.b_clickElement(this.loginButton);
  }


  // Combined login method
  async login(username: string, password: string) {
    await this.enterUserName(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }
  }; 

