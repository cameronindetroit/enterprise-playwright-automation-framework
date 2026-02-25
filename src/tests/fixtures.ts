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

const UI_TIMEOUT = 19000;

async function loginWithCredentials(pageManager: PageManager) {
  const loginPage = pageManager.getLoginPage();
  await loginPage.fillUsername(resolveCredential(process.env.userid));
  await loginPage.fillPassword(resolveCredential(process.env.password));
  await loginPage.clickLoginButton();
}

async function ensureAuthenticatedDashboard(pageManager: PageManager) {
  const loginPage = pageManager.getLoginPage();
  const eventTab = pageManager.getHomePage().getEventTab();

  await loginPage.navigate();

  const alreadyAuthenticated = await eventTab.isVisible({ timeout: 4000 }).catch(() => false);
  if (!alreadyAuthenticated) {
    await loginWithCredentials(pageManager);
  }

  await expect(eventTab).toBeVisible({ timeout: UI_TIMEOUT });
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
