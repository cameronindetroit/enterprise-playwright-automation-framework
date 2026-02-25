import { Page } from "@playwright/test";

export default class FAQPage {

  private readonly faqContainerLocator = /Product Overview|Share ICP/i;

  constructor(private page: Page) {}

  getFAQContainer() {
    return this.page.getByText(this.faqContainerLocator).first();
  }

}
