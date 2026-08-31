"use client";

import { useRef } from "react";
import { Container } from "@/components/container";
import { WeaponCard } from "@/components/weapon-card";
import { PageTransition } from "@/components/motion-system";
import type { ValorantWeapon } from "@/lib/valorant-types";

const CATEGORY_ORDER = [
  { key: "EEquippableCategory::Sidearm",     label: "Sidearms"     },
  { key: "EEquippableCategory::SMG",         label: "SMGs"         },
  { key: "EEquippableCategory::Shotgun",     label: "Shotguns"     },
  { key: "EEquippableCategory::Rifle",       label: "Rifles"       },
  { key: "EEquippableCategory::Sniper",      label: "Snipers"      },
  { key: "EEquippableCategory::Heavy",       label: "Machine Guns" },
  { key: "EEquippableCategory::Melee",       label: "Melee"        },
];

interface WeaponsClientProps {
  initialWeapons: ValorantWeapon[];
}

export function WeaponsClient({ initialWeapons }: WeaponsClientProps) {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const scrollTo = (key: string) => {
    sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Group by category
  const grouped: Record<string, ValorantWeapon[]> = {};
  for (const cat of CATEGORY_ORDER) grouped[cat.key] = [];
  for (const w of initialWeapons) {
    if (grouped[w.category] !== undefined) grouped[w.category].push(w);
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        {/* Page header */}
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">ARMORY MATRIX</span>
            </div>
            <h1 className="font-display font-black text-6xl uppercase tracking-tighter text-foreground sm:text-7xl lg:text-8xl flex items-center gap-4">
              WEAPONS
              <span className="w-2.5 h-2.5 bg-[#0DF2F2] rounded-full animate-pulse hidden sm:block" aria-hidden="true" />
            </h1>
            <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-muted">
              Every weapon in the arsenal — full stats, 3D inspection, and all available skins.
            </p>

            {/* Category quick-links */}
            <nav className="mt-8 flex flex-wrap gap-2" aria-label="Jump to weapon category">
              {CATEGORY_ORDER.map(cat => (
                grouped[cat.key]?.length > 0 && (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => scrollTo(cat.key)}
                    className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-muted transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  >
                    {cat.label}
                  </button>
                )
              ))}
            </nav>
          </Container>
        </div>

        {/* Category sections */}
        <div className="py-16 space-y-20">
          {CATEGORY_ORDER.map(cat => {
            const catWeapons = grouped[cat.key] ?? [];
            if (catWeapons.length === 0) return null;
            return (
              <section
                key={cat.key}
                ref={el => { sectionRefs.current[cat.key] = el; }}
                aria-label={cat.label}
              >
                <Container>
                  {/* Category header */}
                  <div className="mb-6 flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <span className="h-[2px] w-6 bg-primary" aria-hidden="true" />
                      <h2 className="font-display text-3xl uppercase tracking-wide text-white">
                        {cat.label}
                      </h2>
                    </div>
                    <div className="h-px flex-1 bg-border" aria-hidden="true" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
                      {catWeapons.length} weapon{catWeapons.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Horizontal weapon cards */}
                  <div className="space-y-3">
                    {catWeapons.map(weapon => (
                      <WeaponCard key={weapon.uuid} weapon={weapon} view="horizontal" />
                    ))}
                  </div>
                </Container>
              </section>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
