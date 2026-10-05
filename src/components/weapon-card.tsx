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

  // Horizontal (default)
  return (
    <Link
      href={`/weapons/${slug}`}
      className="group relative block overflow-hidden border border-border bg-surface-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg clip-diagonal"
    >
      {/* Top technical header bar */}
      <div className="flex items-center justify-between border-b border-border/60 bg-surface px-4 py-2 font-mono text-[10px] text-muted">
        <div className="flex items-center gap-2">
          <span className="text-muted/60 select-none">+</span>
          <span className="uppercase tracking-widest text-secondary font-bold">
            {weapon.shopData?.categoryText ?? weapon.category.replace(/EEquippableCategory::/i, "")}
          </span>
        </div>
        {weapon.weaponStats && (
          <span className="tracking-wider">
            MAG: <strong className="text-white">{weapon.weaponStats.magazineSize}</strong> · ROF: <strong className="text-white">{weapon.weaponStats.fireRate}</strong>
          </span>
        )}
      </div>

      {/* Weapon image — 3:1 ratio */}
      <div className="relative w-full bg-black/30" style={{ aspectRatio: "3/1" }}>
        <Image
          src={weapon.displayIcon}
          alt={weapon.displayName}
          fill
          sizes="(max-width:640px) 100vw, 50vw"
          className="object-contain px-8 py-4 transition-transform duration-500 group-hover:scale-[1.04]"
          unoptimized
        />
        {/* Subtle inner radial highlight */}
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
      <div className="flex items-center justify-between border-t border-border px-5 py-3 bg-surface-card">
        <div>
          <h3 className="font-display font-black text-xl uppercase tracking-wide text-white group-hover:text-primary transition-colors">
            {weapon.displayName}
          </h3>
        </div>
        {cost ? (
          <span className="font-mono text-sm font-bold text-primary">
            {cost.toLocaleString()} <span className="text-[10px] text-muted">VP</span>
          </span>
        ) : (
          <span className="font-mono text-xs uppercase tracking-wider text-muted">Free Standard</span>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
