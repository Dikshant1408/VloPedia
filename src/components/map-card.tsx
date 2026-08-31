import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

interface MapCardMap {
  slug: string;
  name: string;
  location?: string;
  splashUrl: string;
  lore?: string;
}

interface MapCardProps {
  map: MapCardMap;
  /** "large" cards get double column width, "small" is single. Default: "small" */
  size?: "large" | "small";
}

/**
 * V2 Map card — cinematic full-bleed splash image.
 * Hover: translateY(-4px), scale 1.04, overlay darkens.
 * Does NOT use EntityCard.
 */
export function MapCard({ map, size = "small" }: MapCardProps) {
  return (
    <Link
      href={`/maps/${map.slug}`}
      className={[
        "group relative block overflow-hidden border border-[rgba(236,232,225,0.08)] bg-[#08111A] transition-all duration-500",
        "hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        size === "large" ? "col-span-2" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ aspectRatio: "16/10" }}
    >
      {/* Splash image */}
      <Image
        src={map.splashUrl}
        alt={map.name}
        fill
        sizes={
          size === "large"
            ? "(max-width:768px) 100vw, 66vw"
            : "(max-width:640px) 100vw, 33vw"
        }
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />

      {/* Gradient overlay — deepens on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {map.location && (
          <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {map.location}
          </div>
        )}
        <h3 className="font-display text-2xl uppercase tracking-wide text-white transition-colors duration-200 group-hover:text-white">
          {map.name}
        </h3>
        {map.lore && (
          <p className="mt-1 line-clamp-1 text-[11px] leading-relaxed text-secondary opacity-0 transition-all duration-300 group-hover:opacity-100">
            {map.lore}
          </p>
        )}
        <span className="mt-2 inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-wider text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0">
          View Intel & Callouts →
        </span>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}
