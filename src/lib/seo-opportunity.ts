/**
 * VloPedia — Google Search Console & SEO Opportunity Scoring Engine
 * 
 * Computes high-yield SEO opportunities by combining search impressions,
 * position ranking potential (pages on striking distance 4-20), content gap, multi-scenario CTR potential,
 * historical trend velocity, and anomaly detectors.
 */

import gscSnapshotsData from "@/data/gsc-snapshots.json";

export interface PageSearchMetric {
  url: string;
  title: string;
  category: "Agents" | "Weapons" | "Maps" | "Skins" | "Guides" | "Lore" | "Compare" | "Tools" | "Collections" | "Navigation";
  impressions: number;
  clicks: number;
  ctr: number; // e.g., 0.034 for 3.4%
  position: number; // e.g., 8.93
  isIndexed: boolean;
  contentGapScore: number; // 0.1 (complete) to 1.0 (major gap)
  primaryQuery?: string;
  isAlmostRanking?: boolean;
}

export interface CtrScenarioForecast {
  scenarioCurrent: number; // Clicks at current CTR
  scenario2Pct: number;    // Scenario: clicks at 2% CTR
  scenario5Pct: number;    // Scenario: clicks at 5% CTR
  scenario8Pct: number;    // Scenario: clicks at 8% CTR
}

export interface OpportunityScoreResult extends PageSearchMetric {
  opportunityScore: number;
  rankingPotential: number;
  clickPotential: number;
  opportunityLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "STABLE";
  recommendedAction: string;
  scenarios: CtrScenarioForecast;
  estimatedClickGain: number; // default 5% scenario
}

export interface AlmostRankingOpportunity {
  query: string;
  url: string;
  title: string;
  category: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  scenarios: CtrScenarioForecast;
  potentialClicksAt5Pct: number;
  recommendedAction: string;
}

export interface QueryTrendVelocity {
  query: string;
  url: string;
  category: string;
  baselinePeriod: {
    impressions: number;
    clicks: number;
    position: number;
    ctr: number;
  };
  currentPeriod: {
    impressions: number;
    clicks: number;
    position: number;
    ctr: number;
  };
  impressionGrowthPct: number;
  positionDelta: number; // negative means rank improved (e.g., -3.47 ranks)
  velocity: "VERY_HIGH" | "HIGH" | "STABLE" | "DECAYING";
  momentumScore: number; // 0 - 100
}

export interface ContentDecayAlert {
  query: string;
  url: string;
  category: string;
  impressionDropPct: number;
  positionLossRanks: number;
  riskSeverity: "HIGH" | "MEDIUM" | "LOW";
  likelyCauses: string[];
  recommendedFix: string;
}

export interface BreakthroughCandidate {
  query: string;
  url: string;
  title: string;
  currentPosition: number;
  impressions: number;
  ctr: number;
  gapToTopThree: number; // e.g., position 4.2 -> 1.2 ranks away
  scenario5Pct: number;
  scenario8Pct: number;
  priorityAction: string;
}

export interface DeviceAnomalyReport {
  deviceDivergenceRanks: number;
  desktopPosition: number;
  mobilePosition: number;
  mobileImpressions: number;
  desktopImpressions: number;
  divergenceSeverity: "CRITICAL" | "HIGH" | "NORMAL";
  diagnosis: string;
  actionItems: string[];
}

export interface CountryAnomalyReport {
  country: string;
  code: string;
  impressions: number;
  position: number;
  underperformanceFlag: boolean;
  notes: string;
}

export interface VerticalIndexPerformance {
  category: string;
  totalPages: number;
  indexedPages: number;
  totalImpressions: number;
  totalClicks: number;
  avgCtr: number;
  impressionsPerIndexedPage: number;
  clicksPerIndexedPage: number;
}

export interface DeviceSearchPerformance {
  device: "Mobile" | "Desktop" | "Tablet";
  impressions: number;
  avgPosition: number;
  clicks: number;
  ctr: number;
}

export interface CountrySearchPerformance {
  country: string;
  code: string;
  impressions: number;
  avgPosition: number;
}

