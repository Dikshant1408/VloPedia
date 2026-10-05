"use client";

import { useState } from "react";
import { Container } from "@/components/container";
import { MapCard } from "@/components/map-card";
import { PageTransition, StaggerContainer } from "@/components/motion-system";

export interface MapData {
  slug: string;
  name: string;
  location?: string;
  splashUrl: string;
  lore?: string;
  rotationStatus?: "active" | "reserve" | "tdm";
}

interface MapsClientProps {
  initialMaps: MapData[];
}

export function MapsClient({ initialMaps }: MapsClientProps) {
  const [filter, setFilter] = useState<"all" | "active" | "reserve" | "tdm">("all");

  const filteredMaps = initialMaps.filter((map) => {
    if (filter === "all") return true;
    return map.rotationStatus === filter;
  });

  const activeCount = initialMaps.filter(m => m.rotationStatus === "active").length;
  const reserveCount = initialMaps.filter(m => m.rotationStatus === "reserve").length;
  const tdmCount = initialMaps.filter(m => m.rotationStatus === "tdm").length;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        {/* Page header */}
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">TACTICAL BLUEPRINTS</span>
            </div>
            <h1 className="font-display font-black text-6xl uppercase tracking-tighter text-foreground sm:text-7xl lg:text-8xl">
              MAPS
            </h1>
            <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-muted">
              Every active deployment zone — callouts, lore, and tactical intel.
            </p>

            {/* Rotation Filter Tabs */}
            <div className="mt-8 flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all border ${
                  filter === "all"
                    ? "bg-primary text-black border-primary"
                    : "bg-[#0D1A22] text-muted border-border hover:border-primary/40 hover:text-white"
                }`}
              >
                All Available Maps ({initialMaps.length})
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all border ${
                  filter === "active"
                    ? "bg-primary text-black border-primary"
                    : "bg-[#0D1A22] text-muted border-border hover:border-primary/40 hover:text-white"
                }`}
              >
                Active Rotation ({activeCount})
              </button>
              <button
                onClick={() => setFilter("reserve")}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all border ${
                  filter === "reserve"
                    ? "bg-primary text-black border-primary"
                    : "bg-[#0D1A22] text-muted border-border hover:border-primary/40 hover:text-white"
                }`}
              >
                Reserve Pool ({reserveCount})
              </button>
              <button
                onClick={() => setFilter("tdm")}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all border ${
                  filter === "tdm"
                    ? "bg-[#0DF2F2] text-black border-[#0DF2F2]"
                    : "bg-[#0D1A22] text-muted border-border hover:border-[#0DF2F2]/40 hover:text-white"
                }`}
              >
                Team Deathmatch ({tdmCount})
              </button>
            </div>
          </Container>
        </div>

        {/* Masonry-inspired alternating grid */}
        {filteredMaps.length > 0 && (
          <Container className="py-16">
            <StaggerContainer
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredMaps.map((map, i) => {
                const isLarge = i % 7 === 0;
                return (
                  <div key={map.slug} className={isLarge ? "sm:col-span-2 lg:col-span-2" : ""}>
                    <MapCard map={map} size={isLarge ? "large" : "small"} />
                  </div>
                );
              })}
            </StaggerContainer>
          </Container>
        )}
      </div>
    </PageTransition>
  );
}
