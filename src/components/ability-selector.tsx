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
};

interface AbilitySelectorProps {
  abilities: ValorantAbility[];
  /** Controlled active slot. If omitted the component manages its own state. */
  activeSlot?: string;
  onChange?: (slot: string) => void;
  className?: string;
}

/**
 * Four-slot ability selector (Q / E / C / X).
 * Shows icon, name, and description of the active ability.
 * Content panel crossfades on slot change (200ms).
 */
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
        className="grid grid-cols-4 gap-2"
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
                "relative flex flex-col items-center gap-2 border p-3 transition-all duration-150",
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] text-muted hover:border-white/20 hover:text-white",
              ].join(" ")}
            >
              {ability.displayIcon ? (
                <Image
                  src={ability.displayIcon}
                  alt={ability.displayName}
                  width={24}
                  height={24}
                  className={isActive ? "opacity-100" : "opacity-50"}
                  unoptimized
                />
              ) : (
                <span className="h-6 w-6 rounded-full border border-current" />
              )}
              <span className="text-[10px] font-black tracking-wider font-mono">
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active ability detail */}
      <div className="relative mt-3 min-h-[120px]">
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.slot}
              id={`ability-panel-${active.slot}`}
              role="tabpanel"
              aria-labelledby={`ability-tab-${active.slot}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] p-5"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary font-mono">
                  {SLOT_LABEL[active.slot] ?? active.slot}
                </span>
                <span className="text-[11px] font-black uppercase tracking-wide text-white">
                  {active.displayName}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted font-sans">
                {active.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
