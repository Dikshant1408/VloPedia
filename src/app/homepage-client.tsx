"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight, Search as SearchIcon,
  ShieldAlert, BookOpen, Heart, ChevronRight,
  Crosshair, Zap, Activity, Flame
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useUserWishlist } from "@/hooks/use-user-wishlist";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { Reveal, StaggerContainer, PageTransition } from "@/components/motion-system";
import { RoleBadge } from "@/components/role-badge";
import { MapCard } from "@/components/map-card";
import { valorantDb } from "@/lib/valorant-db";
import { CONTENT_TIER_MAP, DEFAULT_TIER } from "@/lib/valorant-types";
import type { ValorantAgent, ValorantBundle, ValorantMap, ValorantSkin } from "@/lib/valorant-types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const META_AGENTS = [
  {
    name: "Jett",
    role: "Duelist",
    slug: "jett",
    entry: 96,
    mobility: 98,
    info: 44,
    bestMaps: ["Ascent", "Haven", "Breeze"],
    portrait: "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/fullportrait.png",
    accent: "FA4454",
  },
  {
    name: "Omen",
    role: "Controller",
    slug: "omen",
    entry: 68,
    mobility: 86,
    info: 74,
    bestMaps: ["Ascent", "Lotus", "Sunset"],
    portrait: "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b1c-7add8277706a/fullportrait.png",
    accent: "A78BFA",
  },
  {
    name: "Sova",
    role: "Initiator",
    slug: "sova",
    entry: 54,
    mobility: 50,
    info: 98,
    bestMaps: ["Ascent", "Haven", "Breeze"],
    portrait: "https://media.valorant-api.com/agents/3207dd43-4636-1679-b5ce-f3880977e8fb/fullportrait.png",
    accent: "FBBF24",
  },
  {
    name: "Killjoy",
    role: "Sentinel",
    slug: "killjoy",
    entry: 42,
    mobility: 46,
    info: 94,
    bestMaps: ["Ascent", "Lotus", "Icebox"],
    portrait: "https://media.valorant-api.com/agents/1e58d929-473b-fb37-02d9-5fbe4144646f/fullportrait.png",
    accent: "34D399",
  },
];

const TAXONOMY_LINKS = [
  { label: "Agents", href: "/agents", desc: "Operatives & abilities" },
  { label: "Weapons", href: "/weapons", desc: "Specs & falloff charts" },
  { label: "Maps", href: "/maps", desc: "Callouts & executes" },
  { label: "Skins", href: "/skins", desc: "1,400+ skins & chromas" },
  { label: "Tools", href: "/tools", desc: "Comps & calculators" },
  { label: "Guides", href: "/guides", desc: "Strategy masterclasses" },
  { label: "Lore", href: "/lore", desc: "Timeline & canon records" },
];

