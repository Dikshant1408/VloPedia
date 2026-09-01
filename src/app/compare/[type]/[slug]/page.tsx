import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { siteConfig } from "@/lib/site";
import { fetchWithCache } from "@/lib/api-cache";
import type { ValorantWeapon, ValorantAgent } from "@/lib/valorant-types";
import { ArrowLeft, GitCompare, CheckCircle, XCircle, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export const dynamic = "force-static";

const WEAPON_PAIRS = [
  "vandal-vs-phantom",
  "operator-vs-outlaw",
  "spectre-vs-stinger",
  "sheriff-vs-ghost",
  "ares-vs-odin",
  "bulldog-vs-guardian",
];

const AGENT_PAIRS = [
  "jett-vs-raze",
  "omen-vs-clove",
  "sova-vs-fade",
  "cypher-vs-killjoy",
  "viper-vs-harbor",
  "breach-vs-kayo",
];

export async function generateStaticParams() {
  const weaponParams = WEAPON_PAIRS.map(slug => ({ type: "weapons", slug }));
  const agentParams = AGENT_PAIRS.map(slug => ({ type: "agents", slug }));
  return [...weaponParams, ...agentParams];
}

type Props = { params: Promise<{ type: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, slug } = await params;
  const parts = slug.split("-vs-");
  const name1 = parts[0]?.toUpperCase() || "ITEM 1";
  const name2 = parts[1]?.toUpperCase() || "ITEM 2";

  const pageTitle = `${name1} vs ${name2} — Definitive VALORANT Comparison & Stats | VloPedia`;
  const pageDesc = `Detailed side-by-side comparison of ${name1} vs ${name2} in VALORANT. Compare damage profiles, fire rates, tactical advantages, and meta win rates.`;

  return {
    title: pageTitle,
    description: pageDesc,
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: `${siteConfig.url}/compare/${type}/${slug}`,
    },
    alternates: {
      canonical: `${siteConfig.url}/compare/${type}/${slug}`,
    },
  };
}

