import{ Page, Locator} from '@playwright/test'; 

export default class BasePage  {

   protected readonly page : Page

    constructor (page : Page){
        this.page = page;
    }

    async b_naviagteTo(url:string){
        await this.page.goto(url);
    }

    async b_fillFild(element:Locator, text: string, isForceFill?:Boolean){
        await this.b_waitForElementVisible(element, maxTimeOut);
        await element.fill(text,{ timeout: maxTimeout, force: isForceFill });
    }

    async b_searchElement(element:Locator){
        await element.click();
    }



    async b_clearSearch(element:Locator){
        await element.clear()
    }

}