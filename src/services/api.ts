/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Agent,
  Weapon,
  ValorantMap,
  Bundle,
  Spray,
  PlayerCard,
  Buddy,
  CompetitiveTier,
  GameMode,
} from "../types/valorant";

const BASE_URL = "https://valorant-api.com/v1";

interface ApiResponse<T> {
  status: number;
  data: T;
}

class ValorantApiService {
  private cache: Record<string, any> = {};

  private async fetchFromApi<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const query = new URLSearchParams(params).toString();
    const url = `${BASE_URL}/${endpoint}${query ? `?${query}` : ""}`;

    if (this.cache[url]) {
      return this.cache[url] as T;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
      }
      const json = (await response.json()) as ApiResponse<T>;
      if (json.status !== 200) {
        throw new Error(`API error from ${url}: Status ${json.status}`);
      }

      this.cache[url] = json.data;
      return json.data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  public async getAgents(): Promise<Agent[]> {
    try {
      const agents = await this.fetchFromApi<Agent[]>("agents", { isPlayableCharacter: "true" });
      // Remove duplicate Sova or old testing assets if any
      return agents.filter(
        (agent, idx, self) => self.findIndex((a) => a.uuid === agent.uuid) === idx
      );
    } catch (e) {
      console.warn("Falling back to simulated agents list.");
      return FALLBACK_AGENTS;
    }
  }

  public async getWeapons(): Promise<Weapon[]> {
    try {
      return await this.fetchFromApi<Weapon[]>("weapons");
    } catch (e) {
      console.warn("Falling back to simulated weapons list.");
      return FALLBACK_WEAPONS;
    }
  }

  public async getMaps(): Promise<ValorantMap[]> {
    try {
      return await this.fetchFromApi<ValorantMap[]>("maps");
    } catch (e) {
      console.warn("Falling back to simulated maps list.");
      return FALLBACK_MAPS;
    }
  }

  public async getBundles(): Promise<Bundle[]> {
    try {
      return await this.fetchFromApi<Bundle[]>("bundles");
    } catch (e) {
      return FALLBACK_BUNDLES;
    }
  }

  public async getSprays(): Promise<Spray[]> {
    try {
      const sprays = await this.fetchFromApi<Spray[]>("sprays");
      // filter sprays without displayIcon
      return sprays.filter((s) => s.displayIcon).slice(0, 100);
    } catch (e) {
      return [];
    }
  }

  public async getPlayerCards(): Promise<PlayerCard[]> {
    try {
      const cards = await this.fetchFromApi<PlayerCard[]>("playercards");
      return cards.filter((c) => c.displayIcon).slice(0, 80);
    } catch (e) {
      return [];
    }
  }

  public async getBuddies(): Promise<Buddy[]> {
    try {
      const buddies = await this.fetchFromApi<Buddy[]>("buddies");
      return buddies.filter((b) => b.displayIcon).slice(0, 80);
    } catch (e) {
      return [];
    }
  }

  public async getCompetitiveTiers(): Promise<CompetitiveTier[]> {
    try {
      // Competitivetiers endpoint returns collections.
      // The last collection is usually the most recent ranking list.
      const collections = await this.fetchFromApi<any[]>("competitivetiers");
      if (collections.length > 0) {
        const latest = collections[collections.length - 1];
        if (latest && latest.tiers) {
          // Filter out unranked or duplicate unranked
          return latest.tiers.filter((t: any) => t.tierName && t.tier !== 1 && t.tier !== 2);
        }
      }
      return FALLBACK_TIERS;
    } catch (e) {
      return FALLBACK_TIERS;
    }
  }

  public async getGameModes(): Promise<GameMode[]> {
    try {
      return await this.fetchFromApi<GameMode[]>("gamemodes");
    } catch (e) {
      return FALLBACK_GAMEMODES;
    }
  }
}

