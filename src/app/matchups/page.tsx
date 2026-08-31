"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { RoleBadge } from "@/components/role-badge";
import type { ValorantAgent } from "@/lib/valorant-types";

/* ── Static counter data (community meta) ── */
const COUNTERS: Record<string, string[]> = {
  Jett:       ["Cypher","Chamber","Deadlock","Killjoy"],
  Neon:       ["Cypher","Viper","Chamber","Sage"],
  Raze:       ["Viper","Sage","Deadlock","Cypher"],
  Reyna:      ["Viper","Omen","Sage","Harbor"],
  Phoenix:    ["Viper","Omen","Cypher","Fade"],
  Yoru:       ["Cypher","Fade","Sova","Gekko"],
  Iso:        ["Viper","Breach","Fade","Sova"],
  Waylay:     ["Cypher","Killjoy","Sage","Omen"],
  Omen:       ["Sova","Fade","Gekko","Breach"],
  Astra:      ["Sova","Fade","Yoru","Brimstone"],
  Brimstone:  ["Astra","Viper","Sova","Fade"],
  Viper:      ["Sova","Breach","Fade","Astra"],
  Harbor:     ["Sova","Fade","Breach","Gekko"],
  Clove:      ["Sova","Fade","Cypher","Breach"],
  Sova:       ["Viper","Omen","Astra","Cypher"],
  Fade:       ["Viper","Omen","Astra","Sova"],
  Breach:     ["Viper","Omen","Cypher","Deadlock"],
  "KAY/O":    ["Cypher","Viper","Killjoy","Sage"],
  Skye:       ["Cypher","Viper","Sova","Killjoy"],
  Gekko:      ["Viper","Sova","Cypher","Fade"],
  Tejo:       ["Cypher","Viper","Sova","Killjoy"],
  Cypher:     ["Sova","Fade","Gekko","Breach"],
  Killjoy:    ["Sova","Breach","Fade","KAY/O"],
  Sage:       ["Sova","Jett","Neon","Fade"],
  Deadlock:   ["Sova","Breach","Jett","Raze"],
  Chamber:    ["Fade","Sova","Breach","KAY/O"],
  Vyse:       ["Sova","Breach","Fade","Jett"],
};

export default function MatchupsPage() {
  const [agents, setAgents] = useState<ValorantAgent[]>([]);
  const [selected, setSelected] = useState<ValorantAgent | null>(null);
  const [search, setSearch]     = useState("");

  useEffect(() => {
    fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true")
      .then(r => r.json())
      .then(j => setAgents(j.data ?? []))
      .catch(() => {});
  }, []);

  const filtered = useMemo(() =>
    search ? agents.filter(a => a.displayName.toLowerCase().includes(search.toLowerCase())) : agents,
    [agents, search]
  );

  const counters = selected
    ? (COUNTERS[selected.displayName] ?? [])
        .map(name => agents.find(a => a.displayName === name))
        .filter(Boolean) as ValorantAgent[]
    : [];

  const counteredBy = selected
    ? agents.filter(a =>
        (COUNTERS[a.displayName] ?? []).includes(selected.displayName)
      )
    : [];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">META ANALYSIS</span>
            </div>
            <h1 className="font-display text-5xl uppercase tracking-tight text-white sm:text-6xl">AGENT MATCHUPS</h1>
            <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-secondary">
              Select an agent to see which agents counter them and which agents they counter.
            </p>
          </Container>
        </div>

        <Container className="py-12">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">

            {/* Agent picker */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input type="search" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search agent…" aria-label="Search agents"
                  className="w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] py-2.5 pl-9 pr-4 font-sans text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none" />
              </div>
              <div className="grid grid-cols-4 gap-2 max-h-[600px] overflow-y-auto pr-1">
                {filtered.map(agent => (
                  <button key={agent.uuid} type="button"
                    onClick={() => setSelected(agent)}
                    aria-pressed={selected?.uuid === agent.uuid}
                    aria-label={agent.displayName}
                    className={[
                      "relative overflow-hidden border transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                      selected?.uuid === agent.uuid
                        ? "border-primary bg-primary/10"
                        : "border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] hover:border-white/30",
                    ].join(" ")}
                    style={{ aspectRatio: "1/1.2" }}
                  >
                    <Image src={agent.bustPortrait || agent.displayIcon} alt={agent.displayName}
                      fill sizes="64px"
                      className={`object-cover transition-opacity ${selected?.uuid === agent.uuid ? "opacity-90" : "opacity-50 hover:opacity-80"}`}
                      unoptimized />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/85 px-0.5 py-0.5 text-center font-mono text-[7px] font-bold uppercase text-foreground truncate">
                      {agent.displayName}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Matchup detail */}
            <div>
              {!selected ? (
                <div className="flex h-64 items-center justify-center border border-dashed border-border">
                  <p className="font-mono text-sm text-muted">Select an agent to view matchups</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Selected agent header */}
                  <Reveal>
                    <div className="flex items-center gap-5 border border-border bg-[#0D1A22] p-5">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-[rgba(236,232,225,0.08)] bg-[#08111A]">
                        <Image src={selected.fullPortrait || selected.bustPortrait} alt={selected.displayName}
                          fill sizes="80px" className="object-cover object-top" unoptimized />
                      </div>
                      <div>
                        <h2 className="font-display text-3xl uppercase text-white">{selected.displayName}</h2>
                        <RoleBadge role={selected.role?.displayName ?? ""} size="sm" />
                        <p className="mt-1 font-sans text-xs text-muted line-clamp-2">{selected.description}</p>
                      </div>
                    </div>
                  </Reveal>

                  {/* Countered by */}
                  <Reveal>
                    <div className="space-y-4">
                      <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-error">
                        Countered By — {counteredBy.length} agents
                      </h3>
                      {counteredBy.length === 0 ? (
                        <p className="font-mono text-[11px] text-muted">No known counters listed.</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                          {counteredBy.map(agent => (
                            <AgentMatchupCard key={agent.uuid} agent={agent} type="counter" />
                          ))}
                        </div>
                      )}
                    </div>
                  </Reveal>

                  {/* Strong against */}
                  <Reveal>
                    <div className="space-y-4">
                      <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-success">
                        Strong Against — {counters.length} agents
                      </h3>
                      {counters.length === 0 ? (
                        <p className="font-mono text-[11px] text-muted">No known counters listed.</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                          {counters.map(agent => (
                            <AgentMatchupCard key={agent.uuid} agent={agent} type="strong" />
                          ))}
                        </div>
                      )}
                    </div>
                  </Reveal>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </PageTransition>
  );
}

function AgentMatchupCard({ agent, type }: { agent: ValorantAgent; type: "counter" | "strong" }) {
  const border = type === "counter" ? "border-error/40 hover:border-error" : "border-success/40 hover:border-success";
  const label  = type === "counter" ? "text-error" : "text-success";
  return (
    <div className={`group flex items-center gap-3 border bg-[#0D1A22] p-3 transition-all duration-200 ${border}`}>
      <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-[rgba(236,232,225,0.08)] bg-[#08111A]">
        <Image src={agent.bustPortrait || agent.displayIcon} alt={agent.displayName}
          fill sizes="48px" className="object-cover object-top" unoptimized />
      </div>
      <div className="min-w-0">
        <p className={`font-display text-sm uppercase leading-none ${label}`}>{agent.displayName}</p>
        <p className="font-mono text-[9px] text-muted mt-0.5">{agent.role?.displayName}</p>
      </div>
    </div>
  );
}
