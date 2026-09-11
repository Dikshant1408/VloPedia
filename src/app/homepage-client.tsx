"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight, Search as SearchIcon,
  Heart, Crosshair
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useUserWishlist } from "@/hooks/use-user-wishlist";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { Reveal, StaggerContainer, PageTransition } from "@/components/motion-system";
import { MapCard } from "@/components/map-card";
import { valorantDb } from "@/lib/valorant-db";
import { CONTENT_TIER_MAP, DEFAULT_TIER } from "@/lib/valorant-types";
import type { ValorantAgent, ValorantMap, ValorantSkin } from "@/lib/valorant-types";

import { HomeWorld, type HomeWorldCategory } from "@/components/3d/home-world";

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
  },
];

const DIRECTORY_ITEMS = [
  { title: "Agents", href: "/agents", desc: "Abilities, stats, role synergies & counters", count: "26 Agents" },
  { title: "Weapons", href: "/weapons", desc: "Ballistics, spray patterns & damage charts", count: "18 Weapons" },
  { title: "Maps", href: "/maps", desc: "Interactive 3D radar, callouts & plant executes", count: "11 Maps" },
  { title: "Skins", href: "/skins", desc: "1,400+ skins, chromas, tiers & audio clips", count: "1,400+ Skins" },
  { title: "Bundles", href: "/bundles", desc: "Complete skin sets and store history", count: "Bundle Archive" },
  { title: "Comp Builder", href: "/comp-builder", desc: "Simulate and optimize team agent synergies", count: "Interactive Tool" },
  { title: "Guides", href: "/guides", desc: "Agent masterclasses and crosshair placement", count: "Tutorials" },
  { title: "Lore", href: "/lore", desc: "First Light canon, Kingdom Corp & Earth-Omega", count: "Story Timeline" },
];