// Resilient fallback structures modeled exactly on the official API schemas
const FALLBACK_AGENTS: Agent[] = [
  {
    uuid: "f94c351f-47db-101b-2522-1b84e9150218",
    displayName: "Jett",
    description: "Representing her home country of South Korea, Jett's agile and evasive fighting style lets her take risks no one else can.",
    developerName: "Wushu",
    characterTags: ["Evasive", "Mobility"],
    displayIcon: "https://media.valorant-api.com/agents/f94c351f-47db-101b-2522-1b84e9150218/displayicon.png",
    displayIconSmall: "https://media.valorant-api.com/agents/f94c351f-47db-101b-2522-1b84e9150218/displayiconsmall.png",
    bustPortrait: "https://media.valorant-api.com/agents/f94c351f-47db-101b-2522-1b84e9150218/bustportrait.png",
    fullPortrait: "https://media.valorant-api.com/agents/f94c351f-47db-101b-2522-1b84e9150218/fullportrait.png",
    fullPortraitV2: "https://media.valorant-api.com/agents/f94c351f-47db-101b-2522-1b84e9150218/fullportraitv2.png",
    background: "https://media.valorant-api.com/agents/f94c351f-47db-101b-2522-1b84e9150218/background.png",
    backgroundGradientColors: ["ff4655ff", "300006ff", "101010ff"],
    isPlayableCharacter: true,
    role: {
      uuid: "dbe87330-4629-2342-e73b-21b8c156a545",
      displayName: "Duelist",
      description: "Duelists are self-reliant strikers who their team expects, through skills and resolve, to get high frags and initiate skirmishes.",
      displayIcon: "https://media.valorant-api.com/roles/dbe87330-4629-2342-e73b-21b8c156a545/displayicon.png",
    },
    abilities: [
      { slot: "Ability1", displayName: "Updraft", description: "INSTANTLY propel Jett high into the air.", displayIcon: "https://media.valorant-api.com/agents/f94c351f-47db-101b-2522-1b84e9150218/abilities/ability1/displayicon.png" },
      { slot: "Ability2", displayName: "Tailwind", description: "INSTANTLY propel Jett in the direction she is moving.", displayIcon: "https://media.valorant-api.com/agents/f94c351f-47db-101b-2522-1b84e9150218/abilities/ability2/displayicon.png" },
      { slot: "Grenade", displayName: "Cloudburst", description: "INSTANTLY throw a projectile that expands into a brief vision-blocking cloud.", displayIcon: "https://media.valorant-api.com/agents/f94c351f-47db-101b-2522-1b84e9150218/abilities/grenade/displayicon.png" },
      { slot: "Ultimate", displayName: "Blade Storm", description: "EQUIP a set of highly accurate throwing knives that recharge on killing an opponent.", displayIcon: "https://media.valorant-api.com/agents/f94c351f-47db-101b-2522-1b84e9150218/abilities/ultimate/displayicon.png" },
    ],
    voiceLine: null,
  },
  {
    uuid: "707e2be6-4114-4be3-4cb4-0b917999d5ca",
    displayName: "Sage",
    description: "The stronghold of China, Sage creates safety for herself and her team wherever she goes. Able to revive fallen friends and stave off forceful assaults.",
    developerName: "Thorne",
    characterTags: ["Defensive", "Healing"],
    displayIcon: "https://media.valorant-api.com/agents/707e2be6-4114-4be3-4cb4-0b917999d5ca/displayicon.png",
    displayIconSmall: "https://media.valorant-api.com/agents/707e2be6-4114-4be3-4cb4-0b917999d5ca/displayiconsmall.png",
    bustPortrait: "https://media.valorant-api.com/agents/707e2be6-4114-4be3-4cb4-0b917999d5ca/bustportrait.png",
    fullPortrait: "https://media.valorant-api.com/agents/707e2be6-4114-4be3-4cb4-0b917999d5ca/fullportrait.png",
    fullPortraitV2: "https://media.valorant-api.com/agents/707e2be6-4114-4be3-4cb4-0b917999d5ca/fullportraitv2.png",
    background: "https://media.valorant-api.com/agents/707e2be6-4114-4be3-4cb4-0b917999d5ca/background.png",
    backgroundGradientColors: ["22bda7ff", "071e22ff", "0a0a0aff"],
    isPlayableCharacter: true,
    role: {
      uuid: "578bfd99-417f-434e-a292-3d347c906320",
      displayName: "Sentinel",
      description: "Sentinels are defensive experts who can lock down areas and watch flanks, both on attacker and defender rounds.",
      displayIcon: "https://media.valorant-api.com/roles/578bfd99-417f-434e-a292-3d347c906320/displayicon.png",
    },
    abilities: [
      { slot: "Ability1", displayName: "Slow Orb", description: "EQUIP a slowing orb. FIRE to throw a slowing orb forward that detonates upon landing.", displayIcon: "https://media.valorant-api.com/agents/707e2be6-4114-4be3-4cb4-0b917999d5ca/abilities/ability1/displayicon.png" },
      { slot: "Ability2", displayName: "Healing Orb", description: "EQUIP a healing orb. FIRE with your crosshairs over a damaged ally to activate a heal-over-time.", displayIcon: "https://media.valorant-api.com/agents/707e2be6-4114-4be3-4cb4-0b917999d5ca/abilities/ability2/displayicon.png" },
      { slot: "Grenade", displayName: "Barrier Orb", description: "EQUIP a barrier orb. FIRE to place a solid wall. ALT FIRE rotates the targeter.", displayIcon: "https://media.valorant-api.com/agents/707e2be6-4114-4be3-4cb4-0b917999d5ca/abilities/grenade/displayicon.png" },
      { slot: "Ultimate", displayName: "Resurrection", description: "EQUIP a resurrection ability. FIRE with your crosshairs over a dead ally to revive them with full health.", displayIcon: "https://media.valorant-api.com/agents/707e2be6-4114-4be3-4cb4-0b917999d5ca/abilities/ultimate/displayicon.png" },
    ],
    voiceLine: null,
  },
];

