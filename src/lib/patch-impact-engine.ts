import { KnowledgeGraphService } from "./knowledge-graph-service";
import guidesDb from "@/data/guides-database.json";

export interface PatchDependencyNode {
  type: "META" | "RELATIONSHIP" | "GUIDE" | "COMPARISON" | "BEST_FOR" | "SKIN_HUB" | "COLLECTION";
  label: string;
  url: string;
  reason: string;
}

export interface SeoLandingDependency {
  entityId: string;
  totalOrganicPages: number;
  totalSearchExposure: number;
  landingPages: Array<{
    url: string;
    pageType: "SKIN_DETAIL" | "WEAPON_HUB" | "COLLECTION_HUB" | "COMPARISON" | "GUIDE" | "DOSSIER";
    title: string;
    estimatedImpressions: number;
    searchIntent: string;
  }>;
}

export interface PatchImpactResult {
  entityId: string;
  patchVersion: string;
  totalDependentRecords: number;
  affectedUrls: string[];
  dependencyTree: PatchDependencyNode[];
  affectedRelationships: Array<{
    targetEntity: string;
    relationType: string;
    reason: string;
  }>;
  affectedGuides: Array<{
    slug: string;
    title: string;
    reason: string;
  }>;
  affectedComparisons: Array<{
    type: string;
    slug: string;
    title: string;
  }>;
  reviewStatus: "FRESH" | "NEEDS_REVIEW" | "CRITICAL_UPDATE_REQUIRED";
}

export interface FreshnessBadgeInfo {
  status: "FRESH" | "NEEDS_REVIEW" | "CRITICAL_UPDATE_REQUIRED";
  lastReviewed: string;
  patchAgeCount: number;
  badgeLabel: string;
  tooltipText: string;
}

export class PatchImpactEngine {
  /**
   * Evaluates the multi-tier ripple impact across the knowledge graph and content library when an entity is patched.
   * Patch -> Entity changed -> Meta -> Counters/Synergies -> Map Fit -> Guides -> Comparisons -> Best-for
   */
  public static evaluateImpact(entityId: string, currentPatch: string = "9.04"): PatchImpactResult {
    const entity = KnowledgeGraphService.getEntityById(entityId);
    const slug = entity?.slug || entityId.split(":")[1] || entityId;
    const type = entity?.type || (entityId.startsWith("agent:") ? "AGENT" : entityId.startsWith("weapon:") ? "WEAPON" : "MAP");

    const affectedUrls: string[] = [];
    const dependencyTree: PatchDependencyNode[] = [];

    // 1. Core entity URL
    let coreUrl = `/agents/${slug}`;
    if (type === "WEAPON") coreUrl = `/weapons/${slug}`;
    else if (type === "MAP") coreUrl = `/maps/${slug}`;
    
    affectedUrls.push(coreUrl);
    dependencyTree.push({
      type: "META",
      label: `${entity?.displayName || slug} Core Dossier`,
      url: coreUrl,
      reason: `Primary stats and abilities baseline under Patch ${currentPatch}`
    });

    // 2. Relational Edges Affected (Counters, Synergies, Map Fits)
    const relationships = KnowledgeGraphService.getRelationshipsForEntity(entityId);
    const affectedRelationships = relationships.map(r => {
      const otherId = r.from === entityId ? r.to : r.from;
      const otherSlug = otherId.split(":")[1] || otherId;
      const targetUrl = otherId.startsWith("agent:") ? `/agents/${otherSlug}` : otherId.startsWith("map:") ? `/maps/${otherSlug}` : `/weapons/${otherSlug}`;
      
      dependencyTree.push({
        type: "RELATIONSHIP",
        label: `${r.relationType.replace(/_/g, " ")} // ${otherSlug.toUpperCase()}`,
        url: targetUrl,
        reason: `Directional interaction requires tactical re-verification for Patch ${currentPatch}`
      });

      return {
        targetEntity: otherId,
        relationType: r.relationType,
        reason: `Synergy or counterplay parameters may shift under Patch ${currentPatch}`
      };
    });

    // 3. Guides affected
    const affectedGuides: Array<{ slug: string; title: string; reason: string }> = [];
    for (const guide of guidesDb) {
      const mentionsAgent = guide.relatedAgents?.some(a => a.toLowerCase() === slug.toLowerCase());
      const mentionsWeapon = (guide as any).relatedWeapons?.some((w: string) => w.toLowerCase() === slug.toLowerCase());
      const mentionsInContent = guide.content.toLowerCase().includes(slug.toLowerCase());

      if (mentionsAgent || mentionsWeapon || mentionsInContent) {
        affectedGuides.push({
          slug: guide.slug,
          title: guide.title,
          reason: `Guide references ${slug} tactics or kinematics`
        });
        affectedUrls.push(`/guides/${guide.slug}`);
        dependencyTree.push({
          type: "GUIDE",
          label: guide.title,
          url: `/guides/${guide.slug}`,
          reason: `Tactical advice mentions ${slug} setups`
        });
      }
    }

    // 4. Comparisons affected
    const affectedComparisons: Array<{ type: string; slug: string; title: string }> = [];
    if (slug === "vandal" || slug === "phantom") {
      affectedComparisons.push({
        type: "weapons",
        slug: "vandal-vs-phantom",
        title: "Vandal vs. Phantom Ballistics Comparison"
      });
      affectedUrls.push(`/compare/weapons/vandal-vs-phantom`);
      dependencyTree.push({
        type: "COMPARISON",
        label: "Vandal vs. Phantom Comparison",
        url: `/compare/weapons/vandal-vs-phantom`,
        reason: "Rifle duel damage falloff check"
      });
    }
    if (slug === "jett" || slug === "raze") {
      affectedComparisons.push({
        type: "agents",
        slug: "jett-vs-raze",
        title: "Jett vs. Raze Entry Duelist Comparison"
      });
      affectedUrls.push(`/compare/agents/jett-vs-raze`);
      dependencyTree.push({
        type: "COMPARISON",
        label: "Jett vs. Raze Comparison",
        url: `/compare/agents/jett-vs-raze`,
        reason: "Entry duelist mobility parameters"
      });
    }
    if (slug === "omen" || slug === "clove") {
      affectedComparisons.push({
        type: "agents",
        slug: "omen-vs-clove",
        title: "Omen vs. Clove Controller Comparison"
      });
      affectedUrls.push(`/compare/agents/omen-vs-clove`);
      dependencyTree.push({
        type: "COMPARISON",
        label: "Omen vs. Clove Comparison",
        url: `/compare/agents/omen-vs-clove`,
        reason: "Hollow smoke coverage duration"
      });
    }

    // 5. Best-for landing pages affected
    if (slug === "ascent") {
      affectedUrls.push(`/best/agents-on-ascent`);
      dependencyTree.push({
        type: "BEST_FOR",
        label: "Best Agents on Ascent",
        url: `/best/agents-on-ascent`,
        reason: "Meta comp tier calibration"
      });
    }

    const uniqueUrls = Array.from(new Set(affectedUrls));
    const totalDependentRecords = dependencyTree.length;

    const reviewStatus: PatchImpactResult["reviewStatus"] = 
      totalDependentRecords >= 6
        ? "CRITICAL_UPDATE_REQUIRED"
        : totalDependentRecords >= 2
        ? "NEEDS_REVIEW"
        : "FRESH";

    return {
      entityId,
      patchVersion: currentPatch,
      totalDependentRecords,
      affectedUrls: uniqueUrls,
      dependencyTree,
      affectedRelationships,
      affectedGuides,
      affectedComparisons,
      reviewStatus
    };
  }

