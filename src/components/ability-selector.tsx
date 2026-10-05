"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { ValorantAbility } from "@/lib/valorant-types";

// Map API slot names to familiar key labels
const SLOT_LABEL: Record<string, string> = {
  Ability1: "Q",
  Ability2: "E",
  Grenade:  "C",
  Ultimate: "X",
  Passive:  "PASSIVE",
};

const SLOT_TYPE: Record<string, string> = {
  Ability1: "Basic Ability",
  Ability2: "Signature Ability",
  Grenade:  "Basic Ability",
  Ultimate: "Ultimate Ability",
  Passive:  "Innate Passive",
};

interface AbilitySelectorProps {
  abilities: ValorantAbility[];
  /** Controlled active slot. If omitted the component manages its own state. */
  activeSlot?: string;
  onChange?: (slot: string) => void;
  className?: string;
}

export function AbilitySelector({
  abilities,
  activeSlot: controlledSlot,
  onChange,
  className,
}: AbilitySelectorProps) {
  const [internalSlot, setInternalSlot] = useState<string>(
    abilities[0]?.slot ?? "Ability1"
  );
  const activeSlot = controlledSlot ?? internalSlot;

  const handleSelect = (slot: string) => {
    setInternalSlot(slot);
    onChange?.(slot);
  };

  const active = abilities.find((a) => a.slot === activeSlot) ?? abilities[0];

  return (
    <div className={className}>
      {/* Slot buttons */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2"
        role="tablist"
        aria-label="Agent abilities"
      >
        {abilities.map((ability) => {
          const label = SLOT_LABEL[ability.slot] ?? ability.slot;
          const isActive = ability.slot === activeSlot;
          return (
            <button
              key={ability.slot}
              role="tab"
              aria-selected={isActive}
              aria-controls={`ability-panel-${ability.slot}`}
              id={`ability-tab-${ability.slot}`}
              type="button"
              onClick={() => handleSelect(ability.slot)}
              className={[
                "relative flex flex-col items-center gap-2 border p-3.5 transition-all duration-200 cursor-pointer clip-diagonal-sm text-left",
                isActive
                  ? "border-primary bg-primary/10 text-white shadow-md"
                  : "border-border bg-surface text-muted hover:border-border-light hover:text-white hover:bg-surface-elevated",
              ].join(" ")}
            >
              {/* Tactical active indicator line */}
              {isActive && (
                <span className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
              )}
              {ability.displayIcon ? (
                <Image
                  src={ability.displayIcon}
                  alt={ability.displayName}
                  width={28}
                  height={28}
                  className={`transition-all duration-200 ${isActive ? "opacity-100 scale-105 filter drop-shadow-[0_0_8px_rgba(255,70,85,0.4)]" : "opacity-60"}`}
                  unoptimized
                />
              ) : (
                <span className="h-7 w-7 rounded-sm border border-current flex items-center justify-center font-mono text-[10px]">
                  {label[0]}
                </span>
              )}
              <div className="text-center">
                <span className={`block text-[11px] font-mono font-bold tracking-widest ${isActive ? "text-primary" : "text-muted"}`}>
                  [{label}]
                </span>
                <span className="block text-[10px] font-sans font-semibold truncate max-w-[85px] mt-0.5 text-secondary">
                  {ability.displayName}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active ability detail */}
      <div className="relative mt-3 min-h-[140px]">
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.slot}
              id={`ability-panel-${active.slot}`}
              role="tabpanel"
              aria-labelledby={`ability-tab-${active.slot}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="border border-border bg-surface p-6 clip-diagonal relative"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-border/60 pb-3">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-primary/10 border border-primary/40 text-primary font-mono text-xs font-bold uppercase tracking-wider">
                    KEY [{SLOT_LABEL[active.slot] ?? active.slot}]
                  </span>
                  <h4 className="text-lg font-display font-black uppercase tracking-wide text-white">
                    {active.displayName}
                  </h4>
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#0DF2F2]">
                  {SLOT_TYPE[active.slot] ?? "Operative Ability"}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-secondary font-sans max-w-3xl">
                {active.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
