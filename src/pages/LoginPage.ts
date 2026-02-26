import { Page } from "@playwright/test";
import HomePage from "./HomePage";

export default class LoginPage {
private readonly usernameInputSelector = "[placeholder='Email']"
private readonly passwordInputSelector = "[placeholder='Password']"
private readonly loginButtonSelector = "text=Sign In"

constructor(private page: Page) {

}

async navigate() {
    await this.page.goto("https://www.ourecosystem.io/honeycombicp").catch((error) => {
        console.error(`Error navigating to login page: ${error}`);
        throw error;
    });

}
async fillUsername(username: string) {
    await this.page.fill(this.usernameInputSelector, username).catch((error) => {
        console.error(`Error filling username: ${error}`);
        throw error;
    }); 

}

async fillPassword(password: string) {
    await this.page.fill(this.passwordInputSelector, password).catch((error) => {
        console.error(`Error filling password: ${error}`);
        throw error;
    }); 
}   

async clickLoginButton() {
    await this.page
    .locator(this.loginButtonSelector)
    .first()
    .click({ force: true })
        .catch((error) => {
            console.error(`Error clicking login button:, ${error}`);
            throw error; // rethrow the error if needed
        });

    const homePage = new HomePage(this.page);
    return homePage;
}

async isLoginFormVisible(timeout = 2000) {
    const emailInputVisible = await this.page
        .locator(this.usernameInputSelector)
        .isVisible({ timeout })
        .catch(() => false);

    const passwordInputVisible = await this.page
        .locator(this.passwordInputSelector)
        .isVisible({ timeout })
        .catch(() => false);

    return emailInputVisible && passwordInputVisible;
}

}