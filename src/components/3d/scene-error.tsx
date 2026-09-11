"use client";

import React from "react";
import Image from "next/image";

interface SceneErrorProps {
  fallbackImageUrl: string;
  itemName: string;
  reason?: "webgl-disabled" | "asset-failed" | "reduced-mode";
}

export function SceneError({
  fallbackImageUrl,
  itemName,
  reason = "webgl-disabled",
}: SceneErrorProps) {
  const reasonText =
    reason === "webgl-disabled"
      ? "WEBGL ACCELERATION UNAVAILABLE"
      : reason === "reduced-mode"
      ? "REDUCED MOTION / PERFORMANCE MODE"
      : "ASSET RETRIEVAL ERROR";

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-[#08111A]/60 overflow-hidden select-none">
      <div className="absolute inset-0 bg-tactical-dots opacity-[0.05] pointer-events-none" />

      {/* 2D Fallback Render */}
      <div className="relative w-4/5 h-3/5 max-h-56 transition-transform duration-300">
        <Image
          src={fallbackImageUrl}
          alt={itemName}
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-contain p-2"
          unoptimized
        />
      </div>

      {/* Tactical Status Pill */}
      <div className="mt-4 flex items-center gap-2 border border-border bg-surface-card/90 px-3 py-1 font-mono-tactical text-[9px] uppercase tracking-wider text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-warning" aria-hidden="true" />
        <span>{reasonText}</span>
        <span className="text-border">|</span>
        <span className="text-foreground font-bold">TACTICAL 2D VIEW</span>
      </div>
    </div>
  );
}
