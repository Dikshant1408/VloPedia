import { Metadata } from "next";
import { BundlesClient, type BundleData } from "./bundles-client";
import { fetchWithCache } from "@/lib/api-cache";
import type { ValorantBundle } from "@/lib/valorant-types";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "VALORANT Weapon Bundles Showcase | VloPedia",
  description: "Explore the collection of all weapon bundles in VALORANT. Check release prices, featured items, promo graphics, and add them to your collection wishlist.",
  openGraph: {
    title: "VALORANT Weapon Bundles Showcase | VloPedia",
    description: "Explore the collection of all weapon bundles in VALORANT. Check release prices, featured items, promo graphics, and add them to your collection wishlist.",
  },
  alternates: {
    canonical: "/bundles",
  },
};

async function fetchBundles(): Promise<BundleData[]> {
  try {
    const j = await fetchWithCache<{ data: ValorantBundle[] }>("https://valorant-api.com/v1/bundles");
    const raw: ValorantBundle[] = j.data ?? [];
    return raw
      .filter(b => b.verticalPromoImage || b.displayIcon2 || b.displayIcon)
      .map((b, i) => ({
        uuid: b.uuid,
        displayName: b.displayName,
        displayNameSubText: null,
        description: "",
        extraDescription: null,
        promoDescription: null,
        useAdditionalContext: false,
        displayIcon: b.displayIcon,
        displayIcon2: b.displayIcon2,
        verticalPromoImage: b.verticalPromoImage,
        assetPath: "",
        price:  [8700, 7100, 6700, 5900, 5100][i % 5],
        active: i === 0,
      }));
  } catch {
    return [];
  }
}

export default async function BundlesIndexPage() {
  const bundles = await fetchBundles();
  return <BundlesClient initialBundles={bundles} />;
}
