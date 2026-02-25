import { Page } from "@playwright/test";

export default class FeatureBugRequestPage {

  private readonly featureBugRequestContainerLocator = /Feature\/Bug Request|Feature Request|Bug Request/i;

  constructor(private page: Page) {}

  getFeatureBugRequestContainer() {
    return this.page.getByText(this.featureBugRequestContainerLocator).first();
  }

}
