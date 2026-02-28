import { expect } from "@playwright/test";
import PageManager from "../../pages/PageManager";
import { decrypt } from "../../utils/CryptojsUtil";

function resolveCredential(value?: string) {
  if (!value) {
    return "";
  }

  const decrypted = decrypt(value);
  return decrypted || value;
}

export async function loginToDashboard(pageManager: PageManager, timeout = 45000) {
  const loginPage = pageManager.getLoginPage();
  const homePage = pageManager.getHomePage();

  await loginPage.navigate();
  await loginPage.waitForLoginForm();
  await loginPage.fillUsername(resolveCredential(process.env.userid));
  await loginPage.fillPassword(resolveCredential(process.env.password));
  await loginPage.clickLoginButton();

  await expect
    .poll(async () => {
      const readinessLocators = [
        homePage.getDashboardReadyIndicator(),
        homePage.getLogoutButton(),
        homePage.getAccountManager(),
        pageManager.getDashboardPage().getEventDropdown(),
      ];

      for (const locator of readinessLocators) {
        if (await locator.isVisible().catch(() => false)) {
          return true;
        }
      }

      return false;
    }, { timeout })
    .toBeTruthy();
}
