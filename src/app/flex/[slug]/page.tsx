import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchWithCache } from "@/lib/api-cache";
import { FlexInspectClient } from "./flex-inspect-client";

interface ValorantFlexItem {
  uuid: string;
  displayName: string;
  displayIcon: string;
  assetPath: string;
}

async function getAllFlexItems(): Promise<ValorantFlexItem[]> {
  try {
    const json = await fetchWithCache<{ data: ValorantFlexItem[] }>("https://valorant-api.com/v1/flex");
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const items = await getAllFlexItems();
  return items
    .filter(f => f.displayName.toLowerCase() !== "none")
    .map(f => ({ slug: f.uuid }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const items = await getAllFlexItems();
  const item = items.find(i => i.uuid === slug);
  if (!item) return { title: "Flex Item Not Found | ValoVault", robots: { index: false } };

  const cleanName = item.displayName.endsWith(" Flex")
    ? item.displayName.slice(0, -5)
    : item.displayName;

  return {
    title: `${cleanName} Inspect | ValoVault`,
    description: `Inspect the interactive animation, 3D diagnostics, and hologram view for the ${cleanName} expression accessory.`,
    alternates: {
      canonical: `/flex/${slug}`,
    },
  };
}

export default async function FlexDetailPage({ params }: Props) {
  const { slug } = await params;
  const items = await getAllFlexItems();
  const item = items.find(i => i.uuid === slug);
  if (!item) notFound();

  return <FlexInspectClient item={item} />;
}
