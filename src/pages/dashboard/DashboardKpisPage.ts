import { Page } from "@playwright/test";

export const DASHBOARD_KPI_LABELS = {
  eventTotalRecords: "Event Total Records",
  totalICP: "Total ICP",
  totalLeads: "Total Leads",
  totalAttendeesEngaged: "Total Attendees Engaged",
} as const;

export type DashboardKpiLabel = (typeof DASHBOARD_KPI_LABELS)[keyof typeof DASHBOARD_KPI_LABELS];

export default class DashboardKpisPage {
  constructor(private page: Page) {}

  getEventTotalRecordsLabel() {
    return this.page.getByText(DASHBOARD_KPI_LABELS.eventTotalRecords, { exact: true }).first();
  }

  getTotalICPLabel() {
    return this.page.getByText(DASHBOARD_KPI_LABELS.totalICP, { exact: true }).first();
  }

  getTotalLeadsLabel() {
    return this.page.getByText(DASHBOARD_KPI_LABELS.totalLeads, { exact: true }).first();
  }

  getTotalAttendeesEngagedLabel() {
    return this.page.getByText(DASHBOARD_KPI_LABELS.totalAttendeesEngaged, { exact: true }).first();
  }

  private async getKpiNumericValueByLabel(label: DashboardKpiLabel) {
    return await this.page.evaluate((targetLabel) => {
      const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
      const extractFirstNumeric = (value: string) => {
        const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
        return match ? match[0] : "";
      };

      const allElements = Array.from(document.querySelectorAll("*"));
      const exactLabelElements = allElements.filter((element) => normalize(element.textContent || "") === targetLabel);

      for (const labelElement of exactLabelElements) {
        const parentElement = labelElement.parentElement;
        if (!parentElement) {
          continue;
        }

        const siblings = Array.from(parentElement.children);
        const labelIndex = siblings.indexOf(labelElement);
        if (labelIndex > 0) {
          const siblingText = normalize(siblings[labelIndex - 1]?.textContent || "");
          const siblingNumericValue = extractFirstNumeric(siblingText);
          if (siblingNumericValue) {
            return siblingNumericValue;
          }
        }

        const parentText = normalize(parentElement.textContent || "");
        const parentNumericValue = extractFirstNumeric(parentText.replace(targetLabel, " "));
        if (parentNumericValue) {
          return parentNumericValue;
        }
      }

      const fuzzyLabelElement = allElements.find((element) => normalize(element.textContent || "").includes(targetLabel));
      if (!fuzzyLabelElement) {
        return "";
      }

      const fuzzyNumericValue = extractFirstNumeric(normalize(fuzzyLabelElement.textContent || "").replace(targetLabel, " "));
      return fuzzyNumericValue || "";
    }, label);
  }

  async getDashboardKpiDataSet() {
    return {
      [DASHBOARD_KPI_LABELS.eventTotalRecords]: await this.getKpiNumericValueByLabel(DASHBOARD_KPI_LABELS.eventTotalRecords),
      [DASHBOARD_KPI_LABELS.totalICP]: await this.getKpiNumericValueByLabel(DASHBOARD_KPI_LABELS.totalICP),
      [DASHBOARD_KPI_LABELS.totalLeads]: await this.getKpiNumericValueByLabel(DASHBOARD_KPI_LABELS.totalLeads),
      [DASHBOARD_KPI_LABELS.totalAttendeesEngaged]: await this.getKpiNumericValueByLabel(DASHBOARD_KPI_LABELS.totalAttendeesEngaged),
    };
  }
}
