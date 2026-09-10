"use client";

export interface RecentViewItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Agent" | "Weapon" | "Skin" | "Map" | "Guide" | "Tool" | "Lore";
  href: string;
  timestamp: number;
}

const STORAGE_KEY = "valovault_recent_views";
const MAX_ITEMS = 8;

export function getRecentViews(): RecentViewItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordRecentView(item: Omit<RecentViewItem, "timestamp">) {
  if (typeof window === "undefined") return;
  try {
    const existing = getRecentViews();
    const filtered = existing.filter((e) => e.href !== item.href && e.id !== item.id);
    const updated: RecentViewItem[] = [
      {
        ...item,
        timestamp: Date.now(),
      },
      ...filtered,
    ].slice(0, MAX_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("valovault_recent_update", { detail: updated }));
  } catch (e) {
    console.warn("Failed to save recent view:", e);
  }
}

export function clearRecentViews() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("valovault_recent_update", { detail: [] }));
  } catch {}
}
