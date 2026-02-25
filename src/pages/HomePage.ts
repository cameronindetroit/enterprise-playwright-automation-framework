import { Page } from "@playwright/test";
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

    async navigateToEventTab() {
        const eventTab = this.getEventTab();

        logger.info("Navigating to Event tab");
        await eventTab.click().catch((error) => {
            logger.error(`Error clicking Event tab: ${error}`);
            throw error;
        }).then(() => logger.info("Clicked on Event tab"));
    }

    async navigateToICPTab() {
        const icpTab = this.getICPTab();

        logger.info("Navigating to ICP tab");
        await icpTab.click().catch((error) => {
            logger.error(`Error clicking ICP tab: ${error}`);
            throw error;
        }).then(() => logger.info("Clicked on ICP tab"));
    }

    async navigateToDataRequestTab() {
        const dataRequestTab = this.getDataRequestTab();

        logger.info("Navigating to Data Request tab");
        await dataRequestTab.click().catch((error) => {
            logger.error(`Error clicking Data Request tab: ${error}`);
            throw error;
        }).then(() => logger.info("Clicked on Data Request tab"));
    }

    async navigateToSettingsTab() {
        const settingsTab = this.getSettingsTab();

        logger.info("Navigating to Settings tab");
        await settingsTab.click().catch((error) => {
            logger.error(`Error clicking Settings tab: ${error}`);
            throw error;
        }).then(() => logger.info("Clicked on Settings tab"));
    }

    async navigateToFAQTab() {
        const faqTab = this.getFAQTab();

        logger.info("Navigating to FAQ tab");
        await faqTab.click().catch((error) => {
            logger.error(`Error clicking FAQ tab: ${error}`);
            throw error;
        }).then(() => logger.info("Clicked on FAQ tab"));
    }

    async navigateToFeatureBugRequestTab() {
        const featureBugRequestTab = this.getFeatureBugRequestTab();

        logger.info("Navigating to Feature/Bug Request tab");
        await featureBugRequestTab.click().catch((error) => {
            logger.error(`Error clicking Feature/Bug Request tab: ${error}`);
            throw error;
        }).then(() => logger.info("Clicked on Feature/Bug Request tab"));
    }

}