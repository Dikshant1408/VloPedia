/**
 * VloPedia — Dynamic Query Clustering & Content Brief Engine
 * 
 * Generates unified entity query clusters directly from real GSC telemetry rows,
 * maps sub-intent distributions (Price, Variants, Showcase, Comparison),
 * connects clusters to the Knowledge Graph, and produces actionable Content Briefs.
 */

import { GscStorageService } from "./gsc/storage";
import { DailySearchSnapshot, SearchSnapshotRow } from "./gsc/types";
import { EntityResolver } from "./entity-resolver";
import { slugify } from "./utils";

export type SubIntentType = 
  | "ENTITY_DISCOVERY" 
  | "PRICE_VP" 
  | "VARIANTS_CHROMAS" 
  | "SHOWCASE_VIDEO" 
  | "COMPARISON_DUEL" 
  | "NAVIGATION";

export interface ConstituentQuery {
  query: string;
  subIntent: SubIntentType;
  impressions: number;
  clicks: number;
  position: number;
  ctr: number;
}

export interface EntityQueryCluster {
  clusterId: string;
  displayName: string;
  canonicalUrl: string;
  category: "Skins" | "Weapons" | "Agents" | "Guides" | "Navigation";
  totalImpressions: number;
  totalClicks: number;
  avgPosition: number;
  avgCtr: number;
  intentBreakdown: Record<SubIntentType, number>; // Sub-intent -> impression count
  constituentQueries: ConstituentQuery[];
  graphConnections: {
    primaryEntityId: string;
    parentWeaponUrl?: string;
    parentWeaponName?: string;
    collectionUrl?: string;
    collectionName?: string;
    relatedComparisonUrl?: string;
    relatedGuideUrl?: string;
  };
}

export interface ContentBrief {
  clusterId: string;
  entityName: string;
  primaryIntent: string;
  entityId: string;
  targetUrl: string;
  totalDemandImpressions: number;
  queries: string[];
  missingCoverage: string[];
  improvementTask: string;
  recommendedH1: string;
  recommendedMetaDescription: string;
  generatedAt: string;
}

/**
 * Classifies query sub-intent based on lexical patterns
 */
export function classifySubIntent(query: string): SubIntentType {
  const q = query.toLowerCase();
  if (q.includes("price") || q.includes("vp") || q.includes("cost") || q.includes("how much")) {
    return "PRICE_VP";
  }
  if (q.includes("variant") || q.includes("chroma") || q.includes("color")) {
    return "VARIANTS_CHROMAS";
  }
  if (q.includes("showcase") || q.includes("video") || q.includes("animation") || q.includes("sound") || q.includes("inspect") || q.includes("finisher")) {
    return "SHOWCASE_VIDEO";
  }
  if (q.includes("vs") || q.includes("versus") || q.includes("compare") || q.includes("difference")) {
    return "COMPARISON_DUEL";
  }
  if (q.includes("valovault") || q.includes("vlopedia") || q.includes("catalog") || q.includes("tier list")) {
    return "NAVIGATION";
  }
  return "ENTITY_DISCOVERY";
}