const FALLBACK_WEAPONS: Weapon[] = [
  {
    uuid: "ee8e8d15-496b-07ac-e591-9182c4d5c7a1",
    displayName: "Vandal",
    category: "EWeaponCategory::Rifle",
    defaultSkinUuid: "852b6f3a-4467-3a05-ff3a-86b3e64c1c98",
    displayIcon: "https://media.valorant-api.com/weapons/ee8e8d15-496b-07ac-e591-9182c4d5c7a1/displayicon.png",
    weaponStats: {
      fireRate: 9.75,
      magazineSize: 25,
      reloadTimeSeconds: 2.5,
      firstShotAccuracy: 0.25,
      wallPenetration: "EWallPenetrationDisplayType::Medium",
      damageRanges: [
        { rangeStartMeters: 0, rangeEndMeters: 50, headDamage: 160, bodyDamage: 40, legDamage: 34 },
      ],
    },
    shopData: {
      cost: 2900,
      category: "Rifles",
      categoryText: "Rifles",
    },
    skins: [],
  },
  {
    uuid: "9102dbf3-4701-a57a-2146-c58612075c74",
    displayName: "Phantom",
    category: "EWeaponCategory::Rifle",
    defaultSkinUuid: "a2b0e79f-43e8-54b9-1100-3d8b0213d420",
    displayIcon: "https://media.valorant-api.com/weapons/9102dbf3-4701-a57a-2146-c58612075c74/displayicon.png",
    weaponStats: {
      fireRate: 11,
      magazineSize: 30,
      reloadTimeSeconds: 2.5,
      firstShotAccuracy: 0.2,
      wallPenetration: "EWallPenetrationDisplayType::Medium",
      damageRanges: [
        { rangeStartMeters: 0, rangeEndMeters: 15, headDamage: 156, bodyDamage: 39, legDamage: 33 },
        { rangeStartMeters: 15, rangeEndMeters: 30, headDamage: 140, bodyDamage: 35, legDamage: 29 },
        { rangeStartMeters: 30, rangeEndMeters: 50, headDamage: 124, bodyDamage: 31, legDamage: 26 },
      ],
    },
    shopData: {
      cost: 2900,
      category: "Rifles",
      categoryText: "Rifles",
    },
    skins: [],
  },
];

