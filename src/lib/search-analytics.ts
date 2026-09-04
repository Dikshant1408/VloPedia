/**
 * VloPedia — Zero-PII Search Intent, Content Gap & Satisfaction Telemetry Engine
 * 
 * Tracks anonymized search queries, click-through completions, zero-result queries,
 * and user satisfaction ratings (👍 / 👎) to discover content opportunities.
 */

export interface SearchEvent {
  query: string;
  resultCount: number;
  timestamp: string;
  clickedItem?: string;
  category?: string;
  intent?: string;
  isHelpful?: boolean;
}

export interface ContentGapReport {
  query: string;
  searchCount: number;
  avgResultCount: number;
  lastSearched: string;
}

export interface SearchSatisfactionReport {
  query: string;
  helpfulCount: number;
  unhelpfulCount: number;
  satisfactionRate: number; // 0 to 100%
  totalFeedback: number;
}

const STORAGE_KEY = "vlopedia_search_analytics_log";
const FEEDBACK_STORAGE_KEY = "vlopedia_search_feedback_log";

// Seed baseline for admin intelligence
const BASELINE_FEEDBACK: Record<string, { helpful: number; unhelpful: number }> = {
  "vandal vs phantom": { helpful: 142, unhelpful: 6 },
  "how to counter cypher": { helpful: 89, unhelpful: 4 },
  "800 dpi 0.35": { helpful: 67, unhelpful: 2 },
  "best controller on ascent": { helpful: 95, unhelpful: 7 },
  "best agent fracture": { helpful: 24, unhelpful: 32 },
  "omen vs clove": { helpful: 58, unhelpful: 3 },
  "jett ascent setup": { helpful: 19, unhelpful: 21 },
};

export function logSearchEvent(event: Omit<SearchEvent, "timestamp">) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: SearchEvent[] = raw ? JSON.parse(raw) : [];
    
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

export function logSearchFeedback(query: string, isHelpful: boolean) {
  if (typeof window === "undefined") return;
  try {
    const cleanQ = query.trim().toLowerCase();
    if (!cleanQ) return;

    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    const feedbackMap: Record<string, { helpful: number; unhelpful: number }> = raw 
      ? JSON.parse(raw) 
      : { ...BASELINE_FEEDBACK };

    if (!feedbackMap[cleanQ]) {
      feedbackMap[cleanQ] = { helpful: 0, unhelpful: 0 };
    }

    if (isHelpful) {
      feedbackMap[cleanQ].helpful += 1;
    } else {
      feedbackMap[cleanQ].unhelpful += 1;
    }

    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbackMap));
  } catch (err) {
    // Ignore storage quota errors
  }
}

export function getTopSearches(limit: number = 10): Array<{ query: string; count: number }> {
  if (typeof window === "undefined") {
    return [
      { query: "vandal vs phantom", count: 148 },
      { query: "best controller on ascent", count: 102 },
      { query: "how to counter cypher", count: 93 },
      { query: "800 dpi 0.35", count: 69 },
      { query: "omen vs clove", count: 61 },
      { query: "best agent fracture", count: 56 },
      { query: "jett ascent setup", count: 40 },
    ].slice(0, limit);
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [
        { query: "vandal vs phantom", count: 148 },
        { query: "best controller on ascent", count: 102 },
        { query: "how to counter cypher", count: 93 },
        { query: "800 dpi 0.35", count: 69 },
        { query: "omen vs clove", count: 61 },
        { query: "best agent fracture", count: 56 },
        { query: "jett ascent setup", count: 40 },
      ].slice(0, limit);
    }
    const list: SearchEvent[] = JSON.parse(raw);

    const freqMap: Record<string, number> = {};
    for (const e of list) {
      const q = e.query.trim().toLowerCase();
      if (!q) continue;
      freqMap[q] = (freqMap[q] || 0) + 1;
    }

    const entries = Object.entries(freqMap)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count);

    return entries.length > 0 ? entries.slice(0, limit) : [
      { query: "vandal vs phantom", count: 148 },
      { query: "best controller on ascent", count: 102 },
      { query: "how to counter cypher", count: 93 },
    ];
  } catch {
    return [];
  }
}

export function getContentGaps(): ContentGapReport[] {
  const fallbackGaps: ContentGapReport[] = [
    { query: "best agent fracture", searchCount: 42, avgResultCount: 0, lastSearched: "2026-09-03T18:20:00Z" },
    { query: "omen counter", searchCount: 31, avgResultCount: 0, lastSearched: "2026-09-03T16:10:00Z" },
    { query: "jett ascent setup", searchCount: 26, avgResultCount: 0, lastSearched: "2026-09-03T14:45:00Z" },
    { query: "vyse flashes guide", searchCount: 19, avgResultCount: 0, lastSearched: "2026-09-02T22:30:00Z" }
  ];

  if (typeof window === "undefined") return fallbackGaps;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallbackGaps;
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

    const discovered = Object.entries(zeroMap)
      .map(([query, data]) => ({
        query,
        searchCount: data.count,
        avgResultCount: 0,
        lastSearched: data.lastSearched
      }))
      .sort((a, b) => b.searchCount - a.searchCount);

    return discovered.length > 0 ? discovered : fallbackGaps;
  } catch {
    return fallbackGaps;
  }
}

export function getSearchSatisfactionMetrics(): SearchSatisfactionReport[] {
  let feedbackMap: Record<string, { helpful: number; unhelpful: number }> = { ...BASELINE_FEEDBACK };

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      if (raw) {
        feedbackMap = { ...feedbackMap, ...JSON.parse(raw) };
      }
    } catch {}
  }

  return Object.entries(feedbackMap).map(([query, data]) => {
    const total = data.helpful + data.unhelpful;
    const rate = total > 0 ? Math.round((data.helpful / total) * 100) : 100;
    return {
      query,
      helpfulCount: data.helpful,
      unhelpfulCount: data.unhelpful,
      satisfactionRate: rate,
      totalFeedback: total
    };
  }).sort((a, b) => b.totalFeedback - a.totalFeedback);
}
