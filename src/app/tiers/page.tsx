import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import type { ValorantCompetitiveTier, ValorantCompetitiveTierEntry } from "@/lib/valorant-types";
import { siteConfig } from "@/lib/site";
import competitiveTiersFallback from "@/data/competitive-tiers-fallback.json";

export const metadata = {
  title: "Competitive Ranks & Tiers | VloPedia",
  description: "Explore all VALORANT competitive ranks and divisions. Detailed lists and high-res badge icons for Iron, Bronze, Silver, Gold, Platinum, Diamond, Ascendant, Immortal, and Radiant.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Competitive Ranks & Tiers | VloPedia",
    description: "Explore all VALORANT competitive ranks and divisions. Detailed lists and high-res badge icons for Iron, Bronze, Silver, Gold, Platinum, Diamond, Ascendant, Immortal, and Radiant.",
    url: `${siteConfig.url}/tiers`,
  },
  alternates: {
    canonical: `${siteConfig.url}/tiers`,
  },
};

// Known division groups in display order
const DIVISIONS = [
  "Iron", "Bronze", "Silver", "Gold",
  "Platinum", "Diamond", "Ascendant", "Immortal", "Radiant",
];

const DIVISION_COLORS: Record<string, string> = {
  Iron: "#868986",
  Bronze: "#A5855D",
  Silver: "#BBC2C2",
  Gold: "#ECCF56",
  Platinum: "#59A9B6",
  Diamond: "#B489C4",
  Ascendant: "#6AE2AF",
  Immortal: "#BB3D65",
  Radiant: "#FFFFAA",
};

const DIVISION_DESCRIPTIONS: Record<string, string> = {
  Iron: "Foundational tier where players master crosshair placement, fundamental movement, and basic agent utility.",
  Bronze: "Developing tactical awareness, basic economy management, and standard site executions.",
  Silver: "Consistent mechanical aim, basic trade fragging, and coordinated team rotations.",
  Gold: "Strong mechanical fundamentals, deeper utility lineups, and regular voice communication.",
  Platinum: "High game sense, disciplined peeking, counter-strafing mastery, and solid site-retake coordination.",
  Diamond: "Elite mechanical precision, micro-strafing, advanced lurk timings, and adaptive playstyle adjustments.",
  Ascendant: "Top-tier competitive tier bridging Diamond and Immortal. Requires superior macro decision-making.",
  Immortal: "Competitive leaderboard tier. Regional rankings determine entry into top-tier professional matches.",
  Radiant: "The apex of competitive VALORANT. Reserved exclusively for the top 500 players in each geographical region.",
};

function groupByDivision(tiers: ValorantCompetitiveTierEntry[]): Record<string, ValorantCompetitiveTierEntry[]> {
  const groups: Record<string, ValorantCompetitiveTierEntry[]> = {};
  for (const div of DIVISIONS) groups[div] = [];
  for (const t of tiers) {
    const rawDiv = (t.divisionName || "").trim().toLowerCase();
    const matchedDiv = DIVISIONS.find(d => d.toLowerCase() === rawDiv);
    if (matchedDiv) {
      groups[matchedDiv].push(t);
    }
  }
  return groups;
}

