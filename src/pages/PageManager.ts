import { Page } from "@playwright/test";
import LoginPage from "./LoginPage";
import HomePage from "./home/HomePage";
import EventPage from "./EventPage";
import ICPPage from "./ICPPage";
import DataRequestPage from "./dashboard/DataRequestPage";
import SettingsPage from "./SettingsPage";
import FAQPage from "./home/FAQPage";
import FeatureBugRequestPage from "./home/FeatureBugRequestPage";
import DashboardPage from "./dashboard/DashboardPage";
import DashboardKpisPage from "./dashboard/DashboardKpisPage";
import DashboardGraphPage from "./dashboard/DashboardGraphPage";

export default class PageManager {
  private loginPage?: LoginPage;
  private homePage?: HomePage;
  private eventPage?: EventPage;
  private icpPage?: ICPPage;
  private dataRequestPage?: DataRequestPage;
  private settingsPage?: SettingsPage;
  private faqPage?: FAQPage;
  private featureBugRequestPage?: FeatureBugRequestPage;
  private dashboardPage?: DashboardPage;
  private dashboardKpisPage?: DashboardKpisPage;
  private dashboardGraphPage?: DashboardGraphPage;

  constructor(private page: Page) {}

  getPage() {
    return this.page;
  }

  getLoginPage() {
    if (!this.loginPage) {
      this.loginPage = new LoginPage(this.page);
    }
    return this.loginPage;
  }

  getHomePage() {
    if (!this.homePage) {
      this.homePage = new HomePage(this.page);
    }
    return this.homePage;
  }

  getEventPage() {
    if (!this.eventPage) {
      this.eventPage = new EventPage(this.page);
    }
    return this.eventPage;
  }

  getICPPage() {
    if (!this.icpPage) {
      this.icpPage = new ICPPage(this.page);
    }
    return this.icpPage;
  }

  getDataRequestPage() {
    if (!this.dataRequestPage) {
      this.dataRequestPage = new DataRequestPage(this.page);
    }
    return this.dataRequestPage;
  }

  getSettingsPage() {
    if (!this.settingsPage) {
      this.settingsPage = new SettingsPage(this.page);
    }
    return this.settingsPage;
  }

  getFAQPage() {
    if (!this.faqPage) {
      this.faqPage = new FAQPage(this.page);
    }
    return this.faqPage;
  }

  getFeatureBugRequestPage() {
    if (!this.featureBugRequestPage) {
      this.featureBugRequestPage = new FeatureBugRequestPage(this.page);
    }
    return this.featureBugRequestPage;
  }

  getDashboardPage() {
    if (!this.dashboardPage) {
      this.dashboardPage = new DashboardPage(this.page);
    }
    return this.dashboardPage;
  }

  getDashboardKpisPage() {
    if (!this.dashboardKpisPage) {
      this.dashboardKpisPage = new DashboardKpisPage(this.page);
    }
    return this.dashboardKpisPage;
  }

  getDashboardGraphPage() {
    if (!this.dashboardGraphPage) {
      this.dashboardGraphPage = new DashboardGraphPage(this.page);
    }
    return this.dashboardGraphPage;
  }
}
