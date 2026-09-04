/**
 * VloPedia — Low-CTR Intent Diagnostics & Query-to-Page Mismatch Engine
 * 
 * Analyzes search queries against landing page semantics to classify low-CTR causes
 * (Title mismatch, Intent mismatch, Wrong landing page, Weak snippet, Zero-click SERP)
 * and calculate Query-to-Page relevance affinity.
 */

import { slugify } from "./utils";

export type LowCtrDiagnosisType = 
  | "TITLE_MISMATCH"
  | "INTENT_MISMATCH"
  | "WEAK_SNIPPET"
  | "WRONG_LANDING_PAGE"
  | "COMPETITIVE_SERP"
  | "ZERO_CLICK_SERP"
  | "HEALTHY_CTR";

export interface QueryPageMatchResult {
  query: string;
  currentUrl: string;
  recommendedUrl: string;
  matchScore: number; // 0 - 100%
  isIdealLandingPage: boolean;
  mismatchReason?: string;
}

export interface QueryDiagnosisReport {
  query: string;
  url: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  diagnosis: LowCtrDiagnosisType;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  matchResult: QueryPageMatchResult;
  diagnosticExplanation: string;
  actionChecklist: string[];
}

export class SeoIntentDiagnosticsEngine {
  /**
   * Calculates semantic affinity between incoming search query and landing page URL
   */
  public static calculateQueryPageMatch(query: string, url: string): QueryPageMatchResult {
    const qLower = query.toLowerCase().trim();
    const urlLower = url.toLowerCase().trim();
    
    // Check if query refers to a specific skin
    const skinKeywords = ["vandal", "phantom", "karambit", "axe", "operator", "sheriff", "knife", "marshal", "ghost", "classic", "odin", "ares", "spectre"];
    const subIntentKeywords = ["price", "vp", "cost", "how much", "variants", "chroma", "showcase", "sound", "upgrade", "finisher", "animation"];
    
    const querySlug = slugify(qLower.replace(/valorant/g, "").trim());
    let recommendedUrl = url;
    let matchScore = 80;
    let isIdealLandingPage = true;
    let mismatchReason: string | undefined;

    // Detect if query is for a specific skin entity like "helix phantom variants"
    const matchedWeapons = skinKeywords.filter(w => qLower.includes(w));
    const isSkinSpecific = matchedWeapons.length > 0 && !qLower.startsWith("valorant skins");

    if (isSkinSpecific) {
      // Find candidate slug
      const candidateSlug = slugify(qLower
        .replace(/valorant/g, "")
        .replace(/price/g, "")
        .replace(/variants/g, "")
        .replace(/showcase/g, "")
        .replace(/how much is/g, "")
        .trim());

      recommendedUrl = `/skins/${candidateSlug}`;

      if (urlLower === "/skins" || urlLower === `/skins/${matchedWeapons[0]}`) {
        // Query is specific but landing on generic catalog or weapon category
        matchScore = 41;
        isIdealLandingPage = false;
        mismatchReason = `Searcher requested specific item '${query}' but was routed to generic page '${url}'.`;
      } else if (urlLower.includes(candidateSlug)) {
        matchScore = 94;
        isIdealLandingPage = true;
      } else {
        matchScore = 65;
        isIdealLandingPage = false;
        mismatchReason = `Searcher requested '${query}' but arrived on different entity '${url}'.`;
      }
    } else if (qLower.includes("skins") || qLower.includes("catalog")) {
      recommendedUrl = "/skins";
      if (urlLower === "/skins") {
        matchScore = 95;
        isIdealLandingPage = true;
      }
    }

    return {
      query,
      currentUrl: url,
      recommendedUrl,
      matchScore,
      isIdealLandingPage,
      mismatchReason,
    };
  }

