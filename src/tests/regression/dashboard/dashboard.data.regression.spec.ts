import { test, expect } from "./dashboardRegression.fixtures";
import DashboardE2EHelper from "../../helpers/DashboardE2EHelper";
import { Page } from "@playwright/test";

const UI_TIMEOUT = 20000;
const API_TIMEOUT = 45000;
const DASHBOARD_DATA_ENDPOINT_BASE = "https://database-red.adalo.com/databases/a1ab1856443b44fcbe8d838f7fcfa88b/tables/t_5fi9vn22j1ibyg3p7mizk8hlm";
const EXPECTED_DASHBOARD_AUTH_TOKEN = (process.env.EXPECTED_DASHBOARD_AUTH_TOKEN || "").trim();

const DASHBOARD_DATA_QUERY_PARAMS: Record<string, string> = {
  appId: "bc42cf0d-5f14-4b90-bf2f-262a1cb9bf04",
  componentId: "3ttxbity0qf2mn7bkvyvxhww7",
  bindingIds: "4w0meq26guhjxm1ml1ubil4b4",
  imageMeta: "true",
  evaluateBindings: "true",
  "auth[0][name]": "Authorization",
  "auth[0][type]": "header",
  "auth[1][name]": "user_id",
  "auth[1][type]": "query",
};

const KPI_LABELS = {
  eventTotalRecords: "Event Total Records",
  totalICP: "Total ICP",
  totalLeads: "Total Leads",
  totalAttendeesEngaged: "Total Attendees Engaged",
} as const;

const KPI_KEY_ALIASES: Record<keyof typeof KPI_LABELS, string[]> = {
  eventTotalRecords: ["eventtotalrecords", "event_total_records", "eventrecords", "totalrecords"],
  totalICP: ["totalicp", "total_icp", "icptotal", "icpcount"],
  totalLeads: ["totalleads", "total_leads", "leadcount", "leads"],
  totalAttendeesEngaged: ["totalattendeesengaged", "total_attendees_engaged", "attendeesengaged", "engagedattendees"],
};

function normalizeKey(value: string) {
  return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toNumericString(value: unknown) {
  const raw = String(value ?? "").replace(/,/g, "").trim();
  const match = raw.match(/-?\d+(?:\.\d+)?/);
  return match ? match[0] : "";
}

function findValueByAliases(payload: unknown, aliases: string[]): unknown {
  if (!isRecord(payload) && !Array.isArray(payload)) {
    return undefined;
  }

  const normalizedAliases = aliases.map(normalizeKey);
  const queue: unknown[] = [payload];

  while (queue.length > 0) {
    const current = queue.shift();

    if (Array.isArray(current)) {
      queue.push(...current);
      continue;
    }

    if (!isRecord(current)) {
      continue;
    }

    for (const [key, value] of Object.entries(current)) {
      if (normalizedAliases.includes(normalizeKey(key)) && toNumericString(value)) {
        return value;
      }

      if (isRecord(value) || Array.isArray(value)) {
        queue.push(value);
      }
    }
  }

  return undefined;
}

function buildExpectedKpiData(payload: unknown) {
  return {
    [KPI_LABELS.eventTotalRecords]: findValueByAliases(payload, KPI_KEY_ALIASES.eventTotalRecords),
    [KPI_LABELS.totalICP]: findValueByAliases(payload, KPI_KEY_ALIASES.totalICP),
    [KPI_LABELS.totalLeads]: findValueByAliases(payload, KPI_KEY_ALIASES.totalLeads),
    [KPI_LABELS.totalAttendeesEngaged]: findValueByAliases(payload, KPI_KEY_ALIASES.totalAttendeesEngaged),
  };
}

function hasDashboardKpiShape(payload: unknown) {
  const expectedKpiData = buildExpectedKpiData(payload);
  return Object.values(expectedKpiData).every((value) => !!toNumericString(value));
}

function collectNumericValues(payload: unknown) {
  const numericValues = new Set<string>();
  const queue: unknown[] = [payload];

  while (queue.length > 0) {
    const current = queue.shift();

    if (Array.isArray(current)) {
      queue.push(...current);
      continue;
    }

    if (!isRecord(current)) {
      const numericValue = toNumericString(current);
      if (numericValue) {
        numericValues.add(numericValue);
      }
      continue;
    }

    for (const value of Object.values(current)) {
      if (isRecord(value) || Array.isArray(value)) {
        queue.push(value);
        continue;
      }

      const numericValue = toNumericString(value);
      if (numericValue) {
        numericValues.add(numericValue);
      }
    }
  }

  return numericValues;
}

function getUiNumericValue(kpiCardText: string, label: string) {
  const withoutLabel = kpiCardText.replace(label, " ");
  return toNumericString(withoutLabel || kpiCardText);
}

async function getUiKpiNumericValueByLabel(page: Page, label: string) {
  return await page.evaluate((targetLabel) => {
    const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
    const extractFirstNumeric = (value: string) => {
      const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
      return match ? match[0] : "";
    };

    const allElements = Array.from(document.querySelectorAll("*"));
    const exactLabelElements = allElements.filter((element) => normalize(element.textContent || "") === targetLabel);

    for (const labelElement of exactLabelElements) {
      const parentElement = labelElement.parentElement;
      if (!parentElement) {
        continue;
      }

      const siblings = Array.from(parentElement.children);
      const labelIndex = siblings.indexOf(labelElement);
      if (labelIndex > 0) {
        const siblingText = normalize(siblings[labelIndex - 1]?.textContent || "");
        const siblingNumericValue = extractFirstNumeric(siblingText);
        if (siblingNumericValue) {
          return siblingNumericValue;
        }
      }

      const parentText = normalize(parentElement.textContent || "");
      const parentNumericValue = extractFirstNumeric(parentText.replace(targetLabel, " "));
      if (parentNumericValue) {
        return parentNumericValue;
      }
    }

    const fuzzyLabelElement = allElements.find((element) => normalize(element.textContent || "").includes(targetLabel));
    if (!fuzzyLabelElement) {
      return "";
    }

    const fuzzyNumericValue = extractFirstNumeric(normalize(fuzzyLabelElement.textContent || "").replace(targetLabel, " "));
    return fuzzyNumericValue || "";
  }, label);
}

async function getUiKpiDataSetFromPage(page: Page) {
  return {
    [KPI_LABELS.eventTotalRecords]: await getUiKpiNumericValueByLabel(page, KPI_LABELS.eventTotalRecords),
    [KPI_LABELS.totalICP]: await getUiKpiNumericValueByLabel(page, KPI_LABELS.totalICP),
    [KPI_LABELS.totalLeads]: await getUiKpiNumericValueByLabel(page, KPI_LABELS.totalLeads),
    [KPI_LABELS.totalAttendeesEngaged]: await getUiKpiNumericValueByLabel(page, KPI_LABELS.totalAttendeesEngaged),
  };
}

function isLikelyJweToken(token: string) {
  const trimmedToken = token.trim();
  if (!trimmedToken || trimmedToken.length < 80) {
    return false;
  }

  const segments = trimmedToken.split(".");
  if (segments.length !== 5) {
    return false;
  }

  return segments.every((segment) => /^[A-Za-z0-9_-]*$/.test(segment));
}

function doesAuthTokenMatchPolicy(actualToken: string) {
  if (!isLikelyJweToken(actualToken)) {
    return false;
  }

  if (!EXPECTED_DASHBOARD_AUTH_TOKEN) {
    return true;
  }

  return actualToken === EXPECTED_DASHBOARD_AUTH_TOKEN;
}

function isNumericString(value: string) {
  return /^\d+$/.test(value.trim());
}

function isDashboardDataEndpoint(rawUrl: string) {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    return false;
  }

  const baseUrl = `${parsedUrl.origin}${parsedUrl.pathname}`;
  if (baseUrl !== DASHBOARD_DATA_ENDPOINT_BASE) {
    return false;
  }

  for (const [paramName, expectedValue] of Object.entries(DASHBOARD_DATA_QUERY_PARAMS)) {
    if (parsedUrl.searchParams.get(paramName) !== expectedValue) {
      return false;
    }
  }

  const authUserValue = parsedUrl.searchParams.get("auth[1][value]") || "";
  if (!isNumericString(authUserValue)) {
    return false;
  }

  const includeParam = parsedUrl.searchParams.get("include");
  const countsParam = parsedUrl.searchParams.get("counts");
  if (includeParam !== null && includeParam !== "") {
    return false;
  }
  if (countsParam !== null && countsParam !== "") {
    return false;
  }

  const authHeaderValue = parsedUrl.searchParams.get("auth[0][value]") || "";
  return doesAuthTokenMatchPolicy(authHeaderValue);
}

