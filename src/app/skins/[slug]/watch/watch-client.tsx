"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CONTENT_TIER_MAP, DEFAULT_TIER } from "@/lib/valorant-types";

interface VideoAsset {
  uuid: string;
  name: string;
  videoUrl: string;
}

interface WatchClientProps {
  skin: {
    uuid: string;
    displayName: string;
    weaponSlug: string;
    contentTierUuid: string | null;
    displayIcon: string | null;
  };
  videoAssets: VideoAsset[];
}

export function WatchClient({ skin, videoAssets }: WatchClientProps) {
  const [activeAsset, setActiveAsset] = useState<VideoAsset>(videoAssets[0]);

  const tier = CONTENT_TIER_MAP[skin.contentTierUuid ?? ""] ?? DEFAULT_TIER;
  const rarityColor = tier.color;

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      {/* Back button and breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link href={`/skins/${skin.uuid}`}>
          <Button variant="secondary" size="sm" className="inline-flex items-center gap-2 border border-border/80 hover:border-primary/50 transition-all font-mono text-xs">
            <ArrowLeft className="h-3.5 w-3.5" />
            BACK TO DETAILS
          </Button>
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-muted">
          <span>SKINS</span>
          <span>/</span>
          <span>{skin.displayName.toUpperCase()}</span>
          <span>/</span>
          <span className="text-primary font-bold">WATCH</span>
        </div>
      </div>

      {/* Header bar */}
      <div className="border border-border/40 bg-[rgba(15,28,36,0.5)] backdrop-blur-md p-6 relative">
        <div className="absolute left-0 top-0 h-[2px] w-12 bg-primary" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 bg-primary rounded-full animate-ping" />
              <span className="font-mono-tactical text-[9px] font-bold uppercase tracking-[0.3em] text-primary">
                THEATER BROADCAST
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-white">
              {skin.displayName}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className="border-none font-mono font-black uppercase text-[10px] tracking-wider px-2.5 py-1"
              style={{
                backgroundColor: `${rarityColor}18`,
                color: rarityColor,
                border: `1px solid ${rarityColor}30`,
              }}
            >
              {tier.rarity}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="space-y-6">
        <div
          className="relative aspect-[16/9] bg-[#03080F] overflow-hidden flex items-center justify-center transition-all duration-300 border shadow-2xl animate-fade-in"
          style={{
            borderColor: `${rarityColor}30`,
            boxShadow: `0 20px 40px -20px ${rarityColor}15`,
          }}
        >
          {/* Subtle grid bg overlay */}
          <div className="absolute inset-0 bg-tactical-dots opacity-[0.03] pointer-events-none" />

          {/* Rarity ambient border glow top strip */}
          <div className="absolute top-0 inset-x-0 h-[3px] transition-all duration-500" style={{ backgroundColor: rarityColor }} />

          <video
            key={activeAsset.videoUrl}
            src={activeAsset.videoUrl}
            autoPlay
            loop
            muted
            controls
            playsInline
            className="w-full h-full object-contain relative z-10"
          />

          <div className="absolute bottom-4 left-4 z-20 bg-black/80 border border-border/40 backdrop-blur-sm px-3 py-1 font-mono text-[9px] text-muted flex items-center gap-2">
            <Tv className="h-3 w-3 text-primary animate-pulse" />
            <span>STREAMING // {activeAsset.name.toUpperCase()}</span>
          </div>
        </div>

        {/* Video selector feeds */}
        {videoAssets.length > 1 && (
          <div className="border border-border/40 bg-[rgba(15,28,36,0.3)] p-4 space-y-3">
            <span className="text-[10px] text-primary font-bold uppercase tracking-wider block font-mono">
              {"// CHOOSE LEVEL SHOWCASE FEED"}
            </span>
            <div className="flex flex-wrap gap-2">
              {videoAssets.map((asset) => (
                <button
                  key={asset.uuid}
                  onClick={() => setActiveAsset(asset)}
                  className={`px-4 py-2 border transition-all cursor-pointer font-mono text-[10px] font-bold uppercase tracking-wider ${
                    activeAsset.uuid === asset.uuid
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/40 bg-[#08111A]/40 text-muted hover:border-border/80 hover:text-white"
                  }`}
                >
                  {asset.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rarity & detail highlights */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="border border-border/40 bg-[rgba(15,28,36,0.3)] p-6 space-y-2">
          <span className="text-[10px] text-muted uppercase block font-mono">{"// VIDEO OBJECTIVE"}</span>
          <p className="text-xs text-muted leading-relaxed">
            This showcase displays the animations, finisher visual effects, and reload actions for the{" "}
            <span className="text-white font-bold">{skin.displayName}</span> in high definition. Switch between
            different levels using the controls above to inspect custom reload, pull-out, or finisher actions.
          </p>
        </div>
        <div className="border border-border/40 bg-[rgba(15,28,36,0.3)] p-6 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-muted uppercase block font-mono">{"// FULL INSPECT FRAME"}</span>
            <p className="text-xs text-muted leading-relaxed">
              Looking for single-weapon prices, complete chroma porting views, and wishlist synchronization details?
            </p>
          </div>
          <Link href={`/skins/${skin.uuid}`} className="mt-4 sm:mt-0">
            <Button className="w-full bg-primary hover:bg-primary-soft text-black font-bold font-mono tracking-widest text-[11px] h-9">
              GO TO FULL INSPECTOR
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
