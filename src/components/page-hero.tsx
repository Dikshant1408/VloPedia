"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { GlowEffect } from "./glow-effect";

interface PageHeroProps {
  imageSrc: string;
  imageAlt: string;
  /** Small eyebrow text above the title */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Slot for CTA buttons, badges, etc. */
  children?: React.ReactNode;
  /** Starting overlay opacity (top of scroll). Default: 0.35 */
  overlayFrom?: number;
  /** Ending overlay opacity (bottom of scroll). Default: 0.85 */
  overlayTo?: number;
  /** CSS min-height value. Default: "92vh" */
  minHeight?: string;
  /** Pass true for the LCP hero image on a page */
  priority?: boolean;
  className?: string;
}

/**
 * Full-bleed page hero with parallax scroll effect.
 * Reused across agent, map, bundle, and lore detail pages.
 *
 * Parallax is disabled automatically when prefers-reduced-motion is active.
 */
export function PageHero({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  subtitle,
  children,
  overlayFrom = 0.35,
  overlayTo = 0.85,
  minHeight = "92vh",
  priority = false,
  className,
}: PageHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // 18% vertical offset parallax on the background image
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", reduce ? "0%" : "18%"]
  );
  // Overlay opacity deepens as user scrolls down
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 1],
    [overlayFrom, overlayTo]
  );

  return (
    <section
      ref={ref}
      className={["page-hero relative w-full overflow-hidden border-b border-[rgba(236,232,225,0.08)] bg-[#08111A]", className ?? ""].join(" ")}
      style={{ minHeight }}
    >
      {/* Parallax background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
          sizes="100vw"
          className="object-cover object-top"
          unoptimized
        />
        {/* Dynamic overlay */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30"
        />
        {/* Left-side vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </motion.div>

      {/* Glow accent */}
      <GlowEffect opacity={0.15} className="z-[1]" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-end" style={{ minHeight }}>
        <div className="mx-auto w-full max-w-8xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            {eyebrow && (
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
                <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">
                  {eyebrow}
                </span>
              </div>
            )}

            <h1 className="font-display text-5xl uppercase leading-none tracking-tight text-white sm:text-7xl lg:text-8xl">
              {title}
            </h1>

            {subtitle && (
              <p className="max-w-xl text-base leading-relaxed text-muted font-sans">
                {subtitle}
              </p>
            )}

            {children && <div className="pt-2">{children}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
