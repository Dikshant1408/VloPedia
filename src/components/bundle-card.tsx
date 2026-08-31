import Link from "next/link";
import Image from "next/image";
import type { ValorantBundle } from "@/lib/valorant-types";

interface BundleCardProps {
  bundle: ValorantBundle & { price?: number; active?: boolean };
  /** Show "ACTIVE OFFER" badge — only on the index page, not detail page */
  showActiveBadge?: boolean;
  /** "hero" — full-width magazine cover treatment. "card" — standard column card */
  variant?: "hero" | "card";
}

/**
 * V2 Bundle card — editorial magazine layout.
 * Uses verticalPromoImage (portrait) as the dominant visual.
 * "ACTIVE OFFER" badge controlled by parent — index page only.
 * Does NOT use EntityCard.
 */
export function BundleCard({
  bundle,
  showActiveBadge = false,
  variant = "card",
}: BundleCardProps) {
  const slug = bundle.uuid;
  const image =
    bundle.verticalPromoImage ?? bundle.displayIcon2 ?? bundle.displayIcon;

  const isHero = variant === "hero";

  return (
    <Link
      href={`/bundles/${slug}`}
      className={[
        "group relative block overflow-hidden border border-[rgba(236,232,225,0.08)] bg-[#08111A] transition-all duration-500 hover:border-primary/50",
        isHero ? "col-span-2" : "",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ aspectRatio: isHero ? "21/9" : "3/4" }}
    >
      {/* Bundle promo image */}
      {image && (
        <Image
          src={image}
          alt={bundle.displayName}
          fill
          sizes={isHero ? "100vw" : "(max-width:768px) 100vw, 50vw"}
          className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
          unoptimized
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

      {/* Active badge — index only */}
      {showActiveBadge && bundle.active && (
        <div
          aria-label="Active store offer"
          className="absolute right-0 top-0 bg-primary px-3 py-1 font-mono text-[10px] font-black uppercase tracking-wider text-black"
        >
          ACTIVE OFFER
        </div>
      )}

      {/* Bundle info */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3
          className={[
            "font-display uppercase tracking-wide text-white",
            isHero ? "text-4xl sm:text-5xl" : "text-2xl",
          ].join(" ")}
        >
          {bundle.displayName}
        </h3>
        {bundle.price && (
          <p className="mt-1 font-mono text-sm font-bold text-primary">
            {bundle.price.toLocaleString()}{" "}
            <span className="text-[10px] text-muted">VP</span>
          </p>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}
