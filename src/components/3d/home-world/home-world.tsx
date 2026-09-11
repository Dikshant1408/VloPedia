"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSceneLifecycle } from "../use-scene-lifecycle";
import { type HomeWorldCategory } from "./home-world.config";

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

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 h-full w-full overflow-hidden select-none pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 3D Cinematic Scene Layer */}
      {mounted && hasWebGL && !isMobile ? (
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
        /* Mobile / Fallback: Lightweight Atmospheric Backdrop */
        <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-background via-surface-card/40 to-background flex items-center justify-center">
          <div className="relative w-72 h-44 opacity-25">
            <div className="absolute inset-0 rounded-2xl border border-border/80 bg-surface-elevated rotate-[-4deg]" />
            <div className="absolute inset-4 rounded-xl border border-primary/40 bg-surface-card rotate-[3deg] flex items-center justify-center">
              <div className="h-4 w-20 bg-primary/60 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Cinematic Vignette Overlay ensuring WCAG AAA typography readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/40 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-background/30 to-background/80 pointer-events-none" />
    </div>
  );
}
