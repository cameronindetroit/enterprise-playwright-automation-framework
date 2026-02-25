import { test as base, expect } from "@playwright/test";
import { decrypt } from "../utils/CryptojsUtil";
import PageManager from "../pages/PageManager";

type Fixtures = {
  pageManager: PageManager;
};

function resolveCredential(value?: string) {
  if (!value) {
    return "";
  }

  const decrypted = decrypt(value);
  return decrypted || value;
}

export const test = base.extend<Fixtures>({
  pageManager: async ({ page }, use) => {
    const UI_TIMEOUT = 19000;
    const pageManager = new PageManager(page);
    const loginPage = pageManager.getLoginPage();

    await loginPage.navigate();
    await loginPage.fillUsername(resolveCredential(process.env.userid));
    await loginPage.fillPassword(resolveCredential(process.env.password));
    await loginPage.clickLoginButton();

    await expect(pageManager.getHomePage().getEventTab()).toBeVisible({ timeout: UI_TIMEOUT });

    await use(pageManager);
  },
});

export { expect };