export function HomepageClient() {
  const { user, signInWithDiscord } = useAuth();
  const { addWishlistItem, items: wishlistItems } = useUserWishlist();
  const reduce = useReducedMotion();

  const [agentsList, setAgentsList]   = useState<ValorantAgent[]>([]);
  const [randomSkin, setRandomSkin]   = useState<ValorantSkin | null>(null);
  const [maps, setMaps]               = useState<any[]>([]);
  const [selectedMetaAgent, setSelectedMetaAgent] = useState(META_AGENTS[0]);

  useEffect(() => {
    fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true")
      .then(r => r.json()).then(j => {
        const agents: ValorantAgent[] = j.data ?? [];
        setAgentsList(agents);
      }).catch(() => {});

    fetch("https://valorant-api.com/v1/maps")
      .then(r => r.json()).then(j => {
        const raw: ValorantMap[] = j.data ?? [];
        setMaps(raw.filter(m => m.splash && m.displayIcon).slice(0, 6).map(m => ({
          slug: m.displayName.toLowerCase().replace(/\s+/g, "-"),
          name: m.displayName.toUpperCase(),
          location: m.coordinates ?? undefined,
          splashUrl: m.splash || m.listViewIcon,
          lore: m.narrativeDescription ?? undefined,
        })));
      }).catch(() => {});

    fetch("https://valorant-api.com/v1/weapons/skins")
      .then(r => r.json()).then(j => {
        const skins: ValorantSkin[] = j.data ?? [];
        const validSkins = skins.filter(s => s.displayIcon && !s.displayName.toLowerCase().includes("standard"));
        if (validSkins.length > 0) {
          const randIdx = Math.floor(Math.random() * validSkins.length);
          setRandomSkin(validSkins[randIdx]);
        }
      }).catch(() => {});
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY   = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "12%"]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.4, 0.94]);

  const [query, setQuery] = useState("");
  const goSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    window.location.href = q.length >= 2 ? `/search?q=${encodeURIComponent(q)}` : "/search";
  };

  const handleWishlist = async (title: string, type: "skin"|"bundle") => {
    if (!user) {
      toast.info("Sign in to save items", { action: { label: "Sign In", onClick: signInWithDiscord }, className: "font-mono rounded-none" });
      return;
    }
    if (wishlistItems.some(w => w.title === title)) { toast.info(`Already wishlisted`, { className: "font-mono rounded-none" }); return; }
    try {
      await addWishlistItem({ title, category: type });
      toast.success(`Added "${title}" to wishlist`, { className: "font-mono rounded-none border-primary/40" });
    } catch { toast.error("Could not add", { className: "font-mono rounded-none" }); }
  };

  const mapCards = maps.length > 0 ? maps : valorantDb.maps.slice(0, 6).map(m => ({
    slug: m.slug, name: m.name, location: m.location, splashUrl: m.splashUrl, lore: m.lore,
  }));

  const latestPatch = valorantDb.patches[0];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">

        {/* ═══════════════════════════════════════════
            1. STREAMLINED HERO (3-SECOND HIERARCHY)
        ═══════════════════════════════════════════ */}
        <section ref={heroRef} className="relative min-h-[86vh] w-full overflow-hidden border-b border-border bg-background">
          {/* Subtle Agent Backdrop with smooth vignette */}
          <motion.div style={{ y: heroY }} className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src={selectedMetaAgent.portrait}
              alt={selectedMetaAgent.name}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover object-top opacity-35 transition-opacity duration-700"
            />
            <motion.div
              style={{ opacity: overlay }}
              className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          </motion.div>

          {/* Tactical grid background only — removed moving laser & duplicate grids */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] bg-tactical-grid opacity-25" />

          {/* Faint technical schematic — desktop only, restrained 5% watermark */}
          <div aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 z-[1] hidden xl:flex opacity-[0.05]">
            <svg width="420" height="500" viewBox="0 0 420 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 0 L420 0 L420 460 L380 500 L40 500 L0 460 L0 40 Z" stroke="var(--cyan)" strokeWidth="1.5" strokeDasharray="6 6" />
              <rect x="60" y="60" width="300" height="380" stroke="var(--cyan)" strokeWidth="1" />
              <line x1="0" y1="160" x2="420" y2="160" stroke="var(--cyan)" strokeWidth="0.75" />
              <line x1="0" y1="340" x2="420" y2="340" stroke="var(--cyan)" strokeWidth="0.75" />
              <circle cx="210" cy="250" r="100" stroke="var(--cyan)" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>

          <Container className="relative z-10 flex min-h-[86vh] flex-col justify-center py-16 lg:grid lg:grid-cols-[1.6fr_1fr] lg:items-center lg:gap-14">
            {/* Left: Core Value Proposition & Search First */}
            <Reveal className="space-y-6">
              {/* Tactical Eyebrow */}
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 bg-primary" aria-hidden="true" />
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan">
                  VLOPEDIA // TACTICAL ARCHIVE & UTILITY
                </span>
              </div>

              {/* Authoritative Title: What is VloPedia? */}
              <div className="space-y-1">
                <h1 className="font-display font-black text-5xl uppercase leading-none tracking-tighter text-foreground sm:text-6xl lg:text-7xl">
                  VLOPEDIA
                </h1>
                <p className="font-display font-bold text-lg sm:text-xl lg:text-2xl tracking-tight text-secondary uppercase">
                  VALORANT Database + Tools + Lore
                </p>
              </div>

              {/* Prominent Search Interface: What are you looking for? */}
              <div className="space-y-3 pt-2 max-w-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-secondary font-bold flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
                    What are you looking for?
                  </span>
                  <span className="font-mono text-[10px] text-muted hidden sm:inline">
                    PRESS <strong className="text-foreground">[CTRL+K]</strong> ANYWHERE
                  </span>
                </div>

                <form
                  onSubmit={goSearch}
                  role="search"
                  className="relative flex items-center border border-border/90 bg-surface/95 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/40 shadow-lg"
                >
                  <SearchIcon className="ml-3.5 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search agents, weapons, skins, maps, lore (e.g. Jett, Vandal, Ascent)..."
                    aria-label="Search VloPedia"
                    className="w-full bg-transparent px-3 py-3 font-sans text-sm text-foreground placeholder:text-muted focus:outline-none"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="tactical-control clip-diagonal-sm shrink-0 mr-1.5 font-mono text-xs uppercase"
                  >
                    Search
                  </Button>
                </form>

                {/* Tactical Search Suggestion Pills */}
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-secondary" aria-label="Suggested search queries">
                  <span className="text-[10px] uppercase text-muted tracking-wider mr-1">Suggestions:</span>
                  {[
                    { label: "Aemondir Vandal", href: "/skins/aemondir-vandal" },
                    { label: "Jett", href: "/agents/jett" },
                    { label: "Omen lore", href: "/lore/the-first-radiants" },
                    { label: "Best agent on Ascent", href: "/guides/best-agents-for-ascent" },
                    { label: "Vandal vs Phantom", href: "/compare/weapons/vandal-vs-phantom" },
                  ].map((sug) => (
                    <Link
                      key={sug.label}
                      href={sug.href}
                      className="border border-border/70 bg-surface/60 px-2.5 py-0.5 text-[11px] text-secondary transition-colors hover:border-primary/50 hover:text-foreground hover:bg-surface"
                    >
                      {sug.label}
                    </Link>
                  ))}
                </div>

                {/* Direct Taxonomy Chips */}
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-secondary pt-0.5" aria-label="Quick directory links">
                  <span className="text-[10px] uppercase text-muted tracking-wider mr-1">Direct:</span>
                  {TAXONOMY_LINKS.map((chip) => (
                    <Link
                      key={chip.href}
                      href={chip.href}
                      className="border border-border/50 bg-surface/40 px-2 py-0.5 text-[10px] text-muted transition-colors hover:border-border hover:text-foreground hover:bg-surface"
                    >
                      {chip.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Clear Action Hierarchy: Primary vs Secondary */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/agents">
                  <Button
                    variant="primary"
                    size="lg"
                    className="clip-diagonal-sm group gap-2 font-mono text-xs uppercase font-bold"
                  >
                    Explore Database
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Button>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const e = new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true });
                    window.dispatchEvent(e);
                  }}
                  className="h-11 border border-border/80 bg-surface/60 px-5 font-mono text-xs uppercase text-secondary hover:border-border hover:bg-surface hover:text-foreground transition-colors cursor-pointer"
                >
                  Quick Search [Ctrl+K]
                </button>
              </div>
            </Reveal>

            {/* Right: Secondary Tactical Telemetry Deck (Flat Rows, No Box-in-Box) */}
            <Reveal className="mt-8 hidden lg:flex lg:mt-0">
              <div className="relative w-full border border-border/80 bg-[#080F14]/90 backdrop-blur-md p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                  <div>
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-cyan">
                      TELEMETRY DECK
                    </span>
                    <p className="font-display font-black text-xs uppercase text-foreground">
                      Live Tactical Briefing
                    </p>
                  </div>
                  <span className="font-mono text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5">
                    ● SYNCED
                  </span>
                </div>

                {/* Flat information blocks */}
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="text-muted text-[10px] uppercase">LATEST PATCH</span>
                    <Link href="/patch-notes" className="font-bold text-primary hover:underline flex items-center gap-1">
                      Patch 9.04 Live →
                    </Link>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="text-muted text-[10px] uppercase">ACTIVE META COMP</span>
                    <Link href="/comp-builder?map=ascent&agents=jett,omen,sova,killjoy,kayo" className="font-bold text-emerald-400 hover:underline flex items-center gap-1">
                      Ascent S-Tier (88/100) →
                    </Link>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="text-muted text-[10px] uppercase">SKIN CATALOG</span>
                    <Link href="/skins" className="font-bold text-cyan hover:underline flex items-center gap-1">
                      1,400+ Skins & Chromas →
                    </Link>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-muted text-[10px] uppercase">PRO CALCULATORS</span>
                    <Link href="/sensitivity" className="text-secondary hover:text-foreground hover:underline text-[11px]">
                      Sens Converter & eDPI →
                    </Link>
                  </div>
                </div>

                {/* Contextual tool cards */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/50">
                  <Link href="/comp-builder" className="block">
                    <Button variant="secondary" size="sm" className="w-full font-mono text-[10px] uppercase">
                      Comp Builder
                    </Button>
                  </Link>
                  <Link href="/sensitivity" className="block">
                    <Button variant="outline" size="sm" className="w-full border-border/80 font-mono text-[10px] uppercase text-secondary hover:text-foreground">
                      Sens Calc
                    </Button>
                  </Link>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════
            2. EDITORIAL MOMENT 01: FIELD INTEL (HOVER TO REVEAL)
        ═══════════════════════════════════════════ */}
        <section className="border-b border-border bg-[#080F14] py-20">
          <Container>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-muted tracking-widest">01 //</span>
                  <span className="w-1.5 h-1.5 bg-primary" aria-hidden="true" />
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan">
                    FIELD INTEL
                  </span>
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-foreground">
                  The Agents Dominating This Patch
                </h2>
                <p className="font-sans text-sm text-secondary max-w-xl">
                  Inspect competitive efficiency, entry aggression, and map mastery ratings before queuing.
                </p>
              </div>

              <Link
                href="/agents"
                className="font-mono text-xs font-bold uppercase tracking-wider text-primary hover:text-foreground transition-colors flex items-center gap-1 shrink-0"
              >
                View all 26 operatives →
              </Link>
            </div>

            {/* Tactical Grid with Hover-Reveal Info Behavior */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {META_AGENTS.map((agent) => {
                const isSelected = selectedMetaAgent.slug === agent.slug;
                return (
                  <div
                    key={agent.slug}
                    onMouseEnter={() => setSelectedMetaAgent(agent)}
                    className={`group relative border bg-[#0D1A22] p-5 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-primary shadow-[0_0_16px_rgba(var(--primary-rgb),0.15)]"
                        : "border-border hover:border-border-light hover:bg-[#10202A]"
                    }`}
                  >
                    {/* Top Identity Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display font-black text-2xl uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
                          {agent.name}
                        </h3>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                          {agent.role}
                        </span>
                      </div>
                      <div className="h-6 w-6 border border-border/80 bg-surface flex items-center justify-center font-mono text-[10px] font-bold text-secondary">
                        {agent.name.slice(0, 2).toUpperCase()}
                      </div>
                    </div>

                    {/* Flat Divider Line */}
                    <div className="my-3.5 h-px w-full bg-border/60" />

                    {/* Hover-revealed Tactical Metrics */}
                    <div className="space-y-2 font-mono text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted uppercase">ENTRY</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/10 overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${agent.entry}%` }} />
                          </div>
                          <span className="font-bold text-foreground w-6 text-right">{agent.entry}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted uppercase">MOBILITY</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/10 overflow-hidden">
                            <div className="h-full bg-cyan" style={{ width: `${agent.mobility}%` }} />
                          </div>
                          <span className="font-bold text-foreground w-6 text-right">{agent.mobility}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted uppercase">INFO</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-white/10 overflow-hidden">
                            <div className="h-full bg-amber-400" style={{ width: `${agent.info}%` }} />
                          </div>
                          <span className="font-bold text-foreground w-6 text-right">{agent.info}</span>
                        </div>
                      </div>
                    </div>

                    {/* Best Maps List */}
                    <div className="mt-4 pt-3 border-t border-border/40 font-mono text-[10px]">
                      <span className="text-muted uppercase tracking-wider block mb-1">BEST MAPS:</span>
                      <div className="flex flex-wrap gap-1">
                        {agent.bestMaps.map((map) => (
                          <span key={map} className="border border-border bg-surface/80 px-1.5 py-0.5 text-secondary">
                            {map}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Dossier Link */}
                    <Link
                      href={`/agents/${agent.slug}`}
                      className="mt-4 flex items-center justify-between border border-border/60 bg-surface/50 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-secondary group-hover:border-primary/60 group-hover:text-primary transition-colors"
                    >
                      <span>Open Dossier</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════
            3. EDITORIAL MOMENT 02: ARMORY (RIFLE META)
        ═══════════════════════════════════════════ */}
        <section className="border-b border-border bg-[#0B141A] py-20">
          <Container>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-muted tracking-widest">02 //</span>
                  <span className="w-1.5 h-1.5 bg-primary" aria-hidden="true" />
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan">
                    ARMORY METRICS
                  </span>
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-foreground">
                  The Rifles Defining The Current Meta
                </h2>
                <p className="font-sans text-sm text-secondary max-w-xl">
                  Head-to-head ballistic specs for competitive decision-making. Flat telemetry without excessive decoration.
                </p>
              </div>

              <Link
                href="/compare"
                className="font-mono text-xs font-bold uppercase tracking-wider text-primary hover:text-foreground transition-colors flex items-center gap-1 shrink-0"
              >
                Open Full Arsenal Compare →
              </Link>
            </div>

            {/* Asymmetric 70/30 Armory Peek */}
            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              {/* Head to Head Rifles Table */}
              <div className="border border-border bg-[#0D1A22] p-6">
                <div className="flex items-center justify-between border-b border-border/70 pb-3 mb-4">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">
                    Ballistic Telemetry (Patch 9.04)
                  </span>
                  <span className="font-mono text-[10px] text-cyan">RIFLE CLASSIFICATION</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-border/50 text-muted text-[10px] uppercase">
                        <th className="py-2 pr-4">Specification</th>
                        <th className="py-2 px-4 text-primary font-bold">VANDAL</th>
                        <th className="py-2 px-4 text-cyan font-bold">PHANTOM</th>
                        <th className="py-2 pl-4 text-right">Advantage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      <tr>
                        <td className="py-2.5 pr-4 text-secondary">Headshot Lethality</td>
                        <td className="py-2.5 px-4 font-bold text-foreground">160 (All ranges)</td>
                        <td className="py-2.5 px-4 text-secondary">156 (0-15m) / 140 (15-30m)</td>
                        <td className="py-2.5 pl-4 text-right text-primary font-bold">Vandal (1-tap always)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 text-secondary">Fire Rate</td>
                        <td className="py-2.5 px-4 text-secondary">9.75 rds/sec</td>
                        <td className="py-2.5 px-4 font-bold text-foreground">11.0 rds/sec</td>
                        <td className="py-2.5 pl-4 text-right text-cyan font-bold">Phantom (+12.8%)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 text-secondary">Magazine Capacity</td>
                        <td className="py-2.5 px-4 text-secondary">25 rounds</td>
                        <td className="py-2.5 px-4 font-bold text-foreground">30 rounds</td>
                        <td className="py-2.5 pl-4 text-right text-cyan font-bold">Phantom (+5 rds)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 text-secondary">First-Bullet Spread</td>
                        <td className="py-2.5 px-4 text-secondary">0.25 deg</td>
                        <td className="py-2.5 px-4 font-bold text-foreground">0.20 deg</td>
                        <td className="py-2.5 pl-4 text-right text-cyan font-bold">Phantom (Tighter)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 text-secondary">Tracer Suppression</td>
                        <td className="py-2.5 px-4 text-muted">Visible tracers</td>
                        <td className="py-2.5 px-4 font-bold text-emerald-400">Silent / No bullet tracers</td>
                        <td className="py-2.5 pl-4 text-right text-emerald-400 font-bold">Phantom (Smoke spray)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <span className="text-muted text-[11px]">VERDICT: Vandal dominates long duels; Phantom dominates close trades & controller smokes.</span>
                  <Link href="/compare?w1=vandal&w2=phantom">
                    <Button variant="outline" size="sm" className="border-border hover:border-primary">
                      Full Comparison Matrix →
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Loadout Insight Panel */}
              <div className="border border-border bg-[#080F14] p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Crosshair className="h-4 w-4 text-primary" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                      Pro Buy Economics
                    </span>
                  </div>
                  <p className="font-sans text-xs text-secondary leading-relaxed">
                    Both rifles cost exactly 2,900 Creds. Full buy threshold is 3,900 Creds (with Heavy Shields) or 4,300 Creds with signature utility.
                  </p>
                  <div className="space-y-2 pt-1 font-mono text-[11px]">
                    <div className="flex justify-between border-b border-border/40 pb-1.5">
                      <span className="text-muted">Full Buy Target:</span>
                      <span className="text-foreground font-bold">3,900 Creds</span>
                    </div>
                    <div className="flex justify-between border-b border-border/40 pb-1.5">
                      <span className="text-muted">Loss Bonus Min:</span>
                      <span className="text-amber-400 font-bold">1,900 Creds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Loss Bonus Max (3+):</span>
                      <span className="text-emerald-400 font-bold">2,900 Creds</span>
                    </div>
                  </div>
                </div>

                <Link href="/economy" className="w-full">
                  <Button variant="secondary" size="sm" className="w-full font-mono text-[10px] uppercase">
                    Open Economy Playbook
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════
            4. EDITORIAL MOMENT 03: ARCHIVE (LORE & STORY)
        ═══════════════════════════════════════════ */}
        <section className="border-b border-border bg-[#080F14] py-20">
          <Container>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-muted tracking-widest">03 //</span>
                  <span className="w-1.5 h-1.5 bg-primary" aria-hidden="true" />
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan">
                    PROTOCOL ARCHIVE
                  </span>
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-foreground">
                  The Story Behind The Protocol
                </h2>
                <p className="font-sans text-sm text-secondary max-w-xl">
                  Chronological records, confirmed timeline milestones, and canon evidence from Earth-1 and Omega.
                </p>
              </div>

              <Link
                href="/lore"
                className="font-mono text-xs font-bold uppercase tracking-wider text-primary hover:text-foreground transition-colors flex items-center gap-1 shrink-0"
              >
                Explore Lore Timeline →
              </Link>
            </div>

            {/* Flat Timeline Information Blocks */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="border border-border bg-[#0D1A22] p-5 space-y-3">
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-primary">
                  ERA 01 // 2039
                </span>
                <h3 className="font-display font-black text-xl uppercase tracking-tight text-foreground">
                  First Light Cataclysm
                </h3>
                <p className="font-sans text-xs text-secondary leading-relaxed">
                  A mysterious global luminous phenomenon introduces Radianite to Earth. Worldwide blackout ensues; select humans develop radiant biological abilities.
                </p>
                <div className="pt-2 border-t border-border/40">
                  <Link href="/lore/first-light" className="font-mono text-[10px] text-cyan hover:underline flex items-center gap-1">
                    First Light Dossier →
                  </Link>
                </div>
              </div>

              <div className="border border-border bg-[#0D1A22] p-5 space-y-3">
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-400">
                  ERA 02 // 2043
                </span>
                <h3 className="font-display font-black text-xl uppercase tracking-tight text-foreground">
                  Kingdom Corporation Monopoly
                </h3>
                <p className="font-sans text-xs text-secondary leading-relaxed">
                  A multi-trillion dollar mega-conglomerate seizes 75% of planetary Radianite refining rights. Secret laboratories, K-SEC private military, and extraction spikes emerge.
                </p>
                <div className="pt-2 border-t border-border/40">
                  <Link href="/lore/kingdom" className="font-mono text-[10px] text-cyan hover:underline flex items-center gap-1">
                    Kingdom Corp Dossier →
                  </Link>
                </div>
              </div>

              <div className="border border-border bg-[#0D1A22] p-5 space-y-3">
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  ERA 03 // 2050+
                </span>
                <h3 className="font-display font-black text-xl uppercase tracking-tight text-foreground">
                  Omega Earth Infiltration
                </h3>
                <p className="font-sans text-xs text-secondary leading-relaxed">
                  Mirror operatives from Earth-2 invade Earth-1 to siphon Radianite reserves to save their dying atmosphere. The VALORANT Protocol is founded to defend the home world.
                </p>
                <div className="pt-2 border-t border-border/40">
                  <Link href="/lore" className="font-mono text-[10px] text-cyan hover:underline flex items-center gap-1">
                    Omega Conflict Records →
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════
            5. COSMETIC SPOTLIGHT (SKIN OF THE DAY)
        ═══════════════════════════════════════════ */}
        {randomSkin && (
          <section className="border-b border-border bg-[#0B141A] py-20">
            <Container>
              <div className="mb-8">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-muted tracking-widest">04 //</span>
                  <span className="w-1.5 h-1.5 bg-primary" aria-hidden="true" />
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan">
                    ARSENAL SPOTLIGHT
                  </span>
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-foreground mt-1">
                  Skin of the Day
                </h2>
              </div>

              <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
                {/* Details */}
                <div className="space-y-6">
                  <h3 className="font-display font-black text-4xl uppercase tracking-tighter text-foreground">
                    {randomSkin.displayName}
                  </h3>
                  <p className="max-w-xl font-sans text-sm leading-relaxed text-secondary">
                    Browse upgrade paths, custom variants, and inspect high-definition reloading and execution videos for this tactical cosmetic.
                  </p>
                  
                  {/* Price & Rarity */}
                  {(() => {
                    const tier = CONTENT_TIER_MAP[randomSkin.contentTierUuid ?? ""] || DEFAULT_TIER;
                    return (
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 border border-border bg-surface px-3 py-1.5">
                          <Image src={tier.iconUrl} alt={tier.rarity} width={16} height={16} className="object-contain" />
                          <span className="font-mono text-xs font-black uppercase tracking-wider" style={{ color: tier.color }}>
                            {tier.rarity} TIER
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1.5 font-mono">
                          <span className="text-2xl font-black text-foreground">{tier.price.toLocaleString()}</span>
                          <span className="text-xs text-primary font-bold">VP</span>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="primary"
                      className="clip-diagonal-sm gap-2"
                      onClick={() => handleWishlist(randomSkin.displayName, "skin")}
                    >
                      <Heart className="h-4 w-4" aria-hidden="true" /> Add to Wishlist
                    </Button>
                    <Link href={`/skins/${slugify(randomSkin.displayName) || randomSkin.uuid}`}>
                      <Button variant="outline" className="clip-diagonal-sm border-border group gap-2 text-secondary hover:text-foreground">
                        Inspect Skin <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Visual */}
                <div className="relative overflow-hidden border border-border bg-[#0D1A22] flex items-center justify-center p-8" style={{ aspectRatio: "16/10" }}>
                  <div aria-hidden="true" className="absolute left-0 top-0 z-10 h-[2px] w-12 bg-primary" />
                  {randomSkin.displayIcon && (
                    <Image
                      src={randomSkin.displayIcon}
                      alt={randomSkin.displayName}
                      fill
                      sizes="(max-width:1024px) 100vw, 45vw"
                      className="object-contain p-8 transition-transform duration-500 hover:scale-[1.03]"
                    />
                  )}
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* ═══════════════════════════════════════════
            6. LATEST PATCH TELEMETRY
        ═══════════════════════════════════════════ */}
        {latestPatch && (
          <section className="border-b border-border bg-[#080F14] py-20">
            <Container>
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-muted tracking-widest">05 //</span>
                    <span className="w-1.5 h-1.5 bg-primary" aria-hidden="true" />
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan">
                      BALANCE TELEMETRY
                    </span>
                  </div>
                  <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-foreground mt-1">
                    Patch {latestPatch.version}
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 border border-success/30 bg-success/5 px-2.5 py-1 font-mono text-[9px] font-black uppercase tracking-wider text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  DATABASE SYNCED: {latestPatch.date}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-success flex items-center gap-2">
                    <span>AGENT & WEAPON BUFFS</span>
                  </h3>
                  {latestPatch.buffs.map((b: any, i: number) => (
                    <div key={`buff-${i}`} className="border border-success/20 bg-success/[0.03] p-4">
                      <div className="font-mono text-[9px] font-black uppercase tracking-widest text-success">BUFF</div>
                      <p className="mt-1 font-sans text-sm text-foreground"><span className="font-bold">{b.subject}:</span> {b.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                    <span>AGENT & WEAPON NERFS</span>
                  </h3>
                  {latestPatch.nerfs.map((n: any, i: number) => (
                    <div key={`nerf-${i}`} className="border border-primary/20 bg-primary/[0.03] p-4">
                      <div className="font-mono text-[9px] font-black uppercase tracking-widest text-primary">NERF</div>
                      <p className="mt-1 font-sans text-sm text-foreground"><span className="font-bold">{n.subject}:</span> {n.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50">
                <Link href={`/patch-notes/${latestPatch.slug}`}>
                  <Button variant="secondary" size="sm" className="group gap-2 font-mono text-xs uppercase">
                    Read Full Patch Notes <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </Container>
          </section>
        )}

        {/* ═══════════════════════════════════════════
            7. TACTICAL MAPS
        ═══════════════════════════════════════════ */}
        <section className="border-b border-border bg-[#0B141A] py-20">
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-muted tracking-widest">06 //</span>
                  <span className="w-1.5 h-1.5 bg-primary" aria-hidden="true" />
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan">
                    TACTICAL GEOGRAPHY
                  </span>
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-foreground mt-1">
                  The Maps
                </h2>
              </div>
              <Link href="/maps" className="hidden sm:block font-mono text-xs font-bold uppercase tracking-wider text-primary hover:text-foreground transition-colors">
                All maps →
              </Link>
            </div>
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mapCards.map((map, i) => (
                <MapCard key={map.slug} map={map} size={i === 0 ? "large" : "small"} />
              ))}
            </StaggerContainer>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════
            8. CLOSING CTA
        ═══════════════════════════════════════════ */}
        <section className="border-t border-border bg-[#080F14] py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center space-y-5">
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-primary" aria-hidden="true" />
                <span className="font-mono text-xs text-primary tracking-[0.25em] uppercase font-bold">SYSTEM_READY</span>
              </div>
              <h2 className="font-display font-black text-4xl uppercase tracking-tighter text-foreground sm:text-5xl">
                Make VloPedia Yours.
              </h2>
              <p className="font-sans text-sm leading-relaxed text-secondary">
                Track collections, save wishlists, and plan every competitive queue. Your progress, remembered.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                {user ? (
                  <Link href="/dashboard">
                    <Button variant="primary" size="lg" className="clip-diagonal-sm group gap-2">
                      Open Dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Button>
                  </Link>
                ) : (
                  <Button variant="primary" size="lg" className="clip-diagonal-sm" onClick={signInWithDiscord}>
                    Sign in with Discord
                  </Button>
                )}
                <Link href="/agents">
                  <Button variant="outline" size="lg" className="clip-diagonal-sm border-border text-secondary hover:border-border-light hover:text-foreground">
                    Browse Database
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>

      </div>
    </PageTransition>
  );
}
