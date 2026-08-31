import { Metadata } from "next";
import { WeaponsClient } from "./weapons-client";
import type { ValorantWeapon } from "@/lib/valorant-types";
import { fetchWithCache } from "@/lib/api-cache";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "VALORANT Weapons Armory: Stats, Recoil & Skins | ValoVault",
  description: "Explore weapon stats, damage tables, magazines, fire rates, and custom skins for all VALORANT sidearms, rifles, smgs, snipers, and melees.",
  openGraph: {
    title: "VALORANT Weapons Armory: Stats, Recoil & Skins | ValoVault",
    description: "Explore weapon stats, damage tables, magazines, fire rates, and custom skins for all VALORANT sidearms, rifles, smgs, snipers, and melees.",
  },
  alternates: {
    canonical: "/weapons",
  },
};

async function fetchWeapons(): Promise<ValorantWeapon[]> {
  try {
    const res = await fetchWithCache<{ data: ValorantWeapon[] }>("https://valorant-api.com/v1/weapons");
    return res.data ?? [];
  } catch {
    return [];
  }
}

export default async function WeaponsIndexPage() {
  const weapons = await fetchWeapons();
  return <WeaponsClient initialWeapons={weapons} />;
}
