"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import type { ValorantSkin } from "@/lib/valorant-types";
import { CONTENT_TIER_MAP, DEFAULT_TIER } from "@/lib/valorant-types";
import { ContentTierBadge } from "./content-tier-badge";

interface SkinCardProps {
  skin: ValorantSkin;
  /** Called when the wishlist button is clicked */
  onWishlist?: (skin: ValorantSkin) => void;
  className?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * V2 Skin card — luxury catalog style.
 * Left-edge 2px accent bar in content-tier color.
 * Wishlist button appears on hover.
 * Does NOT use EntityCard.
 */
export function SkinCard({ skin, onWishlist, className }: SkinCardProps) {
  const tier = CONTENT_TIER_MAP[skin.contentTierUuid ?? ""] ?? DEFAULT_TIER;
  const displayImage =
    skin.chromas?.[0]?.fullRender ?? skin.chromas?.[0]?.displayIcon ?? skin.displayIcon;

  const slug = slugify(skin.displayName) || skin.uuid;

  return (
    <div
      className={[
        "group relative flex flex-col rounded-lg overflow-hidden border border-border bg-surface-card transition-all duration-300 hover:-translate-y-0.5 hover:border-border-light hover:shadow-md",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ borderLeftColor: tier.color, borderLeftWidth: "3px" }}
    >
      {/* Skin image */}
      <Link href={`/skins/${slug}`} className="block" tabIndex={0}>
        <div className="relative w-full bg-surface-muted" style={{ aspectRatio: "1/1" }}>
          {displayImage ? (
            <Image
              src={displayImage}
              alt={skin.displayName}
              fill
              sizes="(max-width:640px) 50vw, 25vw"
              className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04]"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted font-sans text-xs">
              No image available
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/skins/${slug}`}
            className="flex-1 font-sans font-semibold text-sm leading-tight text-foreground hover:text-primary transition-colors"
          >
            {skin.displayName}
          </Link>
          <ContentTierBadge rarity={tier.rarity} showIcon={false} />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="font-mono text-xs font-bold text-foreground">
            {tier.price.toLocaleString()} <span className="text-primary text-[10px]">VP</span>
          </span>
          {onWishlist && (
            <button
              type="button"
              onClick={() => onWishlist(skin)}
              aria-label={`Add ${skin.displayName} to wishlist`}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-muted opacity-0 transition-all duration-200 hover:border-primary hover:text-primary group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer shadow-xs"
            >
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
