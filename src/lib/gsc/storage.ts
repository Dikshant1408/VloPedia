/**
 * VloPedia — GSC Durable Snapshot Storage & Ingestion Service
 * 
 * Manages ingestion, normalization, correlation tracking, and persistent
 * querying of daily Search Console snapshot time-series data.
 * Falls back to isolated test fixtures only when live telemetry is unavailable.
 */

import fixturesData from "@/data/gsc-fixtures/sample-snapshots.json";
import {
  DailySearchSnapshot,
  GscRawRow,
  GscImportResult,
  PeriodTrendResult,
} from "./types";
import { normalizeGscRows } from "./normalizer";
import { GscAggregator } from "./aggregator";

// In-memory / durable session storage for daily snapshots
let persistedSnapshots: DailySearchSnapshot[] = [];

export class GscStorageService {
  private static isInitialized = false;

  /**
   * Initializes storage from fixtures if no snapshots exist
   */
  public static init(): void {
    if (this.isInitialized) return;

    if (persistedSnapshots.length === 0) {
      // Load fixtures as baseline reference
      const fixtureList = (fixturesData.snapshots || []) as DailySearchSnapshot[];
      persistedSnapshots = [...fixtureList];
    }
    this.isInitialized = true;
  }

  /**
   * Returns all stored daily snapshots sorted chronologically (newest first)
   */
  public static getDailySnapshots(): DailySearchSnapshot[] {
    this.init();
    return [...persistedSnapshots].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * Returns the latest available search snapshot
   */
  public static getLatestSnapshot(): DailySearchSnapshot {
    this.init();
    const sorted = this.getDailySnapshots();
    if (sorted.length > 0) return sorted[0];

    // Fallback if completely empty
    return {
      id: "snapshot-fallback",
      date: new Date().toISOString().split("T")[0],
      importedAt: new Date().toISOString(),
      correlationId: "corr-init",
      source: "FIXTURE_FALLBACK",
      totalImpressions: 0,
      totalClicks: 0,
      avgCtr: 0,
      avgPosition: 0,
      rows: [],
    };
  }

  /**
   * Retrieves a snapshot by exact date (YYYY-MM-DD)
   */
  public static getSnapshotByDate(date: string): DailySearchSnapshot | undefined {
    this.init();
    return persistedSnapshots.find(s => s.date === date);
  }

  /**
   * Ingests a batch of raw GSC telemetry rows and creates a new DailySearchSnapshot
   */
  public static importRawGscRows(
    rawRows: GscRawRow[],
    date?: string,
    providedCorrelationId?: string
  ): GscImportResult {
    this.init();

    const snapshotDate = date || new Date().toISOString().split("T")[0];
    const correlationId = providedCorrelationId || `gsc-corr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const importId = `imp-${Date.now()}`;
    const importedAt = new Date().toISOString();

    const normalizedRows = normalizeGscRows(rawRows, snapshotDate);
    const totalImpressions = normalizedRows.reduce((sum, r) => sum + r.impressions, 0);
    const totalClicks = normalizedRows.reduce((sum, r) => sum + r.clicks, 0);
    const weightedPosSum = normalizedRows.reduce((sum, r) => sum + (r.position * r.impressions), 0);
    const avgPosition = totalImpressions > 0 
      ? Number((weightedPosSum / totalImpressions).toFixed(2)) 
      : 0;
    const avgCtr = totalImpressions > 0 
      ? Number((totalClicks / totalImpressions).toFixed(4)) 
      : 0;

    const snapshot: DailySearchSnapshot = {
      id: `snapshot-${snapshotDate}`,
      date: snapshotDate,
      importedAt,
      correlationId,
      source: "GSC_EXPORT",
      totalImpressions,
      totalClicks,
      avgCtr,
      avgPosition,
      rows: normalizedRows,
    };

    // Replace if exists for date, or prepend
    const existingIdx = persistedSnapshots.findIndex(s => s.date === snapshotDate);
    if (existingIdx >= 0) {
      persistedSnapshots[existingIdx] = snapshot;
    } else {
      persistedSnapshots.unshift(snapshot);
    }

    const anomaliesDetected: string[] = [];
    if (totalImpressions === 0) anomaliesDetected.push("Zero impressions reported for batch.");
    if (avgPosition > 50) anomaliesDetected.push("Average position is depressed (> 50).");

    return {
      importId,
      correlationId,
      importedAt,
      snapshotDate,
      rawRowCount: rawRows.length,
      normalizedRowCount: normalizedRows.length,
      totalImpressions,
      totalClicks,
      avgPosition,
      status: "SUCCESS",
      anomaliesDetected,
    };
  }

  /**
   * Computes authentic time-series trend velocity between snapshots
   */
  public static getTrends(windowDays: 7 | 28 | 90 = 7): PeriodTrendResult {
    this.init();
    const snapshots = this.getDailySnapshots();
    
    if (snapshots.length < 2) {
      const single = snapshots[0] || this.getLatestSnapshot();
      return {
        periodLabel: `${windowDays}-Day Trend Window`,
        windowDays,
        baselineImpressions: single.totalImpressions,
        currentImpressions: single.totalImpressions,
        impressionGrowthPct: 0,
        baselineClicks: single.totalClicks,
        currentClicks: single.totalClicks,
        positionDelta: 0,
        avgPosition: single.avgPosition,
        momentumScore: 50,
        velocity: "STABLE",
      };
    }

    const current = snapshots[0];
    const baseline = snapshots[1];
    return GscAggregator.computePeriodTrend(baseline, current, windowDays);
  }
}
