"use client";

import { CosmeticsGrid, type CosmeticItem } from "@/components/cosmetics-grid";
import { fetchWithCache } from "@/lib/api-cache";

interface ValorantFlexItem {
  uuid: string;
  displayName: string;
  displayIcon: string;
}

async function fetchFlexItems(): Promise<CosmeticItem[]> {
  const json = await fetchWithCache<{ data: ValorantFlexItem[] }>("https://valorant-api.com/v1/flex");
  const items = json.data ?? [];
  return items
    .filter(f => f.displayIcon && f.displayName.toLowerCase() !== "none")
    .map(f => {
      // Clean up the " Flex" suffix from display names if present
      const cleanName = f.displayName.endsWith(" Flex")
        ? f.displayName.slice(0, -5)
        : f.displayName;
      return {
        uuid:        f.uuid,
        displayName: cleanName,
        imageUrl:    f.displayIcon,
        href:        `/flex/${f.uuid}`,
        animated:    false,
      };
    });
}

export default function FlexIndexPage() {
  return (
    <CosmeticsGrid
      title="FLEX ITEMS"
      eyebrow="EXPRESSIONS WHEEL"
      subtitle="Every agent accessory and handheld fidget item in VALORANT. Click any item to inspect its animations and diagnostics."
      searchPlaceholder="Search flex items…"
      cardAspect="square"
      columns={6}
      fetchFn={fetchFlexItems}
    />
  );
}
