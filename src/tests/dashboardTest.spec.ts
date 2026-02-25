import { test, expect, Page } from "@playwright/test";
import { decrypt } from "../utils/CryptojsUtil";
import logger from "../utils/LoggerUtil";
import LoginPage from "../pages/LoginPage";
import EventPage from "../pages/EventPage";
import ICPPage from "../pages/ICPPage";
import DataRequestPage from "../pages/DataRequestPage";
import SettingsPage from "../pages/SettingsPage";
import FAQPage from "../pages/FAQPage";
import FeatureBugRequestPage from "../pages/FeatureBugRequestPage";

async function loginAndGetHomePage(page: Page) {
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.fillUsername(decrypt(process.env.userid!));
  await loginPage.fillPassword(decrypt(process.env.password!));
  return loginPage.clickLoginButton();
}
 
test("Event tab navigation", async ({ page }) => {
  logger.info("Event tab navigation test started...");
  const homePage = await loginAndGetHomePage(page);
  const eventPage = new EventPage(page);
  await expect(homePage.getEventTab()).toBeVisible({ timeout: 19000 });
  await homePage.navigateToEventTab();
  await expect(eventPage.getEventsContainerHeader()).toBeVisible({ timeout: 19000 });

  logger.info("Event tab navigation test completed");
});

test("ICP tab navigation", async ({ page }) => {
  logger.info("ICP tab navigation test started...");
  const homePage = await loginAndGetHomePage(page);
  const icpPage = new ICPPage(page);
  await expect(homePage.getICPTab()).toBeVisible({ timeout: 19000 });
  await homePage.navigateToICPTab();
  await expect(icpPage.getEnrichICPButton()).toBeVisible({ timeout: 19000 });

  logger.info("ICP tab navigation test completed");
});

test("Data Request tab navigation", async ({ page }) => {
  logger.info("Data Request tab navigation test started...");
  const homePage = await loginAndGetHomePage(page);
  const dataRequestPage = new DataRequestPage(page);
  await expect(homePage.getDataRequestTab()).toBeVisible({ timeout: 19000 });
  await homePage.navigateToDataRequestTab();
  await expect(dataRequestPage.getDataRequestContainer()).toBeVisible({ timeout: 19000 });

  logger.info("Data Request tab navigation test completed");
});

test("Settings tab navigation", async ({ page }) => {
  logger.info("Settings tab navigation test started...");
  const homePage = await loginAndGetHomePage(page);
  const settingsPage = new SettingsPage(page);
  await expect(homePage.getSettingsTab()).toBeVisible({ timeout: 19000 });
  await homePage.navigateToSettingsTab();
  await expect(settingsPage.getSettingsResetPasswordContainer()).toBeVisible({ timeout: 19000 });

  logger.info("Settings tab navigation test completed");
});

test("FAQ tab navigation", async ({ page }) => {
  logger.info("FAQ tab navigation test started...");
  const homePage = await loginAndGetHomePage(page);
  const faqPage = new FAQPage(page);
  await expect(homePage.getFAQTab()).toBeVisible({ timeout: 19000 });
  await homePage.navigateToFAQTab();
  await expect(faqPage.getFAQContainer()).toBeVisible({ timeout: 19000 });
  logger.info("FAQ tab navigation test completed");
});

test("Feature/Bug Request tab navigation", async ({ page }) => {
  logger.info("Feature/Bug Request tab navigation test started...");
  const homePage = await loginAndGetHomePage(page);
  const featureBugRequestPage = new FeatureBugRequestPage(page);
  await expect(featureBugRequestPage.getFeatureBugRequestContainer()).toBeVisible({ timeout: 19000 });
  await homePage.navigateToFeatureBugRequestTab();
  await expect(featureBugRequestPage.getFeatureBugRequestContainer()).toBeVisible({ timeout: 19000 });
  
  logger.info("Feature/Bug Request tab navigation test completed");
});
