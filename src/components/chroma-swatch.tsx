"use client";
import Image from "next/image";
import type { ValorantChroma } from "@/lib/valorant-types";

interface ChromaSwatchProps {
  chroma: ValorantChroma;
  isActive: boolean;
  onClick: () => void;
  /** 1-based index used as fallback label */
  index?: number;
}

/**
 * Single chroma variant swatch.
 * Uses chroma.swatch image if available; falls back to a colored dot.
 * Active state: 2px ring in --primary color.
 */
export function ChromaSwatch({ chroma, isActive, onClick, index = 1 }: ChromaSwatchProps) {
  const label = index === 1 ? "Default" : `Variant ${index}`;

  return (
    <button
      type="button"
      onClick={onClick}
      title={chroma.displayName || label}
      aria-label={`Select chroma: ${chroma.displayName || label}`}
      aria-pressed={isActive}
      className={[
        "relative h-10 w-10 overflow-hidden border-2 transition-all duration-150 focus-visible:outline-none",
        isActive
          ? "border-primary shadow-[0_0_0_2px_rgba(255,70,85,0.4)]"
          : "border-border hover:border-white/40",
      ].join(" ")}
    >
      {chroma.swatch ? (
        <Image
          src={chroma.swatch}
          alt={chroma.displayName || label}
          fill
          sizes="40px"
          className="object-cover"
          unoptimized
        />
      ) : (
        <span
          className="block h-full w-full bg-surface"
          style={{ background: `hsl(${(index * 47) % 360}, 60%, 45%)` }}
        />
      )}
    </button>
  );
}
