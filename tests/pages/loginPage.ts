import { Page, Locator, expect } from '@playwright/test';
import BasePage from './basePage';

/**
 * LoginPage class handles the interaction with the login page of the application.
 * It extends the BasePage to leverage common page utilities.
 */
export class LoginPage extends BasePage {
  /** Locator for the username input field. */
  private readonly usernameInput: Locator;
  /** Locator for the password input field. */
  private readonly passwordInput: Locator;
  /** Locator for the login button. */
  private readonly loginButton: Locator;

  /**
   * Initializes a new instance of the LoginPage class.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator("//*[@aria-label='Email or phone']");
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('[type="submit"]');
  }

  /**
   * Enters the username into the username input field.
   * @param username - The username/email to enter.
   * @returns A promise that resolves when the username is entered.
   */
  async enterUserName(username: string) {
    await this.b_fillField(this.usernameInput, username);
  }

  /**
   * Enters the password into the password input field.
   * @param password - The password to enter.
   * @returns A promise that resolves when the password is entered.
   */
  async enterPassword(password: string) {
    await this.b_fillField(this.passwordInput, password);
  }

  /**
   * Clicks the login button to submit the credentials.
   * @returns A promise that resolves when the button is clicked.
   */
  async clickLoginButton() {
    await this.b_clickElement(this.loginButton);
  }

  /**
   * Performs the full login workflow: entering username, password, and clicking login.
   * @param username - The username/email to use for login.
   * @param password - The password to use for login.
   * @returns A promise that resolves when the login process is initiated.
   */
  async login(username: string, password: string) {
    await this.enterUserName(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }
}
