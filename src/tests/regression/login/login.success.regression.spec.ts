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

test("Regression | Login succeeds with valid credentials @regression @smoke", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await expect(page.getByPlaceholder("Email")).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.getByPlaceholder("Password")).toBeVisible({ timeout: UI_TIMEOUT });

  await loginPage.fillUsername(resolveCredential(process.env.userid));
  await loginPage.fillPassword(resolveCredential(process.env.password));
  await loginPage.clickLoginButton();

  await expect(page.getByText("Events", { exact: true })).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.getByText("Dashboard", { exact: true }).first()).toBeVisible({ timeout: UI_TIMEOUT });
});
