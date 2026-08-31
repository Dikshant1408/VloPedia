"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  X, 
  Sparkles, 
  Crosshair, 
  Sliders, 
  Users, 
  Layers, 
  Shield, 
  Flame, 
  Eye, 
  Swords, 
  BookOpen, 
  FileText, 
  Compass, 
  ArrowRight, 
  CornerDownLeft 
} from "lucide-react";
import { valorantDb } from "@/lib/valorant-db";
import { slugify } from "@/lib/utils";

interface SearchItem {
  id: string;
  category: "Agents" | "Weapons" | "Maps" | "Skins" | "Tools" | "Guides" | "Patches";
  title: string;
  subtitle: string;
  href: string;
  badge?: string;
}

const STATIC_TOOLS: SearchItem[] = [
  { id: "tool-comp-builder", category: "Tools", title: "Tactical Comp Builder", subtitle: "Analyze team composition synergy, roles, and map compatibility", href: "/comp-builder", badge: "Engine" },
  { id: "tool-sens-calc", category: "Tools", title: "Sensitivity Calculator", subtitle: "Convert sens from CS2, Apex, Overwatch & calculate eDPI / cm/360", href: "/sensitivity", badge: "Converter" },
  { id: "tool-my-setup", category: "Tools", title: "My VALORANT Setup", subtitle: "Create & share your personal loadout, sensitivity, and crosshair card", href: "/setup", badge: "Shareable" },
  { id: "tool-crosshair", category: "Tools", title: "Crosshair Library & Generator", subtitle: "Browse pro crosshair codes and customize in-game reticles", href: "/crosshair", badge: "Generator" },
  { id: "tool-tier-list", category: "Tools", title: "Meta Agent Tier List", subtitle: "Current patch competitive agent ranking & win rates", href: "/tier-list", badge: "Tier List" },
  { id: "tool-economy", category: "Tools", title: "Economy Guide & Calculator", subtitle: "Round buy thresholds, loss bonus progression, and save calculations", href: "/economy", badge: "Economy" },
];

const STATIC_GUIDES: SearchItem[] = [
  { id: "guide-ascent", category: "Guides", title: "Ascent Map Masterclass: Execute & Default Strategy", subtitle: "A-Site & B-Site execute lineups, Mid control, and defender rotations", href: "/guides/best-agents-for-ascent", badge: "Map Guide" },
  { id: "guide-bind", category: "Guides", title: "Bind Teleporter Tactics & Default Playbook", subtitle: "Hookah control, Showers executes, and TP rotation strategies", href: "/guides/bind-teleporter-tactics", badge: "Map Guide" },
  { id: "guide-haven", category: "Guides", title: "Haven 3-Site Defense & Retake Fundamentals", subtitle: "Garage anchor setup, C-Long op angles, and A-Retake coordination", href: "/guides/haven-3-site-defense-strategy", badge: "Map Guide" },
  { id: "guide-sunset", category: "Guides", title: "Best Agents & Compositions for Sunset", subtitle: "Market control, B-Main flashes, and Cypher/Omen meta picks", href: "/guides/best-agents-for-sunset", badge: "Comp Guide" },
  { id: "guide-economy", category: "Guides", title: "VALORANT Economy Playbook & Buy Calculator", subtitle: "Bonus round conversions, light armor meta, and hero Vandals", href: "/guides/valorant-economy-guide", badge: "Economy" },
];

export function GlobalSearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [liveItems, setLiveItems] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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
              if (skinItems.length < 40) {
                skinItems.push({
                  id: `skin-${s.uuid}`,
                  category: "Skins",
                  title: s.displayName,
                  subtitle: `${w.displayName} Skin with custom chromas & finisher`,
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

  // Listen for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
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

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [open]);

  // Build combined items
  const allSearchable = useMemo(() => {
    const patchItems: SearchItem[] = valorantDb.patches.map(p => ({
      id: `patch-${p.slug}`,
      category: "Patches",
      title: `Patch ${p.version}`,
      subtitle: `Released ${p.date} · Buffs: ${p.buffs.map(b => b.subject).slice(0, 3).join(", ")}`,
      href: `/patch-notes/${p.slug}`,
      badge: "Patch",
    }));

    return [...STATIC_TOOLS, ...STATIC_GUIDES, ...liveItems, ...patchItems];
  }, [liveItems]);

  // Filter items
  const results = useMemo(() => {
    if (!query.trim()) {
      return [...STATIC_TOOLS, ...STATIC_GUIDES].slice(0, 10);
    }
    const q = query.toLowerCase().trim();
    return allSearchable
      .filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      )
      .slice(0, 14);
  }, [query, allSearchable]);

  const selectItem = useCallback((item: SearchItem) => {
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
      className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={() => setOpen(false)}
    >
      <div 
        className="w-full max-w-2xl border border-[rgba(236,232,225,0.15)] bg-[#0B141A] shadow-2xl shadow-black/90 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search header */}
        <div className="relative flex items-center border-b border-[rgba(236,232,225,0.10)] px-4 py-3.5 bg-[#0D1820]">
          <Search className="h-4 w-4 text-primary shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search agents, weapons, maps, skins, tools, or guides... (Ctrl+K)"
            className="flex-1 bg-transparent font-mono text-sm text-white placeholder:text-muted focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery("")}
              className="text-muted hover:text-white p-1 mr-2"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="font-mono text-[10px] px-2 py-0.5 border border-border bg-surface text-muted uppercase">
            ESC to close
          </span>
        </div>

        {/* Results list */}
        <div ref={listRef} className="overflow-y-auto p-2 space-y-1 divide-y divide-[rgba(236,232,225,0.04)]">
          {results.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-mono text-sm text-muted">No tactical intel found for &quot;{query}&quot;</p>
              <p className="font-sans text-xs text-muted/70 mt-1">Try searching for Jett, Vandal, Ascent, Sensitivity, or Comp Builder</p>
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => selectItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left flex items-center justify-between px-3.5 py-3 transition-colors ${
                    isSelected 
                      ? "bg-primary/10 border-l-2 border-primary text-white" 
                      : "text-secondary hover:bg-white/5 border-l-2 border-transparent"
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`font-mono text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 border ${
                        item.category === "Agents" ? "border-role-duelist/40 bg-role-duelist/10 text-role-duelist" :
                        item.category === "Weapons" ? "border-primary/40 bg-primary/10 text-primary" :
                        item.category === "Maps" ? "border-role-initiator/40 bg-role-initiator/10 text-role-initiator" :
                        item.category === "Tools" ? "border-[#0DF2F2]/40 bg-[#0DF2F2]/10 text-[#0DF2F2]" :
                        item.category === "Guides" ? "border-role-sentinel/40 bg-role-sentinel/10 text-role-sentinel" :
                        "border-muted/40 bg-surface text-muted"
                      }`}>
                        {item.category}
                      </span>
                      <span className="font-display uppercase tracking-wide font-bold text-sm text-white truncate">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="font-mono text-[9px] text-muted hidden sm:inline">
                          ({item.badge})
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-xs text-muted truncate">
                      {item.subtitle}
                    </p>
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
        <div className="border-t border-[rgba(236,232,225,0.08)] bg-[#0D1820] px-4 py-2 flex items-center justify-between text-[10px] font-mono text-muted">
          <div className="flex items-center gap-3">
            <span><strong className="text-white">↑↓</strong> Navigate</span>
            <span><strong className="text-white">↵</strong> Open</span>
            <span><strong className="text-white">ESC</strong> Exit</span>
          </div>
          <span className="text-[#0DF2F2]">VloPedia Tactical Engine</span>
        </div>
      </div>
    </div>
  );
}
