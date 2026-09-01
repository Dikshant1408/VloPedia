"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  desc: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Database",
    items: [
      { label: "Agents",            href: "/agents",       desc: "Every operative, abilities & counter data" },
      { label: "Weapons",           href: "/weapons",      desc: "Full arsenal with damage & falloff stats" },
      { label: "Maps",              href: "/maps",         desc: "Layouts, callouts, and default setups" },
      { label: "Weapon Skins",      href: "/skins",        desc: "Browse chromas, finishers & upgrades" },
      { label: "Skin Bundles",      href: "/bundles",      desc: "Themed bundle packs and pricing" },
      { label: "Flex Items",        href: "/flex",         desc: "Agent expressions, fidgets & inspects" },
      { label: "Buddies & Sprays",  href: "/buddies",      desc: "Gun charms and animated decals" },
      { label: "Player Cards",      href: "/playercards",  desc: "Calling cards & profile banners" },
    ],
  },
  {
    title: "Tactical Tools",
    items: [
      { label: "Tools Hub",         href: "/tools",        desc: "All competitive calculators & builders" },
      { label: "Comp Builder",      href: "/comp-builder", desc: "Evaluate 5-agent team synergy & scores" },
      { label: "Sensitivity Calc",  href: "/sensitivity",  desc: "Convert sens across games & calculate eDPI" },
      { label: "Tactical Compare",  href: "/compare",      desc: "Head-to-head weapon & agent comparisons" },
      { label: "My Setup / Loadout",href: "/setup",        desc: "Build & share your gear and crosshair" },
      { label: "Crosshair Library", href: "/crosshair",    desc: "Pro crosshair codes & generator" },
      { label: "Agent Tier List",   href: "/tier-list",    desc: "Competitive meta tier rankings" },
      { label: "Economy Playbook",  href: "/economy",      desc: "Round buy rules & loss progression" },
      { label: "Agent Matchups",    href: "/matchups",     desc: "Counter picks, duel rates & synergies" },
      { label: "Strat Roulette",    href: "/strat-roulette",desc: "Fun squad challenges and custom rules" },
    ],
  },
  {
    title: "Lore & Guides",
    items: [
      { label: "Lore & Timeline",   href: "/lore",         desc: "Chronological history, factions & canon evidence" },
      { label: "First Light Era",   href: "/lore/first-light", desc: "The cataclysm that rewrote humanity" },
      { label: "Kingdom Corp Dossier", href: "/lore/kingdom", desc: "Global Radianite monopoly & secrets" },
      { label: "Tactical Guides",   href: "/guides",       desc: "In-depth execute & lineup walkthroughs" },
      { label: "Patch History",     href: "/patch-notes",  desc: "Chronological balance buffs & nerfs" },
      { label: "Competitive Ranks", href: "/tiers",        desc: "Rank distributions and badge tiers" },
    ],
  },
  {
    title: "Community & Info",
    items: [
      { label: "Community Hub",     href: "/community",    desc: "Trending lineups, comps & votes" },
      { label: "Submit Feedback",   href: "/feedback",     desc: "Feature requests & balance reports" },
      { label: "About VloPedia",    href: "/about",        desc: "Our mission, data engine & stack" },
      { label: "Contact",           href: "/contact",      desc: "Direct developer inquiries" },
    ],
  },
];

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Full-width mega-menu dropdown.
 * Four columns: Encyclopedia | Cosmetics | Tools | Community.
 * Keyboard accessible — Escape closes, focus trap inside when open.
 */
export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Trap focus inside when open
  useEffect(() => {
    if (!isOpen || !ref.current) return;
    const focusable = ref.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", trap);
    first?.focus();
    return () => document.removeEventListener("keydown", trap);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="mega-backdrop"
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="mega-panel"
            ref={ref}
            role="dialog"
            aria-label="All sections"
            aria-modal="true"
            className="absolute left-0 right-0 top-full z-50 border-b border-border bg-background/95 backdrop-blur-xl"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mx-auto max-w-8xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                {NAV_GROUPS.map((group) => (
                  <div key={group.title}>
                    <h2 className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                      {group.title}
                    </h2>
                    <ul className="space-y-1" role="list">
                      {group.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className="group flex flex-col rounded-none border border-transparent px-3 py-2 transition-colors hover:border-border hover:bg-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                          >
                            <span className="font-sans text-sm font-bold text-white group-hover:text-primary transition-colors">
                              {item.label}
                            </span>
                            <span className="font-sans text-[11px] text-muted">
                              {item.desc}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Close row */}
              <div className="mt-8 flex justify-end border-t border-border pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-muted hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
