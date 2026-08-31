/**
 * ValoVault V2 — ValorantApiClient
 *
 * - All endpoints typed via valorant-types.ts (no `any`)
 * - Next.js ISR via `next: { revalidate }` per endpoint
 * - In-flight deduplication: concurrent calls to the same endpoint within
 *   100ms are coalesced into a single HTTP request
 * - ApiError thrown on non-2xx responses (not swallowed)
 * - getVersion() returns null on failure (used for nav badge with fallback)
 */

import type {
  ValorantAgent,
  ValorantWeapon,
  ValorantSkin,
  ValorantMap,
  ValorantBundle,
  ValorantBuddy,
  ValorantSpray,
  ValorantPlayerCard,
  ValorantGameMode,
  ValorantCompetitiveTier,
  ValorantVersion,
} from "./valorant-types";
import { ApiError } from "./valorant-types";
import { fetchWithCache } from "./api-cache";

const BASE = "https://valorant-api.com/v1";

// In-flight deduplication map: endpoint → active Promise
const inflight = new Map<string, Promise<unknown>>();

async function fetchWithISR<T>(endpoint: string, revalidate: number): Promise<T[]> {
  const fullUrl = `${BASE}${endpoint}`;
  
  if (typeof window !== "undefined") {
    try {
      const json = await fetchWithCache<{ data: T[] }>(fullUrl);
      const data = json.data;
      if (data === null || data === undefined) return [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn(`[ValorantApiClient] client cache fetch failed for ${endpoint}`, err);
    }
  }

  // Coalesce concurrent calls within 100ms
  const existing = inflight.get(endpoint);
  if (existing) return existing as Promise<T[]>;

  const promise = (async (): Promise<T[]> => {
    const res = await fetch(fullUrl, {
      next: { revalidate },
    });
    if (!res.ok) throw new ApiError(res.status, endpoint);
    const json = await res.json();
    // API wraps data in { status, data }
    const data = json.data;
    if (data === null || data === undefined) {
      console.warn(`[ValorantApiClient] ${endpoint} returned null data`);
      return [];
    }
    return Array.isArray(data) ? (data as T[]) : [];
  })();

  inflight.set(endpoint, promise);
  // Remove from dedup map after 100ms regardless of resolution
  setTimeout(() => inflight.delete(endpoint), 100);

  return promise;
}

export const ValorantApiClient = {
  /** All playable agents. Revalidates every hour. */
  getAgents(): Promise<ValorantAgent[]> {
    return fetchWithISR<ValorantAgent>("/agents?isPlayableCharacter=true", 3600);
  },

  /** All weapons with embedded skin lists. Revalidates every hour. */
  getWeapons(): Promise<ValorantWeapon[]> {
    return fetchWithISR<ValorantWeapon>("/weapons", 3600);
  },

  /** All weapon skins (flat list). Revalidates every 30 minutes. */
  getSkins(): Promise<ValorantSkin[]> {
    return fetchWithISR<ValorantSkin>("/weapons/skins", 1800);
  },

  /** All maps (includes practice/tutorial maps — filter by splash in consumers). */
  getMaps(): Promise<ValorantMap[]> {
    return fetchWithISR<ValorantMap>("/maps", 3600);
  },

  /** All bundles. Revalidates every 30 minutes. */
  getBundles(): Promise<ValorantBundle[]> {
    return fetchWithISR<ValorantBundle>("/bundles", 1800);
  },

  /** All gun buddies. Revalidates every hour. */
  getBuddies(): Promise<ValorantBuddy[]> {
    return fetchWithISR<ValorantBuddy>("/buddies", 3600);
  },

  /** All sprays. Revalidates every hour. */
  getSprays(): Promise<ValorantSpray[]> {
    return fetchWithISR<ValorantSpray>("/sprays", 3600);
  },

  /** All player cards. Revalidates every hour. */
  getPlayerCards(): Promise<ValorantPlayerCard[]> {
    return fetchWithISR<ValorantPlayerCard>("/playercards", 3600);
  },

  /** All game modes. Revalidates every hour. */
  getGameModes(): Promise<ValorantGameMode[]> {
    return fetchWithISR<ValorantGameMode>("/gamemodes", 3600);
  },

  /** All competitive tier sets. Revalidates every hour. */
  getCompetitiveTiers(): Promise<ValorantCompetitiveTier[]> {
    return fetchWithISR<ValorantCompetitiveTier>("/competitivetiers", 3600);
  },

  /**
   * Latest competitive tier set (last element from the array).
   * Returns untyped result for V1 page compatibility — replaced in Task 17.
   */
  async getTiers(): Promise<unknown | null> {
    try {
      const res = await fetch(`${BASE}/competitivetiers`, { next: { revalidate: 3600 } });
      if (!res.ok) return null;
      const json = await res.json();
      const lists = json.data ?? [];
      return lists.length > 0 ? lists[lists.length - 1] : null;
    } catch {
      return null;
    }
  },

  /** Current game version. Returns null on failure (nav badge uses localStorage fallback). */
  async getVersion(): Promise<ValorantVersion | null> {
    try {
      const res = await fetch(`${BASE}/version`, { next: { revalidate: 3600 } });
      if (!res.ok) return null;
      const json = await res.json();
      return (json.data as ValorantVersion) ?? null;
    } catch {
      return null;
    }
  },
};