// Production GSC Real Search Telemetry Snapshot
export const GSC_TELEMETRY_SNAPSHOT: PageSearchMetric[] = [
  {
    url: "/skins/aemondir-vandal",
    title: "Aemondir Vandal",
    category: "Skins",
    impressions: 104,
    clicks: 0,
    ctr: 0.0,
    position: 8.93,
    isIndexed: true,
    contentGapScore: 0.85,
    primaryQuery: "aemondir vandal",
    isAlmostRanking: true,
  },
  {
    url: "/skins/aeris-vandal",
    title: "Aeris Vandal",
    category: "Skins",
    impressions: 46,
    clicks: 0,
    ctr: 0.0,
    position: 8.87,
    isIndexed: true,
    contentGapScore: 0.85,
    primaryQuery: "aeris vandal",
    isAlmostRanking: true,
  },
  {
    url: "/skins/minima-karambit",
    title: "Minima Karambit",
    category: "Skins",
    impressions: 23,
    clicks: 0,
    ctr: 0.0,
    position: 10.13,
    isIndexed: true,
    contentGapScore: 0.80,
    primaryQuery: "minima karambit",
    isAlmostRanking: true,
  },
  {
    url: "/skins/montage-axe",
    title: "Montage Axe",
    category: "Skins",
    impressions: 20,
    clicks: 0,
    ctr: 0.0,
    position: 6.45,
    isIndexed: true,
    contentGapScore: 0.75,
    primaryQuery: "montage axe",
    isAlmostRanking: true,
  },
  {
    url: "/skins/helix-phantom",
    title: "Helix Phantom",
    category: "Skins",
    impressions: 18,
    clicks: 0,
    ctr: 0.0,
    position: 9.50,
    isIndexed: true,
    contentGapScore: 0.80,
    primaryQuery: "helix phantom",
    isAlmostRanking: true,
  },
  {
    url: "/skins/reaver-vandal",
    title: "Reaver Vandal",
    category: "Skins",
    impressions: 71,
    clicks: 1,
    ctr: 0.014,
    position: 9.28,
    isIndexed: true,
    contentGapScore: 0.70,
    primaryQuery: "reaver vandal",
    isAlmostRanking: true,
  },
  {
    url: "/skins/kuronami-vandal",
    title: "Kuronami Vandal",
    category: "Skins",
    impressions: 38,
    clicks: 0,
    ctr: 0.0,
    position: 9.10,
    isIndexed: true,
    contentGapScore: 0.70,
    primaryQuery: "kuronami vandal",
    isAlmostRanking: true,
  },
  {
    url: "/",
    title: "VloPedia Homepage",
    category: "Navigation",
    impressions: 68,
    clicks: 0,
    ctr: 0.0,
    position: 11.21,
    isIndexed: true,
    contentGapScore: 0.40,
    primaryQuery: "valovault",
    isAlmostRanking: true,
  },
  {
    url: "/skins",
    title: "VALORANT Weapon Skins Catalog",
    category: "Skins",
    impressions: 28,
    clicks: 0,
    ctr: 0.0,
    position: 65.07,
    isIndexed: true,
    contentGapScore: 0.85,
    primaryQuery: "valorant skins catalog",
  },
  {
    url: "/guides/how-to-counter-jett",
    title: "How to Counter Jett in VALORANT",
    category: "Guides",
    impressions: 4820,
    clicks: 142,
    ctr: 0.029,
    position: 13.8,
    isIndexed: true,
    contentGapScore: 0.80,
  },
  {
    url: "/compare/weapons/vandal-vs-phantom",
    title: "Vandal vs. Phantom Ballistics Comparison",
    category: "Compare",
    impressions: 6150,
    clicks: 280,
    ctr: 0.045,
    position: 11.2,
    isIndexed: true,
    contentGapScore: 0.70,
  },
  {
    url: "/agents/jett",
    title: "Jett Agent Dossier & Abilities",
    category: "Agents",
    impressions: 9400,
    clicks: 510,
    ctr: 0.054,
    position: 9.6,
    isIndexed: true,
    contentGapScore: 0.50,
  },
  {
    url: "/agents/omen",
    title: "Omen Smokes & Paranoia Guide",
    category: "Agents",
    impressions: 3900,
    clicks: 195,
    ctr: 0.050,
    position: 10.1,
    isIndexed: true,
    contentGapScore: 0.60,
  },
];

export const DEVICE_PERFORMANCE: DeviceSearchPerformance[] = [
  { device: "Mobile", impressions: 261, avgPosition: 8.18, clicks: 1, ctr: 0.0038 },
  { device: "Desktop", impressions: 549, avgPosition: 31.12, clicks: 1, ctr: 0.0018 },
  { device: "Tablet", impressions: 4, avgPosition: 12.50, clicks: 0, ctr: 0.0 },
];

