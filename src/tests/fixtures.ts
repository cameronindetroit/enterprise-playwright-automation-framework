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
    const pageManager = new PageManager(page);
    const loginPage = pageManager.getLoginPage();

    await loginPage.navigate();
    await loginPage.fillUsername(resolveCredential(process.env.userid));
    await loginPage.fillPassword(resolveCredential(process.env.password));
    await loginPage.clickLoginButton();

    await use(pageManager);
  },
});

export { expect };
