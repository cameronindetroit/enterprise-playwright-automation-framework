import { Page } from "@playwright/test";
import HomePage from "./HomePage";

export default class LoginPage {
private readonly usernameInputSelector = "[placeholder='Email']"
private readonly passwordInputSelector = "[placeholder='Password']"
private readonly loginButtonSelector = "text=Sign In"
private readonly loginPageUrl = "https://www.ourecosystem.io/honeycombicp"

constructor(private page: Page) {

}

async navigate() {
    const maxAttempts = 3;
    let lastError: unknown = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            await this.page.goto(this.loginPageUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
            return;
        } catch (error) {
            lastError = error;
            const isLastAttempt = attempt === maxAttempts;

            if (isLastAttempt) {
                console.error(`Error navigating to login page after ${maxAttempts} attempts: ${error}`);
                throw error;
            }

            await this.page.waitForTimeout(1000 * attempt);
        }
    }

    throw lastError;

}

async waitForLoginForm(timeout = 20000) {
    await this.page.locator(this.usernameInputSelector).waitFor({ state: "visible", timeout });
    await this.page.locator(this.passwordInputSelector).waitFor({ state: "visible", timeout });
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

async isLoginInProgress(timeout = 2000) {
    return this.page
        .getByRole("progressbar")
        .first()
        .isVisible({ timeout })
        .catch(() => false);
}

}