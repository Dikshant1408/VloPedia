/**
 * VloPedia — SEO Experimentation & SERP Title Testing Engine
 * 
 * Manages before/after SEO experiments, testing title tags, meta descriptions,
 * answer boxes, and semantic slug routing against baseline Google Search Console metrics.
 */

export type ExperimentStatus = "DRAFT" | "RUNNING" | "CONCLUDED" | "ROLLED_OUT";

export interface ExperimentVariant {
  version: "Variant A (Baseline)" | "Variant B (Action-Driven)";
  title: string;
  metaDescription: string;
  features: string[];
  period: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
}

export interface SeoExperiment {
  id: string;
  pageUrl: string;
  entitySlug: string;
  entityName: string;
  category: string;
  status: ExperimentStatus;
  startDate: string;
  targetDurationDays: number;
  hypothesis: string;
  variantA: ExperimentVariant;
  variantB: ExperimentVariant;
  calculatedUplift: {
    clickGainMonthly: number;
    ctrDeltaPct: number; // e.g. +2.8%
    positionDelta: number; // e.g. -3.5 ranks improvement
    confidenceLevel: number; // 0 - 100%
  };
  verdict: string;
}

export const SEEDED_SEO_EXPERIMENTS: SeoExperiment[] = [
  {
    id: "exp-aemondir-vandal",
    pageUrl: "/skins/aemondir-vandal",
    entitySlug: "aemondir-vandal",
    entityName: "Aemondir Vandal",
    category: "Skins",
    status: "RUNNING",
    startDate: "2026-09-04",
    targetDurationDays: 21,
    hypothesis: "Migrating from UUID to canonical slug, rewriting title with 'Price, Variants & Showcase', and embedding above-the-fold answer box will increase CTR from 0% to >2.5% at position ~8.9.",
    variantA: {
      version: "Variant A (Baseline)",
      title: "Aemondir Vandal | VloPedia",
      metaDescription: "View Aemondir Vandal VALORANT skin details in the VloPedia database.",
      features: ["UUID URL: /skins/b494ddd1...", "Generic Title", "Standard Database Record"],
      period: "Aug 23 - Sep 01, 2026",
      impressions: 104,
      clicks: 0,
      ctr: 0.0,
      avgPosition: 8.93,
    },
    variantB: {
      version: "Variant B (Action-Driven)",
      title: "Aemondir Vandal — Price, Variants, Upgrades & Showcase | VloPedia",
      metaDescription: "Aemondir Vandal VALORANT skin: check its VP price, variants, radianite upgrades, sound effects, finisher animations, and Aemondir collection details on VloPedia.",
      features: ["Semantic Slug: /skins/aemondir-vandal", "Intent AnswerBox", "Collection & Weapon Hub Mesh", "301 Redirect Guard"],
      period: "Sep 04 - Present",
      impressions: 182,
      clicks: 6,
      ctr: 0.033,
      avgPosition: 6.42,
    },
    calculatedUplift: {
      clickGainMonthly: 12,
      ctrDeltaPct: 3.3,
      positionDelta: -2.51,
      confidenceLevel: 88,
    },
    verdict: "Strong positive momentum: Position improved 8.93 -> 6.42 with 3.3% CTR uplift.",
  },
  {
    id: "exp-aeris-vandal",
    pageUrl: "/skins/aeris-vandal",
    entitySlug: "aeris-vandal",
    entityName: "Aeris Vandal",
    category: "Skins",
    status: "RUNNING",
    startDate: "2026-09-04",
    targetDurationDays: 21,
    hypothesis: "Answering search query intent directly above the fold will convert 46 impressions into clicks at position 8.87.",
    variantA: {
      version: "Variant A (Baseline)",
      title: "Aeris Vandal | VloPedia",
      metaDescription: "Aeris Vandal skin overview.",
      features: ["Raw UUID URL", "Minimal Metadata"],
      period: "Aug 23 - Sep 01, 2026",
      impressions: 46,
      clicks: 0,
      ctr: 0.0,
      avgPosition: 8.87,
    },
    variantB: {
      version: "Variant B (Action-Driven)",
      title: "Aeris Vandal — Price, Variants, Upgrades & Showcase | VloPedia",
      metaDescription: "Aeris Vandal VALORANT skin: check its VP price, variants, radianite upgrades, sound effects, finisher animations, and Aeris collection details on VloPedia.",
      features: ["Semantic Slug URL", "VP Price & Tier Badge", "Vandal Hub Link"],
      period: "Sep 04 - Present",
      impressions: 74,
      clicks: 2,
      ctr: 0.027,
      avgPosition: 7.10,
    },
    calculatedUplift: {
      clickGainMonthly: 4,
      ctrDeltaPct: 2.7,
      positionDelta: -1.77,
      confidenceLevel: 82,
    },
    verdict: "Conversion validated: First clicks captured after slug and answer box rollout.",
  },
  {
    id: "exp-helix-phantom",
    pageUrl: "/skins/helix-phantom",
    entitySlug: "helix-phantom",
    entityName: "Helix Phantom",
    category: "Skins",
    status: "RUNNING",
    startDate: "2026-09-04",
    targetDurationDays: 21,
    hypothesis: "Adding variants breakdown and video showcase link will address queries for 'helix phantom variants' and 'helix phantom valorant price'.",
    variantA: {
      version: "Variant A (Baseline)",
      title: "Helix Phantom | VloPedia",
      metaDescription: "Helix Phantom skin.",
      features: ["UUID URL", "No video deep link"],
      period: "Aug 23 - Sep 01, 2026",
      impressions: 18,
      clicks: 0,
      ctr: 0.0,
      avgPosition: 9.50,
    },
    variantB: {
      version: "Variant B (Action-Driven)",
      title: "Helix Phantom — Price, Variants, Upgrades & Showcase | VloPedia",
      metaDescription: "Helix Phantom VALORANT skin: check its VP price, variants, radianite upgrades, sound effects, finisher animations, and Helix collection details on VloPedia.",
      features: ["Clean Slug", "Dedicated /watch video link", "Phantom Hub Mesh"],
      period: "Sep 04 - Present",
      impressions: 34,
      clicks: 1,
      ctr: 0.029,
      avgPosition: 7.80,
    },
    calculatedUplift: {
      clickGainMonthly: 3,
      ctrDeltaPct: 2.9,
      positionDelta: -1.70,
      confidenceLevel: 79,
    },
    verdict: "Positive velocity: Page advanced from position 9.50 to 7.80.",
  },
  {
    id: "exp-minima-karambit",
    pageUrl: "/skins/minima-karambit",
    entitySlug: "minima-karambit",
    entityName: "Minima Karambit",
    category: "Skins",
    status: "RUNNING",
    startDate: "2026-09-04",
    targetDurationDays: 21,
    hypothesis: "Targeting 'how much is minima karambit' query intent with instant VP price block will lift CTR from position 10.13.",
    variantA: {
      version: "Variant A (Baseline)",
      title: "Minima Karambit | VloPedia",
      metaDescription: "Minima Karambit knife info.",
      features: ["UUID URL", "No melee comparison link"],
      period: "Aug 23 - Sep 01, 2026",
      impressions: 23,
      clicks: 0,
      ctr: 0.0,
      avgPosition: 10.13,
    },
    variantB: {
      version: "Variant B (Action-Driven)",
      title: "Minima Karambit — Price, Variants, Upgrades & Showcase | VloPedia",
      metaDescription: "Minima Karambit VALORANT melee skin: check its VP price, variants, radianite upgrades, sound effects, animations, and Minima collection details on VloPedia.",
      features: ["Semantic Slug URL", "Direct VP Answer Block", "Melee Hub Link"],
      period: "Sep 04 - Present",
      impressions: 38,
      clicks: 1,
      ctr: 0.026,
      avgPosition: 8.60,
    },
    calculatedUplift: {
      clickGainMonthly: 2,
      ctrDeltaPct: 2.6,
      positionDelta: -1.53,
      confidenceLevel: 76,
    },
    verdict: "Entered Page 1: Reached position 8.60 with initial organic click.",
  },
];

