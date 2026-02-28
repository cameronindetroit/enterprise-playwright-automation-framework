import { test, expect } from "./dashboardRegression.fixtures";
import DashboardE2EHelper from "../../helpers/DashboardE2EHelper";
import DashboardGraphDataHelper from "../../helpers/DashboardGraphDataHelper";

const UI_TIMEOUT = 20000;
const API_TIMEOUT = 45000;
const EXPECTED_DASHBOARD_AUTH_TOKEN = (process.env.EXPECTED_DASHBOARD_AUTH_TOKEN || "").trim();

test.use({ trace: "off", screenshot: "off" });

test("Regression | Graph container title and ICP Match Rate align with API event data @regression", async ({ pageManager, page }) => {
  test.setTimeout(90000);

  const dashboardPage = pageManager.getDashboardPage();
  const dashboardGraphPage = pageManager.getDashboardGraphPage();

  await expect(dashboardPage.getDashboardTitle()).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(dashboardPage.getEventDropdown()).toBeVisible({ timeout: UI_TIMEOUT });
  await DashboardE2EHelper.waitForKpisToLoad(pageManager, API_TIMEOUT);

  const selectedEventLabel = await DashboardE2EHelper.selectRandomEventFromDropdown(pageManager, page, UI_TIMEOUT);
  if (!selectedEventLabel) {
    test.skip(true, "No selectable event options are available in this environment.");
  }

  const selectedEvent = selectedEventLabel || "";

  const dashboardDataResponsePromise = page.waitForResponse(
    (response) =>
      response.ok() &&
      response.request().method() === "GET" &&
      DashboardGraphDataHelper.isDashboardDataEndpoint(response.url(), EXPECTED_DASHBOARD_AUTH_TOKEN),
    { timeout: API_TIMEOUT },
  );

  await dashboardPage.clickLoadNewEvent();

  await expect
    .poll(() => dashboardPage.getSelectedEventOptionText(), { timeout: UI_TIMEOUT })
    .toBe(selectedEvent);

  const dashboardDataResponse = await dashboardDataResponsePromise;
  const dashboardDataPayload = await dashboardDataResponse.json();

  await expect(dashboardGraphPage.getGraphContainer()).toBeVisible({ timeout: UI_TIMEOUT });
  await expect(dashboardGraphPage.getGraphContainer()).toContainText(selectedEvent, { timeout: UI_TIMEOUT });

  const graphContainerText = await dashboardGraphPage.getGraphContainerText();
  const graphEventTitle = DashboardGraphDataHelper.extractGraphEventTitle(graphContainerText);
  const eventLookupTitle = graphEventTitle || selectedEvent;

  await expect
    .poll(async () => (await dashboardGraphPage.getIcpMatchRatePercentageValue()) !== null, { timeout: API_TIMEOUT })
    .toBeTruthy();

  const uiIcpMatchRatePercent = await dashboardGraphPage.getIcpMatchRatePercentageValue();
  expect(uiIcpMatchRatePercent, "UI ICP Match Rate percentage value is missing.").not.toBeNull();

  const eventMetrics = DashboardGraphDataHelper.getGraphEventMetricsBySelectedEvent(
    dashboardDataPayload,
    eventLookupTitle,
    uiIcpMatchRatePercent,
  );
  expect(eventMetrics, `Unable to locate graph event metrics in API payload for graph title: ${eventLookupTitle}`).not.toBeNull();

  const apiEventTitle = eventMetrics!.eventTitle.trim();
  if (apiEventTitle.length > 0) {
    expect(
      DashboardGraphDataHelper.normalizeTitle(graphContainerText),
      `Graph container title should include API event title. API title: ${apiEventTitle}`,
    ).toContain(DashboardGraphDataHelper.normalizeTitle(apiEventTitle));
  }

  const expectedMatchPercent = eventMetrics!.expectedMatchPercent;
  if (expectedMatchPercent === null) {
    test.skip(true, `API match-rate inputs are unavailable for event: ${eventLookupTitle}`);
    return;
  }

  expect(uiIcpMatchRatePercent!).toBeCloseTo(expectedMatchPercent, 0);

  console.log(
    `[GRAPH-MATCH] selected_event=${selectedEvent} | graph_title=${eventLookupTitle} | avg_icp_records=${eventMetrics!.averageIcpRecords} | average_event_total=${eventMetrics!.averageEventTotal} | API_EXPECTED=${expectedMatchPercent.toFixed(2)}% | UI=${uiIcpMatchRatePercent}%`,
  );
});
