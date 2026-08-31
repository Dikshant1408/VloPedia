"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import { valorantDb } from "@/lib/valorant-db";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { fetchWithCache } from "@/lib/api-cache";
import { slugify } from "@/lib/utils";

type ResultType = "AGENT" | "WEAPON" | "MAP" | "SKIN" | "BUNDLE" | "PATCH" | "LORE" | "LEAK";

interface ResultItem {
  type: ResultType;
  title: string;
  desc: string;
  href: string;
  meta?: string;
}

const TYPE_COLOR: Record<ResultType, string> = {
  AGENT:  "border-role-duelist/40 bg-role-duelist/10 text-role-duelist",
  WEAPON: "border-primary/40 bg-primary/10 text-primary",
  MAP:    "border-role-initiator/40 bg-role-initiator/10 text-role-initiator",
  SKIN:   "border-role-controller/40 bg-role-controller/10 text-role-controller",
  BUNDLE: "border-tier-premium/40 bg-tier-premium/10 text-tier-premium",
  PATCH:  "border-muted/40 bg-surface text-muted",
  LORE:   "border-role-sentinel/40 bg-role-sentinel/10 text-role-sentinel",
  LEAK:   "border-error/40 bg-error/10 text-error",
};

const TRENDING = ["Jett", "Vandal", "Reaver", "Ascent", "Omen", "Operator"];

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B141A]" />}>
      <SearchInner />
    </Suspense>
  );
}

