"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Network, Users, ShieldAlert, MapPin, Crosshair, 
  BookOpen, GitCompare, ArrowRight, Sparkles, CheckCircle, Info, ShieldCheck 
} from "lucide-react";
import type { AgentKnowledgeNode } from "@/lib/knowledge-graph";
import { DataTrustBadge } from "./data-trust-badge";

interface Props {
  node: AgentKnowledgeNode;
}

export function KnowledgeGraphView({ node }: Props) {
  const [showDrawer, setShowDrawer] = useState(false);

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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className="font-mono text-xs uppercase px-3 py-2 border border-[rgba(236,232,225,0.15)] bg-[#08111A] text-secondary hover:text-white flex items-center gap-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>How We Know This</span>
          </button>

          <Link
            href={node.crossLinks.compBuilderUrl}
            className="font-mono text-xs uppercase px-4 py-2 border border-primary/40 bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors flex items-center gap-2 shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            <span>Launch Comp Builder with {node.name}</span>
          </Link>
        </div>
      </div>

      {/* Expandable "How We Know This" Drawer */}
      {showDrawer && (
        <div className="border border-primary/30 bg-[#08111A] p-5 clip-diagonal space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.06)] pb-3">
            <span className="font-mono text-xs uppercase text-primary font-bold">
              {"// FIELD-SPECIFIC PROVENANCE AUDIT"}
            </span>
            <span className="font-mono text-[10px] text-muted">Patch 9.04 Baseline</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 font-mono text-xs">
            <div className="p-3 bg-[#0B141A] border border-[rgba(236,232,225,0.04)]">
              <span className="text-[10px] text-muted block uppercase">Role Classification:</span>
              <strong className="text-white block mt-0.5">{node.role}</strong>
              <span className="text-[9px] text-[#0DF2F2] block mt-1">Source: Riot Character API</span>
            </div>
            <div className="p-3 bg-[#0B141A] border border-[rgba(236,232,225,0.04)]">
              <span className="text-[10px] text-muted block uppercase">Meta Tier Rating:</span>
              <strong className="text-white block mt-0.5">{node.meta.tier}</strong>
              <span className="text-[9px] text-primary block mt-1">Source: Editorial Analysis</span>
            </div>
            <div className="p-3 bg-[#0B141A] border border-[rgba(236,232,225,0.04)]">
              <span className="text-[10px] text-muted block uppercase">Pro Match Presence:</span>
              <strong className="text-white block mt-0.5">{node.meta.pickRate}</strong>
              <span className="text-[9px] text-amber-400 block mt-1">Source: VCT Tournament Dataset</span>
            </div>
          </div>
        </div>
      )}

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
              Neutralization Alert
            </span>
          </div>

          <div className="space-y-3">
            {node.tactical.counters.map(cnt => (
              <div key={cnt.agentSlug} className="p-3 border border-error/10 bg-[#0B141A] space-y-1.5">
                <div className="flex items-center justify-between">
                  <Link 
                    href={`/agents/${cnt.agentSlug}`}
                    className="font-display font-black text-sm uppercase text-white hover:text-error transition-colors"
                  >
                    ⚠️ {cnt.agentName}
                  </Link>
                  <span className="font-mono text-[9px] text-error font-bold">{cnt.dangerLevel} THREAT</span>
                </div>
                <p className="font-sans text-[11px] text-secondary leading-relaxed">
                  {cnt.counterReason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hub 3: Loadout & S-Tier Battlegrounds */}
        <div className="border border-[rgba(236,232,225,0.06)] bg-[#08111A] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.06)] pb-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Crosshair className="h-4 w-4" />
              <h3 className="font-mono text-xs uppercase font-bold text-white">Signature Weapon & Maps</h3>
            </div>
            <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-amber-400/10 text-amber-400">
              Optimal Loadout
            </span>
          </div>

          <div className="space-y-3">
            {/* Signature weapons */}
            <div className="space-y-1.5">
              <span className="font-mono text-[9px] uppercase text-muted block">Signature Weapons:</span>
              {node.tactical.signatureWeapons.map(w => (
                <div key={w.slug} className="p-2.5 border border-[rgba(236,232,225,0.04)] bg-[#0B141A] flex items-center justify-between">
                  <span className="font-display font-black text-xs uppercase text-white">{w.name}</span>
                  <Link href={`/weapons/${w.slug}`} className="font-mono text-[9px] text-primary hover:underline">
                    Ballistics →
                  </Link>
                </div>
              ))}
            </div>

            {/* Best maps */}
            <div className="space-y-1.5 pt-2">
              <span className="font-mono text-[9px] uppercase text-muted block">High Win-Rate Maps:</span>
              {node.tactical.bestMaps.map(m => (
                <div key={m.slug} className="p-2.5 border border-[rgba(236,232,225,0.04)] bg-[#0B141A] flex items-center justify-between">
                  <span className="font-display font-black text-xs uppercase text-white">{m.name}</span>
                  <Link href={`/maps/${m.slug}`} className="font-mono text-[9px] text-primary hover:underline">
                    Map Meta →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Relational Cross-Links Bar */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-2">
        {node.crossLinks.loreSlug && (
          <Link
            href={`/lore/${node.crossLinks.loreSlug}`}
            className="p-4 border border-purple-400/30 bg-purple-400/5 hover:bg-purple-400/10 transition-colors flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <span className="font-mono text-[9px] uppercase text-purple-400 block">Canon Lore Archive</span>
              <span className="font-sans text-xs font-bold text-white group-hover:text-purple-400 transition-colors truncate">
                {node.crossLinks.loreTitle || `${node.name} Dossier`}
              </span>
            </div>
            <BookOpen className="h-4 w-4 text-purple-400 shrink-0" />
          </Link>
        )}

        {node.crossLinks.compareSlug && (
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
        )}

        {node.crossLinks.bestForUrl && (
          <Link
            href={node.crossLinks.bestForUrl}
            className="p-4 border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <span className="font-mono text-[9px] uppercase text-primary block">Tactical Ranking</span>
              <span className="font-sans text-xs font-bold text-white group-hover:text-primary transition-colors">
                {node.crossLinks.bestForTitle || "Tactical Tier List"}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-primary shrink-0" />
          </Link>
        )}
      </div>

      {/* ── Transparent Data Attribution Bar ── */}
      <DataTrustBadge
        sourceType="EDITORIAL_ANALYSIS"
        sourceName="VloPedia Radiant Desk + VCT Pro Dataset"
        patchVersion={node.fieldAttributions.tier?.patchVersion || "9.04"}
        lastVerified={node.fieldAttributions.tier?.lastVerified || "September 3, 2026"}
        confidence="HIGH"
      />

    </div>
  );
}
