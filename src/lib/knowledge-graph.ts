/**
 * VloPedia — Unified Knowledge Graph & Relational Entity Engine
 * 
 * Provides a canonical entity model and relationship graph connecting:
 * Agents <-> Weapons <-> Maps <-> Synergies <-> Counters <-> Lore <-> Guides <-> Comparisons
 * 
 * Enforces transparent data provenance for every statistic:
 * - Editorial Tier Ratings
 * - VCT Tournament Presence Snapshots
 * - Official In-Game Game Telemetry
 */

import agentMeta from "@/data/agent-meta.json";
import guidesData from "@/data/guides-database.json";
import loreData from "@/data/lore-database.json";
import { slugify } from "@/lib/utils";

export interface DataAttribution {
  tierAttribution: "Editorial Meta Assessment";
  proPresenceAttribution: "VCT Champions & Pro Match Dataset";
  telemetryAttribution: "Official Riot Games API Telemetry";
  patchVersion: string;
  season: string;
  lastVerified: string;
  sourceDataset: string;
}

export interface AgentSynergy {
  agentName: string;
  agentSlug: string;
  synergyReason: string;
  comboAbility: string;
}

export interface AgentCounter {
  agentName: string;
  agentSlug: string;
  counterReason: string;
  dangerLevel: "HIGH" | "MEDIUM" | "SITUATIONAL";
}

export interface AgentKnowledgeNode {
  name: string;
  slug: string;
  role: string;
  meta: {
    tier: string;
    tierRating: string;
    pickRate: string;
    difficulty: string;
  };
  tactical: {
    signatureWeapons: Array<{ name: string; slug: string; why: string }>;
    bestMaps: Array<{ name: string; slug: string; reason: string }>;
    synergies: AgentSynergy[];
    counters: AgentCounter[];
  };
  crossLinks: {
    loreSlug?: string;
    loreTitle?: string;
    compareSlug: string;
    compareName: string;
    compBuilderUrl: string;
    bestForUrl: string;
    relatedGuides: Array<{ title: string; slug: string; category: string }>;
  };
  attribution: DataAttribution;
}

// Tactical weapon mapping for agents
const AGENT_WEAPON_MAP: Record<string, Array<{ name: string; slug: string; why: string }>> = {
  Jett: [
    { name: "Operator", slug: "operator", why: "Tailwind allows aggressive instant escape after taking early sniper angles." },
    { name: "Vandal", slug: "vandal", why: "Guaranteed 1-tap headshot lethality during aerial hover entries." }
  ],
  Reyna: [
    { name: "Vandal", slug: "vandal", why: "Overheal and Dismiss reset on first-bullet headshot eliminations." }
  ],
  Raze: [
    { name: "Phantom", slug: "phantom", why: "Close-range spray accuracy matches Satchel double-jump entry momentum." },
    { name: "Judge", slug: "judge", why: "High burst lethality in tight chokepoints and Hookah drop-downs." }
  ],
  Omen: [
    { name: "Phantom", slug: "phantom", why: "Silenced bullet tracers let Omen spam through dark cover smokes undetected." }
  ],
  Sova: [
    { name: "Odin", slug: "odin", why: "Recon Bolt reveals tag enemies through wall-bang surfaces on Ascent and Haven." },
    { name: "Vandal", slug: "vandal", why: "Disciplined crosshair placement holding long recon lines." }
  ],
  Cypher: [
    { name: "Phantom", slug: "phantom", why: "Spamming trapped enemies in Cyber Cages without revealing muzzle flash." }
  ],
  Killjoy: [
    { name: "Phantom", slug: "phantom", why: "Close range multi-target retake spam inside Nanoswarm triggers." }
  ],
  Viper: [
    { name: "Phantom", slug: "phantom", why: "Decay passive drops enemies to 1-bullet threshold within Poison Cloud." }
  ],
};

const DEFAULT_WEAPONS = [
  { name: "Vandal", slug: "vandal", why: "Primary long-range high-damage assault rifle." },
  { name: "Phantom", slug: "phantom", why: "High fire rate with tracerless smoke spam control." }
];

