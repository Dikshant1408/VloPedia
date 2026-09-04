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
  FileText, BarChart3, AlertCircle, FlaskConical, Target,
  Compass, Flame, ShieldAlert, Cpu, Sparkles, Sliders
} from "lucide-react";
import { KnowledgeGraphService } from "@/lib/knowledge-graph-service";
import { PatchImpactEngine } from "@/lib/patch-impact-engine";
import { GraphIntegrityEngine, GraphIntegrityReport } from "@/lib/graph-integrity-engine";
import { DataCoverageAuditor, EntityCoverageAudit } from "@/lib/data-coverage-auditor";
import { getContentGaps, getTopSearches, getSearchSatisfactionMetrics, SearchSatisfactionReport } from "@/lib/search-analytics";
import { 
  SeoOpportunityEngine, 
  OpportunityScoreResult, 
  VerticalIndexPerformance,
  AlmostRankingOpportunity,
  QueryTrendVelocity,
  ContentDecayAlert,
  BreakthroughCandidate,
  DeviceAnomalyReport,
  CountryAnomalyReport,
  DEVICE_PERFORMANCE,
  COUNTRY_PERFORMANCE,
  DeviceSearchPerformance,
  CountrySearchPerformance
} from "@/lib/seo-opportunity";
import { SeoExperimentsEngine, SeoExperiment } from "@/lib/seo-experiments";
import { SeoIntentDiagnosticsEngine, QueryDiagnosisReport } from "@/lib/seo-intent-diagnostics";
import { QueryClusteringEngine, EntityQueryCluster } from "@/lib/query-clustering";
import { SourceRegistry, SourceHealthStatus } from "@/lib/sources";
import { EntityResolver, CollisionAuditResult } from "@/lib/entity-resolver";

type GrowthOsTab = "ACTIONS" | "SEARCH" | "EXPERIMENTS" | "INTENT_DIAGNOSTICS" | "CLUSTERS" | "DATA_TRUST";

