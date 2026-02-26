import { test, expect } from "@playwright/test";
import LoginPage from "../../../pages/LoginPage";
import { decrypt } from "../../../utils/CryptojsUtil";

const UI_TIMEOUT = 20000;

function resolveCredential(value?: string) {
  if (!value) {
    return "";
  }

  const decrypted = decrypt(value);
  return decrypted || value;
}

test("Login journey from forgot password back to successful sign in @e2e @critical", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const resetPanel = page
    .locator("div")
    .filter({ hasText: "Forgot Password?" })
    .filter({ has: page.getByRole("textbox", { name: "Enter Email" }) })
    .first();

  await loginPage.navigate();
  await expect(page.getByRole("textbox", { name: "Email", exact: true })).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.getByRole("textbox", { name: "Password", exact: true })).toBeVisible({ timeout: UI_TIMEOUT });

  await page.getByText("Forgot Password?", { exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Enter Email" })).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.getByText("Reset Password", { exact: true })).toBeVisible({ timeout: UI_TIMEOUT });

  await resetPanel.getByText("Back to log in", { exact: true }).click({ force: true });
  await expect(page.getByRole("textbox", { name: "Email", exact: true })).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.getByRole("textbox", { name: "Password", exact: true })).toBeVisible({ timeout: UI_TIMEOUT });

  await loginPage.fillUsername(resolveCredential(process.env.userid));
  await loginPage.fillPassword(resolveCredential(process.env.password));
  await loginPage.clickLoginButton();

  await expect(page.getByText("Events", { exact: true })).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.getByText("Dashboard", { exact: true }).first()).toBeVisible({ timeout: UI_TIMEOUT });
});
