"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Clock, Users } from "lucide-react";
import { Container } from "@/components/container";
import { PageTransition, Reveal, StaggerContainer } from "@/components/motion-system";
import type { ValorantGameMode } from "@/lib/valorant-types";

export default function GameModesPage() {
  const [modes, setModes] = useState<ValorantGameMode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://valorant-api.com/v1/gamemodes")
      .then(r => r.json())
      .then(j => {
        setModes((j.data ?? []).filter((m: ValorantGameMode) => m.displayIcon));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">

        {/* Header */}
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">OPERATIONS MODES</span>
            </div>
            <h1 className="font-display text-6xl uppercase tracking-tight text-white sm:text-7xl">GAME MODES</h1>
            <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-secondary">
              Every tactical operation scenario — rules, duration, and rotation status.
            </p>
          </Container>
        </div>

        <Container className="py-16">
          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] h-48" />
              ))}
            </div>
          ) : (
            <StaggerContainer className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {modes.map((mode, i) => (
                <Reveal key={mode.uuid}>
                  <div className="group relative border border-border bg-[#0D1A22] p-6 transition-all duration-300 hover:border-primary/50 cut-corner-br">

                    {/* Corner accent */}
                    <div aria-hidden="true" className="absolute left-0 top-0 h-[2px] w-10 bg-primary" />
                    <div aria-hidden="true" className="absolute left-0 top-0 h-10 w-[2px] bg-primary" />

                    {/* Active badge — first mode assumed active */}
                    {i === 0 && (
                      <div className="absolute right-0 top-0 bg-primary px-3 py-1 font-mono text-[9px] font-black tracking-wider text-black">
                        ACTIVE
                      </div>
                    )}

                    <div className="flex items-start gap-5">
                      {/* Mode icon */}
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-[rgba(236,232,225,0.08)] bg-[#08111A]/50 p-2">
                        <Image
                          src={mode.displayIcon!}
                          alt={mode.displayName}
                          fill
                          sizes="64px"
                          className="object-contain invert brightness-90 transition-transform duration-300 group-hover:scale-110"
                          unoptimized
                        />
                      </div>

                      <div className="min-w-0 space-y-2 flex-1">
                        <h2 className="font-display text-xl uppercase tracking-wide text-white leading-none">
                          {mode.displayName}
                        </h2>

                        <div className="flex flex-wrap gap-3 font-mono text-[10px]">
                          {mode.duration && (
                            <span className="flex items-center gap-1 text-muted">
                              <Clock className="h-3 w-3 text-primary" aria-hidden="true" />
                              {mode.duration}
                            </span>
                          )}
                          {mode.teamRoles && mode.teamRoles.length > 0 && (
                            <span className="flex items-center gap-1 text-muted">
                              <Users className="h-3 w-3 text-primary" aria-hidden="true" />
                              {mode.teamRoles.length} roles
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Orb count / rounds info */}
                    {(mode.orbCount > 0 || mode.roundsPerHalf > 0) && (
                      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                        {mode.orbCount > 0 && (
                          <div>
                            <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-muted">Orbs</span>
                            <span className="font-mono text-sm font-black text-white">{mode.orbCount}</span>
                          </div>
                        )}
                        {mode.roundsPerHalf > 0 && (
                          <div>
                            <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-muted">Rounds / Half</span>
                            <span className="font-mono text-sm font-black text-white">{mode.roundsPerHalf}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </StaggerContainer>
          )}
        </Container>
      </div>
    </PageTransition>
  );
}
