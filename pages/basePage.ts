import{ Page, Locator} from '@playwright/test'; 

export const MAX_TIMEOUT =30_000;

export default class BasePage  {
 
   protected readonly page : Page;
   

    constructor (page : Page){
        this.page = page;
    }

    async b_naviagteTo(url:string){
        await this.page.goto(url);
    }

    async b_waitForElementVisible(locator:Locator, timeout: number= MAX_TIMEOUT){
        await locator.waitFor({state:'visible', timeout}); 
    }

    async b_fillField(element:Locator, text: string, isForceFill?:boolean){
        await this.b_waitForElementVisible(element);
        await element.fill(text, {force: isForceFill?? false});    
    }

  async click(locator: Locator) {
    await this.b_waitForElementVisible(locator);
    await locator.click({ timeout: MAX_TIMEOUT });
  }

  async clearField(locator: Locator) {
    await this.b_waitForElementVisible(locator);
    await locator.fill('');
  }
}