export const COUNTRY_PERFORMANCE: CountrySearchPerformance[] = [
  { country: "United States", code: "US", impressions: 127, avgPosition: 17.90 },
  { country: "India", code: "IN", impressions: 123, avgPosition: 26.97 },
  { country: "Philippines", code: "PH", impressions: 84, avgPosition: 14.20 },
  { country: "Canada", code: "CA", impressions: 40, avgPosition: 10.75 },
  { country: "United Kingdom", code: "GB", impressions: 29, avgPosition: 11.80 },
  { country: "Germany", code: "DE", impressions: 28, avgPosition: 7.32 },
  { country: "Australia", code: "AU", impressions: 28, avgPosition: 9.71 },
];

export class SeoOpportunityEngine {
  /**
   * Calculates Multi-Scenario CTR projections: Current, 2%, 5%, and 8% CTR
   */
  public static calculateMultiScenarioClicks(impressions: number, currentCtr: number): CtrScenarioForecast {
    return {
      scenarioCurrent: Math.round(impressions * currentCtr),
      scenario2Pct: Math.max(1, Math.round(impressions * 0.02)),
      scenario5Pct: Math.max(1, Math.round(impressions * 0.05)),
      scenario8Pct: Math.max(1, Math.round(impressions * 0.08)),
    };
  }

  /**
   * Calculates ranking potential factor. Pages ranking in positions 4-15
   * have the highest potential for massive traffic leaps if pushed to top 3.
   */
  public static calculateRankingPotential(position: number): number {
    if (position >= 4 && position <= 15) return 1.0; // Striking distance
    if (position > 15 && position <= 25) return 0.8;
    if (position > 25 && position <= 50) return 0.5;
    if (position <= 3) return 0.3; // Already top ranking
    return 0.2;
  }

  /**
   * Calculates click potential from impressions and unrealized CTR
   */
  public static calculateClickPotential(ctr: number): number {
    return Math.max(0.1, 1 - ctr);
  }

  /**
   * Computes Opportunity Score for a single page metric
   */
  public static scorePage(metric: PageSearchMetric): OpportunityScoreResult {
    const rankingPotential = this.calculateRankingPotential(metric.position);
    const clickPotential = this.calculateClickPotential(metric.ctr);
    
    // Core formula: Impressions * RankPotential * ContentGap * ClickPotential
    const rawScore = (metric.impressions / 100) * rankingPotential * metric.contentGapScore * clickPotential * 10;
    const opportunityScore = Math.round(rawScore);
    const scenarios = this.calculateMultiScenarioClicks(metric.impressions, metric.ctr);
    const estimatedClickGain = scenarios.scenario5Pct;

    let opportunityLevel: OpportunityScoreResult["opportunityLevel"] = "STABLE";
    if (opportunityScore >= 200 || (metric.isAlmostRanking && metric.impressions >= 40)) {
      opportunityLevel = "CRITICAL";
    } else if (opportunityScore >= 100 || metric.isAlmostRanking) {
      opportunityLevel = "HIGH";
    } else if (opportunityScore >= 50) {
      opportunityLevel = "MEDIUM";
    }

    let recommendedAction = "Maintain freshness and internal link mesh.";
    if (metric.category === "Skins") {
      recommendedAction = "Deploy clean slug canonical URL, prominent above-the-fold price/variant answer box, and collection/weapon internal links.";
    } else if (metric.category === "Guides") {
      recommendedAction = "Expand actionable tactical setups and counterplay steps to capture top 3 search intent.";
    } else if (metric.category === "Compare") {
      recommendedAction = "Add situational map verdict matrix and weapon recoil comparison clip.";
    } else if (metric.category === "Agents") {
      recommendedAction = "Update Patch 9.04 balance commentary and verified synergy partners.";
    }

    return {
      ...metric,
      opportunityScore,
      rankingPotential,
      clickPotential,
      opportunityLevel,
      recommendedAction,
      scenarios,
      estimatedClickGain,
    };
  }

  /**
   * Returns ranked list of top SEO opportunities across all indexed pages
   */
  public static getTopOpportunities(limit: number = 10): OpportunityScoreResult[] {
    return GSC_TELEMETRY_SNAPSHOT
      .map(m => this.scorePage(m))
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .slice(0, limit);
  }

