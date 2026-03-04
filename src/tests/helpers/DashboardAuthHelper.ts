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
  const dashboardPage = pageManager.getDashboardPage();

  await loginPage.navigate();
  await loginPage.waitForLoginForm();
  await loginPage.fillUsername(resolveCredential(process.env.userid));
  await loginPage.fillPassword(resolveCredential(process.env.password));
  await loginPage.clickLoginButton();

  const readinessLocators = [
    { name: "dashboardTitle", locator: homePage.getDashboardReadyIndicator() },
    { name: "logoutButton", locator: homePage.getLogoutButton() },
    { name: "accountManager", locator: homePage.getAccountManager() },
    { name: "eventDropdown", locator: dashboardPage.getEventDropdown() },
  ];

  try {
    await expect
      .poll(async () => {
        for (const readinessLocator of readinessLocators) {
          if (await readinessLocator.locator.isVisible().catch(() => false)) {
            return true;
          }
        }

        return false;
      }, { timeout })
      .toBeTruthy();
  } catch {
    const page = pageManager.getPage();
    const readinessState = await Promise.all(
      readinessLocators.map(async (readinessLocator) => {
        const visible = await readinessLocator.locator.isVisible().catch(() => false);
        return `${readinessLocator.name}=${visible}`;
      }),
    );
    const loginFormVisible = await loginPage.isLoginFormVisible(1000).catch(() => false);
    const loginInProgress = await loginPage.isLoginInProgress(1000).catch(() => false);
    const pageTitle = await page.title().catch(() => "unknown");

    throw new Error(
      `SYSTEM_DEGRADED_LOGIN_TIMEOUT: Login did not reach dashboard readiness within ${timeout}ms. ` +
      `url=${page.url()} title=${pageTitle} loginFormVisible=${loginFormVisible} ` +
      `loginInProgress=${loginInProgress} readiness=[${readinessState.join(", ")}]`,
    );
  }
}
