import { test } from "@playwright/test";
import LoginPage from "../pages/LoginPage";

test.skip("test", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const serviceTitleSelector = "Service";

    await loginPage.navigate();;
    await loginPage.fillUsername(process.env.userid!);
    await loginPage.fillPassword(process.env.password!)
    const homePage = await loginPage.clickLoginButton();
    // await homePage.expectServiceTitleToBeVisible();
    await page.getByTitle(serviceTitleSelector).waitFor({ state: "visible", timeout: 19000 });
    })


    test("Sample env test", async ({ page }) => {
      console.log("Enviornment: ", process.env.NODE_ENV);
      console.log("USERNAME: ", process.env.userid);
      console.log("PASSWORD: ", process.env.password);
    }); 