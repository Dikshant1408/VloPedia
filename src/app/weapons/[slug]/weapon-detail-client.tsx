"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronDown, ChevronUp, Shield, Zap, Crosshair, TrendingUp, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { Reveal, PageTransition } from "@/components/motion-system";
import { ContentTierBadge } from "@/components/content-tier-badge";
import { SkinCard } from "@/components/skin-card";
import { SkinShowcase } from "@/components/skin-showcase";
import { CONTENT_TIER_MAP } from "@/lib/valorant-types";
import type { ValorantWeapon, ValorantSkin } from "@/lib/valorant-types";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AnswerBox } from "@/components/answer-box";
import { BookmarkButton } from "@/components/bookmark-button";
import { RecordRecentView } from "@/components/record-recent-view";

// Clean category label
function categoryLabel(cat: string) {
  return cat.replace(/EEquippableCategory::/i, "");
}

// Stat bar: value as % of max
function StatBar({ label, value, display, max }: { label: string; value: number; display: string; max: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between font-mono-tactical text-[11px]">
        <span className="text-muted uppercase tracking-wider">{label}</span>
        <span className="font-bold text-white">{display}</span>
      </div>
      <div className="stat-bar-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="stat-bar-fill" style={{ transform: `scaleX(${pct / 100})` }} />
      </div>
    </div>
  );
}

interface WeaponDetailClientProps {
  weapon: ValorantWeapon;
  sameCategory: ValorantWeapon[];
}

