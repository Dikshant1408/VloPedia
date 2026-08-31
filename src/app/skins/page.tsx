import { Metadata } from "next";
import { SkinsClient, type FlatSkin } from "./skins-client";
import { fetchWithCache } from "@/lib/api-cache";
import type { ValorantSkin } from "@/lib/valorant-types";
import { CONTENT_TIER_MAP } from "@/lib/valorant-types";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "VALORANT Weapon Skins Catalogue | ValoVault",
  description: "Browse the complete database of all weapon skins in VALORANT. Filter by content tier, sort by price, search, and view HD variants.",
  openGraph: {
    title: "VALORANT Weapon Skins Catalogue | ValoVault",
    description: "Browse the complete database of all weapon skins in VALORANT. Filter by content tier, sort by price, search, and view HD variants.",
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

export default async function SkinsIndexPage() {
  const skins = await fetchSkins();
  return <SkinsClient initialSkins={skins} />;
}
