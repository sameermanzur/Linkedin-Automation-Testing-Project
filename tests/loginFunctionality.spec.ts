import { Expect,test } from "playwright/test";
import { LoginPage } from "../pages/loginPage";


test ('[DUM-2] verify login functionality', async ({page}) => {
    const loginPage = new LoginPage(page);

    await page.goto('https://www.linkedin.com/login'); 
    await loginPage.enterUserName(process.env.USERNAME!); 
    await loginPage.enterPassword(process.env.PASSWORD1); 
    
    
}); 