import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition } from "@/components/motion-system";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { History, ShieldCheck, Zap, Database, CheckCircle2, ArrowRight, Layers, Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "Public Changelog & Platform Architecture | VloPedia",
  description: "Versioned engineering updates, data coverage audits, and patch sync milestones for VloPedia.",
  alternates: {
    canonical: "/changelog",
  },
};

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  badge: string;
  summary: string;
  highlights: string[];
}

const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    version: "v1.4.0",
    date: "September 4, 2026",
    title: "Stabilize & Measure Architecture: Data Coverage, GSC Opportunity Engine & Search Satisfaction",
    badge: "Active Release",
    summary: "Shifted platform architecture into the Stabilize -> Measure -> Grow milestone with automated data auditing and tactical lifecycle completion.",
    highlights: [
      "Entity Data Coverage Auditor: Granular completeness matrix across core stats, abilities, meta tiers, synergies, counters, and lore for all canonical entities.",
      "Google Search Console Telemetry & Opportunity Scoring: Mathematical model prioritizing high-yield pages (Impressions × Rank Potential × Content Gap × Click Potential).",
      "Search Satisfaction Engine: Lightweight feedback tracking (👍 / 👎) and content gap queries to steer the editorial roadmap.",
      "Match Command 5-Stage Lifecycle: Added Stage 5 Post-Match Review with rules-based tactical diagnostics (Strengths, Problems, Recommendations) and match logging.",
      "Followed Entity Live Feed: Real, verified update alerts for followed agents, weapons, maps, and lore dossiers on My VALORANT."
    ]
  },
  {
    version: "v1.3.0",
    date: "September 3, 2026",
    title: "Knowledge Graph v2, Centralized Source Registry & Zero-Fake Fallback Contracts",
    badge: "Core Data Moat",
    summary: "Refactored graph traversal to enforce explicit directionality and strict zero-fake-fallback provenance contracts.",
    highlights: [
      "Canonical EntityResolver: Robust slug resolution without uppercase mutations.",
      "Centralized Source Registry: Public registry mapping telemetry endpoints, VCT pro match datasets, and Radiant Desk analysis.",
      "Explicit Relationship Directionality: Strict separation between DIRECTED counterplay and UNDIRECTED synergies.",
      "Public Data Sources & Mathematical Models: Detailed disclosure of aim kinematics (0.07° yaw constant) and recommendation confidence algorithms."
    ]
  },
  {
    version: "v1.2.0",
    date: "September 2, 2026",
    title: "Data Trust Engine, Patch Impact Ripple & Match Prep Companion",
    badge: "Tactical Tools",
    summary: "Introduced field-level data trust badges, automated patch impact ripple analysis, and persistent match session planning.",
    highlights: [
      "Data Trust Badges: In-context provenance badges on every entity and weapon page.",
      "Patch Impact Engine: Dependency ripple analysis detecting decaying content across guides and tier lists.",
      "Match Prep Companion: Pre-round buy directives and map-specific opening strategies."
    ]
  },
  {
    version: "v1.1.0",
    date: "September 1, 2026",
    title: "My VALORANT Personal Command & Natural-Language Intent Search",
    badge: "Personalization",
    summary: "Shipped personal player setup customization, cloud synchronization, and natural-language search command parsing.",
    highlights: [
      "My VALORANT: Personal loadout, DPI/sensitivity calculator, and shareable setup links.",
      "Natural-Language Search: Direct answer boxes for queries like 'best controller on ascent', 'vandal vs phantom', and aim kinematics.",
      "Comprehensive Lore Archives: Chronological eras, verified canon status, and evidence citations."
    ]
  }
];

export default function ChangelogPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Public Changelog" }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground py-16">
        <Container className="space-y-12 max-w-4xl">
          
          {/* Header */}
          <div className="space-y-3 border-b border-[rgba(236,232,225,0.08)] pb-8">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-8 bg-primary" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary font-bold">
                ENGINEERING UPDATES & DATA LOG
              </span>
            </div>
            <h1 className="font-display font-black text-4xl uppercase tracking-tight text-white sm:text-5xl">
              PLATFORM CHANGELOG
            </h1>
            <p className="font-sans text-sm sm:text-base text-secondary leading-relaxed">
              Transparent log of versioned updates, mathematical model audits, and active Patch 9.04 database synchronizations across VloPedia.
            </p>
          </div>

          {/* Sync Status Banner */}
          <div className="border border-[#0DF2F2]/30 bg-[#0DF2F2]/5 p-5 clip-diagonal flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-2 text-[#0DF2F2]">
              <Activity className="h-4 w-4 animate-pulse" />
              <span className="font-bold">DATABASE SYNCED: SEPTEMBER 4, 2026</span>
            </div>
            <div className="flex items-center gap-4 text-muted">
              <span>Active Patch: <strong className="text-white">Patch 9.04</strong></span>
              <span>Integrity: <strong className="text-primary">100% Verified</strong></span>
            </div>
          </div>

          {/* Changelog Timeline */}
          <div className="space-y-8">
            {CHANGELOG_ENTRIES.map((entry, idx) => (
              <div 
                key={entry.version}
                className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 sm:p-8 clip-diagonal space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[rgba(236,232,225,0.06)] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs px-2.5 py-1 bg-primary/10 border border-primary/30 text-primary font-bold">
                      {entry.version}
                    </span>
                    <span className="font-mono text-xs text-muted">{entry.date}</span>
                  </div>
                  <span className="font-mono text-[9px] uppercase px-2 py-0.5 border border-[rgba(236,232,225,0.1)] text-muted">
                    {entry.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-black text-xl sm:text-2xl uppercase text-white tracking-wide">
                    {entry.title}
                  </h3>
                  <p className="font-sans text-sm text-secondary leading-relaxed mt-2">
                    {entry.summary}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[rgba(236,232,225,0.04)]">
                  <span className="font-mono text-[10px] uppercase text-primary font-bold block tracking-wider">
                    Key Deliverables:
                  </span>
                  <ul className="space-y-1.5 font-sans text-xs text-muted">
                    {entry.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#0DF2F2] shrink-0 mt-0.5" />
                        <span className="text-secondary">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </Container>
      </div>
    </PageTransition>
  );
}
