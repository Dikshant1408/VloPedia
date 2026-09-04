"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Filter, ArrowUpDown, Shield, Search, Flame } from "lucide-react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkinCard } from "@/components/skin-card";
import { PageTransition, Reveal } from "@/components/motion-system";
import type { ValorantSkin } from "@/lib/valorant-types";
import { CONTENT_TIER_MAP } from "@/lib/valorant-types";

interface WeaponSkinHubProps {
  weaponSlug: string;
  weaponName: string;
  skins: ValorantSkin[];
}

export function WeaponSkinHub({ weaponSlug, weaponName, skins }: WeaponSkinHubProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("ALL");
  const [onlyFinishers, setOnlyFinishers] = useState(false);
  const [sortBy, setSortBy] = useState<"price-desc" | "price-asc" | "name">("price-desc");

  // Calculate statistics
  const totalSkins = skins.length;
  const skinsWithVideo = skins.filter((s) =>
    s.levels?.some((l) => l.streamedVideo) || s.chromas?.some((c) => c.streamedVideo)
  ).length;

  const prices = skins
    .map((s) => CONTENT_TIER_MAP[s.contentTierUuid ?? ""]?.price ?? 1775)
    .filter(Boolean);
  const minPrice = prices.length ? Math.min(...prices) : 875;
  const maxPrice = prices.length ? Math.max(...prices) : 2475;

  const filteredSkins = useMemo(() => {
    return skins
      .filter((s) => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (!s.displayName.toLowerCase().includes(q)) return false;
        }
        if (selectedTier !== "ALL") {
          const tier = CONTENT_TIER_MAP[s.contentTierUuid ?? ""]?.rarity || "PREMIUM";
          if (tier.toUpperCase() !== selectedTier.toUpperCase()) return false;
        }
        if (onlyFinishers) {
          const hasVideo = s.levels?.some((l) => l.streamedVideo);
          if (!hasVideo) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = CONTENT_TIER_MAP[a.contentTierUuid ?? ""]?.price ?? 1775;
        const priceB = CONTENT_TIER_MAP[b.contentTierUuid ?? ""]?.price ?? 1775;
        if (sortBy === "price-desc") return priceB - priceA;
        if (sortBy === "price-asc") return priceA - priceB;
        return a.displayName.localeCompare(b.displayName);
      });
  }, [skins, searchQuery, selectedTier, onlyFinishers, sortBy]);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Skins", href: "/skins" },
    { label: `${weaponName} Skins` },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        {/* Header Strip */}
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-8 pb-10">
          <Container>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <Breadcrumbs items={breadcrumbs} />
              <div className="flex items-center gap-2">
                <Link
                  href={`/weapons/${weaponSlug}`}
                  className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-[rgba(236,232,225,0.12)] bg-[#0D1820] text-muted hover:text-white hover:border-primary/40 transition-colors"
                >
                  View {weaponName} Weapon Stats →
                </Link>
                {weaponSlug === "vandal" && (
                  <Link
                    href="/compare/weapons/vandal-vs-phantom"
                    className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    Vandal vs Phantom Duel ↗
                  </Link>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-[2px] w-8 bg-primary" />
                  <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                    WEAPON SKIN DIRECTORY
                  </span>
                </div>
                <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white">
                  Best {weaponName} Skins in VALORANT
                </h1>
                <p className="text-sm text-muted max-w-2xl font-sans leading-relaxed">
                  Explore all {totalSkins} official {weaponName} cosmetic skins. Compare in-game store VP pricing,
                  inspect finisher animations, Radianite upgrades, and chroma colorways.
                </p>
              </div>

              {/* Quick Metrics Bar */}
              <div className="flex flex-wrap gap-4 border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-4 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-muted block uppercase">TOTAL SKINS</span>
                  <span className="text-lg font-bold text-white">{totalSkins}</span>
                </div>
                <div className="h-8 w-[1px] bg-[rgba(236,232,225,0.08)] my-auto" />
                <div>
                  <span className="text-[10px] text-muted block uppercase">PRICE SPECTRUM</span>
                  <span className="text-lg font-bold text-primary">
                    {minPrice.toLocaleString()} – {maxPrice.toLocaleString()} VP
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-[rgba(236,232,225,0.08)] my-auto" />
                <div>
                  <span className="text-[10px] text-muted block uppercase">VFX & FINISHERS</span>
                  <span className="text-lg font-bold text-[#0DF2F2]">{skinsWithVideo} SKINS</span>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* Catalog Section */}
        <Container className="py-10 space-y-8">
          {/* Controls bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-4">
            <div className="relative min-w-[240px] flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder={`Search ${weaponName} skins...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 h-9 bg-[#08111A] border border-[rgba(236,232,225,0.1)] text-xs font-mono text-white placeholder:text-muted focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 font-mono text-xs">
                {["ALL", "EXCLUSIVE", "ULTRA", "PREMIUM", "DELUXE", "SELECT"].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-2.5 py-1 text-[10px] font-bold border transition-colors cursor-pointer ${
                      selectedTier === tier
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-[rgba(236,232,225,0.08)] bg-[#08111A] text-muted hover:text-white"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setOnlyFinishers(!onlyFinishers)}
                className={`px-3 py-1 text-[10px] font-bold border transition-colors cursor-pointer flex items-center gap-1.5 font-mono ${
                  onlyFinishers
                    ? "border-[#0DF2F2] bg-[#0DF2F2]/20 text-[#0DF2F2]"
                    : "border-[rgba(236,232,225,0.08)] bg-[#08111A] text-muted hover:text-white"
                }`}
              >
                <Sparkles className="h-3 w-3" />
                <span>FINISHERS ONLY</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-7 bg-[#08111A] border border-[rgba(236,232,225,0.1)] text-muted text-[10px] font-mono px-2"
              >
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Skin Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredSkins.map((skin) => (
              <SkinCard key={skin.uuid} skin={skin} />
            ))}
          </div>

          {filteredSkins.length === 0 && (
            <div className="text-center py-16 border border-dashed border-[rgba(236,232,225,0.1)] p-8">
              <p className="text-sm font-mono text-muted">No {weaponName} skins match your current filter parameters.</p>
            </div>
          )}

          {/* Weapon Skin FAQs */}
          <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 space-y-6">
            <h3 className="font-display font-black text-xl uppercase text-white border-b border-[rgba(236,232,225,0.08)] pb-3">
              Frequently Asked Questions About {weaponName} Skins
            </h3>
            <div className="grid gap-4 md:grid-cols-2 font-sans text-xs text-muted leading-relaxed">
              <div className="space-y-1 bg-[#08111A] p-4 border border-[rgba(236,232,225,0.04)]">
                <h4 className="font-bold text-white text-sm">How much do {weaponName} skins cost in VALORANT?</h4>
                <p>
                  {weaponName} skins typically range from {minPrice.toLocaleString()} VP for Select Edition skins up to{" "}
                  {maxPrice.toLocaleString()} VP for Ultra/Exclusive tier releases.
                </p>
              </div>
              <div className="space-y-1 bg-[#08111A] p-4 border border-[rgba(236,232,225,0.04)]">
                <h4 className="font-bold text-white text-sm">Which {weaponName} skins have custom finishers?</h4>
                <p>
                  Skins belonging to Premium, Ultra, and Exclusive editions feature unlockable finisher animations and
                  custom audio cues using Radianite Points (RP).
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </PageTransition>
  );
}
