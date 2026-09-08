import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Normalizes raw Valorant version strings into clean patch format (e.g. "9.04" or "13.05")
 * Handles "release-09.04-shipping-21-2784534", "release-13.05", "13.05.00.5350494", etc.
 */
export function formatPatchVersion(raw?: string | null): string {
  if (!raw) return "9.04";
  const match = raw.match(/(?:release-)?0*(\d+\.\d+)/i);
  if (match && match[1]) {
    return match[1];
  }
  const digits = raw.match(/\d+(\.\d+)?/);
  if (digits && digits[0]) {
    return digits[0];
  }
  return "9.04";
}