const FALLBACK_MAPS: ValorantMap[] = [
  {
    uuid: "7eae2e1b-4097-b766-1731-29e850334d1d",
    displayName: "Bind",
    coordinates: "34°2' N, 6°51' W",
    displayIcon: "https://media.valorant-api.com/maps/7eae2e1b-4097-b766-1731-29e850334d1d/displayicon.png",
    listViewIcon: "https://media.valorant-api.com/maps/7eae2e1b-4097-b766-1731-29e850334d1d/listviewicon.png",
    listViewIconV2: "https://media.valorant-api.com/maps/7eae2e1b-4097-b766-1731-29e850334d1d/listviewiconv2.png",
    splash: "https://media.valorant-api.com/maps/7eae2e1b-4097-b766-1731-29e850334d1d/splash.png",
    stylizedBackgroundImage: null,
    premierBackgroundImage: null,
    xMultiplier: 0.000078,
    yMultiplier: -0.000078,
    xScalarToAdd: 0.478,
    yScalarToAdd: 0.522,
    callouts: [],
  },
  {
    uuid: "d9605473-4d7a-913a-4925-2c92e2cfed0f",
    displayName: "Ascent",
    coordinates: "45°26' N, 12°20' E",
    displayIcon: "https://media.valorant-api.com/maps/d9605473-4d7a-913a-4925-2c92e2cfed0f/displayicon.png",
    listViewIcon: "https://media.valorant-api.com/maps/d9605473-4d7a-913a-4925-2c92e2cfed0f/listviewicon.png",
    listViewIconV2: "https://media.valorant-api.com/maps/d9605473-4d7a-913a-4925-2c92e2cfed0f/listviewiconv2.png",
    splash: "https://media.valorant-api.com/maps/d9605473-4d7a-913a-4925-2c92e2cfed0f/splash.png",
    stylizedBackgroundImage: null,
    premierBackgroundImage: null,
    xMultiplier: 0.00007,
    yMultiplier: -0.00007,
    xScalarToAdd: 0.45,
    yScalarToAdd: 0.55,
    callouts: [],
  },
];

const FALLBACK_BUNDLES: Bundle[] = [
  {
    uuid: "1b0f55fb-4972-2fb4-cf56-2dbb8b1b36b2",
    displayName: "Prime // 2.0",
    description: "The evolution of clean luxury gaming styling.",
    extraDescription: null,
    promoDescription: null,
    useAdditionalContext: false,
    displayIcon: "https://media.valorant-api.com/bundles/1b0f55fb-4972-2fb4-cf56-2dbb8b1b36b2/displayicon.png",
    displayIcon2: "https://media.valorant-api.com/bundles/1b0f55fb-4972-2fb4-cf56-2dbb8b1b36b2/displayicon2.png",
    verticalPromoImage: "https://media.valorant-api.com/bundles/1b0f55fb-4972-2fb4-cf56-2dbb8b1b36b2/verticalpromoimage.png",
    assetPath: "",
  },
];

const FALLBACK_GAMEMODES: GameMode[] = [
  {
    uuid: "96bd390c-4f45-02aa-025c-4384e3101fc2",
    displayName: "Competitive",
    duration: "30-40 min",
    allowsDrafting: false,
    isSandboxed: false,
    isUniqueAndPredefined: true,
    displayIcon: "https://media.valorant-api.com/gamemodes/96bd390c-4f45-02aa-025c-4384e3101fc2/displayicon.png",
  },
];

const FALLBACK_TIERS: CompetitiveTier[] = [
  {
    tier: 24,
    tierName: "IMMORTAL 3",
    divisionName: "IMMORTAL",
    color: "e00034ff",
    epublished: true,
    largeIcon: "https://media.valorant-api.com/competitivetiers/03621f13-849b-4114-b0d8-5561b71d0711/24/largeicon.png",
    rankTriangleDownIcon: null,
    rankTriangleUpIcon: null,
  },
  {
    tier: 27,
    tierName: "RADIANT",
    divisionName: "RADIANT",
    color: "fef2beff",
    epublished: true,
    largeIcon: "https://media.valorant-api.com/competitivetiers/03621f13-849b-4114-b0d8-5561b71d0711/27/largeicon.png",
    rankTriangleDownIcon: null,
    rankTriangleUpIcon: null,
  },
];

export const valorantApi = new ValorantApiService();
