import { Page, Locator } from "@playwright/test";
import logger from "../../utils/LoggerUtil";
import ContactAccountAdminModalPage from "./ContactAccountAdminModalPage";

export default class HomePage {
    private readonly logoutLocator = /Logout/i;
    private readonly accountManagerLocator = /Account Manager/i;
    private readonly contactLocator = /Contact/i;
    private readonly eventTabLocator = "Events";
    private readonly icpTabLocator = "ICP";
    private readonly dataRequestTabLocator = "Data Request";
    private readonly settingsTabLocator = "Settings";
    private readonly faqTabLocator = "FAQ";
    private readonly featureBugRequestTabLocator = "Feature/Bug Request";
    private readonly contactAccountAdminTitleLocator = /Contact\s+Account\s+Admin/i;
    private contactAccountAdminModalPage?: ContactAccountAdminModalPage;

    constructor(private page: Page) {

    }

    getLogoutButton() {
        return this.page.getByText(this.logoutLocator).first();
    }

    getAccountManager() {
        return this.page.getByText(this.accountManagerLocator).first();
    }

    getContact() {
        return this.page
            .getByRole("button", { name: /^Contact$/i })
            .or(this.page.getByRole("link", { name: /^Contact$/i }))
            .or(this.page.getByRole("tab", { name: /^Contact$/i }))
            .or(this.page.getByText(/^Contact$/i))
            .first();
    }

    getContactAccountAdminModalPage() {
        if (!this.contactAccountAdminModalPage) {
            this.contactAccountAdminModalPage = new ContactAccountAdminModalPage(this.page);
        }

        return this.contactAccountAdminModalPage;
    }

    getContactAccountAdminTitle() {
        return this.getContactAccountAdminModalPage().getTitle();
    }

    getContactAccountAdminModal() {
        return this.getContactAccountAdminModalPage().getModal();
    }

    getContactEmailTitleInput() {
        return this.getContactAccountAdminModalPage().getEmailTitleInput();
    }

    getContactBodyInput() {
        return this.getContactAccountAdminModalPage().getBodyInput();
    }

    getContactSendButton() {
        return this.getContactAccountAdminModalPage().getSendButton();
    }

    async openContactModal() {
        const contact = this.getContact();
        await contact.scrollIntoViewIfNeeded().catch(() => null);

        const modalTitle = this.page.getByText(this.contactAccountAdminTitleLocator).first();
        const maxAttempts = 3;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                await contact.click({ timeout: 10000 });
            } catch {
                await contact.click({ force: true });
            }

            const isVisible = await modalTitle.isVisible().catch(() => false);
            if (isVisible) {
                return;
            }

            await this.page.waitForTimeout(500);
        }

        await modalTitle.waitFor({ state: "visible", timeout: 20000 });
    }

    async fillContactEmailTitle(title: string) {
        await this.getContactAccountAdminModalPage().fillEmailTitle(title);
    }

    async fillContactBody(body: string) {
        await this.getContactAccountAdminModalPage().fillBody(body);
    }

    async clickContactSendButton() {
        await this.getContactAccountAdminModalPage().clickSendButton();
    }

    getEventTab() {
        return this.page
            .getByRole("tab", { name: /Events/i })
            .or(this.page.getByRole("link", { name: /Events/i }))
            .or(this.page.getByRole("button", { name: /Events/i }))
            .or(this.page.getByText(/^Events$/i))
            .first();
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

    getDashboardReadyIndicator() {
        return this.page.getByText(/Dashboard/i).first();
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