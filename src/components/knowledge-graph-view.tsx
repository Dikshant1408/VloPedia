"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Network, Users, ShieldAlert, MapPin, Crosshair, 
  BookOpen, GitCompare, ArrowRight, Sparkles, CheckCircle, Info, ShieldCheck 
} from "lucide-react";
import type { AgentKnowledgeNode } from "@/lib/knowledge-graph";
import { DataTrustBadge } from "./data-trust-badge";
import { KnowledgeGraph3DModal } from "@/components/3d/knowledge-graph-3d-modal";

interface Props {
  node: AgentKnowledgeNode;
}

export function KnowledgeGraphView({ node }: Props) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [show3DModal, setShow3DModal] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-surface-card p-6 sm:p-8 space-y-8 shadow-xs">
      
      {/* Knowledge Graph Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider font-semibold">
            <Network className="h-4 w-4" />
            <span>Agent Strategy & Synergies</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-foreground">
            Entity Connections · {node.name}
          </h2>
          <p className="font-sans text-xs text-secondary">
            Cross-entity database connecting agent synergies, counter matchups, weapon pairings, and map strategies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShow3DModal(true)}
            className="font-sans text-xs font-medium rounded-md px-3.5 py-2 border border-primary bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center gap-1.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <Network className="h-3.5 w-3.5" />
            <span>Spatial 3D Web</span>
          </button>

          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className="font-sans text-xs font-medium rounded-md px-3 py-2 border border-border bg-surface-muted text-secondary hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Data Sources</span>
          </button>

          <Link
            href={node.crossLinks.compBuilderUrl}
            className="font-sans text-xs font-medium rounded-md px-4 py-2 border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-2 shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            <span>Build Comp with {node.name}</span>
          </Link>
        </div>
      </div>

      {/* Expandable "Data Sources" Drawer */}
      {showDrawer && (
        <div className="rounded-lg border border-border bg-surface-muted p-5 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="font-sans text-xs uppercase text-primary font-semibold">
              Data Provenance Audit
            </span>
            <span className="font-mono text-xs text-muted">Patch 9.04 Baseline</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 font-mono text-xs">
            <div className="p-3 bg-surface rounded-md border border-border">
              <span className="text-[10px] text-muted block uppercase">Role Classification:</span>
              <strong className="text-foreground block mt-0.5">{node.role}</strong>
              <span className="text-[10px] text-secondary block mt-1">Source: Official Game Data</span>
            </div>
            <div className="p-3 bg-surface rounded-md border border-border">
              <span className="text-[10px] text-muted block uppercase">Meta Tier Rating:</span>
              <strong className="text-foreground block mt-0.5">{node.meta.tier}</strong>
              <span className="text-[10px] text-primary block mt-1">Source: Editorial Analysis</span>
            </div>
            <div className="p-3 bg-surface rounded-md border border-border">
              <span className="text-[10px] text-muted block uppercase">Pro Match Presence:</span>
              <strong className="text-foreground block mt-0.5">{node.meta.pickRate}</strong>
              <span className="text-[10px] text-amber-400 block mt-1">Source: VCT Tournament Dataset</span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Knowledge Graph Hubs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Hub 1: Synergies */}
        <div className="rounded-lg border border-border bg-surface-muted p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 text-primary">
              <Users className="h-4 w-4" />
              <h3 className="font-sans text-xs uppercase font-semibold text-foreground">High-Synergy Partners</h3>
            </div>
            <span className="font-sans text-[10px] rounded px-1.5 py-0.5 bg-primary/10 text-primary font-medium">
              Co-Op Utility
            </span>
          </div>

          <div className="space-y-3">
            {node.tactical.synergies.map(syn => (
              <div key={syn.agentSlug} className="p-3 rounded-md border border-border bg-surface space-y-1.5">
                <div className="flex items-center justify-between">
                  <Link 
                    href={`/agents/${syn.agentSlug}`}
                    className="font-display font-bold text-sm uppercase text-foreground hover:text-primary transition-colors"
                  >
                    + {syn.agentName}
                  </Link>
                  <span className="font-mono text-[10px] text-secondary">{syn.comboAbility}</span>
                </div>
                <p className="font-sans text-xs text-secondary leading-relaxed">
                  {syn.synergyReason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hub 2: Direct Hard Counters */}
        <div className="rounded-lg border border-border bg-surface-muted p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 text-error">
              <ShieldAlert className="h-4 w-4" />
              <h3 className="font-sans text-xs uppercase font-semibold text-foreground">Counter Matchups</h3>
            </div>
            <span className="font-sans text-[10px] rounded px-1.5 py-0.5 bg-error/10 text-error font-medium">
              Matchup Warning
            </span>
          </div>

          <div className="space-y-3">
            {node.tactical.counters.map(cnt => (
              <div key={cnt.agentSlug} className="p-3 rounded-md border border-border bg-surface space-y-1.5">
                <div className="flex items-center justify-between">
                  <Link 
                    href={`/agents/${cnt.agentSlug}`}
                    className="font-display font-bold text-sm uppercase text-foreground hover:text-error transition-colors"
                  >
                    ⚠️ {cnt.agentName}
                  </Link>
                  <span className="font-mono text-[10px] text-error font-semibold">{cnt.dangerLevel} Threat</span>
                </div>
                <p className="font-sans text-xs text-secondary leading-relaxed">
                  {cnt.counterReason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Hub 3: Loadout & Maps */}
        <div className="rounded-lg border border-border bg-surface-muted p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Crosshair className="h-4 w-4" />
              <h3 className="font-sans text-xs uppercase font-semibold text-foreground">Weapon & Map Pairings</h3>
            </div>
            <span className="font-sans text-[10px] rounded px-1.5 py-0.5 bg-amber-400/10 text-amber-400 font-medium">
              Loadout
            </span>
          </div>

          <div className="space-y-3">
            {/* Signature weapons */}
            <div className="space-y-1.5">
              <span className="font-sans text-xs text-muted block font-medium">Preferred Weapons:</span>
              {node.tactical.signatureWeapons.map(w => (
                <div key={w.slug} className="p-2.5 rounded-md border border-border bg-surface flex items-center justify-between">
                  <span className="font-display font-bold text-xs uppercase text-foreground">{w.name}</span>
                  <Link href={`/weapons/${w.slug}`} className="font-sans text-xs text-primary hover:underline">
                    View weapon →
                  </Link>
                </div>
              ))}
            </div>

            {/* Best maps */}
            <div className="space-y-1.5 pt-2">
              <span className="font-sans text-xs text-muted block font-medium">High Win-Rate Maps:</span>
              {node.tactical.bestMaps.map(m => (
                <div key={m.slug} className="p-2.5 rounded-md border border-border bg-surface flex items-center justify-between">
                  <span className="font-display font-bold text-xs uppercase text-foreground">{m.name}</span>
                  <Link href={`/maps/${m.slug}`} className="font-sans text-xs text-primary hover:underline">
                    View map →
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
            className="p-4 rounded-lg border border-border bg-surface-card hover:border-border-light hover:shadow-xs transition-all flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <span className="font-sans text-[10px] uppercase text-muted block font-medium">Canon Lore</span>
              <span className="font-sans text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {node.crossLinks.loreTitle || `${node.name} Story`}
              </span>
            </div>
            <BookOpen className="h-4 w-4 text-muted group-hover:text-primary transition-colors shrink-0" />
          </Link>
        )}

        {node.crossLinks.compareSlug && (
          <Link
            href={`/compare/agents/${node.crossLinks.compareSlug}`}
            className="p-4 rounded-lg border border-border bg-surface-card hover:border-border-light hover:shadow-xs transition-all flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <span className="font-sans text-[10px] uppercase text-muted block font-medium">Head-to-Head</span>
              <span className="font-sans text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                {node.crossLinks.compareName}
              </span>
            </div>
            <GitCompare className="h-4 w-4 text-muted group-hover:text-primary transition-colors shrink-0" />
          </Link>
        )}

        {node.crossLinks.bestForUrl && (
          <Link
            href={node.crossLinks.bestForUrl}
            className="p-4 rounded-lg border border-border bg-surface-card hover:border-border-light hover:shadow-xs transition-all flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <span className="font-sans text-[10px] uppercase text-muted block font-medium">Tier Ranking</span>
              <span className="font-sans text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                {node.crossLinks.bestForTitle || "Tier List Rank"}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted group-hover:text-primary transition-colors shrink-0" />
          </Link>
        )}
      </div>

      {/* ── Transparent Data Attribution Bar ── */}
      <DataTrustBadge
        sourceType="EDITORIAL_ANALYSIS"
        sourceName="VloPedia Editorial Desk + VCT Pro Dataset"
        patchVersion={node.fieldAttributions.tier?.patchVersion || "9.04"}
        lastVerified={node.fieldAttributions.tier?.lastVerified || "September 3, 2026"}
        confidence="HIGH"
      />

      {/* ── Interactive 3D Spatial Knowledge Web Modal ── */}
      <KnowledgeGraph3DModal
        isOpen={show3DModal}
        onClose={() => setShow3DModal(false)}
        node={node}
      />

    </div>
  );
}
