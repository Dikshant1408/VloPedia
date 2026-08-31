/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Role {
  uuid: string;
  displayName: string;
  description: string;
  displayIcon: string;
  assetPath: string;
}

export interface Ability {
  slot: string;
  displayName: string;
  description: string;
  displayIcon: string | null;
}

export interface VoiceLine {
  minDuration: number;
  maxDuration: number;
  mediaList: Array<{
    id: number;
    wave: string;
  }>;
}

export interface Agent {
  uuid: string;
  displayName: string;
  description: string;
  developerName: string;
  characterTags: string[] | null;
  displayIcon: string;
  displayIconSmall: string;
  bustPortrait: string | null;
  fullPortrait: string | null;
  fullPortraitV2: string | null;
  killfeedPortrait: string;
  background: string | null;
  backgroundGradientColors: string[];
  assetPath: string;
  isFullPortraitRightFacing: boolean;
  isPlayableCharacter: boolean;
  isAssetImage: boolean;
  role: Role | null;
  abilities: Ability[];
  voiceLine: VoiceLine | null;
}

export interface DamageRange {
  rangeStartMeters: number;
  rangeEndMeters: number;
  headDamage: number;
  bodyDamage: number;
  legDamage: number;
}

export interface WeaponStats {
  fireRate: number;
  magazineSize: number;
  runSpeedMultiplier: number;
  equipTimeSeconds: number;
  reloadTimeSeconds: number;
  firstBulletAccuracy: number;
  shotgunPelletCount: number;
  wallPenetration: string;
  damageRanges: DamageRange[];
}

export interface ShopData {
  cost: number;
  category: string;
  categoryText: string;
  gridPosition: {
    row: number;
    column: number;
  } | null;
  image: string | null;
  canBeTrashed: boolean;
}

export interface Chrome {
  uuid: string;
  displayName: string;
  displayIcon: string | null;
  fullRender: string | null;
  swatch: string | null;
  streamedVideo: string | null;
  assetPath: string;
}

export interface SkinLevel {
  uuid: string;
  displayName: string;
  levelItem: string | null;
  displayIcon: string | null;
  streamedVideo: string | null;
  assetPath: string;
}

export interface WeaponSkin {
  uuid: string;
  displayName: string;
  themeUuid: string;
  contentTierUuid: string | null;
  displayIcon: string | null;
  wallpaper: string | null;
  assetPath: string;
  chromas: Chrome[];
  levels: SkinLevel[];
}

export interface Weapon {
  uuid: string;
  displayName: string;
  category: string;
  defaultSkinUuid: string;
  displayIcon: string;
  killStreamIcon: string;
  assetPath: string;
  weaponStats: WeaponStats | null;
  shopData: ShopData | null;
  skins: WeaponSkin[];
}

export interface MapData {
  uuid: string;
  displayName: string;
  narrativeDescription: string | null;
  tacticalDescription: string | null;
  coordinates: string | null;
  displayIcon: string | null;
  listViewIcon: string;
  splash: string;
  assetPath: string;
  mapUrl: string;
  xMultiplier: number;
  yMultiplier: number;
  xScalarToAdd: number;
  yScalarToAdd: number;
}

export interface Bundle {
  uuid: string;
  displayName: string;
  displayNameSubText: string | null;
  description: string;
  extraDescription: string | null;
  promoDescription: string | null;
  displayIcon: string;
  displayIcon2: string;
  verticalPromoImage: string | null;
  assetPath: string;
}

export interface Buddy {
  uuid: string;
  displayName: string;
  isHiddenIfNotOwned: boolean;
  themeUuid: string | null;
  displayIcon: string;
  assetPath: string;
}

export interface Spray {
  uuid: string;
  displayName: string;
  category: string | null;
  displayIcon: string;
  fullIcon: string | null;
  animationPng: string | null;
  animationGif: string | null;
  assetPath: string;
}

