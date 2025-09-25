import { Page, Locator, expect } from '@playwright/test';
import BasePage from './basePage';

export class LinkedInSearchPage extends BasePage {
  private readonly searchBox: Locator;
  private readonly resultsListItems: Locator;
  private readonly firstResultLink: Locator;

  constructor(page: Page) {
    super(page);
    this.searchBox = page.locator('input[aria-label="Search"], input[placeholder="Search"]');
    this.resultsListItems = page.locator('main li:has(a[href*="/in/"])');
    this.firstResultLink = this.resultsListItems.first().locator('a[href*="/in/"]');
  }

  async gotoFeed(): Promise<void> {
    await this.page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded' });
    await expect(this.searchBox).toBeVisible({ timeout: 15_000 });
  }

  async searchForRecruiterNames(recruiterName: string): Promise<void> {
    await this.searchBox.click();
    await this.searchBox.fill(recruiterName);
    await this.searchBox.press('Enter');
    await expect(this.resultsListItems.first()).toBeVisible({ timeout: 15_000 });
    await expect(this.firstResultLink).toBeVisible({ timeout: 15_000 });
  }
}
