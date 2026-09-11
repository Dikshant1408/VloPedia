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
        className={`relative border border-border bg-[#08111A] overflow-hidden ${className}`}
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
        className={`relative border border-border bg-[#08111A] overflow-hidden ${className}`}
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
        aria-label={`Interactive tactical inspection view for ${weaponName}. Double click or press R to reset view.`}
        className={`relative border border-border bg-[#08111A] overflow-hidden group focus-within:ring-1 focus-within:ring-primary ${className}`}
        style={{ aspectRatio }}
        onDoubleClick={handleReset}
      >
        {/* Top Tactical Corner Accent */}
        <div aria-hidden="true" className="absolute left-0 top-0 h-[2px] w-12 bg-primary z-20" />

        {/* Tactical Badge Header */}
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 bg-primary px-3 py-1 font-mono-tactical text-[9px] font-black tracking-wider text-black z-20 select-none flex items-center gap-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
          <span>{badgeLabel}</span>
        </div>

        {/* Subtle Loading overlay until Three.js texture loads */}
        {isLoading && <SceneLoader label="INITIALIZING INSPECTION..." />}

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
        subtitle={subtitle || "TACTICAL 2.5D SURFACE INSPECTION // VALORANT PROTOCOL"}
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
