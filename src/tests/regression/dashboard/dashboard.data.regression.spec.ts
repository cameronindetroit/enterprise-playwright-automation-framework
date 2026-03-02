import { test, expect } from "./dashboardRegression.fixtures";
import DashboardE2EHelper from "../../helpers/DashboardE2EHelper";
import { DASHBOARD_KPI_LABELS } from "../../../pages/dashboard/DashboardKpisPage";
import DashboardKpiDataHelper from "../../helpers/DashboardKpiDataHelper";

const UI_TIMEOUT = 20000;
const API_TIMEOUT = 45000;
const EXPECTED_DASHBOARD_AUTH_TOKEN = (process.env.EXPECTED_DASHBOARD_AUTH_TOKEN || "").trim();

const KPI_LABELS = DASHBOARD_KPI_LABELS;

test.use({ trace: "off", screenshot: "off" });

test("Regression | Dashboard data from API matches KPI UI values @regression", async ({ pageManager, page }) => {
  test.setTimeout(90000);

  const dashboardPage = pageManager.getDashboardPage();

  await expect(dashboardPage.getDashboardTitle()).toBeVisible({ timeout: UI_TIMEOUT });
  await DashboardE2EHelper.waitForKpisToLoad(pageManager, API_TIMEOUT);

  const dashboardDataResponsePromise = page.waitForResponse(
    (response) =>
      response.ok() &&
      response.request().method() === "GET" &&
      DashboardKpiDataHelper.isDashboardDataEndpoint(response.url(), EXPECTED_DASHBOARD_AUTH_TOKEN),
    { timeout: API_TIMEOUT },
  );

  const [dashboardDataResponse] = await Promise.all([
    dashboardDataResponsePromise,
    page.reload({ waitUntil: "domcontentloaded" }),
  ]);

  const dashboardDataPayload = await dashboardDataResponse.json();

  const expectedKpiData = DashboardKpiDataHelper.buildExpectedKpiData(dashboardDataPayload, KPI_LABELS);
  const payloadNumericValues = DashboardKpiDataHelper.collectNumericValues(dashboardDataPayload);
  const hasDirectFieldMapping = DashboardKpiDataHelper.hasDashboardKpiShape(dashboardDataPayload, KPI_LABELS);

  await DashboardE2EHelper.waitForKpisToLoad(pageManager, API_TIMEOUT);

  for (const [kpiLabel, expectedValue] of Object.entries(expectedKpiData) as Array<[keyof typeof expectedKpiData, unknown]>) {
    if (hasDirectFieldMapping) {
      const expectedNumericValue = DashboardKpiDataHelper.toNumericString(expectedValue);
      expect(expectedNumericValue, `${kpiLabel} is missing from dashboard API payload.`).not.toBe("");

      await expect
        .poll(async () => {
          const currentUiKpiData = await pageManager.getDashboardKpisPage().getDashboardKpiDataSet();
          const currentNumericValue = currentUiKpiData[kpiLabel];
          return currentNumericValue === expectedNumericValue;
        }, { timeout: API_TIMEOUT })
        .toBeTruthy();

      const finalUiKpiData = await pageManager.getDashboardKpisPage().getDashboardKpiDataSet();
      const finalNumericValue = finalUiKpiData[kpiLabel];
      console.log(
        `[KPI-MATCH][direct] ${kpiLabel} | API=${expectedNumericValue} | UI=${finalNumericValue} | MATCH=${finalNumericValue === expectedNumericValue}`,
      );
      expect(finalNumericValue, `${kpiLabel} UI value should match API response value.`).toBe(expectedNumericValue);
      continue;
    }

    await expect
      .poll(async () => {
        const currentUiKpiData = await pageManager.getDashboardKpisPage().getDashboardKpiDataSet();
        const currentNumericValue = currentUiKpiData[kpiLabel];
        return currentNumericValue.length > 0 && payloadNumericValues.has(currentNumericValue);
      }, { timeout: API_TIMEOUT })
      .toBeTruthy();

    const finalUiKpiData = await pageManager.getDashboardKpisPage().getDashboardKpiDataSet();
    const finalNumericValue = finalUiKpiData[kpiLabel];
    console.log(
      `[KPI-MATCH][fallback] ${kpiLabel} | UI=${finalNumericValue} | IN_API_NUMERIC_SET=${payloadNumericValues.has(finalNumericValue)}`,
    );
    expect(
      payloadNumericValues.has(finalNumericValue),
      `${kpiLabel} UI value should exist in dashboard API payload when direct field mapping is unavailable.`,
    ).toBeTruthy();
  }
});
