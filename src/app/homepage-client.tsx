"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight, Search as SearchIcon, Radio,
  Crosshair, ShieldAlert, BookOpen, Sparkles, Heart, ChevronRight,
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

const TRENDING = ["Jett", "Vandal", "Reaver", "Ascent", "Omen", "Operator"];

const QUICK_LINKS = [
  { href: "/agents",       label: "Roster Agents",      desc: "29 agents" },
  { href: "/weapons",      label: "Arsenal Procurement", desc: "20 weapons" },
  { href: "/maps",         label: "Tactical Maps",       desc: "12 maps"   },
  { href: "/skins",        label: "Weapon Skins",        desc: "1,400+ skins" },
  { href: "/tier-list",    label: "Agent Tier List",     desc: "Meta rankings" },
  { href: "/economy",      label: "Economy Guide",       desc: "Credit strategy" },
  { href: "/matchups",     label: "Agent Matchups",      desc: "Counter picks" },
  { href: "/strat-roulette",label: "Strat Roulette",    desc: "Random missions" },
];

const CAROUSEL_AGENT_NAMES = ["Jett", "Omen", "Iso", "Clove", "Neon"];

interface MapData { slug: string; name: string; location?: string; splashUrl: string; lore?: string; }

export function HomepageClient() {
  const { user, signInWithDiscord } = useAuth();
  const { addWishlistItem, items: wishlistItems } = useUserWishlist();
  const reduce = useReducedMotion();

  const [agentsList, setAgentsList]   = useState<ValorantAgent[]>([]);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [randomSkin, setRandomSkin]   = useState<ValorantSkin | null>(null);
  const [bundle, setBundle] = useState<ValorantBundle | null>(null);
  const [maps,   setMaps]   = useState<MapData[]>([]);

  useEffect(() => {
    fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true")
      .then(r => r.json()).then(j => {
        const agents: ValorantAgent[] = j.data ?? [];
        setAgentsList(agents);
      }).catch(() => {});

    fetch("https://valorant-api.com/v1/bundles")
      .then(r => r.json()).then(j => {
        const bundles: ValorantBundle[] = j.data ?? [];
        if (bundles[0]) setBundle(bundles[0]);
      }).catch(() => {});

    fetch("https://valorant-api.com/v1/maps")
      .then(r => r.json()).then(j => {
        const raw: ValorantMap[] = j.data ?? [];
        setMaps(raw.filter(m => m.splash && m.displayIcon).slice(0, 6).map(m => ({
          slug: m.displayName.toLowerCase().replace(/\s+/g, "-"), name: m.displayName.toUpperCase(),
          location: m.coordinates ?? undefined, splashUrl: m.splash || m.listViewIcon,
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

  const carouselAgents = CAROUSEL_AGENT_NAMES.map(name => {
    const foundApi = agentsList.find(a => a.displayName.toLowerCase() === name.toLowerCase());
    if (foundApi) return foundApi;
    const foundDb = valorantDb.agents.find(a => a.name.toLowerCase() === name.toLowerCase());
    return foundDb ? {
      uuid: foundDb.slug,
      displayName: foundDb.name,
      description: foundDb.bio,
      fullPortrait: foundDb.portrait,
      role: { displayName: foundDb.role },
      backgroundGradientColors: ["FF4655", "000000"]
    } : null;
  }).filter(Boolean) as any[];

  useEffect(() => {
    if (carouselAgents.length <= 1) return;
    const interval = setInterval(() => {
      setCarouselIdx(prev => (prev + 1) % carouselAgents.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [carouselAgents.length]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY   = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.4, 0.92]);

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

  const activeAgent = carouselAgents[carouselIdx] || carouselAgents[0];
  const agentPortrait  = activeAgent?.fullPortrait  ?? "";
  const agentName      = activeAgent?.displayName   ?? "Jett";
  const agentRole      = activeAgent?.role?.displayName ?? "Duelist";
  const agentBio       = activeAgent?.description   ?? "";
  const agentSlug      = agentName.toLowerCase().replace(/\s+/g, "-");
  const agentGrad      = activeAgent?.backgroundGradientColors?.[0];

  const bundleName  = (bundle?.displayName  ?? "Featured Bundle").toUpperCase();
  const bundleImg   = bundle?.verticalPromoImage ?? bundle?.displayIcon ?? "/images/bundle-eviction.webp";
  const bundleSlug  = bundle?.uuid ?? "";
  const bundlePrice = valorantDb.bundles[0]?.price ?? 7100;

  const mapCards = maps.length > 0 ? maps : valorantDb.maps.slice(0, 6).map(m => ({
    slug: m.slug, name: m.name, location: m.location, splashUrl: m.splashUrl, lore: m.lore,
  }));

  const latestPatch   = valorantDb.patches[0];
  const patchMapImage = maps[0]?.splashUrl ?? null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">

        {/* ═══════════════════════════════════════════
            1. HERO
        ═══════════════════════════════════════════ */}
        <section ref={heroRef} className="relative min-h-[92vh] w-full overflow-hidden border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A]">
          <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
            {agentPortrait && (
              <Image src={agentPortrait} alt={agentName} fill priority fetchPriority="high" sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-cover object-top opacity-50" />
            )}
            <motion.div style={{ opacity: overlay }}
              className="absolute inset-0 bg-gradient-to-t from-[#0B141A] via-[#0B141A]/60 to-[#0B141A]/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B141A]/90 via-transparent to-transparent" />
            {agentGrad && (
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-15"
                style={{ background: `radial-gradient(ellipse at 65% 40%, #${agentGrad} 0%, transparent 55%)` }} />
            )}
          </motion.div>

          {/* Tactical grid overlay */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] bg-tactical-grid opacity-30" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] bg-scanner-grid opacity-40" />
          <div aria-hidden="true" className="tactical-scanner" />

          {/* Haikei/Godly-inspired SVG cybernetic background panel */}
          <div aria-hidden="true" className="pointer-events-none absolute right-0 top-0 z-[1] h-full w-1/3 opacity-10 flex items-center justify-end">
            <svg width="400" height="600" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-x-12 scale-110">
              <path d="M50 0 L400 0 L400 550 L350 600 L50 600 L0 550 L0 50 Z" stroke="var(--cyan)" strokeWidth="1.5" strokeDasharray="8 8" />
              <rect x="80" y="80" width="240" height="440" stroke="var(--cyan)" strokeWidth="1" />
              <line x1="0" y1="200" x2="400" y2="200" stroke="var(--cyan)" strokeWidth="0.75" />
              <line x1="0" y1="400" x2="400" y2="400" stroke="var(--cyan)" strokeWidth="0.75" />
              <circle cx="200" cy="300" r="120" stroke="var(--cyan)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="200" cy="300" r="4" fill="var(--cyan)" />
            </svg>
          </div>

          <Container className="relative z-10 flex min-h-[92vh] flex-col justify-end pb-16 pt-28 lg:grid lg:grid-cols-[1.6fr_1fr] lg:items-end lg:gap-16">
            <Reveal className="space-y-6">
              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary animate-pulse" aria-hidden="true" />
                <span className="font-mono text-xs text-primary tracking-[0.25em] uppercase font-bold">
                  SYSTEM_DATABASE // v2.0 ONLINE
                </span>
              </div>

              {/* Main title */}
              <h1 className="font-display font-black text-5xl uppercase leading-none tracking-tighter text-foreground sm:text-7xl lg:text-8xl">
                <span className="text-primary text-glow-red">VALO</span>VAULT
                <span className="mt-3 block font-display text-3xl font-black tracking-tight text-foreground/50 sm:text-4xl lg:text-5xl">
                  Tactical Encyclopedia
                </span>
              </h1>

              <p className="max-w-xl font-sans text-sm leading-relaxed text-muted">
                The definitive VALORANT database — agents, weapons, maps, skins, meta tools, and the intel you need to dominate.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/agents">
                  <Button variant="primary" size="lg" className="clip-diagonal-sm group gap-2">
                    Enter Database
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/search">
                  <Button variant="outline" size="lg" className="clip-diagonal-sm border-[rgba(236,232,225,0.15)] text-muted hover:border-primary/50 hover:text-foreground">
                    Search everything
                  </Button>
                </Link>
              </div>
            </Reveal>

            {/* Command deck card */}
            <Reveal className="mt-10 hidden lg:flex lg:mt-0">
              <div className="relative w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(11,20,26,0.92)] backdrop-blur-xl p-6 clip-diagonal space-y-4">
                <div className="absolute right-0 top-0 bg-primary px-3 py-1 font-mono text-[9px] font-black tracking-wider text-[#0B141A]">
                  COMMAND DECK
                </div>
                <div className="border-b border-[rgba(236,232,225,0.08)] pb-3">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-muted">ACCOUNT STATUS</span>
                  <p className="mt-1 font-display font-black text-base uppercase text-foreground">
                    {user ? (user.displayName ?? user.email) : "Guest Session"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 py-2">
                  <div>
                    <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-muted">SYSTEM</span>
                    <span className="mt-1 flex items-center gap-1.5 font-display font-bold text-success text-sm">
                      <Radio className="h-3 w-3 animate-pulse" aria-hidden="true" /> ONLINE
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-muted">REGION</span>
                    <span className="mt-1 block font-display font-bold text-sm text-foreground">GLOBAL</span>
                  </div>
                </div>
                {user ? (
                  <Link href="/dashboard" className="w-full block">
                    <Button variant="secondary" className="w-full clip-diagonal-sm">Open Dashboard</Button>
                  </Link>
                ) : (
                  <div className="relative group/tooltip w-full">
                    <Button variant="primary" onClick={signInWithDiscord} className="w-full clip-diagonal-sm">
                      Sign in with Discord
                    </Button>
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 scale-95 opacity-0 transition-all duration-200 group-hover/tooltip:scale-100 group-hover/tooltip:opacity-100 bg-[#0D1A22] border border-[rgba(236,232,225,0.15)] px-3 py-2 text-[10px] font-mono text-muted uppercase tracking-wider text-center w-64 clip-diagonal-sm shadow-xl">
                      <span className="text-primary font-bold block mb-1">[ SECURE SYNC BENEFITS ]</span>
                      Save your mains, customize queue prep plans, and track your skins wishlist.
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════
            2. SEARCH
        ═══════════════════════════════════════════ */}
        <section className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] py-12">
          <Container>
            <Reveal>
              <form onSubmit={goSearch} role="search"
                className="flex items-center gap-3 border border-[rgba(236,232,225,0.12)] bg-[rgba(15,28,36,0.8)] p-2.5 transition-colors focus-within:border-primary/60">
                <SearchIcon className="ml-1 h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
                <input type="search" value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search agents, weapons, skins, maps, lore…"
                  aria-label="Search ValoVault"
                  className="w-full bg-transparent font-sans text-sm text-foreground placeholder:text-muted/60 focus:outline-none" />
                <Button type="submit" variant="primary" size="sm" className="clip-diagonal-sm shrink-0">Search</Button>
              </form>

              <div className="mt-4 flex flex-wrap gap-2" aria-label="Trending searches">
                {TRENDING.map(s => (
                  <button key={s} type="button"
                    onClick={() => { setQuery(s); window.location.href = `/search?q=${encodeURIComponent(s)}`; }}
                    className="border border-[rgba(236,232,225,0.1)] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted transition-colors hover:border-primary/50 hover:text-primary">
                    {s}
                  </button>
                ))}
              </div>
            </Reveal>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════
            3. QUICK LINKS DATABASE GRID
        ═══════════════════════════════════════════ */}
        <section className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] py-16">
          <Container>
            <Reveal className="mb-8">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-primary" aria-hidden="true" />
                <span className="font-mono text-xs text-primary tracking-[0.25em] uppercase font-bold">
                  DATABASE_REGISTRY
                </span>
              </div>
              <h2 className="font-display font-black text-4xl uppercase text-foreground mt-2">
                Quick Access
              </h2>
            </Reveal>

            <StaggerContainer className="grid gap-3 grid-cols-2 sm:grid-cols-4">
              {QUICK_LINKS.map(link => (
                <Link key={link.href} href={link.href}
                  className="group relative border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.6)] p-4 clip-diagonal-sm transition-all duration-300 hover:border-cyan/40 hover:bg-cyan/[0.02] hover:shadow-[0_0_15px_rgba(13,242,242,0.08)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#0DF2F2] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  <p className="font-display font-black text-sm uppercase text-foreground group-hover:text-cyan transition-colors leading-tight">
                    {link.label}
                  </p>
                  <p className="font-mono text-[9px] text-muted mt-1 uppercase tracking-wider">{link.desc}</p>
                  <ChevronRight className="absolute right-3 bottom-3 h-3 w-3 text-muted opacity-0 transition-all group-hover:opacity-100 group-hover:text-cyan group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              ))}
            </StaggerContainer>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════
            4. FEATURED AGENT
        ═══════════════════════════════════════════ */}
        <section className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] py-24">
          <Container>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <SectionLabel eyebrow="META OPERATIVES" title="Featured Operatives" />
              {/* Carousel Indicators / Nav */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCarouselIdx(prev => (prev - 1 + carouselAgents.length) % carouselAgents.length)}
                  className="flex h-8 w-8 items-center justify-center border border-[rgba(236,232,225,0.1)] bg-[rgba(15,28,36,0.6)] text-muted hover:border-primary hover:text-primary transition-colors focus:outline-none"
                  aria-label="Previous Agent"
                >
                  &larr;
                </button>
                <div className="flex gap-1.5 px-2">
                  {carouselAgents.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarouselIdx(idx)}
                      className={`h-1.5 transition-all duration-300 ${idx === carouselIdx ? "w-6 bg-primary" : "w-1.5 bg-[rgba(236,232,225,0.2)] hover:bg-primary"}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCarouselIdx(prev => (prev + 1) % carouselAgents.length)}
                  className="flex h-8 w-8 items-center justify-center border border-[rgba(236,232,225,0.1)] bg-[rgba(15,28,36,0.6)] text-muted hover:border-primary hover:text-primary transition-colors focus:outline-none"
                  aria-label="Next Agent"
                >
                  &rarr;
                </button>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center min-h-[480px]">
              {/* Portrait */}
              <Reveal key={`portrait-${carouselIdx}`}>
                <div className="relative overflow-hidden border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] clip-diagonal" style={{ aspectRatio: "4/5" }}>
                  <div aria-hidden="true" className="absolute left-0 top-0 z-10 h-[2px] w-12 bg-primary" />
                  {agentGrad && (
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25"
                      style={{ background: `radial-gradient(ellipse at 50% 100%, #${agentGrad} 0%, transparent 65%)` }} />
                  )}
                  {agentPortrait && (
                    <Image src={agentPortrait} alt={agentName} fill
                      sizes="(max-width:1024px) 100vw, 45vw"
                      className="object-contain object-top p-6 transition-transform duration-700 hover:scale-[1.03]" />
                  )}
                </div>
              </Reveal>

              {/* Info */}
              <Reveal key={`info-${carouselIdx}`} className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display font-black text-5xl uppercase tracking-tighter text-foreground">{agentName}</h2>
                  <RoleBadge role={agentRole} />
                </div>
                <p className="max-w-xl font-sans text-sm leading-relaxed text-muted">{agentBio}</p>
                <Link href={`/agents/${agentSlug}`}>
                  <Button variant="primary" className="clip-diagonal-sm group gap-2">
                    View Full Profile
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Button>
                </Link>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ═══════════════════════════════════════════
            5.B COSMETIC SPOTLIGHT (SKIN OF THE DAY)
        ═══════════════════════════════════════════ */}
        {randomSkin && (
          <section className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] py-24">
            <Container>
              <Reveal className="mb-10">
                <SectionLabel eyebrow="COSMETIC SPOTLIGHT" title="Skin of the Day" />
              </Reveal>
              <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
                {/* Details */}
                <Reveal className="space-y-6">
                  <h2 className="font-display font-black text-4xl uppercase tracking-tighter text-foreground">
                    {randomSkin.displayName}
                  </h2>
                  <p className="max-w-xl font-sans text-sm leading-relaxed text-muted">
                    Browse upgrade paths, custom variants, and inspect high-definition reloading and execution videos for this tactical cosmetic.
                  </p>
                  
                  {/* Price & Rarity */}
                  {(() => {
                    const tier = CONTENT_TIER_MAP[randomSkin.contentTierUuid ?? ""] || DEFAULT_TIER;
                    return (
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.6)] px-3 py-1.5">
                          <Image src={tier.iconUrl} alt={tier.rarity} width={16} height={16} className="object-contain" />
                          <span className="font-mono text-xs font-black uppercase tracking-wider" style={{ color: tier.color }}>
                            {tier.rarity} TIER
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1.5 font-mono">
                          <span className="text-2xl font-black text-white">{tier.price.toLocaleString()}</span>
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
                    <Link href={`/skins/${randomSkin.uuid}`}>
                      <Button variant="outline" className="clip-diagonal-sm border-[rgba(236,232,225,0.15)] group gap-2">
                        Inspect Skin <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </Button>
                    </Link>
                  </div>
                </Reveal>

                {/* Visual */}
                <Reveal>
                  <div className="relative overflow-hidden border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] clip-diagonal flex items-center justify-center p-8" style={{ aspectRatio: "16/10" }}>
                    <div aria-hidden="true" className="absolute left-0 top-0 z-10 h-[2px] w-12 bg-primary" />
                    {randomSkin.displayIcon && (
                      <Image
                        src={randomSkin.displayIcon}
                        alt={randomSkin.displayName}
                        fill
                        sizes="(max-width:1024px) 100vw, 45vw"
                        className="object-contain p-8 transition-transform duration-700 hover:scale-[1.05]"
                      />
                    )}
                  </div>
                </Reveal>
              </div>
            </Container>
          </section>
        )}

        {/* ═══════════════════════════════════════════
            6. LATEST PATCH
        ═══════════════════════════════════════════ */}
        {latestPatch && (
          <section className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] py-24">
            <Container>
              <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <SectionLabel eyebrow="LATEST DEPLOYMENT" title={`Patch ${latestPatch.version}`} />
                <div className="flex items-center gap-1.5 border border-success/30 bg-success/5 px-2.5 py-1 font-mono text-[9px] font-black uppercase tracking-wider text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  DATABASE SYNCED: {latestPatch.date}
                </div>
              </Reveal>
              <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
                {patchMapImage && (
                  <Reveal>
                    <div className="relative overflow-hidden border border-[rgba(236,232,225,0.08)] clip-diagonal" style={{ aspectRatio: "16/10" }}>
                      <Image src={patchMapImage} alt={`Patch ${latestPatch.version}`} fill
                        sizes="(max-width:1024px) 100vw, 45vw" className="object-cover opacity-70" />
                    </div>
                  </Reveal>
                )}
                <Reveal className="space-y-4">
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">{latestPatch.date}</p>
                  <div className="space-y-3">
                    {latestPatch.buffs.map((b: any, i: number) => (
                      <div key={`buff-${i}`} className="border border-success/20 bg-[rgba(34,197,94,0.05)] p-4 clip-diagonal-sm">
                        <div className="font-mono text-[9px] font-black uppercase tracking-widest text-success">BUFF</div>
                        <p className="mt-1 font-sans text-sm text-foreground"><span className="font-bold">{b.subject}:</span> {b.detail}</p>
                      </div>
                    ))}
                    {latestPatch.nerfs.map((n: any, i: number) => (
                      <div key={`nerf-${i}`} className="border border-primary/20 bg-primary/5 p-4 clip-diagonal-sm">
                        <div className="font-mono text-[9px] font-black uppercase tracking-widest text-primary">NERF</div>
                        <p className="mt-1 font-sans text-sm text-foreground"><span className="font-bold">{n.subject}:</span> {n.detail}</p>
                      </div>
                    ))}
                  </div>
                  <Link href={`/patch-notes/${latestPatch.slug}`}>
                    <Button variant="secondary" className="clip-diagonal-sm group gap-2">
                      Read Patch Notes <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Button>
                  </Link>
                </Reveal>
              </div>
            </Container>
          </section>
        )}

        {/* ═══════════════════════════════════════════
            7. MAPS GRID
        ═══════════════════════════════════════════ */}
        <section className="border-b border-[rgba(236,232,225,0.08)] bg-[#0F1C24] py-24">
          <Container>
            <Reveal className="mb-10 flex items-end justify-between gap-4">
              <SectionLabel eyebrow="TACTICAL BLUEPRINTS" title="The Maps" />
              <Link href="/maps" className="hidden sm:block font-mono text-xs font-bold uppercase tracking-wider text-primary hover:text-foreground transition-colors">
                All maps →
              </Link>
            </Reveal>
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
        <section className="border-t border-[rgba(236,232,225,0.08)] bg-[#0B141A] py-24">
          <Container>
            <Reveal className="mx-auto max-w-2xl text-center space-y-5">
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-primary animate-pulse" aria-hidden="true" />
                <span className="font-mono text-xs text-primary tracking-[0.25em] uppercase font-bold">SYSTEM_READY</span>
              </div>
              <h2 className="font-display font-black text-4xl uppercase tracking-tighter text-foreground sm:text-5xl">
                Make ValoVault yours.
              </h2>
              <p className="font-sans text-sm leading-relaxed text-muted">
                Track collections, save wishlists, and plan every queue. Your progress, remembered.
              </p>
              <div className="flex justify-center gap-3">
                {user ? (
                  <Link href="/dashboard">
                    <Button variant="primary" size="lg" className="clip-diagonal-sm group gap-2">
                      Open Dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Button>
                  </Link>
                ) : (
                  <div className="relative group/tooltip">
                    <Button variant="primary" size="lg" className="clip-diagonal-sm" onClick={signInWithDiscord}>
                      Sign in with Discord
                    </Button>
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 scale-95 opacity-0 transition-all duration-200 group-hover/tooltip:scale-100 group-hover/tooltip:opacity-100 bg-[#0D1A22] border border-[rgba(236,232,225,0.15)] px-3 py-2 text-[10px] font-mono text-muted uppercase tracking-wider text-center w-64 clip-diagonal-sm shadow-xl">
                      <span className="text-primary font-bold block mb-1">[ SECURE SYNC BENEFITS ]</span>
                      Save your mains, customize queue prep plans, and track your skins wishlist.
                    </div>
                  </div>
                )}
                <Link href="/agents">
                  <Button variant="outline" size="lg" className="clip-diagonal-sm border-[rgba(236,232,225,0.15)] text-muted hover:border-primary/50 hover:text-foreground">
                    Browse Database
                  </Button>
                </Link>
              </div>
            </Reveal>
          </Container>
        </section>

      </div>
    </PageTransition>
  );
}

/* ── Local helper ── */
function SectionLabel({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-[#0DF2F2]" aria-hidden="true" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#0DF2F2]">
          {eyebrow}
        </span>
      </div>
      <h2 className="font-display font-black text-4xl uppercase tracking-tighter text-foreground">{title}</h2>
    </div>
  );
}
