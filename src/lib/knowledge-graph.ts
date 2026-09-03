/**
 * VloPedia — Unified Knowledge Graph & Relational Entity Engine
 * 
 * Provides a canonical entity model and relationship graph connecting:
 * Agents <-> Weapons <-> Maps <-> Synergies <-> Counters <-> Lore <-> Guides <-> Comparisons
 * 
 * Enforces field-specific data provenance, canonical EntityResolver lookups,
 * explicit relationship directionality, and strict null-state comparison handling.
 */

import agentMeta from "@/data/agent-meta.json";
import guidesData from "@/data/guides-database.json";
import loreData from "@/data/lore-database.json";
import { slugify } from "@/lib/utils";
import { EntityResolver } from "./entity-resolver";
import { SourceRegistry } from "./sources";

import synergiesData from "@/data/relationships/agent-synergies.json";
import countersData from "@/data/relationships/agent-counters.json";
import mapFitData from "@/data/relationships/agent-map-fit.json";
import weaponsData from "@/data/relationships/agent-weapons.json";

export interface FieldProvenance {
  field: string;
  sourceId: string;
  sourceType: "GAME_API" | "VCT_SNAPSHOT" | "EDITORIAL_ANALYSIS" | "CONFIRMED_CANON";
  sourceName: string;
  patchVersion: string | null;
  lastVerified: string | null;
  confidence: "CONFIRMED" | "HIGH" | "EDITORIAL" | "PENDING_REVIEW";
}

export interface AgentSynergy {
  agentName: string;
  agentSlug: string;
  synergyReason: string;
  comboAbility: string;
  provenance: FieldProvenance;
}

export interface AgentCounter {
  agentName: string;
  agentSlug: string;
  counterReason: string;
  dangerLevel: "HIGH" | "MEDIUM" | "SITUATIONAL";
  provenance: FieldProvenance;
}

export interface AgentKnowledgeNode {
  name: string;
  slug: string;
  role: string;
  meta: {
    tier: string | null;
    tierRating: string | null;
    pickRate: string | null;
    difficulty: string | null;
  };
  tactical: {
    signatureWeapons: Array<{ name: string; slug: string; why: string; provenance: FieldProvenance }>;
    bestMaps: Array<{ name: string; slug: string; reason: string; provenance: FieldProvenance }>;
    synergies: AgentSynergy[];
    counters: AgentCounter[];
  };
  crossLinks: {
    loreSlug?: string;
    loreTitle?: string;
    compareSlug: string | null;
    compareName: string | null;
    compBuilderUrl: string;
    bestForUrl: string | null;
    bestForTitle: string | null;
    relatedGuides: Array<{ title: string; slug: string; category: string }>;
  };
  fieldAttributions: Record<string, FieldProvenance>;
}

