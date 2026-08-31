/**
 * ValoVault V2 — High Performance API Cache
 * 
 * Provides instant in-memory and sessionStorage caching for client-side API requests.
 * Eliminates redundant 3rd-party HTTP roundtrips when navigating pages.
 */

interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes cache TTL

export async function fetchWithCache<T>(
  url: string,
  ttlMs: number = DEFAULT_TTL_MS
): Promise<T> {
  // If executing in browser context, check caches
  if (typeof window !== "undefined") {
    // 1. Check fast in-memory map
    const memEntry = memoryCache.get(url);
    if (memEntry && Date.now() - memEntry.timestamp < ttlMs) {
      return memEntry.data as T;
    }

    // 2. Check browser sessionStorage
    try {
      const storageKey = `valovault_cache_${url}`;
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed: CacheEntry<T> = JSON.parse(stored);
        if (Date.now() - parsed.timestamp < ttlMs) {
          memoryCache.set(url, parsed as CacheEntry<unknown>);
          return parsed.data;
        }
      }
    } catch {
      // Ignore storage read errors (e.g. privacy mode)
    }
  }

  // 3. Perform network fetch
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} when fetching ${url}`);
  }
  const data = (await res.json()) as T;

  // 4. Save to cache in browser context
  if (typeof window !== "undefined") {
    const entry: CacheEntry<T> = { timestamp: Date.now(), data };
    memoryCache.set(url, entry as CacheEntry<unknown>);
    try {
      sessionStorage.setItem(`valovault_cache_${url}`, JSON.stringify(entry));
    } catch {
      // Ignore quota exceeded or storage write errors
    }
  }

  return data;
}
