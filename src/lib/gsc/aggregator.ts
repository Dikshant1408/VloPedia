/**
 * VloPedia — GSC Search Telemetry Aggregator
 * 
 * Aggregates normalized SearchSnapshotRow records across URLs, Queries,
 * Devices, and Countries, and calculates authentic time-series trend velocity
 * across daily snapshot windows (7-day, 28-day, 90-day).
 */

import {
  SearchSnapshotRow,
  DailySearchSnapshot,
  DeviceSearchPerformance,
  CountrySearchPerformance,
  PeriodTrendResult,
} from "./types";

export interface AggregatedUrlMetric {
  url: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
  topQueries: Array<{ query: string; impressions: number; position: number }>;
}

export interface AggregatedQueryMetric {
  query: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
  urls: string[];
}

export class GscAggregator {
  /**
   * Aggregates rows by URL with impressions, clicks, calculated CTR, and weighted position
   */
  public static aggregateByUrl(rows: SearchSnapshotRow[]): AggregatedUrlMetric[] {
    const urlMap = new Map<string, {
      impressions: number;
      clicks: number;
      weightedPosSum: number;
      queries: Map<string, { impressions: number; position: number }>;
    }>();

    for (const row of rows) {
      if (!urlMap.has(row.url)) {
        urlMap.set(row.url, {
          impressions: 0,
          clicks: 0,
          weightedPosSum: 0,
          queries: new Map(),
        });
      }
      const acc = urlMap.get(row.url)!;
      acc.impressions += row.impressions;
      acc.clicks += row.clicks;
      acc.weightedPosSum += row.position * row.impressions;

      const qRecord = acc.queries.get(row.query) || { impressions: 0, position: row.position };
      qRecord.impressions += row.impressions;
      qRecord.position = row.position;
      acc.queries.set(row.query, qRecord);
    }

    const results: AggregatedUrlMetric[] = [];
    for (const [url, acc] of urlMap.entries()) {
      const avgPosition = acc.impressions > 0 
        ? Number((acc.weightedPosSum / acc.impressions).toFixed(2)) 
        : 100;
      const ctr = acc.impressions > 0 
        ? Number((acc.clicks / acc.impressions).toFixed(4)) 
        : 0;

      const topQueries = Array.from(acc.queries.entries())
        .map(([query, data]) => ({ query, impressions: data.impressions, position: data.position }))
        .sort((a, b) => b.impressions - a.impressions)
        .slice(0, 5);

      results.push({
        url,
        impressions: acc.impressions,
        clicks: acc.clicks,
        ctr,
        avgPosition,
        topQueries,
      });
    }

    return results.sort((a, b) => b.impressions - a.impressions);
  }

  /**
   * Aggregates rows by search query
   */
  public static aggregateByQuery(rows: SearchSnapshotRow[]): AggregatedQueryMetric[] {
    const queryMap = new Map<string, {
      impressions: number;
      clicks: number;
      weightedPosSum: number;
      urls: Set<string>;
    }>();

    for (const row of rows) {
      if (!queryMap.has(row.query)) {
        queryMap.set(row.query, {
          impressions: 0,
          clicks: 0,
          weightedPosSum: 0,
          urls: new Set(),
        });
      }
      const acc = queryMap.get(row.query)!;
      acc.impressions += row.impressions;
      acc.clicks += row.clicks;
      acc.weightedPosSum += row.position * row.impressions;
      acc.urls.add(row.url);
    }

    const results: AggregatedQueryMetric[] = [];
    for (const [query, acc] of queryMap.entries()) {
      const avgPosition = acc.impressions > 0 
        ? Number((acc.weightedPosSum / acc.impressions).toFixed(2)) 
        : 100;
      const ctr = acc.impressions > 0 
        ? Number((acc.clicks / acc.impressions).toFixed(4)) 
        : 0;

      results.push({
        query,
        impressions: acc.impressions,
        clicks: acc.clicks,
        ctr,
        avgPosition,
        urls: Array.from(acc.urls),
      });
    }

    return results.sort((a, b) => b.impressions - a.impressions);
  }

