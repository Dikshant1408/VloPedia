"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSceneLifecycle } from "../use-scene-lifecycle";
import { CoreDomain, DOMAIN_METADATA } from "./intelligence-core.config";
import { IntelligenceCoreFallback } from "./intelligence-core-fallback";

// Dynamic load for R3F Canvas
const DynamicIntelligenceCore3D = dynamic(
  () => import("./intelligence-core-3d").then((mod) => mod.IntelligenceCore3D),
  { ssr: false }
);

interface IntelligenceCoreProps {
  activeDomain?: CoreDomain;
  className?: string;
}

export function IntelligenceCore({
  activeDomain = "idle",
  className = "",
}: IntelligenceCoreProps) {
  const { containerRef, isVisible, prefersReducedMotion, hasWebGL } = useSceneLifecycle();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const meta = DOMAIN_METADATA[activeDomain] || DOMAIN_METADATA.idle;
  const canRender3D = mounted && hasWebGL && !isMobile && !prefersReducedMotion;

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full select-none overflow-visible flex items-center justify-center ${className}`}
      aria-label="VloPedia VALORANT Intelligence Core"
    >
      {/* 3D WebGL Canvas Layer */}
      {canRender3D ? (
        isVisible && (
          <div className="absolute inset-0 h-full w-full">
            <DynamicIntelligenceCore3D
              activeDomain={activeDomain}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>
        )
      ) : (
        /* High-Definition 2D Tactical Fallback */
        <div className="relative h-full w-full flex items-center justify-center p-4">
          <IntelligenceCoreFallback activeDomain={activeDomain} className="w-full h-full" />
        </div>
      )}

      {/* Tactical Telemetry HUD Overlay (Desktop & Tablet) */}
      <div className="absolute -bottom-2 right-4 sm:right-6 pointer-events-none z-10 flex flex-col items-end gap-1 font-mono text-[9px] text-muted/70 tracking-widest uppercase">
        <div className="flex items-center gap-2 px-2.5 py-1 border border-border/60 bg-surface/80 backdrop-blur-xs clip-diagonal-sm">
          <span 
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: meta.accentColor }} 
          />
          <span className="text-foreground font-bold">{meta.label}</span>
          <span className="text-muted/60">[{meta.count}]</span>
        </div>
        <div className="text-[8px] text-muted/50 hidden sm:block">
          STATUS: ONLINE // RADIANITE TEL 13.06
        </div>
      </div>
    </div>
  );
}
