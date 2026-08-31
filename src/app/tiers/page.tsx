import Image from "next/image";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import type { ValorantCompetitiveTier, ValorantCompetitiveTierEntry } from "@/lib/valorant-types";

export const metadata = {
  title: "Competitive Ranks & Tiers | ValoVault",
  description: "Explore all VALORANT competitive ranks and divisions. Detailed lists and high-res badge icons for Iron, Bronze, Silver, Gold, Platinum, Diamond, Ascendant, Immortal, and Radiant.",
  alternates: {
    canonical: "/tiers",
  },
};

// Known division groups in display order
const DIVISIONS = [
  "Iron", "Bronze", "Silver", "Gold",
  "Platinum", "Diamond", "Ascendant", "Immortal", "Radiant",
];

function groupByDivision(tiers: ValorantCompetitiveTierEntry[]): Record<string, ValorantCompetitiveTierEntry[]> {
  const groups: Record<string, ValorantCompetitiveTierEntry[]> = {};
  for (const div of DIVISIONS) groups[div] = [];
  for (const t of tiers) {
    const divName = t.divisionName || "Other";
    if (!groups[divName]) groups[divName] = [];
    groups[divName].push(t);
  }
  return groups;
}

async function getTiers(): Promise<ValorantCompetitiveTierEntry[]> {
  try {
    const res = await fetch("https://valorant-api.com/v1/competitivetiers");
    if (!res.ok) return [];
    const j = await res.json();
    const sets: ValorantCompetitiveTier[] = j.data ?? [];
    const latest = sets[sets.length - 1];
    if (latest) {
      // filter out tier 0 (Unranked filler) and tiers without icons
      return latest.tiers.filter(t => t.tier > 2 && (t.largeIcon || t.smallIcon));
    }
    return [];
  } catch {
    return [];
  }
}

export default async function TiersPage() {
  const tierEntries = await getTiers();
  const groups = groupByDivision(tierEntries);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">

        {/* Header */}
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">RATINGS MATRIX</span>
            </div>
            <h1 className="font-display text-6xl uppercase tracking-tight text-white sm:text-7xl">COMPETITIVE TIERS</h1>
            <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-secondary">
              Every rank and division in VALORANT competitive — icons, names, and placement.
            </p>
          </Container>
        </div>

        <Container className="py-16 space-y-16">
          {DIVISIONS.map(divName => {
            const group = groups[divName] ?? [];
            if (group.length === 0) return null;
            const isRadiant = divName === "Radiant";
            return (
              <Reveal key={divName}>
                <section aria-label={divName}>
                  {/* Division header */}
                  <div className="mb-6 flex items-center gap-4">
                    <h2
                      className={[
                        "font-display uppercase tracking-wide",
                        isRadiant ? "text-4xl text-primary" : "text-3xl text-white",
                      ].join(" ")}
                    >
                      {divName}
                    </h2>
                    <div className="h-px flex-1 bg-border" aria-hidden="true" />
                    {isRadiant && (
                      <span className="font-mono text-[10px] font-black uppercase tracking-widest text-primary">
                        HIGHEST RANK
                      </span>
                    )}
                  </div>

                  {/* Tier cards */}
                  <div className={[
                    "grid gap-4",
                    isRadiant
                      ? "grid-cols-1 sm:grid-cols-1 max-w-sm"
                      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
                  ].join(" ")}>
                    {group.map(tier => {
                      const icon = tier.largeIcon ?? tier.smallIcon;
                      const hexColor = tier.color?.length >= 6
                        ? `#${tier.color.slice(0, 6)}`
                        : "#FF4655";
                      return (
                        <div
                          key={tier.tier}
                          className={[
                            "group relative flex items-center gap-4 border bg-[#0D1A22] p-4 transition-all duration-300",
                            isRadiant
                              ? "border-primary/60 bg-primary/5 hover:border-primary glow-primary"
                              : "border-border hover:border-white/30",
                          ].join(" ")}
                        >
                          {/* Accent line */}
                          <div
                            aria-hidden="true"
                            className="absolute left-0 inset-y-0 w-[3px] rounded-r-full transition-all"
                            style={{ backgroundColor: hexColor }}
                          />

                          {icon && (
                            <div
                              className={[
                                "relative shrink-0",
                                isRadiant ? "h-20 w-20" : "h-12 w-12",
                              ].join(" ")}
                            >
                              <Image
                                src={icon}
                                alt={tier.tierName}
                                fill
                                sizes={isRadiant ? "80px" : "48px"}
                                className="object-contain transition-transform duration-300 group-hover:scale-105"
                                unoptimized
                              />
                            </div>
                          )}

                          <div>
                            <p
                              className={[
                                "font-display uppercase leading-none tracking-wide",
                                isRadiant ? "text-2xl text-primary" : "text-base text-white",
                              ].join(" ")}
                            >
                              {tier.tierName}
                            </p>
                            <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted mt-1">
                              Tier {tier.tier}
                            </p>
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
