import { Page, Locator } from '@playwright/test'; 

export const maxTimeout = 30_000;

export default class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async b_navigateTo(url: string, timeout: number = maxTimeout) {
        await this.page.goto(url, { timeout: timeout, waitUntil: 'networkidle' });
    }

    async b_waitForElementVisible(locator: Locator, timeout: number = maxTimeout) {
        await locator.waitFor({ state: 'visible', timeout: timeout });
    }

    async b_fillField(element: Locator, text: string, isForceFill?: boolean) {
        await this.b_waitForElementVisible(element);
        await element.fill(text, { force: isForceFill ?? false });
    }

    async b_clickElement(element: Locator) {
        await this.b_waitForElementVisible(element, maxTimeout);
        await element.click({ force: true });
    }

    async b_clearField(locator: Locator) {
        await this.b_waitForElementVisible(locator);
        await locator.fill('');
    }
}


