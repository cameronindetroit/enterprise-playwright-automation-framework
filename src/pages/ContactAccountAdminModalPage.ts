import { Page } from "@playwright/test";

export default class ContactAccountAdminModalPage {
    private readonly contactAccountAdminTitleLocator = "Contact Account Admin";
    private readonly contactSendButtonLocator = /Send/i;

    constructor(private page: Page) {

    }

    getTitle() {
        return this.page.getByText(this.contactAccountAdminTitleLocator, { exact: true }).first();
    }

    getModal() {
        return this.page
            .locator("div")
            .filter({ hasText: this.contactAccountAdminTitleLocator })
            .filter({ has: this.page.locator("input, textarea") })
            .first();
    }

    getEmailTitleInput() {
        return this.getModal().getByRole("textbox", { name: "Email Title" }).first();
    }

    getBodyInput() {
        return this.getModal().getByRole("textbox", { name: "Email Body" }).first();
    }

    getSendButton() {
        return this.getModal().getByText(this.contactSendButtonLocator, { exact: true }).first();
    }

    async fillEmailTitle(title: string) {
        await this.getEmailTitleInput().fill(title);
    }

    async fillBody(body: string) {
        await this.getBodyInput().fill(body);
    }

    async clickSendButton() {
        const roleSendButton = this.getModal().getByRole("button", { name: this.contactSendButtonLocator }).first();
        const roleSendButtonVisible = await roleSendButton.isVisible().catch(() => false);

        if (roleSendButtonVisible) {
            await roleSendButton.click({ force: true });
            return;
        }

        await this.getSendButton().click({ force: true });
    }
}
