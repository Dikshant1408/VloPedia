"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Play, RotateCcw, Maximize2, X, Sparkles, Volume2, Shield } from "lucide-react";
import type { ValorantChroma, ValorantSkinLevel } from "@/lib/valorant-types";

export interface SkinShowcaseProps {
  weaponImageUrl: string;
  weaponName: string;
  modelUrl?: string; // Optional true 3D asset (GLTF/GLB) — if absent, seamlessly renders high-end 2.5D artwork
  subtitle?: string;
  rarity?: string;
  cost?: string | number;
  badgeLabel?: string;
  className?: string;
  aspectRatio?: string;
  chromas?: ValorantChroma[];
  levels?: ValorantSkinLevel[];
  onSelectChroma?: (chroma: ValorantChroma) => void;
  onSelectLevel?: (level: ValorantSkinLevel) => void;
}

export function SkinShowcase({
  weaponImageUrl,
  weaponName,
  modelUrl,
  subtitle,
  rarity,
  cost,
  badgeLabel = "Showcase",
  className = "",
  aspectRatio = "16/9",
  chromas = [],
  levels = [],
  onSelectChroma,
  onSelectLevel,
}: SkinShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Active selections
  const [selectedChromaIdx, setSelectedChromaIdx] = useState(0);
  const [selectedLevelIdx, setSelectedLevelIdx] = useState(0);
  const [isTheaterOpen, setIsTheaterOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Micro-parallax tilt & lighting states (calm, subtle, zero auto-rotation)
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Selected chroma or fallback
  const activeChroma = chromas[selectedChromaIdx];
  const activeLevel = levels[selectedLevelIdx];

  // Current display image: prioritize active chroma's full render or display icon, fallback to initial weapon image
  const displayImage =
    activeChroma?.fullRender ||
    activeChroma?.displayIcon ||
    weaponImageUrl ||
    "/images/bundle-eviction.webp";

  // Streamed video from active level or active chroma
  const activeVideoUrl =
    activeLevel?.streamedVideo ||
    activeChroma?.streamedVideo ||
    levels.find((l) => l.streamedVideo)?.streamedVideo ||
    null;

  // Reset when base image or skin changes
  useEffect(() => {
    setSelectedChromaIdx(0);
    setSelectedLevelIdx(0);
  }, [weaponImageUrl, weaponName]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Normalised -1 to 1
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    // Micro-parallax max tilt angle: ±5.2 degrees (deliberate, restrained)
    const maxTilt = 5.2;
    setTilt({
      x: -normY * maxTilt,
      y: normX * maxTilt,
    });

    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.14,
    });
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
    setIsHovered(false);
  }, []);

  const handleReset = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
    setSelectedChromaIdx(0);
    setSelectedLevelIdx(0);
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* ── 2.5D Showcase Stage ── */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative w-full overflow-hidden rounded-xl border border-border/80 bg-gradient-to-b from-surface-elevated/60 via-surface-card to-background p-6 sm:p-10 select-none shadow-xl transition-all duration-300 hover:border-primary/40"
        style={{ aspectRatio }}
      >
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute inset-0 bg-radial from-white/[0.04] via-transparent to-transparent pointer-events-none" />

        {/* Dynamic Light Sweep / Glare Layer */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.20) 0%, rgba(255, 255, 255, 0.04) 30%, transparent 65%)`,
          }}
        />

        {/* Subtle VALORANT red ambient aura in background */}
        <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        {/* Header HUD / Identity */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/30 bg-primary/10 font-mono text-[10px] font-semibold text-primary uppercase tracking-wider backdrop-blur-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {badgeLabel}
            </span>
            {rarity && (
              <span className="hidden sm:inline-block px-2 py-0.5 rounded border border-border/60 bg-surface-card/80 font-mono text-[10px] text-secondary uppercase">
                {rarity}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={handleReset}
              title="Reset View"
              aria-label="Reset View"
              className="h-7 w-7 rounded-md border border-border/70 bg-surface-card/80 text-secondary hover:text-foreground hover:border-primary/40 transition-colors flex items-center justify-center cursor-pointer backdrop-blur-xs text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsTheaterOpen(true)}
              title="Expanded Showcase"
              aria-label="Expanded Showcase"
              className="h-7 w-7 rounded-md border border-border/70 bg-surface-card/80 text-secondary hover:text-foreground hover:border-primary/40 transition-colors flex items-center justify-center cursor-pointer backdrop-blur-xs text-xs"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ── 2.5D Layer Composition ── */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Ground Pedestal Drop Shadow */}
          <div
            className="absolute bottom-4 sm:bottom-6 w-3/4 h-7 bg-black/50 blur-lg rounded-full pointer-events-none transition-transform duration-100"
            style={{
              transform: `translate3d(${-tilt.y * 1.2}px, ${tilt.x * 0.8}px, 0px) scale(${isHovered ? 1.03 : 1})`,
            }}
          />

          {/* High-Resolution Weapon Artwork with 2.5D CSS Tilt */}
          <div
            className="relative w-full h-full flex items-center justify-center pointer-events-none"
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${isHovered ? 18 : 0}px) scale(${isHovered ? 1.02 : 1})`,
              transition: isHovered
                ? "transform 0.08s ease-out"
                : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <Image
              src={displayImage}
              alt={weaponName}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 850px"
              className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)] select-none transition-opacity duration-300"
            />
          </div>
        </div>

        {/* Bottom Subtitle / Video Strip */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="text-left">
            <span className="font-mono text-[11px] text-muted tracking-tight">
              {subtitle || weaponName}
            </span>
          </div>

          {activeVideoUrl && (
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-primary/40 bg-primary/20 hover:bg-primary/30 text-white font-sans text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Watch Showcase Video
            </button>
          )}

          {cost !== undefined && !activeVideoUrl && (
            <div className="font-mono text-[11px] text-secondary tracking-tight">
              {typeof cost === "number" ? `${cost.toLocaleString()} VP` : cost}
            </div>
          )}
        </div>
      </div>

      {/* ── Chromas Swatches Strip (BASE + VARIANTS) ── */}
      {chromas.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-border/60 bg-surface-card/60">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-semibold">
              Variants ({chromas.length})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {chromas.map((chroma, idx) => {
              const isSelected = idx === selectedChromaIdx;
              const isBase = idx === 0 || chroma.displayName.toLowerCase().includes("standard");
              const label = isBase
                ? "BASE"
                : chroma.displayName.replace(/Variant \d+/i, "").trim() || `Variant ${idx + 1}`;

              return (
                <button
                  key={chroma.uuid || idx}
                  type="button"
                  onClick={() => {
                    setSelectedChromaIdx(idx);
                    onSelectChroma?.(chroma);
                  }}
                  className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-sans transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/15 text-foreground font-semibold shadow-xs"
                      : "border-border/80 bg-surface-muted/60 text-secondary hover:border-border-light hover:text-foreground"
                  }`}
                >
                  {chroma.swatch ? (
                    <span className="relative h-3.5 w-3.5 rounded-full overflow-hidden shrink-0 border border-black/30">
                      <Image
                        src={chroma.swatch}
                        alt={chroma.displayName}
                        fill
                        className="object-cover"
                      />
                    </span>
                  ) : (
                    <span
                      className={`h-2.5 w-2.5 rounded-full shrink-0 border border-black/20 ${
                        isSelected ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                  <span className="truncate max-w-[110px]">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Level Progression Strip (LEVELS: Base, VFX, Animation, Finisher) ── */}
      {levels.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 rounded-lg border border-border/60 bg-surface-card/60">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted font-semibold">
              Upgrades ({levels.length} Levels)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {levels.map((lvl, idx) => {
              const isSelected = idx === selectedLevelIdx;
              const rawItem = lvl.levelItem?.replace(/EEquippableSkinLevelItem::/i, "") || "";
              const levelLabel =
                idx === 0
                  ? "Level 1 (Base)"
                  : rawItem
                  ? `Level ${idx + 1} (${rawItem})`
                  : `Level ${idx + 1}`;

              return (
                <button
                  key={lvl.uuid || idx}
                  type="button"
                  onClick={() => {
                    setSelectedLevelIdx(idx);
                    onSelectLevel?.(lvl);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-mono transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/20 text-white font-bold shadow-xs"
                      : "border-border/80 bg-surface-muted/40 text-muted hover:border-border-light hover:text-foreground"
                  }`}
                >
                  <span>{levelLabel}</span>
                  {lvl.streamedVideo && (
                    <Play className="h-2.5 w-2.5 text-primary fill-current ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Theater Modal ── */}
      {isTheaterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsTheaterOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl h-[85vh] rounded-2xl border border-border bg-[#0B141A] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-background/80 backdrop-blur-sm">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-semibold">
                  Weapon Showcase
                </span>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
                  {weaponName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTheaterOpen(false)}
                className="h-8 w-8 rounded-lg border border-border text-muted hover:text-foreground hover:border-primary transition-colors flex items-center justify-center cursor-pointer"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Stage Content */}
            <div className="relative flex-1 flex items-center justify-center p-8 sm:p-14 overflow-hidden bg-radial from-white/[0.03] via-transparent to-transparent">
              <div className="absolute bottom-12 w-2/3 h-10 bg-black/70 blur-2xl rounded-full pointer-events-none" />
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={displayImage}
                  alt={weaponName}
                  fill
                  sizes="1200px"
                  className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.8)] select-none"
                />
              </div>
            </div>

            {/* Modal Footer with Video CTA if present */}
            {activeVideoUrl && (
              <div className="border-t border-border/80 px-6 py-3 bg-background/60 flex items-center justify-between">
                <span className="font-mono text-xs text-muted">
                  Official Valorant Weapon Showcase
                </span>
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary hover:bg-primary/90 text-white font-sans text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Watch Video Animation
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Video Player Modal ── */}
      {isVideoModalOpen && activeVideoUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl rounded-xl border border-border bg-black overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/80 px-5 py-3 bg-surface-card">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-xs font-bold text-foreground uppercase">
                  {weaponName} — Showcase Video
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="h-7 w-7 rounded-md border border-border text-muted hover:text-foreground hover:border-primary transition-colors flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative aspect-[16/9] w-full bg-black">
              <video
                src={activeVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkinShowcase;
