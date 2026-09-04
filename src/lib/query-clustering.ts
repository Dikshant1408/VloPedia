/**
 * VloPedia — Query Clustering & Knowledge Graph Mesh Engine
 * 
 * Groups fragmented search queries into unified Entity Clusters,
 * breaks down sub-intent demand (Price, Variants, Showcase, Comparison),
 * and connects clusters to Knowledge Graph nodes (Weapon Hub, Collection, Guides).
 */

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

export const SEEDED_QUERY_CLUSTERS: EntityQueryCluster[] = [
  {
    clusterId: "cluster-aemondir-vandal",
    displayName: "Aemondir Vandal",
    canonicalUrl: "/skins/aemondir-vandal",
    category: "Skins",
    totalImpressions: 140,
    totalClicks: 0,
    avgPosition: 8.91,
    avgCtr: 0.0,
    intentBreakdown: {
      ENTITY_DISCOVERY: 104,
      PRICE_VP: 13,
      VARIANTS_CHROMAS: 15,
      SHOWCASE_VIDEO: 8,
      COMPARISON_DUEL: 0,
      NAVIGATION: 0,
    },
    constituentQueries: [
      { query: "aemondir vandal", subIntent: "ENTITY_DISCOVERY", impressions: 104, clicks: 0, position: 8.93, ctr: 0.0 },
      { query: "vandal aemondir", subIntent: "ENTITY_DISCOVERY", impressions: 13, clicks: 0, position: 8.85, ctr: 0.0 },
      { query: "aemondir vandal price", subIntent: "PRICE_VP", impressions: 13, clicks: 0, position: 8.90, ctr: 0.0 },
      { query: "aemondir vandal variants", subIntent: "VARIANTS_CHROMAS", impressions: 15, clicks: 0, position: 8.95, ctr: 0.0 },
    ],
    graphConnections: {
      primaryEntityId: "skin:aemondir-vandal",
      parentWeaponUrl: "/skins/vandal",
      parentWeaponName: "Vandal Skins Hub",
      collectionUrl: "/collections/aemondir",
      collectionName: "Aemondir Collection",
      relatedComparisonUrl: "/compare/weapons/vandal-vs-phantom",
      relatedGuideUrl: "/guides/vandal-vs-phantom",
    },
  },
  {
    clusterId: "cluster-aeris-vandal",
    displayName: "Aeris Vandal",
    canonicalUrl: "/skins/aeris-vandal",
    category: "Skins",
    totalImpressions: 62,
    totalClicks: 0,
    avgPosition: 8.75,
    avgCtr: 0.0,
    intentBreakdown: {
      ENTITY_DISCOVERY: 46,
      PRICE_VP: 6,
      VARIANTS_CHROMAS: 0,
      SHOWCASE_VIDEO: 10,
      COMPARISON_DUEL: 0,
      NAVIGATION: 0,
    },
    constituentQueries: [
      { query: "aeris vandal", subIntent: "ENTITY_DISCOVERY", impressions: 46, clicks: 0, position: 8.87, ctr: 0.0 },
      { query: "aeris vandal showcase", subIntent: "SHOWCASE_VIDEO", impressions: 10, clicks: 0, position: 8.40, ctr: 0.0 },
      { query: "aeris vandal price", subIntent: "PRICE_VP", impressions: 6, clicks: 0, position: 8.90, ctr: 0.0 },
    ],
    graphConnections: {
      primaryEntityId: "skin:aeris-vandal",
      parentWeaponUrl: "/skins/vandal",
      parentWeaponName: "Vandal Skins Hub",
      collectionUrl: "/collections/aeris",
      collectionName: "Aeris Collection",
      relatedComparisonUrl: "/compare/weapons/vandal-vs-phantom",
    },
  },
  {
    clusterId: "cluster-helix-phantom",
    displayName: "Helix Phantom",
    canonicalUrl: "/skins/helix-phantom",
    category: "Skins",
    totalImpressions: 44,
    totalClicks: 0,
    avgPosition: 9.30,
    avgCtr: 0.0,
    intentBreakdown: {
      ENTITY_DISCOVERY: 18,
      PRICE_VP: 12,
      VARIANTS_CHROMAS: 14,
      SHOWCASE_VIDEO: 0,
      COMPARISON_DUEL: 0,
      NAVIGATION: 0,
    },
    constituentQueries: [
      { query: "helix phantom", subIntent: "ENTITY_DISCOVERY", impressions: 18, clicks: 0, position: 9.50, ctr: 0.0 },
      { query: "helix phantom variants", subIntent: "VARIANTS_CHROMAS", impressions: 14, clicks: 0, position: 9.20, ctr: 0.0 },
      { query: "helix phantom valorant price", subIntent: "PRICE_VP", impressions: 12, clicks: 0, position: 8.90, ctr: 0.0 },
    ],
    graphConnections: {
      primaryEntityId: "skin:helix-phantom",
      parentWeaponUrl: "/skins/phantom",
      parentWeaponName: "Phantom Skins Hub",
      collectionUrl: "/collections/helix",
      collectionName: "Helix Collection",
      relatedComparisonUrl: "/compare/weapons/vandal-vs-phantom",
    },
  },
  {
    clusterId: "cluster-minima-karambit",
    displayName: "Minima Karambit",
    canonicalUrl: "/skins/minima-karambit",
    category: "Skins",
    totalImpressions: 34,
    totalClicks: 0,
    avgPosition: 10.20,
    avgCtr: 0.0,
    intentBreakdown: {
      ENTITY_DISCOVERY: 23,
      PRICE_VP: 11,
      VARIANTS_CHROMAS: 0,
      SHOWCASE_VIDEO: 0,
      COMPARISON_DUEL: 0,
      NAVIGATION: 0,
    },
    constituentQueries: [
      { query: "minima karambit", subIntent: "ENTITY_DISCOVERY", impressions: 23, clicks: 0, position: 10.13, ctr: 0.0 },
      { query: "how much is minima karambit", subIntent: "PRICE_VP", impressions: 11, clicks: 0, position: 10.40, ctr: 0.0 },
    ],
    graphConnections: {
      primaryEntityId: "skin:minima-karambit",
      parentWeaponUrl: "/skins/melee",
      parentWeaponName: "Melee & Knife Hub",
      collectionUrl: "/collections/minima",
      collectionName: "Minima Collection",
    },
  },
];

export class QueryClusteringEngine {
  public static getAllClusters(): EntityQueryCluster[] {
    return SEEDED_QUERY_CLUSTERS;
  }

  public static getClusterById(id: string): EntityQueryCluster | undefined {
    return SEEDED_QUERY_CLUSTERS.find(c => c.clusterId === id);
  }

  public static getTotalClusteredDemand(): {
    totalClusters: number;
    totalSearchImpressions: number;
    intentBreakdown: Record<SubIntentType, number>;
  } {
    const clusters = this.getAllClusters();
    const intentTotals: Record<SubIntentType, number> = {
      ENTITY_DISCOVERY: 0,
      PRICE_VP: 0,
      VARIANTS_CHROMAS: 0,
      SHOWCASE_VIDEO: 0,
      COMPARISON_DUEL: 0,
      NAVIGATION: 0,
    };

    let totalImpressions = 0;
    for (const c of clusters) {
      totalImpressions += c.totalImpressions;
      for (const [intent, count] of Object.entries(c.intentBreakdown)) {
        intentTotals[intent as SubIntentType] += count;
      }
    }

    return {
      totalClusters: clusters.length,
      totalSearchImpressions: totalImpressions,
      intentBreakdown: intentTotals,
    };
  }
}
