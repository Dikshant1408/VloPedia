/**
 * VloPedia — Zero-PII Search Intent & Content Gap Telemetry Engine
 * 
 * Tracks anonymized search queries, click-through completions, and zero-result queries
 * to discover content opportunities and monitor user satisfaction.
 */

export interface SearchEvent {
  query: string;
  resultCount: number;
  timestamp: string;
  clickedItem?: string;
  category?: string;
}

export interface ContentGapReport {
  query: string;
  searchCount: number;
  avgResultCount: number;
  lastSearched: string;
}

const STORAGE_KEY = "vlopedia_search_analytics_log";

export function logSearchEvent(event: Omit<SearchEvent, "timestamp">) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: SearchEvent[] = raw ? JSON.parse(raw) : [];
    
    // Keep max 200 recent events
    list.unshift({
      ...event,
      timestamp: new Date().toISOString()
    });

    if (list.length > 200) list.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    // Ignore storage quota errors
  }
}

export function getTopSearches(limit: number = 10): Array<{ query: string; count: number }> {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list: SearchEvent[] = JSON.parse(raw);

    const freqMap: Record<string, number> = {};
    for (const e of list) {
      const q = e.query.trim().toLowerCase();
      if (!q) continue;
      freqMap[q] = (freqMap[q] || 0) + 1;
    }

    return Object.entries(freqMap)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch {
    return [];
  }
}

export function getContentGaps(): ContentGapReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list: SearchEvent[] = JSON.parse(raw);

    const zeroMap: Record<string, { count: number; lastSearched: string }> = {};
    for (const e of list) {
      if (e.resultCount === 0) {
        const q = e.query.trim().toLowerCase();
        if (!q) continue;
        if (!zeroMap[q]) {
          zeroMap[q] = { count: 1, lastSearched: e.timestamp };
        } else {
          zeroMap[q].count += 1;
        }
      }
    }

    return Object.entries(zeroMap)
      .map(([query, data]) => ({
        query,
        searchCount: data.count,
        avgResultCount: 0,
        lastSearched: data.lastSearched
      }))
      .sort((a, b) => b.searchCount - a.searchCount);
  } catch {
    return [];
  }
}
