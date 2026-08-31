"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { Reveal, PageTransition } from "@/components/motion-system";
import { ContentTierBadge } from "@/components/content-tier-badge";
import { SkinCard } from "@/components/skin-card";
import WeaponViewer3D from "@/components/WeaponViewer3D";
import { CONTENT_TIER_MAP } from "@/lib/valorant-types";
import type { ValorantWeapon, ValorantSkin } from "@/lib/valorant-types";
import { toast } from "sonner";

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

interface Props {
  weapon: ValorantWeapon;
  sameCategory: ValorantWeapon[];
}

export function WeaponDetailClient({ weapon, sameCategory }: Props) {
  const [compareWith, setCompareWith] = useState<ValorantWeapon | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [skinsExpanded, setSkinsExpanded] = useState(false);

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

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        {/* Back nav + title strip */}
        <div className="border-b border-border bg-background pt-16 pb-10">
          <Container>
            <div className="flex items-center justify-between mb-6">
              <Link href="/weapons" className="inline-flex items-center gap-2 font-mono-tactical text-[11px] font-bold uppercase tracking-wider text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                All Weapons
              </Link>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Weapon guide link copied to clipboard!");
                }}
                className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-[rgba(236,232,225,0.12)] bg-[#0D1820] text-muted hover:text-white hover:border-primary/40 transition-colors"
              >
                Share Weapon
              </button>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
                  <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                    {categoryLabel(weapon.category)}
                  </span>
                </div>
                <h1 className="font-display text-5xl uppercase tracking-tight text-white sm:text-6xl lg:text-7xl">
                  {weapon.displayName}
                </h1>
              </div>
              {cost && (
                <div className="mb-1 border border-border bg-surface px-5 py-3">
                  <span className="block font-mono-tactical text-[10px] font-bold uppercase tracking-widest text-muted">BUY COST</span>
                  <span className="font-mono-tactical text-2xl font-black text-white">
                    {cost.toLocaleString()} <span className="text-sm text-primary">VP</span>
                  </span>
                </div>
              )}
            </div>
          </Container>
        </div>

        <Container className="py-16">
          {/* ── Main grid ── */}
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">

            {/* Left — 3D viewer */}
            <Reveal>
              <div className="space-y-4">
                <div className="relative border border-border bg-black overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <div aria-hidden="true" className="absolute left-0 top-0 h-[2px] w-12 bg-primary z-10" />
                  <div aria-hidden="true" className="absolute right-0 top-0 bg-primary px-3 py-1 font-mono-tactical text-[10px] font-black tracking-wider text-black z-10">
                    3D MODEL
                  </div>
                  <WeaponViewer3D
                    weaponImageUrl={weapon.displayIcon}
                    weaponName={weapon.displayName}
                    containerRef={{ current: null }}
                  />
                </div>

                {/* 2D fallback image strip */}
                <div className="relative h-20 border border-border bg-surface-card overflow-hidden">
                  <Image
                    src={weapon.displayIcon}
                    alt={weapon.displayName}
                    fill
                    sizes="(max-width:1024px) 100vw, 50vw"
                    className="object-contain px-8 py-2"
                    unoptimized
                  />
                </div>
              </div>
            </Reveal>

            {/* Right — stats */}
            <Reveal>
              <div className="space-y-8">
                {stats ? (
                  <>
                    {/* Core stats */}
                    <div className="space-y-5">
                      <h2 className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary border-b border-border pb-3">
                        WEAPON STATS
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
                      <div className="border border-border bg-surface-card p-4">
                        <span className="block font-mono-tactical text-[9px] font-bold uppercase tracking-widest text-muted mb-1">Wall Pen.</span>
                        <span className="font-mono-tactical text-sm font-bold text-white capitalize">
                          {stats.wallPenetration.replace(/EWallPenetrationDisplayType::/i, "").toLowerCase()}
                        </span>
                      </div>
                      {stats.fireMode && (
                        <div className="border border-border bg-surface-card p-4">
                          <span className="block font-mono-tactical text-[9px] font-bold uppercase tracking-widest text-muted mb-1">Fire Mode</span>
                          <span className="font-mono-tactical text-sm font-bold text-white capitalize">
                            {stats.fireMode.replace(/EWeaponFireMode::/i, "").replace(/([A-Z])/g, " $1").trim().toLowerCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Damage ranges table */}
                    {stats.damageRanges.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary border-b border-border pb-3">
                          DAMAGE RANGES
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full font-mono-tactical text-[11px]" aria-label="Damage ranges">
                            <thead>
                              <tr className="border-b border-border text-muted">
                                <th className="py-2 pr-4 text-left font-bold uppercase tracking-wider">Range (m)</th>
                                <th className="py-2 px-3 text-center font-bold uppercase tracking-wider text-error/80">Head</th>
                                <th className="py-2 px-3 text-center font-bold uppercase tracking-wider text-secondary">Body</th>
                                <th className="py-2 px-3 text-center font-bold uppercase tracking-wider text-muted">Legs</th>
                              </tr>
                            </thead>
                            <tbody>
                              {stats.damageRanges.map((dr, i) => (
                                <tr key={i} className="border-b border-border/40">
                                  <td className="py-2 pr-4 text-muted">
                                    {dr.rangeStartMeters}–{dr.rangeEndMeters}
                                  </td>
                                  <td className="py-2 px-3 text-center font-bold text-error">{dr.headDamage}</td>
                                  <td className="py-2 px-3 text-center font-bold text-secondary">{dr.bodyDamage}</td>
                                  <td className="py-2 px-3 text-center font-bold text-muted">{dr.legDamage}</td>
                                </tr>
                              ))}
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
                        <div key={row.label} className="border border-border bg-surface-card p-3 text-center">
                          <span className="block font-mono-tactical text-[9px] font-bold uppercase tracking-wider text-muted mb-1">{row.label}</span>
                          <span className="font-mono-tactical text-sm font-bold text-white">{row.val}</span>
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
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
                  <h2 className="font-display text-3xl uppercase tracking-wide text-white">Skins</h2>
                </div>
                <span className="font-mono-tactical text-[10px] text-muted">{allSkins.length} available</span>
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
                <div className="flex justify-center pt-4">
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
                </div>
              )}
            </Reveal>
          )}
        </Container>

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