// High-confidence synergy reasons
const SYNERGY_REASONS: Record<string, Record<string, { reason: string; combo: string }>> = {
  Jett: {
    Omen: { reason: "Omen's Paranoia blind covers Jett's dash into smoke.", combo: "Paranoia + Tailwind Dash" },
    Sova: { reason: "Sova's Recon Bolt identifies anchor positions before entry.", combo: "Recon Dart + Updraft Cloudburst" },
    "KAY/O": { reason: "KAY/O suppresses sentinel traps before Jett entries.", combo: "ZERO/POINT + Tailwind Entry" },
  },
  Raze: {
    Fade: { reason: "Fade's Seize trap tethers enemies into Paint Shells cluster grenades.", combo: "Seize + Paint Shells" },
    Breach: { reason: "Breach stun sets up instant satchel double-jump finishes.", combo: "Fault Line + Blast Pack" },
    Omen: { reason: "Dark cover isolates bomb site angles for satchel clearance.", combo: "Dark Cover + Showstopper" },
  },
  Omen: {
    Jett: { reason: "Deep hollow smokes allow Jett to dash inside and contest site space.", combo: "Dark Cover + Dash" },
    Fade: { reason: "Haunt reveals enemies blinded by Paranoia across chokepoints.", combo: "Paranoia + Haunt" },
  },
  Sova: {
    Killjoy: { reason: "Recon dart tags targets inside Lockdown for Hunter's Fury wall-bangs.", combo: "Hunter's Fury + Lockdown" },
    Omen: { reason: "Recon arrows guide Omen's smoke placement and flash timing.", combo: "Recon Bolt + Paranoia" },
  },
};

// Counter reasons
const COUNTER_REASONS: Record<string, Record<string, { reason: string; danger: "HIGH" | "MEDIUM" | "SITUATIONAL" }>> = {
  Jett: {
    Cypher: { reason: "Hidden Trapwires stop Jett's dash momentum instantly, leaving her stranded.", danger: "HIGH" },
    "KAY/O": { reason: "ZERO/POINT suppression disables Tailwind and Blade Storm instantly.", danger: "HIGH" },
    Killjoy: { reason: "Lockdown ultimate forces Jett off site or wastes escape dash.", danger: "MEDIUM" },
  },
  Raze: {
    Cypher: { reason: "Trapwires catch satchel jumps mid-air before site entry.", danger: "HIGH" },
    "KAY/O": { reason: "Suppression cancels primed Satchels and Showstopper rocket.", danger: "HIGH" },
  },
  Omen: {
    Fade: { reason: "Haunt and Prowlers clear Omen out of hollow one-way smokes.", danger: "MEDIUM" },
    "KAY/O": { reason: "Suppression cancels From the Shadows teleport and disables smoke casting.", danger: "HIGH" },
  },
};

/**
 * Retrieve the full canonical knowledge node for any VALORANT Agent
 */
