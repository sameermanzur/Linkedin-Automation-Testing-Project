import BasePage from "./basePage";
import { Page, Locator,expect } from "playwright/test";

export class LogoutPage extends BasePage {
    private readonly navigationButton: Locator;
    private readonly signOutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.navigationButton = page.locator('.global-nav__icon.global-nav__icon--small');
        this.signOutButton = page.locator("//a[@class='global-nav__secondary-link mv1']");
    }

    async navigateButton() {
        await this.b_clickElement(this.navigationButton);
    }

    async clickSignOut() {
        await this.b_clickElement(this.signOutButton);
    }
}


