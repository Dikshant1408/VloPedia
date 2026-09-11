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
      {/* Top Bar: Instruction Prompt */}
      <div className="flex items-center justify-between w-full">
        <div
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 bg-surface-card/90 border border-border text-[11px] font-sans font-medium text-secondary transition-opacity duration-300 backdrop-blur-xs shadow-xs ${
            hasInteracted ? "opacity-40 hover:opacity-100" : "opacity-90"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          <span>Drag to rotate</span>
          <span className="text-muted hidden sm:inline">· Scroll to zoom</span>
        </div>
      </div>

      {/* Bottom Bar: Action Controls */}
      <div className="flex items-center justify-between w-full pt-2 pointer-events-auto">
        {/* Left: Auto Rotate, Step Rotation & Reset */}
        <div className="flex items-center gap-1 rounded-md bg-surface-card/90 border border-border p-1 backdrop-blur-xs shadow-xs">
          <button
            type="button"
            onClick={onToggleAutoRotate}
            aria-pressed={isAutoRotating}
            title={isAutoRotating ? "Pause Auto-Rotation (Space)" : "Enable Auto-Rotation (Space)"}
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-sans font-medium border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
              isAutoRotating
                ? "border-primary bg-primary/10 text-primary font-semibold"
                : "border-transparent text-secondary hover:text-foreground hover:bg-white/5"
            }`}
          >
            <RotateCw className={`h-3.5 w-3.5 ${isAutoRotating ? "animate-spin duration-3000" : ""}`} />
            <span className="hidden sm:inline">Auto</span>
          </button>

          {onRotateStep && (
            <div className="hidden sm:flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => onRotateStep("left")}
                aria-label="Rotate Left"
                title="Rotate Left (Left Arrow)"
                className="rounded p-1 text-secondary hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onRotateStep("right")}
                aria-label="Rotate Right"
                title="Rotate Right (Right Arrow)"
                className="rounded p-1 text-secondary hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onReset}
            title="Reset View (R or Double-Click)"
            className="flex items-center gap-1 rounded px-2 py-1 text-xs font-sans font-medium border border-transparent text-secondary hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Right: Zoom Controls & Theater Expansion */}
        <div className="flex items-center gap-1 rounded-md bg-surface-card/90 border border-border p-1 backdrop-blur-xs shadow-xs">
          <button
            type="button"
            onClick={onZoomIn}
            aria-label="Zoom In"
            title="Zoom In (+)"
            className="rounded p-1 text-secondary hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={onZoomOut}
            aria-label="Zoom Out"
            title="Zoom Out (-)"
            className="rounded p-1 text-secondary hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>

          {onOpenTheater && !isTheaterMode && (
            <>
              <div className="w-[1px] h-3.5 bg-border mx-0.5" aria-hidden="true" />
              <button
                type="button"
                onClick={onOpenTheater}
                aria-label="Open Theater Mode"
                title="Theater Mode"
                className="flex items-center gap-1 rounded px-2 py-1 text-xs font-sans font-medium border border-border bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Theater</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