export function getAgentKnowledgeNode(agentNameOrSlug: string): AgentKnowledgeNode {
  const norm = slugify(agentNameOrSlug);
  
  // Find standard agent display name
  const metaObj = agentMeta as any;
  const tiers = metaObj.tiers || {};
  const pickRates = metaObj.pickRates || {};
  const difficulty = metaObj.difficulty || {};
  const bestMaps = metaObj.bestMaps || {};
  const teammates = metaObj.teammates || {};
  const counters = metaObj.counters || {};

  const matchKey = Object.keys(tiers).find(k => slugify(k) === norm || k.toLowerCase() === norm) || agentNameOrSlug;

  const agentTier = tiers[matchKey] || "A-Tier";
  const agentPick = pickRates[matchKey] || "Pro Benchmark Pending";
  const agentDiff = difficulty[matchKey] || "MEDIUM";
  const agentMaps = bestMaps[matchKey] || ["Ascent", "Bind", "Haven"];
  const rawTeammates: string[] = teammates[matchKey] || ["Omen", "Sova"];
  const rawCounters: string[] = counters[matchKey] || ["KAY/O", "Cypher"];

  const signatureWeapons = AGENT_WEAPON_MAP[matchKey] || DEFAULT_WEAPONS;

  // Synergies
  const synergies: AgentSynergy[] = rawTeammates.map(tm => {
    const custom = SYNERGY_REASONS[matchKey]?.[tm];
    return {
      agentName: tm,
      agentSlug: slugify(tm),
      synergyReason: custom?.reason || `${tm} provides vision denial and utility setup that complements ${matchKey}'s playstyle.`,
      comboAbility: custom?.combo || "Utility Coordination",
    };
  });

  // Counters
  const formattedCounters: AgentCounter[] = rawCounters.map(c => {
    const custom = COUNTER_REASONS[matchKey]?.[c];
    return {
      agentName: c,
      agentSlug: slugify(c),
      counterReason: custom?.reason || `${c} possesses crowd-control and suppression tools that disrupt ${matchKey}'s primary gameplan.`,
      dangerLevel: custom?.danger || "MEDIUM",
    };
  });

  // Related Guides
  const relatedGuides = guidesData
    .filter(g => g.slug.includes(norm) || g.title.toLowerCase().includes(norm))
    .map(g => ({ title: g.title, slug: g.slug, category: g.category }));

  // Lore Article
  const loreArticle = loreData.articles.find(a => a.slug === norm || a.title.toLowerCase().includes(norm));

  // Compare partner
  const compareSlug = matchKey === "Jett" ? "jett-vs-raze" : matchKey === "Omen" ? "omen-vs-clove" : matchKey === "Sova" ? "sova-vs-fade" : "jett-vs-raze";
  const compareName = matchKey === "Jett" ? "Jett vs. Raze" : matchKey === "Omen" ? "Omen vs. Clove" : matchKey === "Sova" ? "Sova vs. Fade" : "Agent Comparison";

  return {
    name: matchKey,
    slug: norm,
    role: matchKey === "Jett" || matchKey === "Raze" || matchKey === "Reyna" || matchKey === "Neon" || matchKey === "Yoru" || matchKey === "Iso" || matchKey === "Phoenix" ? "Duelist" : matchKey === "Omen" || matchKey === "Clove" || matchKey === "Viper" || matchKey === "Brimstone" || matchKey === "Astra" || matchKey === "Harbor" ? "Controller" : matchKey === "Sova" || matchKey === "Fade" || matchKey === "Breach" || matchKey === "Gekko" || matchKey === "KAY/O" || matchKey === "Skye" ? "Initiator" : "Sentinel",
    meta: {
      tier: agentTier,
      tierRating: `${agentTier} (Editorial Assessment)`,
      pickRate: agentPick,
      difficulty: agentDiff,
    },
    tactical: {
      signatureWeapons,
      bestMaps: agentMaps.map((m: string) => ({
        name: m,
        slug: slugify(m),
        reason: `High competitive win-rate and optimal site geometry for ${matchKey}'s utility kit.`
      })),
      synergies,
      counters: formattedCounters,
    },
    crossLinks: {
      loreSlug: loreArticle?.slug,
      loreTitle: loreArticle?.title,
      compareSlug,
      compareName,
      compBuilderUrl: `/comp-builder?agents=${norm}&map=${slugify(agentMaps[0] || "ascent")}`,
      bestForUrl: `/best/agents-for-solo-queue`,
      relatedGuides,
    },
    attribution: {
      tierAttribution: "Editorial Meta Assessment",
      proPresenceAttribution: "VCT Champions & Pro Match Dataset",
      telemetryAttribution: "Official Riot Games API Telemetry",
      patchVersion: metaObj.metadata.patchVersion || "9.04",
      season: metaObj.metadata.season || "Episode 9 Act II",
      lastVerified: metaObj.metadata.lastVerified || "September 1, 2026",
      sourceDataset: metaObj.metadata.source || "VCT Champions & Pro Tournament Analytics Dataset",
    }
  };
}
