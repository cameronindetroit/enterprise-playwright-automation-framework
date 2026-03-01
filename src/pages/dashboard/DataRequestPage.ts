import { Page } from "@playwright/test";

export default class DataRequestPage {

  private readonly dataRequestContainerLocator = "Conference Data";


  constructor(private page: Page) {}

  getDataRequestContainer() {
    return this.page.getByText(this.dataRequestContainerLocator).first();
  }

}
