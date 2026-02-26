import { test, expect } from "../../fixtures";
import PageManager from "../../../pages/PageManager";

const UI_TIMEOUT = 20000;

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

test("Regression | Dashboard KPIs and header elements @regression @smoke", async ({ pageManager }) => {
  await expect(pageManager.getDashboardPage().getDashboardTitle()).toBeVisible({ timeout: UI_TIMEOUT });

  for (const getLocator of dashboardVisibilityChecks) {
    await expect(getLocator(pageManager)).toBeVisible({ timeout: UI_TIMEOUT });
  }
});
