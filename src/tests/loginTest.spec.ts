import { test } from "@playwright/test";
import LoginPage from "../pages/LoginPage";

test("test", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const serviceTitleSelector = "Service";

  await loginPage.navigate();
    await loginPage.fillUsername("cameronindetroit153@agentforce.com");
    await loginPage.fillPassword("Viola1987!");

    const homePage = await loginPage.clickLoginButton();
    // await homePage.expectServiceTitleToBeVisible();
    await page.getByTitle(serviceTitleSelector).waitFor({ state: "visible", timeout: 19000 });
    })