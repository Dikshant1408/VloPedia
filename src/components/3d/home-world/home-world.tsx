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
        /* ── First-Class Tactical Intelligence Fallback (Mobile, Reduced Motion, or Non-WebGL) ── */
        <div className="absolute inset-0 h-full w-full overflow-hidden bg-[#080A0F]">
          <div className="relative h-full w-full flex items-center justify-center">
            {/* Subtle dark tactical atmospheric grid */}
            <div className="absolute inset-0 bg-tactical-grid opacity-[0.25]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-background via-surface/40 to-background pointer-events-none" />
            
            {/* Subtle cyan and red ambient tactical floor reflections */}
            <div className="absolute -bottom-24 left-1/4 w-96 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 right-1/4 w-96 h-48 rounded-full bg-[#00E5FF]/5 blur-3xl pointer-events-none" />
          </div>
        </div>
      )}

      {/* Cinematic Vignette Overlay ensuring WCAG AAA typography readability in the clean central zone */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-background/40 via-background/75 to-background pointer-events-none" />
    </div>
  );
}
