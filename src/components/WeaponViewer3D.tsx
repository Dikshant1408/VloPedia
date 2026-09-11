"use client";

import React from "react";
import { WeaponInspectionViewer } from "./3d/weapon-inspection-viewer";

interface WeaponViewer3DProps {
  weaponImageUrl: string;
  weaponName: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  autoRotate?: boolean;
  enableDamping?: boolean;
  aspectRatio?: string;
  badgeLabel?: string;
  className?: string;
}

/**
 * WeaponViewer3D (Legacy Wrapper)
 * Retained for backward compatibility across existing routes.
 * Delegates to the modernized, performant WeaponInspectionViewer.
 */
export default function WeaponViewer3D({
  weaponImageUrl,
  weaponName,
  aspectRatio = "4/3",
  badgeLabel = "INSPECT VIEW",
  className = "",
}: WeaponViewer3DProps) {
  return (
    <WeaponInspectionViewer
      weaponImageUrl={weaponImageUrl}
      weaponName={weaponName}
      aspectRatio={aspectRatio}
      badgeLabel={badgeLabel}
      className={className}
    />
  );
}

export { WeaponInspectionViewer };