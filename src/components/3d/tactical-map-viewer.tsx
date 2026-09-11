"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { Layers, RotateCcw, RotateCw, ZoomIn, ZoomOut, Maximize2, MapPin, Compass, Shield } from "lucide-react";
import { useSceneLifecycle } from "./use-scene-lifecycle";
import { SceneLoader } from "./scene-loader";
import { SceneError } from "./scene-error";
import { TheaterModal } from "./theater-modal";
import type { TacticalMapStageHandle, ProcessedCallout } from "./tactical-map-stage";
import type { ValorantCallout } from "@/lib/valorant-types";

// Dynamically import TacticalMapStage to avoid loading R3F on initial SSR bundle
const TacticalMapStage = dynamic(
  () => import("./tactical-map-stage").then((mod) => mod.TacticalMapStage),
  {
    ssr: false,
    loading: () => <SceneLoader label="INITIALIZING TACTICAL RADAR..." />,
  }
);

export interface TacticalMapViewerProps {
  mapName: string;
  minimapUrl: string;
  fallbackSplashUrl?: string;
  callouts?: ValorantCallout[] | null;
  xMultiplier?: number;
  yMultiplier?: number;
  xScalarToAdd?: number;
  yScalarToAdd?: number;
  coordinates?: string | null;
  className?: string;
  aspectRatio?: string;
}

