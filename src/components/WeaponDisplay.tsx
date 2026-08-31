"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, Eye } from "lucide-react";
import { valorantDb } from "@/lib/valorant-db";
import WeaponViewer3D from "@/components/WeaponViewer3D";
import { useRef } from "react";

interface WeaponDisplayProps {
  weapon: any;
  weaponSkins: any[];
}

export default function WeaponDisplay({ weapon, weaponSkins }: WeaponDisplayProps) {
  const weaponImageRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-[#0B141A] py-16 text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": weapon.name,
          "description": weapon.description,
          "offers": {
            "@type": "Offer",
            "price": weapon.cost,
            "priceCurrency": "VP"
          }
        }) }}
      />
      
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Navigation Back */}
        <Link href="/weapons">
          <Button variant="secondary" size="sm" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            BACK TO ARMORY
          </Button>
        </Link>

        {/* Hero Split Layout */}
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] items-stretch">
          {/* Weapon display & Recoil info */}
          <div className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] p-8 relative flex flex-col justify-between space-y-6">
            <div className="absolute left-0 top-0 h-[2px] w-12 bg-primary" />
            <div className="absolute right-0 top-0 bg-primary-soft border-l border-b border-primary/20 px-3 py-1 text-[9px] text-primary font-black">
              ARMORY MODEL
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-primary font-bold block">{/* DECRYPTED SPECS */}</span>
                <h1 className="text-5xl font-black text-foreground font-sans uppercase tracking-wider">{weapon.name}</h1>
                <div className="flex gap-2 mt-2">
                  <Badge className="border-primary/30 bg-primary-soft text-primary">
                    CLASS: {weapon.category}
                  </Badge>
                  <span className="text-[10px] text-muted border border-border px-2 py-0.5 uppercase">
                    {/* COST // {weapon.cost} VP */}
                  </span>
                </div>
              </div>

              {/* 3D Weapon Viewer */}
              <div className="h-96 relative border border-border overflow-hidden bg-black/40">
                <WeaponViewer3D 
                  weaponImageUrl={weapon.displayIcon || "/images/skin-operator.webp"} 
                  weaponName={weapon.name}
                  containerRef={weaponImageRef}
                />
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <span className="text-[10px] text-primary font-bold uppercase block">{/* RECOIL BEHAVIOR */}</span>
              <p className="text-xs text-muted font-sans leading-relaxed">
                {weapon.recoil}
              </p>
            </div>

            {/* Add additional recoil and weapon stats for enhanced telemetry */}
            <div className="border-t border-border pt-4 mt-4 space-y-4">
              <span className="font-mono text-xs text-primary font-bold block pb-2 border-b border-border">
                {/* ADVANCED RECOIL ANALYSIS */}
              </span>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-muted uppercase mb-1">FIRST SHOT DRIFT</div>
                    <div className="text-xs font-mono font-bold text-primary">
                      {weapon.recovery && weapon.recovery[0] ? `${weapon.recovery[0].toFixed(2)}°` : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted uppercase mb-1">STEADY STATE OFFSET</div>
                    <div className="text-xs font-mono font-bold text-primary">
                      {weapon.recovery && weapon.recovery[1] ? `${weapon.recovery[1].toFixed(2)}°` : 'N/A'}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted uppercase mb-2">VISUAL RECOIL WAVE</div>
                  <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500"
                      style={{ width: `${weapon.visualRecoil ? Math.min(100, (weapon.visualRecoil / 100) * 100) : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostics Telemetry Panel */}
          <div className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] p-8 space-y-6 relative flex flex-col justify-between">
            <div className="space-y-6">
              {/* STATISTICAL TELEMETRY */}

              {/* Stats progress */}
              <div className="space-y-4 text-[11px]">
                <div className="space-y-1">
                  <div className="flex justify-between text-muted">
                    <span>RATE OF FIRE</span>
                    <span className="text-white font-bold">{weapon.fireRate} RDS/SEC</span>
                  </div>
                  <div className="h-2 bg-black border border-border">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, (weapon.fireRate / 12) * 100)}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-muted">
                    <span>RELOAD SPEED</span>
                    <span className="text-white font-bold">{weapon.reloadSpeed} SEC</span>
                  </div>
                  <div className="h-2 bg-black border border-border">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, (1.2 / weapon.reloadSpeed) * 100)}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-muted">
                    <span>MAGAZINE CAPACITY</span>
                    <span className="text-white font-bold">{weapon.magazineSize} RDS</span>
                  </div>
                  <div className="h-2 bg-black border border-border">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, (weapon.magazineSize / 35) * 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* Damage matrix */}
              <div className="space-y-3">
                <span className="text-[10px] text-muted font-bold block uppercase">DAMAGE PROFILE HP</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="border border-[rgba(236,232,225,0.08)] bg-[#08111A]/40 p-2.5">
                    <span className="text-muted text-[8px] block">HEAD</span>
                    <span className="text-sm font-bold text-white">{weapon.dmgHead}</span>
                  </div>
                  <div className="border border-[rgba(236,232,225,0.08)] bg-[#08111A]/40 p-2.5">
                    <span className="text-muted text-[8px] block">BODY</span>
                    <span className="text-sm font-bold text-white">{weapon.dmgBody}</span>
                  </div>
                  <div className="border border-[rgba(236,232,225,0.08)] bg-[#08111A]/40 p-2.5">
                    <span className="text-muted text-[8px] block">LEG</span>
                    <span className="text-sm font-bold text-white">{weapon.dmgLeg}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed font-sans pt-4 border-t border-border">
              {weapon.description}
            </p>
          </div>
        </div>

        {/* Skins directory listings */}
        <div className="space-y-6">
          <span className="font-mono text-xs text-primary font-bold block pb-2 border-b border-border">
            {/* SKINS DIRECTORY INDEX */}
          </span>

          {weaponSkins.length === 0 ? (
            <div className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] p-6 text-center text-muted text-xs">
              NO CUSTOMIZED SKINS LOADED FOR THIS MODEL
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {weaponSkins.map((skin) => (
                <Card key={skin.slug} className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] hover:border-primary/60 transition-colors p-6 flex flex-col justify-between group h-64">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1.5 items-center">
                        {skin.rarityIcon && (
                          <div className="relative w-3 h-3 flex items-center justify-center">
                            <Image
                              src={skin.rarityIcon}
                              alt={skin.rarity}
                              fill
                              sizes="12px"
                              className="object-contain"
                            />
                          </div>
                        )}
                        <span className="text-[9px] text-muted uppercase tracking-wider font-bold">SKIN // {skin.rarity}</span>
                      </div>
                      <span className="text-xs font-bold text-white">{skin.price} VP</span>
                    </div>

                    <div className="h-24 relative flex items-center justify-center">
                      <Image
                        src={skin.displayIcon || "/images/bundle-eviction.webp"}
                        alt={skin.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-contain group-hover:scale-105 transition-transform duration-300 p-2"
                      />
                    </div>
                  </div>

                  <div className="border-t border-[rgba(236,232,225,0.06)] pt-4 flex items-center justify-between">
                    <h4 className="text-xs font-black text-foreground font-sans uppercase tracking-wider leading-none">
                      {skin.name}
                    </h4>
                    <Link href={`/skins/${skin.slug}`}>
                      <Button variant="secondary" size="sm" className="cut-corner-br">
                        INSPECT
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