export class QueryClusteringEngine {
  /**
   * Generates dynamic query clusters directly from Search Console snapshot rows
   */
  public static generateClustersFromSnapshot(snapshot?: DailySearchSnapshot): EntityQueryCluster[] {
    const currentSnapshot = snapshot || GscStorageService.getLatestSnapshot();
    const rows = currentSnapshot.rows;

    // Map entity keys to constituent queries
    const entityClusterMap = new Map<string, {
      displayName: string;
      canonicalUrl: string;
      category: EntityQueryCluster["category"];
      queries: ConstituentQuery[];
      primaryEntityId: string;
      parentWeapon?: { name: string; url: string };
      collection?: { name: string; url: string };
    }>();

    for (const row of rows) {
      const q = row.query.toLowerCase();
      const subIntent = classifySubIntent(q);

      // Determine entity identity
      let entityKey = "";
      let displayName = "";
      let canonicalUrl = row.url;
      let category: EntityQueryCluster["category"] = "Skins";
      let primaryEntityId = "";
      let parentWeapon: { name: string; url: string } | undefined;
      let collection: { name: string; url: string } | undefined;

      if (row.url.startsWith("/skins/") && !row.url.endsWith("/watch") && row.url !== "/skins") {
        const skinSlug = row.url.replace("/skins/", "");
        entityKey = skinSlug; // e.g. aemondir-vandal -> cluster-aemondir-vandal
        displayName = skinSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        canonicalUrl = `/skins/${skinSlug}`;
        category = "Skins";
        primaryEntityId = `skin:${skinSlug}`;

        // Weapon parent detection
        const weaponNames = ["vandal", "phantom", "karambit", "axe", "operator", "sheriff", "knife"];
        for (const w of weaponNames) {
          if (skinSlug.includes(w)) {
            parentWeapon = { name: `${w.charAt(0).toUpperCase() + w.slice(1)} Skins Hub`, url: `/skins/${w}` };
            const colName = skinSlug.replace(w, "").replace(/-+$/, "");
            if (colName) {
              collection = { name: `${colName.charAt(0).toUpperCase() + colName.slice(1)} Collection`, url: `/collections/${colName}` };
            }
            break;
          }
        }
      } else if (row.url.startsWith("/agents/")) {
        const agentSlug = row.url.replace("/agents/", "");
        entityKey = `agent:${agentSlug}`;
        displayName = agentSlug.charAt(0).toUpperCase() + agentSlug.slice(1);
        canonicalUrl = `/agents/${agentSlug}`;
        category = "Agents";
        primaryEntityId = entityKey;
      } else if (row.url.startsWith("/compare/")) {
        entityKey = "compare:vandal-vs-phantom";
        displayName = "Vandal vs. Phantom";
        canonicalUrl = row.url;
        category = "Weapons";
        primaryEntityId = entityKey;
      } else if (row.url.startsWith("/guides/")) {
        entityKey = `guide:${row.url.replace("/guides/", "")}`;
        displayName = "Counterplay & Strategy Guide";
        canonicalUrl = row.url;
        category = "Guides";
        primaryEntityId = entityKey;
      } else {
        entityKey = "nav:brand-portal";
        displayName = "VloPedia Brand & Navigation";
        canonicalUrl = "/";
        category = "Navigation";
        primaryEntityId = "portal:home";
      }

      if (!entityClusterMap.has(entityKey)) {
        entityClusterMap.set(entityKey, {
          displayName,
          canonicalUrl,
          category,
          queries: [],
          primaryEntityId,
          parentWeapon,
          collection,
        });
      }

      const clusterData = entityClusterMap.get(entityKey)!;
      clusterData.queries.push({
        query: row.query,
        subIntent,
        impressions: row.impressions,
        clicks: row.clicks,
        position: row.position,
        ctr: row.ctr,
      });
    }

    const clusters: EntityQueryCluster[] = [];

    for (const [key, c] of entityClusterMap.entries()) {
      const totalImpressions = c.queries.reduce((sum, q) => sum + q.impressions, 0);
      const totalClicks = c.queries.reduce((sum, q) => sum + q.clicks, 0);
      const weightedPos = c.queries.reduce((sum, q) => sum + (q.position * q.impressions), 0);
      const avgPosition = totalImpressions > 0 ? Number((weightedPos / totalImpressions).toFixed(2)) : 100;
      const avgCtr = totalImpressions > 0 ? Number((totalClicks / totalImpressions).toFixed(4)) : 0;

      const intentBreakdown: Record<SubIntentType, number> = {
        ENTITY_DISCOVERY: 0,
        PRICE_VP: 0,
        VARIANTS_CHROMAS: 0,
        SHOWCASE_VIDEO: 0,
        COMPARISON_DUEL: 0,
        NAVIGATION: 0,
      };

      c.queries.forEach(q => {
        intentBreakdown[q.subIntent] = (intentBreakdown[q.subIntent] || 0) + q.impressions;
      });

      const clusterId = `cluster-${slugify(key.replace(/[:/]/g, "-"))}`;

      clusters.push({
        clusterId,
        displayName: c.displayName,
        canonicalUrl: c.canonicalUrl,
        category: c.category,
        totalImpressions,
        totalClicks,
        avgPosition,
        avgCtr,
        intentBreakdown,
        constituentQueries: c.queries.sort((a, b) => b.impressions - a.impressions),
        graphConnections: {
          primaryEntityId: c.primaryEntityId,
          parentWeaponUrl: c.parentWeapon?.url,
          parentWeaponName: c.parentWeapon?.name,
          collectionUrl: c.collection?.url,
          collectionName: c.collection?.name,
          relatedComparisonUrl: "/compare/weapons/vandal-vs-phantom",
          relatedGuideUrl: "/guides/vandal-vs-phantom",
        }
      });
    }

    return clusters.sort((a, b) => b.totalImpressions - a.totalImpressions);
  }