function SearchInner() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";

  const [query, setQuery]       = useState(initialQ);
  const [debouncedQ, setDQ]     = useState(initialQ);
  const [apiAgents, setApiAgents]   = useState<ResultItem[]>([]);
  const [apiWeapons, setApiWeapons] = useState<ResultItem[]>([]);
  const [apiMaps, setApiMaps]       = useState<ResultItem[]>([]);
  const [loading, setLoading]   = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>|null>(null);
  const focusRef = useRef<number>(0);

  // Debounce search input 200ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDQ(query), 200);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  // Fetch live API data on mount (cached via fetchWithCache for 0ms repeat load)
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchWithCache("https://valorant-api.com/v1/agents?isPlayableCharacter=true").catch(() => ({ data: [] })),
      fetchWithCache("https://valorant-api.com/v1/weapons").catch(() => ({ data: [] })),
      fetchWithCache("https://valorant-api.com/v1/maps").catch(() => ({ data: [] })),
    ]).then(([ag, wp, mp]) => {
      setApiAgents(((ag as any).data ?? []).map((a: any) => ({
        type: "AGENT" as ResultType, title: a.displayName,
        desc: a.description ?? "", href: `/agents/${slugify(a.displayName)}`,
        meta: a.role?.displayName,
      })));
      setApiWeapons(((wp as any).data ?? []).map((w: any) => ({
        type: "WEAPON" as ResultType, title: w.displayName,
        desc: w.shopData ? `${w.shopData.categoryText} · ${w.shopData.cost} VP` : w.category,
        href: `/weapons/${slugify(w.displayName)}`,
        meta: w.shopData?.categoryText,
      })));
      setApiMaps(((mp as any).data ?? []).filter((m: any) => m.splash).map((m: any) => ({
        type: "MAP" as ResultType, title: m.displayName,
        desc: m.narrativeDescription ?? m.coordinates ?? "", href: `/maps/${slugify(m.displayName)}`,
        meta: m.coordinates,
      })));
      setLoading(false);
    });
  }, []);

  // Static fallback items from mockDb
  const staticItems = useMemo<ResultItem[]>(() => [
    ...valorantDb.patches.map(p => ({ type:"PATCH" as ResultType, title:`Patch ${p.version}`, desc: `Buffs: ${p.buffs.map(b=>b.subject).join(", ")}`, href:`/patch-notes/${p.slug}`, meta: p.date })),
    ...valorantDb.lore.map(l => ({ type:"LORE" as ResultType, title: l.title, desc: l.summary, href:`/lore/${l.slug}`, meta:`Chapter ${l.chapter}` })),
    ...valorantDb.leaks.map(l => ({ type:"LEAK" as ResultType, title: l.codename, desc: l.details, href:`/leaks/${l.slug}`, meta: l.category })),
  ], []);

  const allItems = useMemo<ResultItem[]>(() => [
    ...apiAgents, ...apiWeapons, ...apiMaps, ...staticItems,
  ], [apiAgents, apiWeapons, apiMaps, staticItems]);

  const results = useMemo(() => {
    const q = debouncedQ.trim().toLowerCase();
    if (!q) return [];
    return allItems.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.desc.toLowerCase().includes(q) ||
      i.type.toLowerCase().includes(q) ||
      (i.meta && i.meta.toLowerCase().includes(q))
    );
  }, [debouncedQ, allItems]);

  // Count by type
  const counts = useMemo(() => {
    const c: Partial<Record<ResultType,number>> = {};
    for (const r of results) c[r.type] = (c[r.type]??0)+1;
    return c;
  }, [results]);

  // Keyboard nav
  const listRef = useRef<HTMLUListElement>(null);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll<HTMLAnchorElement>("a[href]");
    if (e.key === "ArrowDown") { e.preventDefault(); const next = Math.min(focusRef.current+1, items.length-1); focusRef.current=next; items[next]?.focus(); }
    if (e.key === "ArrowUp")   { e.preventDefault(); const prev = Math.max(focusRef.current-1, -1); if (prev<0){(e.target as HTMLElement).focus();} else { focusRef.current=prev; items[prev]?.focus(); } }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">UNIVERSAL SEARCH</span>
            </div>
            <h1 className="font-display text-6xl uppercase tracking-tight text-white sm:text-7xl">SEARCH</h1>

            {/* Search input */}
            <form onSubmit={e=>e.preventDefault()} role="search" className="mt-8 flex items-center gap-3 border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] p-3 focus-within:border-primary transition-colors max-w-2xl">
              <SearchIcon className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search agents, weapons, skins, maps, lore…"
                aria-label="Search ValoVault"
                autoFocus
                className="w-full bg-transparent font-sans text-sm text-foreground placeholder:text-muted/60 focus:outline-none"
              />
            </form>

            {/* Trending pills */}
            {!debouncedQ && (
              <div className="mt-4 flex flex-wrap gap-2">
                {TRENDING.map(s => (
                  <button key={s} type="button" onClick={() => setQuery(s)}
                    className="border border-border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted transition-colors hover:border-primary hover:text-primary">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </Container>
        </div>

        <Container className="py-10">
          {debouncedQ ? (
            <>
              {/* Result counts */}
              <div className="mb-6 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-muted">
                <span className="font-bold text-white">{results.length} result{results.length !== 1 ? "s" : ""}</span>
                {(["AGENT","WEAPON","MAP","SKIN","BUNDLE","PATCH","LORE","LEAK"] as ResultType[]).map(t => (
                  <span key={t}>{t}: {counts[t]??0}</span>
                ))}
              </div>

              {results.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                  <p className="font-mono text-sm font-bold uppercase tracking-wider text-muted">
                    No results for &quot;{debouncedQ}&quot;
                  </p>
                  <p className="font-mono text-[11px] text-muted">Try: {TRENDING.join(", ")}</p>
                </div>
              ) : (
                <ul ref={listRef} className="space-y-3" role="list" aria-label="Search results">
                  {results.map((item, i) => (
                    <li key={item.href + i}>
                      <Reveal>
                        <Link href={item.href}
                          className="group flex items-center justify-between gap-4 border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] p-5 transition-all duration-200 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                          aria-label={`${item.type}: ${item.title}`}
                          onFocus={() => { focusRef.current = i; }}
                        >
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`border px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider ${TYPE_COLOR[item.type]}`}>
                                {item.type}
                              </span>
                              {item.meta && (
                                <span className="font-mono text-[9px] text-muted">{item.meta}</span>
                              )}
                            </div>
                            <h3 className="font-display text-xl uppercase tracking-wide text-white group-hover:text-primary transition-colors truncate">
                              {item.title}
                            </h3>
                            {item.desc && (
                              <p className="font-sans text-xs leading-relaxed text-muted line-clamp-1">{item.desc}</p>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
                        </Link>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <p className="font-mono text-sm font-bold uppercase tracking-wider text-muted">
                {loading ? "Loading search index…" : "Start typing to search everything"}
              </p>
            </div>
          )}
        </Container>
      </div>
    </PageTransition>
  );
}
