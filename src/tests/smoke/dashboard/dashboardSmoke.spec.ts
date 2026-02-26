import { test, expect } from "../../fixtures";
import DashboardE2EHelper from "../../helpers/DashboardE2EHelper";

const UI_TIMEOUT = 20000;
const KPI_UPDATE_TIMEOUT = 45000;

test("Smoke | Dashboard shell is available after login @smoke @critical", async ({ pageManager }) => {
  await expect(pageManager.getDashboardPage().getDashboardTitle()).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(pageManager.getHomePage().getLogoutButton()).toBeVisible({ timeout: UI_TIMEOUT });
});

test("Smoke | Event dropdown loads event and refreshes dashboard KPIs @smoke @critical", async ({ pageManager, page }, testInfo) => {
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
