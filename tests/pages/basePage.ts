import { Page, Locator, expect } from '@playwright/test';

/**
 * Default maximum timeout for operations in milliseconds.
 */
export const maxTimeout = 30_000;

/**
 * BasePage class providing common utility methods for page interactions.
 * This class serves as the parent class for all other page objects, offering
 * shared functionality for element interaction, navigation, and validation.
 */
export default class BasePage {
  /**
   * The Playwright Page instance used for interactions.
   */
  protected readonly page: Page;

  /**
   * Initializes a new instance of the BasePage class.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    this.page = page;
  }
 
  /**
   * Navigates to the specified URL.
   * @param url - The URL to navigate to.
   * @param timeout - The maximum time to wait for the navigation in milliseconds. Defaults to maxTimeout.
   * @returns A promise that resolves when the navigation is complete.
   */
  async b_navigateTo(url: string, timeout: number = maxTimeout) {
    await this.page.goto(url, { timeout, waitUntil: 'networkidle' });
  }

  /**
   * Waits for an element to be visible on the page.
   * @param locator - The locator of the element to wait for.
   * @param timeout - The maximum time to wait in milliseconds. Defaults to maxTimeout.
   * @returns A promise that resolves when the element is visible.
   */
  async b_waitForElementVisible(locator: Locator, timeout: number = maxTimeout) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Fills a text field with the specified text.
   * @param element - The locator of the input field.
   * @param text - The text to enter into the field.
   * @param isForceFill - Whether to force fill the input (unused in current implementation but kept for compatibility). Defaults to false.
   * @param timeout - The maximum time to wait for the element to be visible in milliseconds. Defaults to maxTimeout.
   * @returns A promise that resolves when the field is filled.
   */
  async b_fillField(element: Locator, text: string, isForceFill: boolean = false, timeout: number = maxTimeout) {
    await this.b_waitForElementVisible(element, timeout);
    await element.pressSequentially(text, { timeout });
  }

  /**
   * Clicks on an element.
   * @param element - The locator of the element to click.
   * @param timeout - The maximum time to wait for the element to be visible in milliseconds. Defaults to maxTimeout.
   * @returns A promise that resolves when the element is clicked.
   */
  async b_clickElement(element: Locator, timeout: number = maxTimeout) {
    await this.b_waitForElementVisible(element, timeout);
    await element.click({ timeout });
  }

  /**
   * Clears the text content of an input field.
   * @param locator - The locator of the input field to clear.
   * @returns A promise that resolves when the field is cleared.
   */
  async b_clearField(locator: Locator) {
    await this.b_waitForElementVisible(locator);
    await locator.fill('');
  }

  /**
   * Verifies that an element contains specific text.
   * @param locator - The locator of the element to check.
   * @param expected - The expected text content.
   * @returns A promise that resolves if the text is present, otherwise throws an error.
   */
  async b_textvisible(locator: Locator, expected: string) {
    await expect(locator).toHaveText(expected, { timeout: maxTimeout });
  }

  /**
   * Gets the count of elements matching the locator.
   * @param element - The locator of the elements to count.
   * @param maxTimeout - The maximum time to wait for the element to be visible in milliseconds.
   * @returns A promise that resolves to the number of matching elements.
   */
  async b_getElementCount(element: Locator, maxTimeout?: number): Promise<number> {
    await this.b_waitForElementVisible(element, maxTimeout);
    return await element.count();
  }

  /**
   * Waits for the page to reach the 'networkidle' state and adds a small delay.
   * @returns A promise that resolves when the page has loaded.
   */
  async b_waitForPageToLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
  }

  /**
   * Selects an option from a static dropdown by its label.
   * @param element - The locator of the dropdown element.
   * @param dropDownText - The text of the option to select.
   * @returns A promise that resolves when the option is selected.
   */
  async b_selectStaticDropDown(element: Locator, dropDownText: string): Promise<void> {
    await element.selectOption({ label: dropDownText });
  }

  /**
   * Selects an option from a dynamic dropdown.
   * @param dropdownLocator - The locator of the dropdown trigger.
   * @param dropdownValuesLocator - The locator for the list of options.
   * @param dropDownText - The text of the option to select.
   * @returns A promise that resolves when the option is selected.
   */
  async b_selectDynamicDropDown(dropdownLocator: Locator, dropdownValuesLocator: Locator, dropDownText: string): Promise<void> {
    await dropdownLocator.click();
    const optionLocator = dropdownValuesLocator.locator(`text=${dropDownText}`);
    await optionLocator.waitFor({ state: 'visible' });
    await optionLocator.click();
  }

  // async b_clickApply(locator: Locator, expected: string, button:Element){
  //   await this.b_clickApply(); 
  // }
}
