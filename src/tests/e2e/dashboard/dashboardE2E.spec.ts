import { test, expect } from "./dashboardE2E.fixtures";
import PageManager from "../../../pages/PageManager";
import DashboardE2EHelper from "../../helpers/DashboardE2EHelper";

const UI_TIMEOUT = 20000;
const KPI_UPDATE_TIMEOUT = 45000;

test("Dashboard shell is available after login @e2e @critical", async ({ pageManager }) => {
  await expect(pageManager.getDashboardPage().getDashboardTitle()).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(pageManager.getHomePage().getLogoutButton()).toBeVisible({ timeout: UI_TIMEOUT });
});

const dashboardVisibilityChecks = [
  (pageManager: PageManager) => pageManager.getDashboardPage().getEventTotalRecordsCard(),
  (pageManager: PageManager) => pageManager.getDashboardPage().getTotalICPCard(),
  (pageManager: PageManager) => pageManager.getDashboardPage().getTotalLeadsCard(),
  (pageManager: PageManager) => pageManager.getDashboardPage().getTotalAttendeesEngagedCard(),
  (pageManager: PageManager) => pageManager.getDashboardPage().getAverageICP(),
  (pageManager: PageManager) => pageManager.getDashboardPage().getICPMatchRate(),
  (pageManager: PageManager) => pageManager.getDashboardPage().getLoadNewEventButton(),
  (pageManager: PageManager) => pageManager.getHomePage().getLogoutButton(),
  (pageManager: PageManager) => pageManager.getHomePage().getAccountManager(),
  (pageManager: PageManager) => pageManager.getHomePage().getContact(),
] as const;

test.describe("Dashboard KPIs", () => {
  test("Dashboard page shows KPI and header elements @e2e", async ({ pageManager }) => {
    await expect(pageManager.getDashboardPage().getDashboardTitle()).toBeVisible({ timeout: UI_TIMEOUT });

    for (const getLocator of dashboardVisibilityChecks) {
      await expect(getLocator(pageManager)).toBeVisible({ timeout: UI_TIMEOUT });
    }
  });
});

test("Event dropdown loads selected event and refreshes dashboard KPIs @e2e @critical", async ({ pageManager, page }, testInfo) => {
  const dashboardPage = pageManager.getDashboardPage();

  await expect(dashboardPage.getDashboardTitle()).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(dashboardPage.getEventDropdown()).toBeVisible({ timeout: UI_TIMEOUT });

  await DashboardE2EHelper.waitForKpisToLoad(pageManager, KPI_UPDATE_TIMEOUT);

  const kpiDataBefore = await DashboardE2EHelper.attachKpiSnapshot(pageManager, testInfo, "kpi-snapshot-before");

  const optionToSelect = await DashboardE2EHelper.selectRandomEventFromDropdown(pageManager, page, UI_TIMEOUT);
  test.skip(!optionToSelect, "No selectable event options are available in this environment.");

  await dashboardPage.clickLoadNewEvent();

  await expect(dashboardPage.getDashboardTitle()).toBeVisible({ timeout: UI_TIMEOUT });
  await expect
    .poll(() => dashboardPage.getSelectedEventOptionText(), { timeout: UI_TIMEOUT })
    .toBe(optionToSelect);

  await DashboardE2EHelper.waitForKpiChange(pageManager, kpiDataBefore, KPI_UPDATE_TIMEOUT);

  const kpiDataAfter = await DashboardE2EHelper.attachKpiSnapshot(pageManager, testInfo, "kpi-snapshot-after");

  const hasKpiChange = DashboardE2EHelper.hasKpiChange(kpiDataBefore, kpiDataAfter);

  expect(hasKpiChange).toBeTruthy();
  expect(kpiDataAfter).not.toEqual(kpiDataBefore);
});

test.skip("Contact modal sends message and returns to dashboard @e2e", async ({ pageManager }) => {
  const testEmailTitle = "E2E Contact Modal Title";
  const testBody = "This is a dashboard E2E contact modal validation message.";

  await expect(pageManager.getHomePage().getContact()).toBeVisible({ timeout: UI_TIMEOUT });
  await pageManager.getHomePage().openContactModal();

  await expect(pageManager.getHomePage().getContactAccountAdminTitle()).toBeVisible({ timeout: UI_TIMEOUT });

  await pageManager.getHomePage().fillContactEmailTitle(testEmailTitle);
  await pageManager.getHomePage().fillContactBody(testBody);
  await pageManager.getHomePage().clickContactSendButton();

  await expect(pageManager.getHomePage().getContactAccountAdminTitle()).toBeHidden({ timeout: UI_TIMEOUT });
  await expect(pageManager.getDashboardPage().getDashboardTitle()).toBeVisible({ timeout: UI_TIMEOUT });
});

const featureScenarios = [
  {
    name: "Events",
    getTab: (pageManager: PageManager) => pageManager.getHomePage().getEventTab(),
    navigate: (pageManager: PageManager) => pageManager.getHomePage().navigateToEventTab(),
    getPageMarker: (pageManager: PageManager) => pageManager.getEventPage().getEventsContainerHeader(),
  },
  {
    name: "ICP",
    getTab: (pageManager: PageManager) => pageManager.getHomePage().getICPTab(),
    navigate: (pageManager: PageManager) => pageManager.getHomePage().navigateToICPTab(),
    getPageMarker: (pageManager: PageManager) => pageManager.getICPPage().getEnrichICPButton(),
  },
  {
    name: "Data Request",
    getTab: (pageManager: PageManager) => pageManager.getHomePage().getDataRequestTab(),
    navigate: (pageManager: PageManager) => pageManager.getHomePage().navigateToDataRequestTab(),
    getPageMarker: (pageManager: PageManager) => pageManager.getDataRequestPage().getDataRequestContainer(),
  },
  {
    name: "Settings",
    getTab: (pageManager: PageManager) => pageManager.getHomePage().getSettingsTab(),
    navigate: (pageManager: PageManager) => pageManager.getHomePage().navigateToSettingsTab(),
    getPageMarker: (pageManager: PageManager) => pageManager.getSettingsPage().getSettingsResetPasswordContainer(),
  },
  {
    name: "FAQ",
    getTab: (pageManager: PageManager) => pageManager.getHomePage().getFAQTab(),
    navigate: (pageManager: PageManager) => pageManager.getHomePage().navigateToFAQTab(),
    getPageMarker: (pageManager: PageManager) => pageManager.getFAQPage().getFAQContainer(),
  },
  {
    name: "Feature/Bug Request",
    getTab: (pageManager: PageManager) => pageManager.getHomePage().getFeatureBugRequestTab(),
    navigate: (pageManager: PageManager) => pageManager.getHomePage().navigateToFeatureBugRequestTab(),
    getPageMarker: (pageManager: PageManager) => pageManager.getFeatureBugRequestPage().getFeatureBugRequestContainer(),
  },
] as const;

for (const scenario of featureScenarios) {
  test(`${scenario.name} page works end-to-end @e2e`, async ({ pageManager }) => {
    await expect(scenario.getTab(pageManager)).toBeVisible({ timeout: UI_TIMEOUT });
    await scenario.navigate(pageManager);
    await expect(scenario.getPageMarker(pageManager)).toBeVisible({ timeout: UI_TIMEOUT });
  });
}
