"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Container } from "@/components/container";
import { BundleCard } from "@/components/bundle-card";
import { PageTransition, Reveal } from "@/components/motion-system";
import type { ValorantBundle } from "@/lib/valorant-types";

export interface BundleData extends ValorantBundle {
  price?: number;
  active?: boolean;
}

interface BundlesClientProps {
  initialBundles: BundleData[];
}

export function BundlesClient({ initialBundles }: BundlesClientProps) {
  const [search, setSearch]   = useState("");

  const filtered = search
    ? initialBundles.filter(b => b.displayName.toLowerCase().includes(search.toLowerCase()))
    : initialBundles;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        {/* Page header */}
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">
                BUNDLE REGISTRY
              </span>
            </div>
            <h1 className="font-display font-black text-6xl uppercase tracking-tighter text-foreground sm:text-7xl lg:text-8xl">
              BUNDLES
            </h1>
            <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-muted">
              Every weapon bundle — past and present. Inspect contents and add to your wishlist.
            </p>

            {/* Search */}
            <div className="relative mt-8 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search bundles…"
                aria-label="Search bundles"
                className="w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] py-2.5 pl-10 pr-4 font-sans text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none"
              />
            </div>
          </Container>
        </div>

        {/* Editorial magazine grid */}
        <Container className="py-16">
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-mono text-sm font-bold uppercase tracking-wider text-muted">
                No bundles match &quot;{search}&quot;
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {filtered.map((bundle, i) => (
                <Reveal key={bundle.uuid}>
                  <BundleCard
                    bundle={bundle}
                    showActiveBadge
                    variant={i === 0 ? "hero" : "card"}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </div>
    </PageTransition>
  );
}
