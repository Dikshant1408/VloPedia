"use client";

import React from "react";

interface SceneLoaderProps {
  label?: string;
}

export function SceneLoader({ label = "Loading 3D view..." }: SceneLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xs p-6 z-10 select-none"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        {/* Modern minimal spinner */}
        <div className="relative w-7 h-7 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-border border-t-primary animate-spin" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>

        <div className="space-y-1">
          <div className="font-sans text-xs font-semibold text-foreground">
            VloPedia 3D
          </div>
          <div className="font-sans text-[11px] text-secondary">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
