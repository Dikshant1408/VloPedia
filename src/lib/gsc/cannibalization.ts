/**
 * VloPedia — Search Query Cannibalization & Dilution Detector
 * 
 * Identifies instances where multiple URLs compete for the same query family
 * (e.g., skin dossier vs weapon hub vs collection hub vs watch page),
 * evaluates ranking dilution severity, and recommends authoritative canonical targets.
 */

import { SearchSnapshotRow, CannibalizationCandidate } from "./types";
import { slugify } from "../utils";

export class SearchCannibalizationEngine {
  /**
   * Scans search telemetry rows for queries with multiple competing URLs
   */
  public static detectCannibalization(rows: SearchSnapshotRow[]): CannibalizationCandidate[] {
    // Group rows by query
    const queryMap = new Map<string, Map<string, { impressions: number; clicks: number; position: number }>>();

    for (const row of rows) {
      if (!queryMap.has(row.query)) {
        queryMap.set(row.query, new Map());
      }
      const urlGroup = queryMap.get(row.query)!;
      const existing = urlGroup.get(row.url) || { impressions: 0, clicks: 0, position: row.position };
      existing.impressions += row.impressions;
      existing.clicks += row.clicks;
      // Weighted position if multiple records for same URL
      existing.position = Number(((existing.position + row.position) / 2).toFixed(2));
      urlGroup.set(row.url, existing);
    }

    const candidates: CannibalizationCandidate[] = [];

    for (const [query, urlGroup] of queryMap.entries()) {
      if (urlGroup.size < 2) continue; // No competition

      const competingUrls = Array.from(urlGroup.entries()).map(([url, data]) => ({
        url,
        impressions: data.impressions,
        clicks: data.clicks,
        avgPosition: data.position,
        isWatchPage: url.includes("/watch"),
      })).sort((a, b) => b.impressions - a.impressions);

      const preferredUrl = this.resolvePreferredUrl(query, competingUrls.map(u => u.url));
      const hasWatchConflict = competingUrls.some(u => u.isWatchPage);
      
      // Determine severity
      let severity: CannibalizationCandidate["severity"] = "MODERATE";
      const totalImpr = competingUrls.reduce((sum, u) => sum + u.impressions, 0);
      const minPos = Math.min(...competingUrls.map(u => u.avgPosition));

      if (hasWatchConflict) {
        severity = "CRITICAL";
      } else if (minPos <= 15 && totalImpr >= 30) {
        severity = "CRITICAL";
      } else if (totalImpr >= 20 || minPos <= 20) {
        severity = "HIGH";
      }

      // Build diagnosis and action
      let diagnosis = `Multiple pages (${competingUrls.length}) are receiving search impressions for query '${query}', splitting Google rank authority.`;
      let recommendedAction = `Establish '${preferredUrl}' as the single authoritative target. Add internal links from secondary pages pointing to '${preferredUrl}'.`;

      if (hasWatchConflict) {
        const watchUrl = competingUrls.find(u => u.isWatchPage)!.url;
        const mainUrl = watchUrl.replace("/watch", "");
        diagnosis = `Watch page '${watchUrl}' is competing against parent skin dossier '${mainUrl}' for general query '${query}'.`;
        recommendedAction = `Ensure '${watchUrl}' has an explicit canonical tag and clear video-specific focus. Direct primary organic traffic to '${preferredUrl}'.`;
      } else if (competingUrls.some(u => u.url.startsWith("/skins/") && !u.url.endsWith("/watch")) && competingUrls.some(u => u.url === "/skins" || u.url.startsWith("/skins/vandal"))) {
        diagnosis = `Specific item query '${query}' is being absorbed by weapon hub or catalog instead of the dedicated skin dossier.`;
        recommendedAction = `Preferred page: '${preferredUrl}'. Add prominent anchor links from the category hub directly to '${preferredUrl}'.`;
      }

      candidates.push({
        query,
        competingUrls,
        preferredUrl,
        severity,
        diagnosis,
        recommendedAction,
      });
    }

    return candidates.sort((a, b) => {
      const sevWeight = { CRITICAL: 3, HIGH: 2, MODERATE: 1 };
      return sevWeight[b.severity] - sevWeight[a.severity];
    });
  }

  /**
   * Resolves the authoritative preferred URL for a given query among competing candidates
   */
  public static resolvePreferredUrl(query: string, candidateUrls: string[]): string {
    const qLower = query.toLowerCase();
    const isVideoIntent = qLower.includes("video") || qLower.includes("showcase") || qLower.includes("animation") || qLower.includes("sound") || qLower.includes("inspect");

    // 1. If video query and watch page exists, prefer watch page
    if (isVideoIntent) {
      const watchCandidate = candidateUrls.find(u => u.includes("/watch"));
      if (watchCandidate) return watchCandidate;
    }

    // 2. Exclude watch page for general queries
    const nonWatchUrls = candidateUrls.filter(u => !u.includes("/watch"));
    const pool = nonWatchUrls.length > 0 ? nonWatchUrls : candidateUrls;

    // 3. Check for specific skin slug match
    // E.g. "reaver vandal" -> candidate "/skins/reaver-vandal" vs "/skins/vandal" vs "/collections/reaver"
    const skinKeywords = ["vandal", "phantom", "karambit", "axe", "operator", "sheriff", "knife", "marshal", "ghost", "classic", "odin", "ares", "spectre"];
    const hasWeapon = skinKeywords.some(w => qLower.includes(w));

    if (hasWeapon) {
      // Find candidate with matching skin slug
      const specificSkin = pool.find(u => {
        const segments = u.split("/").filter(Boolean);
        return segments.length === 2 && segments[0] === "skins" && !skinKeywords.includes(segments[1]);
      });
      if (specificSkin) return specificSkin;
    }

    // 4. Check for collection intent
    if (qLower.includes("collection") || qLower.includes("bundle")) {
      const col = pool.find(u => u.startsWith("/collections/"));
      if (col) return col;
    }

    // 5. Check for weapon hub
    if (qLower.includes("skins") || qLower.includes("catalog")) {
      const hub = pool.find(u => u.startsWith("/skins/"));
      if (hub) return hub;
    }

    // Default to the first candidate
    return pool[0] || candidateUrls[0] || "/";
  }

  /**
   * Identifies specifically watch page cannibalization conflicts
   */
  public static getWatchPageConflicts(rows: SearchSnapshotRow[]): CannibalizationCandidate[] {
    const all = this.detectCannibalization(rows);
    return all.filter(c => c.competingUrls.some(u => u.isWatchPage));
  }
}
