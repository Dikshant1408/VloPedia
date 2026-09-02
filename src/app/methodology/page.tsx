import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { 
  ShieldCheck, Database, Scale, Cpu, 
  BookOpen, Clock, CheckCircle2, ArrowRight 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Data Methodology & Provenance Architecture | VloPedia",
  description: "Learn how VloPedia evaluates meta tiers, team synergy scores, aim kinematics, lore confidence ratings, and official patch data freshness.",
  alternates: {
    canonical: "/methodology",
  },
};

export default function MethodologyPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Methodology & Provenance" }
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
                DATA INTEGRITY & EVALUATION STANDARDS
              </span>
            </div>
            <h1 className="font-display font-black text-4xl uppercase tracking-tight text-white sm:text-5xl">
              METHODOLOGY & DATA PROVENANCE
            </h1>
            <p className="font-sans text-sm sm:text-base text-secondary leading-relaxed">
              At VloPedia, transparency and accuracy are foundational. This document outlines the mathematical models, tournament datasets, and editorial criteria used across all tier lists, comp builders, lore dossiers, and kinematic tools.
            </p>
          </div>

          {/* Section 1: Meta Tiers & Pro Presence */}
          <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 sm:p-8 clip-diagonal space-y-6">
            <div className="flex items-center gap-3 border-b border-[rgba(236,232,225,0.08)] pb-4">
              <Scale className="h-5 w-5 text-primary" />
              <h2 className="font-display font-black text-2xl uppercase text-white">
                01 // META TIERS & PRO PRESENCE EVALUATION
              </h2>
            </div>

            <div className="space-y-4 font-sans text-xs sm:text-sm text-secondary leading-relaxed">
              <p>
                We clearly distinguish between <strong className="text-white">Official Game Telemetry</strong>, <strong className="text-white">VCT Tournament Snapshots</strong>, and <strong className="text-white">Editorial Meta Assessments</strong>:
              </p>
              <ul className="space-y-2 list-disc list-inside pl-2">
                <li>
                  <strong className="text-white">Official Telemetry:</strong> Weapon damage tables, base fire rates, equip times, ability costs, and skin pricing are extracted directly from public Riot Games APIs on every patch deployment.
                </li>
                <li>
                  <strong className="text-white">Pro Tournament Presence:</strong> Pick rates on Agent dossiers (e.g. Jett 84.5%, Omen 78.2%) reflect VCT International and Masters tournament presence datasets, filtered for the active competitive map pool.
                </li>
                <li>
                  <strong className="text-white">Editorial Meta Ratings:</strong> S-Tier, A-Tier, and B-Tier labels represent qualitative evaluations conducted by Radiant-ranked analysts considering solo-queue versatility, round-impact potential, and counter susceptibility.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2: Comp Synergy Scoring Mathematics */}
          <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 sm:p-8 clip-diagonal space-y-6">
            <div className="flex items-center gap-3 border-b border-[rgba(236,232,225,0.08)] pb-4">
              <Cpu className="h-5 w-5 text-[#0DF2F2]" />
              <h2 className="font-display font-black text-2xl uppercase text-white">
                02 // 5-DIMENSIONAL TEAM SYNERGY CALCULATOR
              </h2>
            </div>

            <div className="space-y-4 font-sans text-xs sm:text-sm text-secondary leading-relaxed">
              <p>
                The VloPedia Comp Builder evaluates 5-agent lineups on a 0–100 scale weighted across five fundamental tactical categories:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="p-3 border border-[rgba(236,232,225,0.04)] bg-[#08111A]">
                  <span className="font-mono text-xs text-primary font-bold block">1. Site Execution (25%)</span>
                  <span className="text-xs text-muted">Movement abilities, flashes, and vision denial for explosive site takes.</span>
                </div>
                <div className="p-3 border border-[rgba(236,232,225,0.04)] bg-[#08111A]">
                  <span className="font-mono text-xs text-[#0DF2F2] font-bold block">2. Site Control & Smokes (25%)</span>
                  <span className="text-xs text-muted">Hollow and line smokes that block enemy vision and divide chokepoints.</span>
                </div>
                <div className="p-3 border border-[rgba(236,232,225,0.04)] bg-[#08111A]">
                  <span className="font-mono text-xs text-amber-400 font-bold block">3. Recon & Information (20%)</span>
                  <span className="text-xs text-muted">Darts, drones, prowlers, and cameras gathering early round location data.</span>
                </div>
                <div className="p-3 border border-[rgba(236,232,225,0.04)] bg-[#08111A]">
                  <span className="font-mono text-xs text-purple-400 font-bold block">4. Post-Plant & Stall (15%)</span>
                  <span className="text-xs text-muted">Mollies, shock darts, and delay utility that prevent defuses.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Lore Confidence Hierarchy */}
          <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 sm:p-8 clip-diagonal space-y-6">
            <div className="flex items-center gap-3 border-b border-[rgba(236,232,225,0.08)] pb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="font-display font-black text-2xl uppercase text-white">
                03 // SOURCE-BACKED LORE CONFIDENCE RATINGS
              </h2>
            </div>

            <div className="space-y-4 font-sans text-xs sm:text-sm text-secondary leading-relaxed">
              <p>
                Every narrative dossier in the VloPedia Lore Archives is tagged with a transparent verification level:
              </p>
              <ul className="space-y-2 list-disc list-inside pl-2">
                <li><strong className="text-[#0DF2F2]">Confirmed Canon:</strong> In-game voice lines, official protocol voicemail recordings, and Riot animated cinematics (e.g. Duality, Warm Up, Shattered).</li>
                <li><strong className="text-amber-400">High Confidence:</strong> Environmental visual storytelling and in-game computer terminal dossiers.</li>
                <li><strong className="text-purple-400">Community Theory / Speculation:</strong> Unconfirmed player theories and contextual inferences.</li>
              </ul>
            </div>
          </div>

          {/* Section 4: Data Verification & Freshness */}
          <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 sm:p-8 clip-diagonal space-y-6">
            <div className="flex items-center gap-3 border-b border-[rgba(236,232,225,0.08)] pb-4">
              <Clock className="h-5 w-5 text-[#0DF2F2]" />
              <h2 className="font-display font-black text-2xl uppercase text-white">
                04 // FRESHNESS & VERIFICATION SCHEDULE
              </h2>
            </div>

            <div className="space-y-3 font-sans text-xs sm:text-sm text-secondary leading-relaxed">
              <p>
                VloPedia runs an automated validation suite (`validate-seo-integrity.mjs`) during every production deployment. When Riot Games releases new patch notes, agent balances and weapon revisions are reviewed within 48 hours to update comparisons, tier ratings, and buy advice.
              </p>
              <div className="p-3 border border-[rgba(236,232,225,0.04)] bg-[#08111A] font-mono text-xs flex justify-between items-center">
                <span>Active Database Baseline:</span>
                <span className="text-white font-bold">Patch 9.04 · Last Verified: September 1, 2026</span>
              </div>
            </div>
          </div>

        </Container>
      </div>
    </PageTransition>
  );
}
