"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Play, Star, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useUserWishlist } from "@/hooks/use-user-wishlist";
import { Skin } from "@/lib/valorant-db";

type Props = {
  skin: Skin;
};

export function SkinInspectClient({ skin }: Props) {
  const { user, signInWithDiscord } = useAuth();
  const { addWishlistItem, items: wishlistItems } = useUserWishlist();

  const [selectedVariant, setSelectedVariant] = useState(skin.variants[0]?.id || "default");
  const [activeVideo, setActiveVideo] = useState<"inspect" | "reload">("inspect");
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [isPlayingInline, setIsPlayingInline] = useState(false);

  const currentVariant = skin.variants.find((v) => v.id === selectedVariant) || skin.variants[0];
  const currentVideoUrl = selectedVideoUrl || (activeVideo === "inspect" ? skin.inspectVideoUrl : skin.reloadVideoUrl) || null;

  const handleAddToWishlist = async () => {
    try {
      if (!user) {
        toast.info("Authentication required", {
          description: "Sign in with Discord to synchronize your wishlist items.",
          action: {
            label: "Sign In",
            onClick: () => signInWithDiscord()
          },
          className: "font-mono rounded-none"
        });
        return;
      }
      
      const isAlreadyInWishlist = wishlistItems.some((w) => w.title === skin.name);
      if (isAlreadyInWishlist) {
        toast.info("Item already saved", {
          description: `"${skin.name}" is already on your active wishlist.`,
          className: "font-mono rounded-none"
        });
        return;
      }

      await addWishlistItem({
        title: skin.name,
        category: "skin"
      });
      toast.success("Sync successful", {
        description: `Added "${skin.name}" to your secure command center wishlist.`,
        className: "font-mono rounded-none border-[#FF4655]"
      });
    } catch (err: any) {
      toast.error("Could not sync item.", {
        description: err.message,
        className: "font-mono rounded-none"
      });
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Navigation Back */}
      <Link href="/skins">
        <Button variant="secondary" size="sm" className="inline-flex items-center gap-2 rounded-md font-sans text-xs">
          <ArrowLeft className="h-4 w-4" />
          Back to skins
        </Button>
      </Link>

      {/* Main Split inspector */}
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] items-stretch">
        
        {/* Color Inspector Canvas */}
        <div className="rounded-lg border border-border bg-surface-card p-6 sm:p-8 relative flex flex-col justify-between space-y-6 shadow-xs">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <span className="font-mono text-xs font-semibold text-primary block">Skin Showcase</span>
              <h1 className="text-3xl sm:text-4xl font-black text-foreground font-sans tracking-tight">{skin.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge className="border-primary/30 bg-primary/10 text-primary font-medium">
                  {skin.rarity}
                </Badge>
                <span className="text-xs text-secondary border border-border rounded px-2 py-0.5">
                  {currentVariant?.name || "Standard"}
                </span>
              </div>
            </div>

            {/* Editorial 2D Weapon Showcase */}
            <div className="relative w-full aspect-[16/9] rounded-lg border border-border/80 bg-gradient-to-b from-surface-elevated/40 to-surface-card flex items-center justify-center p-6 sm:p-10 overflow-hidden group shadow-xs">
              {/* Studio Radial Backdrop */}
              <div className="absolute inset-0 bg-radial from-white/[0.04] to-transparent pointer-events-none" />
              
              {/* Pedestal Shadow */}
              <div className="absolute bottom-8 w-3/4 h-6 bg-black/40 blur-md rounded-full pointer-events-none" />

              {/* High-Resolution Weapon Image */}
              <div className="relative w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]">
                <Image
                  src={(currentVariant as any)?.displayIcon || (skin as any)?.displayIcon || "/images/bundle-eviction.webp"}
                  alt={`${skin.name} - ${currentVariant?.name || "Standard"}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-contain drop-shadow-md select-none"
                />
              </div>

              {/* Subtle Edition / Price Watermark */}
              <div className="absolute bottom-3 right-4 font-mono text-[11px] text-muted tracking-tight pointer-events-none">
                {skin.rarity} · {skin.price} VP
              </div>
            </div>
          </div>

          {/* Variant swatches list */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">Chroma Variants</span>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {skin.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVariant(v.id);
                    if ((v as any).videoUrl) {
                      setSelectedVideoUrl((v as any).videoUrl);
                    } else {
                      setSelectedVideoUrl(null);
                    }
                  }}
                  className={`flex items-center gap-2 rounded-md border p-2.5 text-left transition-all cursor-pointer ${
                    selectedVariant === v.id
                      ? "border-primary bg-primary/10 text-foreground font-semibold"
                      : "border-border bg-surface-muted text-secondary hover:border-border-light hover:text-foreground"
                  }`}
                >
                  <span className="h-3 w-3 rounded-full shrink-0 border border-border" style={{ backgroundColor: v.hex }} />
                  <span className="text-xs truncate">{v.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inspections Video Feed & Details */}
        <div className="rounded-lg border border-border bg-surface-card p-6 sm:p-8 space-y-6 relative flex flex-col justify-between shadow-xs">
          <div className="space-y-6">
            <span className="font-sans text-xs font-semibold text-secondary uppercase tracking-wider block pb-2 border-b border-border">
              Video & Audio Showcase
            </span>

            {/* Video preview selectors */}
            <div className="space-y-4">
              {/* Primary inspect buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedVideoUrl(null);
                    setActiveVideo("inspect");
                    setIsPlayingInline(true);
                  }}
                  className={`px-3 py-1.5 text-xs rounded-md font-medium border transition-all cursor-pointer ${
                    !selectedVideoUrl && activeVideo === "inspect" ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border bg-surface-muted text-secondary hover:text-foreground"
                  }`}
                >
                  Inspect Animation
                </button>
                <button
                  onClick={() => {
                    setSelectedVideoUrl(null);
                    setActiveVideo("reload");
                    setIsPlayingInline(true);
                  }}
                  className={`px-3 py-1.5 text-xs rounded-md font-medium border transition-all cursor-pointer ${
                    !selectedVideoUrl && activeVideo === "reload" ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border bg-surface-muted text-secondary hover:text-foreground"
                  }`}
                >
                  Reload Audio
                </button>
              </div>

              {/* Level Upgrades / VFX Selector */}
              {(skin as any).levels && (skin as any).levels.length > 0 && (
                <div className="space-y-2 border-t border-border pt-3">
                  <span className="text-[11px] text-muted uppercase block tracking-wider font-mono">Upgrade Levels</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(skin as any).levels.map((lvl: any) => (
                      <button
                        key={lvl.uuid}
                        onClick={() => {
                          if (lvl.videoUrl) {
                            setSelectedVideoUrl(lvl.videoUrl);
                            setIsPlayingInline(true);
                          } else {
                            setSelectedVideoUrl(null);
                            setActiveVideo("inspect");
                          }
                        }}
                        disabled={!lvl.videoUrl}
                        className={`px-2 py-1 text-xs rounded font-medium border transition-all cursor-pointer ${
                          selectedVideoUrl === lvl.videoUrl
                            ? "border-primary bg-primary/15 text-primary"
                            : lvl.videoUrl
                            ? "border-border bg-surface-muted text-secondary hover:text-foreground"
                            : "border-border/40 bg-surface-muted/40 text-muted/50 cursor-not-allowed"
                        }`}
                      >
                        {lvl.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loop Video Frame */}
              <div
                data-nosnippet="true"
                className="relative aspect-[16/9] rounded-md border border-border bg-surface-muted overflow-hidden flex items-center justify-center"
              >
                {currentVideoUrl ? (
                  isPlayingInline ? (
                    <>
                      <video
                        key={currentVideoUrl}
                        src={currentVideoUrl}
                        autoPlay
                        loop
                        controls
                        playsInline
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                        <Link
                          href={`/skins/${skin.slug}/watch`}
                          className="rounded bg-background/90 hover:bg-background border border-border text-foreground font-sans font-medium px-2.5 py-1 text-xs transition-all flex items-center gap-1"
                        >
                          Theater Mode ↗
                        </Link>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPlayingInline(false)}
                        className="absolute bottom-2.5 right-2.5 rounded bg-background/90 hover:bg-background border border-border text-secondary hover:text-foreground px-2 py-1 text-xs transition-colors cursor-pointer z-10"
                        title="Close Video Preview"
                      >
                        ✕ Close
                      </button>
                    </>
                  ) : (
                    <div className="group relative w-full h-full flex items-center justify-center bg-surface overflow-hidden">
                      <div className="relative w-3/4 h-3/4 transition-transform duration-500 group-hover:scale-105 pointer-events-none">
                        <Image
                          src={(currentVariant as any)?.displayIcon || (skin as any)?.displayIcon || "/images/bundle-eviction.webp"}
                          alt={skin.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-contain p-4 opacity-75"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none" />

                      <Link
                        href={`/skins/${skin.slug}/watch`}
                        className="absolute top-2.5 right-2.5 rounded bg-background/80 hover:bg-background border border-border text-foreground font-medium px-2.5 py-1 text-xs transition-all flex items-center gap-1 z-10"
                      >
                        Theater Mode ↗
                      </Link>

                      {/* Center Play Button Overlay */}
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsPlayingInline(true)}
                          className="flex items-center gap-2 rounded-md border border-primary bg-primary text-white hover:bg-primary/90 font-sans font-semibold px-4 py-2 text-xs transition-all duration-200 cursor-pointer shadow-md"
                          aria-label={`Play inspect video for ${skin.name}`}
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Play Video Preview</span>
                        </button>
                        <span className="text-xs text-white/80">
                          Audio & Animation
                        </span>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-2">
                    {(currentVariant as any)?.displayIcon && (
                      <div className="relative w-24 h-12 opacity-30 transition-all duration-300">
                        <Image
                          src={(currentVariant as any).displayIcon}
                          alt={skin.name}
                          fill
                          sizes="96px"
                          className="object-contain filter grayscale"
                        />
                      </div>
                    )}
                    <div className="space-y-1 relative z-10">
                      <span className="font-sans text-xs font-semibold text-secondary">
                        No video preview available
                      </span>
                      <p className="text-xs text-muted max-w-[280px] leading-relaxed">
                        This skin uses the base weapon animations and sound effects.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* General metrics */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono border-t border-border pt-4">
              <div>
                <span className="text-xs text-muted block font-medium">Popularity</span>
                <span className="text-foreground font-bold text-base mt-0.5 block">{skin.popularity}%</span>
              </div>
              <div>
                <span className="text-xs text-muted block font-medium">Community Rating</span>
                <span className="text-foreground font-bold text-base mt-0.5 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-amber-400" /> {skin.communityRating} / 5.0
                </span>
              </div>
            </div>
          </div>

          {/* Action triggers */}
          <div className="border-t border-border pt-4 flex justify-between items-center">
            <div>
              <span className="text-xs text-muted block">Store Price</span>
              <span className="text-lg font-bold text-foreground">{skin.price} VP</span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleAddToWishlist}
                className="h-9 w-9 rounded-md border border-border hover:border-primary hover:text-primary transition-all flex items-center justify-center cursor-pointer"
                title="Add to Wishlist"
              >
                <Heart className="h-4 w-4" />
              </button>
              <Link href={`/weapons/${skin.weaponSlug}`}>
                <Button variant="secondary" size="sm" className="rounded-md text-xs font-sans">
                  Weapon Specs
                </Button>
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
