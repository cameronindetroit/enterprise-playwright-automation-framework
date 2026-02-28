import { test, expect } from "@playwright/test";
import LoginPage from "../../../pages/LoginPage";

const UI_TIMEOUT = 20000;

test("Regression | Forgot Password flow opens reset screen @regression", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await page.getByText("Forgot Password?", { exact: true }).click();

  await expect(page.getByText("Forgot Password?", { exact: true }).last()).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.getByRole("textbox", { name: "Enter Email" })).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.getByText("Reset Password", { exact: true })).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.getByText("Back to log in", { exact: true })).toBeVisible({ timeout: UI_TIMEOUT });
});

test("Regression | Forgot Password flow returns to login @regression", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const resetPanel = page
    .locator("div")
    .filter({ hasText: "Forgot Password?" })
    .filter({ has: page.getByRole("textbox", { name: "Enter Email" }) })
    .first();

  await loginPage.navigate();
  await page.getByText("Forgot Password?", { exact: true }).click();
  await resetPanel.getByText("Back to log in", { exact: true }).click({ force: true });

  await expect(page.locator("input[placeholder='Email']").first()).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.locator("input[placeholder='Password']").first()).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.getByText("Sign In", { exact: true })).toBeVisible({ timeout: UI_TIMEOUT });
});
