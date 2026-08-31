"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Container } from "@/components/container";
import { SkinCard } from "@/components/skin-card";
import { PageTransition } from "@/components/motion-system";
import { Button } from "@/components/ui/button";
import type { ValorantSkin } from "@/lib/valorant-types";

const TIER_FILTERS = ["All", "ULTRA", "EXCLUSIVE", "PREMIUM", "DELUXE", "SELECT"] as const;
type TierFilter = (typeof TIER_FILTERS)[number];

const SORT_OPTIONS = ["Newest", "A–Z", "Z–A", "Price ↑", "Price ↓"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

const WEAPON_SLUGS = ["vandal","phantom","operator","spectre","ghost","classic","sheriff","frenzy","shorty","stinger","bucky","judge","bulldog","guardian","marshal","ares","odin","outlaw","melee"];

export interface FlatSkin {
  uuid: string;
  displayName: string;
  weaponSlug: string;
  contentTierUuid: string | null;
  rarity: string;
  price: number;
  color: string;
  displayIcon: string | null;
  fullRender: string | null;
}

const PAGE_SIZE = 48;

interface SkinsClientProps {
  initialSkins: FlatSkin[];
}

export function SkinsClient({ initialSkins }: SkinsClientProps) {
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState<TierFilter>("All");
  const [weapon, setWeapon] = useState("all");
  const [sort, setSort] = useState<SortOption>("Newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let res = initialSkins;
    if (tier !== "All") res = res.filter(s => s.rarity === tier);
    if (weapon !== "all") res = res.filter(s => s.weaponSlug === weapon);
    if (search) res = res.filter(s => s.displayName.toLowerCase().includes(search.toLowerCase()));
    switch (sort) {
      case "A–Z": res = [...res].sort((a, b) => a.displayName.localeCompare(b.displayName)); break;
      case "Z–A": res = [...res].sort((a, b) => b.displayName.localeCompare(a.displayName)); break;
      case "Price ↑": res = [...res].sort((a, b) => a.price - b.price); break;
      case "Price ↓": res = [...res].sort((a, b) => b.price - a.price); break;
    }
    return res;
  }, [initialSkins, tier, weapon, search, sort]);

  const shown = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = shown.length < filtered.length;

  const setTierF = (v: TierFilter) => { setTier(v); setPage(1); };
  const setWeaponF = (v: string) => { setWeapon(v); setPage(1); };
  const setSortF = (v: SortOption) => { setSort(v); setPage(1); };
  const setSearchF = (v: string) => { setSearch(v); setPage(1); };

  const toCardSkin = (s: FlatSkin): ValorantSkin => ({
    uuid: s.uuid,
    displayName: s.displayName,
    contentTierUuid: s.contentTierUuid,
    displayIcon: s.displayIcon,
    themeUuid: "",
    wallpaper: null,
    assetPath: "",
    chromas: s.fullRender ? [{ uuid: s.uuid, displayName: s.displayName, displayIcon: s.displayIcon, fullRender: s.fullRender, swatch: null, streamedVideo: null, assetPath: "" }] : [],
    levels: [],
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        {/* Header */}
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">SKINS CATALOGUE</span>
            </div>
            <h1 className="font-display font-black text-6xl uppercase tracking-tighter text-foreground sm:text-7xl lg:text-8xl">SKINS</h1>
            <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-muted">
              Every weapon skin in VALORANT — variants, levels, and video previews.
            </p>
          </Container>
        </div>

        {/* Filter bar */}
        <div className="sticky top-[57px] z-40 border-b border-border bg-background/95 backdrop-blur-sm">
          <Container className="py-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={e => setSearchF(e.target.value)}
                  placeholder="Search skins…"
                  aria-label="Search skins"
                  className="w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] py-2 pl-9 pr-4 font-sans text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Tier filters */}
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by tier">
                {TIER_FILTERS.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTierF(t)}
                    aria-pressed={tier === t}
                    className={[
                      "border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-all",
                      tier === t
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted hover:border-white/30 hover:text-white",
                    ].join(" ")}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Weapon filter */}
              <div className="relative">
                <label htmlFor="weapon-filter" className="sr-only">Filter by weapon</label>
                <select
                  id="weapon-filter"
                  value={weapon}
                  onChange={e => setWeaponF(e.target.value)}
                  className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] py-2 pl-3 pr-8 font-mono text-[11px] font-bold uppercase text-muted focus:border-primary focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="all">All Weapons</option>
                  {WEAPON_SLUGS.map(w => (
                    <option key={w} value={w}>{w.charAt(0).toUpperCase() + w.slice(1)}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
              </div>

              {/* Sort */}
              <div className="relative">
                <label htmlFor="sort-select" className="sr-only">Sort skins</label>
                <select
                  id="sort-select"
                  value={sort}
                  onChange={e => setSortF(e.target.value as SortOption)}
                  className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] py-2 pl-3 pr-8 font-mono text-[11px] font-bold uppercase text-muted focus:border-primary focus:outline-none appearance-none cursor-pointer"
                >
                  {SORT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
              </div>

              {/* Count */}
              <span className="ml-auto font-mono text-[11px] text-muted shrink-0">
                {`${filtered.length} skin${filtered.length !== 1 ? "s" : ""}`}
              </span>
            </div>
          </Container>
        </div>

        {/* Grid */}
        <Container className="py-12">
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-mono text-sm font-bold uppercase tracking-wider text-muted">
                No skins match your filters
              </p>
              <button
                type="button"
                onClick={() => { setSearch(""); setTierF("All"); setWeaponF("all"); }}
                className="mt-4 font-mono text-[11px] font-bold uppercase tracking-wider text-primary hover:text-white transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {shown.map(s => (
                  <SkinCard key={s.uuid} skin={toCardSkin(s)} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => p + 1)}
                    className="gap-2"
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    Load more ({filtered.length - shown.length} remaining)
                  </Button>
                </div>
              )}
            </>
          )}
        </Container>
      </div>
    </PageTransition>
  );
}
