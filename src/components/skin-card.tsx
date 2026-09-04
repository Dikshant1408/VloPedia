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
        "group relative flex flex-col border border-border bg-[#0D1A22] transition-all duration-300 hover:border-primary/40",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ borderLeftColor: tier.color, borderLeftWidth: "2px" }}
    >
      {/* Skin image */}
      <Link href={`/skins/${slug}`} className="block" tabIndex={0}>
        <div className="relative w-full bg-black/50" style={{ aspectRatio: "1/1" }}>
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
            <div className="flex h-full w-full items-center justify-center text-muted font-mono text-xs">
              NO IMAGE
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/skins/${slug}`}
            className="flex-1 font-display text-sm uppercase leading-tight tracking-wide text-white hover:text-primary transition-colors"
          >
            {skin.displayName}
          </Link>
          <ContentTierBadge rarity={tier.rarity} showIcon={false} />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-primary">
            {tier.price.toLocaleString()} <span className="text-muted">VP</span>
          </span>
          {onWishlist && (
            <button
              type="button"
              onClick={() => onWishlist(skin)}
              aria-label={`Add ${skin.displayName} to wishlist`}
              className="flex h-7 w-7 items-center justify-center border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] opacity-0 transition-all duration-200 hover:border-primary hover:text-primary group-hover:opacity-100 focus-visible:opacity-100"
            >
              <Heart className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
