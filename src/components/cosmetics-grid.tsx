"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import { Container } from "@/components/container";
import { PageTransition } from "@/components/motion-system";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface CosmeticItem {
  uuid:        string;
  displayName: string;
  /** Primary image to display */
  imageUrl:    string | null;
  /** Whether to render as <img> (preserves GIF animation) */
  animated?:   boolean;
  /** href for the item link */
  href?:       string;
}

interface CosmeticsGridProps {
  /** Page title shown in the header */
  title:        string;
  /** Small eyebrow label */
  eyebrow:      string;
  /** Subtitle shown below the title */
  subtitle:     string;
  /** Search placeholder text */
  searchPlaceholder: string;
  /** Aspect ratio for each card — "square" | "portrait" */
  cardAspect:   "square" | "portrait";
  /** Number of columns (Tailwind grid-cols-* applied at lg) */
  columns:      4 | 5 | 6;
  /** Fetch function — called on mount */
  fetchFn?:     () => Promise<CosmeticItem[]>;
  /** Pre-fetched items for SSR compatibility */
  initialItems?: CosmeticItem[];
}

/* ------------------------------------------------------------------ */
/* Shared grid component                                               */
/* ------------------------------------------------------------------ */

const PAGE_SIZE = 48;

export function CosmeticsGrid({
  title, eyebrow, subtitle, searchPlaceholder, cardAspect, columns, fetchFn, initialItems = [],
}: CosmeticsGridProps) {
  const [items,   setItems]   = useState<CosmeticItem[]>(initialItems);
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(initialItems.length === 0);
  const [page,    setPage]    = useState(1);

  useEffect(() => {
    if (initialItems.length === 0 && fetchFn) {
      fetchFn()
        .then(data => { setItems(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [initialItems, fetchFn]);

  const filtered = useMemo(
    () => search
      ? items.filter(i => i.displayName.toLowerCase().includes(search.toLowerCase()))
      : items,
    [items, search]
  );

  const shown = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = shown.length < filtered.length;

  const colClass = {
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  }[columns];

  const aspectStyle = cardAspect === "portrait"
    ? { aspectRatio: "3/4" }
    : { aspectRatio: "1/1" };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">

        {/* Header */}
        <div className="border-b border-border bg-background pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">
                {eyebrow}
              </span>
            </div>
            <h1 className="font-display text-6xl uppercase tracking-tight text-white sm:text-7xl">
              {title}
            </h1>
            <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-secondary">{subtitle}</p>

            {/* Search + count */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder}
                  className="w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] py-2.5 pl-9 pr-4 font-sans text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none"
                />
              </div>
              <span className="font-mono text-[11px] text-muted">
                {loading ? "Loading…" : `${filtered.length} item${filtered.length !== 1 ? "s" : ""}`}
              </span>
            </div>
          </Container>
        </div>

        <Container className="py-12">

          {/* Loading skeleton */}
          {loading && (
            <div className={`grid gap-3 ${colClass}`}>
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="animate-pulse border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)]" style={aspectStyle} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="py-24 text-center">
              <p className="font-mono text-sm font-bold uppercase tracking-wider text-muted">
                {search ? `No results for "${search}"` : "No items found"}
              </p>
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(""); setPage(1); }}
                  className="mt-3 font-mono text-[11px] font-bold uppercase tracking-wider text-primary transition-colors hover:text-white"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* Grid */}
          {!loading && filtered.length > 0 && (
            <>
              <div className={`grid gap-3 ${colClass}`}>
                {shown.map(item => (
                  <CosmeticCard key={item.uuid} item={item} aspectStyle={aspectStyle} />
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

/* ------------------------------------------------------------------ */
/* Individual card                                                     */
/* ------------------------------------------------------------------ */

function CosmeticCard({
  item,
  aspectStyle,
}: {
  item: CosmeticItem;
  aspectStyle: React.CSSProperties;
}) {
  const inner = (
    <div className="group relative flex flex-col border border-border bg-[#0D1A22] transition-all duration-300 hover:border-primary/50">
      {/* Image area */}
      <div
        className="relative overflow-hidden bg-black/50"
        style={aspectStyle}
      >
        {item.imageUrl && (
          item.animated ? (
            // Use <img> for animated GIFs (next/image strips animation)
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.displayName}
              className="absolute inset-0 h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.06]"
            />
          ) : (
            <Image
              src={item.imageUrl}
              alt={item.displayName}
              fill
              sizes="(max-width:640px) 50vw, (max-width:1024px) 25vw, 16vw"
              className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.06]"
              unoptimized
            />
          )
        )}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"
        />
      </div>

      {/* Name */}
      <div className="px-3 py-2.5">
        <p className="truncate font-sans text-[11px] font-bold leading-tight text-white group-hover:text-primary transition-colors">
          {item.displayName}
        </p>
      </div>
    </div>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
        {inner}
      </Link>
    );
  }
  return inner;
}
