// ValoVault V2 — Typed interfaces for valorant-api.com/v1
// Replaces all `any` usage in valorantApi.ts and valorant-data-provider.ts

// ---------------------------------------------------------------------------
// Sub-types
// ---------------------------------------------------------------------------

export interface ValorantRole {
  uuid: string;
  displayName: string;
  description: string;
  displayIcon: string;
  assetPath: string;
}

export interface ValorantAbility {
  slot: string; // "Ability1" | "Ability2" | "Grenade" | "Ultimate"
  displayName: string;
  description: string;
  displayIcon: string | null;
}

export interface ValorantDamageRange {
  rangeStartMeters: number;
  rangeEndMeters: number;
  headDamage: number;
  bodyDamage: number;
  legDamage: number;
}

export interface ValorantAdsStats {
  zoomMultiplier: number;
  fireRate: number;
  runSpeedMultiplier: number;
  burstCount: number;
  firstBulletAccuracy: number;
}

export interface ValorantWeaponStats {
  fireRate: number;
  magazineSize: number;
  runSpeedMultiplier: number;
  equipTimeSeconds: number;
  reloadTimeSeconds: number;
  firstBulletAccuracy: number;
  shotgunPelletCount: number;
  wallPenetration: string;
  feature: string | null;
  fireMode: string | null;
  altFireType: string | null;
  adsStats: ValorantAdsStats | null;
  altShotgunStats: unknown;
  airBurstStats: unknown;
  damageRanges: ValorantDamageRange[];
}

export interface ValorantShopData {
  cost: number;
  category: string;
  categoryText: string;
  shopOrderPriority: number;
  canBeTrashed: boolean;
  newImage: string;
  newImage2: string | null;
  assetPath: string;
}

export interface ValorantChroma {
  uuid: string;
  displayName: string;
  displayIcon: string | null;
  fullRender: string;
  swatch: string | null;
  streamedVideo: string | null;
  assetPath: string;
}

export interface ValorantSkinLevel {
  uuid: string;
  displayName: string;
  levelItem: string | null;
  displayIcon: string | null;
  streamedVideo: string | null;
  assetPath: string;
}

export interface ValorantCallout {
  regionName: string;
  superRegionName: string;
  location: { x: number; y: number };
}

// ---------------------------------------------------------------------------
// Primary entity types
// ---------------------------------------------------------------------------

export interface ValorantAgent {
  uuid: string;
  displayName: string;
  description: string;
  developerName: string;
  characterTags: string[] | null;
  displayIcon: string;
  displayIconSmall: string;
  bustPortrait: string;
  fullPortrait: string;
  fullPortraitV2: string;
  killfeedPortrait: string;
  background: string;
  backgroundGradientColors: string[];
  assetPath: string;
  isFullPortraitRightFacing: boolean;
  isPlayableCharacter: boolean;
  isBaseContent: boolean;
  role: ValorantRole;
  abilities: ValorantAbility[];
}

export interface ValorantSkin {
  uuid: string;
  displayName: string;
  themeUuid: string;
  contentTierUuid: string | null;
  displayIcon: string | null;
  wallpaper: string | null;
  assetPath: string;
  chromas: ValorantChroma[];
  levels: ValorantSkinLevel[];
}

export interface ValorantWeapon {
  uuid: string;
  displayName: string;
  category: string;
  defaultSkinUuid: string;
  displayIcon: string;
  killStreamIcon: string;
  assetPath: string;
  weaponStats: ValorantWeaponStats | null;
  shopData: ValorantShopData | null;
  skins: ValorantSkin[];
}

export interface ValorantMap {
  uuid: string;
  displayName: string;
  narrativeDescription: string | null;
  tacticalDescription: string | null;
  coordinates: string | null;
  displayIcon: string | null;
  listViewIcon: string;
  listViewIconTall: string | null;
  splash: string;
  stylizedBackgroundImage: string | null;
  premierBackgroundImage: string | null;
  assetPath: string;
  mapUrl: string;
  xMultiplier: number;
  yMultiplier: number;
  xScalarToAdd: number;
  yScalarToAdd: number;
  callouts: ValorantCallout[] | null;
}

export interface ValorantBundle {
  uuid: string;
  displayName: string;
  displayNameSubText: string | null;
  description: string;
  extraDescription: string | null;
  promoDescription: string | null;
  useAdditionalContext: boolean;
  displayIcon: string;
  displayIcon2: string | null;
  verticalPromoImage: string | null;
  assetPath: string;
}

export interface ValorantBuddyLevel {
  uuid: string;
  charmLevel: number;
  displayName: string;
  displayIcon: string;
  assetPath: string;
}

export interface ValorantBuddy {
  uuid: string;
  displayName: string;
  isHiddenIfNotOwned: boolean;
  themeUuid: string | null;
  displayIcon: string;
  assetPath: string;
  levels: ValorantBuddyLevel[];
}

export interface ValorantSprayLevel {
  uuid: string;
  sprayLevel: number;
  displayName: string;
  displayIcon: string;
  assetPath: string;
}

