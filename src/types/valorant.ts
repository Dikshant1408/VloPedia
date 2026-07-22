/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Role {
  uuid: string;
  displayName: string;
  description: string;
  displayIcon: string;
}

export interface Ability {
  slot: string;
  displayName: string;
  description: string;
  displayIcon: string | null;
}

export interface VoiceLineMedia {
  id: number;
  wwise: string;
}

export interface VoiceLine {
  minDuration: number;
  maxDuration: number;
  mediaList: VoiceLineMedia[];
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
  background: string | null;
  backgroundGradientColors: string[];
  isPlayableCharacter: boolean;
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
  reloadTimeSeconds: number;
  firstShotAccuracy: number;
  wallPenetration: string;
  damageRanges: DamageRange[];
}

export interface ShopData {
  cost: number;
  category: string;
  categoryText: string;
}

export interface SkinChroma {
  uuid: string;
  displayName: string;
  displayIcon: string | null;
  fullRender: string | null;
  swatch: string | null;
  streamedVideo: string | null;
}

export interface SkinLevel {
  uuid: string;
  displayName: string;
  levelItem: string | null;
  displayIcon: string | null;
  streamedVideo: string | null;
}

export interface WeaponSkin {
  uuid: string;
  displayName: string;
  themeUuid: string;
  contentTierUuid: string | null;
  displayIcon: string | null;
  wallpaper: string | null;
  chromas: SkinChroma[];
  levels: SkinLevel[];
}

export interface Weapon {
  uuid: string;
  displayName: string;
  category: string;
  defaultSkinUuid: string;
  displayIcon: string;
  weaponStats: WeaponStats | null;
  shopData: ShopData | null;
  skins: WeaponSkin[];
}

export interface LocationCoordinate {
  x: number;
  y: number;
}

export interface Callout {
  regionName: string;
  superRegionName: string;
  location: LocationCoordinate;
}

export interface ValorantMap {
  uuid: string;
  displayName: string;
  coordinates: string;
  displayIcon: string | null;
  listViewIcon: string | null;
  listViewIconV2: string | null;
  splash: string;
  stylizedBackgroundImage: string | null;
  premierBackgroundImage: string | null;
  xMultiplier: number;
  yMultiplier: number;
  xScalarToAdd: number;
  yScalarToAdd: number;
  callouts: Callout[] | null;
}

export interface Bundle {
  uuid: string;
  displayName: string;
  description: string;
  extraDescription: string | null;
  promoDescription: string | null;
  useAdditionalContext: boolean;
  displayIcon: string;
  displayIcon2: string;
  verticalPromoImage: string | null;
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
}

export interface PlayerCard {
  uuid: string;
  displayName: string;
  displayIcon: string;
  smallArt: string;
  wideArt: string;
  largeArt: string;
}

export interface Buddy {
  uuid: string;
  displayName: string;
  displayIcon: string;
}

export interface CompetitiveTier {
  tier: number;
  tierName: string;
  divisionName: string;
  color: string;
  epublished: boolean;
  largeIcon: string | null;
  rankTriangleDownIcon: string | null;
  rankTriangleUpIcon: string | null;
}

export interface GameMode {
  uuid: string;
  displayName: string;
  duration: string | null;
  allowsDrafting: boolean;
  isSandboxed: boolean;
  isUniqueAndPredefined: boolean;
  displayIcon: string | null;
}
