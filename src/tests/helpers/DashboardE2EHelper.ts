import { expect, Page, TestInfo } from "@playwright/test";
import PageManager from "../../pages/PageManager";

export default class DashboardE2EHelper {
    static async waitForKpisToLoad(pageManager: PageManager, timeout: number) {
        const dashboardPage = pageManager.getDashboardPage();
        await expect
            .poll(async () => {
                const kpiDataSet = await dashboardPage.getDashboardKpiDataSet();
                return Object.values(kpiDataSet).every((value) => value.trim().length > 0);
            }, { timeout })
            .toBeTruthy();
    }

    static async attachKpiSnapshot(pageManager: PageManager, testInfo: TestInfo, snapshotName: string) {
        const kpiData = await pageManager.getDashboardPage().getDashboardKpiDataSet();
        await testInfo.attach(snapshotName, {
            body: JSON.stringify(kpiData, null, 2),
            contentType: "application/json",
        });
        return kpiData;
    }

    static async selectRandomEventFromDropdown(pageManager: PageManager, page: Page, timeout: number, maxAttempts = 8) {
        const dashboardPage = pageManager.getDashboardPage();
        await dashboardPage.getEventDropdown().click();

        const selectedBefore = await dashboardPage.getSelectedEventOptionText();
        let optionToSelect = "";

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            optionToSelect = await dashboardPage.getRandomAvailableEventOptionText(selectedBefore).catch(() => "");
            if (optionToSelect) {
                break;
            }
            await page.waitForTimeout(1000);
            await dashboardPage.getEventDropdown().click().catch(() => null);
        }

        if (!optionToSelect) {
            return null;
        }

        await dashboardPage.selectEventByLabel(optionToSelect);
        await expect
            .poll(() => dashboardPage.getSelectedEventOptionText(), { timeout })
            .toBe(optionToSelect);

        return optionToSelect;
    }

    static async waitForKpiChange(pageManager: PageManager, kpiDataBefore: Record<string, string>, timeout: number) {
        await expect
            .poll(async () => {
                const kpiDataCurrent: Record<string, string> = await pageManager.getDashboardPage().getDashboardKpiDataSet();
                const kpiKeys = Object.keys(kpiDataBefore);
                return kpiKeys.some((kpiLabel) => kpiDataBefore[kpiLabel] !== kpiDataCurrent[kpiLabel]);
            }, { timeout })
            .toBeTruthy();
    }

    static hasKpiChange(kpiDataBefore: Record<string, string>, kpiDataAfter: Record<string, string>) {
        const kpiKeys = Object.keys(kpiDataBefore);
        return kpiKeys.some((kpiLabel) => kpiDataBefore[kpiLabel] !== kpiDataAfter[kpiLabel]);
    }
}
