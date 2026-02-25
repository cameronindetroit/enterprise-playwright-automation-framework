import { Page, Locator } from "@playwright/test";
import logger from "../utils/LoggerUtil";

export default class HomePage {

    private readonly eventTabLocator = "Events";
    private readonly icpTabLocator = "ICP";
    private readonly dataRequestTabLocator = "Data Request";
    private readonly settingsTabLocator = "Settings";
    private readonly faqTabLocator = "FAQ";
    private readonly featureBugRequestTabLocator = "Feature/Bug Request";

    constructor(private page: Page) {

    }

    getEventTab() {
        return this.page.getByText(this.eventTabLocator, { exact: true }).first();
    }

    getICPTab() {
        return this.page.getByText(this.icpTabLocator, { exact: true }).first();
    }

    getDataRequestTab() {
        return this.page.getByText(this.dataRequestTabLocator, { exact: true }).first();
    }

    getSettingsTab() {
        return this.page.getByText(this.settingsTabLocator, { exact: true }).first();
    }

    getFAQTab() {
        return this.page.getByText(this.faqTabLocator, { exact: true }).first();
    }

    getFeatureBugRequestTab() {
        return this.page.getByText(this.featureBugRequestTabLocator, { exact: true }).first();
    }

    private async clickTab(tab: Locator, tabName: string) {
        logger.info(`Navigating to ${tabName} tab`);
        try {
            await tab.click();
            logger.info(`Clicked on ${tabName} tab`);
        } catch (error) {
            logger.error(`Error clicking ${tabName} tab: ${error}`);
            throw error;
        }
    }

    async navigateToEventTab() {
        await this.clickTab(this.getEventTab(), "Event");
    }

    async navigateToICPTab() {
        await this.clickTab(this.getICPTab(), "ICP");
    }

    async navigateToDataRequestTab() {
        await this.clickTab(this.getDataRequestTab(), "Data Request");
    }

    async navigateToSettingsTab() {
        await this.clickTab(this.getSettingsTab(), "Settings");
    }

    async navigateToFAQTab() {
        await this.clickTab(this.getFAQTab(), "FAQ");
    }

    async navigateToFeatureBugRequestTab() {
        await this.clickTab(this.getFeatureBugRequestTab(), "Feature/Bug Request");
    }

}