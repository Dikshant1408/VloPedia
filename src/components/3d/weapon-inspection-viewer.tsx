"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSceneLifecycle } from "./use-scene-lifecycle";
import { SceneControlsOverlay } from "./scene-controls-overlay";
import { SceneLoader } from "./scene-loader";
import { SceneError } from "./scene-error";
import { TheaterModal } from "./theater-modal";
import type { TacticalStageHandle } from "./tactical-scene-stage";

// Dynamically import TacticalSceneStage to eliminate heavy Three.js evaluation from initial bundle
const TacticalSceneStage = dynamic(
  () => import("./tactical-scene-stage").then((mod) => mod.TacticalSceneStage),
  {
    ssr: false,
    loading: () => <SceneLoader label="INITIALIZING INSPECTION..." />,
  }
);

export interface WeaponInspectionViewerProps {
  weaponImageUrl: string;
  weaponName: string;
  subtitle?: string;
  rarity?: string;
  cost?: string | number;
  badgeLabel?: string;
  className?: string;
  aspectRatio?: string;
}

export function WeaponInspectionViewer({
  weaponImageUrl,
  weaponName,
  subtitle,
  rarity,
  cost,
  badgeLabel = "INSPECT VIEW",
  className = "",
  aspectRatio = "4/3",
}: WeaponInspectionViewerProps) {
  const stageRef = useRef<TacticalStageHandle>(null);
  const theaterStageRef = useRef<TacticalStageHandle>(null);

  const {
    containerRef,
    hasWebGL,
    isVisible,
    prefersReducedMotion,
    isAutoRotating,
    hasInteracted,
    handleUserInteract,
    toggleAutoRotate,
  } = useSceneLifecycle({ threshold: 0.1, initialAutoRotate: true });

  const [isLoading, setIsLoading] = useState(true);
  const [isTheaterOpen, setIsTheaterOpen] = useState(false);
  const [assetError, setAssetError] = useState(false);

  // Reset loading state when weaponImageUrl changes (e.g. chroma variant switch)
  useEffect(() => {
    setIsLoading(true);
    setAssetError(false);
  }, [weaponImageUrl]);

  const handleReset = useCallback(() => {
    stageRef.current?.resetCamera();
    theaterStageRef.current?.resetCamera();
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

  const handleRotateStep = useCallback(
    (direction: "left" | "right") => {
      stageRef.current?.rotateStep(direction);
      theaterStageRef.current?.rotateStep(direction);
      handleUserInteract();
    },
    [handleUserInteract]
  );

  // If WebGL check completed and is false, or asset errored, display high-fidelity 2D fallback
  if (hasWebGL === false) {
    return (
      <div
        ref={containerRef}
        className={`relative rounded-lg border border-border bg-surface-card overflow-hidden ${className}`}
        style={{ aspectRatio }}
      >
        <SceneError
          fallbackImageUrl={weaponImageUrl}
          itemName={weaponName}
          reason="webgl-disabled"
        />
      </div>
    );
  }

  if (assetError) {
    return (
      <div
        ref={containerRef}
        className={`relative rounded-lg border border-border bg-surface-card overflow-hidden ${className}`}
        style={{ aspectRatio }}
      >
        <SceneError
          fallbackImageUrl={weaponImageUrl}
          itemName={weaponName}
          reason="asset-failed"
        />
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        role="region"
        aria-label={`Interactive 3D view for ${weaponName}. Double click or press R to reset.`}
        className={`relative rounded-lg border border-border bg-surface-card overflow-hidden group focus-within:ring-2 focus-within:ring-primary/40 ${className}`}
        style={{ aspectRatio }}
        onDoubleClick={handleReset}
      >
        {/* Badge Header */}
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 rounded-bl-md border-b border-l border-border/80 bg-surface-card/90 backdrop-blur-xs px-2.5 py-1 font-sans text-[11px] font-medium text-secondary z-20 select-none flex items-center gap-1.5 shadow-xs"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span>{badgeLabel === "INSPECT VIEW" ? "3D Interactive" : badgeLabel}</span>
        </div>

        {/* Subtle Loading overlay until Three.js texture loads */}
        {isLoading && <SceneLoader label="Loading 3D model..." />}

        {/* 3D Stage (only renders when visible in viewport to prevent GPU drain) */}
        {hasWebGL && isVisible && (
          <TacticalSceneStage
            ref={stageRef}
            imageUrl={weaponImageUrl}
            autoRotate={isAutoRotating}
            prefersReducedMotion={prefersReducedMotion}
            onUserInteract={handleUserInteract}
            onLoaded={() => setIsLoading(false)}
          />
        )}

        {/* HUD Controls Overlay */}
        <SceneControlsOverlay
          hasInteracted={hasInteracted}
          isAutoRotating={isAutoRotating}
          onToggleAutoRotate={toggleAutoRotate}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
          onRotateStep={handleRotateStep}
          onOpenTheater={() => setIsTheaterOpen(true)}
        />
      </div>

      {/* In-Page Theater Mode Modal */}
      <TheaterModal
        isOpen={isTheaterOpen}
        onClose={() => setIsTheaterOpen(false)}
        title={weaponName}
        subtitle={subtitle || "Interactive 3D Skin Inspector"}
        rarity={rarity}
        cost={cost}
      >
        <div className="relative w-full h-full" onDoubleClick={handleReset}>
          <TacticalSceneStage
            ref={theaterStageRef}
            imageUrl={weaponImageUrl}
            autoRotate={isAutoRotating}
            prefersReducedMotion={prefersReducedMotion}
            onUserInteract={handleUserInteract}
          />
          <SceneControlsOverlay
            hasInteracted={hasInteracted}
            isAutoRotating={isAutoRotating}
            onToggleAutoRotate={toggleAutoRotate}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={handleReset}
            onRotateStep={handleRotateStep}
            isTheaterMode={true}
          />
        </div>
      </TheaterModal>
    </>
  );
}

export default WeaponInspectionViewer;
