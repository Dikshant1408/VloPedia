"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Search, 
  X, 
  Compass, 
  ArrowRight, 
  CornerDownLeft,
  Clock,
  Compass as NavIcon,
  Zap,
  Layers,
  Swords,
  Crosshair
} from "lucide-react";
import { valorantDb } from "@/lib/valorant-db";
import { slugify } from "@/lib/utils";
import { soundSystem } from "@/lib/sound-system";
import loreData from "@/data/lore-database.json";
import { getRecentViews, RecentViewItem } from "@/lib/recently-viewed";
import { TacticalEmptyState } from "@/components/tactical-empty-state";

interface SearchItem {
  id: string;
  category: "Agents" | "Weapons" | "Maps" | "Skins" | "Tools" | "Guides" | "Lore" | "Compare" | "Patches" | "RECENT" | "GO TO" | "ACTIONS" | "CONTEXTUAL";
  title: string;
  subtitle: string;
  href: string;
  badge?: string;
}

const GO_TO_ITEMS: SearchItem[] = [
  { id: "goto-agents", category: "GO TO", title: "Agents", subtitle: "Complete operative roster, abilities, and counter-picks", href: "/agents", badge: "26 Agents" },
  { id: "goto-weapons", category: "GO TO", title: "Weapons", subtitle: "Damage falloffs, fire rates, recoil, and buy costs", href: "/weapons", badge: "19 Arsenal" },
  { id: "goto-maps", category: "GO TO", title: "Maps", subtitle: "Callouts, layouts, active pool, and team comp fit", href: "/maps", badge: "Tactical Maps" },
  { id: "goto-skins", category: "GO TO", title: "Skins & Bundles", subtitle: "Skin database, finishers, chromas, and VP store prices", href: "/skins", badge: "1,400+ Skins" },
  { id: "goto-tools", category: "GO TO", title: "Tactical Tools", subtitle: "Comp builder, sensitivity converter, tier lists", href: "/tools", badge: "7 Tools" },
  { id: "goto-guides", category: "GO TO", title: "Guides & Masterclasses", subtitle: "Ranked climb strategies, role guides, and site executes", href: "/guides", badge: "Guides" },
];

const ACTION_ITEMS: SearchItem[] = [
  { id: "action-comp-builder", category: "ACTIONS", title: "Build Team Comp", subtitle: "Analyze team composition synergy and map compatibility", href: "/comp-builder", badge: "Synergy Engine" },
  { id: "action-compare", category: "ACTIONS", title: "Compare Entities", subtitle: "Head-to-head weapon and operative comparison matrices", href: "/compare", badge: "Matrix Duel" },
  { id: "action-match-prep", category: "ACTIONS", title: "Match Prep Briefing", subtitle: "Round-by-round strategy planner and map tactics", href: "/match-prep", badge: "Planner" },
  { id: "action-sensitivity", category: "ACTIONS", title: "Convert Sensitivity", subtitle: "Convert sens between CS2, Apex, Overwatch & calculate eDPI", href: "/sensitivity", badge: "Converter" },
];

const STATIC_TOOLS: SearchItem[] = [
  { id: "tool-comp-builder", category: "Tools", title: "Tactical Comp Builder", subtitle: "Analyze team composition synergy, roles, and map compatibility", href: "/comp-builder", badge: "Engine" },
  { id: "tool-sens-calc", category: "Tools", title: "Sensitivity Calculator", subtitle: "Convert sens from CS2, Apex, Overwatch & calculate eDPI / cm/360", href: "/sensitivity", badge: "Converter" },
  { id: "tool-my-setup", category: "Tools", title: "My VALORANT Setup", subtitle: "Create & share your personal loadout, sensitivity, and crosshair card", href: "/setup", badge: "Shareable" },
  { id: "tool-compare", category: "Tools", title: "Tactical Compare Engine", subtitle: "Head-to-head weapon & agent comparison matrices", href: "/compare", badge: "Compare" },
  { id: "tool-crosshair", category: "Tools", title: "Crosshair Library & Generator", subtitle: "Browse pro crosshair codes and customize in-game reticles", href: "/crosshair", badge: "Generator" },
  { id: "tool-tier-list", category: "Tools", title: "Meta Agent Tier List", subtitle: "Current patch competitive agent ranking & win rates", href: "/tier-list", badge: "Tier List" },
  { id: "tool-economy", category: "Tools", title: "Economy Guide & Calculator", subtitle: "Round buy thresholds, loss bonus progression, and save calculations", href: "/economy", badge: "Economy" },
];

