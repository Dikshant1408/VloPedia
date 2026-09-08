/**
 * VloPedia — Google Search Console Telemetry & Durable Snapshot Types
 */

export type SearchDevice = "MOBILE" | "DESKTOP" | "TABLET";

export interface GscRawRow {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr?: number;
  position: number;
  device?: string;
  country?: string;
  date?: string;
}

export interface SearchSnapshotRow {
  date: string; // YYYY-MM-DD
  query: string;
  url: string; // Canonical relative pathname, e.g. /skins/aemondir-vandal
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  device: SearchDevice;
  country: string; // ISO 2-letter uppercase or 3-letter, e.g. "US", "IN"
}

export interface DailySearchSnapshot {
  id: string;
  date: string; // YYYY-MM-DD
  importedAt: string; // ISO timestamp
  correlationId: string;
  source: "GSC_API" | "GSC_EXPORT" | "FIXTURE_FALLBACK";
  totalImpressions: number;
  totalClicks: number;
  avgCtr: number;
  avgPosition: number;
  rows: SearchSnapshotRow[];
}

export interface DeviceSearchPerformance {
  device: "Mobile" | "Desktop" | "Tablet";
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
}

export interface CountrySearchPerformance {
  country: string;
  code: string;
  impressions: number;
  clicks: number;
  avgPosition: number;
}

export interface CannibalizationCandidate {
  query: string;
  competingUrls: Array<{
    url: string;
    impressions: number;
    clicks: number;
    avgPosition: number;
    isWatchPage: boolean;
  }>;
  preferredUrl: string;
  severity: "CRITICAL" | "HIGH" | "MODERATE";
  diagnosis: string;
  recommendedAction: string;
}

export interface PeriodTrendResult {
  periodLabel: string;
  windowDays: number;
  baselineImpressions: number;
  currentImpressions: number;
  impressionGrowthPct: number;
  baselineClicks: number;
  currentClicks: number;
  positionDelta: number; // Negative = rank improved (e.g., -2.5)
  avgPosition: number;
  momentumScore: number; // 0 - 100
  velocity: "VERY_HIGH" | "HIGH" | "STABLE" | "DECAYING";
}

export interface ForecastCalibrationRecord {
  targetUrl: string;
  query: string;
  forecastDate: string;
  predictedClicks: number;
  actualClicks: number;
  errorPct: number;
  calibrationAccuracyPct: number; // e.g. 82%
  status: "CALIBRATED" | "OVERPERFORMED" | "UNDERPERFORMED";
}

export interface GscImportResult {
  importId: string;
  correlationId: string;
  importedAt: string;
  snapshotDate: string;
  rawRowCount: number;
  normalizedRowCount: number;
  totalImpressions: number;
  totalClicks: number;
  avgPosition: number;
  status: "SUCCESS" | "WARNING" | "FAILED";
  anomaliesDetected: string[];
}
