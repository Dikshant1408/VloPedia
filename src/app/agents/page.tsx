import { Metadata } from "next";
import { AgentsClient } from "./agents-client";
import type { ValorantAgent } from "@/lib/valorant-types";
import { fetchWithCache } from "@/lib/api-cache";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "VALORANT Agents Catalogue: Roles, Abilities & Stats | VloPedia",
  description: "Explore details, stats, abilities, and origins for all VALORANT agents including upcoming operative Hush. Duelists, Controllers, Initiators, and Sentinels.",
  openGraph: {
    title: "VALORANT Agents Catalogue: Roles, Abilities & Stats | VloPedia",
    description: "Explore details, stats, abilities, and origins for all VALORANT agents including upcoming operative Hush. Duelists, Controllers, Initiators, and Sentinels.",
  },
  alternates: {
    canonical: "/agents",
  },
};

const HUSH_AGENT: ValorantAgent = {
  uuid: "upcoming-agent-31-hush",
  displayName: "HUSH",
  description: "Chinese Radiant Duelist codenamed 'Hush' showcased during VCT Champions. Features macroscopic telekinetic abilities, remote Spike manipulation, an aerial levitation anchor, nearsighting mist, and tactical signature mimicry.",
  developerName: "Hush",
  characterTags: ["Upcoming", "Duelist", "Radiant", "Telekinetic"],
  displayIcon: "/images/agent-hush.jpg",
  displayIconSmall: "/images/agent-hush.jpg",
  bustPortrait: "/images/agent-hush.jpg",
  fullPortrait: "/images/agent-hush.jpg",
  fullPortraitV2: "/images/agent-hush.jpg",
  killfeedPortrait: "/images/agent-hush.jpg",
  background: "",
  backgroundGradientColors: ["8b5cf6", "6366f1", "ec4899", "3b82f6"],
  assetPath: "ShooterGame/Content/Characters/Hush",
  isFullPortraitRightFacing: false,
  isPlayableCharacter: false,
  isBaseContent: false,
  role: {
    uuid: "dbe8757e-9e92-4ed4-b39f-9dfc589691d4",
    displayName: "Duelist",
    description: "Duelists are self-sufficient fraggers their team expects, through abilities and skills, to get first bloods and enter a site.",
    displayIcon: "https://media.valorant-api.com/agents/roles/dbe8757e-9e92-4ed4-b39f-9dfc589691d4/displayicon.png",
    assetPath: "ShooterGame/Content/Characters/Roles/Duelist_RoleData",
  },
  abilities: [
    {
      slot: "Passive",
      displayName: "TELEKINESIS",
      description: "Hush can remotely pick up unequipped weapons, sidearms, and interact with the Spike (start remote planting or defusing within 12 meters).",
      displayIcon: null,
    },
    {
      slot: "Ability1",
      displayName: "NEARSIGHT MIST",
      description: "EQUIP a projectile mist cylinder. FIRE to launch. Upon contact, expands into a dark purple obscuring cloud that nearsights any enemy looking into or standing within it.",
      displayIcon: null,
    },
    {
      slot: "Ability2",
      displayName: "LEVITATION ANCHOR",
      description: "INSTANTLY place an aerial suspension anchor. JUMP while standing near the anchor to propel upwards and hover in mid-air for 4 seconds, holding elevated off-angles.",
      displayIcon: null,
    },
    {
      slot: "Grenade",
      displayName: "KINETIC BURST",
      description: "FIRE a wave of telekinetic force forward that deflects projectile utility and knocks back approaching enemies.",
      displayIcon: null,
    },
    {
      slot: "Ultimate",
      displayName: "RESONANCE MIMICRY",
      description: "ACTIVATE to synchronize with an ally's tactical core, gaining a charged copy of their signature ability alongside enhanced combat haste for 15 seconds.",
      displayIcon: null,
    },
  ],
};

async function fetchAgents(): Promise<ValorantAgent[]> {
  try {
    const res = await fetchWithCache<{ data: ValorantAgent[] }>(
      "https://valorant-api.com/v1/agents?isPlayableCharacter=true"
    );
    const liveAgents = res.data ?? [];
    return [...liveAgents, HUSH_AGENT];
  } catch {
    return [HUSH_AGENT];
  }
}

export default async function AgentsIndexPage() {
  const agents = await fetchAgents();
  return <AgentsClient initialAgents={agents} />;
}
