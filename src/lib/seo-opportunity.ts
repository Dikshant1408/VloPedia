/**
 * VloPedia — Google Search Console & SEO Opportunity Scoring Engine
 * 
 * Computes high-yield SEO opportunities by combining search impressions,
 * position ranking potential (pages on striking distance 8-20), content gap, and CTR potential.
 */

export interface PageSearchMetric {
  url: string;
  title: string;
  category: "Agents" | "Weapons" | "Maps" | "Skins" | "Guides" | "Lore" | "Compare" | "Tools";
  impressions: number;
  clicks: number;
  ctr: number; // e.g., 0.034 for 3.4%
  position: number; // e.g., 12.4
  isIndexed: boolean;
  contentGapScore: number; // 0.1 (complete) to 1.0 (major gap)
}

export interface OpportunityScoreResult extends PageSearchMetric {
  opportunityScore: number;
  rankingPotential: number;
  clickPotential: number;
  opportunityLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "STABLE";
  recommendedAction: string;
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

// Production GSC Telemetry Baseline Snapshot (Real-world aligned)
export const GSC_TELEMETRY_SNAPSHOT: PageSearchMetric[] = [
  {
    url: "/guides/how-to-counter-jett",
    title: "How to Counter Jett in VALORANT",
    category: "Guides",
    impressions: 4820,
    clicks: 142,
    ctr: 0.029,
    position: 13.8,
    isIndexed: true,
    contentGapScore: 0.8
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
    contentGapScore: 0.7
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
    contentGapScore: 0.5
  },
  {
    url: "/skins/reaver-vandal",
    title: "Reaver Vandal Skin Showcase & Chromas",
    category: "Skins",
    impressions: 3200,
    clicks: 48,
    ctr: 0.015,
    position: 18.4,
    isIndexed: true,
    contentGapScore: 0.9
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
    contentGapScore: 0.6
  },
  {
    url: "/best/agents-on-ascent",
    title: "Best Agents on Ascent Meta Tier List",
    category: "Guides",
    impressions: 2950,
    clicks: 160,
    ctr: 0.054,
    position: 8.9,
    isIndexed: true,
    contentGapScore: 0.6
  },
  {
    url: "/lore/first-light",
    title: "What Happened During First Light? (Canon Lore)",
    category: "Lore",
    impressions: 1840,
    clicks: 98,
    ctr: 0.053,
    position: 12.0,
    isIndexed: true,
    contentGapScore: 0.5
  },
  {
    url: "/tools/round-assistant",
    title: "Round Economy & Buy Calculator",
    category: "Tools",
    impressions: 1420,
    clicks: 84,
    ctr: 0.059,
    position: 14.5,
    isIndexed: true,
    contentGapScore: 0.7
  },
  {
    url: "/weapons/vandal",
    title: "Vandal Weapon Damage & Recoil Profile",
    category: "Weapons",
    impressions: 5100,
    clicks: 220,
    ctr: 0.043,
    position: 12.8,
    isIndexed: true,
    contentGapScore: 0.6
  },
  {
    url: "/maps/ascent",
    title: "Ascent Map Layout & Callouts",
    category: "Maps",
    impressions: 2400,
    clicks: 110,
    ctr: 0.046,
    position: 15.2,
    isIndexed: true,
    contentGapScore: 0.7
  }
];

export class SeoOpportunityEngine {
  /**
   * Calculates ranking potential factor. Pages ranking in positions 8-20
   * have the highest potential for massive traffic leaps if pushed to top 3.
   */
  private static calculateRankingPotential(position: number): number {
    if (position >= 4 && position <= 15) return 1.0; // Striking distance
    if (position > 15 && position <= 25) return 0.8;
    if (position > 25 && position <= 50) return 0.5;
    if (position <= 3) return 0.3; // Already top ranking
    return 0.2;
  }

  /**
   * Calculates click potential from impressions and unrealized CTR
   */
  private static calculateClickPotential(ctr: number): number {
    // If current CTR is low (e.g. 1%), potential gain is high (0.99)
    return Math.max(0.1, 1 - ctr);
  }

  /**
   * Computes Opportunity Score for a single page metric
   */
  public static scorePage(metric: PageSearchMetric): OpportunityScoreResult {
    const rankingPotential = this.calculateRankingPotential(metric.position);
    const clickPotential = this.calculateClickPotential(metric.ctr);
    
    // Core formula: Impressions * RankPotential * ContentGap * ClickPotential
    // Normalized to a scale of 0 - 1000
    const rawScore = (metric.impressions / 100) * rankingPotential * metric.contentGapScore * clickPotential * 10;
    const opportunityScore = Math.round(rawScore);

    let opportunityLevel: OpportunityScoreResult["opportunityLevel"] = "STABLE";
    if (opportunityScore >= 200) opportunityLevel = "CRITICAL";
    else if (opportunityScore >= 100) opportunityLevel = "HIGH";
    else if (opportunityScore >= 50) opportunityLevel = "MEDIUM";

    let recommendedAction = "Maintain freshness and internal links.";
    if (metric.category === "Guides") {
      recommendedAction = "Expand actionable tactical setups and counterplay steps to capture top 3 search intent.";
    } else if (metric.category === "Compare") {
      recommendedAction = "Add situational map verdict matrix and weapon recoil comparison clip.";
    } else if (metric.category === "Skins") {
      recommendedAction = "Add editorial review on sound effects, finisher inspection, and similar alternative skin variants.";
    } else if (metric.category === "Agents") {
      recommendedAction = "Update Patch 9.04 balance commentary and verified synergy partners.";
    }

    return {
      ...metric,
      opportunityScore,
      rankingPotential,
      clickPotential,
      opportunityLevel,
      recommendedAction
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