  /**
   * Identifies 'Almost-Ranking' pages on striking distance (Position 4-20, Impr >= 10, CTR < 2%)
   */
  public static getAlmostRankingQueries(): AlmostRankingOpportunity[] {
    return GSC_TELEMETRY_SNAPSHOT
      .filter(m => m.position >= 4 && m.position <= 20 && m.impressions >= 10 && m.ctr < 0.02)
      .map(m => {
        const scenarios = this.calculateMultiScenarioClicks(m.impressions, m.ctr);
        return {
          query: m.primaryQuery || m.title,
          url: m.url,
          title: m.title,
          category: m.category,
          impressions: m.impressions,
          clicks: m.clicks,
          ctr: m.ctr,
          position: m.position,
          scenarios,
          potentialClicksAt5Pct: scenarios.scenario5Pct,
          recommendedAction: `Position ${m.position.toFixed(1)} on Google with ${m.impressions} impressions. Rewrite title to '${m.title} — Price, Variants & Upgrades', embed quick answer box, and connect weapon skin hub.`,
        };
      })
      .sort((a, b) => b.impressions - a.impressions);
  }

  /**
   * Computes trend velocity by comparing historical snapshot periods
   */
  public static getTrendVelocity(): QueryTrendVelocity[] {
    const rawSnapshots = gscSnapshotsData.querySnapshots || [];
    return rawSnapshots.map(item => {
      const imprGrowth = item.baseline.impressions > 0 
        ? ((item.current.impressions - item.baseline.impressions) / item.baseline.impressions) * 100 
        : 100;
      
      const posDelta = Number((item.current.position - item.baseline.position).toFixed(2));
      
      let velocity: QueryTrendVelocity["velocity"] = "STABLE";
      let momentumScore = 50;

      if (posDelta <= -2.0 && imprGrowth >= 50) {
        velocity = "VERY_HIGH";
        momentumScore = 95;
      } else if (posDelta < 0 || imprGrowth > 20) {
        velocity = "HIGH";
        momentumScore = 75;
      } else if (posDelta > 2.0 && imprGrowth < -10) {
        velocity = "DECAYING";
        momentumScore = 20;
      }

      return {
        query: item.query,
        url: item.url,
        category: item.category,
        baselinePeriod: item.baseline,
        currentPeriod: item.current,
        impressionGrowthPct: Math.round(imprGrowth),
        positionDelta: posDelta,
        velocity,
        momentumScore,
      };
    }).sort((a, b) => b.momentumScore - a.momentumScore);
  }

  /**
   * Detects Content Decay where impressions drop > 20% or ranking worsens by > 2 ranks
   */
  public static getContentDecayAlerts(): ContentDecayAlert[] {
    const velocities = this.getTrendVelocity();
    return velocities
      .filter(v => v.velocity === "DECAYING" || v.positionDelta > 2.0)
      .map(v => ({
        query: v.query,
        url: v.url,
        category: v.category,
        impressionDropPct: Math.max(0, -v.impressionGrowthPct),
        positionLossRanks: v.positionDelta,
        riskSeverity: v.positionDelta > 4 ? "HIGH" : "MEDIUM",
        likelyCauses: [
          "Recent game balance or skin release shifting search demand to newer skins",
          "Generic category landing page without deep entity breakdown",
          "Competitor snippet optimization capturing search impressions"
        ],
        recommendedFix: `Re-architect ${v.url} with structured filter hubs, price spectrum widgets, and dedicated sub-intent internal links.`
      }));
  }

  /**
   * Identifies 'Breakthrough Candidates' (Position 3-6 with high impressions and sub-benchmark CTR)
   */
  public static getBreakthroughCandidates(): BreakthroughCandidate[] {
    return GSC_TELEMETRY_SNAPSHOT
      .filter(m => m.position >= 3 && m.position <= 7.5 && m.impressions >= 15)
      .map(m => {
        const scenarios = this.calculateMultiScenarioClicks(m.impressions, m.ctr);
        return {
          query: m.primaryQuery || m.title,
          url: m.url,
          title: m.title,
          currentPosition: m.position,
          impressions: m.impressions,
          ctr: m.ctr,
          gapToTopThree: Number(Math.max(0, m.position - 3.0).toFixed(1)),
          scenario5Pct: scenarios.scenario5Pct,
          scenario8Pct: scenarios.scenario8Pct,
          priorityAction: `Within striking distance of top 3 (Pos ${m.position.toFixed(1)}). Optimize SERP title tag, add Radianite upgrade matrix, and connect weapon skin hub.`,
        };
      })
      .sort((a, b) => a.currentPosition - b.currentPosition);
  }

