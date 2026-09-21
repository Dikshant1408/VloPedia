import { Metadata } from "next";
import { SkinsClient, type FlatSkin } from "./skins-client";
import { fetchWithCache } from "@/lib/api-cache";
import type { ValorantSkin } from "@/lib/valorant-types";
import { CONTENT_TIER_MAP } from "@/lib/valorant-types";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "VALORANT Weapon Skins Database: Tier Lists, Prices & All 1,400+ Skins | VloPedia",
  description: "Browse the complete database of all 1,400+ weapon skins in VALORANT. Filter by content tier, VP prices, inspect finisher visual effects, and explore dedicated weapon hubs.",
  openGraph: {
    title: "VALORANT Weapon Skins Database: Tier Lists, Prices & All 1,400+ Skins | VloPedia",
    description: "Browse the complete database of all 1,400+ weapon skins in VALORANT. Filter by content tier, VP prices, inspect finisher visual effects, and explore dedicated weapon hubs.",
  },
  alternates: {
    canonical: "/skins",
  },
};

const WEAPON_SLUGS = ["vandal","phantom","operator","spectre","ghost","classic","sheriff","frenzy","shorty","stinger","bucky","judge","bulldog","guardian","marshal","ares","odin","outlaw","melee"];

function weaponFromName(name: string, assetPath: string): string {
  const lower = name.toLowerCase();
  for (const w of WEAPON_SLUGS) if (lower.endsWith(w)) return w;
  const p = (assetPath || "").toLowerCase();
  if (p.includes("standardrifle")) return "phantom";
  if (p.includes("dmr")) return "vandal";
  if (p.includes("boltsniper")) return "operator";
  if (p.includes("standardsmg")) return "spectre";
  if (p.includes("revolver")) return "sheriff";
  if (p.includes("vesta")) return "classic";
  if (p.includes("slim")) return "shorty";
  if (p.includes("hollow")) return "frenzy";
  if (p.includes("spirit")) return "ghost";
  if (p.includes("burstsmg")) return "stinger";
  if (p.includes("pumpshotgun")) return "bucky";
  if (p.includes("autoshotgun")) return "judge";
  if (p.includes("burstrifle")) return "bulldog";
  if (p.includes("leversniper") && p.includes("marshal")) return "marshal";
  if (p.includes("leversniper")) return "guardian";
  if (p.includes("outlaw")) return "outlaw";
  if (p.includes("lightmachine")) return "ares";
  if (p.includes("heavymachine")) return "odin";
  if (p.includes("melee")) return "melee";
  return "vandal";
}

async function fetchSkins(): Promise<FlatSkin[]> {
  try {
    const j = await fetchWithCache<{ data: ValorantSkin[] }>("https://valorant-api.com/v1/weapons/skins");
    const raw: ValorantSkin[] = j.data ?? [];
    return raw
      .filter(s => !s.displayName.toLowerCase().startsWith("standard"))
      .map(s => {
        const tierInfo = CONTENT_TIER_MAP[s.contentTierUuid ?? ""];
        return {
          uuid:            s.uuid,
          displayName:     s.displayName,
          weaponSlug:      weaponFromName(s.displayName, s.assetPath),
          contentTierUuid: s.contentTierUuid,
          rarity:          tierInfo?.rarity ?? "PREMIUM",
          price:           tierInfo?.price  ?? 1775,
          color:           tierInfo?.color  ?? "#C084FC",
          displayIcon:     s.chromas?.[0]?.fullRender ?? s.chromas?.[0]?.displayIcon ?? s.displayIcon,
          fullRender:      s.chromas?.[0]?.fullRender ?? null,
        };
      });
  } catch {
    return [];
  }
}

import Link from "next/link";
import { Container } from "@/components/container";

export default async function SkinsIndexPage() {
  const skins = await fetchSkins();

  // Group count by weapon
  const countMap: Record<string, number> = {};
  for (const s of skins) {
    countMap[s.weaponSlug] = (countMap[s.weaponSlug] || 0) + 1;
  }

  const hubs = WEAPON_SLUGS.map(slug => ({
    slug,
    name: slug.toUpperCase(),
    count: countMap[slug] || 0,
  }));

  return (
    <>
      <SkinsClient initialSkins={skins} />

      {/* Server-Rendered Internal Link Mesh for Search Engines & Fast Weapon Filtering */}
      <section className="border-t border-border bg-[#0B141A] py-16" aria-label="Weapon Skin Directories">
        <Container>
          <div className="flex items-center gap-3 mb-4">
            <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
            <h2 className="font-display text-2xl uppercase tracking-tight text-foreground">
              Weapon Skin Hubs & Directories
            </h2>
          </div>
          <p className="text-xs text-muted mb-8 max-w-3xl leading-relaxed">
            Browse weapon-specific skin catalogs, inspect finisher visual effects, compare upgrade costs, and review complete tier lists for each weapon platform in VALORANT.
          </p>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {hubs.map(h => (
              <Link
                key={h.slug}
                href={`/skins/${h.slug}`}
                className="group flex flex-col justify-between border border-[rgba(236,232,225,0.08)] bg-surface-card p-3.5 hover:border-primary/50 hover:bg-surface-card/80 transition-all rounded"
              >
                <span className="font-display font-bold text-sm uppercase text-foreground group-hover:text-primary transition-colors">
                  {h.name} Skins
                </span>
                <span className="font-mono text-[10px] text-muted mt-1.5 flex items-center justify-between">
                  <span>{h.count} Skins</span>
                  <span className="text-primary group-hover:translate-x-0.5 transition-transform">→</span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