export function getAgentKnowledgeNode(agentNameOrSlug: string): AgentKnowledgeNode {
  const norm = slugify(agentNameOrSlug);
  const resolved = EntityResolver.resolve(norm, "AGENT");

  const metaObj = agentMeta as any;
  const tiers = metaObj.tiers || {};
  const pickRates = metaObj.pickRates || {};
  const difficulty = metaObj.difficulty || {};
  const patchVersion = metaObj.metadata?.patchVersion || null;
  const lastVerified = metaObj.metadata?.lastVerified || null;

  const matchKey = Object.keys(tiers).find(k => slugify(k) === norm || k.toLowerCase() === norm) || resolved?.displayName || agentNameOrSlug;

  // Real meta values with null states instead of fabricated fallbacks
  const agentTier = tiers[matchKey] || resolved?.tier || null;
  const agentPick = pickRates[matchKey] || null;
  const agentDiff = difficulty[matchKey] || null;

  // Authoritative role resolution from EntityResolver
  const role = resolved?.category || "UNCLASSIFIED";

  // Relational Weapons (DIRECTED: fromEntity === entityId)
  const entityId = `agent:${norm}`;
  const matchedWeapons = weaponsData.filter(w => w.fromEntity === entityId);
  const signatureWeapons = matchedWeapons.map(w => {
    const weaponSlug = w.toEntity.replace("weapon:", "");
    const weaponDisplayName = EntityResolver.getDisplayName(w.toEntity, weaponSlug);
    const sourceRec = SourceRegistry.getSourceById(w.sourceId);

    return {
      name: weaponDisplayName,
      slug: weaponSlug,
      why: w.explanation,
      provenance: {
        field: "signatureWeapons",
        sourceId: w.sourceId,
        sourceType: (sourceRec?.type || w.sourceType) as any,
        sourceName: sourceRec?.name || w.source,
        patchVersion: w.patchVersion || patchVersion,
        lastVerified: w.lastVerified || lastVerified,
        confidence: w.confidence as any,
      }
    };
  });

  // Relational Map Fits (DIRECTED: fromEntity === entityId)
  const matchedMaps = mapFitData.filter(m => m.fromEntity === entityId);
  const bestMaps = matchedMaps.map(m => {
    const mapSlug = m.toEntity.replace("map:", "");
    const mapDisplayName = EntityResolver.getDisplayName(m.toEntity, mapSlug);
    const sourceRec = SourceRegistry.getSourceById(m.sourceId);

    return {
      name: mapDisplayName,
      slug: mapSlug,
      reason: m.explanation,
      provenance: {
        field: "bestMaps",
        sourceId: m.sourceId,
        sourceType: (sourceRec?.type || m.sourceType) as any,
        sourceName: sourceRec?.name || m.source,
        patchVersion: m.patchVersion || patchVersion,
        lastVerified: m.lastVerified || lastVerified,
        confidence: m.confidence as any,
      }
    };
  });

  // Relational Synergies (UNDIRECTED: fromEntity === entityId || toEntity === entityId)
  const matchedSynergies = synergiesData.filter(s => s.fromEntity === entityId || s.toEntity === entityId);
  const synergies: AgentSynergy[] = matchedSynergies.map(s => {
    const partnerId = s.fromEntity === entityId ? s.toEntity : s.fromEntity;
    const partnerSlug = partnerId.replace("agent:", "");
    const partnerDisplayName = EntityResolver.getDisplayName(partnerId, partnerSlug);
    const sourceRec = SourceRegistry.getSourceById(s.sourceId);

    return {
      agentName: partnerDisplayName,
      agentSlug: partnerSlug,
      synergyReason: s.explanation,
      comboAbility: s.evidence || "Tactical Utility Coordination",
      provenance: {
        field: "synergies",
        sourceId: s.sourceId,
        sourceType: (sourceRec?.type || s.sourceType) as any,
        sourceName: sourceRec?.name || s.source,
        patchVersion: s.patchVersion || patchVersion,
        lastVerified: s.lastVerified || lastVerified,
        confidence: s.confidence as any,
      }
    };
  });

  // Relational Counters (DIRECTED: fromEntity === entityId)
  const matchedCounters = countersData.filter(c => c.fromEntity === entityId);
  const counters: AgentCounter[] = matchedCounters.map(c => {
    const counterId = c.toEntity;
    const counterSlug = counterId.replace("agent:", "");
    const counterDisplayName = EntityResolver.getDisplayName(counterId, counterSlug);
    const sourceRec = SourceRegistry.getSourceById(c.sourceId);

    return {
      agentName: counterDisplayName,
      agentSlug: counterSlug,
      counterReason: c.explanation,
      dangerLevel: (c.dangerLevel || "HIGH") as any,
      provenance: {
        field: "counters",
        sourceId: c.sourceId,
        sourceType: (sourceRec?.type || c.sourceType) as any,
        sourceName: sourceRec?.name || c.source,
        patchVersion: c.patchVersion || patchVersion,
        lastVerified: c.lastVerified || lastVerified,
        confidence: c.confidence as any,
      }
    };
  });

  // Related Guides
  const relatedGuides = guidesData
    .filter(g => g.slug.includes(norm) || g.title.toLowerCase().includes(norm))
    .map(g => ({ title: g.title, slug: g.slug, category: g.category }));

  // Lore Article
  const loreArticle = loreData.articles.find(a => a.slug === norm || a.title.toLowerCase().includes(norm));

  // Curated Comparison (Strict match; null if no comparison exists)
  let compareSlug: string | null = null;
  let compareName: string | null = null;
  if (norm === "jett") {
    compareSlug = "jett-vs-raze";
    compareName = "Jett vs. Raze (Duelist Mobility)";
  } else if (norm === "raze") {
    compareSlug = "jett-vs-raze";
    compareName = "Raze vs. Jett (Duelist Mobility)";
  } else if (norm === "omen") {
    compareSlug = "omen-vs-clove";
    compareName = "Omen vs. Clove (Controller Versatility)";
  } else if (norm === "clove") {
    compareSlug = "omen-vs-clove";
    compareName = "Clove vs. Omen (Controller Versatility)";
  }

  // Curated Best-For (Strict match; null if no category exists)
  let bestForUrl: string | null = null;
  let bestForTitle: string | null = null;
  if (norm === "jett" || norm === "reyna" || norm === "clove") {
    bestForUrl = "/best/agents-for-solo-queue";
    bestForTitle = "Best Agents for Solo Queue";
  } else if (norm === "brimstone" || norm === "phoenix" || norm === "killjoy") {
    bestForUrl = "/best/agents-for-beginners";
    bestForTitle = "Best Agents for Beginners";
  }

  return {
    name: resolved?.displayName || matchKey,
    slug: norm,
    role,
    meta: {
      tier: agentTier,
      tierRating: agentTier ? `${agentTier} (Editorial Assessment)` : null,
      pickRate: agentPick,
      difficulty: agentDiff,
    },
    tactical: {
      signatureWeapons,
      bestMaps,
      synergies,
      counters,
    },
    crossLinks: {
      loreSlug: loreArticle?.slug,
      loreTitle: loreArticle?.title,
      compareSlug,
      compareName,
      compBuilderUrl: `/comp-builder?agents=${norm}&map=${bestMaps[0]?.slug || "ascent"}`,
      bestForUrl,
      bestForTitle,
      relatedGuides,
    },
    fieldAttributions: {
      role: {
        field: "role",
        sourceId: "riot-character-api",
        sourceType: "GAME_API",
        sourceName: "Official Riot Games Character API",
        patchVersion,
        lastVerified,
        confidence: "CONFIRMED",
      },
      tier: {
        field: "tier",
        sourceId: "vlopedia-radiant-desk",
        sourceType: "EDITORIAL_ANALYSIS",
        sourceName: "VloPedia Radiant Editorial Desk",
        patchVersion,
        lastVerified,
        confidence: "EDITORIAL",
      },
      pickRate: {
        field: "pickRate",
        sourceId: "vct-pro-dataset",
        sourceType: "VCT_SNAPSHOT",
        sourceName: "VCT Masters & Champions Match Analytics",
        patchVersion,
        lastVerified,
        confidence: "HIGH",
      },
    }
  };
}
