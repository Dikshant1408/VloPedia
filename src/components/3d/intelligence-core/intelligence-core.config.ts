export type CoreDomain = 
  | "idle" 
  | "agents" 
  | "weapons" 
  | "skins" 
  | "maps" 
  | "bundles" 
  | "tools";

export interface DomainMeta {
  id: CoreDomain;
  label: string;
  count: string;
  metric: string;
  accentColor: string;
  secondaryColor: string;
  href: string;
  description: string;
}

export const DOMAIN_METADATA: Record<CoreDomain, DomainMeta> = {
  idle: {
    id: "idle",
    label: "Core Matrix",
    count: "6 Verticals",
    metric: "PATCH 13.06",
    accentColor: "#FF4655",
    secondaryColor: "#0DF2F2",
    href: "/",
    description: "VloPedia centralized VALORANT intelligence database.",
  },
  agents: {
    id: "agents",
    label: "Operatives",
    count: "29 Agents",
    metric: "4 Roles",
    accentColor: "#FF4655",
    secondaryColor: "#0DF2F2",
    href: "/agents",
    description: "Abilities, synergies, counter-picks, and competitive playbooks.",
  },
  weapons: {
    id: "weapons",
    label: "Arsenal",
    count: "21 Weapons",
    metric: "Ballistics",
    accentColor: "#FF4655",
    secondaryColor: "#F59E0B",
    href: "/weapons",
    description: "Damage falloff curves, fire rates, first-bullet spread, and economy.",
  },
  skins: {
    id: "skins",
    label: "Cosmetic Vault",
    count: "1,400+ Skins",
    metric: "Finishers & Chromas",
    accentColor: "#EAB308",
    secondaryColor: "#A855F7",
    href: "/skins",
    description: "High-definition 3D inspects, sound effects, chromas, and VP tiers.",
  },
  maps: {
    id: "maps",
    label: "Terrains",
    count: "18 Maps",
    metric: "7 Active Comp",
    accentColor: "#0DF2F2",
    secondaryColor: "#10B981",
    href: "/maps",
    description: "Radar callouts, competitive pool rotations, and site execute paths.",
  },
  bundles: {
    id: "bundles",
    label: "Collections",
    count: "327+ Sets",
    metric: "Exclusive Drops",
    accentColor: "#EC4899",
    secondaryColor: "#8B5CF6",
    href: "/bundles",
    description: "Bundle contents, store valuations, buddies, cards, and sprays.",
  },
  tools: {
    id: "tools",
    label: "Tactical Tools",
    count: "7 Utilities",
    metric: "Comp & Sens",
    accentColor: "#10B981",
    secondaryColor: "#06B6D4",
    href: "/tools",
    description: "Team comp builder, sensitivity converter, and meta tier list.",
  },
};
