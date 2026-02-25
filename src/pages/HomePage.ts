import { Page, expect } from "@playwright/test";
import logger from "../utils/LoggerUtil";

export default class HomePage {

    private readonly eventTabLocator = "Events";
    private readonly icpTabLocator = "ICP";

    constructor(private page: Page) {

    }

    getEventTab() {
        return this.page.getByText(this.eventTabLocator, { exact: true }).first();
    }

    getICPTab() {
        return this.page.getByText(this.icpTabLocator, { exact: true }).first();
    }

    async navigateToEventTab() {
        const eventTab = this.getEventTab();

        await expect(eventTab).toBeVisible().catch((error) => {
            logger.error(`Error verifying Event tab visibility: ${error}`);
            throw error;
        }).then(() => logger.info("Event tab is visible"));

        await eventTab.click().catch((error) => {
            logger.error(`Error clicking Event tab: ${error}`);
            throw error;
        }).then(() => logger.info("Clicked on Event tab"));
    }

    async navigateToICPTab() {
        const icpTab = this.getICPTab();

        await expect(icpTab).toBeVisible().catch((error) => {
            logger.error(`Error verifying ICP tab visibility: ${error}`);
            throw error;
        }).then(() => logger.info("ICP tab is visible"));

        await icpTab.click().catch((error) => {
            logger.error(`Error clicking ICP tab: ${error}`);
            throw error;
        }).then(() => logger.info("Clicked on ICP tab"));
    }

}