  /**
   * Diagnoses root causes of low CTR based on position, query intent, and landing page
   */
  public static diagnoseQuery(
    query: string,
    url: string,
    impressions: number,
    clicks: number,
    position: number
  ): QueryDiagnosisReport {
    const ctr = impressions > 0 ? clicks / impressions : 0;
    const matchResult = this.calculateQueryPageMatch(query, url);
    const qLower = query.toLowerCase();

    let diagnosis: LowCtrDiagnosisType = "HEALTHY_CTR";
    let severity: QueryDiagnosisReport["severity"] = "LOW";
    let diagnosticExplanation = "CTR is within expected parameters for this position.";
    const actionChecklist: string[] = [];

    // 1. Check for Zero-Click SERP intent
    const isBrandOrNav = qLower === "valovault" || qLower === "vlopedia" || qLower === "valorant";
    if (isBrandOrNav && position <= 7 && ctr < 0.02) {
      diagnosis = "ZERO_CLICK_SERP";
      severity = "MEDIUM";
      diagnosticExplanation = "Brand or navigational query where searchers frequently view the Knowledge Panel without clicking.";
      actionChecklist.push(
        "Refine homepage SERP title to: 'VloPedia — VALORANT Database, Skins, Lore & Tools'",
        "Include rich site links and clear value proposition in meta description",
        "Add WebSite structured data with SearchAction schema"
      );
    } 
    // 2. Check for Wrong Landing Page mismatch
    else if (!matchResult.isIdealLandingPage) {
      diagnosis = "WRONG_LANDING_PAGE";
      severity = "CRITICAL";
      diagnosticExplanation = `Google is associating query '${query}' with '${url}' (Match score: ${matchResult.matchScore}%) rather than '${matchResult.recommendedUrl}'.`;
      actionChecklist.push(
        `Ensure canonical slug '${matchResult.recommendedUrl}' is indexed and present in sitemap.xml`,
        `Add prominent internal link from '${url}' to '${matchResult.recommendedUrl}'`,
        `Add 301 redirect if old URL was a legacy path`
      );
    }
    // 3. Check for Intent Mismatch (e.g. price/variants intent)
    else if (qLower.includes("price") || qLower.includes("vp") || qLower.includes("how much") || qLower.includes("variants") || qLower.includes("showcase")) {
      if (ctr < 0.02 && position <= 15) {
        diagnosis = "INTENT_MISMATCH";
        severity = "HIGH";
        diagnosticExplanation = "Searcher intent is explicitly seeking pricing, variants, or animations. If the SERP snippet doesn't highlight these answers, searchers bounce to competitors.";
        actionChecklist.push(
          "Include 'VP Price, Variants & Video Showcase' in the H1 and SERP Title",
          "Ensure schema ItemList and Product price metadata is declared",
          "Render instant AnswerBox above the fold"
        );
      }
    }
    // 4. Check for Title Mismatch on high-impression striking distance queries
    else if (position <= 10 && ctr < 0.01 && impressions >= 20) {
      diagnosis = "TITLE_MISMATCH";
      severity = "HIGH";
      diagnosticExplanation = `Ranking on Page 1 (Position ${position.toFixed(1)}) with ${impressions} impressions but 0 clicks. Title is too generic to attract clicks.`;
      actionChecklist.push(
        `Change title from generic format to '${query} — Price, Variants & Upgrades | VloPedia'`,
        "Add compelling meta description answering VP cost and collection lore",
        "Add high-resolution skin preview image to OpenGraph metadata"
      );
    }
    // 5. Weak Snippet
    else if (ctr < 0.015 && position <= 15) {
      diagnosis = "WEAK_SNIPPET";
      severity = "MEDIUM";
      diagnosticExplanation = "Snippet is not differentiating VloPedia from generic wiki pages.";
      actionChecklist.push(
        "Add exact patch version and verification timestamp to meta description",
        "Highlight interactive tools and video showcase availability"
      );
    }

    return {
      query,
      url,
      impressions,
      clicks,
      ctr,
      position,
      diagnosis,
      severity,
      matchResult,
      diagnosticExplanation,
      actionChecklist,
    };
  }

  /**
   * Runs diagnostic audit across all high-impression GSC queries
   */
  public static runGscDiagnostics(): QueryDiagnosisReport[] {
    const highImpressionQueries = [
      { query: "aemondir vandal", url: "/skins/aemondir-vandal", impressions: 104, clicks: 0, position: 8.93 },
      { query: "aeris vandal", url: "/skins/aeris-vandal", impressions: 46, clicks: 0, position: 8.87 },
      { query: "minima karambit", url: "/skins/minima-karambit", impressions: 23, clicks: 0, position: 10.13 },
      { query: "montage axe", url: "/skins/montage-axe", impressions: 20, clicks: 0, position: 6.45 },
      { query: "helix phantom", url: "/skins/helix-phantom", impressions: 18, clicks: 0, position: 9.50 },
      { query: "valovault", url: "/", impressions: 54, clicks: 0, position: 6.28 },
      { query: "helix phantom variants", url: "/skins/helix-phantom", impressions: 14, clicks: 0, position: 9.20 },
      { query: "helix phantom valorant price", url: "/skins/helix-phantom", impressions: 12, clicks: 0, position: 8.90 },
      { query: "how much is minima karambit", url: "/skins/minima-karambit", impressions: 11, clicks: 0, position: 10.40 },
      { query: "aeris vandal showcase", url: "/skins/aeris-vandal", impressions: 10, clicks: 0, position: 8.40 },
      { query: "valorant skins catalog", url: "/skins", impressions: 28, clicks: 0, position: 65.07 },
    ];

    return highImpressionQueries.map(q => 
      this.diagnoseQuery(q.query, q.url, q.impressions, q.clicks, q.position)
    );
  }
}
