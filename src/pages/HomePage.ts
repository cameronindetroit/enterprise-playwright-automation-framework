import { Page, expect } from "@playwright/test";
import logger from "../utils/LoggerUtil";

export default class HomePage {

  private readonly serviceTitleSelector = "Service";

    constructor(private page: Page) {

    }


    async expectServiceTitleToBeVisible() {
        await this.page.waitForLoadState("load");
        await expect(this.page.getByTitle(this.serviceTitleSelector)).toBeVisible({ timeout: 19000, }).catch((error) => {
            logger.error(`Error clicking login button: ${error}`);
            throw error; // Re-throw the error after logging it
        }).then(() => logger.info("clicked login button")); {
    }
  }

}