  /**
   * Returns all clusters (alias for generateClustersFromSnapshot)
   */
  public static getAllClusters(): EntityQueryCluster[] {
    return this.generateClustersFromSnapshot();
  }

  /**
   * Finds a specific cluster by ID
   */
  public static getClusterById(clusterId: string): EntityQueryCluster | undefined {
    return this.getAllClusters().find(c => c.clusterId === clusterId);
  }

  /**
   * Generates an automatic Content Brief with missing coverage checklist from a cluster
   */
  public static generateContentBrief(clusterId: string): ContentBrief | null {
    const cluster = this.getClusterById(clusterId) || this.getAllClusters()[0];
    if (!cluster) return null;

    const queries = cluster.constituentQueries.map(q => q.query);
    const missingCoverage: string[] = [];

    // Analyze intent gaps from intentBreakdown
    if (cluster.intentBreakdown.PRICE_VP === 0 || cluster.category === "Skins") {
      missingCoverage.push("Verified VP price, tier badge (Select/Deluxe/Premium/Ultra/Exclusive), and upgrade costs");
    }
    if (cluster.intentBreakdown.VARIANTS_CHROMAS === 0 || cluster.category === "Skins") {
      missingCoverage.push("Chroma colorways table (Level 1–4) and Radianite point unlock matrix");
    }
    if (cluster.intentBreakdown.SHOWCASE_VIDEO === 0 || cluster.category === "Skins") {
      missingCoverage.push("Inline video inspect, reload SFX, and finisher audio animation player");
    }
    if (cluster.category === "Skins") {
      missingCoverage.push("Direct internal links to weapon skin hub and full collection line");
    }

    const improvementTask = `Optimize ${cluster.canonicalUrl}: Embed above-the-fold AnswerBox answering primary search demand (${cluster.totalImpressions} impressions, pos ${cluster.avgPosition.toFixed(1)}). Address missing coverage: ${missingCoverage.slice(0, 2).join(", ")}.`;
    const recommendedH1 = `${cluster.displayName} — Price, Variants, Upgrades & Showcase`;
    const recommendedMetaDescription = `${cluster.displayName} in VALORANT: Check VP cost, tier rarity, color variants, sound effects, finisher video showcase, and weapon hub comparisons on VloPedia.`;

    return {
      clusterId: cluster.clusterId,
      entityName: cluster.displayName,
      primaryIntent: cluster.intentBreakdown.PRICE_VP > 0 ? "PRICE_VP" : "ENTITY_DISCOVERY",
      entityId: cluster.graphConnections.primaryEntityId,
      targetUrl: cluster.canonicalUrl,
      totalDemandImpressions: cluster.totalImpressions,
      queries,
      missingCoverage,
      improvementTask,
      recommendedH1,
      recommendedMetaDescription,
      generatedAt: new Date().toISOString(),
    };
  }
}

// Backward-compatible export
export const SEEDED_QUERY_CLUSTERS: EntityQueryCluster[] = QueryClusteringEngine.getAllClusters();
