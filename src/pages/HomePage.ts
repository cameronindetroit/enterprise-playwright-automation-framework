import { Page, expect } from "@playwright/test";

export default class HomePage {

  private readonly serviceTitleSelector = "Service";

    constructor(private page: Page) {

    }


    async expectServiceTitleToBeVisible() {
        await this.page.waitForLoadState("load");
        await expect(this.page.getByTitle(this.serviceTitleSelector)).toBeVisible({ timeout: 19000 });
    }

}