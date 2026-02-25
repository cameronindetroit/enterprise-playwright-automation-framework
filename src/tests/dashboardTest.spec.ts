import { test, expect } from "@playwright/test";
import { decrypt } from "../utils/CryptojsUtil";
import logger from "../utils/LoggerUtil";
import LoginPage from "../pages/LoginPage";
 
test("Event tab navigation", async ({ page }) => {
  logger.info("Event tab navigation test started...");
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.fillUsername(decrypt(process.env.userid!));
  await loginPage.fillPassword(decrypt(process.env.password!));
  const homePage = await loginPage.clickLoginButton();

  await homePage.navigateToEventTab();
  const eventsSidebarTitle = page.getByText("Events", { exact: true }).first();
  await expect(eventsSidebarTitle).toBeVisible({ timeout: 19000 });

  logger.info("Event tab navigation test completed");
});

test("ICP tab navigation", async ({ page }) => {
  logger.info("ICP tab navigation test started...");
  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.fillUsername(decrypt(process.env.userid!));
  await loginPage.fillPassword(decrypt(process.env.password!));
  const homePage = await loginPage.clickLoginButton();

  await homePage.navigateToICPTab();
  const icpSidebarTitle = page.getByText("ICP", { exact: true }).first();
  await expect(icpSidebarTitle).toBeVisible({ timeout: 19000 });

  logger.info("ICP tab navigation test completed");
});
