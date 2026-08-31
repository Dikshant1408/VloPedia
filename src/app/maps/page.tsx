import { Metadata } from "next";
import { MapsClient, type MapData } from "./maps-client";
import { fetchWithCache } from "@/lib/api-cache";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "VALORANT Maps: Strategies, Callouts & Layouts | ValoVault",
  description: "Browse the complete database of all maps in VALORANT. Examine coordinates, callouts, narratives, and tactical layouts for Ascent, Bind, Haven, Fracture, and others.",
  openGraph: {
    title: "VALORANT Maps: Strategies, Callouts & Layouts | ValoVault",
    description: "Browse the complete database of all maps in VALORANT. Examine coordinates, callouts, narratives, and tactical layouts for Ascent, Bind, Haven, Fracture, and others.",
  },
  alternates: {
    canonical: "/maps",
  },
};

async function fetchMaps(): Promise<MapData[]> {
  try {
    const j = await fetchWithCache<{ data: any[] }>("https://valorant-api.com/v1/maps");
    const raw = j.data ?? [];
    return raw
      .filter((m: any) => m.splash && m.displayIcon)
      .map((m: any) => ({
        slug:      m.displayName.toLowerCase().replace(/\s+/g, "-"),
        name:      m.displayName.toUpperCase(),
        location:  m.coordinates ?? undefined,
        splashUrl: m.splash || m.listViewIcon,
        lore:      m.narrativeDescription ?? undefined,
      }));
  } catch {
    return [];
  }
}

export default async function MapsIndexPage() {
  const maps = await fetchMaps();
  return <MapsClient initialMaps={maps} />;
}