export function TacticalMapViewer({
  mapName,
  minimapUrl,
  fallbackSplashUrl,
  callouts = [],
  xMultiplier = 0.00007,
  yMultiplier = -0.00007,
  xScalarToAdd = 0.5,
  yScalarToAdd = 0.5,
  coordinates,
  className = "",
  aspectRatio = "16/10",
}: TacticalMapViewerProps) {
  const stageRef = useRef<TacticalMapStageHandle>(null);
  const theaterStageRef = useRef<TacticalMapStageHandle>(null);

  const {
    containerRef,
    hasWebGL,
    isVisible,
    prefersReducedMotion,
    isAutoRotating,
    hasInteracted,
    handleUserInteract,
    toggleAutoRotate,
  } = useSceneLifecycle({ threshold: 0.1, initialAutoRotate: false });

  const [isLoading, setIsLoading] = useState(true);
  const [activeLayer, setActiveLayer] = useState<"all" | "sites" | "choke" | "spawns">("all");
  const [selectedCallout, setSelectedCallout] = useState<ProcessedCallout | null>(null);
  const [isTheaterOpen, setIsTheaterOpen] = useState(false);

  // Compute 3D world coordinates for all map callouts from Riot's official transform
  const processedCallouts = useMemo<ProcessedCallout[]>(() => {
    if (!callouts || callouts.length === 0) return [];

    return callouts
      .map((c) => {
        const normX = c.location.y * xMultiplier + xScalarToAdd;
        const normY = c.location.x * yMultiplier + yScalarToAdd;

        // Sandtable plane is 6.0 units centered at origin [-3, 3]
        const x = (normX - 0.5) * 6.0;
        const z = (normY - 0.5) * 6.0;

        const superName = (c.superRegionName || "").toLowerCase();
        const regName = (c.regionName || "").toLowerCase();

        let category: ProcessedCallout["category"] = "other";
        if (regName.includes("site") || superName.includes("site")) {
          category = "site";
        } else if (regName.includes("spawn") || superName.includes("spawn")) {
          category = "spawn";
        } else if (
          regName.includes("mid") ||
          regName.includes("main") ||
          regName.includes("long") ||
          regName.includes("short") ||
          regName.includes("link") ||
          regName.includes("lobby") ||
          regName.includes("catwalk") ||
          regName.includes("garage") ||
          regName.includes("sewer")
        ) {
          category = "choke";
        }

        return {
          regionName: c.regionName,
          superRegionName: c.superRegionName || "",
          x,
          z,
          normX,
          normY,
          category,
        };
      })
      .filter((c) => c.normX >= 0 && c.normX <= 1 && c.normY >= 0 && c.normY <= 1);
  }, [callouts, xMultiplier, yMultiplier, xScalarToAdd, yScalarToAdd]);

  const handleReset = useCallback(() => {
    stageRef.current?.resetCamera();
    theaterStageRef.current?.resetCamera();
    setSelectedCallout(null);
  }, []);

  const handleZoomIn = useCallback(() => {
    stageRef.current?.zoomIn();
    theaterStageRef.current?.zoomIn();
    handleUserInteract();
  }, [handleUserInteract]);

  const handleZoomOut = useCallback(() => {
    stageRef.current?.zoomOut();
    theaterStageRef.current?.zoomOut();
    handleUserInteract();
  }, [handleUserInteract]);

  const handleSelectCallout = useCallback((c: ProcessedCallout) => {
    setSelectedCallout(c);
  }, []);

  if (hasWebGL === false) {
    return (
      <div
        ref={containerRef}
        className={`relative border border-border bg-[#08111A] overflow-hidden ${className}`}
        style={{ aspectRatio }}
      >
        <SceneError
          fallbackImageUrl={fallbackSplashUrl || minimapUrl}
          itemName={mapName}
          reason="webgl-disabled"
        />
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        role="region"
        aria-label={`Interactive 3D Tactical Sandtable for ${mapName}`}
        className={`relative border border-border bg-[#08111A] overflow-hidden group focus-within:ring-1 focus-within:ring-primary ${className}`}
        style={{ aspectRatio }}
        onDoubleClick={handleReset}
      >
        {/* Top Tactical Corner Accent */}
        <div aria-hidden="true" className="absolute left-0 top-0 h-[2px] w-14 bg-primary z-20" />

        {/* Top Left Status Badge */}
        <div className="absolute left-3 top-3 z-20 flex items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-card/90 border border-border text-[9px] font-mono-tactical uppercase tracking-wider text-muted backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" aria-hidden="true" />
            <span className="text-foreground font-bold">{mapName}</span>
            <span className="text-muted-dark">{"// TACTICAL SANDTABLE"}</span>
          </div>

          {coordinates && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-surface-card/80 border border-border text-[8px] font-mono-tactical text-muted">
              <Compass className="h-2.5 w-2.5 text-primary" />
              <span>{coordinates}</span>
            </div>
          )}
        </div>

        {/* Top Right Layer Filter Badges */}
        <div className="absolute right-3 top-3 z-20 flex items-center gap-1 bg-surface-card/90 border border-border p-1 backdrop-blur-xs pointer-events-auto">
          <button
            type="button"
            onClick={() => setActiveLayer("all")}
            aria-pressed={activeLayer === "all"}
            className={`px-2 py-1 text-[8px] font-mono-tactical font-bold uppercase tracking-wider border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
              activeLayer === "all"
                ? "border-primary bg-primary/15 text-primary"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            ALL
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("sites")}
            aria-pressed={activeLayer === "sites"}
            className={`px-2 py-1 text-[8px] font-mono-tactical font-bold uppercase tracking-wider border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
              activeLayer === "sites"
                ? "border-primary bg-primary/15 text-primary"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            SITES
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("choke")}
            aria-pressed={activeLayer === "choke"}
            className={`px-2 py-1 text-[8px] font-mono-tactical font-bold uppercase tracking-wider border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
              activeLayer === "choke"
                ? "border-[#FBBF24] bg-[#FBBF24]/15 text-[#FBBF24]"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            CHOKEPOINTS
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer("spawns")}
            aria-pressed={activeLayer === "spawns"}
            className={`px-2 py-1 text-[8px] font-mono-tactical font-bold uppercase tracking-wider border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
              activeLayer === "spawns"
                ? "border-[#0DF2F2] bg-[#0DF2F2]/15 text-[#0DF2F2]"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            SPAWNS
          </button>
        </div>

        {/* Loading overlay */}
        {isLoading && <SceneLoader label="PROJECTING TACTICAL SCHEMATIC..." />}

        {/* 3D Stage */}
        {hasWebGL && isVisible && (
          <TacticalMapStage
            ref={stageRef}
            minimapUrl={minimapUrl}
            callouts={processedCallouts}
            activeLayer={activeLayer}
            autoRotate={isAutoRotating}
            prefersReducedMotion={prefersReducedMotion}
            onSelectCallout={handleSelectCallout}
            onUserInteract={handleUserInteract}
            onLoaded={() => setIsLoading(false)}
          />
        )}

        {/* Bottom HUD Bar */}
        <div className="absolute bottom-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
          {/* Selected Waypoint Telemetry */}
          <div className="pointer-events-auto">
            {selectedCallout ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-card/95 border border-primary/40 text-[9px] font-mono-tactical uppercase tracking-wider text-foreground backdrop-blur-xs">
                <MapPin className="h-3 w-3 text-primary animate-bounce" />
                <span className="font-bold text-white">
                  {selectedCallout.superRegionName ? `${selectedCallout.superRegionName} ` : ""}
                  {selectedCallout.regionName}
                </span>
                <span className="text-muted-dark">|</span>
                <span className="text-primary font-bold">{selectedCallout.category.toUpperCase()}</span>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-surface-card/80 border border-border text-[8px] font-mono-tactical uppercase tracking-wider text-muted backdrop-blur-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>SELECT BEACON OR DRAG TO ROTATE MAP</span>
              </div>
            )}
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1 bg-surface-card/90 border border-border p-1 backdrop-blur-xs pointer-events-auto">
            <button
              type="button"
              onClick={toggleAutoRotate}
              aria-pressed={isAutoRotating}
              title={isAutoRotating ? "Pause Auto-Rotate" : "Auto-Rotate"}
              className={`p-1 text-[9px] font-mono-tactical font-bold border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                isAutoRotating
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              <RotateCw className={`h-3 w-3 ${isAutoRotating ? "animate-spin duration-3000" : ""}`} />
            </button>

            <button
              type="button"
              onClick={handleReset}
              title="Reset View Orientation"
              className="p-1 border border-transparent text-muted hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <RotateCcw className="h-3 w-3" />
            </button>

            <div className="w-[1px] h-3.5 bg-border mx-0.5" aria-hidden="true" />

            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoom In"
              aria-label="Zoom In"
              className="p-1 text-muted hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={handleZoomOut}
              title="Zoom Out"
              aria-label="Zoom Out"
              className="p-1 text-muted hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>

            <div className="w-[1px] h-3.5 bg-border mx-0.5" aria-hidden="true" />

            <button
              type="button"
              onClick={() => setIsTheaterOpen(true)}
              title="Tactical Theater Mode"
              aria-label="Tactical Theater Mode"
              className="flex items-center gap-1 px-2 py-1 text-[9px] font-mono-tactical font-bold uppercase tracking-wider border border-border bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <Maximize2 className="h-3 w-3" />
              <span className="hidden sm:inline">THEATER</span>
            </button>
          </div>
        </div>
      </div>

      {/* Theater Mode Modal */}
      <TheaterModal
        isOpen={isTheaterOpen}
        onClose={() => setIsTheaterOpen(false)}
        title={`${mapName} TACTICAL SANDTABLE`}
        subtitle="SATELLITE RADAR PROJECTION // OPERATIVE CALLOUT MATRIX"
      >
        <div className="relative w-full h-full" onDoubleClick={handleReset}>
          <TacticalMapStage
            ref={theaterStageRef}
            minimapUrl={minimapUrl}
            callouts={processedCallouts}
            activeLayer={activeLayer}
            autoRotate={isAutoRotating}
            prefersReducedMotion={prefersReducedMotion}
            onSelectCallout={handleSelectCallout}
            onUserInteract={handleUserInteract}
          />
        </div>
      </TheaterModal>
    </>
  );
}

export default TacticalMapViewer;