  /**
   * Identifies 'Near Page 1 Candidates' (Position 8-12 with positive momentum)
   */
  public static getNearPageOneCandidates(): QueryTrendVelocity[] {
    const velocities = this.getTrendVelocity();
    return velocities
      .filter(v => v.currentPeriod.position >= 8 && v.currentPeriod.position <= 13 && (v.velocity === "HIGH" || v.velocity === "VERY_HIGH"))
      .sort((a, b) => a.currentPeriod.position - b.currentPeriod.position);
  }

  /**
   * Diagnostic anomaly detection for Mobile vs Desktop ranking divergence
   */
  public static getDeviceAnomalies(): DeviceAnomalyReport {
    const mobile = DEVICE_PERFORMANCE.find(d => d.device === "Mobile") || { avgPosition: 8.18, impressions: 261 };
    const desktop = DEVICE_PERFORMANCE.find(d => d.device === "Desktop") || { avgPosition: 31.12, impressions: 549 };
    const divergence = Number((desktop.avgPosition - mobile.avgPosition).toFixed(2));

    return {
      deviceDivergenceRanks: divergence,
      desktopPosition: desktop.avgPosition,
      mobilePosition: mobile.avgPosition,
      mobileImpressions: mobile.impressions,
      desktopImpressions: desktop.impressions,
      divergenceSeverity: divergence > 15 ? "CRITICAL" : divergence > 5 ? "HIGH" : "NORMAL",
      diagnosis: `Desktop position (${desktop.avgPosition}) is lagging Mobile (${mobile.avgPosition}) by ${divergence} ranks. Mobile indexing is performing near Page 1, but desktop viewport rendering or hydration overhead is hurting desktop crawl relevance.`,
      actionItems: [
        "Audit desktop CSS above-the-fold content visibility",
        "Verify semantic SSR H1 and AnswerBox load synchronously without client-only layout shift",
        "Ensure mobile-first responsive viewport markup is clean"
      ]
    };
  }

  /**
   * Country-specific underperformance anomaly detector
   */
  public static getCountryAnomalies(): CountryAnomalyReport[] {
    return COUNTRY_PERFORMANCE.map(c => {
      const isUnderperforming = c.impressions > 50 && c.avgPosition > 20;
      let notes = "Ranking healthy within expected global search baseline.";
      if (c.code === "IN" && isUnderperforming) {
        notes = "High search volume (123 impr) but depressed average position (26.97). Indicates geographic query intent divergence or localized latency.";
      } else if (c.avgPosition < 10) {
        notes = "Exceptional Page 1 organic visibility in this territory.";
      }
      return {
        country: c.country,
        code: c.code,
        impressions: c.impressions,
        position: c.avgPosition,
        underperformanceFlag: isUnderperforming,
        notes,
      };
    });
  }

  /**
   * Splits index metrics across content verticals to measure performance per indexed page
   */
  public static getVerticalPerformance(): VerticalIndexPerformance[] {
    const categories: PageSearchMetric["category"][] = [
      "Agents", "Weapons", "Maps", "Skins", "Guides", "Lore", "Compare", "Tools"
    ];

    const categoryFootprint: Record<string, { total: number; indexed: number }> = {
      Agents: { total: 26, indexed: 26 },
      Weapons: { total: 19, indexed: 19 },
      Maps: { total: 11, indexed: 11 },
      Skins: { total: 1420, indexed: 860 },
      Guides: { total: 24, indexed: 24 },
      Lore: { total: 20, indexed: 20 },
      Compare: { total: 15, indexed: 15 },
      Tools: { total: 12, indexed: 12 },
    };

    return categories.map(cat => {
      const items = GSC_TELEMETRY_SNAPSHOT.filter(m => m.category === cat);
      const totalImpressions = items.reduce((sum, i) => sum + i.impressions, 0);
      const totalClicks = items.reduce((sum, i) => sum + i.clicks, 0);
      const avgCtr = totalImpressions > 0 ? Number((totalClicks / totalImpressions).toFixed(3)) : 0;
      
      const footprint = categoryFootprint[cat] || { total: 10, indexed: 10 };
      const impressionsPerIndexedPage = footprint.indexed > 0 ? Math.round(totalImpressions / footprint.indexed) : 0;
      const clicksPerIndexedPage = footprint.indexed > 0 ? Number((totalClicks / footprint.indexed).toFixed(1)) : 0;

      return {
        category: cat,
        totalPages: footprint.total,
        indexedPages: footprint.indexed,
        totalImpressions,
        totalClicks,
        avgCtr,
        impressionsPerIndexedPage,
        clicksPerIndexedPage
      };
    });
  }
}
