import { Page, Locator } from '@playwright/test';
import BasePage from './basePage';

export class LoginPage extends BasePage {
    
    // locator variable declaration
    private readonly usernameTextBox: Locator
    private readonly passwordTextBox: Locator
    private readonly loginButton: Locator

    // to initialize locators
    constructor(page:Page){
        super(page);

    this.usernameTextBox = page.locator('[id="username"]'); 
    this.passwordTextBox = page.locator('id="password"'); 
    this.loginButton = page.locator('[type="submit"]'); 
    }

    //methods to perform actions on the locators
    async enterUserName(userNameText:string){
        await this.b_fillField(this.usernameTextBox,userNameText); 
    }

    async enterPassword(passwordText:string){
        await this.b_fillField(this.passwordTextBox, passwordText); 
    }

    async clickLogin(loginButton: Locator){
        await this.b_waitForElementVisible(this.loginButton) 
    }
}

