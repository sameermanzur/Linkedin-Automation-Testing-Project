import { Page, Locator, expect } from '@playwright/test';
import BasePage from './basePage';

// Calling Recruiter name list from the recruiter data file 


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

// Naviagte to LinkedIn feed where global search is visible 

async gotoFeed() {
  await this.page.goto('https://www.linkedin.com/feed/', {waitUntil: 'domcontentloaded'});
  await expect(this.searchBox).toBeVisible({timeout:15000}); 
}

// Search for recruiter names  
async searchForRecruiterNames(recruiterName: string) { 
    await this.searchBox.click();
    await this.searchBox.fill(recruiterName);
    await this.searchBox.press('Enter'); 
    await this.page.waitForURL(/linkedin\.com\/search\/results/i, { timeout: 30000 });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
    await expect(this.firstResultLink).toBeVisible({ timeout: 60000 });
  }

  async openFirstResult() {
    await expect(this.firstResultLink).toBeVisible({ timeout: 60000 });
    await this.firstResultLink.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

}; 

// 
