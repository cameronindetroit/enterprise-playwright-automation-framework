import { test,expect } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import { encrypt, decrypt } from "../utils/CryptojsUtil";
import { decryptEnvFile, encryptEnvFile } from "../utils/EncryptEnvFile";
import logger from "../utils/LoggerUtil";

test("test", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const serviceTitleSelector = page.getByRole("heading", { name: "Service" });
  const loginImage = page.locator("#logo");

    await loginPage.navigate();
    await expect(loginImage).toBeVisible({ timeout: 19000 });
    await loginPage.fillUsername(decrypt(process.env.userid!));
    await loginPage.fillPassword(decrypt(process.env.password!));
    const homePage = await loginPage.clickLoginButton();
    // await expect(serviceTitleSelector).toBeVisible({ timeout: 19000 });
    logger.info("Test for login is completed");
    // await homePage.expectServiceTitleToBeVisible();
    // await page.getByTitle("Service").waitFor({ state: "visible", timeout: 19000 });
  
});

test.skip("Sample env test", async ({ page }) => {
  // const plainText = "Hello, Mars!";
  // const encryptedText = encrypt(plainText);
  // console.log('SALT:', process.env.SALT);
  // console.log('Encrypted Text:', encryptedText);
  // const decryptedText = decrypt(encryptedText);
  // console.log('Decrypted Text:', decryptedText);
  encryptEnvFile();
});