async function getTiers(): Promise<ValorantCompetitiveTierEntry[]> {
  try {
    const res = await fetch("https://valorant-api.com/v1/competitivetiers", {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return competitiveTiersFallback as ValorantCompetitiveTierEntry[];
    const j = await res.json();
    const sets: ValorantCompetitiveTier[] = j.data ?? [];
    const latest = sets[sets.length - 1];
    if (latest) {
      const active = latest.tiers.filter(t => t.tier > 2 && (t.largeIcon || t.smallIcon));
      return active.length > 0 ? active : (competitiveTiersFallback as ValorantCompetitiveTierEntry[]);
    }
    return competitiveTiersFallback as ValorantCompetitiveTierEntry[];
  } catch {
    return competitiveTiersFallback as ValorantCompetitiveTierEntry[];
  }
}

export default async function TiersPage() {
  const tierEntries = await getTiers();
  const groups = groupByDivision(tierEntries);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#080B10] text-[#F4F4F5]">

        {/* Header */}
        <div className="border-b border-white/10 bg-[#0A0D14] pt-16 pb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-radial opacity-25 pointer-events-none" />
          <Container className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">
                RATINGS MATRIX // COMPETITIVE PROTOCOL
              </span>
            </div>
            
            <h1 className="font-display font-black text-5xl uppercase tracking-tight text-white sm:text-6xl lg:text-7xl">
              COMPETITIVE TIERS
            </h1>
            
            <p className="mt-4 max-w-2xl font-sans text-sm sm:text-base leading-relaxed text-[#94A3B8]">
              Complete ladder hierarchy for VALORANT ranked matchmaking — all 9 competitive divisions, 25 skill tiers, badge icons, and division guidelines.
            </p>

            {/* Quick-Jump Division Pills */}
            <div className="mt-8 flex flex-wrap gap-2 pt-4 border-t border-white/[0.08]">
              {DIVISIONS.map(divName => {
                const color = DIVISION_COLORS[divName] ?? "#FF4655";
                return (
                  <a
                    key={divName}
                    href={`#${divName.toLowerCase()}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-white/10 bg-[#10141D] text-xs font-mono font-bold tracking-wider uppercase text-[#94A3B8] hover:text-white hover:border-white/20 hover:bg-[#151B27] transition-all"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    {divName}
                  </a>
                );
              })}
            </div>
          </Container>
        </div>

        {/* Main Content Area */}
        <Container className="py-16 space-y-20">
          {DIVISIONS.map(divName => {
            const group = groups[divName] ?? [];
            if (group.length === 0) return null;
            const isRadiant = divName === "Radiant";
            const color = DIVISION_COLORS[divName] ?? "#FF4655";
            const description = DIVISION_DESCRIPTIONS[divName] ?? "";

            return (
              <Reveal key={divName}>
                <section id={divName.toLowerCase()} aria-label={divName} className="scroll-mt-24">
                  {/* Division Header */}
                  <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: color }} />
                        <h2
                          className={[
                            "font-display font-black uppercase tracking-tight",
                            isRadiant ? "text-4xl text-[#FF4655]" : "text-3xl sm:text-4xl text-white",
                          ].join(" ")}
                        >
                          {divName}
                        </h2>
                      </div>
                      {description && (
                        <p className="mt-2 text-xs sm:text-sm text-[#94A3B8] max-w-2xl font-sans">
                          {description}
                        </p>
                      )}
                    </div>

                    <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#64748B] shrink-0">
                      {isRadiant ? (
                        <span className="text-[#FF4655] font-black border border-[#FF4655]/30 bg-[#FF4655]/10 px-2.5 py-1">
                          APEX // TOP 500 REGIONAL
                        </span>
                      ) : (
                        <span>3 TIERS // 100 RR EACH</span>
                      )}
                    </div>
                  </div>

                  {/* Tier Cards Grid */}
                  <div
                    className={[
                      "grid gap-4 sm:gap-6",
                      isRadiant
                        ? "grid-cols-1 max-w-md"
                        : "grid-cols-1 sm:grid-cols-3",
                    ].join(" ")}
                  >
                    {group.map(tier => {
                      const icon = tier.largeIcon ?? tier.smallIcon;
                      const hexColor = tier.color?.length >= 6
                        ? `#${tier.color.slice(0, 6)}`
                        : color;

                      return (
                        <div
                          key={tier.tier}
                          className={[
                            "group relative flex items-center gap-5 border p-5 transition-all duration-300 clip-diagonal-sm overflow-hidden",
                            isRadiant
                              ? "border-[#FF4655]/60 bg-[#161218] hover:border-[#FF4655] shadow-[0_0_25px_rgba(255,70,85,0.2)]"
                              : "border-white/10 bg-[#0E121A] hover:border-white/25 hover:bg-[#121722]",
                          ].join(" ")}
                        >
                          {/* Rank Color Accent Bar */}
                          <div
                            aria-hidden="true"
                            className="absolute left-0 inset-y-0 w-[4px] transition-all"
                            style={{ backgroundColor: hexColor }}
                          />

                          {/* Large Rank Badge Artwork */}
                          {icon && (
                            <div
                              className={[
                                "relative shrink-0 flex items-center justify-center",
                                isRadiant ? "h-20 w-20 sm:h-24 sm:w-24" : "h-16 w-16 sm:h-18 sm:w-18",
                              ].join(" ")}
                            >
                              <Image
                                src={icon}
                                alt={tier.tierName}
                                fill
                                sizes={isRadiant ? "96px" : "72px"}
                                className="object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] transition-transform duration-300 group-hover:scale-110"
                                unoptimized
                              />
                            </div>
                          )}

                          {/* Rank Details */}
                          <div className="min-w-0 flex-1">
                            <span className="font-mono text-[10px] text-[#858B96] uppercase font-bold tracking-widest block">
                              DIV // {divName.toUpperCase()}
                            </span>
                            <h3
                              className={[
                                "font-display font-black uppercase tracking-tight truncate mt-0.5",
                                isRadiant ? "text-2xl sm:text-3xl text-[#FF4655]" : "text-xl sm:text-2xl text-white",
                              ].join(" ")}
                            >
                              {tier.tierName}
                            </h3>
                            <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-[#64748B]">
                              <span>TIER {tier.tier}</span>
                              <span className="text-white/20">•</span>
                              <span className="text-[#94A3B8]">
                                {isRadiant ? "Leaderboard" : "0–100 RR"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </Reveal>
            );
          })}
        </Container>
      </div>
    </PageTransition>
  );
}