export class SeoExperimentsEngine {
  public static getAllExperiments(): SeoExperiment[] {
    return SEEDED_SEO_EXPERIMENTS;
  }

  public static getActiveExperiments(): SeoExperiment[] {
    return SEEDED_SEO_EXPERIMENTS.filter(e => e.status === "RUNNING");
  }

  public static getExperimentById(id: string): SeoExperiment | undefined {
    return SEEDED_SEO_EXPERIMENTS.find(e => e.id === id);
  }

  public static calculateAggregateUplift(): {
    totalActiveExperiments: number;
    avgCtrUplift: number;
    avgPositionImprovement: number;
    totalProjectedClickGain: number;
  } {
    const active = this.getActiveExperiments();
    if (active.length === 0) {
      return { totalActiveExperiments: 0, avgCtrUplift: 0, avgPositionImprovement: 0, totalProjectedClickGain: 0 };
    }

    const totalCtr = active.reduce((sum, e) => sum + e.calculatedUplift.ctrDeltaPct, 0);
    const totalPos = active.reduce((sum, e) => sum + Math.abs(e.calculatedUplift.positionDelta), 0);
    const totalClicks = active.reduce((sum, e) => sum + e.calculatedUplift.clickGainMonthly, 0);

    return {
      totalActiveExperiments: active.length,
      avgCtrUplift: Number((totalCtr / active.length).toFixed(2)),
      avgPositionImprovement: Number((totalPos / active.length).toFixed(2)),
      totalProjectedClickGain: totalClicks,
    };
  }
}
