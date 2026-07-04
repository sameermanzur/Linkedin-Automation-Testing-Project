import { Page, Locator, expect } from '@playwright/test';
import BasePage from './basePage';

/**
 * LinkedInSearchPage class handles searching for recruiters on LinkedIn.
 * It extends BasePage to provide search functionality and navigation.
 */
export class LinkedInSearchPage extends BasePage {
  /** Locator for the global search box. */
  private readonly searchBox: Locator;
  /** Locator for the list of search results. */
  private readonly resultsListItems: Locator;
  /** Locator for the first link in the search results. */
  private readonly firstResultLink: Locator;

  /**
   * Initializes a new instance of the LinkedInSearchPage class.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page);
    this.searchBox = page.locator('input[aria-label="Search"], input[placeholder="Search"]');
    this.resultsListItems = page.locator('main li:has(a[href*="/in/"])');
    this.firstResultLink = this.resultsListItems.first().locator('a[href*="/in/"]');
  }

  /**
   * Navigates to the LinkedIn feed page where the global search is visible.
   * Waits for the search box to become visible.
   * @returns A promise that resolves when the feed page is loaded and the search box is visible.
   */
  async gotoFeed() {
    await this.page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded' });
    await expect(this.searchBox).toBeVisible({ timeout: 15000 });
  }

  /**
   * Searches for a recruiter by name using the global search box.
   * @param recruiterName - The name of the recruiter to search for.
   * @returns A promise that resolves when the search query is submitted.
   */
  async searchForRecruiterNames(recruiterName: string) {
    await this.searchBox.click();
    await this.searchBox.fill(recruiterName);
    await this.searchBox.press('Enter');
  }
}
