import { DASHBOARD_KPI_LABELS, DashboardKpiLabel } from "../../pages/DashboardKpisPage";

type KpiLabelKey = keyof typeof DASHBOARD_KPI_LABELS;
type KpiLabels = typeof DASHBOARD_KPI_LABELS;

export default class DashboardKpiDataHelper {
  private static readonly DASHBOARD_DATA_ENDPOINT_BASE = "https://database-red.adalo.com/databases/a1ab1856443b44fcbe8d838f7fcfa88b/tables/t_5fi9vn22j1ibyg3p7mizk8hlm";

  private static readonly DASHBOARD_DATA_QUERY_PARAMS: Record<string, string> = {
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

  private static readonly KPI_KEY_ALIASES: Record<KpiLabelKey, string[]> = {
    eventTotalRecords: ["eventtotalrecords", "event_total_records", "eventrecords", "totalrecords"],
    totalICP: ["totalicp", "total_icp", "icptotal", "icpcount"],
    totalLeads: ["totalleads", "total_leads", "leadcount", "leads"],
    totalAttendeesEngaged: ["totalattendeesengaged", "total_attendees_engaged", "attendeesengaged", "engagedattendees"],
  };

  private static normalizeKey(value: string) {
    return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
  }

  private static isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
  }

  static toNumericString(value: unknown) {
    const raw = String(value ?? "").replace(/,/g, "").trim();
    const match = raw.match(/-?\d+(?:\.\d+)?/);
    return match ? match[0] : "";
  }

  private static findValueByAliases(payload: unknown, aliases: readonly string[]): unknown {
    if (!this.isRecord(payload) && !Array.isArray(payload)) {
      return undefined;
    }

    const normalizedAliases = aliases.map(this.normalizeKey);
    const queue: unknown[] = [payload];

    while (queue.length > 0) {
      const current = queue.shift();

      if (Array.isArray(current)) {
        queue.push(...current);
        continue;
      }

      if (!this.isRecord(current)) {
        continue;
      }

      for (const [key, value] of Object.entries(current)) {
        if (normalizedAliases.includes(this.normalizeKey(key)) && this.toNumericString(value)) {
          return value;
        }

        if (this.isRecord(value) || Array.isArray(value)) {
          queue.push(value);
        }
      }
    }

    return undefined;
  }

  static buildExpectedKpiData(payload: unknown, labels: KpiLabels = DASHBOARD_KPI_LABELS): Record<DashboardKpiLabel, unknown> {
    return {
      [labels.eventTotalRecords]: this.findValueByAliases(payload, this.KPI_KEY_ALIASES.eventTotalRecords),
      [labels.totalICP]: this.findValueByAliases(payload, this.KPI_KEY_ALIASES.totalICP),
      [labels.totalLeads]: this.findValueByAliases(payload, this.KPI_KEY_ALIASES.totalLeads),
      [labels.totalAttendeesEngaged]: this.findValueByAliases(payload, this.KPI_KEY_ALIASES.totalAttendeesEngaged),
    };
  }

  static hasDashboardKpiShape(payload: unknown, labels: KpiLabels = DASHBOARD_KPI_LABELS) {
    const expectedKpiData = this.buildExpectedKpiData(payload, labels);
    return Object.values(expectedKpiData).every((value) => !!this.toNumericString(value));
  }

  static collectNumericValues(payload: unknown) {
    const numericValues = new Set<string>();
    const queue: unknown[] = [payload];

    while (queue.length > 0) {
      const current = queue.shift();

      if (Array.isArray(current)) {
        queue.push(...current);
        continue;
      }

      if (!this.isRecord(current)) {
        const numericValue = this.toNumericString(current);
        if (numericValue) {
          numericValues.add(numericValue);
        }
        continue;
      }

      for (const value of Object.values(current)) {
        if (this.isRecord(value) || Array.isArray(value)) {
          queue.push(value);
          continue;
        }

        const numericValue = this.toNumericString(value);
        if (numericValue) {
          numericValues.add(numericValue);
        }
      }
    }

    return numericValues;
  }

  private static isLikelyJweToken(token: string) {
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

  private static doesAuthTokenMatchPolicy(actualToken: string, expectedDashboardAuthToken?: string) {
    if (!this.isLikelyJweToken(actualToken)) {
      return false;
    }

    if (!expectedDashboardAuthToken) {
      return true;
    }

    return actualToken === expectedDashboardAuthToken;
  }

  private static isNumericString(value: string) {
    return /^\d+$/.test(value.trim());
  }

  static isDashboardDataEndpoint(rawUrl: string, expectedDashboardAuthToken?: string) {
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(rawUrl);
    } catch {
      return false;
    }

    const baseUrl = `${parsedUrl.origin}${parsedUrl.pathname}`;
    if (baseUrl !== this.DASHBOARD_DATA_ENDPOINT_BASE) {
      return false;
    }

    for (const [paramName, expectedValue] of Object.entries(this.DASHBOARD_DATA_QUERY_PARAMS)) {
      if (parsedUrl.searchParams.get(paramName) !== expectedValue) {
        return false;
      }
    }

    const authUserValue = parsedUrl.searchParams.get("auth[1][value]") || "";
    if (!this.isNumericString(authUserValue)) {
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
    return this.doesAuthTokenMatchPolicy(authHeaderValue, expectedDashboardAuthToken);
  }
}
