import { Page, Locator, expect } from '@playwright/test';

export const maxTimeout = 30_000;

export default class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async b_navigateTo(url: string, timeout: number = maxTimeout) {
    await this.page.goto(url, { timeout, waitUntil: 'networkidle' });
  }

  async b_waitForElementVisible(locator: Locator, timeout: number = maxTimeout) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async b_fillField(element: Locator, text: string, isForceFill: boolean = false, timeout: number = maxTimeout) {
    await this.b_waitForElementVisible(element, timeout);
    await element.fill(''); 
    await element.fill(text, { force: isForceFill, timeout });
  }

  async b_clickElement(element: Locator, timeout: number = maxTimeout) {
    await this.b_waitForElementVisible(element, timeout);
    await element.click({ timeout });
  }

  async b_clearField(locator: Locator) {
    await this.b_waitForElementVisible(locator);
    await locator.fill('');
  }

  async b_textvisible(locator: Locator, expected: string) {
    await expect(locator).toHaveText(expected, { timeout: maxTimeout });
  }

    async b_getElementCount(element: Locator, maxTimeout?: number): Promise<number> {
    await this.b_waitForElementVisible(element, maxTimeout);
    return await element.count();
  }

  async b_waitForPageToLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
  }

  async b_selectStaticDropDown(element: Locator, dropDownText: string): Promise<void> {
    await element.selectOption({ label: dropDownText });
  }

  async b_selectDynamicDropDown(dropdownLocator: Locator, dropdownValuesLocator: Locator, dropDownText: string): Promise<void> {
    await dropdownLocator.click();
    const optionLocator = dropdownValuesLocator.locator(`text=${dropDownText}`);
    await optionLocator.waitFor({ state: 'visible' });
    await optionLocator.click();
  }
}
