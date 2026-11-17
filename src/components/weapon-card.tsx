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
        className="group flex items-center gap-4 rounded-md border border-border bg-surface-card p-3 transition-all duration-200 hover:border-primary/40 hover:bg-surface-elevated hover:shadow-xs"
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
          <p className="truncate font-sans font-semibold text-sm text-foreground">
            {weapon.displayName}
          </p>
          {cost && (
            <p className="font-mono text-xs text-primary font-medium">{cost.toLocaleString()} VP</p>
          )}
        </div>
      </Link>
    );
  }

  // Grid (default)
  return (
    <Link
      href={`/weapons/${slug}`}
      className="group relative block overflow-hidden border border-border bg-surface-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl clip-diagonal"
    >
      {/* Weapon image */}
      <div className="relative w-full bg-black/20 aspect-square" style={{ minHeight: "260px" }}>
        <Image
          src={weapon.displayIcon}
          alt={weapon.displayName}
          fill
          sizes="(max-width:640px) 100vw, 25vw"
          className="object-contain px-4 py-4 transition-transform duration-500 group-hover:scale-[1.08]"
          unoptimized
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-primary bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10">
            {weapon.shopData?.categoryText ?? weapon.category.replace(/EEquippableCategory::/i, "")}
          </span>
        </div>
        {/* Cost badge */}
        {cost && (
          <div className="absolute bottom-3 right-3 z-10">
            <span className="font-mono text-[10px] font-bold text-white bg-primary px-2 py-1 rounded-md">
              {cost.toLocaleString()} VP
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-black text-lg uppercase tracking-wide text-white group-hover:text-primary transition-colors line-clamp-1">
            {weapon.displayName}
          </h3>
          {weapon.weaponStats && (
            <span className="font-mono text-[10px] text-muted tracking-widest">
              {weapon.weaponStats.magazineSize} RDS
            </span>
          )}
        </div>
        {weapon.weaponStats && (
          <p className="font-sans text-[10px] text-secondary leading-relaxed">
            {Math.round(weapon.weaponStats.fireRate)} RPM · {weapon.weaponStats.magazineSize} MAG
          </p>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
