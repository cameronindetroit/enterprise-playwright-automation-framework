import { test as base, expect } from "@playwright/test";
import { decrypt } from "../utils/CryptojsUtil";
import PageManager from "../pages/PageManager";
import fs from "fs/promises";
import path from "path";

type Fixtures = {
  pageManager: PageManager;
};

type WorkerFixtures = {
  authStatePath: string;
};

const UI_TIMEOUT = 30000;

async function loginWithCredentials(pageManager: PageManager) {
  const loginPage = pageManager.getLoginPage();
  await loginPage.fillUsername(resolveCredential(process.env.userid));
  await loginPage.fillPassword(resolveCredential(process.env.password));
  await loginPage.clickLoginButton();
}

async function ensureAuthenticatedDashboard(pageManager: PageManager) {
  const loginPage = pageManager.getLoginPage();
  const homePage = pageManager.getHomePage();
  const dashboardReadyIndicator = homePage.getDashboardReadyIndicator();

  await loginPage.navigate();

  const alreadyAuthenticated = await dashboardReadyIndicator.isVisible({ timeout: 5000 }).catch(() => false);
  if (!alreadyAuthenticated) {
    const maxLoginAttempts = 2;
    for (let attempt = 1; attempt <= maxLoginAttempts; attempt++) {
      await loginWithCredentials(pageManager);

      const dashboardVisibleAfterLogin = await dashboardReadyIndicator
        .isVisible({ timeout: 12000 })
        .catch(() => false);

      if (dashboardVisibleAfterLogin) {
        break;
      }

      const stillOnLogin = await loginPage.isLoginFormVisible(2000);
      if (!stillOnLogin || attempt === maxLoginAttempts) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  const dashboardVisible = await dashboardReadyIndicator.isVisible({ timeout: UI_TIMEOUT }).catch(() => false);
  if (!dashboardVisible) {
    const stillOnLogin = await loginPage.isLoginFormVisible(2000);
    if (stillOnLogin) {
      throw new Error(
        "Authentication did not reach dashboard. Verify HONEYCOMB_USERID/HONEYCOMB_PASSWORD secrets and app login availability.",
      );
    }

    throw new Error(
      "Login submitted but dashboard shell did not become visible within timeout. App may be slow/unavailable.",
    );
  }

  await expect(dashboardReadyIndicator).toBeVisible({ timeout: UI_TIMEOUT });
}

function resolveCredential(value?: string) {
  if (!value) {
    return "";
  }

  const decrypted = decrypt(value);
  return decrypted || value;
}

export const test = base.extend<Fixtures, WorkerFixtures>({
  authStatePath: [
    async ({ browser }, use, workerInfo) => {
      const authDirPath = path.join(workerInfo.project.outputDir, ".auth");
      const authStatePath = path.join(authDirPath, `state-${workerInfo.workerIndex}.json`);

      await fs.mkdir(authDirPath, { recursive: true });

      const context = await browser.newContext();
      const page = await context.newPage();
      const pageManager = new PageManager(page);

      await ensureAuthenticatedDashboard(pageManager);
      await context.storageState({ path: authStatePath });
      await context.close();

      await use(authStatePath);
    },
    { scope: "worker" },
  ],

  context: async ({ browser, authStatePath }, use) => {
    const context = await browser.newContext({ storageState: authStatePath });
    await use(context);
    await context.close();
  },

  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
  },

  pageManager: async ({ page }, use) => {
    const pageManager = new PageManager(page);
    await ensureAuthenticatedDashboard(pageManager);

    await use(pageManager);
  },
});

export { expect };
