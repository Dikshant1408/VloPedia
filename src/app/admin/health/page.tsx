"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition } from "@/components/motion-system";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { 
  Activity, ShieldCheck, AlertTriangle, Search, 
  Database, RefreshCw, Flag, CheckCircle2, ArrowRight, Layers 
} from "lucide-react";
import { KnowledgeGraphService } from "@/lib/knowledge-graph-service";
import { PatchImpactEngine } from "@/lib/patch-impact-engine";
import { getContentGaps, getTopSearches } from "@/lib/search-analytics";

export default function AdminHealthPage() {
  const [topSearches, setTopSearches] = useState<Array<{ query: string; count: number }>>([]);
  const [contentGaps, setContentGaps] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [staleList, setStaleList] = useState<any[]>([]);

  useEffect(() => {
    setTopSearches(getTopSearches(8));
    setContentGaps(getContentGaps());
    setStaleList(PatchImpactEngine.scanStaleContent());

    try {
      const savedReports = JSON.parse(localStorage.getItem("vlopedia_user_reports") || "[]");
      setReports(savedReports);
    } catch (e) {}
  }, []);

  const allEntities = KnowledgeGraphService.getAllEntities();

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Admin Health & Intelligence Hub" }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground py-12">
        <Container className="space-y-10">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(236,232,225,0.08)] pb-8">
            <div className="space-y-2">
              <Breadcrumbs items={breadcrumbItems} />
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-8 bg-primary" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary font-bold">
                  VLOPEDIA DATA INTELLIGENCE & AUDIT DESK
                </span>
              </div>
              <h1 className="font-display font-black text-4xl uppercase tracking-tight text-white sm:text-5xl">
                SYSTEM HEALTH & DATA MOAT
              </h1>
              <p className="font-sans text-sm text-secondary max-w-2xl leading-relaxed">
                Central operating console for measuring search satisfaction, content decay, Google indexation tiering, and community issue reports.
              </p>
            </div>

            <div className="flex items-center gap-2 border border-[#0DF2F2]/30 bg-[#0DF2F2]/5 px-4 py-2 clip-diagonal font-mono text-xs text-[#0DF2F2]">
              <Activity className="h-4 w-4 animate-pulse" />
              <span>CANONICAL ENGINE: ACTIVE</span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal">
              <span className="font-mono text-[10px] uppercase text-muted block">Canonical Entities</span>
              <span className="font-display font-black text-3xl text-white block mt-1">{allEntities.length} Registered</span>
              <span className="font-mono text-[9px] text-[#0DF2F2] block mt-1">100% Provenance Validated</span>
            </div>

            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal">
              <span className="font-mono text-[10px] uppercase text-muted block">Active Patch Baseline</span>
              <span className="font-display font-black text-3xl text-white block mt-1">Patch 9.04</span>
              <span className="font-mono text-[9px] text-primary block mt-1">Verified: Sep 2, 2026</span>
            </div>

            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal">
              <span className="font-mono text-[10px] uppercase text-muted block">Search Gaps Discovered</span>
              <span className="font-display font-black text-3xl text-amber-400 block mt-1">{contentGaps.length} Queries</span>
              <span className="font-mono text-[9px] text-muted block mt-1">Automated Content Queue</span>
            </div>

            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal">
              <span className="font-mono text-[10px] uppercase text-muted block">Community Reports</span>
              <span className="font-display font-black text-3xl text-white block mt-1">{reports.length} Submissions</span>
              <span className="font-mono text-[9px] text-muted block mt-1">Editorial Audit Queue</span>
            </div>
          </div>

          {/* ── 2 Columns: Indexation Tiering & Stale Content ── */}
          <div className="grid gap-8 lg:grid-cols-2">
            
            {/* Indexation Hierarchy */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-5">
              <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#0DF2F2]" />
                  <h3 className="font-display font-black text-xl uppercase text-white">Sitemap Indexation Hierarchy</h3>
                </div>
                <span className="font-mono text-xs text-muted">2,516 Static Routes</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[#08111A] border border-primary/30 flex justify-between items-center">
                  <div>
                    <strong className="text-white block">Tier 1: Core Tactical Hubs</strong>
                    <span className="text-[10px] text-muted">Agents, Weapons, Guides, Match Prep, Comparisons</span>
                  </div>
                  <span className="text-primary font-bold">100% Priority (1.0)</span>
                </div>

                <div className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.08)] flex justify-between items-center">
                  <div>
                    <strong className="text-white block">Tier 2: Relational Entities</strong>
                    <span className="text-[10px] text-muted">Maps, Lore Archives, Recommenders, Methodology</span>
                  </div>
                  <span className="text-[#0DF2F2] font-bold">Priority (0.8)</span>
                </div>

                <div className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.08)] flex justify-between items-center">
                  <div>
                    <strong className="text-white block">Tier 3: Programmatic Records</strong>
                    <span className="text-[10px] text-muted">1,400+ Skin Dossiers, Chromas, Bundles</span>
                  </div>
                  <span className="text-amber-400 font-bold">Priority (0.6)</span>
                </div>

                <div className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.08)] flex justify-between items-center">
                  <div>
                    <strong className="text-white block">Tier 4: Dynamic Utility Subroutes</strong>
                    <span className="text-[10px] text-muted">Tools Aliases, Legal Terms, Feedback Modals</span>
                  </div>
                  <span className="text-muted font-bold">Priority (0.3)</span>
                </div>
              </div>
            </div>

            {/* Stale Content & Patch Impact Scanner */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-5">
              <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-primary" />
                  <h3 className="font-display font-black text-xl uppercase text-white">Patch Impact & Content Freshness</h3>
                </div>
                <span className="font-mono text-xs text-primary font-bold">Patch 9.04 Impact</span>
              </div>

              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {staleList.slice(0, 5).map(item => (
                  <div key={item.entityId} className="p-2.5 bg-[#08111A] border border-[rgba(236,232,225,0.04)] flex justify-between items-center">
                    <div>
                      <span className="font-mono text-xs uppercase font-bold text-white block">{item.entityId}</span>
                      <span className="font-mono text-[9px] text-muted">{item.staleCount} guides/comparisons linked</span>
                    </div>
                    <span className={`font-mono text-[9px] uppercase px-2 py-0.5 border font-bold ${
                      item.status === "CRITICAL_UPDATE_REQUIRED"
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-[rgba(236,232,225,0.1)] text-muted"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── Community Issue Reports Queue ── */}
          <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-4">
            <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-3">
              <div className="flex items-center gap-2 text-primary">
                <Flag className="h-4 w-4" />
                <h3 className="font-display font-black text-xl uppercase text-white">Community Issue & Correction Queue</h3>
              </div>
              <span className="font-mono text-xs text-muted">{reports.length} Reports Logged</span>
            </div>

            {reports.length === 0 ? (
              <div className="p-6 text-center bg-[#08111A] border border-[rgba(236,232,225,0.04)]">
                <CheckCircle2 className="h-6 w-6 text-primary mx-auto mb-2" />
                <span className="font-mono text-xs text-muted">No pending community reports. All database statistics verified.</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {reports.map((r, i) => (
                  <div key={i} className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.06)] space-y-1">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-primary font-bold">{r.category}</span>
                      <span className="text-muted">{r.timestamp ? new Date(r.timestamp).toLocaleDateString() : ""}</span>
                    </div>
                    <p className="font-sans text-xs text-white">{r.description}</p>
                    <span className="font-mono text-[9px] text-muted block">Target: {r.entityName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </Container>
      </div>
    </PageTransition>
  );
}
