"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { Reveal } from "@/components/motion-system";
import type { ValorantWeapon } from "@/lib/valorant-types";

// Role → preferred weapon categories
const ROLE_CATEGORIES: Record<string, string[]> = {
  Duelist:    ["EEquippableCategory::Rifle", "EEquippableCategory::Sidearm"],
  Controller: ["EEquippableCategory::SMG",   "EEquippableCategory::Rifle"],
  Initiator:  ["EEquippableCategory::Rifle", "EEquippableCategory::Shotgun"],
  Sentinel:   ["EEquippableCategory::Rifle", "EEquippableCategory::Sniper"],
};

interface Props {
  roleName: string;
  agentName: string;
}

export function AgentRelatedWeapons({ roleName, agentName }: Props) {
  const [weapons, setWeapons] = useState<ValorantWeapon[]>([]);

  useEffect(() => {
    const preferred = ROLE_CATEGORIES[roleName] ?? ROLE_CATEGORIES["Duelist"];
    fetch("https://valorant-api.com/v1/weapons")
      .then(r => r.json())
      .then(j => {
        const all: ValorantWeapon[] = j.data ?? [];
        const matched = all
          .filter(w => preferred.includes(w.category) && w.shopData)
          .slice(0, 6);
        setWeapons(matched);
      })
      .catch(() => {});
  }, [roleName]);

  if (weapons.length === 0) return null;

  return (
    <section className="border-t border-border bg-surface/20 py-20">
      <Container>
        <Reveal>
          <div className="mb-10 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-primary" aria-hidden="true" />
            <div>
              <span className="block font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                LOADOUT RECOMMENDATION
              </span>
              <p className="font-sans text-xs text-muted mt-1">
                Weapons suited to {agentName}&apos;s {roleName} playstyle
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {weapons.map(weapon => (
            <Link
              key={weapon.uuid}
              href={`/weapons/${weapon.displayName.toLowerCase().replace(/\s+/g, "-")}`}
              className="group flex items-center gap-4 border border-border bg-surface-card p-4 transition-all duration-300 hover:border-primary/40 hover:bg-primary-softer"
            >
              <div className="relative h-12 w-24 shrink-0">
                <Image
                  src={weapon.displayIcon}
                  alt={weapon.displayName}
                  fill
                  sizes="96px"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <p className="font-display text-base uppercase tracking-wide text-white truncate">
                  {weapon.displayName}
                </p>
                {weapon.shopData && (
                  <p className="font-mono-tactical text-xs text-primary">
                    {weapon.shopData.cost.toLocaleString()} VP
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