export interface PlayerCard {
  uuid: string;
  displayName: string;
  isHiddenIfNotOwned: boolean;
  themeUuid: string | null;
  displayIcon: string;
  smallIcon: string;
  wideIcon: string;
  largeArt: string;
  assetPath: string;
}

export interface CompetitiveTier {
  tier: number;
  tierName: string;
  divisionName: string;
  color: string;
  backgroundColor: string;
  smallIcon: string | null;
  largeIcon: string | null;
}

export interface CompetitiveTierGroup {
  uuid: string;
  assetPath: string;
  tiers: CompetitiveTier[];
}

export interface GameMode {
  uuid: string;
  displayName: string;
  duration: string | null;
  allowsMatchTimeouts: boolean;
  isMinigame: boolean;
  assetPath: string;
  displayIcon: string | null;
}

export interface Season {
  uuid: string;
  displayName: string;
  type: string | null;
  startTime: string;
  endTime: string;
  parentUuid: string | null;
  assetPath: string;
}

const BASE_URL = "https://valorant-api.com/v1";

export async function fetchAgents(): Promise<Agent[]> {
  try {
    const response = await fetch(`${BASE_URL}/agents?language=en-US&isPlayableCharacter=true`);
    if (!response.ok) {
      throw new Error(`Failed to fetch agents: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching agents:", error);
    return [];
  }
}

export async function fetchWeapons(): Promise<Weapon[]> {
  try {
    const response = await fetch(`${BASE_URL}/weapons?language=en-US`);
    if (!response.ok) {
      throw new Error(`Failed to fetch weapons: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching weapons:", error);
    return [];
  }
}

export async function fetchMaps(): Promise<MapData[]> {
  try {
    const response = await fetch(`${BASE_URL}/maps?language=en-US`);
    if (!response.ok) {
      throw new Error(`Failed to fetch maps: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching maps:", error);
    return [];
  }
}

export async function fetchBundles(): Promise<Bundle[]> {
  try {
    const response = await fetch(`${BASE_URL}/bundles?language=en-US`);
    if (!response.ok) {
      throw new Error(`Failed to fetch bundles: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching bundles:", error);
    return [];
  }
}

export async function fetchBuddies(): Promise<Buddy[]> {
  try {
    const response = await fetch(`${BASE_URL}/buddies?language=en-US`);
    if (!response.ok) {
      throw new Error(`Failed to fetch buddies: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching buddies:", error);
    return [];
  }
}

export async function fetchSprays(): Promise<Spray[]> {
  try {
    const response = await fetch(`${BASE_URL}/sprays?language=en-US`);
    if (!response.ok) {
      throw new Error(`Failed to fetch sprays: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching sprays:", error);
    return [];
  }
}

export async function fetchPlayerCards(): Promise<PlayerCard[]> {
  try {
    const response = await fetch(`${BASE_URL}/playercards?language=en-US`);
    if (!response.ok) {
      throw new Error(`Failed to fetch playercards: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching playercards:", error);
    return [];
  }
}

export async function fetchCompetitiveTiers(): Promise<CompetitiveTierGroup[]> {
  try {
    const response = await fetch(`${BASE_URL}/competitivetiers?language=en-US`);
    if (!response.ok) {
      throw new Error(`Failed to fetch competitive tiers: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching competitive tiers:", error);
    return [];
  }
}

export async function fetchGameModes(): Promise<GameMode[]> {
  try {
    const response = await fetch(`${BASE_URL}/gamemodes?language=en-US`);
    if (!response.ok) {
      throw new Error(`Failed to fetch game modes: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching game modes:", error);
    return [];
  }
}

export async function fetchSeasons(): Promise<Season[]> {
  try {
    const response = await fetch(`${BASE_URL}/seasons?language=en-US`);
    if (!response.ok) {
      throw new Error(`Failed to fetch seasons: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching seasons:", error);
    return [];
  }
}
