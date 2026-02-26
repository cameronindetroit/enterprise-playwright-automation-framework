import { test, expect } from "@playwright/test";
import DashboardE2EHelper from "../../helpers/DashboardE2EHelper";
import { decrypt } from "../../../utils/CryptojsUtil";
import PageManager from "../../../pages/PageManager";

const UI_TIMEOUT = 20000;
const KPI_UPDATE_TIMEOUT = 45000;

test.describe.configure({ mode: "serial" });

function resolveCredential(value?: string) {
  if (!value) {
    return "";
  }

  const decrypted = decrypt(value);
  return decrypted || value;
}

async function loginToDashboard(pageManager: PageManager) {
  const loginPage = pageManager.getLoginPage();
  await loginPage.navigate();
  await loginPage.waitForLoginForm();
  await loginPage.fillUsername(resolveCredential(process.env.userid));
  await loginPage.fillPassword(resolveCredential(process.env.password));
  await loginPage.clickLoginButton();
}

test("Smoke | Dashboard shell is available after login @smoke @critical", async ({ page }) => {
  const pageManager = new PageManager(page);
  await loginToDashboard(pageManager);

  await expect(pageManager.getDashboardPage().getDashboardTitle()).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(pageManager.getHomePage().getLogoutButton()).toBeVisible({ timeout: UI_TIMEOUT });
});

test("Smoke | Event dropdown loads event and refreshes dashboard KPIs @smoke @critical", async ({ page }, testInfo) => {
  const pageManager = new PageManager(page);
  await loginToDashboard(pageManager);

  const dashboardPage = pageManager.getDashboardPage();

  await expect(dashboardPage.getDashboardTitle()).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(dashboardPage.getEventDropdown()).toBeVisible({ timeout: UI_TIMEOUT });

  await DashboardE2EHelper.waitForKpisToLoad(pageManager, KPI_UPDATE_TIMEOUT);

  const kpiDataBefore = await DashboardE2EHelper.attachKpiSnapshot(pageManager, testInfo, "smoke-kpi-snapshot-before");
  const optionToSelect = await DashboardE2EHelper.selectRandomEventFromDropdown(pageManager, page, UI_TIMEOUT);

  test.skip(!optionToSelect, "No selectable event options are available in this environment.");

  await dashboardPage.clickLoadNewEvent();

  await expect(dashboardPage.getDashboardTitle()).toBeVisible({ timeout: UI_TIMEOUT });
  await expect
    .poll(() => dashboardPage.getSelectedEventOptionText(), { timeout: UI_TIMEOUT })
    .toBe(optionToSelect);

  await DashboardE2EHelper.waitForKpiChange(pageManager, kpiDataBefore, KPI_UPDATE_TIMEOUT);

  const kpiDataAfter = await DashboardE2EHelper.attachKpiSnapshot(pageManager, testInfo, "smoke-kpi-snapshot-after");
  expect(DashboardE2EHelper.hasKpiChange(kpiDataBefore, kpiDataAfter)).toBeTruthy();
});
