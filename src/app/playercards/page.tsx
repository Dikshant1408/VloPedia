import { Metadata } from "next";
import { CosmeticsGrid, type CosmeticItem } from "@/components/cosmetics-grid";
import type { ValorantPlayerCard } from "@/lib/valorant-types";
import { fetchWithCache } from "@/lib/api-cache";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "VALORANT Player Cards & Identity Banners | ValoVault",
  description: "Check out all profile banners, player cards, and identity items in VALORANT with HD portrait preview.",
  openGraph: {
    title: "VALORANT Player Cards & Identity Banners | ValoVault",
    description: "Check out all profile banners, player cards, and identity items in VALORANT with HD portrait preview.",
  },
  alternates: {
    canonical: "/playercards",
  },
};

async function fetchPlayerCards(): Promise<CosmeticItem[]> {
  try {
    const json = await fetchWithCache<{ data: ValorantPlayerCard[] }>("https://valorant-api.com/v1/playercards");
    const cards: ValorantPlayerCard[] = json.data ?? [];
    return cards
      .filter(c => c.largeArt)
      .map(c => ({
        uuid:        c.uuid,
        displayName: c.displayName,
        imageUrl:    c.largeArt,
        animated:    false,
      }));
  } catch {
    return [];
  }
}

export default async function PlayerCardsIndexPage() {
  const initialItems = await fetchPlayerCards();
  return (
    <CosmeticsGrid
      title="PLAYER CARDS"
      eyebrow="IDENTITY BANNERS"
      subtitle="Every profile banner and player card in VALORANT."
      searchPlaceholder="Search player cards…"
      cardAspect="portrait"
      columns={5}
      initialItems={initialItems}
    />
  );
}
