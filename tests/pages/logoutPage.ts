import BasePage from "./basePage";
import { Page, Locator,expect } from "playwright/test";

export class LogoutPage extends BasePage {
    private readonly navigationButton: Locator;
    private readonly signOutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.navigationButton = page.locator("//span[normalize-space(text())='Me']");
        this.signOutButton = page.locator("//p[normalize-space(text())='Sign out']");
    }

    async navigateButton() {
        await this.b_clickElement(this.navigationButton);
    }

    async clickSignOut() {
        await this.b_clickElement(this.signOutButton);
    }
}


