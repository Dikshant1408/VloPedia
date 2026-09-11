"use client";

import React, { useEffect } from "react";
import { RotateCw, ZoomIn, ZoomOut, RotateCcw, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";

interface SceneControlsOverlayProps {
  hasInteracted: boolean;
  isAutoRotating: boolean;
  onToggleAutoRotate: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onRotateStep?: (direction: "left" | "right") => void;
  onOpenTheater?: () => void;
  isTheaterMode?: boolean;
}

export function SceneControlsOverlay({
  hasInteracted,
  isAutoRotating,
  onToggleAutoRotate,
  onZoomIn,
  onZoomOut,
  onReset,
  onRotateStep,
  onOpenTheater,
  isTheaterMode = false,
}: SceneControlsOverlayProps) {
  // Global keyboard shortcuts while focused or in viewer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        onReset();
      } else if (e.key === " " && !isTheaterMode) {
        e.preventDefault();
        onToggleAutoRotate();
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        onZoomIn();
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        onZoomOut();
      } else if (e.key === "ArrowLeft" && onRotateStep) {
        e.preventDefault();
        onRotateStep("left");
      } else if (e.key === "ArrowRight" && onRotateStep) {
        e.preventDefault();
        onRotateStep("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onReset, onToggleAutoRotate, onZoomIn, onZoomOut, onRotateStep, isTheaterMode]);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-4 z-10">
      {/* Top Bar: Instruction Badge & System Identifier */}
      <div className="flex items-center justify-between w-full">
        {/* Drag to inspect prompt */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 bg-surface-card/90 border border-border text-[9px] font-mono-tactical uppercase tracking-wider text-muted transition-opacity duration-500 backdrop-blur-xs ${
            hasInteracted ? "opacity-40 hover:opacity-100" : "opacity-90 animate-pulse"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          <span>DRAG TO INSPECT</span>
          <span className="text-muted-dark hidden sm:inline">{"// SCROLL ZOOM"}</span>
        </div>

        {/* Tactical Coordinates Reticle */}
        <div className="hidden sm:flex items-center gap-2 font-mono-tactical text-[8px] text-muted tracking-widest uppercase">
          <span>{"AXIS: Y-PITCH // CLAMPED"}</span>
        </div>
      </div>

      {/* Bottom Bar: Action Controls */}
      <div className="flex items-center justify-between w-full pt-2 pointer-events-auto">
        {/* Left: Auto Rotate, Step Rotation & Reset */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-surface-card/90 border border-border p-1 backdrop-blur-xs">
          <button
            type="button"
            onClick={onToggleAutoRotate}
            aria-pressed={isAutoRotating}
            title={isAutoRotating ? "Pause Auto-Rotation (Key: Space)" : "Enable Auto-Rotation (Key: Space)"}
            className={`flex items-center gap-1 px-2 py-1 text-[9px] font-mono-tactical font-bold uppercase tracking-wider border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
              isAutoRotating
                ? "border-primary bg-primary/15 text-primary"
                : "border-transparent text-muted hover:text-foreground hover:bg-white/5"
            }`}
          >
            <RotateCw className={`h-3 w-3 ${isAutoRotating ? "animate-spin duration-3000" : ""}`} />
            <span className="hidden sm:inline">AUTO</span>
          </button>

          {onRotateStep && (
            <div className="hidden sm:flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => onRotateStep("left")}
                aria-label="Rotate Left"
                title="Rotate Left (Key: Left Arrow)"
                className="p-1 text-muted hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => onRotateStep("right")}
                aria-label="Rotate Right"
                title="Rotate Right (Key: Right Arrow)"
                className="p-1 text-muted hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onReset}
            title="Reset Camera Orientation (Key: R or Double-Click)"
            className="flex items-center gap-1 px-2 py-1 text-[9px] font-mono-tactical font-bold uppercase tracking-wider border border-transparent text-muted hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>

        {/* Right: Zoom Controls & Theater Expansion */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-surface-card/90 border border-border p-1 backdrop-blur-xs">
          <button
            type="button"
            onClick={onZoomIn}
            aria-label="Zoom In"
            title="Zoom In (Key: +)"
            className="p-1 text-muted hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={onZoomOut}
            aria-label="Zoom Out"
            title="Zoom Out (Key: -)"
            className="p-1 text-muted hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>

          {onOpenTheater && !isTheaterMode && (
            <>
              <div className="w-[1px] h-3.5 bg-border mx-0.5" aria-hidden="true" />
              <button
                type="button"
                onClick={onOpenTheater}
                aria-label="Open Theater Inspection Mode"
                title="Theater Mode"
                className="flex items-center gap-1 px-2 py-1 text-[9px] font-mono-tactical font-bold uppercase tracking-wider border border-border bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <Maximize2 className="h-3 w-3" />
                <span className="hidden sm:inline">THEATER</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
