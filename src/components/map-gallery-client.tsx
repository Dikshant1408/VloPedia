"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, Grid, Layers } from "lucide-react";

interface MapGalleryClientProps {
  map: {
    name: string;
    minimapUrl: string;
    splashUrl: string;
    listViewIcon?: string;
    listViewIconTall?: string;
    stylizedBackgroundImage?: string;
    premierBackgroundImage?: string;
  };
}

export function MapGalleryClient({ map }: MapGalleryClientProps) {
  // Collect all available image sources from the API
  const slides = [
    {
      id: "splash",
      label: "LOADING SPLASH",
      description: "Panoramic loading screen scenic backdrop",
      url: map.splashUrl
    },
    {
      id: "list-view",
      label: "LANDSCAPE PANORAMA",
      description: "Standard wide-angle sector landscape",
      url: map.listViewIcon || map.splashUrl
    },
    {
      id: "list-view-tall",
      label: "EDITORIAL PORTRAIT",
      description: "Vertical tall strategic backdrop",
      url: map.listViewIconTall || map.splashUrl
    },
    {
      id: "stylized",
      label: "STYLIZED VECTOR ART",
      description: "Abstract custom line blueprint vector",
      url: map.stylizedBackgroundImage || map.splashUrl
    },
    {
      id: "premier",
      label: "PREMIER STADIUM CANVAS",
      description: "Tournament arena marketing asset artwork",
      url: map.premierBackgroundImage || map.splashUrl
    }
  ].filter(slide => slide.url); // filter out empty URLs

  const [activeSlide, setActiveSlide] = useState(slides[0]);
  const [showMinimap, setShowMinimap] = useState(true);

  return (
    <div className="space-y-6">
      {/* Viewport Frame */}
      <div className="relative aspect-[16/10] border border-border bg-background overflow-hidden flex items-center justify-center group">
        
        {/* Active Scene Backdrop */}
        <Image
          src={activeSlide.url}
          alt={`${map.name} ${activeSlide.label}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
          className="object-cover opacity-60 group-hover:scale-[1.01] transition-transform duration-500"
        />

        {/* Minimap Schematic Overlay */}
        {showMinimap && map.minimapUrl && (
          <div className="absolute inset-0 flex items-center justify-center p-8 bg-black/25">
            <div className="relative w-[85%] h-[85%] animate-pulse-subtle">
              <Image
                src={map.minimapUrl}
                alt={`${map.name} Blueprint`}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-contain filter invert hue-rotate-180 drop-shadow-[0_0_15px_rgba(255,70,85,0.4)] brightness-110 opacity-90"
              />
            </div>
          </div>
        )}

        {/* Viewport HUD indicators */}
        <div className="absolute top-3 left-3 bg-surface/90 border border-border px-2.5 py-1 text-[8px] tracking-widest text-muted font-bold flex items-center gap-1.5 uppercase font-mono">
          <Eye className="h-3 w-3 text-primary" />
          CAMERA: {activeSlide.id.replace("-", " ").toUpperCase()} - ZOOM 1.0X
        </div>

        <div className="absolute bottom-3 left-3 bg-surface/95 border border-border px-2.5 py-1.5 max-w-[70%] rounded-none">
          <span className="text-[9px] text-primary font-black uppercase tracking-wider block font-mono">
            {activeSlide.label}
          </span>
          <span className="text-[8px] text-muted font-sans block leading-tight mt-0.5 truncate">
            {activeSlide.description}
          </span>
        </div>

        {/* Overlay blueprint control button */}
        {map.minimapUrl && (
          <button
            onClick={() => setShowMinimap(!showMinimap)}
            className={`absolute bottom-3 right-3 border px-3 py-1.5 text-[8px] font-bold tracking-widest transition-all cursor-pointer flex items-center gap-1.5 ${
              showMinimap
                ? "border-[#FF4655] bg-primary text-white"
                : "border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)]/90 text-muted hover:border-white/20 hover:text-white"
            }`}
          >
            <Layers className="h-3 w-3" />
            {showMinimap ? "DISABLE BLUEPRINT" : "OVERLAY BLUEPRINT"}
          </button>
        )}
      </div>

      {/* Screen Selector Slide Tiles */}
      <div className="space-y-2">
        <span className="text-[9px] text-muted uppercase tracking-wider font-bold block flex items-center gap-1">
          <Grid className="h-3.5 w-3.5" /> SELECT CAMERA ANGLE FEED
        </span>
        
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {slides.map((slide) => {
            const isSelected = activeSlide.id === slide.id;
            return (
              <button
                key={slide.id}
                onClick={() => setActiveSlide(slide)}
                className={`relative aspect-[16/10] border overflow-hidden transition-all text-left group cursor-pointer ${
                  isSelected ? "border-[#FF4655] ring-1 ring-[#FF4655]" : "border-border hover:border-primary/40"
                }`}
              >
                <Image
                  src={slide.url}
                  alt={slide.label}
                  fill
                  sizes="150px"
                  className={`object-cover ${isSelected ? "opacity-90 scale-105" : "opacity-40 group-hover:opacity-75"} transition-all`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5">
                  <span className="text-[7.5px] font-black text-white uppercase tracking-wider leading-none block truncate">
                    {slide.label.split(" ")[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
