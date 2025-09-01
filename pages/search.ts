import { Page, Locator } from '@playwright/test';
import BasePage from './basePage';
import { LoginPage } from './loginPage';

export class SearchPage extends BasePage {
  private readonly searchBox: Locator;

  constructor(page:Page){
    super(page)
    this.searchBox = page.locator('[aria-label="Search"]'); 
  }

    async clickSearch() {
    await this.b_clickElement(this.searchBox);
}

// I want to search using names from the spread sheet. 




}; 
