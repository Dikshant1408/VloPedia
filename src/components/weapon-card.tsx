import Link from "next/link";
import Image from "next/image";
import type { ValorantWeapon } from "@/lib/valorant-types";

interface WeaponCardProps {
  weapon: ValorantWeapon;
  view?: "horizontal" | "compact";
}

/**
 * V2 Weapon card — horizontal armory style.
 * The weapon display image spans the full card width at a 3:1 ratio.
 * Does NOT use EntityCard.
 */
export function WeaponCard({ weapon, view = "horizontal" }: WeaponCardProps) {
  const slug = weapon.displayName.toLowerCase().replace(/\s+/g, "-");
  const cost = weapon.shopData?.cost;

  if (view === "compact") {
    return (
      <Link
        href={`/weapons/${slug}`}
        className="group flex items-center gap-4 border border-border bg-[#0D1A22] p-3 transition-colors duration-200 hover:border-primary/40 hover:bg-surface"
      >
        <div className="relative h-10 w-20 shrink-0">
          <Image
            src={weapon.displayIcon}
            alt={weapon.displayName}
            fill
            sizes="80px"
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-sm uppercase tracking-wide text-white">
            {weapon.displayName}
          </p>
          {cost && (
            <p className="font-mono text-xs text-primary">{cost.toLocaleString()} VP</p>
          )}
        </div>
      </Link>
    );
  }

  // Horizontal (default)
  return (
    <Link
      href={`/weapons/${slug}`}
      className="group relative block overflow-hidden border border-border bg-[#0D1A22] transition-all duration-300 hover:border-primary/50 border-glow"
    >
      {/* Weapon image — 3:1 ratio */}
      <div className="relative w-full bg-black/40" style={{ aspectRatio: "3/1" }}>
        <Image
          src={weapon.displayIcon}
          alt={weapon.displayName}
          fill
          sizes="(max-width:640px) 100vw, 50vw"
          className="object-contain px-8 py-4 transition-transform duration-500 group-hover:scale-[1.03]"
          unoptimized
        />
        {/* Subtle inner glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(255,70,85,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Info row */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-lg uppercase tracking-wide text-white">
            {weapon.displayName}
          </h3>
          <span className="border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted">
            {weapon.shopData?.categoryText ?? weapon.category.replace(/EEquippableCategory::/i, "")}
          </span>
        </div>
        {cost && (
          <span className="font-mono text-sm font-bold text-primary">
            {cost.toLocaleString()} <span className="text-[10px] text-muted">VP</span>
          </span>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