  /**
   * Aggregates rows by device (Mobile vs Desktop vs Tablet)
   */
  public static aggregateByDevice(rows: SearchSnapshotRow[]): DeviceSearchPerformance[] {
    const devices: Array<"Mobile" | "Desktop" | "Tablet"> = ["Mobile", "Desktop", "Tablet"];
    
    return devices.map(devName => {
      const targetDevice = devName.toUpperCase() as "MOBILE" | "DESKTOP" | "TABLET";
      const devRows = rows.filter(r => r.device === targetDevice);
      const impressions = devRows.reduce((sum, r) => sum + r.impressions, 0);
      const clicks = devRows.reduce((sum, r) => sum + r.clicks, 0);
      const weightedPos = devRows.reduce((sum, r) => sum + (r.position * r.impressions), 0);
      const avgPosition = impressions > 0 ? Number((weightedPos / impressions).toFixed(2)) : 0;
      const ctr = impressions > 0 ? Number((clicks / impressions).toFixed(4)) : 0;

      return {
        device: devName,
        impressions,
        clicks,
        ctr,
        avgPosition,
      };
    });
  }

  /**
   * Aggregates rows by country
   */
  public static aggregateByCountry(rows: SearchSnapshotRow[]): CountrySearchPerformance[] {
    const countryNames: Record<string, string> = {
      US: "United States",
      IN: "India",
      PH: "Philippines",
      GB: "United Kingdom",
      CA: "Canada",
      DE: "Germany",
      AU: "Australia",
    };

    const countryMap = new Map<string, { impressions: number; clicks: number; weightedPos: number }>();
    for (const row of rows) {
      if (!countryMap.has(row.country)) {
        countryMap.set(row.country, { impressions: 0, clicks: 0, weightedPos: 0 });
      }
      const acc = countryMap.get(row.country)!;
      acc.impressions += row.impressions;
      acc.clicks += row.clicks;
      acc.weightedPos += row.position * row.impressions;
    }

    const results: CountrySearchPerformance[] = [];
    for (const [code, acc] of countryMap.entries()) {
      const avgPosition = acc.impressions > 0 
        ? Number((acc.weightedPos / acc.impressions).toFixed(2)) 
        : 0;

      results.push({
        country: countryNames[code] || code,
        code,
        impressions: acc.impressions,
        clicks: acc.clicks,
        avgPosition,
      });
    }

    return results.sort((a, b) => b.impressions - a.impressions);
  }

  /**
   * Computes multi-period trend comparison between two snapshots
   */
  public static computePeriodTrend(
    baseline: DailySearchSnapshot,
    current: DailySearchSnapshot,
    windowDays: number = 7
  ): PeriodTrendResult {
    const baselineImpr = baseline.totalImpressions;
    const currentImpr = current.totalImpressions;
    const imprGrowth = baselineImpr > 0 
      ? ((currentImpr - baselineImpr) / baselineImpr) * 100 
      : 100;

    const posDelta = Number((current.avgPosition - baseline.avgPosition).toFixed(2));
    
    let velocity: PeriodTrendResult["velocity"] = "STABLE";
    let momentumScore = 50;

    if (posDelta <= -2.0 && imprGrowth >= 50) {
      velocity = "VERY_HIGH";
      momentumScore = 95;
    } else if (posDelta < 0 || imprGrowth > 20) {
      velocity = "HIGH";
      momentumScore = 78;
    } else if (posDelta > 2.0 && imprGrowth < -10) {
      velocity = "DECAYING";
      momentumScore = 20;
    }

    return {
      periodLabel: `${windowDays}-Day Trend Window`,
      windowDays,
      baselineImpressions: baselineImpr,
      currentImpressions: currentImpr,
      impressionGrowthPct: Math.round(imprGrowth),
      baselineClicks: baseline.totalClicks,
      currentClicks: current.totalClicks,
      positionDelta: posDelta,
      avgPosition: current.avgPosition,
      momentumScore,
      velocity,
    };
  }

  /**
   * Computes dynamic headline dashboard metrics directly from a stored snapshot
   */
  public static computeHeadlineMetrics(snapshot: DailySearchSnapshot) {
    const devices = this.aggregateByDevice(snapshot.rows);
    const mobile = devices.find(d => d.device === "Mobile") || { avgPosition: 8.18, impressions: 0 };
    const desktop = devices.find(d => d.device === "Desktop") || { avgPosition: 31.12, impressions: 0 };
    const divergenceRanks = Number((desktop.avgPosition - mobile.avgPosition).toFixed(2));

    return {
      totalImpressions: snapshot.totalImpressions,
      totalClicks: snapshot.totalClicks,
      ctr: snapshot.avgCtr,
      avgPosition: snapshot.avgPosition,
      mobilePosition: mobile.avgPosition,
      desktopPosition: desktop.avgPosition,
      divergenceRanks,
      rowCount: snapshot.rows.length,
      snapshotDate: snapshot.date,
      isFixture: snapshot.source === "FIXTURE_FALLBACK",
    };
  }
}
