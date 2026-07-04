import BasePage from "./basePage";
import { Page, Locator,expect } from "playwright/test";

/**
 * LogoutPage class handles the user logout process.
 * It extends BasePage to utilize common page interaction methods.
 */
export class LogoutPage extends BasePage {
    /** Locator for the profile navigation button (Me). */
    private readonly navigationButton: Locator;
    /** Locator for the sign-out button. */
    private readonly signOutButton: Locator;

    /**
     * Initializes a new instance of the LogoutPage class.
     * @param page - The Playwright Page object.
     */
    constructor(page: Page) {
        super(page);
        this.navigationButton = page.locator("//span[normalize-space(text())='Me']");
        this.signOutButton = page.locator("//p[normalize-space(text())='Sign out']");
    }

    /**
     * Clicks the profile/navigation button to reveal the logout option.
     * @returns A promise that resolves when the navigation button is clicked.
     */
    async navigateButton() {
        await this.b_clickElement(this.navigationButton);
    }

    /**
     * Clicks the sign-out button to log the user out.
     * @returns A promise that resolves when the sign-out button is clicked.
     */
    async clickSignOut() {
        await this.b_clickElement(this.signOutButton);
    }
}