export function WeaponDetailClient({ weapon, sameCategory }: WeaponDetailClientProps) {
  const [compareWith, setCompareWith] = useState<ValorantWeapon | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [skinsExpanded, setSkinsExpanded] = useState(false);

  const slug = weapon.displayName.toLowerCase().replace(/\s+/g, "-");
  const stats = weapon.weaponStats;
  const cost  = weapon.shopData?.cost;

  // Group skins by content tier
  const tierOrder = ["ULTRA", "EXCLUSIVE", "PREMIUM", "DELUXE", "SELECT", ""];
  const skinsByTier: Record<string, ValorantSkin[]> = {};
  for (const tier of tierOrder) skinsByTier[tier] = [];

  for (const skin of weapon.skins) {
    // Skip the default skin (no contentTierUuid usually means it's the base skin)
    if (skin.displayName.toLowerCase().includes("standard") && !skin.contentTierUuid) continue;
    const tierKey = CONTENT_TIER_MAP[skin.contentTierUuid ?? ""]?.rarity ?? "";
    skinsByTier[tierKey]?.push(skin);
  }

  const allSkins = tierOrder.flatMap(t => skinsByTier[t] ?? []).filter(s => s.chromas?.[0]?.fullRender || s.displayIcon);
  const SKINS_PREVIEW = 6;
  const displayedSkins = skinsExpanded ? allSkins : allSkins.slice(0, SKINS_PREVIEW);

  const breadcrumbItems = [
    { label: "Weapons", href: "/weapons" },
    { label: categoryLabel(weapon.category), href: `/weapons#${categoryLabel(weapon.category).toLowerCase()}` },
    { label: weapon.displayName }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        <RecordRecentView
          id={weapon.uuid}
          title={weapon.displayName}
          subtitle={`${categoryLabel(weapon.category)} · ${cost ? `${cost.toLocaleString()} VP` : "Free"}`}
          category="Weapon"
          href={`/weapons/${slug}`}
        />

        {/* Back nav + title strip */}
        <div className="border-b border-border bg-background pt-10 pb-10">
          <Container>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <Breadcrumbs items={breadcrumbItems} />
              <div className="flex items-center gap-2">
                <BookmarkButton
                  id={`weapon-${weapon.uuid}`}
                  title={weapon.displayName}
                  category="Weapon"
                  url={`/weapons/${weapon.displayName.toLowerCase().replace(/\s+/g, "-")}`}
                />
                <Link
                  href={`/skins/${slug}`}
                  className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1.5"
                >
                  <span>{weapon.displayName} Skins →</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Weapon guide link copied to clipboard!");
                  }}
                  className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-border bg-surface-card text-muted hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  Share Weapon
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
                    {categoryLabel(weapon.category)}
                  </span>
                </div>
                <h1 className="font-display text-5xl uppercase tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  {weapon.displayName}
                </h1>
              </div>
              {cost && (
                <div className="mb-1 rounded-md border border-border bg-surface-card px-5 py-3 shadow-xs">
                  <span className="block font-sans text-xs font-medium text-muted">Price</span>
                  <span className="font-mono text-2xl font-bold text-foreground">
                    {cost.toLocaleString()} <span className="text-sm text-primary">VP</span>
                  </span>
                </div>
              )}
            </div>
          </Container>
        </div>

        <Container className="py-16 space-y-10">
          {/* Quick Answer Box */}
          <Reveal>
            <AnswerBox
              question={`When should you buy the ${weapon.displayName}?`}
              verdict={`${cost ? `${cost.toLocaleString()} VP` : "Free"} ${categoryLabel(weapon.category)}`}
              explanation={`The ${weapon.displayName} is tailored for ${stats?.fireRate && stats.fireRate > 10 ? "rapid close-to-medium spray control" : "high-precision single-tap lethality"} with ${stats?.firstBulletAccuracy ? `${(stats.firstBulletAccuracy * 100).toFixed(0)}%` : "standard"} first-bullet accuracy.`}
              keyTakeaways={[
                `Magazine Capacity: ${stats?.magazineSize ?? 0} rounds`,
                `Fire Rate: ${stats?.fireRate ?? 0} rds/sec`,
                `Wall Penetration: ${stats?.wallPenetration ? stats.wallPenetration.replace(/EWallPenetrationDisplayType::/i, "") : "Medium"}`,
                `Reload Speed: ${stats?.reloadTimeSeconds ?? 0}s`
              ]}
              ctaLabel={`Compare ${weapon.displayName} with other weapons`}
              ctaHref={weapon.displayName.toLowerCase() === "vandal" ? "/compare/weapons/vandal-vs-phantom" : "/compare"}
            />
          </Reveal>

          {/* ── Main grid ── */}
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">

            {/* Left — 2.5D Cinematic Showcase Stage */}
            <Reveal>
              <div className="space-y-3">
                <SkinShowcase
                  weaponImageUrl={weapon.displayIcon}
                  weaponName={weapon.displayName}
                  subtitle={`${categoryLabel(weapon.category)} · ${cost ? `${cost.toLocaleString()} VP` : "Free"}`}
                  badgeLabel="Inspect"
                  aspectRatio="4/3"
                />
              </div>
            </Reveal>

            {/* Right — stats */}
            <Reveal>
              <div className="space-y-8">
                {stats ? (
                  <>
                    {/* Core stats */}
                    <div className="space-y-5">
                      <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-primary border-b border-border pb-3">
                        Weapon Statistics
                      </h2>
                      <StatBar label="Fire Rate"         value={stats.fireRate}             display={`${stats.fireRate} rds/s`}  max={16} />
                      <StatBar label="Magazine"          value={stats.magazineSize}          display={`${stats.magazineSize} rds`} max={50} />
                      <StatBar label="Reload Time"       value={1 / stats.reloadTimeSeconds} display={`${stats.reloadTimeSeconds}s`} max={1} />
                      <StatBar label="Equip Time"        value={1 / stats.equipTimeSeconds}  display={`${stats.equipTimeSeconds}s`}  max={1} />
                      <StatBar label="1st Bullet Acc."   value={stats.firstBulletAccuracy}   display={`${(stats.firstBulletAccuracy * 100).toFixed(1)}%`} max={1} />
                      {stats.adsStats && (
                        <StatBar label="ADS Zoom"        value={stats.adsStats.zoomMultiplier} display={`${stats.adsStats.zoomMultiplier}×`} max={8} />
                      )}
                    </div>

                    {/* Wall penetration + fire mode */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="border border-border bg-surface p-4 clip-diagonal-sm">
                        <span className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1 font-bold">Wall Penetration</span>
                        <span className="font-sans text-sm font-bold text-foreground capitalize flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          {stats.wallPenetration.replace(/EWallPenetrationDisplayType::/i, "").toLowerCase()}
                        </span>
                      </div>
                      {stats.fireMode && (
                        <div className="border border-border bg-surface p-4 clip-diagonal-sm">
                          <span className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1 font-bold">Firing Mode</span>
                          <span className="font-sans text-sm font-bold text-foreground capitalize flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#0DF2F2]" />
                            {stats.fireMode.replace(/EWeaponFireMode::/i, "").replace(/([A-Z])/g, " $1").trim().toLowerCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Damage ranges table — Scannable Tactical HUD Layout */}
                    {stats.damageRanges.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                            Damage by Distance Matrix
                          </h3>
                          <span className="font-mono text-[10px] text-muted uppercase">
                            Hitbox Distribution
                          </span>
                        </div>
                        <div className="overflow-x-auto border border-border bg-surface clip-diagonal-sm">
                          <table className="w-full font-mono text-xs" aria-label="Damage ranges">
                            <thead>
                              <tr className="border-b border-border/80 bg-surface-elevated text-muted">
                                <th className="py-2.5 px-4 text-left font-bold uppercase tracking-wider text-[10px]">Range</th>
                                <th className="py-2.5 px-3 text-center font-bold uppercase tracking-wider text-[10px] text-primary">Head</th>
                                <th className="py-2.5 px-3 text-center font-bold uppercase tracking-wider text-[10px] text-foreground">Body</th>
                                <th className="py-2.5 px-3 text-center font-bold uppercase tracking-wider text-[10px] text-muted">Legs</th>
                              </tr>
                            </thead>
                            <tbody>
                              {stats.damageRanges.map((dr, i) => {
                                const isOneTap = dr.headDamage >= 150;
                                return (
                                  <tr key={i} className="border-b border-border/40 hover:bg-surface-elevated/50 transition-colors">
                                    <td className="py-3 px-4 font-bold text-white">
                                      {dr.rangeStartMeters}m – {dr.rangeEndMeters}m
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 font-bold ${isOneTap ? "bg-primary/20 border border-primary/50 text-primary font-black" : "text-primary/90"}`}>
                                        {dr.headDamage}
                                        {isOneTap && <span className="text-[9px] uppercase tracking-tight">1-TAP</span>}
                                      </span>
                                    </td>
                                    <td className="py-3 px-3 text-center font-bold text-foreground">
                                      {dr.bodyDamage}
                                    </td>
                                    <td className="py-3 px-3 text-center font-bold text-muted">
                                      {dr.legDamage}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="font-sans text-sm text-muted">No stats available for this weapon.</p>
                )}

                {/* ADS Stats */}
                {stats?.adsStats && (
                  <div className="space-y-3">
                    <h3 className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary border-b border-border pb-3">
                      ADS STATS
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        { label: "Zoom",       val: `${stats.adsStats.zoomMultiplier}×`                        },
                        { label: "Fire Rate",  val: `${stats.adsStats.fireRate} rds/s`                         },
                        { label: "Run Speed",  val: `${stats.adsStats.runSpeedMultiplier}×`                    },
                        { label: "1st Bullet", val: `${(stats.adsStats.firstBulletAccuracy * 100).toFixed(2)}°`},
                      ].map(row => (
                        <div key={row.label} className="border border-border bg-surface p-3 text-center clip-diagonal-sm">
                          <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-muted mb-1">{row.label}</span>
                          <span className="font-mono text-sm font-bold text-white">{row.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compare button */}
                {sameCategory.length > 0 && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setCompareOpen(v => !v)}
                      aria-expanded={compareOpen}
                      className="flex w-full items-center justify-between border border-border bg-surface px-4 py-3 font-mono-tactical text-[11px] font-bold uppercase tracking-wider text-muted transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    >
                      Compare with another {categoryLabel(weapon.category)}
                      {compareOpen ? <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" /> : <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />}
                    </button>

                    {compareOpen && (
                      <div className="mt-2 border border-border bg-surface-card p-4 space-y-2">
                        <p className="font-mono-tactical text-[10px] text-muted uppercase tracking-wider">Select weapon:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {sameCategory.map(w => (
                            <button
                              key={w.uuid}
                              type="button"
                              onClick={() => setCompareWith(prev => prev?.uuid === w.uuid ? null : w)}
                              className={["flex items-center gap-3 border p-2 transition-colors text-left font-sans text-xs",
                                compareWith?.uuid === w.uuid
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border text-muted hover:border-white/30 hover:text-white"
                              ].join(" ")}
                            >
                              <div className="relative h-8 w-16 shrink-0">
                                <Image src={w.displayIcon} alt={w.displayName} fill sizes="64px" className="object-contain" unoptimized />
                              </div>
                              <span className="font-bold truncate">{w.displayName}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          {/* ── Compare panel ── */}
          {compareWith && compareWith.weaponStats && stats && (
            <Reveal className="mt-10">
              <div className="border border-primary/30 bg-primary-softer p-6 space-y-4">
                <h3 className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                  COMPARISON: {weapon.displayName} vs {compareWith.displayName}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full font-mono-tactical text-[11px]" aria-label={`Comparison: ${weapon.displayName} vs ${compareWith.displayName}`}>
                    <thead>
                      <tr className="border-b border-border text-muted">
                        <th className="py-2 pr-6 text-left font-bold uppercase tracking-wider">Stat</th>
                        <th className="py-2 px-4 text-center font-bold text-white">{weapon.displayName}</th>
                        <th className="py-2 px-4 text-center font-bold text-white">{compareWith.displayName}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Fire Rate",    a: stats.fireRate,              b: compareWith.weaponStats.fireRate,              fmt: (v: number) => `${v} rds/s` },
                        { label: "Magazine",     a: stats.magazineSize,          b: compareWith.weaponStats.magazineSize,          fmt: (v: number) => `${v} rds`   },
                        { label: "Reload",       a: stats.reloadTimeSeconds,     b: compareWith.weaponStats.reloadTimeSeconds,     fmt: (v: number) => `${v}s`       },
                        { label: "1st Bullet",   a: stats.firstBulletAccuracy,   b: compareWith.weaponStats.firstBulletAccuracy,   fmt: (v: number) => `${(v*100).toFixed(1)}%` },
                        { label: "Buy Cost",     a: weapon.shopData?.cost ?? 0,  b: compareWith.shopData?.cost ?? 0,               fmt: (v: number) => `${v} VP`    },
                      ].map(row => (
                        <tr key={row.label} className="border-b border-border/40">
                          <td className="py-2 pr-6 text-muted uppercase tracking-wider">{row.label}</td>
                          <td className={["py-2 px-4 text-center font-bold", row.a >= row.b ? "text-success" : "text-white"].join(" ")}>
                            {row.fmt(row.a)}
                          </td>
                          <td className={["py-2 px-4 text-center font-bold", row.b >= row.a ? "text-success" : "text-white"].join(" ")}>
                            {row.fmt(row.b)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          )}

          {/* ── Skins section ── */}
          {allSkins.length > 0 && (
            <Reveal className="mt-16 space-y-8">
              <div className="flex items-center justify-between border-b border-border pb-4 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
                  <h2 className="font-display text-3xl uppercase tracking-wide text-white">Skins</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono-tactical text-[10px] text-muted">{allSkins.length} available</span>
                  <Link
                    href={`/skins/${slug}`}
                    className="font-mono text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>Browse {weapon.displayName} Skin Hub & Tier List</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Grouped by tier */}
              {tierOrder.map(tier => {
                const group = skinsByTier[tier]?.filter(s => s.chromas?.[0]?.fullRender || s.displayIcon) ?? [];
                if (group.length === 0) return null;
                const tierInfo = Object.values(CONTENT_TIER_MAP).find(t => t.rarity === tier);
                return (
                  <div key={tier || "base"} className="space-y-4">
                    {tier && (
                      <div className="flex items-center gap-3">
                        <ContentTierBadge rarity={tier} showIcon />
                        <span className="font-mono-tactical text-[10px] text-muted">{group.length} skins</span>
                      </div>
                    )}
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {(skinsExpanded ? group : group.slice(0, 4)).map(skin => (
                        <SkinCard
                          key={skin.uuid}
                          skin={skin}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {allSkins.length > SKINS_PREVIEW && (
                <div className="flex flex-wrap justify-center items-center gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSkinsExpanded(v => !v)}
                    className="gap-2"
                  >
                    {skinsExpanded ? (
                      <><ChevronUp className="h-4 w-4" aria-hidden="true" /> Show less</>
                    ) : (
                      <><ChevronDown className="h-4 w-4" aria-hidden="true" /> Show all {allSkins.length} skins</>
                    )}
                  </Button>
                  <Link href={`/skins/${slug}`}>
                    <Button variant="secondary" className="font-mono text-xs uppercase tracking-wider">
                      Open Dedicated {weapon.displayName} Skin Hub →
                    </Button>
                  </Link>
                </div>
              )}
            </Reveal>
          )}
        </Container>

        {/* Tactical Analysis & Combat Profile */}
        <div className="border-t border-border bg-surface/10 py-16">
          <Container>
            <Reveal>
              <WeaponTacticalAnalysis weapon={weapon} />
            </Reveal>
          </Container>
        </div>

        {/* FAQ */}
        <div className="border-t border-border bg-surface/20 py-16">
          <Container>
            <Reveal>
              <WeaponFAQ weapon={weapon} />
            </Reveal>
          </Container>
        </div>

        {/* More weapons from same category */}
        {sameCategory.length > 0 && (
          <div className="border-t border-border bg-background py-16">
            <Container>
              <Reveal>
                <div className="flex items-center gap-3 mb-8">
                  <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
                  <h2 className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                    More {categoryLabel(weapon.category)}
                  </h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {sameCategory.slice(0, 4).map(w => (
                    <Link key={w.uuid}
                      href={`/weapons/${w.displayName.toLowerCase().replace(/\s+/g, "-")}`}
                      className="group flex items-center gap-4 border border-border bg-surface-card p-4 transition-all hover:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                      <div className="relative h-12 w-20 shrink-0">
                        <Image src={w.displayIcon} alt={w.displayName} fill sizes="80px"
                          className="object-contain transition-transform group-hover:scale-105" unoptimized />
                      </div>
                      <div>
                        <p className="font-display text-base uppercase text-white group-hover:text-primary transition-colors">{w.displayName}</p>
                        {w.shopData && (
                          <p className="font-mono-tactical text-[10px] text-primary">{w.shopData.cost.toLocaleString()} VP</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </Reveal>
            </Container>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

/* ── Tactical Analysis & Combat Profile ── */
function WeaponTacticalAnalysis({ weapon }: { weapon: ValorantWeapon }) {
  const stats = weapon.weaponStats;
  const cost = weapon.shopData?.cost ?? 0;
  const cat = categoryLabel(weapon.category);
  const name = weapon.displayName;

  if (!stats) return null;

  const firstRange = stats.damageRanges[0];
  const lastRange = stats.damageRanges[stats.damageRanges.length - 1];
  const isOneTap = firstRange && firstRange.headDamage >= 150;
  const closeShotsToKill = firstRange && firstRange.bodyDamage > 0 ? Math.ceil(150 / firstRange.bodyDamage) : 4;
  const farShotsToKill = lastRange && lastRange.bodyDamage > 0 ? Math.ceil(150 / lastRange.bodyDamage) : closeShotsToKill;
  const hasFalloff = firstRange && lastRange && firstRange.headDamage !== lastRange.headDamage;

  // Economy classification
  let ecoTier = "Full Buy Primary";
  let ecoDesc = "Standard weapon for full economy rounds. Pair with heavy shields and full utility loadouts.";
  if (cost === 0 || cost <= 800) {
    ecoTier = "Pistol & Light Economy";
    ecoDesc = "Ideal for round 1, round 13, and save rounds where preserving credits for future buy rounds is critical.";
  } else if (cost <= 1600) {
    ecoTier = "Anti-Eco / Force Buy";
    ecoDesc = "High cost-efficiency choice after winning pistol round or during aggressive round-two conversions.";
  } else if (cost <= 2400) {
    ecoTier = "Half Buy / Specialized Secondary";
    ecoDesc = "Capable of winning duels against full rifles while reserving funds for subsequent team executes.";
  }

  // Tactical Tips derived from stats
  const tips: string[] = [];
  if (isOneTap) {
    tips.push(`Crosshair placement is critical: The ${name} eliminates full-armor enemies (150 HP) with a single headshot at close range (${firstRange.headDamage} damage). Focus on pre-aiming head height at common angles.`);
  } else if (firstRange) {
    tips.push(`Head-to-body combinations: A single headshot (${firstRange.headDamage} damage) leaves full-armor targets with ${Math.max(0, 150 - firstRange.headDamage)} HP. Follow up instantly with 1 body shot to close out the elimination.`);
  }

  if (stats.fireRate >= 10) {
    tips.push(`High rate of fire (${stats.fireRate} rds/s): Excellent for aggressive entry and spray transfers, but monitor magazine consumption (${stats.magazineSize} rounds) during extended engagements.`);
  } else {
    tips.push(`Controlled pacing: With a fire rate of ${stats.fireRate} rds/s, burst-fire or single-tap cadences will yield far higher consistency than prolonged spray patterns.`);
  }

  if (stats.adsStats) {
    tips.push(`ADS Zoom (${stats.adsStats.zoomMultiplier}×): Switch to aim-down-sights when holding tight long-distance sightlines to reduce recoil dispersion.`);
  } else {
    tips.push(`First-bullet accuracy: Offers ${(stats.firstBulletAccuracy * 100).toFixed(1)}% base precision. Counter-strafe to come to a full stop before firing.`);
  }

  const wallPen = stats.wallPenetration ? stats.wallPenetration.replace(/EWallPenetrationDisplayType::/i, "") : "Medium";

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="space-y-2 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
            TACTICAL ANALYSIS &amp; COMBAT PROFILE
          </span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white">
          Competitive Overview &amp; Ballistics
        </h2>
        <p className="font-sans text-xs text-secondary leading-relaxed max-w-2xl">
          Frame-accurate mechanical breakdown, damage thresholds, and economic positioning formulated from official VALORANT ballistics telemetry.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Card 1: Lethality & TTK Profile */}
        <div className="rounded-lg border border-border bg-surface-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase font-bold">
            <Crosshair className="h-4 w-4" />
            <span>Lethality &amp; TTK Profile</span>
          </div>
          <p className="font-sans text-xs text-muted leading-relaxed">
            {isOneTap ? (
              <strong className="text-white block mb-1">
                Lethal 1-Tap: Deals {firstRange.headDamage} headshot damage, securing instant eliminations against 150 HP full shields.
              </strong>
            ) : (
              <span className="text-secondary block mb-1">
                Non-lethal headshot: Headshots deal {firstRange?.headDamage ?? 0} damage. Requires {closeShotsToKill} body shots for standard elimination.
              </span>
            )}
            {hasFalloff ? (
              <span>
                Falloff occurs beyond {firstRange.rangeEndMeters}m, decreasing headshot damage to {lastRange.headDamage} ({farShotsToKill} body shots required).
              </span>
            ) : (
              <span>Damage is uniform across all operational engagement distances with zero falloff penalties.</span>
            )}
          </p>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between font-mono text-[11px]">
            <span className="text-muted uppercase">Wallbang Tier:</span>
            <span className="text-white font-bold">{wallPen} Penetration</span>
          </div>
        </div>

        {/* Card 2: Recoil & Ballistics */}
        <div className="rounded-lg border border-border bg-surface-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-[#0DF2F2] font-mono text-xs uppercase font-bold">
            <Zap className="h-4 w-4" />
            <span>Recoil &amp; Spray Dynamics</span>
          </div>
          <p className="font-sans text-xs text-muted leading-relaxed">
            The {name} delivers <strong className="text-white">{(stats.firstBulletAccuracy * 100).toFixed(1)}% first-bullet accuracy</strong>. 
            Reload cycle takes <strong className="text-white">{stats.reloadTimeSeconds}s</strong> with an equip draw speed of <strong className="text-white">{stats.equipTimeSeconds}s</strong>.
            {stats.adsStats ? ` ADS reduces bullet spread with a ${stats.adsStats.zoomMultiplier}× optic magnification.` : " Hip-fire accuracy should be reset between bursts."}
          </p>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between font-mono text-[11px]">
            <span className="text-muted uppercase">Magazine / Ammo:</span>
            <span className="text-white font-bold">{stats.magazineSize} Rounds</span>
          </div>
        </div>

        {/* Card 3: Economy & Buy Context */}
        <div className="rounded-lg border border-border bg-surface-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase font-bold">
            <Coins className="h-4 w-4" />
            <span>Economy: {ecoTier}</span>
          </div>
          <p className="font-sans text-xs text-muted leading-relaxed">
            {ecoDesc} Costing <strong className="text-white">{cost > 0 ? `${cost.toLocaleString()} Creds` : "0 Creds (Free)"}</strong>, teams prioritize this firearm to maintain economic balance across defensive holds and offensive executes.
          </p>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between font-mono text-[11px]">
            <span className="text-muted uppercase">Price Point:</span>
            <span className="text-emerald-400 font-bold">{cost > 0 ? `${cost.toLocaleString()} VP` : "Default"}</span>
          </div>
        </div>

        {/* Card 4: Tactical Gameplay Tips */}
        <div className="rounded-lg border border-border bg-surface-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase font-bold">
            <TrendingUp className="h-4 w-4" />
            <span>Field Tactics &amp; Pro Tips</span>
          </div>
          <ul className="space-y-1.5 font-sans text-xs text-muted leading-relaxed">
            {tips.map((t, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold shrink-0">▸</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ── Weapon FAQ ── */
function WeaponFAQ({ weapon }: { weapon: ValorantWeapon }) {
  const stats = weapon.weaponStats;
  const cost  = weapon.shopData?.cost;
  const cat   = categoryLabel(weapon.category);
  const faqs  = [
    {
      q: `How much damage does the ${weapon.displayName} do in VALORANT?`,
      a: stats?.damageRanges?.[0]
        ? `The ${weapon.displayName} deals ${stats.damageRanges[0].headDamage} headshot, ${stats.damageRanges[0].bodyDamage} body, and ${stats.damageRanges[0].legDamage} leg damage at ${stats.damageRanges[0].rangeStartMeters}–${stats.damageRanges[0].rangeEndMeters}m.`
        : `Damage data is sourced from the VALORANT API.`,
    },
    {
      q: `How much does the ${weapon.displayName} cost?`,
      a: cost
        ? `The ${weapon.displayName} costs ${cost.toLocaleString()} credits. It is a ${cat.toLowerCase()} weapon.`
        : `The ${weapon.displayName} is a free weapon (Classic) or has no shop cost.`,
    },
    {
      q: `What are the ${weapon.displayName}'s stats?`,
      a: stats
        ? `Fire rate: ${stats.fireRate} rds/s, magazine: ${stats.magazineSize} rounds, reload: ${stats.reloadTimeSeconds}s. Wall penetration: ${stats.wallPenetration.replace(/EWallPenetrationDisplayType::/i, "").toLowerCase()}.`
        : `Full stats are available above.`,
    },
    ...(stats?.adsStats ? [{
      q: `Does the ${weapon.displayName} have ADS (Aim Down Sights)?`,
      a: `Yes, the ${weapon.displayName} has ${stats.adsStats.zoomMultiplier}× zoom when aiming down sights with a fire rate of ${stats.adsStats.fireRate} rds/s in ADS mode.`,
    }] : []),
  ];

  return (
    <div className="space-y-3 max-w-3xl">
      <div className="border-b border-border pb-3 flex items-center gap-3">
        <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
        <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">FAQ</span>
      </div>
      {faqs.map((faq, i) => (
        <details key={i} className="group border border-border bg-surface-card">
          <summary className="flex cursor-pointer items-center justify-between p-4 font-sans text-sm font-bold text-white list-none [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
            {faq.q}
            <span className="ml-3 shrink-0 font-mono-tactical text-primary transition-transform group-open:rotate-180">▾</span>
          </summary>
          <p className="border-t border-border px-4 pb-4 pt-3 font-sans text-xs leading-relaxed text-secondary">
            {faq.a}
          </p>
        </details>
      ))}
    </div>
  );
}