export default async function ComparePage({ params }: Props) {
  const { type, slug } = await params;
  const parts = slug.split("-vs-");
  if (parts.length !== 2) notFound();

  const slug1 = parts[0];
  const slug2 = parts[1];

  const breadcrumbItems = [
    { label: "Compare", href: "/compare" },
    { label: type === "weapons" ? "Weapons" : "Operatives", href: "/compare" },
    { label: `${slug1.toUpperCase()} vs ${slug2.toUpperCase()}` }
  ];

  if (type === "weapons") {
    const res = await fetchWithCache<{ data: ValorantWeapon[] }>("https://valorant-api.com/v1/weapons");
    const weapons = res.data ?? [];
    const w1 = weapons.find(w => w.displayName.toLowerCase().replace(/\s+/g, "-") === slug1 || w.displayName.toLowerCase() === slug1);
    const w2 = weapons.find(w => w.displayName.toLowerCase().replace(/\s+/g, "-") === slug2 || w.displayName.toLowerCase() === slug2);

    if (!w1 || !w2) notFound();

    const stats1 = w1.weaponStats;
    const stats2 = w2.weaponStats;

    return (
      <PageTransition>
        <div className="min-h-screen bg-[#0B141A] text-foreground">
          <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-10 pb-10">
            <Container>
              <div className="mb-4">
                <Breadcrumbs items={breadcrumbItems} />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2 h-2 bg-primary" />
                <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-primary">
                  HEAD-TO-HEAD WEAPON ANALYSIS
                </span>
              </div>
              <h1 className="font-display font-black text-4xl uppercase tracking-tight text-white sm:text-6xl">
                {w1.displayName} <span className="text-muted/40">vs</span> {w2.displayName}
              </h1>
            </Container>
          </div>

          <Container className="py-16 space-y-12">
            {/* Visual Hero Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-4">
                <div className="relative h-28 w-full bg-[#08111A] border border-[rgba(236,232,225,0.04)]">
                  <Image src={w1.displayIcon} alt={w1.displayName} fill className="object-contain p-4" unoptimized />
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-black text-2xl uppercase text-white">{w1.displayName}</h2>
                  <span className="font-mono text-lg font-black text-primary">{w1.shopData?.cost?.toLocaleString() ?? 0} VP</span>
                </div>
                <Link href={`/weapons/${slug1}`} className="block text-center font-mono text-xs uppercase py-2 border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  View Full {w1.displayName} Guide →
                </Link>
              </div>

              <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-4">
                <div className="relative h-28 w-full bg-[#08111A] border border-[rgba(236,232,225,0.04)]">
                  <Image src={w2.displayIcon} alt={w2.displayName} fill className="object-contain p-4" unoptimized />
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-black text-2xl uppercase text-white">{w2.displayName}</h2>
                  <span className="font-mono text-lg font-black text-[#0DF2F2]">{w2.shopData?.cost?.toLocaleString() ?? 0} VP</span>
                </div>
                <Link href={`/weapons/${slug2}`} className="block text-center font-mono text-xs uppercase py-2 border border-[#0DF2F2]/40 bg-[#0DF2F2]/10 text-[#0DF2F2] hover:bg-[#0DF2F2]/20 transition-colors">
                  View Full {w2.displayName} Guide →
                </Link>
              </div>
            </div>

            {/* Spec Matrix Table */}
            {stats1 && stats2 && (
              <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-8 clip-diagonal-sm space-y-6">
                <h3 className="font-display font-black text-xl uppercase text-white border-b border-[rgba(236,232,225,0.08)] pb-4">
                  Specification Matrix
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full font-mono text-xs">
                    <thead>
                      <tr className="border-b border-[rgba(236,232,225,0.08)] text-muted text-[10px] uppercase">
                        <th className="py-3 text-left">Tactical Metric</th>
                        <th className="py-3 text-center text-primary font-bold">{w1.displayName}</th>
                        <th className="py-3 text-center text-[#0DF2F2] font-bold">{w2.displayName}</th>
                        <th className="py-3 text-right">Advantage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(236,232,225,0.04)]">
                      {[
                        { label: "Price", a: w1.shopData?.cost ?? 0, b: w2.shopData?.cost ?? 0, fmt: (v: number) => `${v} VP`, lowerBetter: true },
                        { label: "Fire Rate", a: stats1.fireRate, b: stats2.fireRate, fmt: (v: number) => `${v} rds/s`, lowerBetter: false },
                        { label: "Magazine Capacity", a: stats1.magazineSize, b: stats2.magazineSize, fmt: (v: number) => `${v} rds`, lowerBetter: false },
                        { label: "Reload Speed", a: stats1.reloadTimeSeconds, b: stats2.reloadTimeSeconds, fmt: (v: number) => `${v}s`, lowerBetter: true },
                        { label: "First Bullet Accuracy", a: stats1.firstBulletAccuracy, b: stats2.firstBulletAccuracy, fmt: (v: number) => `${(v*100).toFixed(1)}%`, lowerBetter: false },
                      ].map(row => {
                        const winA = row.lowerBetter ? row.a < row.b : row.a > row.b;
                        const winB = row.lowerBetter ? row.b < row.a : row.b > row.a;
                        const tie = row.a === row.b;

                        return (
                          <tr key={row.label}>
                            <td className="py-3 text-muted uppercase">{row.label}</td>
                            <td className={`py-3 text-center font-bold ${winA ? "text-primary" : "text-white"}`}>
                              {row.fmt(row.a)}
                            </td>
                            <td className={`py-3 text-center font-bold ${winB ? "text-[#0DF2F2]" : "text-white"}`}>
                              {row.fmt(row.b)}
                            </td>
                            <td className="py-3 text-right font-bold uppercase text-[10px]">
                              {tie ? "EVEN" : winA ? `${w1.displayName}` : `${w2.displayName}`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tactical Situational Verdict */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="border border-primary/20 bg-primary/5 p-6 clip-diagonal space-y-3">
                <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold uppercase">
                  <Zap className="h-4 w-4" />
                  <span>Choose {w1.displayName} If:</span>
                </div>
                <ul className="font-sans text-xs sm:text-sm text-secondary space-y-2 list-disc list-inside leading-relaxed">
                  <li>You prioritize guaranteed one-tap headshot lethality at all engagement ranges (0-50m+).</li>
                  <li>Your playstyle emphasizes tapping and short 2-bullet burst discipline.</li>
                  <li>You hold long sightlines (e.g. Ascent Mid, Breeze B Long, Pearl B Main).</li>
                </ul>
              </div>

              <div className="border border-[#0DF2F2]/20 bg-[#0DF2F2]/5 p-6 clip-diagonal space-y-3">
                <div className="flex items-center gap-2 text-[#0DF2F2] font-mono text-xs font-bold uppercase">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Choose {w2.displayName} If:</span>
                </div>
                <ul className="font-sans text-xs sm:text-sm text-secondary space-y-2 list-disc list-inside leading-relaxed">
                  <li>You frequently spam through controller smokes without bullet tracers revealing your location.</li>
                  <li>You excel in close-to-medium range multi-target spray transfers.</li>
                  <li>You want a faster fire rate (11 rds/s) and a larger 30-round magazine reserve.</li>
                </ul>
              </div>
            </div>

          </Container>
        </div>
      </PageTransition>
    );
  }

  // Agents comparison
  const res = await fetchWithCache<{ data: ValorantAgent[] }>("https://valorant-api.com/v1/agents?isPlayableCharacter=true");
  const agents = res.data ?? [];
  const a1 = agents.find(a => a.displayName.toLowerCase().replace(/\s+/g, "-") === slug1 || a.displayName.toLowerCase() === slug1);
  const a2 = agents.find(a => a.displayName.toLowerCase().replace(/\s+/g, "-") === slug2 || a.displayName.toLowerCase() === slug2);

  if (!a1 || !a2) notFound();

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-10 pb-10">
          <Container>
            <div className="mb-4">
              <Breadcrumbs items={breadcrumbItems} />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 bg-[#0DF2F2]" />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#0DF2F2]">
                HEAD-TO-HEAD OPERATIVE COMPARISON
              </span>
            </div>
            <h1 className="font-display font-black text-4xl uppercase tracking-tight text-white sm:text-6xl">
              {a1.displayName} <span className="text-muted/40">vs</span> {a2.displayName}
            </h1>
          </Container>
        </div>

        <Container className="py-16 space-y-12">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-4">
              <div className="relative h-44 w-full bg-[#08111A] border border-[rgba(236,232,225,0.04)]">
                <Image src={a1.fullPortrait || a1.displayIcon} alt={a1.displayName} fill className="object-contain p-2" unoptimized />
              </div>
              <div className="flex items-center justify-between">
                <h2 className="font-display font-black text-2xl uppercase text-white">{a1.displayName}</h2>
                <span className="font-mono text-xs uppercase text-primary px-2 py-1 border border-primary/30">{a1.role?.displayName}</span>
              </div>
              <p className="font-sans text-xs text-secondary line-clamp-3">{a1.description}</p>
              <Link href={`/agents/${slug1}`} className="block text-center font-mono text-xs uppercase py-2 border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                View Full {a1.displayName} Dossier →
              </Link>
            </div>

            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-4">
              <div className="relative h-44 w-full bg-[#08111A] border border-[rgba(236,232,225,0.04)]">
                <Image src={a2.fullPortrait || a2.displayIcon} alt={a2.displayName} fill className="object-contain p-2" unoptimized />
              </div>
              <div className="flex items-center justify-between">
                <h2 className="font-display font-black text-2xl uppercase text-white">{a2.displayName}</h2>
                <span className="font-mono text-xs uppercase text-[#0DF2F2] px-2 py-1 border border-[#0DF2F2]/30">{a2.role?.displayName}</span>
              </div>
              <p className="font-sans text-xs text-secondary line-clamp-3">{a2.description}</p>
              <Link href={`/agents/${slug2}`} className="block text-center font-mono text-xs uppercase py-2 border border-[#0DF2F2]/40 bg-[#0DF2F2]/10 text-[#0DF2F2] hover:bg-[#0DF2F2]/20 transition-colors">
                View Full {a2.displayName} Dossier →
              </Link>
            </div>
          </div>

          {/* Tactical Operative Verdict */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-primary/20 bg-primary/5 p-6 clip-diagonal space-y-3">
              <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold uppercase">
                <Zap className="h-4 w-4" />
                <span>Pick {a1.displayName} If:</span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-secondary leading-relaxed">
                You excel with high-mobility duelists who can create instantaneous space for your team or aggressively hold Operator angles with an escape mechanism.
              </p>
            </div>

            <div className="border border-[#0DF2F2]/20 bg-[#0DF2F2]/5 p-6 clip-diagonal space-y-3">
              <div className="flex items-center gap-2 text-[#0DF2F2] font-mono text-xs font-bold uppercase">
                <ShieldCheck className="h-4 w-4" />
                <span>Pick {a2.displayName} If:</span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-secondary leading-relaxed">
                You prefer explosive AOE area denial, clearing sentinel trap setups, and taking site control with aggressive vertical movement.
              </p>
            </div>
          </div>
        </Container>
      </div>
    </PageTransition>
  );
}
