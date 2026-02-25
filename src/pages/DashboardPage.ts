import { Locator, Page } from "@playwright/test";

export default class DashboardPage {
    private readonly dashboardTitleLocator = /Dashboard/i;
    private readonly eventTotalRecordsLabel = "Event Total Records";
    private readonly totalICPLabel = "Total ICP";
    private readonly totalLeadsLabel = "Total Leads";
    private readonly totalAttendeesEngagedLabel = "Total Attendees Engaged";
    private readonly averageICPLocator = /Average ICP/i;
    private readonly icpMatchRateLocator = /ICP Match Rate/i;
    private readonly loadNewEventLocator = /Load New Event/i;
    private readonly selectEventPlaceholder = "Select Event...";

    constructor(private page: Page) {

    }

    getDashboardTitle() {
        return this.page.getByText(this.dashboardTitleLocator).first();
    }

    private getKpiCardByLabel(label: string) {
        return this.page
            .locator("div")
            .filter({ has: this.page.getByText(label, { exact: true }) })
            .first();
    }

    getEventTotalRecordsCard() {
        return this.getKpiCardByLabel(this.eventTotalRecordsLabel);
    }

    getTotalICPCard() {
        return this.getKpiCardByLabel(this.totalICPLabel);
    }

    getTotalLeadsCard() {
        return this.getKpiCardByLabel(this.totalLeadsLabel);
    }

    getTotalAttendeesEngagedCard() {
        return this.getKpiCardByLabel(this.totalAttendeesEngagedLabel);
    }

    getAverageICP() {
        return this.page.getByText(this.averageICPLocator).first();
    }

    getICPMatchRate() {
        return this.page.getByText(this.icpMatchRateLocator).first();
    }

    getLoadNewEventButton() {
        return this.page.getByText(this.loadNewEventLocator).first();
    }

    getEventDropdown() {
        return this.page.getByRole("combobox").first();
    }

    getEventDropdownOptions() {
        return this.getEventDropdown().locator("option");
    }

    async getSelectedEventOptionText() {
        return await this.getEventDropdown().evaluate((dropdown) => {
            const selectElement = dropdown as HTMLSelectElement;
            const selectedOption = selectElement.options[selectElement.selectedIndex];
            return (selectedOption?.text || "").trim();
        });
    }

    async getRandomAvailableEventOptionText(excludeOptionText?: string) {
        const options = (await this.getEventDropdownOptions().allTextContents())
            .map((option) => option.trim())
            .filter(
                (option) =>
                    option.length > 0 &&
                    option !== this.selectEventPlaceholder &&
                    option !== excludeOptionText,
            );

        if (options.length === 0) {
            throw new Error("No selectable event option found in the event dropdown.");
        }

        const randomIndex = Math.floor(Math.random() * options.length);
        return options[randomIndex];
    }

    async selectEventByLabel(optionLabel: string) {
        await this.getEventDropdown().selectOption({ label: optionLabel });
    }

    async clickLoadNewEvent() {
        await this.getLoadNewEventButton().click({ force: true });
    }

    private async readNormalizedText(locator: Locator) {
        const text = (await locator.textContent()) || "";
        return text.replace(/\s+/g, " ").trim();
    }

    async getDashboardKpiDataSet() {
        return {
            [this.eventTotalRecordsLabel]: await this.readNormalizedText(this.getEventTotalRecordsCard()),
            [this.totalICPLabel]: await this.readNormalizedText(this.getTotalICPCard()),
            [this.totalLeadsLabel]: await this.readNormalizedText(this.getTotalLeadsCard()),
            [this.totalAttendeesEngagedLabel]: await this.readNormalizedText(this.getTotalAttendeesEngagedCard()),
        };
    }
}
