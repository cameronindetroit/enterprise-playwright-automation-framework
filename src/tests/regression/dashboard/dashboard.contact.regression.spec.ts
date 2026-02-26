import { test, expect } from "../../fixtures";

const UI_TIMEOUT = 20000;

test("Regression | Contact modal elements are visible @regression", async ({ pageManager, page }) => {
  const homePage = pageManager.getHomePage();

  await expect(homePage.getContact()).toBeVisible({ timeout: UI_TIMEOUT });
  await homePage.openContactModal();

  await expect(homePage.getContactAccountAdminTitle()).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(homePage.getContactEmailTitleInput()).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(homePage.getContactBodyInput()).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(homePage.getContactSendButton()).toBeVisible({ timeout: UI_TIMEOUT });

  await page.keyboard.press("Escape").catch(() => null);
});
