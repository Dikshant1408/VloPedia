"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight, Search as SearchIcon,
  Heart, Shield, Crosshair, Zap, Eye, Compass, Flame, Radio, ChevronRight, ChevronLeft
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useUserWishlist } from "@/hooks/use-user-wishlist";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { PageTransition } from "@/components/motion-system";
import { valorantDb } from "@/lib/valorant-db";
import { CONTENT_TIER_MAP, DEFAULT_TIER } from "@/lib/valorant-types";
import type { ValorantMap, ValorantSkin } from "@/lib/valorant-types";
import { fetchWithCache } from "@/lib/api-cache";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Cinematic Hero Roster Interfaces & Helpers ───────────────────────────────
export interface HeroAgent {
  name: string;
  callsign: string;
  role: "DUELIST" | "CONTROLLER" | "INITIATOR" | "SENTINEL";
  origin: string;
  tagline: string;
  quote: string;
  accentColor: string;
  glowColor: string;
  portrait: string;
  iconFallback: string;
  entry: number;
  mobility: number;
  info: number;
  slug: string;
  uuid: string;
}

const AGENT_THEMES: Record<string, { callsign: string; quote: string; accentColor: string; glowColor: string; entry: number; mobility: number; info: number }> = {
  jett: {
    callsign: "WIND WALKER",
    quote: "Think you can keep up? Good luck.",
    accentColor: "#FF4655",
    glowColor: "rgba(255, 70, 85, 0.28)",
    entry: 96,
    mobility: 98,
    info: 44,
  },
  omen: {
    callsign: "SHADOW OPERATIVE",
    quote: "Scatter. They cannot hide from shadows.",
    accentColor: "#818CF8",
    glowColor: "rgba(129, 140, 248, 0.28)",
    entry: 68,
    mobility: 86,
    info: 74,
  },
  reyna: {
    callsign: "SOUL REAPER",
    quote: "They found a monster. Let them suffer.",
    accentColor: "#C084FC",
    glowColor: "rgba(192, 132, 252, 0.28)",
    entry: 94,
    mobility: 88,
    info: 38,
  },
  phoenix: {
    callsign: "SOLAR IGNITION",
    quote: "Just watch my back. I got the rest.",
    accentColor: "#FB923C",
    glowColor: "rgba(251, 146, 60, 0.28)",
    entry: 90,
    mobility: 82,
    info: 46,
  },
  viper: {
    callsign: "TOXIC ALCHEMIST",
    quote: "Welcome to my world. Don't breathe.",
    accentColor: "#4ADE80",
    glowColor: "rgba(74, 222, 128, 0.25)",
    entry: 52,
    mobility: 48,
    info: 82,
  },
  clove: {
    callsign: "IMMORTAL TRICKSTER",
    quote: "No dying today, not permanently anyway.",
    accentColor: "#F472B6",
    glowColor: "rgba(244, 114, 182, 0.28)",
    entry: 88,
    mobility: 84,
    info: 62,
  },
  iso: {
    callsign: "TARGET ACQUIRED",
    quote: "It's just math. Line them up, knock them down.",
    accentColor: "#60A5FA",
    glowColor: "rgba(96, 165, 250, 0.28)",
    entry: 92,
    mobility: 76,
    info: 50,
  },
  raze: {
    callsign: "EXPLOSIVE ARTIST",
    quote: "Here comes the party!",
    accentColor: "#F97316",
    glowColor: "rgba(249, 115, 22, 0.28)",
    entry: 95,
    mobility: 92,
    info: 40,
  },
  neon: {
    callsign: "SURGE RUNNER",
    quote: "Here we go! Keep up if you can.",
    accentColor: "#38BDF8",
    glowColor: "rgba(56, 189, 248, 0.28)",
    entry: 97,
    mobility: 99,
    info: 36,
  },
  yoru: {
    callsign: "DIMENSIONAL DRIFTER",
    quote: "I'll handle this. Watch the flank.",
    accentColor: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.28)",
    entry: 89,
    mobility: 87,
    info: 54,
  },
  sova: {
    callsign: "HUNTER'S EYE",
    quote: "I am the hunter!",
    accentColor: "#60A5FA",
    glowColor: "rgba(96, 165, 250, 0.28)",
    entry: 42,
    mobility: 52,
    info: 98,
  },
  fade: {
    callsign: "NIGHTMARE WEAVER",
    quote: "Face your fear. It knows your name.",
    accentColor: "#A78BFA",
    glowColor: "rgba(167, 139, 250, 0.28)",
    entry: 65,
    mobility: 60,
    info: 94,
  },
  gekko: {
    callsign: "CREW LEADER",
    quote: "Dizzy, blind 'em! Let's go crew.",
    accentColor: "#A3E635",
    glowColor: "rgba(163, 230, 53, 0.28)",
    entry: 78,
    mobility: 70,
    info: 85,
  },
  breach: {
    callsign: "SEISMIC BREAKER",
    quote: "Let's make some noise! Stand down.",
    accentColor: "#F97316",
    glowColor: "rgba(249, 115, 22, 0.28)",
    entry: 82,
    mobility: 55,
    info: 70,
  },
  "kay/o": {
    callsign: "KILL PROTOCOL",
    quote: "Initiating suppression protocol.",
    accentColor: "#38BDF8",
    glowColor: "rgba(56, 189, 248, 0.28)",
    entry: 85,
    mobility: 62,
    info: 76,
  },
  skye: {
    callsign: "NATURE'S GUIDE",
    quote: "Hawk out! Find them, girl.",
    accentColor: "#4ADE80",
    glowColor: "rgba(74, 222, 128, 0.25)",
    entry: 60,
    mobility: 64,
    info: 92,
  },
  tejo: {
    callsign: "BALLISTIC VANGUARD",
    quote: "Lock down the perimeter.",
    accentColor: "#EAB308",
    glowColor: "rgba(234, 179, 8, 0.28)",
    entry: 72,
    mobility: 58,
    info: 88,
  },
  chamber: {
    callsign: "CUSTOM CRAFTSMAN",
    quote: "You want to play? Let's play.",
    accentColor: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.28)",
    entry: 75,
    mobility: 80,
    info: 65,
  },
  cypher: {
    callsign: "INFORMATION BROKER",
    quote: "I know exactly where you are.",
    accentColor: "#94A3B8",
    glowColor: "rgba(148, 163, 184, 0.28)",
    entry: 35,
    mobility: 40,
    info: 99,
  },
  killjoy: {
    callsign: "TECH GENIUS",
    quote: "Relax, I've already thought of everything.",
    accentColor: "#FACC15",
    glowColor: "rgba(250, 204, 21, 0.28)",
    entry: 40,
    mobility: 45,
    info: 95,
  },
  deadlock: {
    callsign: "WIRED SENTINEL",
    quote: "You've crossed into my territory.",
    accentColor: "#93C5FD",
    glowColor: "rgba(147, 197, 253, 0.28)",
    entry: 48,
    mobility: 42,
    info: 89,
  },
  sage: {
    callsign: "DEFENSIVE HEALER",
    quote: "Your duty is not done!",
    accentColor: "#34D399",
    glowColor: "rgba(52, 211, 153, 0.28)",
    entry: 30,
    mobility: 40,
    info: 80,
  },
  vyse: {
    callsign: "METALLIC ARCHITECT",
    quote: "Steel yourself. Entangled.",
    accentColor: "#A855F7",
    glowColor: "rgba(168, 85, 247, 0.28)",
    entry: 55,
    mobility: 50,
    info: 86,
  },
  veto: {
    callsign: "TACTICAL WARDEN",
    quote: "Zero tolerance for breaches.",
    accentColor: "#E11D48",
    glowColor: "rgba(225, 29, 72, 0.28)",
    entry: 60,
    mobility: 52,
    info: 84,
  },
  astra: {
    callsign: "COSMIC ORCHESTRATOR",
    quote: "Astra online. The stars align.",
    accentColor: "#818CF8",
    glowColor: "rgba(129, 140, 248, 0.28)",
    entry: 50,
    mobility: 58,
    info: 96,
  },
  brimstone: {
    callsign: "TACTICAL COMMANDER",
    quote: "Open up the skies!",
    accentColor: "#F97316",
    glowColor: "rgba(249, 115, 22, 0.28)",
    entry: 62,
    mobility: 50,
    info: 85,
  },
  harbor: {
    callsign: "TIDAL GUARDIAN",
    quote: "The tide turns now!",
    accentColor: "#06B6D4",
    glowColor: "rgba(6, 182, 212, 0.28)",
    entry: 68,
    mobility: 66,
    info: 78,
  },
  waylay: {
    callsign: "SHADOW STRIKER",
    quote: "Target marked. Execute.",
    accentColor: "#E11D48",
    glowColor: "rgba(225, 29, 72, 0.28)",
    entry: 90,
    mobility: 85,
    info: 50,
  },
  miks: {
    callsign: "ACOUSTIC OPERATIVE",
    quote: "Signal locked.",
    accentColor: "#2DD4BF",
    glowColor: "rgba(45, 212, 191, 0.28)",
    entry: 70,
    mobility: 68,
    info: 80,
  },
};

