import { Locator, Page } from "@playwright/test";

export default class DashboardGraphPage {
  constructor(private page: Page) {}

  getIcpMatchRateLabel() {
    return this.page.getByText("ICP Match Rate", { exact: true }).last();
  }

  getGraphContainer() {
    return this.getIcpMatchRateLabel().locator("xpath=ancestor::*[contains(normalize-space(.), 'Average ICP:')][1]");
  }

  private async readNormalizedText(locator: Locator) {
    const text = (await locator.textContent()) || "";
    return text.replace(/\s+/g, " ").trim();
  }

  private extractFirstPercentValue(value: string) {
    const match = value.replace(/,/g, "").match(/(-?\d+(?:\.\d+)?)\s*%/);
    return match ? Number(match[1]) : null;
  }

  async getGraphContainerText() {
    return await this.readNormalizedText(this.getGraphContainer());
  }

  async getIcpMatchRatePercentageValue() {
    return await this.page.evaluate(() => {
      const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
      const parsePercent = (value: string) => {
        const match = value.replace(/,/g, "").match(/(-?\d+(?:\.\d+)?)\s*%/);
        return match ? Number(match[1]) : null;
      };

      const allElements = Array.from(document.querySelectorAll("*"));
      const labelElements = allElements.filter((element) => normalize(element.textContent || "") === "ICP Match Rate");

      for (const labelElement of [...labelElements].reverse()) {
        const parentElement = labelElement.parentElement;
        if (!parentElement) {
          continue;
        }

        const siblings = Array.from(parentElement.children);
        const labelIndex = siblings.indexOf(labelElement);

        for (let index = labelIndex + 1; index < siblings.length; index++) {
          const siblingPercent = parsePercent(normalize(siblings[index]?.textContent || ""));
          if (siblingPercent !== null) {
            return siblingPercent;
          }
        }

        const parentText = normalize(parentElement.textContent || "");
        const parentMatch = parentText.match(/ICP Match Rate\s*(-?\d+(?:\.\d+)?)%/i);
        if (parentMatch) {
          return Number(parentMatch[1]);
        }

        const nextBlockPercent = parsePercent(normalize(parentElement.nextElementSibling?.textContent || ""));
        if (nextBlockPercent !== null) {
          return nextBlockPercent;
        }
      }

      return null;
    });
  }

  parseMatchRateFromText(value: string) {
    return this.extractFirstPercentValue(value);
  }
}