const STATIC_COMPARES: SearchItem[] = [
  { id: "compare-vandal-phantom", category: "Compare", title: "Vandal vs. Phantom", subtitle: "Damage falloff, bullet tracers, fire rate, and recoil reset comparison", href: "/compare/weapons/vandal-vs-phantom", badge: "Weapon Duel" },
  { id: "compare-op-outlaw", category: "Compare", title: "Operator vs. Outlaw", subtitle: "High-yield snipers, half-shield kill thresholds, and cost efficiency", href: "/compare/weapons/operator-vs-outlaw", badge: "Weapon Duel" },
  { id: "compare-jett-raze", category: "Compare", title: "Jett vs. Raze", subtitle: "Duelist entry space creation, verticality, and ultimate impact", href: "/compare/agents/jett-vs-raze", badge: "Operative Duel" },
  { id: "compare-omen-clove", category: "Compare", title: "Omen vs. Clove", subtitle: "Controller smoke coverage, post-death utility, and solo queue carry", href: "/compare/agents/omen-vs-clove", badge: "Operative Duel" },
];

const STATIC_GUIDES: SearchItem[] = [
  { id: "guide-beginners", category: "Guides", title: "Best Agents for Beginners", subtitle: "Easy mechanics, high team utility, and forgiving abilities", href: "/guides/best-agents-for-beginners", badge: "Guide" },
  { id: "guide-solo-queue", category: "Guides", title: "Best Agents for Solo Queue Ranked", subtitle: "Self-sufficient 1v9 agents to climb from Silver to Ascendant", href: "/guides/best-agents-for-solo-queue", badge: "Guide" },
  { id: "guide-ascent", category: "Guides", title: "Best Agents on Ascent", subtitle: "Optimal S-tier comp (Jett, Omen, Sova, Killjoy, KAY/O)", href: "/guides/best-agents-for-ascent", badge: "Guide" },
  { id: "guide-counter-jett", category: "Guides", title: "How to Counter Jett", subtitle: "Baiting Tailwind, Operator suppression, and Cypher setups", href: "/guides/how-to-counter-jett", badge: "Guide" },
  { id: "guide-vandal-phantom", category: "Guides", title: "Vandal vs. Phantom Breakdown", subtitle: "Mathematical damage dropoff and situational recommendations", href: "/guides/vandal-vs-phantom", badge: "Guide" },
  { id: "guide-sens", category: "Guides", title: "Best Sensitivity & DPI Guide", subtitle: "VCT pro averages, eDPI ranges (200-300), and cm/360 calculations", href: "/guides/best-sensitivity-for-valorant", badge: "Guide" },
];