function buildHeroAgents(): HeroAgent[] {
  return valorantDb.agents
    .filter((a) => a.portrait && a.portrait.trim().length > 0)
    .map((a) => {
      const slugKey = a.slug.toLowerCase();
      const theme = AGENT_THEMES[slugKey] || {
        callsign: `${a.role} OPERATIVE`,
        quote: a.voiceLines?.[0]?.text || a.bio?.slice(0, 70) || "Protocol activated.",
        accentColor: a.role === "DUELIST" ? "#FF4655" : a.role === "CONTROLLER" ? "#818CF8" : a.role === "INITIATOR" ? "#60A5FA" : "#FACC15",
        glowColor: a.role === "DUELIST" ? "rgba(255, 70, 85, 0.28)" : "rgba(129, 140, 248, 0.28)",
        entry: a.role === "DUELIST" ? 90 : 60,
        mobility: a.role === "DUELIST" ? 85 : 55,
        info: a.role === "INITIATOR" ? 92 : 65,
      };

      const match = a.portrait.match(/\/agents\/([a-f0-9\-]+)\//i);
      const uuid = match ? match[1] : a.slug;

      return {
        name: a.name.charAt(0).toUpperCase() + a.name.slice(1).toLowerCase(),
        callsign: theme.callsign,
        role: a.role as "DUELIST" | "CONTROLLER" | "INITIATOR" | "SENTINEL",
        origin: a.origin,
        tagline: a.bio,
        quote: theme.quote,
        accentColor: theme.accentColor,
        glowColor: theme.glowColor,
        portrait: a.portrait,
        iconFallback: `https://media.valorant-api.com/agents/${uuid}/displayicon.png`,
        entry: theme.entry,
        mobility: theme.mobility,
        info: theme.info,
        slug: a.slug,
        uuid,
      };
    });
}

const ALL_HERO_AGENTS: HeroAgent[] = buildHeroAgents();

// ── Reusable Skin Image Resolution Helper ────────────────────────────────────
export function getSkinImageUrl(skin: ValorantSkin | null | undefined): string | null {
  if (!skin) return null;
  // 1. Check chromas for fullRender or displayIcon
  if (skin.chromas && skin.chromas.length > 0) {
    for (const c of skin.chromas) {
      if (c.fullRender && c.fullRender.trim().length > 0) return c.fullRender;
      if (c.displayIcon && c.displayIcon.trim().length > 0) return c.displayIcon;
    }
  }
  // 2. Check skin's primary displayIcon
  if (skin.displayIcon && skin.displayIcon.trim().length > 0) {
    return skin.displayIcon;
  }
  // 3. Check skin's levels for displayIcon
  if (skin.levels && skin.levels.length > 0) {
    for (const l of skin.levels) {
      if (l.displayIcon && l.displayIcon.trim().length > 0) return l.displayIcon;
    }
  }
  return null;
}

const WEAPON_SLUGS_LIST = [
  "vandal", "phantom", "operator", "sheriff", "spectre", "ghost",
  "odin", "guardian", "judge", "marshal", "classic", "bulldog",
  "ares", "bucky", "outlaw", "stinger", "shorty", "frenzy"
];

function extractWeaponType(name: string, assetPath?: string): string {
  const l = (name || "").toLowerCase();
  for (const w of WEAPON_SLUGS_LIST) {
    if (l.includes(w)) return w;
  }
  const p = (assetPath || "").toLowerCase();
  if (p.includes("standardrifle")) return "phantom";
  if (p.includes("dmr")) return "vandal";
  if (p.includes("boltsniper")) return "operator";
  if (p.includes("standardsmg")) return "spectre";
  if (p.includes("revolver")) return "sheriff";
  if (p.includes("heavymachinegun")) return "odin";
  return "vandal";
}

// ── Featured Skin Card Model ─────────────────────────────────────────────────
export interface FeaturedSkinCard {
  uuid: string;
  name: string;
  weapon: string;
  tier: "EXCLUSIVE" | "ULTRA" | "PREMIUM" | "DELUXE" | "SELECT";
  price: number;
  iconUrl: string;
  slug: string;
  theme: string;
}

// Initial verified skins using official Valorant-API chromas (Status 200 guaranteed)
const INITIAL_FEATURED_SKINS: FeaturedSkinCard[] = [
  {
    uuid: "d8d5d7a1-4d81-8560-54bc-0692ab40f69b",
    name: "Kuronami Vandal",
    weapon: "VANDAL",
    tier: "EXCLUSIVE",
    price: 2375,
    iconUrl: "https://media.valorant-api.com/weaponskinchromas/3637a0be-4785-8841-9893-1198325185f2/fullrender.png",
    slug: "vandal",
    theme: "Water Flow & Dual Kunai Reload",
  },
  {
    uuid: "44b7b110-46bf-ccbb-2613-29a5df296461",
    name: "Prime//2.0 Phantom",
    weapon: "PHANTOM",
    tier: "PREMIUM",
    price: 1775,
    iconUrl: "https://media.valorant-api.com/weaponskinchromas/264eaaeb-4038-4bf4-3760-eb9f9c21edcb/fullrender.png",
    slug: "phantom",
    theme: "Hypercar Exhaust & Gold Energy",
  },
  {
    uuid: "43c22421-4f15-8947-a9a3-5c829e0a0d9b",
    name: "Reaver Vandal",
    weapon: "VANDAL",
    tier: "PREMIUM",
    price: 1775,
    iconUrl: "https://media.valorant-api.com/weaponskinchromas/2bd28382-48c6-8579-83e8-e9b64b783de3/fullrender.png",
    slug: "vandal",
    theme: "Necrotic Bells & Dark Telekinesis",
  },
  {
    uuid: "317574ca-4a9d-9e5a-f9c4-a79aa378f75b",
    name: "Araxys Sheriff",
    weapon: "SHERIFF",
    tier: "EXCLUSIVE",
    price: 2175,
    iconUrl: "https://media.valorant-api.com/weaponskinchromas/262d6e2f-4878-bf05-37d6-339fd7d969d1/fullrender.png",
    slug: "sheriff",
    theme: "Alien Mechanical Armor Plates",
  },
  {
    uuid: "a03b24d3-4319-996d-0f8c-94bbfba1dfc7",
    name: "Reaver Operator",
    weapon: "OPERATOR",
    tier: "PREMIUM",
    price: 1775,
    iconUrl: "https://media.valorant-api.com/weaponskinchromas/27865910-4dd4-845f-8671-92988cc1c996/fullrender.png",
    slug: "operator",
    theme: "Dark Sorcery & Soul Harvesting",
  },
  {
    uuid: "8dda01a6-4237-f430-ac70-c3ba677963e9",
    name: "Reaver Odin",
    weapon: "ODIN",
    tier: "PREMIUM",
    price: 1775,
    iconUrl: "https://media.valorant-api.com/weaponskinchromas/cf42ad75-43db-5426-0645-a7a3fac452c5/fullrender.png",
    slug: "odin",
    theme: "Necromantic Heavy Suppression",
  },
];

// ── Featured Armory Weapons ──────────────────────────────────────────────────
interface ArmoryWeapon {
  slug: string;
  name: string;
  category: string;
  cost: number;
  headshotDmg: number;
  bodyDmg: number;
  fireRate: number;
  magazine: number;
  description: string;
  recoilTrait: string;
  iconUrl: string;
}

const ARMORY_WEAPONS: ArmoryWeapon[] = [
  {
    slug: "vandal",
    name: "VANDAL",
    category: "RIFLE",
    cost: 2900,
    headshotDmg: 160,
    bodyDmg: 40,
    fireRate: 9.75,
    magazine: 25,
    description: "High-damage assault rifle providing consistent 160 headshot lethality at any range without falloff.",
    recoilTrait: "Heavy vertical kick after 3-shot burst; demands micro-strafing precision",
    iconUrl: "https://media.valorant-api.com/weapons/9c82e19d-4575-0200-1a81-3eacf00cf872/displayicon.png",
  },
  {
    slug: "phantom",
    name: "PHANTOM",
    category: "RIFLE",
    cost: 2900,
    headshotDmg: 156,
    bodyDmg: 39,
    fireRate: 11.0,
    magazine: 30,
    description: "Silenced tactical rifle with rapid fire rate, zero bullet tracers, and superior spray transfer control.",
    recoilTrait: "Tight initial bloom with reduced bullet spread during continuous fire",
    iconUrl: "https://media.valorant-api.com/weapons/ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a/displayicon.png",
  },
  {
    slug: "operator",
    name: "OPERATOR",
    category: "SNIPER",
    cost: 4700,
    headshotDmg: 255,
    bodyDmg: 150,
    fireRate: 0.75,
    magazine: 5,
    description: "High-caliber bolt-action rifle dealing lethal single-round body hits across all sightlines.",
    recoilTrait: "Heavy bolt cycle with mandatory stationary accuracy",
    iconUrl: "https://media.valorant-api.com/weapons/a03b24d3-4319-996d-0f8c-94bbfba1dfc7/displayicon.png",
  },
  {
    slug: "sheriff",
    name: "SHERIFF",
    category: "SIDEARM",
    cost: 800,
    headshotDmg: 159,
    bodyDmg: 55,
    fireRate: 4.0,
    magazine: 6,
    description: "High-impact sidearm with 159 headshot lethality up to 30 meters on eco buys.",
    recoilTrait: "High recoil requiring measured cadence between shots",
    iconUrl: "https://media.valorant-api.com/weapons/e336c6b8-418d-9340-d77f-7a9e4cfe0702/displayicon.png",
  },
  {
    slug: "spectre",
    name: "SPECTRE",
    category: "SMG",
    cost: 1600,
    headshotDmg: 78,
    bodyDmg: 26,
    fireRate: 13.33,
    magazine: 30,
    description: "Close-quarters silenced submachine gun ideal for run-and-gun pressure rounds.",
    recoilTrait: "High stability with low recoil spread while moving",
    iconUrl: "https://media.valorant-api.com/weapons/462080d1-4035-2937-7c09-27aa2a5c27a7/displayicon.png",
  },
];

// ── Cinematic Map Sectors ────────────────────────────────────────────────────
interface BattlefieldMap {
  name: string;
  location: string;
  slug: string;
  sites: string;
  feature: string;
  splashUrl: string;
}

const BATTLEFIELD_MAPS: BattlefieldMap[] = [
  {
    name: "Ascent",
    location: "San Marco, Italy",
    slug: "ascent",
    sites: "2 SITES",
    feature: "Controllable mechanical blast doors & dominant Mid courtyard",
    splashUrl: "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png",
  },
  {
    name: "Haven",
    location: "Thimphu, Bhutan",
    slug: "haven",
    sites: "3 SITES",
    feature: "Three bomb sites with rapid defender rotations and Garage lurk control",
    splashUrl: "https://media.valorant-api.com/maps/2bee0dc9-4ffe-519b-1cbd-7fbe763a6047/splash.png",
  },
  {
    name: "Lotus",
    location: "Western Ghats, India",
    slug: "lotus",
    sites: "3 SITES",
    feature: "Three sites linked by sound-emitting rotating stone doorways",
    splashUrl: "https://media.valorant-api.com/maps/2fe4ed3a-450a-948b-6d6b-e89a78e680a9/splash.png",
  },
  {
    name: "Sunset",
    location: "Los Angeles, USA",
    slug: "sunset",
    sites: "2 SITES",
    feature: "Traditional 2-site layout centered around high-friction Mid control",
    splashUrl: "https://media.valorant-api.com/maps/92584fbe-486a-b1b2-9faa-39b0f486b498/splash.png",
  },
  {
    name: "Split",
    location: "Tokyo, Japan",
    slug: "split",
    sites: "2 SITES",
    feature: "High verticality with tactical rope ascenders and narrow choke chokepoints",
    splashUrl: "https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/splash.png",
  },
  {
    name: "Bind",
    location: "Rabat, Morocco",
    slug: "bind",
    sites: "2 SITES",
    feature: "Zero Mid lane; replaced by two instant one-way teleporter chambers",
    splashUrl: "https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/splash.png",
  },
];

export function HomepageClient() {
  const { user, signInWithDiscord } = useAuth();
  const { addWishlistItem, items: wishlistItems } = useUserWishlist();
  const reduce = useReducedMotion();

  // ── Dynamic Agent Hero State ───────────────────────────────────────────────
  const [heroAgents, setHeroAgents] = useState<HeroAgent[]>(ALL_HERO_AGENTS);
  const [activeHeroAgentIdx, setActiveHeroAgentIdx] = useState<number>(0);
  const [agentImageFailCount, setAgentImageFailCount] = useState<Record<string, number>>({});

  // ── Dynamic Skin & Arsenal State ───────────────────────────────────────────
  const [featuredSkins, setFeaturedSkins] = useState<FeaturedSkinCard[]>(INITIAL_FEATURED_SKINS);
  const [allValidSkinsPool, setAllValidSkinsPool] = useState<ValorantSkin[]>([]);
  const [totalSkinCount, setTotalSkinCount] = useState<number>(1415);
  const [isSyncingSkins, setIsSyncingSkins] = useState<boolean>(true);
  const [randomSkin, setRandomSkin] = useState<ValorantSkin | null>(null);

  // ── General Interactive State ──────────────────────────────────────────────
  const [activeArmoryWeapon, setActiveArmoryWeapon] = useState<ArmoryWeapon>(ARMORY_WEAPONS[0]);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("ALL");
  const [query, setQuery] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Currently active agent
  const activeAgent: HeroAgent = heroAgents[activeHeroAgentIdx] || ALL_HERO_AGENTS[0];

  // 1. Stable Client-Side Initialization (random starting agent & skin fetch)
  useEffect(() => {
    // Pick random start agent so it does not always start with Jett
    if (ALL_HERO_AGENTS.length > 0) {
      const randIdx = Math.floor(Math.random() * ALL_HERO_AGENTS.length);
      setActiveHeroAgentIdx(randIdx);
    }

    // Fetch and dynamically resolve skins from the existing VloPedia data layer
    fetchWithCache<{ data: ValorantSkin[] }>("https://valorant-api.com/v1/weapons/skins", 30 * 60 * 1000)
      .then((json) => {
        const skins: ValorantSkin[] = json.data ?? [];
        const valid = skins.filter((s) => {
          if (!s || !s.displayName) return false;
          const lower = s.displayName.toLowerCase();
          if (lower.startsWith("standard") || lower.includes("random") || lower.includes("melee")) return false;
          return getSkinImageUrl(s) !== null;
        });

        if (valid.length > 0) {
          setTotalSkinCount(valid.length);
          setAllValidSkinsPool(valid);

          // Priority iconic lines to spotlight on the homepage
          const iconicKeywords = [
            "Kuronami", "Reaver", "Prime", "Champions", "Araxys",
            "Oni", "RGX", "Prelude", "Ion", "Elderflame",
            "Neo Frontier", "Glitchpop", "Chronovoid", "Singularity",
            "Sovereign", "Protocol", "Magepunk"
          ];
          // Light shuffle so different skins shine on refresh
          const shuffledKeywords = [...iconicKeywords].sort(() => Math.random() - 0.5);

          const selected: FeaturedSkinCard[] = [];
          const usedWeapons = new Set<string>();
          const usedNames = new Set<string>();

          for (const kw of shuffledKeywords) {
            if (selected.length >= 6) break;
            const matches = valid.filter((s) =>
              s.displayName.toLowerCase().includes(kw.toLowerCase())
            );
            for (const m of matches) {
              const weaponType = extractWeaponType(m.displayName, m.assetPath);
              if (!usedWeapons.has(weaponType) && !usedNames.has(m.displayName)) {
                const img = getSkinImageUrl(m);
                if (img) {
                  const tier = CONTENT_TIER_MAP[m.contentTierUuid ?? ""] || DEFAULT_TIER;
                  selected.push({
                    uuid: m.uuid,
                    name: m.displayName,
                    weapon: weaponType.toUpperCase(),
                    tier: (tier.rarity as any) || "PREMIUM",
                    price: tier.price || 1775,
                    iconUrl: img,
                    slug: weaponType,
                    theme: `${m.displayName} Custom Finish`,
                  });
                  usedWeapons.add(weaponType);
                  usedNames.add(m.displayName);
                  break;
                }
              }
            }
          }

          if (selected.length >= 3) {
            setFeaturedSkins(selected);
          }

          // Select 1 live spotlight skin
          const randSpotlight = valid[Math.floor(Math.random() * valid.length)];
          setRandomSkin(randSpotlight);
        }
      })
      .catch((err) => {
        console.warn("[VloPedia] Falling back to pre-verified skin collections:", err);
      })
      .finally(() => {
        setIsSyncingSkins(false);
      });
  }, []);

  // 2. Auto-cycle hero agents gently if not prefers-reduced-motion (every 9s)
  useEffect(() => {
    if (reduce || heroAgents.length === 0) return;
    const interval = setInterval(() => {
      setActiveHeroAgentIdx((prev) => (prev + 1) % heroAgents.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [reduce, heroAgents.length]);

  // 3. Manual Agent Controls
  const handleNextAgent = useCallback(() => {
    setActiveHeroAgentIdx((prev) => (prev + 1) % heroAgents.length);
  }, [heroAgents.length]);

  const handlePrevAgent = useCallback(() => {
    setActiveHeroAgentIdx((prev) => (prev - 1 + heroAgents.length) % heroAgents.length);
  }, [heroAgents.length]);

  // 4. Agent Artwork Fallback Resolver (portrait -> displayIcon -> emblem)
  const failStage = agentImageFailCount[activeAgent.slug] || 0;
  const currentAgentImageSrc =
    failStage === 0
      ? activeAgent.portrait
      : failStage === 1
      ? activeAgent.iconFallback
      : "/images/vlopedia-emblem.png";

  const handleAgentImageError = () => {
    setAgentImageFailCount((prev) => ({
      ...prev,
      [activeAgent.slug]: (prev[activeAgent.slug] || 0) + 1,
    }));
  };

  // 5. Skin Card Image Error Fallback (replaces broken card with another valid skin)
  const handleSkinImageError = (failedSkinUuid: string) => {
    if (allValidSkinsPool.length === 0) return;
    setFeaturedSkins((prev) => {
      const existingUuids = new Set(prev.map((s) => s.uuid));
      const replacement = allValidSkinsPool.find(
        (s) => !existingUuids.has(s.uuid) && getSkinImageUrl(s) !== null
      );
      if (!replacement) return prev;
      const img = getSkinImageUrl(replacement);
      if (!img) return prev;
      const weaponType = extractWeaponType(replacement.displayName, replacement.assetPath);
      const tier = CONTENT_TIER_MAP[replacement.contentTierUuid ?? ""] || DEFAULT_TIER;
      const newCard: FeaturedSkinCard = {
        uuid: replacement.uuid,
        name: replacement.displayName,
        weapon: weaponType.toUpperCase(),
        tier: (tier.rarity as any) || "PREMIUM",
        price: tier.price || 1775,
        iconUrl: img,
        slug: weaponType,
        theme: `${replacement.displayName} Custom Finish`,
      };
      return prev.map((s) => (s.uuid === failedSkinUuid ? newCard : s));
    });
  };

  // 6. Subtle Mouse Parallax Handler (Desktop)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduce || typeof window === "undefined") return;
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  };

  const goSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    window.location.href = q.length >= 2 ? `/search?q=${encodeURIComponent(q)}` : "/search";
  };

  const handleWishlist = async (title: string, type: "skin" | "bundle") => {
    if (!user) {
      toast.info("Sign in to save items", {
        action: { label: "Sign In", onClick: signInWithDiscord },
      });
      return;
    }
    if (wishlistItems.some((w) => w.title === title)) {
      toast.info(`Already saved to wishlist`);
      return;
    }
    try {
      await addWishlistItem({ title, category: type });
      toast.success(`Added "${title}" to your wishlist`);
    } catch {
      toast.error("Could not save item");
    }
  };

  // Filter agents for Section 2 (Meet the Agents)
  const displayedAgents = useMemo(() => {
    if (selectedRoleFilter === "ALL") return valorantDb.agents.slice(0, 8);
    return valorantDb.agents.filter((a) => a.role === selectedRoleFilter).slice(0, 8);
  }, [selectedRoleFilter]);

  const latestPatch = valorantDb.patches[0];

  return (
    <PageTransition>
      <div
        onMouseMove={handleMouseMove}
        className="min-h-screen bg-[#08090C] text-[#F5F5F5] selection:bg-[#FF4655] selection:text-white"
      >

        {/* ═══════════════════════════════════════════════════════════════
            HERO: "ENTER THE PROTOCOL" — VALORANT CINEMATIC TRAILER FLOW
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[90vh] lg:min-h-[96vh] w-full overflow-hidden border-b border-white/[0.08] flex flex-col justify-between pt-10 pb-8 sm:pb-12">
          
          {/* 0.3s Fast Accent Line Entrance */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF4655] to-transparent z-20 origin-center"
          />

          {/* Cinematic Background Atmosphere with 2px Parallax */}
          <div
            className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
            style={{
              transform: reduce
                ? "none"
                : `translate(${mousePos.x * -2}px, ${mousePos.y * -2}px)`,
              transition: "transform 0.25s ease-out",
            }}
          >
            {/* Deep Dark Base */}
            <div className="absolute inset-0 bg-[#08090C]" />

            {/* Volumetric Red Atmospheric Radial Glow */}
            <div
              className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-30 transition-colors duration-1000"
              style={{ backgroundColor: activeAgent.accentColor }}
            />

            {/* Subtle Tactical Grid Depth */}
            <div className="absolute inset-0 bg-tactical-grid opacity-[0.18]" />

            {/* Cinematic Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-transparent to-[#08090C]/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#08090C] via-[#08090C]/85 to-transparent lg:to-transparent" />
          </div>

          {/* Hero Content Container */}
          <Container className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full my-auto py-6 sm:py-12">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">

              {/* ── Left Column: Database Branding & Search Primary CTA ── */}
              <div className="space-y-6 sm:space-y-8 flex flex-col items-start text-left max-w-2xl">
                
                {/* 0.5s Eyebrow: The VALORANT Database & Real-time Indicator */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center gap-2.5 px-3 py-1 border border-white/10 bg-[#101218]/90 text-white font-mono text-[11px] uppercase tracking-widest clip-diagonal-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4655] animate-pulse" />
                  <span>THE VALORANT DATABASE</span>
                  <span className="text-white/20">•</span>
                  <span className="text-[#858B96]">
                    OPERATIVE {String(activeHeroAgentIdx + 1).padStart(2, "0")} / {String(heroAgents.length).padStart(2, "0")}
                  </span>
                </motion.div>

                {/* 0.8s Title Reveal: Aggressive Display Typography */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="space-y-2"
                >
                  <h1 className="font-display font-black text-6xl sm:text-7xl lg:text-8xl tracking-tight text-[#F5F5F5] uppercase leading-[0.92]">
                    VLOPEDIA
                  </h1>
                  <p className="font-mono text-base sm:text-lg text-[#FF4655] font-bold uppercase tracking-wider">
                    Everything VALORANT.
                  </p>
                  <p className="font-sans text-sm sm:text-base text-[#858B96] leading-relaxed max-w-lg pt-1">
                    Explore agents, weapons, skins, and maps. The definitive tactical intelligence archive for competitive VALORANT.
                  </p>
                </motion.div>

                {/* 1.2s Dominant Search Bar CTA with Ctrl+K */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="w-full"
                >
                  <form
                    onSubmit={goSearch}
                    role="search"
                    className="relative flex items-center border border-white/15 bg-[#101218]/95 hover:border-[#FF4655]/60 focus-within:border-[#FF4655] focus-within:ring-2 focus-within:ring-[#FF4655]/25 backdrop-blur-xl shadow-2xl transition-all duration-200 clip-diagonal-sm"
                  >
                    <SearchIcon className="ml-4 sm:ml-5 h-5 w-5 shrink-0 text-[#858B96]" />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search agents, weapons, skins, maps... (Ctrl + K)"
                      aria-label="Search VloPedia"
                      className="w-full bg-transparent px-4 py-4 sm:py-4.5 font-sans text-sm sm:text-base text-[#F5F5F5] placeholder:text-[#858B96] focus:outline-none"
                    />
                    <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 mr-2 border border-white/10 bg-[#08090C] text-[#858B96] font-mono text-[10px] select-none rounded">
                      <span>Ctrl</span>
                      <span>K</span>
                    </div>
                    <Button
                      type="submit"
                      variant="primary"
                      className="h-9 shrink-0 mr-2 sm:mr-3 font-mono text-xs font-bold uppercase tracking-wider px-5 sm:px-6 py-2.5 bg-[#FF4655] hover:bg-[#FF4655]/90 text-white clip-diagonal-sm shadow-md"
                    >
                      SEARCH
                    </Button>
                  </form>
                </motion.div>

                {/* Database Quick Launch Grid */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65, duration: 0.5 }}
                  className="space-y-2.5 w-full pt-1"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#858B96] uppercase tracking-wider">
                    <span>EXPLORE ARCHIVE BY SECTOR</span>
                    <span className="hidden sm:inline">29 OPERATIVES • 21 ARSENAL</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[
                      { label: "AGENTS", count: "29", href: "/agents" },
                      { label: "WEAPONS", count: "21", href: "/weapons" },
                      { label: "SKINS", count: totalSkinCount > 0 ? `${totalSkinCount}+` : "1,400+", href: "/skins" },
                      { label: "MAPS", count: "18", href: "/maps" },
                      { label: "BUNDLES", count: "327+", href: "/bundles" },
                      { label: "GUIDES", count: "LORE", href: "/guides" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group flex flex-col items-center justify-center p-2.5 border border-white/10 bg-[#101218]/80 hover:bg-[#151A22] hover:border-[#FF4655] transition-all text-center clip-diagonal-sm"
                      >
                        <span className="font-mono text-xs font-bold text-[#F5F5F5] group-hover:text-[#FF4655] transition-colors">
                          {item.label}
                        </span>
                        <span className="font-mono text-[9px] text-[#858B96] mt-0.5">
                          {item.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>

              </div>

              {/* ── Right Column: Official Large Agent Key Art with 6px Parallax ── */}
              <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[620px] flex items-center justify-center">
                
                {/* Agent Callsign Watermark in Massive Typography */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
                  style={{
                    transform: reduce
                      ? "none"
                      : `translate(${mousePos.x * -3}px, ${mousePos.y * -3}px)`,
                  }}
                >
                  <span className="font-display font-black text-[120px] sm:text-[160px] lg:text-[200px] text-white/[0.03] uppercase tracking-tighter select-none whitespace-nowrap">
                    {activeAgent.name}
                  </span>
                </div>

                {/* 1.0s Large High-Res Transparent Agent Key Art */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeAgent.name}
                    initial={{ opacity: 0, x: 24, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -24, scale: 0.98 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full h-full flex items-center justify-center"
                    style={{
                      transform: reduce
                        ? "none"
                        : `translate(${mousePos.x * -6}px, ${mousePos.y * -6}px)`,
                      transition: "transform 0.2s ease-out",
                    }}
                  >
                    <Image
                      src={currentAgentImageSrc}
                      alt={`VALORANT Agent ${activeAgent.name}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 650px"
                      onError={handleAgentImageError}
                      className="object-contain object-center drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)] filter brightness-105"
                    />

                    {/* Agent Dossier Overlay Card */}
                    <div className="absolute bottom-4 left-2 right-2 sm:bottom-6 sm:left-6 sm:right-auto max-w-sm border border-white/10 bg-[#101218]/90 backdrop-blur-md p-4 clip-diagonal-sm shadow-2xl">
                      <div className="flex items-center justify-between gap-3 pb-2 mb-2 border-b border-white/10 font-mono text-[10px]">
                        <span className="text-[#FF4655] font-bold uppercase tracking-wider">
                          {activeAgent.role} {'//'} {activeAgent.origin}
                        </span>
                        <span className="text-[#858B96] uppercase">{activeAgent.callsign}</span>
                      </div>
                      <p className="font-sans text-xs text-[#F5F5F5] italic leading-snug">
                        &ldquo;{activeAgent.quote}&rdquo;
                      </p>
                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5 font-mono text-[10px]">
                        <span className="text-[#858B96]">ENTRY: {activeAgent.entry}</span>
                        <span className="text-[#858B96]">MOBILITY: {activeAgent.mobility}</span>
                        <span className="text-[#FF4655] font-semibold">INFO: {activeAgent.info}</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Floating Atmospheric Spark/Embers with 10px Parallax */}
                <div
                  className="absolute inset-0 pointer-events-none select-none"
                  style={{
                    transform: reduce
                      ? "none"
                      : `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`,
                    transition: "transform 0.3s ease-out",
                  }}
                >
                  <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-[#FF4655] opacity-60 blur-xs" />
                  <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-white opacity-40 blur-xs" />
                  <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-[#FF4655] opacity-50 blur-xs" />
                </div>

                {/* Interactive Dynamic Agent Switcher & Counter */}
                <div className="absolute -bottom-4 sm:bottom-0 right-0 flex items-center gap-1.5 sm:gap-2 bg-[#101218]/95 border border-white/10 p-1 sm:p-1.5 clip-diagonal-sm z-20 backdrop-blur-md shadow-xl">
                  {/* Active Index Counter (01 / 29) */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#08090C] border border-white/10 font-mono text-[10px] tracking-wider text-[#858B96]">
                    <span className="hidden sm:inline text-white/50">OPERATIVE</span>
                    <span className="text-[#FF4655] font-bold">
                      {String(activeHeroAgentIdx + 1).padStart(2, "0")}
                    </span>
                    <span>/</span>
                    <span className="text-[#F5F5F5] font-bold">
                      {String(heroAgents.length).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={handlePrevAgent}
                    aria-label="Previous Agent"
                    className="px-2 sm:px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-[#858B96] hover:text-white hover:bg-white/10 border border-white/5 transition-colors cursor-pointer"
                  >
                    ←
                  </button>

                  {/* Next Agent Button */}
                  <button
                    type="button"
                    onClick={handleNextAgent}
                    aria-label="Next Agent"
                    className="group flex items-center gap-1 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider bg-[#FF4655] hover:bg-[#FF4655]/90 text-white transition-all cursor-pointer shadow-md"
                  >
                    <span>NEXT AGENT</span>
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </button>
                </div>

              </div>

            </div>
          </Container>

          {/* ── Bottom Database Stats Strip & Scroll Cue ── */}
          <div className="relative z-10 border-t border-white/[0.08] bg-[#101218]/60 backdrop-blur-xs py-3.5">
            <Container className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-mono text-xs text-[#858B96] tracking-wider uppercase">
                <span className="flex items-center gap-2">
                  <span className="text-[#F5F5F5] font-bold">29</span> AGENTS
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-2">
                  <span className="text-[#F5F5F5] font-bold">21</span> WEAPONS
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-2">
                  <span className="text-[#F5F5F5] font-bold">{totalSkinCount > 0 ? `${totalSkinCount.toLocaleString()}+` : "1,400+"}</span> SKINS
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-2">
                  <span className="text-[#F5F5F5] font-bold">18</span> MAPS
                </span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-2">
                  <span className="text-[#FF4655] font-bold">327+</span> BUNDLES
                </span>
              </div>

              <a
                href="#agents-showcase"
                className="group inline-flex items-center gap-2 font-mono text-[11px] text-[#858B96] hover:text-white uppercase tracking-widest transition-colors cursor-pointer"
              >
                <span>SCROLL TO ENTER</span>
                <span className="text-[#FF4655] font-bold transition-transform group-hover:translate-y-0.5">↓</span>
              </a>
            </Container>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2: MEET THE AGENTS — "THE PROTOCOL"
            Large character visual showcase with roles and abilities
        ═══════════════════════════════════════════════════════════════ */}
        <section id="agents-showcase" className="py-20 lg:py-28 border-b border-white/[0.08] bg-[#08090C] relative scroll-mt-12">
          <Container className="max-w-7xl mx-auto px-4 sm:px-6">
            
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF4655]">
                  <Shield className="h-3.5 w-3.5" />
                  <span>SECTION 02 // ROSTER RECON</span>
                </div>
                <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-[#F5F5F5]">
                  MEET THE AGENTS
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#858B96] max-w-xl">
                  Every Agent. Every ability. Every role. Master the full roster with verified combat ratings and team counters.
                </p>
              </div>

              {/* Role Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 border border-white/10 bg-[#101218] p-1 clip-diagonal-sm">
                {["ALL", "DUELIST", "INITIATOR", "CONTROLLER", "SENTINEL"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRoleFilter(role)}
                    className={`px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      selectedRoleFilter === role
                        ? "bg-[#FF4655] text-white"
                        : "text-[#858B96] hover:text-[#F5F5F5] hover:bg-white/5"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Large Character Showcase Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {displayedAgents.map((agent) => (
                <div
                  key={agent.slug}
                  className="group relative border border-white/10 bg-[#101218] hover:border-[#FF4655]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden clip-diagonal-sm hover:shadow-xl"
                >
                  {/* Large Character Visual Stage */}
                  <div className="relative h-64 w-full bg-gradient-to-b from-[#151A22] to-[#101218] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-tactical-grid opacity-15" />
                    
                    <span className="absolute top-3 left-3 font-display font-black text-4xl text-white/[0.04] uppercase select-none">
                      {agent.role}
                    </span>

                    <div className="relative h-full w-full">
                      <Image
                        src={agent.portrait}
                        alt={agent.name}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-contain object-bottom transition-transform duration-500 group-hover:scale-105 filter drop-shadow-md"
                      />
                    </div>
                  </div>

                  {/* Character Dossier Info */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display font-black text-2xl uppercase tracking-tight text-[#F5F5F5] group-hover:text-[#FF4655] transition-colors">
                          {agent.name}
                        </h3>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FF4655]">
                          {agent.role} {'//'} {agent.origin}
                        </span>
                      </div>
                    </div>

                    <p className="font-sans text-xs text-[#858B96] line-clamp-2 leading-relaxed">
                      {agent.bio}
                    </p>

                    {/* Signature Ability Icons Strip */}
                    <div className="pt-2 border-t border-white/10">
                      <div className="text-[10px] font-mono text-[#858B96] uppercase mb-1.5">
                        ABILITIES
                      </div>
                      <div className="flex items-center gap-2">
                        {agent.abilities.slice(0, 4).map((ability) => (
                          <div
                            key={ability.name}
                            title={`${ability.name}: ${ability.description}`}
                            className="relative h-8 w-8 rounded border border-white/10 bg-[#08090C] flex items-center justify-center p-1 hover:border-[#FF4655] transition-colors"
                          >
                            {ability.icon ? (
                              <Image
                                src={ability.icon}
                                alt={ability.name}
                                width={24}
                                height={24}
                                className="object-contain filter invert opacity-80 group-hover:opacity-100"
                              />
                            ) : (
                              <Zap className="h-3.5 w-3.5 text-[#FF4655]" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Link to Dedicated Dossier */}
                    <Link
                      href={`/agents/${agent.slug}`}
                      className="inline-flex w-full items-center justify-between px-3 py-2 border border-white/10 bg-[#08090C] hover:border-[#FF4655] font-mono text-xs text-[#F5F5F5] hover:text-[#FF4655] transition-colors clip-diagonal-sm"
                    >
                      <span>INSPECT DOSSIER</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom View All Link */}
            <div className="mt-12 text-center">
              <Link
                href="/agents"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/20 bg-[#101218] hover:border-[#FF4655] hover:bg-[#FF4655] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all clip-diagonal-sm shadow-md"
              >
                <span>EXPLORE ALL 29 VALORANT AGENTS</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </Container>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3: THE ARMORY — "PRECISION. POWER. CONTROL."
            Cinematic weapon reveal with headshot ballistics
        ═══════════════════════════════════════════════════════════════ */}
        <section id="armory-showcase" className="py-20 lg:py-28 border-b border-white/[0.08] bg-[#0A0D13] relative">
          <Container className="max-w-7xl mx-auto px-4 sm:px-6">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF4655]">
                  <Crosshair className="h-3.5 w-3.5" />
                  <span>SECTION 03 // THE ARMORY</span>
                </div>
                <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-[#F5F5F5]">
                  BALLISTIC ARSENAL
                </h2>
                <p className="font-mono text-xs sm:text-sm text-[#FF4655] font-bold tracking-widest uppercase">
                  PRECISION. POWER. CONTROL.
                </p>
              </div>

              <div className="font-mono text-xs text-[#858B96]">
                SELECT WEAPON CALIBER FOR BALLISTICS
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] items-stretch">
              
              {/* Left: Interactive Weapon Visual Stage */}
              <div className="border border-white/10 bg-[#101218] p-6 sm:p-10 flex flex-col justify-between clip-diagonal-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-tactical-grid opacity-10 pointer-events-none" />

                {/* Top Info Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div>
                    <span className="font-mono text-[10px] text-[#FF4655] uppercase font-bold tracking-widest">
                      {activeArmoryWeapon.category} {'//'} CALIBER ARCHIVE
                    </span>
                    <h3 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-[#F5F5F5]">
                      {activeArmoryWeapon.name}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-[10px] text-[#858B96] uppercase block">CREDIT COST</span>
                    <span className="font-mono text-2xl font-bold text-[#F5F5F5]">{activeArmoryWeapon.cost}</span>
                  </div>
                </div>

                {/* Center Large Weapon Artwork */}
                <div className="relative h-48 sm:h-64 w-full my-6 flex items-center justify-center">
                  <Image
                    key={activeArmoryWeapon.slug}
                    src={activeArmoryWeapon.iconUrl}
                    alt={activeArmoryWeapon.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 700px"
                    className="object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]"
                    unoptimized
                  />
                </div>

                {/* Bottom Ballistics Strip */}
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="grid grid-cols-4 gap-3 text-center font-mono">
                    <div className="border border-white/5 bg-[#08090C] p-2.5">
                      <span className="text-[10px] text-[#858B96] uppercase block">HEADSHOT</span>
                      <span className="text-xl sm:text-2xl font-bold text-[#FF4655]">{activeArmoryWeapon.headshotDmg}</span>
                    </div>
                    <div className="border border-white/5 bg-[#08090C] p-2.5">
                      <span className="text-[10px] text-[#858B96] uppercase block">BODY</span>
                      <span className="text-xl sm:text-2xl font-bold text-[#F5F5F5]">{activeArmoryWeapon.bodyDmg}</span>
                    </div>
                    <div className="border border-white/5 bg-[#08090C] p-2.5">
                      <span className="text-[10px] text-[#858B96] uppercase block">FIRE RATE</span>
                      <span className="text-xl sm:text-2xl font-bold text-[#F5F5F5]">{activeArmoryWeapon.fireRate}</span>
                    </div>
                    <div className="border border-white/5 bg-[#08090C] p-2.5">
                      <span className="text-[10px] text-[#858B96] uppercase block">MAGAZINE</span>
                      <span className="text-xl sm:text-2xl font-bold text-[#F5F5F5]">{activeArmoryWeapon.magazine}</span>
                    </div>
                  </div>

                  <p className="font-sans text-xs text-[#858B96] italic">
                    Recoil Pattern: {activeArmoryWeapon.recoilTrait}
                  </p>
                </div>
              </div>

              {/* Right: Weapon Selector List */}
              <div className="space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  {ARMORY_WEAPONS.map((w) => {
                    const isSelected = activeArmoryWeapon.slug === w.slug;
                    return (
                      <button
                        key={w.slug}
                        onClick={() => setActiveArmoryWeapon(w)}
                        className={`w-full p-4 border text-left flex items-center justify-between transition-all cursor-pointer clip-diagonal-sm ${
                          isSelected
                            ? "border-[#FF4655] bg-[#121620]"
                            : "border-white/10 bg-[#101218] hover:border-white/20 hover:bg-[#151A22]"
                        }`}
                      >
                        <div>
                          <span className="font-mono text-[10px] text-[#858B96] uppercase block">
                            {w.category}
                          </span>
                          <span className="font-display font-black text-xl text-[#F5F5F5]">
                            {w.name}
                          </span>
                        </div>

                        <div className="text-right font-mono">
                          <span className="text-xs text-[#FF4655] font-bold block">{w.headshotDmg} HS</span>
                          <span className="text-[10px] text-[#858B96]">{w.cost} Creds</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <Link
                  href="/weapons"
                  className="p-3 border border-white/10 bg-[#101218] hover:border-[#FF4655] text-center font-mono text-xs font-bold text-[#F5F5F5] hover:text-[#FF4655] transition-colors block clip-diagonal-sm"
                >
                  VIEW FULL 21-WEAPON ARSENAL →
                </Link>
              </div>

            </div>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 4: THE COLLECTION — "SKINS THAT DEFINE THE ROUND"
            Showcase premium skins from the actual database
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-20 lg:py-28 border-b border-white/[0.08] bg-[#08090C] relative">
          <Container className="max-w-7xl mx-auto px-4 sm:px-6">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF4655]">
                  <Flame className="h-3.5 w-3.5" />
                  <span>
                    SECTION 04 // COSMETIC ARCHIVE {String(featuredSkins.length).padStart(2, "0")} / {totalSkinCount > 0 ? totalSkinCount.toLocaleString() : "1,400+"}
                  </span>
                  {isSyncingSkins && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-white/10 text-white animate-pulse">
                      SYNCING LIVE
                    </span>
                  )}
                </div>
                <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-[#F5F5F5]">
                  THE COLLECTION
                </h2>
                <p className="font-mono text-xs sm:text-sm text-[#FF4655] font-bold tracking-widest uppercase">
                  SKINS THAT DEFINE THE ROUND
                </p>
              </div>

              <Link href="/skins" className="font-mono text-xs font-bold text-[#FF4655] hover:underline uppercase tracking-wider">
                EXPLORE {totalSkinCount > 0 ? `${totalSkinCount.toLocaleString()}+` : "1,400+"} SKINS →
              </Link>
            </div>

            {/* Skins Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredSkins.map((skin) => (
                <div
                  key={skin.uuid || skin.name}
                  className="group border border-white/10 bg-[#101218] hover:border-[#FF4655]/60 transition-all duration-300 p-6 flex flex-col justify-between clip-diagonal-sm hover:shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 font-mono text-[10px]">
                      <span className="px-2 py-0.5 border border-white/10 bg-[#08090C] text-[#FF4655] font-bold uppercase">
                        {skin.tier} TIER
                      </span>
                      <span className="text-[#F5F5F5] font-bold">{skin.price} VP</span>
                    </div>

                    {/* Skin Render Display */}
                    <div className="relative h-40 w-full my-4 flex items-center justify-center">
                      <Image
                        src={skin.iconUrl}
                        alt={skin.name}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 400px"
                        onError={() => handleSkinImageError(skin.uuid)}
                        className="object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-md"
                      />
                    </div>

                    <h3 className="font-display font-black text-xl uppercase tracking-tight text-[#F5F5F5] group-hover:text-[#FF4655] transition-colors">
                      {skin.name}
                    </h3>
                    <p className="font-sans text-xs text-[#858B96] mt-1">
                      {skin.theme}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleWishlist(skin.name, "skin")}
                      className="gap-1.5 text-xs font-mono border-white/10 hover:border-[#FF4655]"
                    >
                      <Heart className="h-3 w-3" /> Save
                    </Button>
                    <Link href={`/skins/${slugify(skin.name)}`}>
                      <Button variant="primary" size="sm" className="font-mono text-xs uppercase bg-[#FF4655] text-white">
                        Inspect
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}

              {/* Daily Spotlight Skin (Live from API) */}
              {randomSkin && (
                <div className="border border-[#FF4655]/40 bg-[#121620] p-6 flex flex-col justify-between clip-diagonal-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#FF4655] text-white font-mono text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider">
                    DAILY SPOTLIGHT
                  </div>

                  <div>
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 font-mono text-[10px]">
                      <span className="text-[#FF4655] font-bold uppercase">LIVE SPOTLIGHT</span>
                      <span className="text-[#F5F5F5] font-bold">
                        {(CONTENT_TIER_MAP[randomSkin.contentTierUuid ?? ""] || DEFAULT_TIER).price} VP
                      </span>
                    </div>

                    <div className="relative h-40 w-full my-4 flex items-center justify-center">
                      {getSkinImageUrl(randomSkin) && (
                        <Image
                          src={getSkinImageUrl(randomSkin)!}
                          alt={randomSkin.displayName}
                          fill
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-contain transition-transform duration-500 hover:scale-105 filter drop-shadow-md"
                        />
                      )}
                    </div>

                    <h3 className="font-display font-black text-xl uppercase tracking-tight text-[#F5F5F5]">
                      {randomSkin.displayName}
                    </h3>
                    <p className="font-sans text-xs text-[#858B96] mt-1">
                      Cataloged with inspect audio clips and chroma colorways.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleWishlist(randomSkin.displayName, "skin")}
                      className="gap-1.5 text-xs font-mono border-white/10 hover:border-[#FF4655]"
                    >
                      <Heart className="h-3 w-3" /> Save
                    </Button>
                    <Link href={`/skins/${slugify(randomSkin.displayName) || randomSkin.uuid}`}>
                      <Button variant="primary" size="sm" className="font-mono text-xs uppercase bg-[#FF4655] text-white">
                        Inspect
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 5: THE BATTLEFIELD — "SECTOR RECONNAISSANCE"
            Cinematic full-width official map splash art with hover pan/zoom
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-20 lg:py-28 border-b border-white/[0.08] bg-[#0A0D13] relative">
          <Container className="max-w-7xl mx-auto px-4 sm:px-6">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF4655]">
                  <Compass className="h-3.5 w-3.5" />
                  <span>SECTION 05 // COMBAT ENVIRONMENTS</span>
                </div>
                <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-[#F5F5F5]">
                  THE BATTLEFIELD
                </h2>
                <p className="font-mono text-xs sm:text-sm text-[#FF4655] font-bold tracking-widest uppercase">
                  18 COMBAT SECTORS // 7 ACTIVE TOURNAMENT SITES
                </p>
              </div>

              <Link href="/maps" className="font-mono text-xs font-bold text-[#FF4655] hover:underline uppercase tracking-wider">
                INTERACTIVE 3D RADAR MAPS →
              </Link>
            </div>

            {/* Cinematic Maps Showcase */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {BATTLEFIELD_MAPS.map((map) => (
                <Link
                  key={map.slug}
                  href={`/maps/${map.slug}`}
                  className="group relative h-80 border border-white/10 overflow-hidden clip-diagonal-sm flex flex-col justify-end p-6 hover:border-[#FF4655] transition-all duration-300"
                >
                  {/* Full-bleed Map Splash with Hover Zoom */}
                  <Image
                    src={map.splashUrl}
                    alt={map.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 450px"
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                  />

                  {/* Gradient Overlay for Typography Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[#08090C]/60 to-transparent" />

                  {/* Top Location Tag */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-white/80">
                    <span className="px-2 py-0.5 border border-white/20 bg-[#08090C]/80 backdrop-blur-xs">
                      {map.sites}
                    </span>
                    <span>{map.location}</span>
                  </div>

                  {/* Map Identity */}
                  <div className="relative z-10 space-y-1">
                    <h3 className="font-display font-black text-3xl uppercase tracking-tight text-[#F5F5F5] group-hover:text-[#FF4655] transition-colors">
                      {map.name}
                    </h3>
                    <p className="font-sans text-xs text-[#858B96] line-clamp-2">
                      {map.feature}
                    </p>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#FF4655] font-bold pt-2">
                      VIEW CALLOUTS &amp; EXECUTIONS →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 6: COMPETITIVE INTELLIGENCE & UTILITY SUITE
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-20 border-b border-white/[0.08] bg-[#08090C] relative">
          <Container className="max-w-7xl mx-auto px-4 sm:px-6">
            
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-stretch">
              
              {/* Latest Patch & Tournament Balance */}
              <div className="border border-white/10 bg-[#101218] p-6 sm:p-8 clip-diagonal-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 font-mono text-xs">
                    <span className="text-[#FF4655] font-bold uppercase tracking-wider">
                      LATEST INTEL // ACTIVE BALANCE
                    </span>
                    <Link href="/patch-notes" className="text-[#858B96] hover:text-white">
                      All Patch Notes →
                    </Link>
                  </div>

                  {latestPatch && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-[#FF4655]/15 border border-[#FF4655]/40 text-[#FF4655] font-mono text-xs font-bold">
                          PATCH {latestPatch.version}
                        </span>
                        <span className="font-mono text-xs text-[#858B96]">{latestPatch.date}</span>
                      </div>

                      <h3 className="font-display font-black text-2xl uppercase tracking-tight text-[#F5F5F5]">
                        Competitive Balance &amp; Agent Adjustments
                      </h3>

                      <p className="font-sans text-xs text-[#858B96] leading-relaxed">
                        Tournament meta updates affecting {latestPatch.buffs.length} buffed abilities and {latestPatch.nerfs.length} agent nerfs.
                      </p>

                      <div className="grid gap-2 pt-2 sm:grid-cols-2">
                        {latestPatch.buffs.slice(0, 2).map((b: { subject: string; detail: string }, i: number) => (
                          <div key={i} className="p-3 border border-emerald-500/20 bg-emerald-500/5 font-mono text-xs">
                            <span className="text-emerald-400 font-bold block mb-1">BUFF: {b.subject}</span>
                            <span className="text-[#858B96] text-[11px]">{b.detail}</span>
                          </div>
                        ))}
                        {latestPatch.nerfs.slice(0, 2).map((n: { subject: string; detail: string }, i: number) => (
                          <div key={i} className="p-3 border border-[#FF4655]/20 bg-[#FF4655]/5 font-mono text-xs">
                            <span className="text-[#FF4655] font-bold block mb-1">NERF: {n.subject}</span>
                            <span className="text-[#858B96] text-[11px]">{n.detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                  <Link href={`/patch-notes/${latestPatch?.slug || "patch-1306"}`}>
                    <Button variant="outline" size="sm" className="font-mono text-xs uppercase border-white/10 text-[#F5F5F5] hover:border-[#FF4655]">
                      READ FULL PATCH BREAKDOWN →
                    </Button>
                  </Link>
                  <Link href="/tier-list" className="font-mono text-xs text-[#858B96] hover:text-[#FF4655]">
                    Agent Tier List →
                  </Link>
                </div>
              </div>

              {/* Tactical Utilities & Tools */}
              <div className="border border-white/10 bg-[#101218] p-6 sm:p-8 clip-diagonal-sm flex flex-col justify-between">
                <div>
                  <div className="pb-4 mb-4 border-b border-white/10 font-mono text-xs text-[#FF4655] font-bold uppercase tracking-wider">
                    TACTICAL ENGINES
                  </div>

                  <div className="divide-y divide-white/10">
                    <Link
                      href="/comp-builder"
                      className="group py-3.5 block transition-colors"
                    >
                      <span className="font-mono text-[10px] text-[#FF4655] font-bold uppercase block">TOOL // META SIMULATOR</span>
                      <span className="font-display font-bold text-lg text-[#F5F5F5] group-hover:text-[#FF4655] transition-colors block">
                        Team Comp Builder
                      </span>
                      <span className="font-sans text-xs text-[#858B96] block mt-0.5">
                        Simulate and optimize team agent synergies across all 18 maps.
                      </span>
                    </Link>

                    <Link
                      href="/sensitivity"
                      className="group py-3.5 block transition-colors"
                    >
                      <span className="font-mono text-[10px] text-[#FF4655] font-bold uppercase block">TOOL // CONVERTER</span>
                      <span className="font-display font-bold text-lg text-[#F5F5F5] group-hover:text-[#FF4655] transition-colors block">
                        Sensitivity &amp; eDPI Matcher
                      </span>
                      <span className="font-sans text-xs text-[#858B96] block mt-0.5">
                        Convert sensitivity across CS2, Apex, Overwatch, and Rainbow Six.
                      </span>
                    </Link>

                    <Link
                      href="/lore"
                      className="group py-3.5 block transition-colors"
                    >
                      <span className="font-mono text-[10px] text-[#FF4655] font-bold uppercase block">DATABASE // CANON ARCHIVE</span>
                      <span className="font-display font-bold text-lg text-[#F5F5F5] group-hover:text-[#FF4655] transition-colors block">
                        First Light &amp; VALORANT Lore Timeline
                      </span>
                      <span className="font-sans text-xs text-[#858B96] block mt-0.5">
                        Chronological story archive, Kingdom Corp secrets, and Earth-Omega canon.
                      </span>
                    </Link>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <Link href="/tools" className="text-[#858B96] hover:text-[#F5F5F5]">
                    All 7 Tactical Tools →
                  </Link>
                  <Link href="/guides" className="text-[#FF4655] font-semibold hover:underline">
                    Masterclass Guides →
                  </Link>
                </div>
              </div>

            </div>
          </Container>
        </section>

      </div>
    </PageTransition>
  );
}

export default HomepageClient;
