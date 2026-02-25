import { Page } from "@playwright/test";

export default class SettingsPage {

  private readonly settingsResetPasswordContainer = "Need to update your password?";

  constructor(private page: Page) {}

  getSettingsResetPasswordContainer() {
    return this.page.getByText(this.settingsResetPasswordContainer).first();
  }

}
