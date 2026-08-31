import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { ValorantAgent } from "@/lib/valorant-types";
import { RoleBadge } from "./role-badge";

import { slugify } from "@/lib/utils";

interface AgentCardProps {
  agent: ValorantAgent;
  /** Featured agents span 2 columns on desktop */
  featured?: boolean;
}

/**
 * V2 Agent card — portrait-dominant, 4:5 aspect ratio.
 * Framer Motion `layout` prop enables animated reorder on role filter.
 * Does NOT use EntityCard.
 */
export function AgentCard({ agent, featured = false }: AgentCardProps) {
  const slug = slugify(agent.displayName);
  const portrait = agent.fullPortrait || agent.bustPortrait || agent.displayIcon;

  return (
    <motion.div layout className={featured ? "col-span-2" : ""}>
      <Link
        href={`/agents/${slug}`}
        className="group relative block overflow-hidden border border-border bg-[#0D1A22] transition-colors duration-300 hover:border-primary/50"
        style={{ aspectRatio: "4/5" }}
      >
        {/* Background gradient from agent colors */}
        {agent.backgroundGradientColors?.length > 0 && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-35"
            style={{
              background: `radial-gradient(ellipse at 50% 100%, #${agent.backgroundGradientColors[0]} 0%, transparent 70%)`,
            }}
          />
        )}

        {/* Portrait */}
        <Image
          src={portrait}
          alt={agent.displayName}
          fill
          sizes={featured ? "(max-width:1024px) 100vw, 50vw" : "(max-width:640px) 50vw, 25vw"}
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
          unoptimized
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <RoleBadge role={agent.role?.displayName ?? "Unknown"} size="sm" />
          <h3 className="mt-2 font-display text-2xl uppercase tracking-wide text-white">
            {agent.displayName}
          </h3>
        </div>

        {/* Primary accent line on hover */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
      </Link>
    </motion.div>
  );
}
