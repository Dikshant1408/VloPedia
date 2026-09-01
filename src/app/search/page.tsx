"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search as SearchIcon, ArrowRight, Zap, GitCompare, Calculator, BookOpen, Compass, Shield, Sparkles } from "lucide-react";
import { valorantDb } from "@/lib/valorant-db";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { fetchWithCache } from "@/lib/api-cache";
import { slugify } from "@/lib/utils";
import loreData from "@/data/lore-database.json";
import guidesData from "@/data/guides-database.json";
import { AnswerBox } from "@/components/answer-box";

type ResultType = "AGENT" | "WEAPON" | "MAP" | "SKIN" | "BUNDLE" | "PATCH" | "LORE" | "GUIDE" | "TOOL" | "COMPARE";

interface ResultItem {
  type: ResultType;
  title: string;
  desc: string;
  href: string;
  meta?: string;
}

const TYPE_COLOR: Record<ResultType, string> = {
  AGENT:   "border-role-duelist/40 bg-role-duelist/10 text-role-duelist",
  WEAPON:  "border-primary/40 bg-primary/10 text-primary",
  MAP:     "border-role-initiator/40 bg-role-initiator/10 text-role-initiator",
  SKIN:    "border-role-controller/40 bg-role-controller/10 text-role-controller",
  BUNDLE:  "border-tier-premium/40 bg-tier-premium/10 text-tier-premium",
  PATCH:   "border-muted/40 bg-surface text-muted",
  LORE:    "border-[#0DF2F2]/40 bg-[#0DF2F2]/10 text-[#0DF2F2]",
  GUIDE:   "border-amber-400/40 bg-amber-400/10 text-amber-400",
  TOOL:    "border-primary/40 bg-primary/10 text-primary",
  COMPARE: "border-purple-400/40 bg-purple-400/10 text-purple-400",
};

const TRENDING = ["best controller on ascent", "vandal vs phantom", "jett", "first light", "800 dpi 0.3", "clove", "comp builder"];

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B141A]" />}>
      <SearchInner />
    </Suspense>
  );
}

function SearchInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") ?? "";

  const [query, setQuery]           = useState(initialQ);
  const [debouncedQ, setDQ]         = useState(initialQ);
  const [apiAgents, setApiAgents]   = useState<ResultItem[]>([]);
  const [apiWeapons, setApiWeapons] = useState<ResultItem[]>([]);
  const [apiMaps, setApiMaps]       = useState<ResultItem[]>([]);
  const [apiSkins, setApiSkins]     = useState<ResultItem[]>([]);
  const [activeFilter, setFilter]   = useState<string>("ALL");
  const debounceRef = useRef<ReturnType<typeof setTimeout>|null>(null);

  // Sync URL query
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDQ(query);
      if (query.trim()) {
        router.replace(`/search?q=${encodeURIComponent(query.trim())}`, { scroll: false });
      }
    }, 150);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, router]);

  // Load external static datasets
  useEffect(() => {
    fetchWithCache<{ data: any[] }>("https://valorant-api.com/v1/agents?isPlayableCharacter=true")
      .then(res => {
        if (res.data) {
          setApiAgents(res.data.map(a => ({
            type: "AGENT",
            title: a.displayName,
            desc: a.description || `${a.role?.displayName} agent in VALORANT.`,
            href: `/agents/${slugify(a.displayName)}`,
            meta: a.role?.displayName,
          })));
        }
      }).catch(() => {});

    fetchWithCache<{ data: any[] }>("https://valorant-api.com/v1/weapons")
      .then(res => {
        if (res.data) {
          setApiWeapons(res.data.map(w => ({
            type: "WEAPON",
            title: w.displayName,
            desc: `Buy Cost: ${w.shopData?.cost?.toLocaleString() ?? "Free"} VP · Category: ${w.category?.replace("EEquippableCategory::", "")}`,
            href: `/weapons/${slugify(w.displayName)}`,
            meta: `${w.shopData?.cost ?? 0} VP`,
          })));
        }
      }).catch(() => {});

    fetchWithCache<{ data: any[] }>("https://valorant-api.com/v1/maps")
      .then(res => {
        if (res.data) {
          setApiMaps(res.data.map(m => ({
            type: "MAP",
            title: m.displayName,
            desc: `Tactical competitive map. Coordinates: ${m.coordinates || "Classified"}`,
            href: `/maps/${slugify(m.displayName)}`,
            meta: "Map",
          })));
        }
      }).catch(() => {});
  }, []);

  // Static items from Guides, Lore, Tools, and Compare
  const staticItems: ResultItem[] = useMemo(() => {
    const loreItems: ResultItem[] = loreData.articles.map(a => ({
      type: "LORE",
      title: a.title,
      desc: `${a.summary} (Canon Status: ${a.canonStatus})`,
      href: `/lore/${a.slug}`,
      meta: a.canonStatus,
    }));

    const guideItems: ResultItem[] = guidesData.map(g => ({
      type: "GUIDE",
      title: g.title,
      desc: g.summary,
      href: `/guides/${g.slug}`,
      meta: g.category,
    }));

    const toolItems: ResultItem[] = [
      { type: "TOOL", title: "Comp Synergy Builder", desc: "Calculate map-weighted 5-agent team synergy, execute, retake & post-plant ratings.", href: "/comp-builder", meta: "Tactical Calculator" },
      { type: "TOOL", title: "Sensitivity & DPI Converter", desc: "Convert yaw between CS2, Apex, Overwatch 2, R6, Fortnite and VALORANT with exact cm/360.", href: "/sensitivity", meta: "Aim Calculator" },
      { type: "TOOL", title: "Crosshair Reticle Generator", desc: "Design reticles with 1-click import codes from TenZ, Demon1, and Aspas.", href: "/crosshair", meta: "Reticle Studio" },
      { type: "TOOL", title: "What Should I Play? (Recommender)", desc: "Find your ideal agent based on tempo, aim vs utility focus, and active map.", href: "/tools/what-to-play", meta: "Agent Quiz" },
      { type: "TOOL", title: "My VALORANT Personal Command", desc: "Your personal loadout, aiming kinematics, saved bookmarks, and pre-match briefing.", href: "/profile", meta: "Personal Hub" },
    ];

    const compareItems: ResultItem[] = [
      { type: "COMPARE", title: "Vandal vs. Phantom", desc: "0-50m one-tap lethality vs. 30-round stealth smoke spam head-to-head breakdown.", href: "/compare/weapons/vandal-vs-phantom", meta: "Weapon Duel" },
      { type: "COMPARE", title: "Jett vs. Raze", desc: "Operator mobility and entry dashing vs. explosive Satchel AOE site clearance.", href: "/compare/agents/jett-vs-raze", meta: "Agent Duel" },
      { type: "COMPARE", title: "Omen vs. Clove", desc: "Regenerating hollow smokes & Paranoia vs. post-death smokes and self-revives.", href: "/compare/agents/omen-vs-clove", meta: "Agent Duel" },
      { type: "COMPARE", title: "Operator vs. Outlaw", desc: "5,000 VP heavy sniper vs. 2,400 VP high-damage double-barrel rifle.", href: "/compare/weapons/operator-vs-outlaw", meta: "Weapon Duel" },
    ];

    return [...loreItems, ...guideItems, ...toolItems, ...compareItems];
  }, []);

  const allItems = useMemo(() => {
    return [...apiAgents, ...apiWeapons, ...apiMaps, ...staticItems];
  }, [apiAgents, apiWeapons, apiMaps, staticItems]);

  // Natural language intent detection
  const naturalLanguageIntent = useMemo(() => {
    const q = debouncedQ.toLowerCase().trim();
    if (!q) return null;

    if (q.includes("controller") && q.includes("ascent")) {
      return {
        question: "Who is the best controller on Ascent?",
        verdict: "Omen (S-Tier Pick)",
        explanation: "Omen is the premier controller on Ascent due to rechargeable hollow smokes that create one-ways on A Main and B Lane, combined with Paranoia blinding down narrow chokepoints.",
        keyTakeaways: [
          "Omen pick rate on Ascent: ~78% in VCT pro play",
          "Secondary pick: Viper for Mid Courtyard wall execution",
          "Avoid solo Astra unless running coordinated 5-stack gravity well setups"
        ],
        ctaLabel: "View Best Agents on Ascent Tier List",
        ctaHref: "/best/agents-on-ascent"
      };
    }

    if (q.includes("vandal") && q.includes("phantom")) {
      return {
        question: "Should you use the Vandal or Phantom?",
        verdict: "Situational (Vandal for Long Ranges, Phantom for Smokes)",
        explanation: "Vandal delivers guaranteed 1-tap headshot lethality at all ranges (160 damage). Phantom wins in fire rate (11 rds/s), 30-round capacity, and invisible bullet tracers through smoke.",
        keyTakeaways: [
          "Choose Vandal for 30m+ tap duels (Ascent Mid, Breeze B Long)",
          "Choose Phantom for controller mains spamming smokes (Bind, Split)",
          "Equal economy buy cost (2,900 VP)"
        ],
        ctaLabel: "Open Side-by-Side Weapon Comparison",
        ctaHref: "/compare/weapons/vandal-vs-phantom"
      };
    }

    // DPI & Sens pattern like "800 dpi 0.3"
    const sensMatch = q.match(/(\d{3,4})\s*(?:dpi)?\s*([0-9.]+)/i);
    if (sensMatch && (q.includes("dpi") || q.includes("sens") || q.includes("cs2") || q.includes("apex"))) {
      const dpiVal = Number(sensMatch[1]);
      const sensVal = Number(sensMatch[2]);
      if (dpiVal && sensVal) {
        const edpi = Math.round(dpiVal * sensVal);
        const cm360 = (13054.545 / edpi).toFixed(1);
        return {
          question: `Aim Kinematics for ${dpiVal} DPI @ ${sensVal} Sens`,
          verdict: `${edpi} eDPI // ${cm360} cm/360°`,
          explanation: `Your effective sensitivity is ${edpi} eDPI. A full 360° turn requires ${cm360} cm of mousepad travel. This falls within the ${edpi > 320 ? "High Sens" : edpi < 200 ? "Low Sens" : "Standard Pro Average (200-300 eDPI)"} bracket.`,
          keyTakeaways: [
            `CS2 Equivalent: ${(sensVal * 3.1818).toFixed(3)}`,
            `Apex Legends Equivalent: ${(sensVal * 3.1818).toFixed(3)}`,
            `Overwatch 2 Equivalent: ${(sensVal * 10.606).toFixed(2)}`
          ],
          ctaLabel: "Launch Full Sensitivity Converter",
          ctaHref: `/sensitivity?dpi=${dpiVal}&sens=${sensVal}`
        };
      }
    }

    return null;
  }, [debouncedQ]);

  // Filtered list
  const filtered = useMemo(() => {
    const q = debouncedQ.toLowerCase().trim();
    let list = allItems;

    if (activeFilter !== "ALL") {
      list = list.filter(i => i.type === activeFilter);
    }

    if (!q) return list.slice(0, 30);

    return list.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc  = item.desc.toLowerCase().includes(q);
      const matchMeta  = item.meta?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchMeta;
    });
  }, [debouncedQ, allItems, activeFilter]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground py-12">
        <Container className="space-y-8 max-w-5xl">
          
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-8 bg-primary" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary font-bold">
                KNOWLEDGE ENGINE SEARCH
              </span>
            </div>
            <h1 className="font-display font-black text-4xl uppercase tracking-tight text-white sm:text-5xl">
              SEARCH VLOPEDIA
            </h1>
            <p className="font-sans text-sm text-secondary">
              Search natural-language tactical queries, agent dossiers, weapon specs, lore archives, and tools.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search e.g. 'best controller on ascent', 'vandal vs phantom', '800 dpi 0.3'..."
              className="w-full bg-[#0D1820] border border-[rgba(236,232,225,0.15)] pl-12 pr-4 py-4 font-sans text-sm text-white placeholder:text-muted focus:border-primary focus:outline-none shadow-xl"
              autoFocus
            />
          </div>

          {/* Trending Suggestions */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase text-muted tracking-wider mr-1">Trending:</span>
            {TRENDING.map(t => (
              <button
                key={t}
                onClick={() => setQuery(t)}
                className="font-mono text-[10px] uppercase px-2.5 py-1 border border-[rgba(236,232,225,0.08)] bg-surface text-secondary hover:border-primary hover:text-white transition-colors"
              >
                {t}
              </button>
            ))}
          </div>

          {/* ── Natural Language Answer Box (if triggered) ── */}
          {naturalLanguageIntent && (
            <Reveal>
              <AnswerBox
                question={naturalLanguageIntent.question}
                verdict={naturalLanguageIntent.verdict}
                explanation={naturalLanguageIntent.explanation}
                keyTakeaways={naturalLanguageIntent.keyTakeaways}
                ctaLabel={naturalLanguageIntent.ctaLabel}
                ctaHref={naturalLanguageIntent.ctaHref}
              />
            </Reveal>
          )}

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[rgba(236,232,225,0.08)] pb-4">
            {["ALL", "AGENT", "WEAPON", "MAP", "LORE", "GUIDE", "TOOL", "COMPARE"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-mono text-xs uppercase px-3 py-1.5 border transition-all ${
                  activeFilter === f
                    ? "border-primary bg-primary text-black font-bold"
                    : "border-[rgba(236,232,225,0.1)] bg-surface text-secondary hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Result Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-muted">
              <span>Found {filtered.length} tactical intelligence entries</span>
              {debouncedQ && <span>Query: &quot;{debouncedQ}&quot;</span>}
            </div>

            {filtered.length === 0 ? (
              <div className="py-20 text-center text-muted font-mono text-xs space-y-3 border border-[rgba(236,232,225,0.06)] bg-[#0D1820]">
                <Compass className="h-8 w-8 mx-auto opacity-30 text-primary" />
                <p>No matching tactical intelligence found for &quot;{debouncedQ}&quot;.</p>
                <p className="text-[10px] text-muted/60">Try searching for an agent name (Jett), weapon (Vandal), map (Ascent), or sensitivity conversion.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filtered.map((item, idx) => (
                  <Link
                    key={`${item.href}-${idx}`}
                    href={item.href}
                    className="group border border-[rgba(236,232,225,0.08)] bg-[#0D1820] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/50 transition-all shadow-md"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className={`font-mono text-[9px] uppercase px-2 py-0.5 border font-bold ${TYPE_COLOR[item.type]}`}>
                          {item.type}
                        </span>
                        <h3 className="font-display font-black text-lg uppercase text-white group-hover:text-primary transition-colors truncate">
                          {item.title}
                        </h3>
                        {item.meta && (
                          <span className="hidden sm:inline font-mono text-[10px] text-muted">
                            · {item.meta}
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs text-secondary line-clamp-2">
                        {item.desc}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 font-mono text-xs uppercase text-primary font-bold group-hover:translate-x-1 transition-transform">
                      <span>Access</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </Container>
      </div>
    </PageTransition>
  );
}
