import { Expect,test } from "playwright/test";
import { LoginPage } from "../pages/loginPage";


test ('[DUM-2] verify login functionality', async ({page}) => {
    const baseURL= process.env.Base_URL;
    const userName = process.env.USERNAME;
    const passWord = process.env.PASSWORD; 

    const loginPage = new LoginPage(page);
    await page.goto(baseURL!); 
    await page.pause(); 
    await loginPage.enterUserName(userName!); 
    await loginPage.enterPassword(passWord!);    
}); 


