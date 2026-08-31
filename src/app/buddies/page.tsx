import { Metadata } from "next";
import { CosmeticsGrid, type CosmeticItem } from "@/components/cosmetics-grid";
import type { ValorantBuddy } from "@/lib/valorant-types";
import { fetchWithCache } from "@/lib/api-cache";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "VALORANT Gun Buddies & Charms Catalogue | ValoVault",
  description: "Browse the complete database of all gun buddies and weapon charms in VALORANT. Filter, search, and view HD icons.",
  openGraph: {
    title: "VALORANT Gun Buddies & Charms Catalogue | ValoVault",
    description: "Browse the complete database of all gun buddies and weapon charms in VALORANT. Filter, search, and view HD icons.",
  },
  alternates: {
    canonical: "/buddies",
  },
};

async function fetchBuddies(): Promise<CosmeticItem[]> {
  try {
    const json = await fetchWithCache<{ data: ValorantBuddy[] }>("https://valorant-api.com/v1/buddies");
    const buddies: ValorantBuddy[] = json.data ?? [];
    return buddies
      .filter(b => b.displayIcon)
      .map(b => ({
        uuid:        b.uuid,
        displayName: b.displayName,
        imageUrl:    b.displayIcon,
        animated:    false,
      }));
  } catch {
    return [];
  }
}

export default async function BuddiesIndexPage() {
  const initialItems = await fetchBuddies();
  return (
    <CosmeticsGrid
      title="BUDDIES"
      eyebrow="GUN BUDDIES"
      subtitle="Every weapon charm and attachment in VALORANT."
      searchPlaceholder="Search buddies…"
      cardAspect="square"
      columns={6}
      initialItems={initialItems}
    />
  );
}
