"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface TheaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  rarity?: string;
  cost?: string | number;
  children: React.ReactNode;
}

export function TheaterModal({
  isOpen,
  onClose,
  title,
  subtitle,
  rarity,
  cost,
  children,
}: TheaterModalProps) {
  // Lock body scroll and register Escape key listener (following .jules/palette.md standard)
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Theater view for ${title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-6xl h-[88vh] border border-border bg-[#0B141A] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Tactical Header */}
        <div className="flex items-center justify-between border-b border-border bg-surface-card px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-6 bg-primary" aria-hidden="true" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-tactical text-[9px] font-bold uppercase tracking-[0.25em] text-primary">
                  INSPECTION THEATER
                </span>
                {rarity && (
                  <span className="text-[9px] font-mono-tactical text-muted border border-border px-1.5 py-0.2 uppercase">
                    {rarity}
                  </span>
                )}
              </div>
              <h2 className="font-display text-xl sm:text-2xl uppercase tracking-wider text-foreground">
                {title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {cost !== undefined && (
              <div className="hidden sm:block text-right">
                <span className="block font-mono-tactical text-[8px] uppercase tracking-widest text-muted">
                  ACQUISITION
                </span>
                <span className="font-mono-tactical text-sm font-bold text-foreground">
                  {cost}
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-surface hover:bg-primary/20 hover:border-primary text-muted hover:text-foreground font-mono-tactical text-[10px] uppercase tracking-wider transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <X className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">CLOSE [ESC]</span>
            </button>
          </div>
        </div>

        {/* 3D Viewport Content Area */}
        <div className="relative flex-1 w-full bg-radial from-surface to-background overflow-hidden">
          {children}
        </div>

        {/* Bottom Status Ticker */}
        {subtitle && (
          <div className="border-t border-border bg-surface-card/80 px-4 py-2 flex items-center justify-between text-[9px] font-mono-tactical text-muted uppercase tracking-wider">
            <span>{subtitle}</span>
            <span className="hidden sm:inline">USE MOUSE DRAG / PINCH TO ROTATE & ZOOM</span>
          </div>
        )}
      </div>
    </div>
  );
}
