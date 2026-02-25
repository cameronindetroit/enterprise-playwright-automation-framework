import { test, expect } from "./fixtures.ts";
import logger from "../utils/LoggerUtil";
 
test("Event tab navigation", async ({ pageManager }) => {
  logger.info("Event tab navigation test started...");
  const homePage = pageManager.getHomePage();
  const eventPage = pageManager.getEventPage();
  await expect(homePage.getEventTab()).toBeVisible({ timeout: 19000 });
  await homePage.navigateToEventTab();
  await expect(eventPage.getEventsContainerHeader()).toBeVisible({ timeout: 19000 });

  logger.info("Event tab navigation test completed");
});

test("ICP tab navigation", async ({ pageManager }) => {
  logger.info("ICP tab navigation test started...");
  const homePage = pageManager.getHomePage();
  const icpPage = pageManager.getICPPage();
  await expect(homePage.getICPTab()).toBeVisible({ timeout: 19000 });
  await homePage.navigateToICPTab();
  await expect(icpPage.getEnrichICPButton()).toBeVisible({ timeout: 19000 });

  logger.info("ICP tab navigation test completed");
});

test("Data Request tab navigation", async ({ pageManager }) => {
  logger.info("Data Request tab navigation test started...");
  const homePage = pageManager.getHomePage();
  const dataRequestPage = pageManager.getDataRequestPage();
  await expect(homePage.getDataRequestTab()).toBeVisible({ timeout: 19000 });
  await homePage.navigateToDataRequestTab();
  await expect(dataRequestPage.getDataRequestContainer()).toBeVisible({ timeout: 19000 });

  logger.info("Data Request tab navigation test completed");
});

test("Settings tab navigation", async ({ pageManager }) => {
  logger.info("Settings tab navigation test started...");
  const homePage = pageManager.getHomePage();
  const settingsPage = pageManager.getSettingsPage();
  await expect(homePage.getSettingsTab()).toBeVisible({ timeout: 19000 });
  await homePage.navigateToSettingsTab();
  await expect(settingsPage.getSettingsResetPasswordContainer()).toBeVisible({ timeout: 19000 });

  logger.info("Settings tab navigation test completed");
});

test("FAQ tab navigation", async ({ pageManager }) => {
  logger.info("FAQ tab navigation test started...");
  const homePage = pageManager.getHomePage();
  const faqPage = pageManager.getFAQPage();
  await expect(homePage.getFAQTab()).toBeVisible({ timeout: 19000 });
  await homePage.navigateToFAQTab();
  await expect(faqPage.getFAQContainer()).toBeVisible({ timeout: 19000 });
  
  logger.info("FAQ tab navigation test completed");
});

test("Feature/Bug Request tab navigation", async ({ pageManager }) => {
  logger.info("Feature/Bug Request tab navigation test started...");
  const homePage = pageManager.getHomePage();
  const featureBugRequestPage = pageManager.getFeatureBugRequestPage();
  await expect(featureBugRequestPage.getFeatureBugRequestContainer()).toBeVisible({ timeout: 19000 });
  await homePage.navigateToFeatureBugRequestTab();
  await expect(featureBugRequestPage.getFeatureBugRequestContainer()).toBeVisible({ timeout: 19000 });
  
  logger.info("Feature/Bug Request tab navigation test completed");
});
