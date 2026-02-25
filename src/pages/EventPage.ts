import { Page, expect } from "@playwright/test";
import logger from "../utils/LoggerUtil";

export default class EventPage {

  private readonly eventsContainerHeaderLocator = "Company Enrich";


  constructor(private page: Page) {}

  getEventsContainerHeader() {
    return this.page.getByText(this.eventsContainerHeaderLocator, { exact: true }).first();
  }

}
