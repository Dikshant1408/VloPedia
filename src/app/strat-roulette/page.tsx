"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Shuffle } from "lucide-react";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/role-badge";
import type { ValorantAgent } from "@/lib/valorant-types";

const RULES = [
  "No abilities — guns only.",
  "Only buy weapons that cost 1000 VP or less.",
  "First buy of the round is locked in — no switching.",
  "The player with lowest credits must entry every round.",
  "Every player must buy a different weapon.",
  "Everyone uses the same agent role.",
  "You can only headshot (aim for head only).",
  "No running — walk everywhere.",
  "Buy the most expensive weapon available each round.",
  "All-in every round — spend every credit.",
  "Classic pistols only for the first 3 rounds.",
  "Each round a random player is designated entry fragger.",
  "Operators only — no other rifles.",
  "Force buy every single round.",
  "Smokes must be placed off-site.",
];

const MAPS = ["Ascent","Bind","Breeze","Fracture","Haven","Icebox","Lotus","Pearl","Split","Sunset","Abyss"];

export default function StratRoulettePage() {
  const [agents, setAgents]         = useState<ValorantAgent[]>([]);
  const [partySize, setPartySize]   = useState(5);
  const [lineup, setLineup]         = useState<ValorantAgent[]>([]);
  const [rule, setRule]             = useState<string | null>(null);
  const [map, setMap]               = useState<string | null>(null);
  const [rolled, setRolled]         = useState(false);

  useEffect(() => {
    fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true")
      .then(r => r.json())
      .then(j => setAgents(j.data ?? []))
      .catch(() => {});
  }, []);

  const roll = () => {
    if (agents.length === 0) return;
    const shuffled = [...agents].sort(() => Math.random() - 0.5);
    setLineup(shuffled.slice(0, partySize));
    setRule(RULES[Math.floor(Math.random() * RULES.length)]);
    setMap(MAPS[Math.floor(Math.random() * MAPS.length)]);
    setRolled(true);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-tactical-grid bg-tactical-dots opacity-20 z-0" />
        <div className="relative z-10">
          <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
            <Container>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
                <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">TACTICAL LABORATORY</span>
              </div>
              <h1 className="font-display text-5xl uppercase tracking-tight text-white sm:text-6xl">STRAT ROULETTE</h1>
              <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-secondary">
                Roll a random agent lineup, map, and challenge rule for your squad.
              </p>
            </Container>
          </div>

          <Container className="py-12 space-y-8">

            {/* Party size selector */}
            <Reveal>
              <div className="border border-border bg-[#0D1A22] p-6 cut-corner-br space-y-4">
                <fieldset>
                  <legend className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Party Size</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => setPartySize(n)} aria-pressed={partySize===n}
                        className={[
                          "h-10 w-10 border font-mono text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                          partySize===n ? "border-primary bg-primary/10 text-primary" : "border-border text-muted hover:border-white/30 hover:text-white",
                        ].join(" ")}>
                        {n}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <Button variant="primary" onClick={roll} className="cut-corner-br gap-2 w-full sm:w-auto" disabled={agents.length === 0}>
                  <Shuffle className="h-4 w-4" aria-hidden="true" />
                  {agents.length === 0 ? "Loading agents…" : "Roll Mission"}
                </Button>
              </div>
            </Reveal>

            {rolled && lineup.length > 0 && (
              <>
                {/* Map + Rule */}
                <Reveal>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="border border-role-initiator/30 bg-role-initiator/5 p-5 cut-corner-br">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-role-initiator">Assigned Map</span>
                      <p className="font-display text-4xl uppercase text-white mt-2">{map}</p>
                    </div>
                    <div className="border border-primary/30 bg-primary/5 p-5 cut-corner-br">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-primary">Challenge Rule</span>
                      <p className="font-sans text-sm leading-relaxed text-white mt-2">{rule}</p>
                    </div>
                  </div>
                </Reveal>

                {/* Agent lineup */}
                <Reveal>
                  <div className="space-y-4">
                    <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Agent Lineup</h2>
                    <div className="grid gap-4 sm:grid-cols-5">
                      {lineup.map((agent, i) => (
                        <div key={agent.uuid}
                          className="relative overflow-hidden border border-border bg-[#0D1A22]"
                          style={{ aspectRatio: "3/4" }}>
                          <Image src={agent.fullPortrait || agent.bustPortrait} alt={agent.displayName}
                            fill sizes="200px" className="object-cover object-top opacity-70" unoptimized />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                          <div className="absolute top-2 left-2">
                            <span className="font-mono text-[8px] font-black text-primary bg-black/80 px-1.5 py-0.5">
                              P{i+1}
                            </span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <RoleBadge role={agent.role?.displayName ?? ""} size="sm" />
                            <p className="font-display text-sm uppercase text-white leading-none mt-1.5">{agent.displayName}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </>
            )}
          </Container>
        </div>
      </div>
    </PageTransition>
  );
}