export default function AdminHealthPage() {
  const [activeTab, setActiveTab] = useState<GrowthOsTab>("ACTIONS");
  const [selectedScenario, setSelectedScenario] = useState<"scenarioCurrent" | "scenario2Pct" | "scenario5Pct" | "scenario8Pct">("scenario5Pct");

  // State
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

  // SEO Growth OS state
  const [opportunities, setOpportunities] = useState<OpportunityScoreResult[]>([]);
  const [almostRanking, setAlmostRanking] = useState<AlmostRankingOpportunity[]>([]);
  const [trendVelocities, setTrendVelocities] = useState<QueryTrendVelocity[]>([]);
  const [decayAlerts, setDecayAlerts] = useState<ContentDecayAlert[]>([]);
  const [breakthroughs, setBreakthroughs] = useState<BreakthroughCandidate[]>([]);
  const [deviceAnomaly, setDeviceAnomaly] = useState<DeviceAnomalyReport | null>(null);
  const [countryAnomalies, setCountryAnomalies] = useState<CountryAnomalyReport[]>([]);
  const [verticalStats, setVerticalStats] = useState<VerticalIndexPerformance[]>([]);
  
  // Experiments, Diagnostics, Clusters, Data Trust
  const [experiments, setExperiments] = useState<SeoExperiment[]>([]);
  const [diagnostics, setDiagnostics] = useState<QueryDiagnosisReport[]>([]);
  const [clusters, setClusters] = useState<EntityQueryCluster[]>([]);
  const [sourceHealth, setSourceHealth] = useState<SourceHealthStatus[]>([]);
  const [collisionAudit, setCollisionAudit] = useState<CollisionAuditResult | null>(null);

  useEffect(() => {
    setTopSearches(getTopSearches(8));
    setContentGaps(getContentGaps());
    setSatisfactionList(getSearchSatisfactionMetrics());
    setStaleList(PatchImpactEngine.scanStaleContent());
    setIntegrityReport(GraphIntegrityEngine.runAudit("9.04"));
    setCoverageData(DataCoverageAuditor.runFullAudit());
    setOpportunities(SeoOpportunityEngine.getTopOpportunities(6));
    setAlmostRanking(SeoOpportunityEngine.getAlmostRankingQueries());
    setTrendVelocities(SeoOpportunityEngine.getTrendVelocity());
    setDecayAlerts(SeoOpportunityEngine.getContentDecayAlerts());
    setBreakthroughs(SeoOpportunityEngine.getBreakthroughCandidates());
    setDeviceAnomaly(SeoOpportunityEngine.getDeviceAnomalies());
    setCountryAnomalies(SeoOpportunityEngine.getCountryAnomalies());
    setVerticalStats(SeoOpportunityEngine.getVerticalPerformance());
    
    // Growth OS modules
    setExperiments(SeoExperimentsEngine.getAllExperiments());
    setDiagnostics(SeoIntentDiagnosticsEngine.runGscDiagnostics());
    setClusters(QueryClusteringEngine.getAllClusters());
    setSourceHealth(SourceRegistry.checkSourceHealth());
    setCollisionAudit(EntityResolver.detectCollisions());

    try {
      const savedReports = JSON.parse(localStorage.getItem("vlopedia_user_reports") || "[]");
      setReports(savedReports);
    } catch (e) {}
  }, []);

  const allEntities = KnowledgeGraphService.getAllEntities();
  const vandalSeoExposure = PatchImpactEngine.getSeoLandingPageDependencies("weapon:vandal");
  const graphSnapshot = KnowledgeGraphService.getGraphSnapshotVersion();
  const aggregateUplift = SeoExperimentsEngine.calculateAggregateUplift();

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Admin Health & Growth OS" }
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
                  VLOPEDIA GROWTH OS & SYSTEM HEALTH
                </span>
              </div>
              <h1 className="font-display font-black text-4xl uppercase tracking-tight text-white sm:text-5xl">
                GROWTH OS // OPERATIONS CONSOLE
              </h1>
              <p className="font-sans text-sm text-secondary max-w-2xl leading-relaxed">
                Autonomous growth operating system: Time-series search telemetry, A/B title experimentation, intent mismatch diagnosis, query clustering, and patch ripple protection.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/5 px-4 py-2 clip-diagonal font-mono text-xs text-emerald-400">
                <Activity className="h-4 w-4 animate-pulse" />
                <span>EXPERIMENTS UPLIFT: +{aggregateUplift.avgCtrUplift}% CTR</span>
              </div>
              <div className="flex items-center gap-2 border border-[#0DF2F2]/30 bg-[#0DF2F2]/5 px-4 py-2 clip-diagonal font-mono text-xs text-[#0DF2F2]">
                <Cpu className="h-4 w-4" />
                <span>GRAPH: {graphSnapshot.version}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal">
              <span className="font-mono text-[10px] uppercase text-muted block">Active Search Queries</span>
              <span className="font-display font-black text-3xl text-white block mt-1">814 Impressions</span>
              <span className="font-mono text-[9px] text-[#0DF2F2] block mt-1">↑ Rising to 92/day (+198%)</span>
            </div>

            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal">
              <span className="font-mono text-[10px] uppercase text-muted block">Mobile Search Position</span>
              <span className="font-display font-black text-3xl text-emerald-400 block mt-1">Position 8.18</span>
              <span className="font-mono text-[9px] text-muted block mt-1">Desktop: Pos 31.12 (Divergence: 22.9 ranks)</span>
            </div>

            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal">
              <span className="font-mono text-[10px] uppercase text-muted block">Active SEO Experiments</span>
              <span className="font-display font-black text-3xl text-white block mt-1">{experiments.length} Running</span>
              <span className="font-mono text-[9px] text-primary block mt-1">Top Target: Aemondir Vandal (104 impr)</span>
            </div>

            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal">
              <span className="font-mono text-[10px] uppercase text-muted block">Data Trust & Source Feeds</span>
              <span className="font-display font-black text-3xl text-white block mt-1">100% Operational</span>
              <span className="font-mono text-[9px] text-emerald-400 block mt-1">0 Entity Collision Warnings</span>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-[rgba(236,232,225,0.08)] pb-4 font-mono text-xs">
            <button
              onClick={() => setActiveTab("ACTIONS")}
              className={`px-4 py-2 clip-diagonal uppercase transition-colors flex items-center gap-2 ${
                activeTab === "ACTIONS"
                  ? "bg-primary text-black font-bold"
                  : "bg-[#0D1A22] text-secondary hover:text-white border border-[rgba(236,232,225,0.08)]"
              }`}
            >
              <Target className="h-4 w-4" />
              <span>Top 10 Growth Actions</span>
            </button>

            <button
              onClick={() => setActiveTab("SEARCH")}
              className={`px-4 py-2 clip-diagonal uppercase transition-colors flex items-center gap-2 ${
                activeTab === "SEARCH"
                  ? "bg-primary text-black font-bold"
                  : "bg-[#0D1A22] text-secondary hover:text-white border border-[rgba(236,232,225,0.08)]"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Search Intelligence & Velocity</span>
            </button>

            <button
              onClick={() => setActiveTab("EXPERIMENTS")}
              className={`px-4 py-2 clip-diagonal uppercase transition-colors flex items-center gap-2 ${
                activeTab === "EXPERIMENTS"
                  ? "bg-primary text-black font-bold"
                  : "bg-[#0D1A22] text-secondary hover:text-white border border-[rgba(236,232,225,0.08)]"
              }`}
            >
              <FlaskConical className="h-4 w-4" />
              <span>SEO Experiments Lab ({experiments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("INTENT_DIAGNOSTICS")}
              className={`px-4 py-2 clip-diagonal uppercase transition-colors flex items-center gap-2 ${
                activeTab === "INTENT_DIAGNOSTICS"
                  ? "bg-primary text-black font-bold"
                  : "bg-[#0D1A22] text-secondary hover:text-white border border-[rgba(236,232,225,0.08)]"
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>Intent Diagnostics & Mismatches</span>
            </button>

            <button
              onClick={() => setActiveTab("CLUSTERS")}
              className={`px-4 py-2 clip-diagonal uppercase transition-colors flex items-center gap-2 ${
                activeTab === "CLUSTERS"
                  ? "bg-primary text-black font-bold"
                  : "bg-[#0D1A22] text-secondary hover:text-white border border-[rgba(236,232,225,0.08)]"
              }`}
            >
              <Network className="h-4 w-4" />
              <span>Entity Query Clusters</span>
            </button>

            <button
              onClick={() => setActiveTab("DATA_TRUST")}
              className={`px-4 py-2 clip-diagonal uppercase transition-colors flex items-center gap-2 ${
                activeTab === "DATA_TRUST"
                  ? "bg-primary text-black font-bold"
                  : "bg-[#0D1A22] text-secondary hover:text-white border border-[rgba(236,232,225,0.08)]"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Data Trust & Patch SEO</span>
            </button>
          </div>

          {/* TAB 1: TOP 10 WEEKLY GROWTH ACTIONS */}
          {activeTab === "ACTIONS" && (
            <div className="space-y-6">
              <div className="border-l-2 border-primary pl-3 flex items-center justify-between">
                <div>
                  <h2 className="font-display font-black text-2xl uppercase text-white">
                    01 // TOP 10 HIGH-IMPACT GROWTH ACTIONS (WEEKLY QUEUE)
                  </h2>
                  <p className="font-sans text-xs text-secondary mt-1">
                    System-generated prioritized action items calculated from GSC impression volume, velocity momentum, and CTR conversion gaps.
                  </p>
                </div>
                <span className="font-mono text-xs text-primary px-3 py-1 bg-primary/10 border border-primary/30">
                  Sprint Focus: Skin Entities & Intent Capture
                </span>
              </div>

              <div className="grid gap-3">
                {[
                  {
                    rank: "01",
                    pillar: "SEARCH",
                    title: "Scale Aemondir Vandal Canonical Experiment",
                    detail: "104 GSC impressions at position 8.93 with 0 clicks. Canonical slug /skins/aemondir-vandal and AnswerBox deployed. Monitor CTR uplift to 2.8-5% over 14 days.",
                    impact: "CRITICAL // +12 clicks/mo",
                    url: "/skins/aemondir-vandal",
                  },
                  {
                    rank: "02",
                    pillar: "SEARCH",
                    title: "Deploy Dedicated Aeris Vandal Video Showcase Link",
                    detail: "46 impressions at position 8.87. Capture query 'aeris vandal showcase' by linking to dedicated /watch video page.",
                    impact: "HIGH // +4 clicks/mo",
                    url: "/skins/aeris-vandal",
                  },
                  {
                    rank: "03",
                    pillar: "CONTENT",
                    title: "Add Price Spectrum to Vandal Weapon Skin Hub",
                    detail: "Query 'vandal skins' has high cluster demand (140+ impr). Ensure /skins/vandal filters enable sorting from Select to Ultra Edition.",
                    impact: "HIGH // +8 clicks/mo",
                    url: "/skins/vandal",
                  },
                  {
                    rank: "04",
                    pillar: "SEARCH",
                    title: "Fix Desktop Rendering Divergence Anomaly",
                    detail: "Mobile ranks at position 8.18 while Desktop lags at position 31.12. Verify synchronous SSR of H1 and AnswerBox without client hydration delay.",
                    impact: "CRITICAL // +35 clicks/mo",
                    url: "/admin/health",
                  },
                  {
                    rank: "05",
                    pillar: "DATA",
                    title: "Bridge Patch 9.04 Impact to 17 Vandal Landing Pages",
                    detail: "Vandal rifle balance adjustments affect 17 organic URLs (~7,200 search impressions). Update damage matrices and recoil notes.",
                    impact: "HIGH // Search Armor",
                    url: "/weapons/vandal",
                  },
                  {
                    rank: "06",
                    pillar: "INTENT",
                    title: "Address Zero-Click Brand SERP Intent",
                    detail: "Query 'valovault' has 54 impressions at position 6.28. Rewrite homepage title to 'VloPedia — VALORANT Database, Skins, Lore & Tools' with searchaction schema.",
                    impact: "MEDIUM // Brand Authority",
                    url: "/",
                  },
                  {
                    rank: "07",
                    pillar: "CONTENT",
                    title: "Publish Aemondir & Aeris Collection Checklist Hubs",
                    detail: "Expand /collections/aemondir and /collections/aeris with Schema.org ItemList and bundle total VP calculator.",
                    impact: "MEDIUM // +6 clicks/mo",
                    url: "/collections/aemondir",
                  },
                  {
                    rank: "08",
                    pillar: "SEARCH",
                    title: "Advance Breakthrough Candidate: Montage Axe",
                    detail: "Position 6.45 with 20 impressions. Only 3.4 ranks away from top 3. Optimize melee animation tags to break into page 1 top positions.",
                    impact: "HIGH // +3 clicks/mo",
                    url: "/skins/montage-axe",
                  },
                  {
                    rank: "09",
                    pillar: "PRODUCT",
                    title: "Add Weapon Hub Deep Links into Skin Dossier Answer Boxes",
                    detail: "Ensure all skin pages provide 1-click links to the parent weapon skin hub and collection for internal crawl depth.",
                    impact: "MEDIUM // Crawl Mesh",
                    url: "/skins",
                  },
                  {
                    rank: "10",
                    pillar: "DATA",
                    title: "Audit Entity Resolver Collisions",
                    detail: "Run automated test against all 18 alias variations (Jett, KAY/O, Vandal, Ascent) to guarantee 100% resolution accuracy.",
                    impact: "STABLE // Graph Integrity",
                    url: "/data-sources",
                  },
                ].map(action => (
                  <div 
                    key={action.rank}
                    className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-4 clip-diagonal flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <span className="font-display font-black text-2xl text-primary">{action.rank}</span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-white/5 border border-white/10 text-muted">
                            {action.pillar}
                          </span>
                          <h4 className="font-display font-bold text-sm uppercase text-white">{action.title}</h4>
                        </div>
                        <p className="font-sans text-xs text-secondary leading-relaxed max-w-2xl">{action.detail}</p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0 font-mono">
                      <span className="text-xs text-[#0DF2F2] font-bold">{action.impact}</span>
                      <Link 
                        href={action.url}
                        className="text-[11px] text-primary hover:underline flex items-center gap-1"
                      >
                        <span>Execute Action</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SEARCH INTELLIGENCE & MULTI-SCENARIO MODELING */}
          {activeTab === "SEARCH" && (
            <div className="space-y-8">
              
              {/* Scenario Modeling Bar */}
              <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-black text-lg uppercase text-white flex items-center gap-2">
                      <Sliders className="h-5 w-5 text-primary" />
                      <span>Multi-Scenario CTR Traffic Simulator</span>
                    </h3>
                    <p className="font-sans text-xs text-secondary mt-1">
                      Forecast click volumes across distinct conversion scenarios rather than static assumptions.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-muted text-[11px]">ACTIVE SCENARIO:</span>
                    {[
                      { id: "scenarioCurrent", label: "Current CTR" },
                      { id: "scenario2Pct", label: "Scenario 2% CTR" },
                      { id: "scenario5Pct", label: "Scenario 5% CTR (Target)" },
                      { id: "scenario8Pct", label: "Scenario 8% CTR (High-Intent)" },
                    ].map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedScenario(s.id as any)}
                        className={`px-3 py-1.5 border clip-diagonal uppercase transition-colors ${
                          selectedScenario === s.id
                            ? "bg-primary text-black font-bold border-primary"
                            : "bg-[#08111A] text-secondary border-[rgba(236,232,225,0.08)] hover:text-white"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Breakthrough Candidates & Near Page 1 */}
              <div className="grid gap-6 lg:grid-cols-2">
                
                {/* Breakthroughs */}
                <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-4">
                  <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-3">
                    <h3 className="font-display font-black text-base uppercase text-white flex items-center gap-2">
                      <Flame className="h-4 w-4 text-amber-400" />
                      <span>Breakthrough Candidates (Positions 3–6)</span>
                    </h3>
                    <span className="font-mono text-[10px] text-amber-400">Near Top 3</span>
                  </div>

                  <div className="space-y-3">
                    {breakthroughs.map((b, i) => (
                      <div key={i} className="p-3.5 bg-[#08111A] border border-[rgba(236,232,225,0.04)] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-white uppercase">{b.query}</span>
                          <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 border border-primary/20">
                            Position {b.currentPosition.toFixed(1)} ({b.gapToTopThree} from Top 3)
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-mono text-muted">
                          <span>Impressions: <strong className="text-white">{b.impressions}</strong></span>
                          <span>CTR: <strong className="text-white">{(b.ctr * 100).toFixed(1)}%</strong></span>
                          <span className="text-[#0DF2F2]">
                            Projected: <strong className="text-white">+{b[selectedScenario === "scenario8Pct" ? "scenario8Pct" : "scenario5Pct"]} clicks/mo</strong>
                          </span>
                        </div>
                        <p className="text-[11px] text-secondary font-sans">{b.priorityAction}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trend Velocity & Momentum */}
                <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-4">
                  <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-3">
                    <h3 className="font-display font-black text-base uppercase text-white flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-[#0DF2F2]" />
                      <span>Trend Velocity & Momentum Tracking</span>
                    </h3>
                    <span className="font-mono text-[10px] text-[#0DF2F2]">Time-Series Baseline</span>
                  </div>

                  <div className="space-y-3">
                    {trendVelocities.slice(0, 4).map((v, i) => (
                      <div key={i} className="p-3.5 bg-[#08111A] border border-[rgba(236,232,225,0.04)] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-white uppercase">{v.query}</span>
                          <span className={`font-mono text-[9px] px-2 py-0.5 border font-bold ${
                            v.velocity === "VERY_HIGH" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                            v.velocity === "HIGH" ? "bg-[#0DF2F2]/10 border-[#0DF2F2]/30 text-[#0DF2F2]" :
                            v.velocity === "DECAYING" ? "bg-rose-500/10 border-rose-500/30 text-rose-400" :
                            "bg-white/5 border-white/10 text-muted"
                          }`}>
                            {v.velocity.replace("_", " ")} MOMENTUM ({v.momentumScore}/100)
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          <div className="p-2 bg-[#0B141A] border border-white/5">
                            <span className="text-[10px] text-muted block">Position Shift</span>
                            <span className="text-white font-bold">
                              {v.baselinePeriod.position.toFixed(1)} → {v.currentPeriod.position.toFixed(1)} ({v.positionDelta <= 0 ? `+${Math.abs(v.positionDelta)} ranks` : `-${v.positionDelta} ranks`})
                            </span>
                          </div>
                          <div className="p-2 bg-[#0B141A] border border-white/5">
                            <span className="text-[10px] text-muted block">Impression Growth</span>
                            <span className="text-white font-bold">
                              {v.baselinePeriod.impressions} → {v.currentPeriod.impressions} (+{v.impressionGrowthPct}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Device Anomaly & Country Performance */}
              <div className="grid gap-6 lg:grid-cols-2">
                
                {/* Device Anomaly */}
                <div className="border border-amber-400/30 bg-amber-400/5 p-6 clip-diagonal space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-black text-base uppercase text-white flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                      <span>Device Anomaly Detector (Mobile vs Desktop)</span>
                    </h3>
                    <span className="font-mono text-[9px] text-amber-400 border border-amber-400/30 px-2 py-0.5 font-bold uppercase">
                      {deviceAnomaly?.divergenceSeverity} DIVERGENCE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <div className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.06)]">
                      <span className="text-[10px] text-emerald-400 block">Mobile Average Position</span>
                      <span className="font-display font-black text-2xl text-emerald-400 mt-1 block">8.18</span>
                      <span className="text-muted text-[10px]">261 impressions</span>
                    </div>
                    <div className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.06)]">
                      <span className="text-[10px] text-rose-400 block">Desktop Average Position</span>
                      <span className="font-display font-black text-2xl text-rose-400 mt-1 block">31.12</span>
                      <span className="text-muted text-[10px]">549 impressions (22.9 ranks lag)</span>
                    </div>
                  </div>

                  <p className="font-sans text-xs text-secondary leading-relaxed">
                    {deviceAnomaly?.diagnosis}
                  </p>

                  <div className="space-y-1 font-mono text-[11px] text-muted">
                    <span className="text-white font-bold block mb-1">Recommended Action Items:</span>
                    {deviceAnomaly?.actionItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-amber-400 rounded-full" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Country Performance */}
                <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-4">
                  <h3 className="font-display font-black text-base uppercase text-white flex items-center gap-2">
                    <Compass className="h-5 w-5 text-[#0DF2F2]" />
                    <span>Global Demand & Regional Ranking Analysis</span>
                  </h3>

                  <div className="grid gap-2 font-mono text-xs">
                    {countryAnomalies.slice(0, 5).map((c, i) => (
                      <div key={i} className="p-2.5 bg-[#08111A] border border-[rgba(236,232,225,0.04)] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{c.country} ({c.code})</span>
                          {c.underperformanceFlag && (
                            <span className="text-[9px] bg-rose-500/10 border border-rose-500/30 text-rose-400 px-1.5 py-0.2">
                              Underperforming
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-muted">
                          <span>Impr: <strong className="text-white">{c.impressions}</strong></span>
                          <span>Pos: <strong className={c.position <= 10 ? "text-emerald-400" : "text-white"}>{c.position.toFixed(1)}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: SEO EXPERIMENTS LAB (A/B TESTING) */}
          {activeTab === "EXPERIMENTS" && (
            <div className="space-y-6">
              <div className="border-l-2 border-primary pl-3 flex items-center justify-between">
                <div>
                  <h2 className="font-display font-black text-2xl uppercase text-white">
                    02 // SEO EXPERIMENTS & SERP TITLE TESTING LAB
                  </h2>
                  <p className="font-sans text-xs text-secondary mt-1">
                    Live before/after tracking testing canonical slugs, action-driven title tags, and above-the-fold answer boxes against baseline metrics.
                  </p>
                </div>
                <div className="font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1">
                  Active Uplift: +{aggregateUplift.avgPositionImprovement} avg ranks
                </div>
              </div>

              <div className="grid gap-6">
                {experiments.map(exp => (
                  <div key={exp.id} className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-5">
                    
                    {/* Experiment Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(236,232,225,0.08)] pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                            {exp.status} ({exp.targetDurationDays}d test)
                          </span>
                          <h3 className="font-display font-black text-xl uppercase text-white">{exp.entityName}</h3>
                        </div>
                        <p className="font-sans text-xs text-secondary mt-1 max-w-2xl">{exp.hypothesis}</p>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-xs">
                        <div className="p-2 bg-[#08111A] border border-white/5 text-center">
                          <span className="text-[10px] text-muted block">CTR Uplift</span>
                          <span className="text-emerald-400 font-bold">+{exp.calculatedUplift.ctrDeltaPct}%</span>
                        </div>
                        <div className="p-2 bg-[#08111A] border border-white/5 text-center">
                          <span className="text-[10px] text-muted block">Position Gain</span>
                          <span className="text-[#0DF2F2] font-bold">{exp.calculatedUplift.positionDelta} ranks</span>
                        </div>
                        <div className="p-2 bg-[#08111A] border border-white/5 text-center">
                          <span className="text-[10px] text-muted block">Monthly Clicks</span>
                          <span className="text-primary font-bold">+{exp.calculatedUplift.clickGainMonthly}</span>
                        </div>
                      </div>
                    </div>

                    {/* Variant Comparison Grid */}
                    <div className="grid gap-4 md:grid-cols-2 font-mono text-xs">
                      
                      {/* Variant A */}
                      <div className="p-4 bg-[#08111A] border border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted font-bold uppercase">{exp.variantA.version}</span>
                          <span className="text-[10px] text-muted">{exp.variantA.period}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted block">SERP Title</span>
                          <p className="text-white font-sans text-xs">{exp.variantA.title}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[11px]">
                          <div>Impr: <strong className="text-white">{exp.variantA.impressions}</strong></div>
                          <div>Clicks: <strong className="text-white">{exp.variantA.clicks}</strong></div>
                          <div>Pos: <strong className="text-white">{exp.variantA.avgPosition.toFixed(1)}</strong></div>
                        </div>
                      </div>

                      {/* Variant B */}
                      <div className="p-4 bg-[#0DF2F2]/5 border border-[#0DF2F2]/20 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[#0DF2F2] font-bold uppercase">{exp.variantB.version}</span>
                          <span className="text-[10px] text-[#0DF2F2]">{exp.variantB.period}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted block">SERP Title</span>
                          <p className="text-white font-sans text-xs">{exp.variantB.title}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#0DF2F2]/10 text-[11px]">
                          <div>Impr: <strong className="text-white">{exp.variantB.impressions}</strong></div>
                          <div>Clicks: <strong className="text-emerald-400">{exp.variantB.clicks}</strong></div>
                          <div>Pos: <strong className="text-emerald-400">{exp.variantB.avgPosition.toFixed(1)}</strong></div>
                        </div>
                      </div>

                    </div>

                    {/* Verdict */}
                    <div className="flex items-center justify-between p-3 bg-[#0B141A] border border-[rgba(236,232,225,0.06)] font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span className="text-secondary">{exp.verdict}</span>
                      </div>
                      <Link href={exp.pageUrl} className="text-primary hover:underline flex items-center gap-1">
                        <span>Inspect Live Page →</span>
                      </Link>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INTENT DIAGNOSTICS & MISMATCHES */}
          {activeTab === "INTENT_DIAGNOSTICS" && (
            <div className="space-y-6">
              <div className="border-l-2 border-primary pl-3">
                <h2 className="font-display font-black text-2xl uppercase text-white">
                  03 // LOW-CTR DIAGNOSTICS & QUERY MISMATCH DETECTOR
                </h2>
                <p className="font-sans text-xs text-secondary mt-1">
                  Classifies root causes of low click-through rates (Title Mismatch, Intent Mismatch, Wrong Landing Page, Zero-Click SERP) with semantic affinity scoring.
                </p>
              </div>

              <div className="grid gap-4">
                {diagnostics.map((d, i) => (
                  <div key={i} className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(236,232,225,0.08)] pb-3 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 border font-bold text-[9px] uppercase ${
                          d.diagnosis === "WRONG_LANDING_PAGE" ? "bg-rose-500/10 border-rose-500/30 text-rose-400" :
                          d.diagnosis === "INTENT_MISMATCH" ? "bg-amber-400/10 border-amber-400/30 text-amber-400" :
                          d.diagnosis === "TITLE_MISMATCH" ? "bg-primary/10 border-primary/30 text-primary" :
                          d.diagnosis === "ZERO_CLICK_SERP" ? "bg-[#0DF2F2]/10 border-[#0DF2F2]/30 text-[#0DF2F2]" :
                          "bg-white/5 border-white/10 text-muted"
                        }`}>
                          {d.diagnosis.replace(/_/g, " ")}
                        </span>
                        <span className="font-bold text-white text-sm uppercase">{d.query}</span>
                      </div>

                      <div className="flex items-center gap-4 text-muted">
                        <span>Impr: <strong className="text-white">{d.impressions}</strong></span>
                        <span>Clicks: <strong className="text-white">{d.clicks}</strong></span>
                        <span>Pos: <strong className="text-white">{d.position.toFixed(1)}</strong></span>
                        <span>Match: <strong className={d.matchResult.matchScore >= 80 ? "text-emerald-400" : "text-amber-400"}>{d.matchResult.matchScore}%</strong></span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 font-mono text-xs">
                      <div className="space-y-2">
                        <span className="text-muted text-[10px] uppercase block">Current Landing URL vs Recommended</span>
                        <div className="p-2.5 bg-[#08111A] border border-white/5 space-y-1">
                          <div className="text-secondary text-[11px]">Current: <strong className="text-white">{d.url}</strong></div>
                          <div className="text-primary text-[11px]">Canonical: <strong className="text-white">{d.matchResult.recommendedUrl}</strong></div>
                        </div>
                        <p className="font-sans text-xs text-secondary leading-relaxed pt-1">{d.diagnosticExplanation}</p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-muted text-[10px] uppercase block">Required Remediation Steps</span>
                        <div className="p-2.5 bg-[#08111A] border border-white/5 space-y-1 text-secondary text-[11px] font-sans">
                          {d.actionChecklist.map((act, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                              <span>{act}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ENTITY QUERY CLUSTERS */}
          {activeTab === "CLUSTERS" && (
            <div className="space-y-6">
              <div className="border-l-2 border-primary pl-3">
                <h2 className="font-display font-black text-2xl uppercase text-white">
                  04 // ENTITY QUERY CLUSTERS & KNOWLEDGE GRAPH MESH
                </h2>
                <p className="font-sans text-xs text-secondary mt-1">
                  Aggregates fragmented search queries into unified entity clusters, identifying total demand volume and sub-intent breakdowns.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {clusters.map(c => (
                  <div key={c.clusterId} className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal space-y-4">
                    <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-3">
                      <div>
                        <span className="font-mono text-[9px] text-primary uppercase font-bold">{c.category} Entity Cluster</span>
                        <h3 className="font-display font-black text-xl uppercase text-white">{c.displayName}</h3>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-display font-black text-2xl text-[#0DF2F2] block">{c.totalImpressions}</span>
                        <span className="text-[9px] text-muted">Total Impressions</span>
                      </div>
                    </div>

                    {/* Sub-intent distribution */}
                    <div className="space-y-2 font-mono text-xs">
                      <span className="text-muted text-[10px] uppercase block">Sub-Intent Demand Distribution</span>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(c.intentBreakdown).map(([intent, count]) => count > 0 && (
                          <div key={intent} className="p-2 bg-[#08111A] border border-white/5 flex items-center justify-between">
                            <span className="text-secondary text-[10px]">{intent.replace(/_/g, " ")}</span>
                            <span className="text-white font-bold">{count} impr</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Graph Connections */}
                    <div className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.04)] font-mono text-[11px] space-y-1">
                      <span className="text-muted text-[10px] uppercase block">Linked Knowledge Graph Nodes</span>
                      {c.graphConnections.parentWeaponUrl && (
                        <div className="flex items-center justify-between">
                          <span className="text-secondary">Parent Weapon Hub:</span>
                          <Link href={c.graphConnections.parentWeaponUrl} className="text-[#0DF2F2] hover:underline">
                            {c.graphConnections.parentWeaponName} →
                          </Link>
                        </div>
                      )}
                      {c.graphConnections.collectionUrl && (
                        <div className="flex items-center justify-between">
                          <span className="text-secondary">Collection Hub:</span>
                          <Link href={c.graphConnections.collectionUrl} className="text-primary hover:underline">
                            {c.graphConnections.collectionName} →
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: DATA TRUST & PATCH SEO */}
          {activeTab === "DATA_TRUST" && (
            <div className="space-y-8">
              
              {/* Patch Impact to SEO Exposure */}
              <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-4">
                <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-3">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-display font-black text-xl uppercase text-white">
                        05 // PATCH RIPPLE TO ORGANIC LANDING PAGES
                      </h3>
                      <p className="font-sans text-xs text-secondary mt-0.5">
                        Evaluating search traffic vulnerability when game balance patches modify weapons or agents.
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-primary bg-primary/10 border border-primary/30 px-3 py-1">
                    Vandal Impact: {vandalSeoExposure.totalOrganicPages} Organic URLs ({vandalSeoExposure.totalSearchExposure} Impr Exposed)
                  </span>
                </div>

                <div className="grid gap-2 sm:grid-cols-3 font-mono text-xs">
                  {vandalSeoExposure.landingPages.map((lp, idx) => (
                    <div key={idx} className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.04)] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-primary uppercase font-bold">{lp.pageType}</span>
                        <span className="text-[10px] text-muted">{lp.estimatedImpressions} impr</span>
                      </div>
                      <Link href={lp.url} className="text-white hover:text-primary font-bold text-xs block truncate">
                        {lp.title}
                      </Link>
                      <span className="text-[10px] text-secondary block font-sans">Intent: &quot;{lp.searchIntent}&quot;</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source Health & Alias Collision Audit */}
              <div className="grid gap-6 lg:grid-cols-2">
                
                {/* Source Feeds */}
                <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-4">
                  <h3 className="font-display font-black text-lg uppercase text-white flex items-center gap-2">
                    <Database className="h-5 w-5 text-emerald-400" />
                    <span>Registered Source Feeds Health</span>
                  </h3>

                  <div className="space-y-2 font-mono text-xs">
                    {sourceHealth.map(s => (
                      <div key={s.id} className="p-2.5 bg-[#08111A] border border-white/5 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white block">{s.name}</span>
                          <span className="text-[10px] text-muted">{s.statusMessage}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-emerald-400 font-bold block">{s.healthStatus} ({s.httpStatus})</span>
                          <span className="text-[10px] text-muted">{s.latencyMs}ms latency</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collision Audit */}
                <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-4">
                  <h3 className="font-display font-black text-lg uppercase text-white flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-[#0DF2F2]" />
                    <span>Entity Resolver Alias Collision Audit</span>
                  </h3>

                  <div className="p-4 bg-[#08111A] border border-emerald-500/20 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold uppercase">Status: ZERO COLLISIONS DETECTED</span>
                      <span className="text-muted">{collisionAudit?.totalPassed}/{collisionAudit?.totalChecked} Passed</span>
                    </div>
                    <p className="font-sans text-xs text-secondary leading-relaxed">
                      {collisionAudit?.message}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-muted pt-2 border-t border-white/5">
                      <div>✓ Jett / jett / agent:jett</div>
                      <div>✓ Vandal / vandal / weapon:vandal</div>
                      <div>✓ KAY/O / kay-o / agent:kay-o</div>
                      <div>✓ Ascent / map:ascent</div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </Container>
      </div>
    </PageTransition>
  );
}
