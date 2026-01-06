import { Page } from "@playwright/test";
import HomePage from "./HomePage";

export default class LoginPage {
private readonly usernameInputSelector = "#username"
private readonly passwordInputSelector = "#password"
private readonly loginButtonSelector = "#Login"

constructor(private page: Page) {

}

async navigate() {
    await this.page.goto("https://orgfarm-1d42c03bde-dev-ed.develop.my.salesforce.com");

}
async fillUsername(username: string) {
    await this.page.fill(this.usernameInputSelector, username); 

}

async fillPassword(password: string) {
    await this.page.fill(this.passwordInputSelector, password); 
}   

async clickLoginButton() {
    await this.page
    .click(this.loginButtonSelector)
        .catch((error) => {
            console.error(`Error clicking login button:, ${error}`);
            throw error; // rethrow the error if needed
        });

    const homePage = new HomePage(this.page);
    return homePage;
}

}