"use client";

import React from "react";
import Link from "next/link";
import { 
  Network, Users, ShieldAlert, MapPin, Crosshair, 
  BookOpen, GitCompare, ArrowRight, Sparkles, CheckCircle, Info 
} from "lucide-react";
import type { AgentKnowledgeNode } from "@/lib/knowledge-graph";

interface Props {
  node: AgentKnowledgeNode;
}

export function KnowledgeGraphView({ node }: Props) {
  return (
    <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 sm:p-8 clip-diagonal space-y-8 shadow-2xl">
      
      {/* Knowledge Graph Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(236,232,225,0.08)] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest font-bold">
            <Network className="h-4 w-4" />
            <span>KNOWLEDGE GRAPH // CANONICAL ENTITY RELATIONS</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl uppercase text-white">
            RELATIONAL TACTICAL WEB · {node.name.toUpperCase()}
          </h2>
          <p className="font-sans text-xs text-secondary">
            Cross-entity intelligence connecting operative synergies, hard counter matchups, weapon ballistics, map geography, and lore dossiers.
          </p>
        </div>

        <Link
          href={node.crossLinks.compBuilderUrl}
          className="font-mono text-xs uppercase px-4 py-2 border border-primary/40 bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors flex items-center gap-2 shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>Launch Comp Builder with {node.name}</span>
        </Link>
      </div>

      {/* Grid of Knowledge Graph Hubs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Hub 1: Synergies */}
        <div className="border border-[rgba(236,232,225,0.06)] bg-[#08111A] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.06)] pb-3">
            <div className="flex items-center gap-2 text-[#0DF2F2]">
              <Users className="h-4 w-4" />
              <h3 className="font-mono text-xs uppercase font-bold text-white">High-Synergy Partners</h3>
            </div>
            <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-[#0DF2F2]/10 text-[#0DF2F2]">
              Co-Op Utility
            </span>
          </div>

          <div className="space-y-3">
            {node.tactical.synergies.map(syn => (
              <div key={syn.agentSlug} className="p-3 border border-[rgba(236,232,225,0.04)] bg-[#0B141A] space-y-1.5">
                <div className="flex items-center justify-between">
                  <Link 
                    href={`/agents/${syn.agentSlug}`}
                    className="font-display font-black text-sm uppercase text-white hover:text-[#0DF2F2] transition-colors"
                  >
                    + {syn.agentName}
                  </Link>
                  <span className="font-mono text-[9px] text-[#0DF2F2]">{syn.comboAbility}</span>
                </div>
                <p className="font-sans text-[11px] text-secondary leading-relaxed">
                  {syn.synergyReason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hub 2: Direct Hard Counters */}
        <div className="border border-error/20 bg-[#08111A] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.06)] pb-3">
            <div className="flex items-center gap-2 text-error">
              <ShieldAlert className="h-4 w-4" />
              <h3 className="font-mono text-xs uppercase font-bold text-white">Hard Matchup Counters</h3>
            </div>
            <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-error/10 text-error font-bold">
              Danger Alert
            </span>
          </div>

          <div className="space-y-3">
            {node.tactical.counters.map(ctr => (
              <div key={ctr.agentSlug} className="p-3 border border-error/10 bg-[#0B141A] space-y-1.5">
                <div className="flex items-center justify-between">
                  <Link 
                    href={`/agents/${ctr.agentSlug}`}
                    className="font-display font-black text-sm uppercase text-white hover:text-error transition-colors"
                  >
                    vs. {ctr.agentName}
                  </Link>
                  <span className={`font-mono text-[9px] font-bold ${ctr.dangerLevel === "HIGH" ? "text-error" : "text-amber-400"}`}>
                    {ctr.dangerLevel} THREAT
                  </span>
                </div>
                <p className="font-sans text-[11px] text-secondary leading-relaxed">
                  {ctr.counterReason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hub 3: Weapon & Map Ecosystem */}
        <div className="border border-[rgba(236,232,225,0.06)] bg-[#08111A] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.06)] pb-3">
            <div className="flex items-center gap-2 text-primary">
              <Crosshair className="h-4 w-4" />
              <h3 className="font-mono text-xs uppercase font-bold text-white">Loadout & Battlegrounds</h3>
            </div>
            <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-primary/10 text-primary">
              Optimal Geometry
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="font-mono text-[10px] uppercase text-muted block mb-1.5">Signature Weapons:</span>
              <div className="flex flex-wrap gap-2">
                {node.tactical.signatureWeapons.map(w => (
                  <Link
                    key={w.slug}
                    href={`/weapons/${w.slug}`}
                    className="font-mono text-xs uppercase px-2.5 py-1 border border-primary/30 bg-primary/5 text-primary hover:bg-primary/20 transition-colors"
                  >
                    {w.name} →
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[rgba(236,232,225,0.04)]">
              <span className="font-mono text-[10px] uppercase text-muted block mb-1.5">S-Tier Map Deployments:</span>
              <div className="flex flex-wrap gap-2">
                {node.tactical.bestMaps.map(m => (
                  <Link
                    key={m.slug}
                    href={`/maps/${m.slug}`}
                    className="font-mono text-xs uppercase px-2.5 py-1 border border-[rgba(236,232,225,0.1)] bg-[#0B141A] text-white hover:border-primary/40 transition-colors"
                  >
                    {m.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Relational Cross-Links: Lore, Guides, and Comparisons */}
      <div className="grid gap-4 sm:grid-cols-3 pt-2">
        {node.crossLinks.loreSlug && (
          <Link
            href={`/lore/${node.crossLinks.loreSlug}`}
            className="p-4 border border-[#0DF2F2]/30 bg-[#0DF2F2]/5 hover:bg-[#0DF2F2]/10 transition-colors flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <span className="font-mono text-[9px] uppercase text-[#0DF2F2] block">Source-Backed Lore</span>
              <span className="font-sans text-xs font-bold text-white group-hover:text-[#0DF2F2] transition-colors">
                {node.crossLinks.loreTitle || `${node.name} Dossier`}
              </span>
            </div>
            <BookOpen className="h-4 w-4 text-[#0DF2F2] shrink-0" />
          </Link>
        )}

        <Link
          href={`/compare/agents/${node.crossLinks.compareSlug}`}
          className="p-4 border border-purple-400/30 bg-purple-400/5 hover:bg-purple-400/10 transition-colors flex items-center justify-between group"
        >
          <div className="space-y-0.5">
            <span className="font-mono text-[9px] uppercase text-purple-400 block">Head-to-Head Duel</span>
            <span className="font-sans text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
              {node.crossLinks.compareName}
            </span>
          </div>
          <GitCompare className="h-4 w-4 text-purple-400 shrink-0" />
        </Link>

        <Link
          href={node.crossLinks.bestForUrl}
          className="p-4 border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors flex items-center justify-between group"
        >
          <div className="space-y-0.5">
            <span className="font-mono text-[9px] uppercase text-primary block">Tactical Ranking</span>
            <span className="font-sans text-xs font-bold text-white group-hover:text-primary transition-colors">
              Best Agents for Solo Queue
            </span>
          </div>
          <ArrowRight className="h-4 w-4 text-primary shrink-0" />
        </Link>
      </div>

      {/* ── Transparent Data Attribution Bar ── */}
      <div className="pt-4 border-t border-[rgba(236,232,225,0.08)] flex flex-wrap items-center justify-between gap-3 text-muted font-mono text-[10px]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5 text-secondary">
            <Info className="h-3.5 w-3.5 text-primary" />
            <span>Tier Rating: <strong className="text-white">{node.attribution.tierAttribution}</strong></span>
          </span>
          <span>Pro Presence: <strong className="text-white">{node.attribution.proPresenceAttribution}</strong></span>
          <span>Telemetry: <strong className="text-white">{node.attribution.telemetryAttribution}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span>{node.attribution.patchVersion}</span>
          <span>·</span>
          <span>Verified: {node.attribution.lastVerified}</span>
          <span>·</span>
          <Link href="/methodology" className="text-primary hover:underline font-bold">
            Methodology →
          </Link>
        </div>
      </div>

    </div>
  );
}