export function GlobalSearchDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [liveItems, setLiveItems] = useState<SearchItem[]>([]);
  const [recentItems, setRecentItems] = useState<RecentViewItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Refresh recent views on open or custom event
  const refreshRecent = useCallback(() => {
    setRecentItems(getRecentViews());
  }, []);

  useEffect(() => {
    refreshRecent();
    const handleRecentUpdate = () => refreshRecent();
    window.addEventListener("valovault_recent_update", handleRecentUpdate);
    return () => window.removeEventListener("valovault_recent_update", handleRecentUpdate);
  }, [refreshRecent]);

  // Fetch agents, weapons, maps from API on mount
  useEffect(() => {
    fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true")
      .then(r => r.json())
      .then(j => {
        if (j?.data) {
          const agentItems: SearchItem[] = j.data.map((a: any) => ({
            id: `agent-${a.uuid}`,
            category: "Agents",
            title: a.displayName,
            subtitle: `${a.role?.displayName ?? "Agent"} · ${a.description?.slice(0, 70)}...`,
            href: `/agents/${slugify(a.displayName)}`,
            badge: a.role?.displayName,
          }));
          setLiveItems(prev => [...prev.filter(i => i.category !== "Agents"), ...agentItems]);
        }
      })
      .catch(() => {});

    fetch("https://valorant-api.com/v1/weapons")
      .then(r => r.json())
      .then(j => {
        if (j?.data) {
          const weaponItems: SearchItem[] = j.data.map((w: any) => ({
            id: `weapon-${w.uuid}`,
            category: "Weapons",
            title: w.displayName,
            subtitle: `${w.shopData?.categoryText ?? w.category?.replace("EEquippableCategory::", "") ?? "Weapon"} · ${w.shopData?.cost ? `${w.shopData.cost} VP` : "Free"}`,
            href: `/weapons/${slugify(w.displayName)}`,
            badge: w.shopData?.categoryText ?? "Weapon",
          }));

          const skinItems: SearchItem[] = [];
          for (const w of j.data) {
            for (const s of (w.skins || [])) {
              if (s.displayName.toLowerCase().includes("standard")) continue;
              if (skinItems.length < 50) {
                skinItems.push({
                  id: `skin-${s.uuid}`,
                  category: "Skins",
                  title: s.displayName,
                  subtitle: `${w.displayName} skin with custom chromas & finisher`,
                  href: `/skins/${slugify(s.displayName)}`,
                  badge: "Skin",
                });
              }
            }
          }

          setLiveItems(prev => [
            ...prev.filter(i => i.category !== "Weapons" && i.category !== "Skins"),
            ...weaponItems,
            ...skinItems
          ]);
        }
      })
      .catch(() => {});

    fetch("https://valorant-api.com/v1/maps")
      .then(r => r.json())
      .then(j => {
        if (j?.data) {
          const mapItems: SearchItem[] = j.data
            .filter((m: any) => m.splash)
            .map((m: any) => ({
              id: `map-${m.uuid}`,
              category: "Maps",
              title: m.displayName,
              subtitle: `Tactical map · Coordinates: ${m.coordinates || "Classified"}`,
              href: `/maps/${slugify(m.displayName)}`,
              badge: "Map",
            }));
          setLiveItems(prev => [...prev.filter(i => i.category !== "Maps"), ...mapItems]);
        }
      })
      .catch(() => {});
  }, []);

  // Listen for Ctrl+K / Cmd+K or '/' key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput = activeElement && (
        activeElement.tagName === "INPUT" || 
        activeElement.tagName === "TEXTAREA" || 
        activeElement.tagName === "SELECT" ||
        (activeElement as HTMLElement).isContentEditable
      );

      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") || (e.key === "/" && !isInput)) {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Focus input & refresh recent when opened
  useEffect(() => {
    if (open) {
      soundSystem.play("search");
      refreshRecent();
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [open, refreshRecent]);

  // Contextual command suggestions based on current pathname
  const contextualItems: SearchItem[] = useMemo(() => {
    if (!pathname) return [];
    const items: SearchItem[] = [];

    if (pathname.startsWith("/skins/")) {
      const segments = pathname.split("/").filter(Boolean);
      const skinSlug = segments[1];
      if (skinSlug && skinSlug !== "watch") {
        items.push({
          id: "ctx-compare-skin",
          category: "CONTEXTUAL",
          title: "Compare Similar Skins",
          subtitle: "Evaluate skin pricing, chromas & finisher VFX head-to-head",
          href: "/compare",
          badge: "Context Action",
        });
        items.push({
          id: "ctx-all-skins",
          category: "CONTEXTUAL",
          title: "View Weapon Skin Hub",
          subtitle: "Browse all weapon catalog skins and chromas",
          href: "/skins",
          badge: "Collection",
        });
        items.push({
          id: "ctx-watch-showcase",
          category: "CONTEXTUAL",
          title: "Watch 1080P Showcase",
          subtitle: "Full cinematic audio & inspect showcase for this skin",
          href: `/skins/${skinSlug}/watch`,
          badge: "Showcase",
        });
      }
    } else if (pathname.startsWith("/agents/")) {
      const segments = pathname.split("/").filter(Boolean);
      const agentSlug = segments[1];
      if (agentSlug) {
        items.push({
          id: "ctx-build-comp",
          category: "CONTEXTUAL",
          title: `Build Comp with ${agentSlug.toUpperCase()}`,
          subtitle: `Analyze 5-stack synergy and utility compatibility for ${agentSlug}`,
          href: `/comp-builder?agents=${agentSlug}`,
          badge: "Comp Engine",
        });
        items.push({
          id: "ctx-agent-counters",
          category: "CONTEXTUAL",
          title: `Explore ${agentSlug.toUpperCase()} Counters`,
          subtitle: `View tactical counter-picks and suppression strategies`,
          href: `/agents/${agentSlug}#counters`,
          badge: "Counters",
        });
      }
    } else if (pathname.startsWith("/weapons/")) {
      const segments = pathname.split("/").filter(Boolean);
      const weaponSlug = segments[1];
      if (weaponSlug) {
        items.push({
          id: "ctx-compare-weapon",
          category: "CONTEXTUAL",
          title: `Compare ${weaponSlug.toUpperCase()} Lethality`,
          subtitle: `Head-to-head damage falloff and TTK comparison`,
          href: "/compare/weapons/vandal-vs-phantom",
          badge: "Duel",
        });
        items.push({
          id: "ctx-weapon-skins",
          category: "CONTEXTUAL",
          title: `View ${weaponSlug.toUpperCase()} Skins`,
          subtitle: `Browse all cosmetic editions and upgraded variants`,
          href: `/skins/${weaponSlug}`,
          badge: "Skins Hub",
        });
      }
    }

    return items;
  }, [pathname]);

  // Build combined searchable items
  const allSearchable = useMemo(() => {
    const patchItems: SearchItem[] = valorantDb.patches.map(p => ({
      id: `patch-${p.slug}`,
      category: "Patches",
      title: `Patch ${p.version}`,
      subtitle: `Released ${p.date} · Buffs: ${p.buffs.map(b => b.subject).slice(0, 3).join(", ")}`,
      href: `/patch-notes/${p.slug}`,
      badge: "Patch",
    }));

    const loreItems: SearchItem[] = loreData.articles.map(a => ({
      id: `lore-${a.slug}`,
      category: "Lore",
      title: a.title,
      subtitle: `${a.category.replace("_", " ")} · ${a.summary.slice(0, 70)}...`,
      href: `/lore/${a.slug}`,
      badge: a.canonStatus,
    }));

    return [...STATIC_TOOLS, ...STATIC_COMPARES, ...STATIC_GUIDES, ...loreItems, ...liveItems, ...patchItems];
  }, [liveItems]);

  // Computed results: Recent + Context + Go-To + Actions when query is empty, else filtered results
  const results = useMemo(() => {
    if (!query.trim()) {
      const recentConverted: SearchItem[] = recentItems.slice(0, 4).map((r) => ({
        id: `recent-${r.id}`,
        category: "RECENT",
        title: r.title,
        subtitle: r.subtitle || `Recently viewed ${r.category.toLowerCase()}`,
        href: r.href,
        badge: r.category,
      }));

      return [
        ...recentConverted,
        ...contextualItems,
        ...GO_TO_ITEMS.slice(0, 4),
        ...ACTION_ITEMS.slice(0, 3),
      ];
    }

    const q = query.toLowerCase().trim();
    return allSearchable
      .filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      )
      .slice(0, 14);
  }, [query, recentItems, contextualItems, allSearchable]);

  const selectItem = useCallback((item: SearchItem) => {
    soundSystem.play("click");
    setOpen(false);
    setQuery("");
    router.push(item.href);
  }, [router]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      selectItem(results[selectedIndex]);
    }
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-14 sm:pt-20 px-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={() => setOpen(false)}
    >
      <div 
        className="w-full max-w-2xl border border-border bg-surface-card shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[82vh] relative"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Top corner technical brackets */}
        <div className="absolute top-0 left-0 w-3 h-[2px] bg-primary" />
        <div className="absolute top-0 left-0 w-[2px] h-3 bg-primary" />
        <div className="absolute top-0 right-0 w-3 h-[2px] bg-cyan" />
        <div className="absolute top-0 right-0 w-[2px] h-3 bg-cyan" />

        {/* Terminal Header Bar */}
        <div className="border-b border-border bg-surface-elevated px-4 py-2 flex items-center justify-between font-mono text-[9px] text-muted tracking-wider select-none">
          <span className="text-cyan font-bold tracking-widest flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan/80" />
            VLOPEDIA // COMMAND PALETTE & SEARCH
          </span>
          <span className="text-muted/60">INDEX: 1,400+ TACTICAL NODES</span>
        </div>

        {/* Search input line */}
        <div className="relative flex items-center border-b border-border px-4 py-3.5 bg-surface/60">
          <Search className="h-4 w-4 text-primary shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search database or type command... (e.g. Jett, Vandal, Ascent)"
            aria-label="Command search query"
            className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-muted/60 focus:outline-none"
          />
          {query && (
            <button 
              type="button"
              onClick={() => setQuery("")}
              className="text-muted hover:text-foreground p-1 mr-2 cursor-pointer"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="font-mono text-[9px] px-1.5 py-0.5 border border-border bg-surface-elevated text-muted uppercase">
            ESC
          </span>
        </div>

        {/* Results list or Empty state */}
        <div ref={listRef} className="overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="p-3">
              <TacticalEmptyState
                query={query}
                onSelectSuggestion={(term) => {
                  setQuery(term);
                  setSelectedIndex(0);
                }}
                onReset={() => {
                  setQuery("");
                  setSelectedIndex(0);
                }}
              />
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isRecent = item.category === "RECENT";
              const isContext = item.category === "CONTEXTUAL";
              const isGoTo = item.category === "GO TO";
              const isAction = item.category === "ACTIONS";

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left flex items-center justify-between px-3 py-2.5 transition-colors cursor-pointer ${
                    isSelected 
                      ? "bg-primary/[0.08] border-l-2 border-primary text-foreground" 
                      : "text-secondary hover:bg-surface/50 border-l-2 border-transparent"
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-4 flex items-start gap-3">
                    {/* Icon or Index */}
                    <div className="mt-0.5 shrink-0">
                      {isRecent ? (
                        <Clock className="h-3.5 w-3.5 text-muted" />
                      ) : isContext ? (
                        <Zap className="h-3.5 w-3.5 text-cyan" />
                      ) : isGoTo ? (
                        <NavIcon className="h-3.5 w-3.5 text-primary" />
                      ) : isAction ? (
                        <Swords className="h-3.5 w-3.5 text-warning" />
                      ) : (
                        <span className={`font-mono text-[10px] ${isSelected ? "text-primary font-bold" : "text-muted/60"}`}>
                          {(idx + 1).toString().padStart(2, "0")}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`font-mono text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.2 border ${
                          isRecent ? "border-border/80 bg-surface text-muted" :
                          isContext ? "border-cyan/40 bg-cyan/10 text-cyan" :
                          isGoTo ? "border-primary/40 bg-primary/10 text-primary" :
                          isAction ? "border-warning/40 bg-warning/10 text-warning" :
                          item.category === "Agents" ? "border-role-duelist/40 bg-role-duelist/10 text-role-duelist" :
                          item.category === "Weapons" ? "border-primary/40 bg-primary/10 text-primary" :
                          item.category === "Maps" ? "border-role-initiator/40 bg-role-initiator/10 text-role-initiator" :
                          item.category === "Tools" ? "border-cyan/40 bg-cyan/10 text-cyan" :
                          "border-border bg-surface text-muted"
                        }`}>
                          {item.category}
                        </span>
                        <span className="font-display uppercase tracking-wide font-bold text-sm text-foreground truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="font-mono text-[9px] text-muted/70 hidden sm:inline">
                            [{item.badge}]
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs text-muted truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center text-muted">
                    {isSelected ? (
                      <CornerDownLeft className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5 opacity-30" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="border-t border-border bg-surface-elevated px-4 py-2 flex items-center justify-between text-[9px] font-mono text-muted tracking-wider">
          <div className="flex items-center gap-4">
            <span><strong className="text-foreground">[↑↓]</strong> NAVIGATE</span>
            <span><strong className="text-foreground">[↵]</strong> EXECUTE</span>
            <span><strong className="text-foreground">[ESC]</strong> TERMINATE</span>
          </div>
          <span className="text-cyan font-bold tracking-widest hidden sm:inline">TACTICAL PALETTE</span>
        </div>
      </div>
    </div>
  );
}
