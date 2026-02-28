import { test as base, expect } from "@playwright/test";
import PageManager from "../../../pages/PageManager";
import { loginToDashboard } from "../../helpers/DashboardAuthHelper";

type Fixtures = {
  pageManager: PageManager;
};

export const test = base.extend<Fixtures>({
  pageManager: async ({ page }, use, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + 60000);
    const pageManager = new PageManager(page);
    await loginToDashboard(pageManager);
    await use(pageManager);
  },
});

export { expect };
