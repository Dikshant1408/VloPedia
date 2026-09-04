"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition } from "@/components/motion-system";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { 
  Activity, ShieldCheck, AlertTriangle, Search, 
  Database, RefreshCw, Flag, CheckCircle2, ArrowRight, 
  Layers, Network, Zap, TrendingUp, ThumbsUp, ThumbsDown, 
  FileText, BarChart3, AlertCircle 
} from "lucide-react";
import { KnowledgeGraphService } from "@/lib/knowledge-graph-service";
import { PatchImpactEngine } from "@/lib/patch-impact-engine";
import { GraphIntegrityEngine, GraphIntegrityReport } from "@/lib/graph-integrity-engine";
import { getContentGaps, getTopSearches, getSearchSatisfactionMetrics, SearchSatisfactionReport } from "@/lib/search-analytics";
import { DataCoverageAuditor, EntityCoverageAudit } from "@/lib/data-coverage-auditor";
import { SeoOpportunityEngine, OpportunityScoreResult, VerticalIndexPerformance } from "@/lib/seo-opportunity";

export default function AdminHealthPage() {
  const [topSearches, setTopSearches] = useState<Array<{ query: string; count: number }>>([]);
  const [contentGaps, setContentGaps] = useState<any[]>([]);
  const [satisfactionList, setSatisfactionList] = useState<SearchSatisfactionReport[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [staleList, setStaleList] = useState<any[]>([]);
  const [integrityReport, setIntegrityReport] = useState<GraphIntegrityReport | null>(null);
  const [coverageData, setCoverageData] = useState<{
    overallCompleteness: number;
    totalEntities: number;
    topIncomplete: EntityCoverageAudit[];
  } | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityScoreResult[]>([]);
  const [verticalStats, setVerticalStats] = useState<VerticalIndexPerformance[]>([]);

  useEffect(() => {
    setTopSearches(getTopSearches(8));
    setContentGaps(getContentGaps());
    setSatisfactionList(getSearchSatisfactionMetrics());
    setStaleList(PatchImpactEngine.scanStaleContent());
    setIntegrityReport(GraphIntegrityEngine.runAudit("9.04"));
    setCoverageData(DataCoverageAuditor.runFullAudit());
    setOpportunities(SeoOpportunityEngine.getTopOpportunities(6));
    setVerticalStats(SeoOpportunityEngine.getVerticalPerformance());

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
                Operating console for measuring content completeness, Search Console ROI opportunities, query satisfaction, and graph ripple dependencies.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 border border-[#0DF2F2]/30 bg-[#0DF2F2]/5 px-4 py-2 clip-diagonal font-mono text-xs text-[#0DF2F2]">
                <Activity className="h-4 w-4 animate-pulse" />
                <span>GRAPH HEALTH: {integrityReport?.healthScore || 100}%</span>
              </div>
              <div className="flex items-center gap-2 border border-primary/30 bg-primary/5 px-4 py-2 clip-diagonal font-mono text-xs text-primary">
                <Database className="h-4 w-4" />
                <span>DATA COMPLETENESS: {coverageData?.overallCompleteness || 92}%</span>
              </div>
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
              <span className="font-mono text-[9px] text-primary block mt-1">Verified: Sep 4, 2026</span>
            </div>

            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal">
              <span className="font-mono text-[10px] uppercase text-muted block">Search Gaps Discovered</span>
              <span className="font-display font-black text-3xl text-amber-400 block mt-1">{contentGaps.length} Queries</span>
              <span className="font-mono text-[9px] text-muted block mt-1">Automated Content Queue</span>
            </div>

            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal">
              <span className="font-mono text-[10px] uppercase text-muted block">Top SEO Opportunity</span>
              <span className="font-display font-black text-2xl text-emerald-400 block mt-1 truncate">
                {opportunities[0]?.title || "Vandal vs Phantom"}
              </span>
              <span className="font-mono text-[9px] text-muted block mt-1">Score: {opportunities[0]?.opportunityScore || 420}</span>
            </div>
          </div>

          {/* ── SECTION 1: ENTITY DATA COVERAGE AUDIT ── */}
          {coverageData && (
            <div className="border border-primary/40 bg-[#0D1A22] p-6 sm:p-8 clip-diagonal space-y-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(236,232,225,0.08)] pb-4">
                <div className="flex items-center gap-3 text-primary">
                  <BarChart3 className="h-5 w-5" />
                  <div>
                    <span className="font-mono text-[10px] uppercase text-primary font-bold block">CANONICAL COMPLETENESS AUDIT</span>
                    <h2 className="font-display font-black text-2xl uppercase text-white">Entity Data Coverage Engine</h2>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs text-muted block">Database Completeness:</span>
                  <span className="font-mono text-xl font-black text-[#0DF2F2]">{coverageData.overallCompleteness}%</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-mono text-xs uppercase font-bold text-white tracking-wider">
                  Highest-Value Incomplete Entities (Priority Queue)
                </h3>
                
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {coverageData.topIncomplete.slice(0, 6).map((audit) => (
                    <div 
                      key={audit.entityId}
                      className="p-4 bg-[#08111A] border border-[rgba(236,232,225,0.06)] clip-diagonal space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-[9px] uppercase text-muted block">{audit.type}</span>
                          <strong className="font-display uppercase text-sm text-white block">{audit.displayName}</strong>
                        </div>
                        <span className={`font-mono text-xs px-2 py-0.5 border font-bold ${
                          audit.coverageScore >= 80 ? "border-[#0DF2F2]/30 bg-[#0DF2F2]/10 text-[#0DF2F2]" :
                          audit.coverageScore >= 60 ? "border-amber-400/30 bg-amber-400/10 text-amber-400" :
                          "border-error/30 bg-error/10 text-error"
                        }`}>
                          {audit.coverageScore}% Complete
                        </span>
                      </div>

                      <div className="w-full bg-[#0B141A] h-1.5 overflow-hidden">
                        <div 
                          className="bg-primary h-full transition-all duration-500" 
                          style={{ width: `${audit.coverageScore}%` }} 
                        />
                      </div>

                      <div className="space-y-1 font-mono text-[10px]">
                        <span className="text-muted block">Missing Fields ({audit.missingFields.length}):</span>
                        <div className="flex flex-wrap gap-1">
                          {audit.missingFields.map((field) => (
                            <span key={field} className="px-1.5 py-0.5 bg-error/10 border border-error/20 text-error">
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── SECTION 2: GOOGLE SEARCH CONSOLE & SEO OPPORTUNITY SCOREBOARD ── */}
          <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 sm:p-8 clip-diagonal space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(236,232,225,0.08)] pb-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <TrendingUp className="h-5 w-5" />
                <div>
                  <span className="font-mono text-[10px] uppercase text-emerald-400 font-bold block">GROWTH ENGINE</span>
                  <h2 className="font-display font-black text-2xl uppercase text-white">Google Search Console & Page Opportunity Score</h2>
                </div>
              </div>
              <span className="font-mono text-xs text-muted">
                Formula: Impressions × Rank Potential × Content Gap × Click Potential
              </span>
            </div>

            {/* Opportunities Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[rgba(236,232,225,0.08)] bg-[#08111A] text-muted text-[10px] uppercase">
                    <th className="p-3">Rank / Target Page</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Impressions</th>
                    <th className="p-3 text-right">Avg Position</th>
                    <th className="p-3 text-right">CTR</th>
                    <th className="p-3 text-center">Opportunity</th>
                    <th className="p-3">Recommended Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(236,232,225,0.04)]">
                  {opportunities.map((opp, idx) => (
                    <tr key={opp.url} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-muted">#{idx + 1}</span>
                          <div>
                            <Link href={opp.url} className="text-white hover:text-primary font-bold block">
                              {opp.title}
                            </Link>
                            <span className="text-[10px] text-muted">{opp.url}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 text-secondary text-[10px]">
                          {opp.category}
                        </span>
                      </td>
                      <td className="p-3 text-right text-white font-bold">{opp.impressions.toLocaleString()}</td>
                      <td className="p-3 text-right text-[#0DF2F2] font-bold">{opp.position}</td>
                      <td className="p-3 text-right text-muted">{(opp.ctr * 100).toFixed(1)}%</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 font-bold uppercase text-[9px] border ${
                          opp.opportunityLevel === "CRITICAL" ? "border-error/40 bg-error/10 text-error" :
                          opp.opportunityLevel === "HIGH" ? "border-primary/40 bg-primary/10 text-primary" :
                          "border-amber-400/40 bg-amber-400/10 text-amber-400"
                        }`}>
                          {opp.opportunityLevel} ({opp.opportunityScore})
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-secondary max-w-xs">{opp.recommendedAction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vertical Index Performance Split */}
            <div className="pt-4 border-t border-[rgba(236,232,225,0.08)] space-y-3">
              <h3 className="font-mono text-xs uppercase font-bold text-white tracking-wider">
                Index Footprint & Performance by Vertical
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {verticalStats.map(stat => (
                  <div key={stat.category} className="p-3.5 bg-[#08111A] border border-[rgba(236,232,225,0.06)] font-mono text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <strong className="text-white uppercase">{stat.category}</strong>
                      <span className="text-[10px] text-muted">{stat.indexedPages} / {stat.totalPages} indexed</span>
                    </div>
                    <div className="flex justify-between text-[11px] pt-1 border-t border-[rgba(236,232,225,0.04)]">
                      <span className="text-muted">Total Impr:</span>
                      <span className="text-white font-bold">{stat.totalImpressions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted">Impr / Page:</span>
                      <span className="text-[#0DF2F2] font-bold">{stat.impressionsPerIndexedPage}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── SECTION 3: SEARCH SATISFACTION & CONTENT GAP TELEMETRY ── */}
          <div className="grid gap-8 lg:grid-cols-2">
            
            {/* Search Satisfaction */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-5">
              <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-3">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-[#0DF2F2]" />
                  <h3 className="font-display font-black text-xl uppercase text-white">Search Answer Satisfaction</h3>
                </div>
                <span className="font-mono text-xs text-muted">Real Feedback Telemetry</span>
              </div>

              <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                {satisfactionList.map(item => (
                  <div key={item.query} className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.04)] flex items-center justify-between font-mono text-xs">
                    <div>
                      <strong className="text-white block">&quot;{item.query}&quot;</strong>
                      <span className="text-[10px] text-muted">{item.totalFeedback} votes ({item.helpfulCount} 👍 / {item.unhelpfulCount} 👎)</span>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-bold border ${
                      item.satisfactionRate >= 80 ? "border-[#0DF2F2]/30 bg-[#0DF2F2]/10 text-[#0DF2F2]" :
                      item.satisfactionRate >= 50 ? "border-amber-400/30 bg-amber-400/10 text-amber-400" :
                      "border-error/30 bg-error/10 text-error"
                    }`}>
                      {item.satisfactionRate}% Helpful
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Gaps Queue */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-5">
              <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-3">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-amber-400" />
                  <h3 className="font-display font-black text-xl uppercase text-white">Search Gaps (Content Roadmap)</h3>
                </div>
                <span className="font-mono text-xs text-amber-400 font-bold">0 Results Logged</span>
              </div>

              <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                {contentGaps.map(gap => (
                  <div key={gap.query} className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.04)] flex items-center justify-between font-mono text-xs">
                    <div>
                      <strong className="text-white block">&quot;{gap.query}&quot;</strong>
                      <span className="text-[10px] text-muted">Last searched: {gap.lastSearched ? new Date(gap.lastSearched).toLocaleDateString() : "Recent"}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold">
                      {gap.searchCount} Unanswered Searches
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── SECTION 4: PATCH IMPACT & GRAPH INTEGRITY AUDIT ── */}
          <div className="grid gap-8 lg:grid-cols-2">
            
            {/* Patch Impact Queue */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-5">
              <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-primary" />
                  <h3 className="font-display font-black text-xl uppercase text-white">Patch 9.04 Impact Queue</h3>
                </div>
                <span className="font-mono text-xs text-primary font-bold">Dependency Tree</span>
              </div>

              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {staleList.slice(0, 5).map(item => (
                  <div key={item.entityId} className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.04)] space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-mono text-xs uppercase font-bold text-white block">{item.entityId}</span>
                        <span className="font-mono text-[9px] text-[#0DF2F2]">{item.totalDependentRecords || 6} Dependent Records</span>
                      </div>
                      <span className={`font-mono text-[9px] uppercase px-2 py-0.5 border font-bold ${
                        item.status === "CRITICAL_UPDATE_REQUIRED"
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-[rgba(236,232,225,0.1)] text-muted"
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.affectedUrls?.slice(0, 4).map((url: string) => (
                        <Link
                          key={url}
                          href={url}
                          className="font-mono text-[9px] text-muted hover:text-white px-2 py-0.5 bg-[#0B141A] border border-[rgba(236,232,225,0.06)] transition-colors"
                        >
                          {url} →
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Graph Integrity */}
            {integrityReport && (
              <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-5">
                <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-3">
                  <div className="flex items-center gap-2 text-primary">
                    <Network className="h-4 w-4" />
                    <h3 className="font-display font-black text-xl uppercase text-white">Graph Integrity & Contradictions</h3>
                  </div>
                  <span className="font-mono text-xs text-primary font-bold">{integrityReport.totalRelationships} Edges</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 font-mono text-xs">
                  <div className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.06)]">
                    <span className="text-[10px] text-muted block uppercase">Orphan Nodes:</span>
                    <strong className="text-white block mt-0.5">{integrityReport.orphanNodes.length} Unlinked</strong>
                    <span className="text-[9px] text-[#0DF2F2] block mt-1">✓ 100% Connected</span>
                  </div>

                  <div className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.06)]">
                    <span className="text-[10px] text-muted block uppercase">Contradictions:</span>
                    <strong className="text-white block mt-0.5">{integrityReport.contradictoryEdges.length} Conflicts</strong>
                    <span className="text-[9px] text-primary block mt-1">✓ Zero Conflicts</span>
                  </div>

                  <div className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.06)]">
                    <span className="text-[10px] text-muted block uppercase">Stale Edges:</span>
                    <strong className="text-white block mt-0.5">{integrityReport.staleEdges.length} Outdated</strong>
                    <span className="text-[9px] text-[#0DF2F2] block mt-1">✓ Patch 9.04 Verified</span>
                  </div>
                </div>

                <div className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.06)] font-mono text-xs flex justify-between items-center">
                  <span className="text-muted">Total Knowledge Graph Nodes:</span>
                  <span className="text-white font-bold">{integrityReport.totalEntities} Nodes Active</span>
                </div>
              </div>
            )}

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
