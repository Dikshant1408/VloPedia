"use client";

import React from "react";

interface SceneLoaderProps {
  label?: string;
}

export function SceneLoader({ label = "INITIALIZING INSPECTION..." }: SceneLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xs p-6 z-10 select-none"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        {/* Tactical spinning diamond */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute inset-0 border border-primary/40 rotate-45 animate-spin duration-3000" />
          <div className="w-2 h-2 bg-primary animate-ping" />
        </div>

        <div className="space-y-1">
          <div className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
            TACTICAL VISUALIZER
          </div>
          <div className="font-mono-tactical text-[9px] uppercase tracking-wider text-muted">
            {label}
          </div>
        </div>

        {/* Tactical scanning progress line */}
        <div className="w-32 h-[2px] bg-border overflow-hidden relative mt-1">
          <div className="absolute inset-y-0 bg-primary w-1/3 animate-[shimmer_1.5s_infinite] [animation-timing-function:cubic-bezier(0.4,0,0.6,1)]" />
        </div>
      </div>
    </div>
  );
}
