"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { Container } from "@/components/container";
import { PageTransition, Reveal, StaggerContainer } from "@/components/motion-system";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import type { ValorantBundle } from "@/lib/valorant-types";
import { CONTENT_TIER_MAP } from "@/lib/valorant-types";

// Static hardcoded collections (legacy)
const STATIC_COLLECTIONS = [
  { slug: "kuronami-vandal", name: "Kuronami Collection",    count: 4,  cost: 9500, rarity: "EXCLUSIVE" },
  { slug: "reaver-vandal",   name: "Reaver 2.0 Collection",  count: 5,  cost: 7100, rarity: "PREMIUM"   },
  { slug: "oni-phantom",     name: "Oni 2.0 Collection",     count: 5,  cost: 7100, rarity: "PREMIUM"   },
];

export default function CollectionsPage() {
  const { user, signInWithDiscord } = useAuth();
  const [search, setSearch] = useState("");
  const [bundles, setBundles] = useState<ValorantBundle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://valorant-api.com/v1/bundles")
      .then(r => r.json())
      .then(j => { setBundles(j.data ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredBundles = search
    ? bundles.filter(b => b.displayName.toLowerCase().includes(search.toLowerCase()))
    : bundles;

  if (!user) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#0B141A] text-foreground">
          <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
            <Container>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
                <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">COLLECTION TRACKER</span>
              </div>
              <h1 className="font-display text-6xl uppercase tracking-tight text-white sm:text-7xl">COLLECTIONS</h1>
            </Container>
          </div>
          <Container className="py-24">
            <div className="mx-auto max-w-md text-center space-y-5">
              <p className="font-sans text-sm leading-relaxed text-secondary">
                Sign in to track which skins you own, see your collection value, and monitor completion across every bundle.
              </p>
              <Button variant="primary" onClick={signInWithDiscord} className="cut-corner-br">
                Sign in with Discord
              </Button>
            </div>
          </Container>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">COLLECTION TRACKER</span>
            </div>
            <h1 className="font-display text-6xl uppercase tracking-tight text-white sm:text-7xl">COLLECTIONS</h1>
            <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-secondary">
              Track your owned skins by bundle. See completion and collection value at a glance.
            </p>
          </Container>
        </div>

        <Container className="py-12 space-y-12">

          {/* Saved collections */}
          <section>
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-5">Saved Collections</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {STATIC_COLLECTIONS.map(col => (
                <Reveal key={col.slug}>
                  <Link href={`/collections/${col.slug}`}
                    className="group block border border-border bg-[#0D1A22] p-5 transition-all duration-300 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-display text-xl uppercase tracking-wide text-white group-hover:text-primary transition-colors">
                        {col.name}
                      </h3>
                      <span className="font-mono text-[9px] font-black uppercase tracking-widest text-primary border border-primary/30 bg-primary/10 px-2 py-0.5 shrink-0">
                        {col.rarity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px] text-muted">
                      <span>{col.count} items</span>
                      <span>{col.cost.toLocaleString()} VP</span>
                    </div>
                    <div className="mt-3 font-mono text-[10px] font-bold uppercase tracking-wider text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Track ownership →
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Browse all bundles to track */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Browse Bundles</h2>
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input type="search" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search bundles…" aria-label="Search bundles"
                  className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] py-2 pl-9 pr-4 font-sans text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none w-48" />
              </div>
            </div>

            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] h-32" />
                ))}
              </div>
            ) : (
              <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {filteredBundles.map(b => {
                  const img = b.verticalPromoImage ?? b.displayIcon2 ?? b.displayIcon;
                  return (
                    <Reveal key={b.uuid}>
                      <Link href={`/bundles/${b.uuid}`}
                        className="group relative flex items-center gap-4 border border-border bg-[#0D1A22] p-4 transition-all duration-200 hover:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                        {img && (
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-[rgba(236,232,225,0.08)] bg-[#08111A]">
                            <Image src={img} alt={b.displayName} fill sizes="64px" className="object-cover" unoptimized />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-display text-sm uppercase leading-tight text-white group-hover:text-primary transition-colors truncate">
                            {b.displayName}
                          </p>
                          <p className="font-mono text-[10px] text-muted mt-0.5">View bundle →</p>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </StaggerContainer>
            )}
          </section>
        </Container>
      </div>
    </PageTransition>
  );
}
