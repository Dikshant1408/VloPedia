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
    <div className="space-y-10">
      
      {/* Navigation Back */}
      <Link href="/skins">
        <Button variant="secondary" size="sm" className="inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          BACK TO SKINS
        </Button>
      </Link>

      {/* Main Split inspector */}
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] items-stretch">
        
        {/* Color Inspector Canvas */}
        <div className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] p-8 relative flex flex-col justify-between space-y-6">
          <div className="absolute left-0 top-0 h-[2px] w-12 bg-primary" />
          <div className="absolute right-0 top-0 bg-primary-soft border-l border-b border-primary/20 px-3 py-1 text-[9px] text-primary font-black">
            VARIANT CANVAS
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] text-primary font-bold block">{"// MODEL INSPECT"}</span>
              <h1 className="text-4xl font-black text-foreground font-sans uppercase tracking-wider">{skin.name}</h1>
              <div className="flex gap-2 mt-2">
                <Badge className="border-primary/30 bg-primary-soft text-primary">
                  RARITY: {skin.rarity}
                </Badge>
                <span className="text-[10px] text-muted border border-border px-2 py-0.5 uppercase">
                  ACTIVE VARIANT // {currentVariant?.name}
                </span>
              </div>
            </div>

            {/* Weapon Display Container rendering live chroma portrait */}
            <div className="h-56 relative border border-[rgba(236,232,225,0.08)] bg-[#08111A]/40 flex items-center justify-center p-4 overflow-hidden">
              <div className="absolute inset-0 bg-tactical-dots opacity-[0.05]" />
              <div className="relative w-[90%] h-[90%] transition-all duration-300">
                <Image
                  src={(currentVariant as any)?.displayIcon || "/images/bundle-eviction.webp"}
                  alt={skin.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  className="object-contain p-2"
                />
              </div>
            </div>
          </div>

          {/* Variant swatches list */}
          <div className="space-y-3">
            <span className="text-[10px] text-primary font-bold uppercase block">{"// CHANGE CHUE VARIANT"}</span>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
                  className={`flex items-center gap-2 border p-3 text-left transition-all cursor-pointer ${
                    selectedVariant === v.id
                      ? "border-[#FF4655] bg-primary-soft text-white"
                      : "border-[rgba(236,232,225,0.08)] bg-[#08111A]/40 text-muted hover:border-white/25"
                  }`}
                >
                  <span className="h-3 w-3 shrink-0 animate-pulse" style={{ backgroundColor: v.hex }} />
                  <span className="text-[9px] font-bold tracking-wider leading-none">{v.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inspections Video Feed & Details */}
        <div className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] p-8 space-y-6 relative flex flex-col justify-between">
          <div className="space-y-6">
            <span className="font-mono text-xs text-primary font-bold block pb-2 border-b border-border">
              {"// AUDIO VISUAL METRICS"}
            </span>

            {/* Video preview selectors */}
            <div className="space-y-4">
              {/* Primary inspect buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedVideoUrl(null);
                    setActiveVideo("inspect");
                  }}
                  className={`px-3 py-1.5 text-[9px] font-bold border transition-all cursor-pointer ${
                    !selectedVideoUrl && activeVideo === "inspect" ? "border-[#FF4655] bg-primary-soft text-white" : "border-[rgba(236,232,225,0.08)] bg-[#08111A]/40 text-muted"
                  }`}
                >
                  INSPECT ANIMATION
                </button>
                <button
                  onClick={() => {
                    setSelectedVideoUrl(null);
                    setActiveVideo("reload");
                  }}
                  className={`px-3 py-1.5 text-[9px] font-bold border transition-all cursor-pointer ${
                    !selectedVideoUrl && activeVideo === "reload" ? "border-[#FF4655] bg-primary-soft text-white" : "border-[rgba(236,232,225,0.08)] bg-[#08111A]/40 text-muted"
                  }`}
                >
                  RELOAD SOUNDS
                </button>
              </div>

              {/* Level Upgrades / VFX Selector */}
              {(skin as any).levels && (skin as any).levels.length > 0 && (
                <div className="space-y-2 border-t border-border/60 pt-3">
                  <span className="text-[8px] text-muted uppercase block tracking-wider font-mono">{"// LEVEL UPGRADES"}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(skin as any).levels.map((lvl: any) => (
                      <button
                        key={lvl.uuid}
                        onClick={() => {
                          if (lvl.videoUrl) {
                            setSelectedVideoUrl(lvl.videoUrl);
                          } else {
                            setSelectedVideoUrl(null);
                            setActiveVideo("inspect");
                          }
                        }}
                        disabled={!lvl.videoUrl}
                        className={`px-2 py-1 text-[8px] font-bold border transition-all cursor-pointer ${
                          selectedVideoUrl === lvl.videoUrl
                            ? "border-[#FF4655] bg-primary/15 text-primary"
                            : lvl.videoUrl
                            ? "border-[rgba(236,232,225,0.08)] bg-[#08111A]/40 text-muted hover:border-white/20"
                            : "border-[rgba(236,232,225,0.08)] bg-black/10 text-muted/40 cursor-not-allowed"
                        }`}
                      >
                        {lvl.name.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loop Video Frame / Fallback */}
              <div
                className="relative aspect-[16/9] border border-[rgba(236,232,225,0.08)] bg-[#08111A] overflow-hidden flex items-center justify-center"
                data-nosnippet="true"
              >
                {currentVideoUrl ? (
                  <>
                    <video
                      key={currentVideoUrl}
                      src={currentVideoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      data-nosnippet="true"
                      className="w-full h-full object-contain opacity-95"
                    />
                    <div className="absolute top-2 left-2 bg-black/85 border border-border/40 px-2 py-0.5 text-[8px] text-muted font-mono flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      <span>PREVIEW MODE // MP4_LOOP</span>
                    </div>
                    <Link
                      href={`/skins/${skin.slug}/watch`}
                      className="absolute top-2 right-2 bg-primary hover:bg-primary-soft text-black font-mono font-bold px-2.5 py-1 text-[9px] transition-all flex items-center gap-1 z-10 uppercase tracking-wider shadow-md"
                    >
                      Theater Mode ↗
                    </Link>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="absolute inset-0 bg-tactical-dots opacity-[0.03]" />
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
                      <span className="font-mono-tactical text-[10px] font-bold tracking-[0.2em] text-[#FF4655]">
                        NO PREVIEW AVAILABLE
                      </span>
                      <p className="text-[10px] text-muted max-w-[280px] leading-relaxed">
                        This base skin does not include custom animations, sound effects, or visual upgrade components.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* General metrics */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono border-t border-border pt-4">
              <div>
                <span className="text-[10px] text-muted-dark block font-bold">VALORANT POPULARITY</span>
                <span className="text-white font-bold text-lg mt-1 block">{skin.popularity}% POPULAR</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-dark block font-bold">COMMUNITY RATINGS</span>
                <span className="text-primary font-bold text-lg mt-1 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-warning" /> {skin.communityRating} / 5.0
                </span>
              </div>
            </div>
          </div>

          {/* Action triggers */}
          <div className="border-t border-border pt-4 flex justify-between items-center">
            <div>
              <span className="text-[9px] text-muted block">SINGLE SKIN VP</span>
              <span className="text-xl font-bold text-white tracking-widest">{skin.price} VP</span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleAddToWishlist}
                className="h-10 w-10 border border-border hover:border-[#FF4655] hover:text-primary transition-all flex items-center justify-center cursor-pointer"
                title="Add to Wishlist"
              >
                <Heart className="h-4 w-4" />
              </button>
              <Link href={`/weapons/${skin.weaponSlug}`}>
                <Button variant="secondary" className="cut-corner-br">
                  DIAGNOSTIC FRAME
                </Button>
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
