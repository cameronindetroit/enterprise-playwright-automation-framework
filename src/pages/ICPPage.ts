import { Page } from "@playwright/test";

export default class ICPPage {

  private readonly enrichcreditContainerLocator = /Enrich\s*credit|Select an ICP on the left to see your list|Select an ICP/i;
  private readonly enrichICPButtonLocator = "Enrich ICP";
  private readonly enrichICPExternalButtonLocator = "Enrich ICP (External)";

  constructor(private page: Page) {}

  getEnrichcreditContainer() {
    return this.page.getByText(this.enrichcreditContainerLocator).first();
  }

  getEnrichICPButton() {
    return this.page.getByText(this.enrichICPButtonLocator, { exact: true }).first();
  }

  getEnrichICPExternalButton() {
    return this.page.getByText(this.enrichICPExternalButtonLocator, { exact: true }).first();
  }

}
