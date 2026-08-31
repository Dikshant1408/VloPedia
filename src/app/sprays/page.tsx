import { Metadata } from "next";
import { CosmeticsGrid, type CosmeticItem } from "@/components/cosmetics-grid";
import type { ValorantSpray } from "@/lib/valorant-types";
import { fetchWithCache } from "@/lib/api-cache";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "VALORANT Sprays & In-Game Decals Database | ValoVault",
  description: "Explore every in-game spray, animated decal, and tactical cosmetic in VALORANT with animations.",
  openGraph: {
    title: "VALORANT Sprays & In-Game Decals Database | ValoVault",
    description: "Explore every in-game spray, animated decal, and tactical cosmetic in VALORANT with animations.",
  },
  alternates: {
    canonical: "/sprays",
  },
};

async function fetchSprays(): Promise<CosmeticItem[]> {
  try {
    const json = await fetchWithCache<{ data: ValorantSpray[] }>("https://valorant-api.com/v1/sprays");
    const sprays: ValorantSpray[] = json.data ?? [];
    return sprays
      .filter(s => s.displayIcon && !s.isNullSpray)
      .map(s => ({
        uuid:        s.uuid,
        displayName: s.displayName,
        imageUrl:    s.animationPng ?? s.displayIcon,
        animated:    !!s.animationPng,
      }));
  } catch {
    return [];
  }
}

export default async function SpraysIndexPage() {
  const initialItems = await fetchSprays();
  return (
    <CosmeticsGrid
      title="SPRAYS"
      eyebrow="TACTICAL DECALS"
      subtitle="Every animated spray and in-game decal."
      searchPlaceholder="Search sprays…"
      cardAspect="square"
      columns={6}
      initialItems={initialItems}
    />
  );
}
