"use client";

import React, { useRef, useState, useEffect } from "react";
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
      className={`relative w-full aspect-[4/3] lg:aspect-[1/1] xl:aspect-[4/3] max-h-[500px] rounded-2xl border border-border/80 bg-surface-card/60 backdrop-blur-xs shadow-sm overflow-hidden flex items-center justify-center select-none transition-all duration-500 ${
        isSearching ? "border-primary/40 ring-1 ring-primary/20" : ""
      } ${className}`}
      aria-hidden="true"
    >
      {/* Subtle Atmosphere Corner Badge */}
      <div className="absolute top-3.5 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        <span className="font-sans text-[11px] font-medium tracking-normal text-muted">
          Tactical Diorama
        </span>
      </div>

      {/* Active Category Indicator */}
      {activeCategory !== "idle" && (
        <div className="absolute top-3.5 right-4 z-10 font-sans text-[11px] font-semibold text-primary capitalize bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md pointer-events-none transition-all duration-300">
          Focus: {activeCategory}
        </div>
      )}

      {/* R3F Interactive 3D World (Desktop & Supported Devices) */}
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
        /* Mobile / Fallback: Lightweight Stylized Editorial Diorama Graphic */
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-surface-elevated/40 to-surface-card/80 text-center">
          <div className="relative w-40 h-28 mb-4 flex items-center justify-center">
            {/* Stylized geometric diorama preview */}
            <div className="absolute inset-0 rounded-lg border border-border/70 bg-surface-elevated rotate-[-3deg] shadow-md" />
            <div className="absolute inset-2 rounded-md border border-primary/30 bg-surface-card rotate-[2deg] flex items-center justify-center">
              <div className="h-3 w-16 bg-primary/80 rounded-full" />
            </div>
            <div className="absolute -bottom-2 h-1.5 w-24 bg-black/40 blur-xs rounded-full" />
          </div>
          <span className="font-sans text-xs font-semibold text-foreground">
            Atmospheric Diorama
          </span>
          <p className="font-sans text-[11px] text-muted max-w-[220px] mt-1">
            Visualizing the living VALORANT world
          </p>
        </div>
      )}

      {/* Soft Bottom Gradient Vignette for Depth */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-card/80 to-transparent pointer-events-none" />
    </div>
  );
}
