/**
 * VloPedia — GSC Telemetry Row Normalizer
 * 
 * Cleans incoming search console export or API telemetry rows into canonical
 * structured snapshot records:
 * - Strips protocols, domains, query params to canonical relative URLs
 * - Normalizes trailing slashes, whitespace, and case
 * - Enforces numeric bounds and standard device/country enums
 */

import { GscRawRow, SearchDevice, SearchSnapshotRow } from "./types";

/**
 * Normalizes full or relative URL into canonical relative pathname
 */
export function normalizeGscUrl(rawUrl: string): string {
  if (!rawUrl) return "/";

  let clean = rawUrl.trim();

  // Strip protocol and hostname if present
  try {
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      const parsed = new URL(clean);
      clean = parsed.pathname;
    }
  } catch {
    // If URL parsing fails, remove prefix manually
    clean = clean.replace(/^https?:\/\/[^/]+/i, "");
  }

  // Remove query params and hash fragments
  const qIdx = clean.indexOf("?");
  if (qIdx !== -1) clean = clean.substring(0, qIdx);
  const hIdx = clean.indexOf("#");
  if (hIdx !== -1) clean = clean.substring(0, hIdx);

  // Normalize leading slash
  if (!clean.startsWith("/")) {
    clean = "/" + clean;
  }

  // Remove trailing slash unless it's just "/"
  if (clean.length > 1 && clean.endsWith("/")) {
    clean = clean.slice(0, -1);
  }

  return clean;
}

/**
 * Standardizes device strings into SearchDevice enum
 */
export function normalizeDevice(rawDevice?: string): SearchDevice {
  if (!rawDevice) return "MOBILE";
  const dev = rawDevice.toUpperCase().trim();
  if (dev.includes("DESK")) return "DESKTOP";
  if (dev.includes("TAB")) return "TABLET";
  return "MOBILE";
}

/**
 * Standardizes country code into 2-letter uppercase
 */
export function normalizeCountry(rawCountry?: string): string {
  if (!rawCountry) return "US";
  const c = rawCountry.trim().toUpperCase();
  if (c === "USA" || c === "UNITED STATES") return "US";
  if (c === "IND" || c === "INDIA") return "IN";
  if (c === "PHL" || c === "PHILIPPINES") return "PH";
  if (c === "GBR" || c === "UNITED KINGDOM") return "GB";
  if (c === "CAN" || c === "CANADA") return "CA";
  if (c === "DEU" || c === "GERMANY") return "DE";
  if (c === "AUS" || c === "AUSTRALIA") return "AU";
  return c.slice(0, 2);
}

/**
 * Normalizes a single raw GSC telemetry row
 */
export function normalizeGscRow(raw: GscRawRow, defaultDate?: string): SearchSnapshotRow {
  const query = (raw.query || "").toLowerCase().trim().replace(/\s+/g, " ");
  const url = normalizeGscUrl(raw.page);
  const clicks = Math.max(0, Math.round(Number(raw.clicks) || 0));
  const impressions = Math.max(0, Math.round(Number(raw.impressions) || 0));
  const position = Math.max(1.0, Number(Number(raw.position || 100).toFixed(2)));
  
  // Compute CTR or use bounded value
  let ctr = impressions > 0 ? Number((clicks / impressions).toFixed(4)) : 0;
  if (typeof raw.ctr === "number" && raw.ctr >= 0 && raw.ctr <= 1) {
    ctr = Number(raw.ctr.toFixed(4));
  }

  const device = normalizeDevice(raw.device);
  const country = normalizeCountry(raw.country);
  const date = raw.date || defaultDate || new Date().toISOString().split("T")[0];

  return {
    date,
    query,
    url,
    clicks,
    impressions,
    ctr,
    position,
    device,
    country,
  };
}

/**
 * Normalizes an array of raw GSC rows
 */
export function normalizeGscRows(rawList: GscRawRow[], defaultDate?: string): SearchSnapshotRow[] {
  return rawList
    .filter(r => r && (r.query || r.page))
    .map(r => normalizeGscRow(r, defaultDate));
}
