"use client";

import { Container } from "@/components/container";
import { MapCard } from "@/components/map-card";
import { PageTransition, StaggerContainer } from "@/components/motion-system";

export interface MapData {
  slug: string;
  name: string;
  location?: string;
  splashUrl: string;
  lore?: string;
}

interface MapsClientProps {
  initialMaps: MapData[];
}

export function MapsClient({ initialMaps }: MapsClientProps) {
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
          </Container>
        </div>

        {/* Masonry-inspired alternating grid */}
        {initialMaps.length > 0 && (
          <Container className="py-16">
            <StaggerContainer
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {initialMaps.map((map, i) => {
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