test("Regression | Dashboard data from API matches KPI UI values @regression", async ({ pageManager, page }) => {
  test.setTimeout(90000);

  const dashboardPage = pageManager.getDashboardPage();

  await expect(dashboardPage.getDashboardTitle()).toBeVisible({ timeout: UI_TIMEOUT });
  await DashboardE2EHelper.waitForKpisToLoad(pageManager, API_TIMEOUT);

  const dashboardDataRequestPromise = page.waitForRequest(
    (request) => request.method() === "GET" && isDashboardDataEndpoint(request.url()),
    { timeout: API_TIMEOUT },
  );

  const [dashboardDataRequest] = await Promise.all([
    dashboardDataRequestPromise,
    page.reload({ waitUntil: "domcontentloaded" }),
  ]);

  const dashboardDataApiResponse = await page.request.get(dashboardDataRequest.url(), { timeout: API_TIMEOUT });
  expect(dashboardDataApiResponse.ok(), "Dashboard data endpoint should return a successful response.").toBeTruthy();

  const dashboardDataPayload = await dashboardDataApiResponse.json();

  const expectedKpiData = buildExpectedKpiData(dashboardDataPayload);
  const payloadNumericValues = collectNumericValues(dashboardDataPayload);
  const uiKpiData = await getUiKpiDataSetFromPage(page);
  const hasDirectFieldMapping = hasDashboardKpiShape(dashboardDataPayload);

  for (const [kpiLabel, expectedValue] of Object.entries(expectedKpiData) as Array<[keyof typeof expectedKpiData, unknown]>) {
    const actualNumericValue = getUiNumericValue(uiKpiData[kpiLabel], kpiLabel);
    expect(actualNumericValue, `${kpiLabel} is missing from dashboard UI.`).not.toBe("");

    if (hasDirectFieldMapping) {
      const expectedNumericValue = toNumericString(expectedValue);
      console.log(
        `[KPI-MATCH][direct] ${kpiLabel} | API=${expectedNumericValue} | UI=${actualNumericValue} | MATCH=${actualNumericValue === expectedNumericValue}`,
      );
      expect(expectedNumericValue, `${kpiLabel} is missing from dashboard API payload.`).not.toBe("");
      expect(actualNumericValue, `${kpiLabel} UI value should match API response value.`).toBe(expectedNumericValue);
      continue;
    }

    console.log(
      `[KPI-MATCH][fallback] ${kpiLabel} | UI=${actualNumericValue} | IN_API_NUMERIC_SET=${payloadNumericValues.has(actualNumericValue)}`,
    );
    expect(
      payloadNumericValues.has(actualNumericValue),
      `${kpiLabel} UI value should exist in dashboard API payload when direct field mapping is unavailable.`,
    ).toBeTruthy();
  }
});
