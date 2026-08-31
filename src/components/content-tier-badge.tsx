import Image from "next/image";
import { CONTENT_TIER_MAP } from "@/lib/valorant-types";

interface ContentTierBadgeProps {
  /** Rarity string — "SELECT" | "DELUXE" | "PREMIUM" | "ULTRA" | "EXCLUSIVE" */
  rarity: string;
  /** Show the content-tier icon from VALORANT_API. Default: false */
  showIcon?: boolean;
  className?: string;
}

/**
 * Rarity badge with content-tier accent color.
 * Optionally renders the official tier icon.
 */
export function ContentTierBadge({
  rarity,
  showIcon = false,
  className,
}: ContentTierBadgeProps) {
  // Find matching tier entry by rarity string
  const entry = Object.values(CONTENT_TIER_MAP).find(
    (t) => t.rarity === rarity.toUpperCase()
  );
  const color = entry?.color ?? "#9CA3AF";
  const iconUrl = entry?.iconUrl;

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 border font-mono font-black uppercase tracking-widest px-2 py-0.5 text-[9px]",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ borderColor: `${color}60`, color, backgroundColor: `${color}14` }}
    >
      {showIcon && iconUrl && (
        <Image
          src={iconUrl}
          alt={rarity}
          width={12}
          height={12}
          className="opacity-90"
          unoptimized
        />
      )}
      {rarity}
    </span>
  );
}
