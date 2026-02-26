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

test("Regression | Login rejects incorrect password @regression @smoke", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigate();
  await expect(page.getByPlaceholder("Email")).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.getByPlaceholder("Password")).toBeVisible({ timeout: UI_TIMEOUT });

  await loginPage.fillUsername(resolveCredential(process.env.userid));
  await loginPage.fillPassword("invalid-password-for-regression");
  await loginPage.clickLoginButton();

  await expect(page.getByText("Sign in to your account below.", { exact: true })).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.getByPlaceholder("Email")).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.getByPlaceholder("Password")).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.getByText("Events", { exact: true })).toHaveCount(0);
});

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

  await expect(page.getByPlaceholder("Email")).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.getByPlaceholder("Password")).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(page.getByText("Sign In", { exact: true })).toBeVisible({ timeout: UI_TIMEOUT });
});
