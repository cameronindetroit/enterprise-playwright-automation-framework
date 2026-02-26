import { test as base, expect } from "@playwright/test";
import { decrypt } from "../../../utils/CryptojsUtil";
import PageManager from "../../../pages/PageManager";

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

async function loginToDashboard(pageManager: PageManager) {
  const loginPage = pageManager.getLoginPage();
  const dashboardReadyIndicator = pageManager.getHomePage().getDashboardReadyIndicator();

  await loginPage.navigate();
  await loginPage.waitForLoginForm();
  await loginPage.fillUsername(resolveCredential(process.env.userid));
  await loginPage.fillPassword(resolveCredential(process.env.password));
  await loginPage.clickLoginButton();

  await expect(dashboardReadyIndicator).toBeVisible({ timeout: 45000 });
}

export const test = base.extend<Fixtures>({
  pageManager: async ({ page }, use) => {
    const pageManager = new PageManager(page);
    await loginToDashboard(pageManager);
    await use(pageManager);
  },
});

export { expect };
