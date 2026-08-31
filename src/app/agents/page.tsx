import { Metadata } from "next";
import { AgentsClient } from "./agents-client";
import type { ValorantAgent } from "@/lib/valorant-types";
import { fetchWithCache } from "@/lib/api-cache";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "VALORANT Agents Catalogue: Roles, Abilities & Stats | ValoVault",
  description: "Explore details, stats, abilities, and origins for all VALORANT agents. Duelists, Controllers, Initiators, and Sentinels.",
  openGraph: {
    title: "VALORANT Agents Catalogue: Roles, Abilities & Stats | ValoVault",
    description: "Explore details, stats, abilities, and origins for all VALORANT agents. Duelists, Controllers, Initiators, and Sentinels.",
  },
  alternates: {
    canonical: "/agents",
  },
};

async function fetchAgents(): Promise<ValorantAgent[]> {
  try {
    const res = await fetchWithCache<{ data: ValorantAgent[] }>(
      "https://valorant-api.com/v1/agents?isPlayableCharacter=true"
    );
    return res.data ?? [];
  } catch {
    return [];
  }
}

export default async function AgentsIndexPage() {
  const agents = await fetchAgents();
  return <AgentsClient initialAgents={agents} />;
}
