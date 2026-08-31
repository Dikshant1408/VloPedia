"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { RoleBadge } from "@/components/role-badge";
import type { ValorantAgent } from "@/lib/valorant-types";

/* ── Static tier assignments (community meta) ── */
const TIER_SLUGS: Record<string, string[]> = {
  S: ["jett", "omen", "killjoy", "sova", "clove", "vyse"],
  A: ["breach", "fade", "kayo", "neon", "raze", "reyna", "skye", "sage", "chamber", "viper"],
  B: ["astra", "brimstone", "harbor", "iso", "yoru", "deadlock", "gekko", "cypher"],
  C: ["phoenix", "skye", "tejo", "waylay"],
};

const TIER_STYLE: Record<string, { bg: string; border: string; text: string; label: string }> = {
  S: { bg: "bg-primary/10",    border: "border-primary/50",  text: "text-primary",   label: "META DEFINING"   },
  A: { bg: "bg-amber-500/10",  border: "border-amber-500/30",text: "text-amber-400", label: "STRONG PICK"     },
  B: { bg: "bg-sky-500/10",    border: "border-sky-500/30",  text: "text-sky-400",   label: "VIABLE OPTION"   },
  C: { bg: "bg-zinc-600/10",   border: "border-zinc-600/30", text: "text-zinc-400",  label: "SITUATIONAL"     },
};

const ROLES = ["All", "Duelist", "Controller", "Initiator", "Sentinel"] as const;

export default function TierListPage() {
  const [agents,     setAgents]     = useState<ValorantAgent[]>([]);
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true")
      .then(r => r.json())
      .then(j => setAgents(j.data ?? []))
      .catch(() => {});
  }, []);

  const getAgentsForTier = (tier: string) => {
    const slugs = TIER_SLUGS[tier] ?? [];
    return agents.filter(a => {
      const nameSlug = a.displayName.toLowerCase().replace(/[^a-z]/g, "");
      const inTier   = slugs.some(s => nameSlug.includes(s) || s.includes(nameSlug));
      const roleOk   = roleFilter === "All" || a.role?.displayName === roleFilter;
      return inTier && roleOk;
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">

        {/* Header */}
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">META REPORT</span>
            </div>
            <h1 className="font-display text-6xl uppercase tracking-tight text-white sm:text-7xl">TIER LIST</h1>
            <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-secondary">
              Current competitive meta rankings. Filter by role to narrow your focus.
            </p>

            {/* Role filter */}
            <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by role">
              {ROLES.map(r => (
                <button key={r} type="button" onClick={() => setRoleFilter(r)} aria-pressed={roleFilter===r}
                  className={[
                    "border px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest transition-all",
                    roleFilter===r ? "border-primary bg-primary/10 text-primary" : "border-border text-muted hover:border-white/30 hover:text-white",
                  ].join(" ")}>
                  {r}
                </button>
              ))}
            </div>
          </Container>
        </div>

        <Container className="py-12 space-y-4">
          {Object.keys(TIER_STYLE).map(tier => {
            const style    = TIER_STYLE[tier];
            const tierAgents = getAgentsForTier(tier);
            return (
              <Reveal key={tier}>
                <div className={`grid grid-cols-1 md:grid-cols-[140px_1fr] border overflow-hidden ${style.border}`}>
                  {/* Tier label */}
                  <div className={`flex flex-col items-center justify-center p-5 gap-1.5 border-b md:border-b-0 md:border-r min-h-[120px] select-none ${style.bg} ${style.border}`}>
                    <span className={`font-display text-6xl leading-none ${style.text}`}>{tier}</span>
                    <span className={`font-mono text-[8px] font-black uppercase tracking-widest ${style.text} opacity-70`}>
                      {style.label}
                    </span>
                  </div>

                  {/* Agent grid */}
                  <div className="flex flex-wrap gap-3 p-5 bg-background/50 items-center min-h-[120px]">
                    {tierAgents.length > 0 ? tierAgents.map(agent => (
                      <Link key={agent.uuid} href={`/agents/${agent.displayName.toLowerCase().replace(/\s+/g,"-")}`}
                        className="group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                        <div className="relative w-20 h-24 overflow-hidden border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] transition-all duration-300 group-hover:border-primary">
                          <Image src={agent.fullPortrait||agent.bustPortrait} alt={agent.displayName}
                            fill sizes="80px" className="object-cover object-top opacity-60 transition-all group-hover:opacity-90 group-hover:scale-105" unoptimized />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 px-1 py-1 text-center">
                            <span className="font-display text-[9px] uppercase text-white leading-none group-hover:text-primary transition-colors">
                              {agent.displayName}
                            </span>
                          </div>
                        </div>
                      </Link>
                    )) : (
                      <p className="font-mono text-[10px] text-muted">No agents in this tier for the selected filter.</p>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}

          {/* Meta note */}
          <Reveal>
            <div className="border border-border bg-[#0D1A22] p-5 mt-4">
              <p className="font-sans text-xs leading-relaxed text-muted">
                <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-wider block mb-2">
                  META NOTE
                </span>
                Rankings represent current patch competitive consensus. At least one S-tier Controller and Initiator is recommended for most compositions. Always consult agent profiles before selection.
              </p>
            </div>
          </Reveal>
        </Container>
      </div>
    </PageTransition>
  );
}
