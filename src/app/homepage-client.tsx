"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight, Search as SearchIcon,
  Heart, Shield, Crosshair, Zap, Eye, Compass, Flame, Radio
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useUserWishlist } from "@/hooks/use-user-wishlist";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { PageTransition } from "@/components/motion-system";
import { valorantDb } from "@/lib/valorant-db";
import { CONTENT_TIER_MAP, DEFAULT_TIER } from "@/lib/valorant-types";
import type { ValorantMap, ValorantSkin } from "@/lib/valorant-types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Cinematic Hero Roster ────────────────────────────────────────────────────
interface HeroAgent {
  name: string;
  callsign: string;
  role: "DUELIST" | "CONTROLLER" | "INITIATOR" | "SENTINEL";
  origin: string;
  tagline: string;
  quote: string;
  accentColor: string;
  glowColor: string;
  portrait: string;
  entry: number;
  mobility: number;
  info: number;
  slug: string;
}

const HERO_AGENTS: HeroAgent[] = [
  {
    name: "Jett",
    callsign: "WIND WALKER",
    role: "DUELIST",
    origin: "South Korea",
    tagline: "High-velocity entry aggression with Tailwind escapes and lethal Bladestorm daggers.",
    quote: "Think you can keep up? Good luck.",
    accentColor: "#FF4655",
    glowColor: "rgba(255, 70, 85, 0.28)",
    portrait: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/fullportrait.png",
    entry: 96,
    mobility: 98,
    info: 44,
    slug: "jett",
  },
  {
    name: "Omen",
    callsign: "SHADOW OPERATIVE",
    role: "CONTROLLER",
    origin: "Unknown",
    tagline: "Omnipresent tactical smokes, teleport flanking, and Paranoia vision denial.",
    quote: "Scatter. They cannot hide from shadows.",
    accentColor: "#818CF8",
    glowColor: "rgba(129, 140, 248, 0.28)",
    portrait: "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b1c-7add8277706a/fullportrait.png",
    entry: 68,
    mobility: 86,
    info: 74,
    slug: "omen",
  },
  {
    name: "Reyna",
    callsign: "SOUL REAPER",
    role: "DUELIST",
    origin: "Mexico",
    tagline: "Devouring fallen enemies to heal, dismiss into invulnerability, and overwhelm rounds.",
    quote: "They found a monster. Let them suffer.",
    accentColor: "#C084FC",
    glowColor: "rgba(192, 132, 252, 0.28)",
    portrait: "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/fullportrait.png",
    entry: 94,
    mobility: 88,
    info: 38,
    slug: "reyna",
  },
  {
    name: "Phoenix",
    callsign: "SOLAR IGNITION",
    role: "DUELIST",
    origin: "United Kingdom",
    tagline: "Flash entry curves, blazing wall cover, and second-chance Run It Back ultimate.",
    quote: "Just watch my back. I got the rest.",
    accentColor: "#FB923C",
    glowColor: "rgba(251, 146, 60, 0.28)",
    portrait: "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/fullportrait.png",
    entry: 90,
    mobility: 82,
    info: 46,
    slug: "phoenix",
  },
  {
    name: "Viper",
    callsign: "TOXIC ALCHEMIST",
    role: "CONTROLLER",
    origin: "United States",
    tagline: "Deploys poisonous chemical screens, acid decay puddles, and total site-locking Pit.",
    quote: "Welcome to my world. Don't breathe.",
    accentColor: "#4ADE80",
    glowColor: "rgba(74, 222, 128, 0.25)",
    portrait: "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/fullportrait.png",
    entry: 52,
    mobility: 48,
    info: 82,
    slug: "viper",
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
    description: "Guaranteed lethal 160 headshot damage at any distance. The definitive tournament rifle.",
    recoilTrait: "Heavy vertical kick with precision first 3-shot clustering",
    iconUrl: "https://media.valorant-api.com/weapons/9c82e14d-4e4c-1647-a728-4f8150495393/displayicon.png",
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
    description: "Silenced barrel with zero bullet tracers through smoke and a blistering 11.0 rds/sec rate.",
    recoilTrait: "Tight, predictable horizontal spray transfer recovery",
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
    iconUrl: "https://media.valorant-api.com/weapons/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png",
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

// ── Iconic Skin Showcases ────────────────────────────────────────────────────
interface FeaturedSkinShowcase {
  name: string;
  weapon: string;
  tier: "EXCLUSIVE" | "ULTRA" | "PREMIUM";
  price: number;
  iconUrl: string;
  slug: string;
  theme: string;
}

const FEATURED_COLLECTIONS: FeaturedSkinShowcase[] = [
  {
    name: "Champions 2024 Vandal",
    weapon: "Vandal",
    tier: "EXCLUSIVE",
    price: 2675,
    iconUrl: "https://media.valorant-api.com/weaponskins/e0df7ba2-4b2a-bf39-8664-88aa3801267b/displayicon.png",
    slug: "vandal",
    theme: "Championship Aura & Trophy Finisher",
  },
  {
    name: "Kuronami Vandal",
    weapon: "Vandal",
    tier: "EXCLUSIVE",
    price: 2375,
    iconUrl: "https://media.valorant-api.com/weaponskins/758c545b-4171-aa3a-5309-fa986ee35a11/displayicon.png",
    slug: "vandal",
    theme: "Water Flow & Dual Kunai Reload",
  },
  {
    name: "Reaver Vandal",
    weapon: "Vandal",
    tier: "PREMIUM",
    price: 1775,
    iconUrl: "https://media.valorant-api.com/weaponskins/43c22421-4f15-8947-a9a3-5c829e0a0d9b/displayicon.png",
    slug: "vandal",
    theme: "Necrotic Bells & Dark Telekinesis",
  },
  {
    name: "Prime 2.0 Phantom",
    weapon: "Phantom",
    tier: "PREMIUM",
    price: 1775,
    iconUrl: "https://media.valorant-api.com/weaponskins/7e997f8c-4a37-58b9-50e5-79a0b4d45863/displayicon.png",
    slug: "phantom",
    theme: "Hypercar Radiance & Laser Discharge",
  },
  {
    name: "Araxys Vandal",
    weapon: "Vandal",
    tier: "EXCLUSIVE",
    price: 2175,
    iconUrl: "https://media.valorant-api.com/weaponskins/e78112c3-42bc-2234-a21c-4395e5efd3e3/displayicon.png",
    slug: "vandal",
    theme: "Alien Mechanical Armor Plates",
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

  // State
  const [activeHeroAgentIdx, setActiveHeroAgentIdx] = useState(0);
  const [activeArmoryWeapon, setActiveArmoryWeapon] = useState<ArmoryWeapon>(ARMORY_WEAPONS[0]);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("ALL");
  const [randomSkin, setRandomSkin] = useState<ValorantSkin | null>(null);
  const [query, setQuery] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const activeAgent = HERO_AGENTS[activeHeroAgentIdx];

  // Auto-cycle hero agents gently if not reduced motion (every 9s)
  useEffect(() => {
    if (reduce) return;
    const interval = setInterval(() => {
      setActiveHeroAgentIdx((prev) => (prev + 1) % HERO_AGENTS.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [reduce]);

  // Fetch a daily random skin from API
  useEffect(() => {
    fetch("https://valorant-api.com/v1/weapons/skins")
      .then((r) => r.json())
      .then((j) => {
        const skins: ValorantSkin[] = j.data ?? [];
        const validSkins = skins.filter(
          (s) => s.displayIcon && !s.displayName.toLowerCase().includes("standard")
        );
        if (validSkins.length > 0) {
          const randIdx = Math.floor(Math.random() * validSkins.length);
          setRandomSkin(validSkins[randIdx]);
        }
      })
      .catch(() => {});
  }, []);

  // Subtle Mouse Parallax Handler (Desktop)
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

  // Filtered agents for Section 2
  const filteredAgents = useMemo(() => {
    if (selectedRoleFilter === "ALL") return valorantDb.agents.slice(0, 8);
    return valorantDb.agents.filter((a) => a.role === selectedRoleFilter).slice(0, 8);
  }, [selectedRoleFilter]);

  const latestPatch = valorantDb.patches[0];

  return (
    <PageTransition>
      <div
        className="min-h-screen bg-[#08090C] text-[#F5F5F5] selection:bg-[#FF4655] selection:text-white"
        onMouseMove={handleMouseMove}
      >
        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1: HERO — "ENTER THE PROTOCOL"
            Cinematic visual trailer opening with official Agent keyart
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative min-h-[90vh] lg:min-h-[96vh] w-full overflow-hidden border-b border-white/[0.08] flex flex-col justify-between pt-10 pb-8 sm:pb-12">
          
          {/* Top Thin Red Cinematic Accent Beam */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF4655] to-transparent z-20 origin-center"
          />

          {/* Background Atmospheric Layers with 2px Parallax */}
          <div
            className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
            style={{
              transform: reduce
                ? "none"
                : `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)`,
              transition: "transform 0.25s ease-out",
            }}
          >
            {/* Dark tactical vignette */}
            <div className="absolute inset-0 bg-[#08090C]" />
            
            {/* Dynamic Agent Atmospheric Backlight Bloom */}
            <div
              className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-30 transition-colors duration-1000"
              style={{ backgroundColor: activeAgent.accentColor }}
            />

            {/* Subtle environmental grid watermark */}
            <div className="absolute inset-0 bg-tactical-grid opacity-[0.18]" />

            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-transparent to-[#08090C]/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#08090C] via-[#08090C]/85 to-transparent lg:to-transparent" />
          </div>

          {/* Main Hero Container */}
          <Container className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full my-auto py-6 sm:py-12">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
              
              {/* ── Left / Center Column: Cinematic Typography & Dominant Search ── */}
              <div className="space-y-6 sm:space-y-8 flex flex-col items-start text-left max-w-2xl">
                
                {/* 0.5s Eyebrow */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="inline-flex items-center gap-2.5 px-3 py-1 border border-white/10 bg-[#101218]/90 text-white font-mono text-[11px] uppercase tracking-widest clip-diagonal-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4655] animate-pulse" />
                  <span>THE VALORANT DATABASE</span>
                </motion.div>

                {/* 0.8s Main Heading: VLOPEDIA */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
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

                {/* 1.2s Search Interface — Dominant Primary CTA */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.8 }}
                  className="w-full"
                >
                  <form
                    onSubmit={goSearch}
                    role="search"
                    className="relative flex items-center border border-white/15 bg-[#101218]/95 hover:border-[#FF4655]/60 focus-within:border-[#FF4655] focus-within:ring-2 focus-within:ring-[#FF4655]/25 backdrop-blur-xl shadow-2xl transition-all duration-200 clip-diagonal-sm"
                  >
                    <SearchIcon className="ml-4 sm:ml-5 h-5 w-5 shrink-0 text-[#858B96]" aria-hidden="true" />
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
                      className="shrink-0 mr-2 sm:mr-3 font-mono text-xs font-bold uppercase tracking-wider px-5 sm:px-6 py-2.5 bg-[#FF4655] hover:bg-[#FF4655]/90 text-white clip-diagonal-sm shadow-md"
                    >
                      SEARCH
                    </Button>
                  </form>
                </motion.div>

                {/* 1.5s Tactical Navigation Controls (Not generic rounded pills) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 1.0 }}
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
                      { label: "SKINS", count: "1,400+", href: "/skins" },
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
                      src={activeAgent.portrait}
                      alt={`VALORANT Agent ${activeAgent.name}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 650px"
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

                {/* Quick Agent Selector Tabs */}
                <div className="absolute -bottom-4 sm:bottom-0 right-0 flex items-center gap-1.5 bg-[#101218]/90 border border-white/10 p-1 clip-diagonal-sm z-20">
                  {HERO_AGENTS.map((agent, idx) => (
                    <button
                      key={agent.name}
                      onClick={() => setActiveHeroAgentIdx(idx)}
                      className={`px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                        activeHeroAgentIdx === idx
                          ? "bg-[#FF4655] text-white"
                          : "text-[#858B96] hover:text-[#F5F5F5] hover:bg-white/5"
                      }`}
                    >
                      {agent.name}
                    </button>
                  ))}
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
                  <span className="text-[#F5F5F5] font-bold">1,400+</span> SKINS
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

            {/* Expansive Agent Cards Showcase */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredAgents.map((agent) => (
                <div
                  key={agent.slug}
                  className="group relative border border-white/10 bg-[#101218] hover:border-[#FF4655]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden clip-diagonal-sm hover:shadow-xl"
                >
                  {/* Top Character Visual Stage */}
                  <div className="relative h-64 w-full bg-gradient-to-b from-[#151A22] to-[#101218] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-tactical-grid opacity-15" />
                    
                    {/* Role Stamp Background Watermark */}
                    <span className="absolute top-3 left-3 font-display font-black text-4xl text-white/[0.04] uppercase select-none">
                      {agent.role}
                    </span>

                    {/* Agent Full Portrait with Hover Zoom */}
                    <div className="relative h-full w-full">
                      <Image
                        src={agent.portrait}
                        alt={agent.name}
                        fill
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
                        {agent.abilities.slice(0, 4).map((ability, idx) => (
                          <div
                            key={idx}
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
                              <span className="font-mono text-[10px] text-[#858B96]">{ability.key}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
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

            <div className="mt-12 text-center">
              <Link href="/agents">
                <Button
                  variant="outline"
                  className="font-mono text-xs font-bold uppercase tracking-wider px-8 py-3 border-white/15 text-[#F5F5F5] hover:border-[#FF4655] hover:text-[#FF4655] clip-diagonal-sm"
                >
                  VIEW ALL 29 VALORANT AGENTS →
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3: THE ARMORY — "PRECISION. POWER. CONTROL."
            Cinematic Weapon Showcase with real ballistics & damage tables
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-20 lg:py-28 border-b border-white/[0.08] bg-[#0A0D13] relative">
          <Container className="max-w-7xl mx-auto px-4 sm:px-6">
            
            {/* Header */}
            <div className="space-y-2 mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF4655]">
                <Crosshair className="h-3.5 w-3.5" />
                <span>SECTION 03 // BALLISTIC SPECIFICATIONS</span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-[#F5F5F5]">
                THE ARMORY
              </h2>
              <p className="font-mono text-xs sm:text-sm text-[#FF4655] font-bold tracking-widest uppercase">
                PRECISION. POWER. CONTROL.
              </p>
            </div>

            {/* Weapon Showcase Grid */}
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

                {/* Massive Weapon Artwork Display */}
                <div className="relative h-48 sm:h-64 w-full flex items-center justify-center my-6">
                  <Image
                    src={activeArmoryWeapon.iconUrl}
                    alt={activeArmoryWeapon.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 700px"
                    className="object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)] transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Ballistics Stat Bar */}
                <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-6 font-mono">
                  <div className="p-3 border border-white/10 bg-[#08090C] text-center">
                    <span className="text-[10px] text-[#858B96] uppercase block">HEADSHOT</span>
                    <span className="text-2xl font-black text-[#FF4655]">{activeArmoryWeapon.headshotDmg}</span>
                    <span className="text-[9px] text-[#858B96] block">HP LETHALITY</span>
                  </div>
                  <div className="p-3 border border-white/10 bg-[#08090C] text-center">
                    <span className="text-[10px] text-[#858B96] uppercase block">BODY IMPACT</span>
                    <span className="text-2xl font-black text-[#F5F5F5]">{activeArmoryWeapon.bodyDmg}</span>
                    <span className="text-[9px] text-[#858B96] block">HP BASE</span>
                  </div>
                  <div className="p-3 border border-white/10 bg-[#08090C] text-center">
                    <span className="text-[10px] text-[#858B96] uppercase block">FIRE RATE</span>
                    <span className="text-2xl font-black text-[#F5F5F5]">{activeArmoryWeapon.fireRate}</span>
                    <span className="text-[9px] text-[#858B96] block">ROUNDS / SEC</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                  <p className="font-sans text-xs text-[#858B96] max-w-md">
                    {activeArmoryWeapon.description}
                  </p>
                  <Link href={`/compare/weapons/vandal-vs-phantom`}>
                    <Button variant="primary" size="sm" className="font-mono text-xs uppercase tracking-wider bg-[#FF4655] text-white">
                      COMPARE BALLISTICS →
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right: Quick Weapon Selector List */}
              <div className="space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-[#858B96] uppercase tracking-wider block mb-2">
                    SELECT FIREARM TO INSPECT
                  </span>

                  {ARMORY_WEAPONS.map((w) => {
                    const isSelected = activeArmoryWeapon.slug === w.slug;
                    return (
                      <button
                        key={w.slug}
                        onClick={() => setActiveArmoryWeapon(w)}
                        className={`w-full p-4 border transition-all text-left flex items-center justify-between clip-diagonal-sm cursor-pointer ${
                          isSelected
                            ? "border-[#FF4655] bg-[#151A22] shadow-md"
                            : "border-white/10 bg-[#101218] hover:border-white/20 hover:bg-[#13171F]"
                        }`}
                      >
                        <div className="space-y-0.5">
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
                  <span>SECTION 04 // COSMETIC ARCHIVE</span>
                </div>
                <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-[#F5F5F5]">
                  THE COLLECTION
                </h2>
                <p className="font-mono text-xs sm:text-sm text-[#FF4655] font-bold tracking-widest uppercase">
                  SKINS THAT DEFINE THE ROUND
                </p>
              </div>

              <Link href="/skins" className="font-mono text-xs font-bold text-[#FF4655] hover:underline uppercase tracking-wider">
                EXPLORE 1,400+ SKINS →
              </Link>
            </div>

            {/* Skins Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURED_COLLECTIONS.map((skin) => (
                <div
                  key={skin.name}
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
                        sizes="(max-width: 768px) 100vw, 400px"
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
                    <Link href={`/skins/${skin.slug}`}>
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
                      {randomSkin.displayIcon && (
                        <Image
                          src={randomSkin.displayIcon}
                          alt={randomSkin.displayName}
                          fill
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
                        {latestPatch.buffs.slice(0, 2).map((b, i) => (
                          <div key={i} className="p-3 border border-emerald-500/20 bg-emerald-500/5 font-mono text-xs">
                            <span className="text-emerald-400 font-bold block mb-1">BUFF: {b.subject}</span>
                            <span className="text-[#858B96] text-[11px]">{b.detail}</span>
                          </div>
                        ))}
                        {latestPatch.nerfs.slice(0, 2).map((n, i) => (
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
