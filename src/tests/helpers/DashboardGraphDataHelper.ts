import DashboardKpiDataHelper from "./DashboardKpiDataHelper";

export default class DashboardGraphDataHelper {
  private static readonly GRAPH_KEY_ALIASES = {
    averageIcpRecords: ["average_icp_records", "averageicprecords", "avg_icp_records", "avgicprecords", "avg_icp", "average_icp"],
    averageEventTotal: [
      "average_event_total",
      "averageeventtotal",
      "average_event_total_records",
      "averageeventtotalrecords",
      "event_total_records_average",
      "total_records_average",
      "average_total_records",
      "total_records",
    ],
    icpMatchRate: ["icp_match_rate", "icpmatchrate", "match_rate", "matchrate", "icp_rate"],
    eventTitle: ["event_title", "eventtitle", "event_name", "eventname", "title", "name"],
  } as const;

  private static normalizeKey(value: string) {
    return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
  }

  private static isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
  }

  static normalizeTitle(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  private static pickExpectedMatchPercent(
    formulaMatchPercent: number | null,
    directMatchRate: number | null,
    uiMatchRatePercent?: number | null,
  ) {
    const candidates = [formulaMatchPercent, directMatchRate].filter((value): value is number => value !== null);

    if (candidates.length === 0) {
      return null;
    }

    if (uiMatchRatePercent === undefined || uiMatchRatePercent === null) {
      return formulaMatchPercent ?? directMatchRate;
    }

    return candidates.reduce((best, current) => {
      const bestDelta = Math.abs(best - uiMatchRatePercent);
      const currentDelta = Math.abs(current - uiMatchRatePercent);
      return currentDelta < bestDelta ? current : best;
    });
  }

  private static toNumber(value: unknown) {
    const numeric = Number(DashboardKpiDataHelper.toNumericString(value));
    return Number.isFinite(numeric) ? numeric : null;
  }

  private static findValueByAliases(payload: unknown, aliases: readonly string[]): unknown {
    if (!this.isRecord(payload)) {
      return undefined;
    }

    const normalizedAliases = aliases.map((alias) => this.normalizeKey(alias));
    for (const [key, value] of Object.entries(payload)) {
      if (!normalizedAliases.includes(this.normalizeKey(key))) {
        continue;
      }

      if (typeof value === "string" && value.trim().length > 0) {
        return value;
      }

      if (typeof value === "number" && Number.isFinite(value)) {
        return value;
      }

      if (DashboardKpiDataHelper.toNumericString(value)) {
        return value;
      }
    }

    return undefined;
  }

  private static normalizeText(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  private static collectObjectCandidates(payload: unknown) {
    const candidates: Record<string, unknown>[] = [];
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

      candidates.push(current);

      for (const value of Object.values(current)) {
        if (this.isRecord(value) || Array.isArray(value)) {
          queue.push(value);
        }
      }
    }

    return candidates;
  }

  static extractGraphEventTitle(graphContainerText: string) {
    const normalizedText = graphContainerText.replace(/\s+/g, " ").trim();
    const match = normalizedText.match(/ICP Match Rate\s*-?\d+(?:\.\d+)?%\s*(.*)$/i);
    return (match?.[1] || "").trim();
  }

  static isDashboardDataEndpoint(rawUrl: string, expectedDashboardAuthToken?: string) {
    return DashboardKpiDataHelper.isDashboardDataEndpoint(rawUrl, expectedDashboardAuthToken);
  }

  static getGraphEventMetricsBySelectedEvent(payload: unknown, selectedEventLabel: string, uiMatchRatePercent?: number | null) {
    const normalizedSelectedEvent = this.normalizeText(selectedEventLabel);
    const objectCandidates = this.collectObjectCandidates(payload);

    let bestMatch: {
      eventTitle: string;
      averageIcpRecords: number;
      averageEventTotal: number;
      directMatchRate: number | null;
      expectedMatchPercent: number | null;
      matchRateDelta: number;
      score: number;
      titleExact: boolean;
    } | null = null;

    for (const candidate of objectCandidates) {
      const averageIcpRecordsRaw = this.findValueByAliases(candidate, this.GRAPH_KEY_ALIASES.averageIcpRecords);
      const averageEventTotalRaw = this.findValueByAliases(candidate, this.GRAPH_KEY_ALIASES.averageEventTotal);
      const directMatchRateRaw = this.findValueByAliases(candidate, this.GRAPH_KEY_ALIASES.icpMatchRate);

      const averageIcpRecords = this.toNumber(averageIcpRecordsRaw);
      const averageEventTotal = this.toNumber(averageEventTotalRaw);
      const directMatchRate = this.toNumber(directMatchRateRaw);

      const hasAverageInputs = averageIcpRecords !== null && averageEventTotal !== null;
      const hasDirectMatchRate = directMatchRate !== null;
      if (!hasAverageInputs && !hasDirectMatchRate) {
        continue;
      }

      const eventTitleRaw = this.findValueByAliases(candidate, this.GRAPH_KEY_ALIASES.eventTitle);
      const eventTitle = String(eventTitleRaw || "").trim();

      const allStringValues = Object.values(candidate)
        .filter((value) => typeof value === "string")
        .map((value) => String(value));

      const eventTexts = [eventTitle, ...allStringValues].map((value) => this.normalizeText(value)).filter(Boolean);
      const normalizedEventTitle = this.normalizeText(eventTitle);
      const titleExact = normalizedEventTitle === normalizedSelectedEvent;

      let score = 0;
      if (eventTexts.some((value) => value === normalizedSelectedEvent)) {
        score = 3;
      } else if (eventTexts.some((value) => value.includes(normalizedSelectedEvent) || normalizedSelectedEvent.includes(value))) {
        score = 2;
      } else if (eventTexts.some((value) => value.split(" ").some((token) => token && normalizedSelectedEvent.includes(token)))) {
        score = 1;
      }

      if (score === 0) {
        continue;
      }

      if (score === 1 && !titleExact) {
        continue;
      }

      const rankingAverageEventTotal = averageEventTotal ?? -1;
      const rankingAverageIcpRecords = averageIcpRecords ?? -1;
      const formulaMatchPercent = averageEventTotal && averageEventTotal > 0
        ? ((averageIcpRecords ?? 0) / averageEventTotal) * 100
        : null;

      const candidateExpectedMatchPercent = this.pickExpectedMatchPercent(
        formulaMatchPercent,
        directMatchRate,
        uiMatchRatePercent,
      );

      const candidateMatchRateDelta =
        uiMatchRatePercent !== undefined && uiMatchRatePercent !== null && candidateExpectedMatchPercent !== null
          ? Math.abs(candidateExpectedMatchPercent - uiMatchRatePercent)
          : Number.POSITIVE_INFINITY;

      const shouldReplaceBestMatch =
        !bestMatch ||
        (titleExact && !bestMatch.titleExact) ||
        (titleExact === bestMatch.titleExact && candidateMatchRateDelta < bestMatch.matchRateDelta) ||
        (titleExact === bestMatch.titleExact && candidateMatchRateDelta === bestMatch.matchRateDelta && score > bestMatch.score) ||
        (titleExact === bestMatch.titleExact && candidateMatchRateDelta === bestMatch.matchRateDelta && score === bestMatch.score && rankingAverageEventTotal > bestMatch.averageEventTotal) ||
        (titleExact === bestMatch.titleExact && candidateMatchRateDelta === bestMatch.matchRateDelta && score === bestMatch.score && rankingAverageEventTotal === bestMatch.averageEventTotal && rankingAverageIcpRecords > bestMatch.averageIcpRecords);

      if (shouldReplaceBestMatch) {
        bestMatch = {
          eventTitle,
          averageIcpRecords: averageIcpRecords ?? 0,
          averageEventTotal: averageEventTotal ?? 0,
          directMatchRate,
          expectedMatchPercent: candidateExpectedMatchPercent,
          matchRateDelta: candidateMatchRateDelta,
          score,
          titleExact,
        };
      }
    }

    if (!bestMatch) {
      return null;
    }

    return {
      eventTitle: bestMatch.eventTitle,
      averageIcpRecords: bestMatch.averageIcpRecords,
      averageEventTotal: bestMatch.averageEventTotal,
      directMatchRate: bestMatch.directMatchRate,
      expectedMatchPercent: bestMatch.expectedMatchPercent,
    };
  }
}
