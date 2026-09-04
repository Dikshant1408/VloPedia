"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Tv, Sparkles, Volume2, ShieldAlert, CheckCircle2, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CONTENT_TIER_MAP, DEFAULT_TIER } from "@/lib/valorant-types";

interface VideoAsset {
  uuid: string;
  name: string;
  videoUrl: string;
  isChroma?: boolean;
}

interface WatchClientProps {
  skin: {
    uuid: string;
    displayName: string;
    weaponSlug: string;
    contentTierUuid: string | null;
    displayIcon: string | null;
    thumbnailUrl?: string;
  };
  videoAssets: VideoAsset[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function WatchClient({ skin, videoAssets }: WatchClientProps) {
  const [activeAsset, setActiveAsset] = useState<VideoAsset>(videoAssets[0]);

  const canonicalSlug = slugify(skin.displayName) || skin.uuid;
  const tier = CONTENT_TIER_MAP[skin.contentTierUuid ?? ""] ?? DEFAULT_TIER;
  const rarityColor = tier.color;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top compact utility bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Link href={`/skins/${canonicalSlug}`}>
          <Button
            variant="secondary"
            size="sm"
            className="inline-flex items-center gap-2 border border-border/80 hover:border-primary/50 transition-all font-mono text-xs h-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            BACK TO COSMETIC DOSSIER
          </Button>
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-muted">
          <Link href="/skins" className="hover:text-white transition-colors">
            SKINS
          </Link>
          <span>/</span>
          <Link href={`/skins/${canonicalSlug}`} className="hover:text-white transition-colors">
            {skin.displayName.toUpperCase()}
          </Link>
          <span>/</span>
          <span className="text-primary font-bold">THEATER SHOWCASE</span>
        </div>
      </div>

      {/* Primary Video Theater Viewport - Above The Fold */}
      <div className="space-y-4">
        <div
          className="relative aspect-[16/9] w-full bg-[#03080F] overflow-hidden flex items-center justify-center transition-all duration-300 border shadow-2xl rounded-sm"
          style={{
            borderColor: `${rarityColor}40`,
            boxShadow: `0 24px 48px -20px ${rarityColor}20`,
          }}
        >
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-tactical-dots opacity-[0.04] pointer-events-none" />

          {/* Rarity ambient top strip */}
          <div
            className="absolute top-0 inset-x-0 h-[3px] z-30 transition-all duration-500"
            style={{ backgroundColor: rarityColor }}
          />

          {/* Primary HTML5 Video Player */}
          <video
            key={activeAsset.videoUrl}
            src={activeAsset.videoUrl}
            poster={skin.thumbnailUrl}
            preload="metadata"
            autoPlay
            loop
            muted
            controls
            playsInline
            className="w-full h-full object-contain relative z-10"
          >
            <source src={activeAsset.videoUrl} type="video/mp4" />
            Your browser does not support high-definition HTML5 video streams.
          </video>

          {/* Active Broadcast Tag */}
          <div className="absolute top-3 left-3 z-20 bg-black/85 border border-border/50 backdrop-blur-md px-2.5 py-1 font-mono text-[9px] text-muted flex items-center gap-2">
            <Tv className="h-3 w-3 text-primary animate-pulse" />
            <span className="text-white font-bold tracking-wider">
              OFFICIAL SHOWCASE // {activeAsset.name.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Video Selector Channel Feeds */}
        {videoAssets.length > 1 && (
          <div className="border border-border/40 bg-[rgba(15,28,36,0.5)] backdrop-blur-md p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Film className="h-3.5 w-3.5" />
                SHOWCASE CHANNELS ({videoAssets.length} FEEDS)
              </span>
              <span className="text-[10px] font-mono text-muted">
                SELECT UPGRADE LEVEL OR COLOR VARIANT
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {videoAssets.map((asset) => {
                const isActive = activeAsset.uuid === asset.uuid;
                return (
                  <button
                    key={asset.uuid}
                    onClick={() => setActiveAsset(asset)}
                    className={`px-3.5 py-2 border transition-all cursor-pointer font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 ${
                      isActive
                        ? "border-primary bg-primary/15 text-primary shadow-sm"
                        : "border-border/40 bg-[#08111A]/60 text-muted hover:border-border/90 hover:text-white"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isActive ? "bg-primary animate-ping" : "bg-muted/40"
                      }`}
                    />
                    {asset.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Video Dossier Context Bar */}
      <div className="border border-border/40 bg-[rgba(15,28,36,0.5)] backdrop-blur-md p-6 relative space-y-4">
        <div className="absolute left-0 top-0 h-[2px] w-12 bg-primary" />
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                VALORANT WEAPON COSMETIC SHOWCASE
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white font-black">
              {skin.displayName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              className="border-none font-mono font-black uppercase text-[11px] tracking-wider px-3 py-1.5"
              style={{
                backgroundColor: `${rarityColor}18`,
                color: rarityColor,
                border: `1px solid ${rarityColor}30`,
              }}
            >
              {tier.rarity} EDITION
            </Badge>
            <span className="font-mono-tactical text-lg font-black text-primary">
              {tier.price.toLocaleString()} VP
            </span>
          </div>
        </div>

        <p className="text-xs text-muted leading-relaxed font-sans max-w-3xl">
          High-definition visual showcase for the <span className="text-white font-bold">{skin.displayName}</span> in VALORANT.
          Inspect custom level progression including pull-out motions, reload sound effects, Radianite upgrades, and finisher visual effects.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid gap-4 sm:grid-cols-3 pt-2">
          <div className="border border-border/30 bg-[#08111A]/40 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-primary text-[10px] font-mono font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>VISUAL EFFECTS</span>
            </div>
            <p className="text-[11px] text-muted">
              Custom muzzle flash, tracer visuals, and glowing ambient elements.
            </p>
          </div>
          <div className="border border-border/30 bg-[#08111A]/40 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-primary text-[10px] font-mono font-bold">
              <Volume2 className="h-3.5 w-3.5" />
              <span>AUDIO KINEMATICS</span>
            </div>
            <p className="text-[11px] text-muted">
              Custom firing acoustic profile, reload sound effects, and inspect cues.
            </p>
          </div>
          <div className="border border-border/30 bg-[#08111A]/40 p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-primary text-[10px] font-mono font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>RADIANITE UPGRADES</span>
            </div>
            <p className="text-[11px] text-muted">
              Unlockable finisher animations and multi-tint chroma colorways.
            </p>
          </div>
        </div>

        {/* Full Dossier Link */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-border/30">
          <span className="text-[11px] font-mono text-muted">
            Looking for complete weapon statistics, 3D model canvases, and wishlist syncing?
          </span>
          <Link href={`/skins/${canonicalSlug}`}>
            <Button className="bg-primary hover:bg-primary-soft text-black font-bold font-mono tracking-wider text-xs h-9">
              OPEN FULL COSMETIC DOSSIER →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
