import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition } from "@/components/motion-system";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { 
  Database, ShieldCheck, Scale, BookOpen, 
  ExternalLink, CheckCircle2, Clock, Cpu, Layers, HelpCircle, History 
} from "lucide-react";
import { SourceRegistry } from "@/lib/sources";

export const metadata: Metadata = {
  title: "Data Sources & Mathematical Models | VloPedia",
  description: "Explore the verified data sources, tournament telemetry datasets, and exact mathematical models powering VloPedia.",
  alternates: {
    canonical: "/data-sources",
  },
};

export default function DataSourcesPage() {
  const sources = SourceRegistry.getAllSources();

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Data Sources & Methodology" }
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
                DATA PROVENANCE & INGESTION ARCHITECTURE
              </span>
            </div>
            <h1 className="font-display font-black text-4xl uppercase tracking-tight text-white sm:text-5xl">
              DATA SOURCES & MATHEMATICAL MODELS
            </h1>
            <p className="font-sans text-sm sm:text-base text-secondary leading-relaxed">
              Every statistic, tier ranking, lore citation, and aiming conversion on VloPedia is mapped to a verified data source or exact formula. Below is our complete registry classifying authoritative game feeds, tournament telemetry, and editorial analysis.
            </p>
          </div>

          {/* Source Classification Matrix */}
          <div className="border border-[#0DF2F2]/30 bg-[#0DF2F2]/5 p-6 clip-diagonal space-y-4">
            <h3 className="font-display font-black text-lg uppercase text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#0DF2F2]" />
              <span>Source Classification & Reliability Tiers</span>
            </h3>
            <div className="grid gap-3 sm:grid-cols-3 font-mono text-xs">
              <div className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.06)]">
                <span className="text-[10px] text-primary uppercase font-bold block">TIER 1: AUTHORITATIVE</span>
                <p className="text-secondary text-[11px] mt-1 font-sans">
                  Direct game client data (Riot Character & Weapons API, Official Cinematics).
                </p>
              </div>
              <div className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.06)]">
                <span className="text-[10px] text-[#0DF2F2] uppercase font-bold block">TIER 2: AGGREGATED TELEMETRY</span>
                <p className="text-secondary text-[11px] mt-1 font-sans">
                  VCT Pro tournament datasets and Radiant competitive match telemetry.
                </p>
              </div>
              <div className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.06)]">
                <span className="text-[10px] text-amber-400 uppercase font-bold block">TIER 3: EDITORIAL ANALYSIS</span>
                <p className="text-secondary text-[11px] mt-1 font-sans">
                  Radiant Desk strategic assessments and situational counterplay reviews.
                </p>
              </div>
            </div>
          </div>

          {/* Sources Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-l-2 border-primary pl-3">
              <h2 className="font-display font-black text-2xl uppercase text-white">
                01 // ACTIVE SOURCE REGISTRY
              </h2>
              <Link href="/changelog" className="font-mono text-xs text-primary hover:underline flex items-center gap-1">
                <History className="h-3.5 w-3.5" />
                <span>View Changelog →</span>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {sources.map(source => (
                <div 
                  key={source.id} 
                  className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal space-y-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-[9px] uppercase px-2 py-0.5 border font-bold ${
                      (source.reliability === "OFFICIAL" || source.reliability === "CONFIRMED_CANON") ? "bg-primary/10 border-primary/30 text-primary" :
                      source.reliability === "CALCULATED" ? "bg-[#0DF2F2]/10 border-[#0DF2F2]/30 text-[#0DF2F2]" :
                      "bg-amber-400/10 border-amber-400/30 text-amber-400"
                    }`}>
                      {source.reliability}
                    </span>
                    <span className="font-mono text-[9px] text-muted flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {source.updateFrequency}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-lg uppercase text-white">
                    {source.name}
                  </h3>

                  <p className="font-sans text-xs text-secondary leading-relaxed">
                    {source.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[rgba(236,232,225,0.04)] font-mono text-[10px]">
                    <span className="text-muted">Type: <strong className="text-white">{source.type}</strong></span>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Endpoint</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mathematical Models */}
          <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 sm:p-8 clip-diagonal space-y-6">
            <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-4">
              <div className="flex items-center gap-3">
                <Cpu className="h-5 w-5 text-[#0DF2F2]" />
                <h2 className="font-display font-black text-2xl uppercase text-white">
                  02 // MATHEMATICAL MODELS & VERIFICATION FORMULAS
                </h2>
              </div>
              <Link href="/methodology" className="font-mono text-xs text-[#0DF2F2] hover:underline flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Full Methodology →</span>
              </Link>
            </div>

            <div className="space-y-4 font-sans text-xs sm:text-sm text-secondary leading-relaxed">
              
              {/* 1. Exact Kinematics */}
              <div className="p-4 bg-[#08111A] border border-[rgba(236,232,225,0.04)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary font-bold block">1. AIM KINEMATICS FORMULA (EXACT)</span>
                  <span className="font-mono text-[9px] px-2 py-0.5 border border-primary/30 text-primary">EXACT MATHEMATICAL MODEL</span>
                </div>
                <p className="font-mono text-xs text-white">
                  eDPI = InGameSensitivity × MouseDPI
                </p>
                <p className="font-mono text-xs text-[#0DF2F2]">
                  cm/360° = 13,054.545 / eDPI (Constant: 0.07° yaw per count = 360 / (0.07 × 2.54) × 100)
                </p>
                <p className="text-xs text-muted">
                  VALORANT uses a rigid $0.07^\circ$ yaw angle per mouse count. Turn distance in centimeters is exact to within mouse sensor precision.
                </p>
              </div>

              {/* 2. Cross-Game Sensitivity */}
              <div className="p-4 bg-[#08111A] border border-[rgba(236,232,225,0.04)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#0DF2F2] font-bold block">2. CROSS-GAME SENSITIVITY CONVERSIONS (YAW RATIO)</span>
                  <span className="font-mono text-[9px] px-2 py-0.5 border border-[#0DF2F2]/30 text-[#0DF2F2]">ENGINE YAW RATIO</span>
                </div>
                <p className="font-mono text-xs text-white">
                  VALORANT Sens = Source Engine Sens (CS2 / Apex) × (0.022 / 0.07) = Source Sens / 3.181818
                </p>
                <p className="font-mono text-xs text-muted">
                  Overwatch 2 Sens = VALORANT Sens × 10.606 · Rainbow Six Sens = VALORANT Sens × 0.838
                </p>
              </div>

              {/* 3. Recommender Confidence */}
              <div className="p-4 bg-[#08111A] border border-[rgba(236,232,225,0.04)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-amber-400 font-bold block">3. TACTICAL RECOMMENDATION CONFIDENCE SCORE</span>
                  <span className="font-mono text-[9px] px-2 py-0.5 border border-amber-400/30 text-amber-400">ALGORITHMIC MODEL</span>
                </div>
                <p className="font-mono text-xs text-white">
                  Score = (MapFit × 0.35) + (PlaystyleFit × 0.35) + (TeamSynergy × 0.30)
                </p>
                <p className="text-xs text-muted">
                  Outputs an algorithmically weighted percentage (0-100%) indicating how strongly an agent matches your tactical preferences and current map meta.
                </p>
              </div>

              {/* 4. Economy Loss Bonus Formula */}
              <div className="p-4 bg-[#08111A] border border-[rgba(236,232,225,0.04)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary font-bold block">4. ECONOMY LOSS BONUS PROGRESSION (EXACT)</span>
                  <span className="font-mono text-[9px] px-2 py-0.5 border border-primary/30 text-primary">OFFICIAL RULESET</span>
                </div>
                <p className="font-mono text-xs text-white">
                  Loss Bonus = $1,900 + (min(lossStreak, 2) × $500) // Win Bonus = $3,000 // Plant = $300
                </p>
                <p className="text-xs text-muted">
                  Max consecutive loss bonus caps at $2,900 after 2 consecutive losses. Full buy requires $3,900 (Vandal/Phantom + Heavy Armor).
                </p>
              </div>

            </div>
          </div>

        </Container>
      </div>
    </PageTransition>
  );
}