export function HomepageClient() {
  const { user, signInWithDiscord } = useAuth();
  const { addWishlistItem, items: wishlistItems } = useUserWishlist();
  const reduce = useReducedMotion();

  const [randomSkin, setRandomSkin]   = useState<ValorantSkin | null>(null);
  const [maps, setMaps]               = useState<any[]>([]);
  const [selectedMetaAgent, setSelectedMetaAgent] = useState(META_AGENTS[0]);
  const [activeCategory, setActiveCategory] = useState<HomeWorldCategory>("idle");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetch("https://valorant-api.com/v1/maps")
      .then(r => r.json()).then(j => {
        const raw: ValorantMap[] = j.data ?? [];
        setMaps(raw.filter(m => m.splash && m.displayIcon).slice(0, 6).map(m => ({
          slug: m.displayName.toLowerCase().replace(/\s+/g, "-"),
          name: m.displayName,
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
      toast.info("Sign in to save items", { action: { label: "Sign In", onClick: signInWithDiscord } });
      return;
    }
    if (wishlistItems.some(w => w.title === title)) { toast.info(`Already saved to wishlist`); return; }
    try {
      await addWishlistItem({ title, category: type });
      toast.success(`Added "${title}" to your wishlist`);
    } catch { toast.error("Could not save item"); }
  };

  const mapCards = maps.length > 0 ? maps : valorantDb.maps.slice(0, 6).map(m => ({
    slug: m.slug, name: m.name, location: m.location, splashUrl: m.splashUrl, lore: m.lore,
  }));

  const latestPatch = valorantDb.patches[0];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">

        {/* ═══════════════════════════════════════════
            1. FULL-BLEED CINEMATIC HERO: "THE VALORANT WORLD IS ALIVE"
        ═══════════════════════════════════════════ */}
        <section ref={heroRef} className="relative min-h-[92vh] w-full overflow-hidden border-b border-border bg-background flex flex-col justify-between items-center text-center pt-16 sm:pt-20 pb-8">
          {/* Full-bleed 3D Cinematic Scene Layer */}
          <HomeWorld
            activeCategory={activeCategory}
            isSearching={isSearching}
          />

          {/* Top spacer */}
          <div className="w-full" />

          {/* Centered Monumental Editorial Content */}
          <Container className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center">
            <Reveal className="space-y-6 w-full flex flex-col items-center">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-card/85 px-4 py-1.5 text-xs font-sans font-medium text-secondary shadow-xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
                <span>VALORANT Community Knowledge Base</span>
              </div>

              {/* Monumental Headline */}
              <div className="space-y-1">
                <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-foreground uppercase leading-[0.94] drop-shadow-sm">
                  VLOPEDIA<br />
                  <span className="text-secondary/85 text-3xl sm:text-4xl md:text-5xl lg:text-6xl block mt-2 font-bold tracking-tight">
                    THE VALORANT
                  </span>
                  <span className="text-primary block mt-1">
                    KNOWLEDGE BASE
                  </span>
                </h1>
                <p className="font-sans text-base sm:text-lg text-secondary max-w-xl mx-auto font-normal pt-3 leading-relaxed">
                  Search agents, weapons, maps, skins, and guides across the authoritative VALORANT database.
                </p>
              </div>

              {/* Centered Search Bar with Focus Reactivity */}
              <div className="pt-2 max-w-2xl w-full mx-auto">
                <form
                  onSubmit={goSearch}
                  role="search"
                  className={`relative flex items-center rounded-xl border bg-surface-card/90 backdrop-blur-md shadow-md transition-all duration-200 ${
                    isSearching
                      ? "border-primary ring-2 ring-primary/25 bg-surface-card"
                      : "border-border hover:border-border-light focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25"
                  }`}
                >
                  <SearchIcon className="ml-4 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setIsSearching(e.target.value.length > 0);
                    }}
                    onFocus={() => setIsSearching(true)}
                    onBlur={() => setIsSearching(query.length > 0)}
                    placeholder="Search agents, weapons, skins, maps..."
                    aria-label="Search VloPedia"
                    className="w-full bg-transparent px-4 py-3.5 font-sans text-sm sm:text-base text-foreground placeholder:text-muted focus:outline-none"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="shrink-0 mr-2.5 rounded-lg font-sans text-sm font-medium px-4"
                  >
                    Search
                  </Button>
                </form>

                {/* Category Chips with Hover Interactivity to 3D World */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-4 font-sans text-xs">
                  {[
                    { label: "Agents", href: "/agents", cat: "agents" as const },
                    { label: "Weapons", href: "/weapons", cat: "weapons" as const },
                    { label: "Maps", href: "/maps", cat: "maps" as const },
                    { label: "Skins", href: "/skins", cat: "skins" as const },
                    { label: "Guides", href: "/guides", cat: "idle" as const },
                    { label: "Comp Builder", href: "/comp-builder", cat: "idle" as const },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onMouseEnter={() => setActiveCategory(item.cat)}
                      onMouseLeave={() => setActiveCategory("idle")}
                      onFocus={() => setActiveCategory(item.cat)}
                      onBlur={() => setActiveCategory("idle")}
                      className={`rounded-lg border px-3.5 py-1.5 text-secondary transition-all shadow-2xs font-medium backdrop-blur-xs ${
                        activeCategory === item.cat
                          ? "border-primary bg-primary/15 text-foreground font-semibold"
                          : "border-border/80 bg-surface-card/75 hover:text-foreground hover:border-border-light hover:bg-surface-elevated"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          </Container>

          {/* Bottom Animated Scroll Cue */}
          <div className="relative z-10 pt-6">
            <a
              href="#latest"
              className="group inline-flex flex-col items-center gap-1.5 font-mono text-[11px] text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <span className="tracking-wider uppercase">Scroll to explore</span>
              <span className="text-primary font-bold text-sm transition-transform group-hover:translate-y-1">↓</span>
            </a>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            2. THE LATEST (VALORANT UPDATES & SPOTLIGHT)
        ═══════════════════════════════════════════ */}
        <section id="latest" className="border-b border-border bg-background py-16 scroll-mt-12">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] items-stretch">
              {/* Featured Item */}
              <div className="flex flex-col justify-between rounded-lg border border-border bg-surface-card p-6 sm:p-8 shadow-xs">
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                    <span className="font-sans text-xs font-semibold uppercase tracking-wider text-primary">
                      Featured Skin
                    </span>
                    <span className="font-mono text-xs text-muted">Daily Spotlight</span>
                  </div>

                  {randomSkin ? (
                    <div className="space-y-4">
                      <div className="relative aspect-[16/10] w-full rounded-md border border-border/70 bg-surface-muted flex items-center justify-center overflow-hidden p-6">
                        {randomSkin.displayIcon && (
                          <Image
                            src={randomSkin.displayIcon}
                            alt={randomSkin.displayName}
                            fill
                            sizes="(max-width: 1024px) 100vw, 500px"
                            className="object-contain p-4 transition-transform duration-500 hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="space-y-1.5 pt-2">
                        <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-foreground">
                          {randomSkin.displayName}
                        </h3>
                        <p className="font-sans text-xs text-secondary leading-relaxed line-clamp-2">
                          Explore full upgrade animations, custom sound effects, and chroma colorways for the {randomSkin.displayName}.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted">Loading featured skin...</div>
                  )}
                </div>

                {randomSkin && (
                  <div className="pt-6 mt-6 border-t border-border flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-xl font-bold text-foreground">
                        {(CONTENT_TIER_MAP[randomSkin.contentTierUuid ?? ""] || DEFAULT_TIER).price.toLocaleString()}
                      </span>
                      <span className="text-xs text-primary font-semibold">VP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWishlist(randomSkin.displayName, "skin")}
                        className="gap-1.5 text-xs"
                      >
                        <Heart className="h-3.5 w-3.5" /> Save
                      </Button>
                      <Link href={`/skins/${slugify(randomSkin.displayName) || randomSkin.uuid}`}>
                        <Button variant="primary" size="sm" className="gap-1 text-xs">
                          Inspect Skin <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Latest Updates & News List */}
              <div className="flex flex-col justify-between rounded-lg border border-border bg-surface-card p-6 sm:p-8 shadow-xs">
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                    <span className="font-sans text-xs font-semibold uppercase tracking-wider text-secondary">
                      Latest Updates
                    </span>
                    <Link href="/patch-notes" className="font-sans text-xs text-primary hover:underline">
                      All patch notes →
                    </Link>
                  </div>

                  <div className="divide-y divide-border/60">
                    {/* Patch Note Item */}
                    {latestPatch && (
                      <div className="py-3.5 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-primary/10 border border-primary/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-primary">
                            Patch {latestPatch.version}
                          </span>
                          <span className="font-mono text-[10px] text-muted">{latestPatch.date}</span>
                        </div>
                        <Link
                          href={`/patch-notes/${latestPatch.slug}`}
                          className="font-sans text-sm font-semibold text-foreground hover:text-primary transition-colors block"
                        >
                          Competitive Balance & Agent Adjustments
                        </Link>
                        <p className="font-sans text-xs text-secondary line-clamp-2">
                          {latestPatch.buffs.length} buffs and {latestPatch.nerfs.length} nerfs active in the current tournament pool.
                        </p>
                      </div>
                    )}

                    {/* Meta Update Item */}
                    <div className="py-3.5 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                          Meta
                        </span>
                        <span className="font-mono text-[10px] text-muted">Ascent Pool</span>
                      </div>
                      <Link
                        href="/comp-builder?map=ascent&agents=jett,omen,sova,killjoy,kayo"
                        className="font-sans text-sm font-semibold text-foreground hover:text-primary transition-colors block"
                      >
                        Ascent S-Tier Standard Composition
                      </Link>
                      <p className="font-sans text-xs text-secondary">
                        Jett, Omen, Sova, Killjoy, and KAY/O maintain an 88/100 team synergy index.
                      </p>
                    </div>

                    {/* Skin Catalog Item */}
                    <div className="py-3.5 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-surface-muted border border-border px-1.5 py-0.5 font-mono text-[10px] font-semibold text-secondary">
                          Database
                        </span>
                        <span className="font-mono text-[10px] text-muted">Cosmetics</span>
                      </div>
                      <Link
                        href="/skins"
                        className="font-sans text-sm font-semibold text-foreground hover:text-primary transition-colors block"
                      >
                        1,400+ Skins & Chroma Variants Cataloged
                      </Link>
                      <p className="font-sans text-xs text-secondary">
                        Browse tier prices, in-game audio previews, and inspection videos.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <Link href="/guides" className="text-xs font-semibold text-secondary hover:text-foreground">
                    Browse Guides & Tutorials →
                  </Link>
                  <Link href="/sensitivity" className="text-xs font-semibold text-secondary hover:text-foreground">
                    Sens Converter →
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════
            3. EXPLORE VLOPEDIA (EDITORIAL DIRECTORY)
        ═══════════════════════════════════════════ */}
        <section className="border-b border-border bg-background py-16">
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-foreground">
                  Explore VloPedia
                </h2>
                <p className="font-sans text-xs sm:text-sm text-secondary mt-1">
                  Comprehensive databases, game mechanics, and competitive tools.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {DIRECTORY_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-lg border border-border bg-surface-card p-5 hover:border-border-light hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <ArrowRight className="h-4 w-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="font-sans text-xs text-secondary leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-muted pt-4 block font-medium">
                    {item.count}
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════
            4. AGENTS DOMINATING THIS PATCH
        ═══════════════════════════════════════════ */}
        <section className="border-b border-border bg-background py-16">
          <Container>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div className="space-y-1.5">
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-primary">
                  Operatives
                </span>
                <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-foreground">
                  Your Agents
                </h2>
                <p className="font-sans text-sm text-secondary max-w-xl">
                  Inspect competitive efficiency, entry aggression, and map mastery ratings before queuing.
                </p>
              </div>

              <Link
                href="/agents"
                className="font-sans text-xs font-semibold text-primary hover:underline transition-colors flex items-center gap-1 shrink-0"
              >
                View all agents →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {META_AGENTS.map((agent) => {
                const isSelected = selectedMetaAgent.slug === agent.slug;
                return (
                  <div
                    key={agent.slug}
                    onMouseEnter={() => setSelectedMetaAgent(agent)}
                    className={`group relative rounded-lg border bg-surface-card p-5 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-primary shadow-sm"
                        : "border-border hover:border-border-light hover:bg-surface-elevated"
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
                      <div className="h-6 w-6 rounded border border-border bg-surface flex items-center justify-center font-mono text-[10px] font-bold text-secondary">
                        {agent.name.slice(0, 2).toUpperCase()}
                      </div>
                    </div>

                    <div className="my-3.5 h-px w-full bg-border/60" />

                    {/* Stats Metrics */}
                    <div className="space-y-2 font-mono text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted">Entry</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${agent.entry}%` }} />
                          </div>
                          <span className="font-bold text-foreground w-6 text-right">{agent.entry}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted">Mobility</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
                            <div className="h-full bg-secondary" style={{ width: `${agent.mobility}%` }} />
                          </div>
                          <span className="font-bold text-foreground w-6 text-right">{agent.mobility}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted">Info</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
                            <div className="h-full bg-amber-400" style={{ width: `${agent.info}%` }} />
                          </div>
                          <span className="font-bold text-foreground w-6 text-right">{agent.info}</span>
                        </div>
                      </div>
                    </div>

                    {/* Best Maps List */}
                    <div className="mt-4 pt-3 border-t border-border/40 font-mono text-[10px]">
                      <span className="text-muted uppercase tracking-wider block mb-1">Best Maps:</span>
                      <div className="flex flex-wrap gap-1">
                        {agent.bestMaps.map((map) => (
                          <span key={map} className="rounded border border-border bg-surface px-1.5 py-0.5 text-secondary">
                            {map}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      href={`/agents/${agent.slug}`}
                      className="mt-4 flex items-center justify-between rounded border border-border bg-surface-muted px-3 py-1.5 font-sans text-xs font-medium text-secondary group-hover:border-primary/60 group-hover:text-primary transition-colors"
                    >
                      <span>View Agent Profile</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════
            5. YOUR WEAPONS (RIFLE BALLISTICS)
        ═══════════════════════════════════════════ */}
        <section className="border-b border-border bg-background py-16">
          <Container>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div className="space-y-1.5">
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-primary">
                  Arsenal
                </span>
                <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-foreground">
                  Your Weapons
                </h2>
                <p className="font-sans text-sm text-secondary max-w-xl">
                  Head-to-head ballistic specs for competitive decision-making.
                </p>
              </div>

              <Link
                href="/compare"
                className="font-sans text-xs font-semibold text-primary hover:underline transition-colors flex items-center gap-1 shrink-0"
              >
                Compare all weapons →
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              {/* Head to Head Rifles Table */}
              <div className="rounded-lg border border-border bg-surface-card p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                  <span className="font-sans text-sm font-semibold text-foreground">
                    Ballistic Comparison (Patch 9.04)
                  </span>
                  <span className="font-mono text-xs text-muted">Primary Rifles</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted text-[10px] uppercase">
                        <th className="py-2 pr-4 font-semibold">Specification</th>
                        <th className="py-2 px-4 text-primary font-bold">Vandal</th>
                        <th className="py-2 px-4 text-foreground font-bold">Phantom</th>
                        <th className="py-2 pl-4 text-right font-semibold">Advantage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      <tr>
                        <td className="py-2.5 pr-4 text-secondary">Headshot Damage</td>
                        <td className="py-2.5 px-4 font-bold text-foreground">160 (All ranges)</td>
                        <td className="py-2.5 px-4 text-secondary">156 (0-15m) / 140 (15-30m)</td>
                        <td className="py-2.5 pl-4 text-right text-primary font-bold">Vandal (1-tap always)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 text-secondary">Fire Rate</td>
                        <td className="py-2.5 px-4 text-secondary">9.75 rds/sec</td>
                        <td className="py-2.5 px-4 font-bold text-foreground">11.0 rds/sec</td>
                        <td className="py-2.5 pl-4 text-right text-foreground font-bold">Phantom (+12.8%)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 text-secondary">Magazine Capacity</td>
                        <td className="py-2.5 px-4 text-secondary">25 rounds</td>
                        <td className="py-2.5 px-4 font-bold text-foreground">30 rounds</td>
                        <td className="py-2.5 pl-4 text-right text-foreground font-bold">Phantom (+5 rds)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 text-secondary">First-Bullet Spread</td>
                        <td className="py-2.5 px-4 text-secondary">0.25 deg</td>
                        <td className="py-2.5 px-4 font-bold text-foreground">0.20 deg</td>
                        <td className="py-2.5 pl-4 text-right text-foreground font-bold">Phantom (Tighter)</td>
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

                <div className="mt-5 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-secondary text-xs">Summary: Vandal dominates long duels; Phantom dominates close trades & controller smokes.</span>
                  <Link href="/compare?w1=vandal&w2=phantom">
                    <Button variant="outline" size="sm" className="rounded-md text-xs">
                      Full Comparison Matrix →
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Economy Insight Panel */}
              <div className="rounded-lg border border-border bg-surface-card p-6 flex flex-col justify-between space-y-4 shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Crosshair className="h-4 w-4 text-primary" />
                    <span className="font-sans text-sm font-bold text-foreground">
                      Buy Economics
                    </span>
                  </div>
                  <p className="font-sans text-xs text-secondary leading-relaxed">
                    Both rifles cost exactly 2,900 Creds. Full buy threshold is 3,900 Creds (with Heavy Shields) or 4,300 Creds with signature utility.
                  </p>
                  <div className="space-y-2 pt-1 font-mono text-xs">
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
                  <Button variant="secondary" size="sm" className="w-full rounded-md font-sans text-xs">
                    View Economy Guide
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════
            6. YOUR MAPS
        ═══════════════════════════════════════════ */}
        <section className="border-b border-border bg-background py-16">
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-primary">
                  Geography
                </span>
                <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-foreground mt-1">
                  Your Maps
                </h2>
              </div>
              <Link href="/maps" className="hidden sm:block font-sans text-xs font-semibold text-primary hover:underline transition-colors">
                View all maps →
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
            7. CLOSING COMMUNITY CTA
        ═══════════════════════════════════════════ */}
        <section className="border-t border-border bg-surface-card py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-secondary shadow-xs">
                <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
                <span>Your VALORANT Notebook</span>
              </div>
              <h2 className="font-display font-black text-4xl uppercase tracking-tight text-foreground sm:text-5xl">
                Make VloPedia Yours.
              </h2>
              <p className="font-sans text-sm leading-relaxed text-secondary">
                Track collections, save wishlists, and plan every competitive queue.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                {user ? (
                  <Link href="/dashboard">
                    <Button variant="primary" size="lg" className="rounded-md gap-2 font-sans font-medium text-sm">
                      Open Dashboard <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                ) : (
                  <Button variant="primary" size="lg" className="rounded-md font-sans font-medium text-sm" onClick={signInWithDiscord}>
                    Sign in with Discord
                  </Button>
                )}
                <Link href="/agents">
                  <Button variant="outline" size="lg" className="rounded-md font-sans font-medium text-sm">
                    Browse Agents
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
