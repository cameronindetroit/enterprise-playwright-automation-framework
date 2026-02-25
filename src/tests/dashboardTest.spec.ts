import { test, expect } from "./fixtures";
import logger from "../utils/LoggerUtil";
import PageManager from "../pages/PageManager";

const UI_TIMEOUT = 19000;

const scenarios = [
  {
    name: "Event tab navigation",
    getTab: (pageManager: PageManager) => pageManager.getHomePage().getEventTab(),
    navigate: (pageManager: PageManager) => pageManager.getHomePage().navigateToEventTab(),
    getPageMarker: (pageManager: PageManager) => pageManager.getEventPage().getEventsContainerHeader(),
  },
  {
    name: "ICP tab navigation",
    getTab: (pageManager: PageManager) => pageManager.getHomePage().getICPTab(),
    navigate: (pageManager: PageManager) => pageManager.getHomePage().navigateToICPTab(),
    getPageMarker: (pageManager: PageManager) => pageManager.getICPPage().getEnrichICPButton(),
  },
  {
    name: "Data Request tab navigation",
    getTab: (pageManager: PageManager) => pageManager.getHomePage().getDataRequestTab(),
    navigate: (pageManager: PageManager) => pageManager.getHomePage().navigateToDataRequestTab(),
    getPageMarker: (pageManager: PageManager) => pageManager.getDataRequestPage().getDataRequestContainer(),
  },
  {
    name: "Settings tab navigation",
    getTab: (pageManager: PageManager) => pageManager.getHomePage().getSettingsTab(),
    navigate: (pageManager: PageManager) => pageManager.getHomePage().navigateToSettingsTab(),
    getPageMarker: (pageManager: PageManager) => pageManager.getSettingsPage().getSettingsResetPasswordContainer(),
  },
  {
    name: "FAQ tab navigation",
    getTab: (pageManager: PageManager) => pageManager.getHomePage().getFAQTab(),
    navigate: (pageManager: PageManager) => pageManager.getHomePage().navigateToFAQTab(),
    getPageMarker: (pageManager: PageManager) => pageManager.getFAQPage().getFAQContainer(),
  },
  {
    name: "Feature/Bug Request tab navigation",
    getTab: (pageManager: PageManager) => pageManager.getHomePage().getFeatureBugRequestTab(),
    navigate: (pageManager: PageManager) => pageManager.getHomePage().navigateToFeatureBugRequestTab(),
    getPageMarker: (pageManager: PageManager) => pageManager.getFeatureBugRequestPage().getFeatureBugRequestContainer(),
  },
] as const;
 
for (const scenario of scenarios) {
  test(scenario.name, async ({ pageManager }) => {
    logger.info(`${scenario.name} test started...`);

    await expect(scenario.getTab(pageManager)).toBeVisible({ timeout: UI_TIMEOUT });
    await scenario.navigate(pageManager);
    await expect(scenario.getPageMarker(pageManager)).toBeVisible({ timeout: UI_TIMEOUT });

    logger.info(`${scenario.name} test completed`);
  });
}
