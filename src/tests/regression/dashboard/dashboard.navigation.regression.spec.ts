import { test, expect } from "../../fixtures";
import PageManager from "../../../pages/PageManager";

const UI_TIMEOUT = 20000;

const tabNavigationScenarios = [
  {
    name: "Regression | Event tab navigation @regression @smoke",
    getTab: (pageManager: PageManager) => pageManager.getHomePage().getEventTab(),
    navigate: (pageManager: PageManager) => pageManager.getHomePage().navigateToEventTab(),
    getPageMarker: (pageManager: PageManager) => pageManager.getEventPage().getEventsContainerHeader(),
  },
  {
    name: "Regression | ICP tab navigation @regression",
    getTab: (pageManager: PageManager) => pageManager.getHomePage().getICPTab(),
    navigate: (pageManager: PageManager) => pageManager.getHomePage().navigateToICPTab(),
    getPageMarker: (pageManager: PageManager) => pageManager.getICPPage().getEnrichICPButton(),
  },
  {
    name: "Regression | Data Request tab navigation @regression",
    getTab: (pageManager: PageManager) => pageManager.getHomePage().getDataRequestTab(),
    navigate: (pageManager: PageManager) => pageManager.getHomePage().navigateToDataRequestTab(),
    getPageMarker: (pageManager: PageManager) => pageManager.getDataRequestPage().getDataRequestContainer(),
  },
  {
    name: "Regression | Settings tab navigation @regression",
    getTab: (pageManager: PageManager) => pageManager.getHomePage().getSettingsTab(),
    navigate: (pageManager: PageManager) => pageManager.getHomePage().navigateToSettingsTab(),
    getPageMarker: (pageManager: PageManager) => pageManager.getSettingsPage().getSettingsResetPasswordContainer(),
  },
  {
    name: "Regression | FAQ tab navigation @regression",
    getTab: (pageManager: PageManager) => pageManager.getHomePage().getFAQTab(),
    navigate: (pageManager: PageManager) => pageManager.getHomePage().navigateToFAQTab(),
    getPageMarker: (pageManager: PageManager) => pageManager.getFAQPage().getFAQContainer(),
  },
  {
    name: "Regression | Feature/Bug Request tab navigation @regression",
    getTab: (pageManager: PageManager) => pageManager.getHomePage().getFeatureBugRequestTab(),
    navigate: (pageManager: PageManager) => pageManager.getHomePage().navigateToFeatureBugRequestTab(),
    getPageMarker: (pageManager: PageManager) => pageManager.getFeatureBugRequestPage().getFeatureBugRequestContainer(),
  },
] as const;

for (const scenario of tabNavigationScenarios) {
  test(scenario.name, async ({ pageManager }) => {
    await expect(scenario.getTab(pageManager)).toBeVisible({ timeout: UI_TIMEOUT });
    await scenario.navigate(pageManager);
    await expect(scenario.getPageMarker(pageManager)).toBeVisible({ timeout: UI_TIMEOUT });
  });
}
