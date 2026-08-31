/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Weapon, WeaponSkin, fetchWeapons } from "../services/valorantService";
import { playSFX } from "../utils/sfx";
import { Crosshair, Award, ShoppingCart, Activity, RefreshCw, Sparkles, HelpCircle } from "lucide-react";
import TiltCard from "./TiltCard";

// Helper function to extract friendly category text
function getCategoryFriendlyName(category: string) {
  if (!category) return "OTHER";
  const parts = category.split("::");
  return parts.length > 1 ? parts[1].toUpperCase() : category.toUpperCase();
}

export default function WeaponMatrix() {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedSkin, setSelectedSkin] = useState<WeaponSkin | null>(null);
  const [selectedChromaIdx, setSelectedChromaIdx] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load Weapons
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const data = await fetchWeapons();
      // Remove duplicates just in case
      const uniqueWeapons = data.filter(
        (w, index, self) => self.findIndex((x) => x.uuid === w.uuid) === index
      );
      setWeapons(uniqueWeapons);
      setIsLoading(false);
    }
    load();
  }, []);

  // Filter categories
  const categories = ["ALL", "RIFLE", "SNIPER", "SMG", "SHOTGUN", "HEAVY", "SIDEARM", "MELEE"];

  const filteredWeapons = weapons.filter((weapon) => {
    if (activeCategory === "ALL") return true;
    const cat = getCategoryFriendlyName(weapon.category);
    return cat.includes(activeCategory);
  });

  const handleCategorySelect = (cat: string) => {
    playSFX.tick();
    setActiveCategory(cat);
  };

  const handleWeaponSelect = (weapon: Weapon) => {
    playSFX.selectSurge();
    setSelectedWeapon(weapon);
    // Auto select first standard or deluxe skin
    const defaultSkin = weapon.skins.find((s) => s.displayName.toLowerCase().includes("standard")) || weapon.skins[0];
    setSelectedSkin(defaultSkin || null);
    setSelectedChromaIdx(0);
  };

  const handleSkinSelect = (skin: WeaponSkin) => {
    playSFX.tick();
    setSelectedSkin(skin);
    setSelectedChromaIdx(0);
  };

  return (
    <div className="w-full min-h-screen pt-4 pb-20 relative">
      <div className="absolute inset-0 pointer-events-none tactical-grid-bg opacity-[0.2]" />

      <AnimatePresence mode="wait">
        {!selectedWeapon ? (
          /* ALL WEAPONS PROCUREMENT VIEW */
          <motion.div
            key="weapons-grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/10 pb-8 mb-12 mt-6">
              <div>
                <span className="flex items-center space-x-2 mb-1">
                  <span className="w-2 h-2 bg-[#FA4454]" />
                  <span className="eyebrow">MILITARY PROCUREMENT</span>
                </span>
                <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight uppercase flex items-center mt-1">
                  THE ARSENAL MATRIX
                  <span className="w-2.5 h-2.5 bg-[#0DF2F2] ml-3 rounded-full animate-pulse" />
                </h1>
                <p className="font-mono text-xs text-white/40 mt-1 max-w-lg leading-relaxed">
                  Decoupled armament specifications registry. Compare fire indices, impact variables, currency loadouts, and custom Radianite chromas.
                </p>
              </div>

              {/* Categorization controls */}
              <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase border transition-all duration-300 clip-diagonal-sm cursor-none interactive-tactical ${
                        isActive
                          ? "bg-[#FA4454] border-[#FA4454] text-white text-glow-red"
                          : "bg-[#0B141A]/60 border-[rgba(236,232,225,0.08)] hover:border-[#0DF2F2] hover:text-[#0DF2F2] text-white/60"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid Layout of Weapons */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-40 space-y-4">
                <div className="relative w-16 h-16 border-2 border-white/5 rounded-full flex items-center justify-center">
                  <div className="absolute inset-0 border-2 border-[#FA4454] border-t-transparent rounded-full animate-spin" />
                  <Crosshair className="w-6 h-6 text-[#FA4454] animate-pulse" />
                </div>
                <span className="font-mono text-xs text-white/40 animate-pulse tracking-widest">
                  Loading weapons...
                </span>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredWeapons.map((weapon) => {
                  const categoryName = getCategoryFriendlyName(weapon.category);
                  const hasStats = !!weapon.weaponStats;
                  const cost = weapon.shopData?.cost || 0;

                  return (
                    <motion.div
                      key={weapon.uuid}
                      layout
                      className="h-64"
                    >
                      <TiltCard
                        onClick={() => handleWeaponSelect(weapon)}
                        className="surface-glass p-6 clip-diagonal-sm relative group cursor-none interactive-tactical flex flex-col justify-between h-full hover:border-[rgba(236,232,225,0.12)]"
                        maxTilt={10}
                      >
                        {/* Hover accent bar */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#FA4454] opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Top metadata row */}
                        <div className="flex items-start justify-between select-none pointer-events-none">
                          <div>
                            <span className="font-mono text-[8px] text-[#0DF2F2] tracking-widest uppercase">
                              {weapon.displayName.toUpperCase().slice(0, 4)}
                            </span>
                          </div>
                        </div>

                        {/* Category corner chip */}
                        <span className="corner-chip">{categoryName}</span>

                        {/* Weapon main vector icon */}
                        <div className="h-28 flex items-center justify-center relative my-4">
                          {weapon.displayIcon ? (
                            <img
                              src={weapon.displayIcon}
                              alt={weapon.displayName}
                              className="max-w-[85%] max-h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Crosshair className="w-12 h-12 text-white/10 animate-pulse" />
                          )}
                        </div>

                        {/* Bottom info row */}
                        <div className="flex items-baseline justify-between border-t border-white/5 pt-3">
                          <h3 className="font-display font-black text-2xl text-white tracking-tight uppercase">
                            {weapon.displayName}
                          </h3>
                          {hasStats && (
                            <div className="flex items-center space-x-2 font-mono text-[9px] text-white/40">
                              <span>MAG: {weapon.weaponStats?.magazineSize}</span>
                              <span>•</span>
                              <span>FIRE: {weapon.weaponStats?.fireRate.toFixed(1)}/s</span>
                            </div>
                          )}
                        </div>

                        {cost > 0 && (
                          <div className="mt-3 flex items-center space-x-1 border border-[#0DF2F2]/20 bg-[#0DF2F2]/5 px-2 py-0.5 rounded-xs w-fit">
                            <span className="font-mono text-[10px] text-[#0DF2F2] font-bold">
                              {cost}¤
                            </span>
                          </div>
                        )}

                        {/* Decor elements */}
                        <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/10 group-hover:border-[#FA4454]/60 transition-colors" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/10 group-hover:border-[#FA4454]/60 transition-colors" />
                      </TiltCard>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* SINGLE WEAPON INSPECTOR DETAIL VIEW */
          <motion.div
            key="weapon-inspector"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
          >
            {/* Nav Header */}
            <div className="flex justify-between items-center py-6 border-b border-white/10 mb-8 mt-4">
              <button
                onClick={() => {
                  playSFX.tick();
                  setSelectedWeapon(null);
                }}
                className="flex items-center space-x-2 px-4 py-2 border border-white/10 bg-[#0B141A]/80 hover:border-[#FA4454] hover:text-[#FA4454] text-white/70 font-mono text-xs tracking-widest uppercase transition-all clip-diagonal-sm cursor-none interactive-tactical"
              >
                <span>RETURN TO ARSENAL</span>
              </button>

              <div className="flex items-center space-x-2 select-none pointer-events-none">
                <span className="w-2 h-2 bg-[#0DF2F2]" />
                <span className="eyebrow">INSPECT MODE // {selectedWeapon.displayName.toUpperCase()}</span>
              </div>
            </div>

            {/* Complex Grid Dashboard layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start min-h-[70vh]">
              {/* Left Side: Stats and Spec Card (Grid 5) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Spec Overview Card */}
                <div className="bg-[#0B141A]/95 border border-white/10 p-6 clip-diagonal relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="eyebrow mb-1">ARMAMENT DATA BLUEPRINT</span>
                      <h2 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tighter uppercase">
                        {selectedWeapon.displayName}
                      </h2>
                      <p className="font-mono text-xs text-white/40 mt-1 uppercase">
                        {getCategoryFriendlyName(selectedWeapon.category)}
                      </p>
                    </div>

                    {selectedWeapon.shopData?.cost && (
                      <div className="bg-[#0DF2F2]/10 border border-[#0DF2F2]/30 px-3 py-1 text-right">
                        <span className="font-mono text-xs text-white/30 block tracking-widest uppercase">SHOP LOAD</span>
                        <span className="font-mono text-xl font-bold text-[#0DF2F2]">{selectedWeapon.shopData.cost}¤</span>
                      </div>
                    )}
                  </div>

                  {/* Specifications progress meters */}
                  {selectedWeapon.weaponStats ? (
                    <div className="mt-8 space-y-4 border-t border-white/5 pt-6">
                      <h4 className="font-mono text-[10px] text-[#0DF2F2] tracking-widest font-bold uppercase">
                        PERFORMANCE VARIABLES
                      </h4>

                      {/* Fire Rate Meter */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-white/60">FIRE INDEX (RATE)</span>
                          <span className="text-white font-bold">{selectedWeapon.weaponStats.fireRate.toFixed(1)} rps</span>
                        </div>
                        <div className="h-1.5 bg-white/5 border border-white/10 rounded-xs overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((selectedWeapon.weaponStats.fireRate / 16) * 100, 100)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-[#FA4454]"
                          />
                        </div>
                      </div>

                      {/* Magazine Size Meter */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-white/60">MAGAZINE LOAD</span>
                          <span className="text-white font-bold">{selectedWeapon.weaponStats.magazineSize} rounds</span>
                        </div>
                        <div className="h-1.5 bg-white/5 border border-white/10 rounded-xs overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((selectedWeapon.weaponStats.magazineSize / 100) * 100, 100)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-[#0DF2F2]"
                          />
                        </div>
                      </div>

                      {/* First Bullet Accuracy */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-white/60">FIRST BULLET ACCURACY</span>
                          <span className="text-white font-bold">{(100 - selectedWeapon.weaponStats.firstBulletAccuracy * 100).toFixed(0)}% deviation</span>
                        </div>
                        <div className="h-1.5 bg-white/5 border border-white/10 rounded-xs overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(selectedWeapon.weaponStats.firstBulletAccuracy) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-white/40"
                          />
                        </div>
                      </div>

                      {/* Reload Time */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-white/60">CHAMBER RELOAD SPEED</span>
                          <span className="text-white font-bold">{selectedWeapon.weaponStats.reloadTimeSeconds.toFixed(1)}s</span>
                        </div>
                        <div className="h-1.5 bg-white/5 border border-white/10 rounded-xs overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(100 - (selectedWeapon.weaponStats.reloadTimeSeconds / 5) * 100, 10)}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-[#FA4454]/65"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-8 border-t border-white/5 pt-6 text-center py-6">
                      <span className="font-mono text-xs text-white/30">NO INTEGRATED MECHANICAL METRICS (MELEE)</span>
                    </div>
                  )}
                </div>

                {/* Skin Roster Selection Card */}
                <div className="bg-[#0B141A]/95 border border-white/10 p-6 clip-diagonal space-y-4">
                  <span className="font-mono text-[10px] text-white/40 tracking-widest font-bold block">
                    RADIANITE DESIGN SKINS ROSTER
                  </span>

                  {/* Scrolling skins panel */}
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                    {selectedWeapon.skins
                      .filter((s) => s.displayIcon !== null) // Filter out skins with missing graphics
                      .map((skin) => {
                        const isSelected = selectedSkin?.uuid === skin.uuid;
                        return (
                          <button
                            key={skin.uuid}
                            onClick={() => handleSkinSelect(skin)}
                            className={`p-2.5 border text-left transition-all relative rounded-xs text-xs font-mono flex flex-col justify-between h-20 overflow-hidden cursor-none interactive-tactical ${
                              isSelected
                                ? "border-[#FA4454] bg-[#FA4454]/5 text-white"
                                : "border-white/10 bg-white/[0.01] hover:border-[#0DF2F2]/60 text-white/50"
                            }`}
                          >
                            <span className="text-[10px] leading-tight line-clamp-1 select-none pointer-events-none uppercase">
                              {skin.displayName.replace(selectedWeapon.displayName, "").trim() || "STANDARD"}
                            </span>

                            <div className="h-8 flex items-end justify-center mt-1 pointer-events-none">
                              {skin.displayIcon && (
                                <img
                                  src={skin.displayIcon}
                                  alt={skin.displayName}
                                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                                  referrerPolicy="no-referrer"
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Right Side: Render/Blueprint Canvas & Chromas (Grid 7) */}
              <div className="lg:col-span-7 flex flex-col justify-center items-center relative min-h-[500px] lg:min-h-[550px] bg-[#0B141A]/40 border border-white/5 p-8 clip-diagonal">
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none bg-[radial-gradient(ellipse_at_center,rgba(250,68,84,0.1)_0%,rgba(11,20,26,0.9)_80%)]" />

                {/* Big decorative stroked weapon text in background */}
                <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none -z-10">
                  <span className="font-display font-black text-[9vw] tracking-tighter uppercase custom-text-stroke leading-none select-none opacity-20">
                    {selectedWeapon.displayName}
                  </span>
                </div>

                {/* Main inspect weapon render display */}
                <div className="relative w-full h-56 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedSkin?.uuid || selectedChromaIdx}
                      initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      {selectedSkin?.chromas?.[selectedChromaIdx]?.fullRender ||
                      selectedSkin?.chromas?.[selectedChromaIdx]?.displayIcon ||
                      selectedSkin?.displayIcon ? (
                        <img
                          src={
                            selectedSkin.chromas?.[selectedChromaIdx]?.fullRender ||
                            selectedSkin.chromas?.[selectedChromaIdx]?.displayIcon ||
                            selectedSkin.displayIcon ||
                            ""
                          }
                          alt={selectedSkin.displayName}
                          referrerPolicy="no-referrer"
                          className="max-w-[90%] max-h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]"
                        />
                      ) : (
                        <Crosshair className="w-16 h-16 text-white/20 animate-spin" />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Corner branding */}
                  <div className="absolute top-2 left-2 flex flex-col space-y-0.5">
                    <span className="font-mono text-[10px] text-white/80 tracking-tight font-bold uppercase">{selectedSkin?.displayName}</span>
                  </div>
                </div>

                {/* Chromas Color Swatch picker if they exist */}
                {selectedSkin && selectedSkin.chromas && selectedSkin.chromas.length > 1 && (
                  <div className="mt-8 border-t border-white/5 pt-6 w-full flex flex-col items-center space-y-3">
                    <div className="flex items-center space-x-3">
                      {selectedSkin.chromas.map((chroma, idx) => {
                        const isSelected = selectedChromaIdx === idx;
                        return (
                          <button
                            key={chroma.uuid}
                            onClick={() => {
                              playSFX.tick();
                              setSelectedChromaIdx(idx);
                            }}
                            className={`w-10 h-10 border rounded-full transition-all flex items-center justify-center overflow-hidden cursor-none interactive-tactical relative ${
                              isSelected
                                ? "border-[#FA4454] scale-110 ring-2 ring-[#FA4454]/20"
                                : "border-white/10 hover:border-[#0DF2F2]"
                            }`}
                          >
                            {chroma.swatch ? (
                              <img
                                src={chroma.swatch}
                                alt={chroma.displayName}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : chroma.displayIcon ? (
                              <img
                                src={chroma.displayIcon}
                                alt={chroma.displayName}
                                className="w-6 h-6 object-contain rotate-45"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-tr from-black via-zinc-800 to-zinc-600 flex items-center justify-center font-mono text-[8px] font-bold text-white">
                                {idx}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <span className="font-mono text-[10px] text-white/40 tracking-tight uppercase">
                      {selectedSkin.chromas[selectedChromaIdx]?.displayName || "STANDARD CHROMA"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
