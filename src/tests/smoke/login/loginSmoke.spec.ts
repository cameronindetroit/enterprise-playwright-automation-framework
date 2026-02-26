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

test("Smoke | Login succeeds with valid credentials @smoke @critical", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await expect(page.getByRole("textbox", { name: "Email", exact: true })).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.getByRole("textbox", { name: "Password", exact: true })).toBeVisible({ timeout: UI_TIMEOUT });

  await loginPage.fillUsername(resolveCredential(process.env.userid));
  await loginPage.fillPassword(resolveCredential(process.env.password));
  await loginPage.clickLoginButton();

  await expect(page.getByText("Events", { exact: true })).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.getByText("Dashboard", { exact: true }).first()).toBeVisible({ timeout: UI_TIMEOUT });
});