  /**
   * Evaluates content freshness against the active patch baseline
   */
  public static getContentFreshness(lastReviewedDate: string = "2026-09-02"): FreshnessBadgeInfo {
    const reviewDate = new Date(lastReviewedDate);
    const now = new Date("2026-09-04T09:00:00Z");
    const diffDays = Math.max(0, Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24)));

    let status: FreshnessBadgeInfo["status"] = "FRESH";
    let patchAgeCount = 0;
    let badgeLabel = "✓ Patch 9.04 Verified";
    let tooltipText = `Reviewed on ${lastReviewedDate}. Fully calibrated to active Patch 9.04.`;

    if (diffDays > 30) {
      status = "CRITICAL_UPDATE_REQUIRED";
      patchAgeCount = 3;
      badgeLabel = "⚠ Critical Review Required";
      tooltipText = `Last reviewed ${diffDays} days ago (3 patches elapsed). Tactics may be stale.`;
    } else if (diffDays > 14) {
      status = "NEEDS_REVIEW";
      patchAgeCount = 1;
      badgeLabel = "⚠ Needs Review";
      tooltipText = `Last reviewed ${diffDays} days ago. Balance parameters should be audited.`;
    }

    return {
      status,
      lastReviewed: lastReviewedDate,
      patchAgeCount,
      badgeLabel,
      tooltipText
    };
  }

  /**
   * Runs automated scan over all entities to discover decaying content
   */
  public static scanStaleContent(): Array<{ 
    entityId: string; 
    affectedUrls: string[]; 
    staleCount: number; 
    totalDependentRecords: number;
    status: string;
  }> {
    const entities = KnowledgeGraphService.getAllEntities();
    return entities.map(e => {
      const impact = this.evaluateImpact(e.id, e.patchVersion);
      return {
        entityId: e.id,
        affectedUrls: impact.affectedUrls,
        staleCount: impact.affectedUrls.length,
        totalDependentRecords: impact.totalDependentRecords,
        status: impact.reviewStatus
      };
    });
  }

  /**
   * Maps an entity (e.g. weapon:vandal) to all dependent organic search landing pages
   * to assess organic search exposure when a balance patch drops.
   */
  public static getSeoLandingPageDependencies(entityId: string): SeoLandingDependency {
    const slug = entityId.replace(/^(agent|weapon|map|skin|faction):/, "").toLowerCase();
    const landingPages: SeoLandingDependency["landingPages"] = [];

    if (slug === "vandal") {
      landingPages.push(
        { url: "/weapons/vandal", pageType: "DOSSIER", title: "Vandal Ballistics & Damage Matrix", estimatedImpressions: 410, searchIntent: "vandal damage falloff" },
        { url: "/skins/vandal", pageType: "WEAPON_HUB", title: "Best Vandal Skins & Price Spectrum", estimatedImpressions: 320, searchIntent: "best vandal skins" },
        { url: "/skins/aemondir-vandal", pageType: "SKIN_DETAIL", title: "Aemondir Vandal Price & Variants", estimatedImpressions: 140, searchIntent: "aemondir vandal" },
        { url: "/skins/aeris-vandal", pageType: "SKIN_DETAIL", title: "Aeris Vandal Showcase & Upgrades", estimatedImpressions: 62, searchIntent: "aeris vandal" },
        { url: "/skins/reaver-vandal", pageType: "SKIN_DETAIL", title: "Reaver Vandal Sound & Finisher", estimatedImpressions: 95, searchIntent: "reaver vandal" },
        { url: "/skins/kuronami-vandal", pageType: "SKIN_DETAIL", title: "Kuronami Vandal Animations", estimatedImpressions: 80, searchIntent: "kuronami vandal" },
        { url: "/collections/aemondir", pageType: "COLLECTION_HUB", title: "Aemondir Collection Checklist", estimatedImpressions: 55, searchIntent: "aemondir bundle" },
        { url: "/compare/weapons/vandal-vs-phantom", pageType: "COMPARISON", title: "Vandal vs Phantom Recoil Duel", estimatedImpressions: 6150, searchIntent: "vandal vs phantom" },
        { url: "/guides/vandal-vs-phantom", pageType: "GUIDE", title: "Vandal vs Phantom Situational Guide", estimatedImpressions: 120, searchIntent: "which is better vandal or phantom" },
      );
    } else if (slug === "phantom") {
      landingPages.push(
        { url: "/weapons/phantom", pageType: "DOSSIER", title: "Phantom Fire Rate & Silencer", estimatedImpressions: 380, searchIntent: "phantom damage" },
        { url: "/skins/phantom", pageType: "WEAPON_HUB", title: "Phantom Skins Hub", estimatedImpressions: 290, searchIntent: "best phantom skins" },
        { url: "/skins/helix-phantom", pageType: "SKIN_DETAIL", title: "Helix Phantom Price & Variants", estimatedImpressions: 44, searchIntent: "helix phantom" },
        { url: "/collections/helix", pageType: "COLLECTION_HUB", title: "Helix Collection", estimatedImpressions: 35, searchIntent: "helix bundle" },
        { url: "/compare/weapons/vandal-vs-phantom", pageType: "COMPARISON", title: "Vandal vs Phantom Recoil Duel", estimatedImpressions: 6150, searchIntent: "vandal vs phantom" },
      );
    } else if (slug === "jett") {
      landingPages.push(
        { url: "/agents/jett", pageType: "DOSSIER", title: "Jett Agent Dossier & Tailwind", estimatedImpressions: 9400, searchIntent: "jett abilities" },
        { url: "/guides/how-to-counter-jett", pageType: "GUIDE", title: "How to Counter Jett in VALORANT", estimatedImpressions: 4820, searchIntent: "counter jett" },
        { url: "/compare/agents/jett-vs-raze", pageType: "COMPARISON", title: "Jett vs Raze Entry Mobility", estimatedImpressions: 890, searchIntent: "jett vs raze" },
      );
    } else {
      landingPages.push({
        url: `/${entityId.startsWith("agent:") ? "agents" : entityId.startsWith("weapon:") ? "weapons" : "maps"}/${slug}`,
        pageType: "DOSSIER",
        title: `${slug.toUpperCase()} Tactical Dossier`,
        estimatedImpressions: 100,
        searchIntent: `${slug} valorant`,
      });
    }

    const totalImpressions = landingPages.reduce((sum, p) => sum + p.estimatedImpressions, 0);

    return {
      entityId,
      totalOrganicPages: landingPages.length,
      totalSearchExposure: totalImpressions,
      landingPages,
    };
  }
}