export interface ValorantSpray {
  uuid: string;
  displayName: string;
  themeUuid: string | null;
  isNullSpray: boolean;
  hideIfNotOwned: boolean;
  displayIcon: string;
  displayIconSequential: string | null;
  animationPng: string | null;
  animationGif: string | null;
  assetPath: string;
  levels: ValorantSprayLevel[];
}

export interface ValorantPlayerCard {
  uuid: string;
  displayName: string;
  isHiddenIfNotOwned: boolean;
  themeUuid: string | null;
  displayIcon: string;
  smallArt: string;
  wideArt: string;
  largeArt: string;
  assetPath: string;
}

export interface ValorantGameModeFeatureOverride {
  featureName: string;
  state: boolean;
}

export interface ValorantGameMode {
  uuid: string;
  displayName: string;
  duration: string | null;
  economyType: string | null;
  allowsMatchTimeouts: boolean;
  isTeamVoiceAllowed: boolean;
  isMinimapHidden: boolean;
  orbCount: number;
  roundsPerHalf: number;
  teamRoles: string[] | null;
  gameFeatureOverrides: ValorantGameModeFeatureOverride[] | null;
  gameRuleBoolOverrides: ValorantGameModeFeatureOverride[] | null;
  displayIcon: string | null;
  listViewIconTall: string | null;
  assetPath: string;
}

export interface ValorantCompetitiveTierEntry {
  tier: number;
  tierName: string;
  division: string;
  divisionName: string;
  color: string;
  backgroundColor: string;
  smallIcon: string | null;
  largeIcon: string | null;
  rankTriangleDownIcon: string | null;
  rankTriangleUpIcon: string | null;
}

export interface ValorantCompetitiveTier {
  uuid: string;
  assetObjectName: string;
  tiers: ValorantCompetitiveTierEntry[];
}

export interface ValorantVersion {
  manifestId: string;
  branch: string;
  version: string;
  buildVersion: string;
  engineVersion: string;
  riotClientVersion: string;
  riotClientBuild: string;
  buildDate: string;
}

// ---------------------------------------------------------------------------
// API error class
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly endpoint: string,
    message?: string
  ) {
    super(message ?? `API error ${status} on ${endpoint}`);
    this.name = "ApiError";
  }
}

// ---------------------------------------------------------------------------
// Content tier mapping (UUID → rarity metadata)
// ---------------------------------------------------------------------------

export interface ContentTierInfo {
  rarity: string;
  price: number;
  color: string;
  iconUrl: string;
}

export const CONTENT_TIER_MAP: Record<string, ContentTierInfo> = {
  "12683d76-48d7-84a3-4e09-6985794f0445": {
    rarity: "SELECT",
    price: 875,
    color: "#9CA3AF",
    iconUrl: "https://media.valorant-api.com/contenttiers/12683d76-48d7-84a3-4e09-6985794f0445/displayicon.png",
  },
  "0cebb8be-46d7-c12a-d306-e9907bfc5a25": {
    rarity: "DELUXE",
    price: 1275,
    color: "#60A5FA",
    iconUrl: "https://media.valorant-api.com/contenttiers/0cebb8be-46d7-c12a-d306-e9907bfc5a25/displayicon.png",
  },
  "60bca009-4182-7998-dee7-b8a2558dc369": {
    rarity: "PREMIUM",
    price: 1775,
    color: "#C084FC",
    iconUrl: "https://media.valorant-api.com/contenttiers/60bca009-4182-7998-dee7-b8a2558dc369/displayicon.png",
  },
  "411e4a55-4e59-7757-41f0-86a53f101bb5": {
    rarity: "ULTRA",
    price: 2475,
    color: "#FBBF24",
    iconUrl: "https://media.valorant-api.com/contenttiers/411e4a55-4e59-7757-41f0-86a53f101bb5/displayicon.png",
  },
  "e046854e-4062-37f4-6607-19a9ba8426fc": {
    rarity: "EXCLUSIVE",
    price: 2175,
    color: "#F87171",
    iconUrl: "https://media.valorant-api.com/contenttiers/e046854e-4062-37f4-6607-19a9ba8426fc/displayicon.png",
  },
};

// Default tier for skins with no contentTierUuid
export const DEFAULT_TIER: ContentTierInfo = {
  rarity: "PREMIUM",
  price: 1775,
  color: "#C084FC",
  iconUrl: "https://media.valorant-api.com/contenttiers/60bca009-4182-7998-dee7-b8a2558dc369/displayicon.png",
};

// ---------------------------------------------------------------------------
// Deterministic score — replaces Math.random() for game content values
// ---------------------------------------------------------------------------

/**
 * Returns a stable integer in [70, 99] derived from a UUID string.
 * Use instead of Math.random() so values are consistent across renders/builds.
 */
export function deterministicScore(uuid: string): number {
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    hash = (hash << 5) - hash + uuid.charCodeAt(i);
    hash |= 0; // convert to 32-bit int
  }
  return 70 + (Math.abs(hash) % 30);
}

/**
 * Returns a stable float in [4.0, 4.9] for community ratings.
 */
export function deterministicRating(uuid: string): number {
  const score = deterministicScore(uuid);
  return parseFloat((4.0 + (score - 70) / 100).toFixed(1));
}
