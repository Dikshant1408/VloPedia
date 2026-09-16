"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSceneLifecycle } from "../use-scene-lifecycle";
import { type HomeWorldCategory } from "./home-world.config";
import { getActiveScene } from "./scenes/scene-registry";

// Dynamically load the R3F Canvas scene with SSR disabled
const DynamicHomeWorldScene = dynamic(
  () => import("./home-world-scene").then((mod) => mod.HomeWorldScene),
  { ssr: false }
);

interface HomeWorldProps {
  activeCategory?: HomeWorldCategory;
  isSearching?: boolean;
  className?: string;
}

export function HomeWorld({
  activeCategory = "idle",
  isSearching = false,
  className = "",
}: HomeWorldProps) {
  const { containerRef, isVisible, prefersReducedMotion, hasWebGL } = useSceneLifecycle();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSceneDef] = useState(() => getActiveScene());

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const shouldRender3D = mounted && hasWebGL && !isMobile && !prefersReducedMotion;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 h-full w-full overflow-hidden select-none pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* ── 3D Live Cinematic Layer (Desktop with WebGL) ── */}
      {shouldRender3D ? (
        isVisible && (
          <div className="absolute inset-0 h-full w-full">
            <DynamicHomeWorldScene
              activeCategory={activeCategory}
              isSearching={isSearching}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>
        )
      ) : (
        /* ── First-Class Cinematic Fallback (Mobile, Reduced Motion, or Non-WebGL) ── */
        <div className="absolute inset-0 h-full w-full overflow-hidden bg-[#0A0E14]">
          <div className="relative h-full w-full">
            <Image
              src={activeSceneDef.fallbackImage || "/images/map-ascent.webp"}
              alt="Ascent Cinematic Environment"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-45 brightness-95 contrast-105"
            />
            {/* Warm Golden Sunlight Dome wash */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#ffdca8]/10 to-[#86b6e4]/20 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Cinematic Vignette Overlay ensuring WCAG AAA typography readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-background/25 to-background/75 pointer-events-none" />
    </div>
  );
}
