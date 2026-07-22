/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Search,
  Sliders,
  Crosshair,
  Volume2,
  Cpu,
  FileText,
  Bookmark,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Weapon, WeaponSkin, SkinChroma } from "../types/valorant";
import { valorantApi } from "../services/api";
import { audio } from "../services/audio";
import WeaponInspector3D from "./WeaponInspector3D";

interface WeaponsTabProps {
  initialWeaponId?: string;
  accentColor: string;
}

export default function WeaponsTab({ initialWeaponId, accentColor }: WeaponsTabProps) {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Range slider for damage calculations (0m to 50m)
  const [testRange, setTestRange] = useState<number>(15);

  // Weapon Skin selection
  const [selectedSkin, setSelectedSkin] = useState<WeaponSkin | null>(null);
  const [selectedChroma, setSelectedChroma] = useState<SkinChroma | null>(null);
  const [chromaPreview, setChromaPreview] = useState<string>("");

  const gunRef = useRef<HTMLDivElement | null>(null);
  const [gunTilt, setGunTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    async function loadWeapons() {
      try {
        const data = await valorantApi.getWeapons();
        // Sort weapons by cost so they are organized logically
        const sorted = data.sort((a, b) => (a.shopData?.cost || 0) - (b.shopData?.cost || 0));
        setWeapons(sorted);
        if (sorted.length > 0) {
          if (initialWeaponId) {
            const found = sorted.find((w) => w.uuid === initialWeaponId);
            const initialW = found || sorted[0];
            setSelectedWeapon(initialW);
            initSkinForWeapon(initialW);
          } else {
            setSelectedWeapon(sorted[0]);
            initSkinForWeapon(sorted[0]);
          }
        }
      } catch (err) {
        console.error("Error loading weapons", err);
      } finally {
        setLoading(false);
      }
    }
    loadWeapons();
  }, [initialWeaponId]);

  const initSkinForWeapon = (weapon: Weapon) => {
    // Exclude "Standard" or base skin if we want, or default to first
    if (weapon.skins && weapon.skins.length > 0) {
      const firstNonStandard = weapon.skins.find((s) => !s.displayName.includes("Standard")) || weapon.skins[0];
      setSelectedSkin(firstNonStandard);
      if (firstNonStandard.chromas && firstNonStandard.chromas.length > 0) {
        setSelectedChroma(firstNonStandard.chromas[0]);
        setChromaPreview(firstNonStandard.chromas[0].fullRender || firstNonStandard.chromas[0].displayIcon || weapon.displayIcon);
      } else {
        setSelectedChroma(null);
        setChromaPreview(weapon.displayIcon);
      }
    } else {
      setSelectedSkin(null);
      setSelectedChroma(null);
      setChromaPreview(weapon.displayIcon);
    }
  };

  const handleWeaponSelect = (weapon: Weapon) => {
    audio.playSelect();
    setSelectedWeapon(weapon);
    initSkinForWeapon(weapon);
  };

  const handleSkinSelect = (skin: WeaponSkin) => {
    audio.playClick();
    setSelectedSkin(skin);
    if (skin.chromas && skin.chromas.length > 0) {
      setSelectedChroma(skin.chromas[0]);
      setChromaPreview(skin.chromas[0].fullRender || skin.chromas[0].displayIcon || selectedWeapon?.displayIcon || "");
    } else {
      setSelectedChroma(null);
      setChromaPreview(skin.displayIcon || selectedWeapon?.displayIcon || "");
    }
  };

  const handleChromaSelect = (chroma: SkinChroma) => {
    audio.playClick();
    setSelectedChroma(chroma);
    setChromaPreview(chroma.fullRender || chroma.displayIcon || selectedSkin?.displayIcon || selectedWeapon?.displayIcon || "");
  };

  const handleGunMouseMove = (e: React.MouseEvent) => {
    if (!gunRef.current) return;
    const rect = gunRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // range -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // range -0.5 to 0.5
    setGunTilt({ x, y });
  };

  const handleGunMouseLeave = () => {
    setGunTilt({ x: 0, y: 0 });
  };

  // Get active damage figures based on testRange slider
  const getDamageForRange = () => {
    if (!selectedWeapon || !selectedWeapon.weaponStats?.damageRanges) {
      return { head: 0, body: 0, leg: 0 };
    }

    const ranges = selectedWeapon.weaponStats.damageRanges;
    // Find matching range interval
    const match = ranges.find(
      (r) => testRange >= r.rangeStartMeters && testRange <= r.rangeEndMeters
    ) || ranges[ranges.length - 1]; // or fallback to furthest range

    return {
      head: Math.round(match.headDamage),
      body: Math.round(match.bodyDamage),
      leg: Math.round(match.legDamage),
    };
  };

  // Human clean labels
  const getWallPenLabel = (val: string) => {
    return val.replace("EWallPenetrationDisplayType::", "").toUpperCase();
  };

  const getCleanCategory = (cat: string) => {
    return cat.replace("EWeaponCategory::", "").toUpperCase();
  };

  // Filter lists
  const filteredWeapons = weapons.filter((w) => {
    const matchesSearch = w.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" ||
      w.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
      (w.shopData?.categoryText && w.shopData.categoryText.toLowerCase() === activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-val-cyan border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs tracking-widest text-val-cyan animate-pulse">
          TUNING TACTICAL BALLISTICS // API_REQ
        </span>
      </div>
    );
  }

  const damage = getDamageForRange();
  const rawStats = selectedWeapon?.weaponStats;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start w-full">
      {/* LEFT COLUMN: FILTERS & ARSENAL SCROLL LIST */}
      <div className="xl:col-span-3 space-y-4">
        <div className="bg-white/[0.01] border border-white/[0.05] p-4 rounded-lg space-y-4">
          <div className="font-mono text-[10px] tracking-widest text-gray-400">
            ARSENAL_CLASSES
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Arsenal..."
              className="w-full bg-val-black border border-white/[0.08] rounded py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-val-cyan focus:ring-1 focus:ring-val-cyan text-white"
            />
          </div>

          {/* Category buttons */}
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: "all", label: "ALL" },
              { id: "rifle", label: "RIFLES" },
              { id: "sidearm", label: "SIDEARMS" },
              { id: "smg", label: "SMGS" },
              { id: "shotgun", label: "SHOTGUNS" },
              { id: "sniper", label: "SNIPERS" },
              { id: "heavy", label: "HEAVY" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  audio.playClick();
                  setActiveCategory(cat.id);
                }}
                className={`px-2 py-1.5 text-[9px] font-display font-medium rounded tracking-wider border uppercase transition-all ${
                  activeCategory === cat.id
                    ? "bg-val-cyan/15 border-val-cyan text-white"
                    : "bg-transparent border-white/[0.05] text-gray-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Arsenal selection drawer */}
        <div className="max-h-[500px] xl:max-h-[620px] overflow-y-auto space-y-2 pr-1">
          {filteredWeapons.map((weapon) => (
            <button
              key={weapon.uuid}
              onClick={() => handleWeaponSelect(weapon)}
              className={`w-full flex items-center justify-between p-3.5 rounded text-left transition-all border ${
                selectedWeapon?.uuid === weapon.uuid
                  ? "bg-gradient-to-r from-val-cyan/5 to-transparent border-val-cyan"
                  : "bg-transparent border-white/[0.03] hover:bg-white/[0.01]"
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-14 h-8 bg-white/[0.02] border border-white/[0.05] flex items-center justify-center p-1 rounded shrink-0">
                  <img
                    src={weapon.displayIcon}
                    alt={weapon.displayName}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-display font-bold text-sm tracking-wide text-white truncate">
                    {weapon.displayName}
                  </h4>
                  <div className="flex items-center space-x-2 font-mono text-[9px] text-gray-500">
                    <span>{getCleanCategory(weapon.category)}</span>
                  </div>
                </div>
              </div>

              <div className="font-mono text-xs text-val-cyan text-right pl-2">
                ¤{weapon.shopData?.cost || "FREE"}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CENTRAL COLUMN: ROTATABLE WEAPON INSPECTOR PANEL (col-span-5) */}
      <div className="xl:col-span-5 flex flex-col items-center space-y-6">
        {selectedWeapon && (
          <WeaponInspector3D
            imageUrl={chromaPreview}
            weaponName={selectedSkin?.displayName || selectedWeapon.displayName}
            weaponCategory={selectedWeapon.category}
            accentColor={accentColor}
          />
        )}

        {/* TARGET BALLISTICS SIMULATOR (Range damage, wall penetration) */}
        {rawStats && (
          <div className="w-full bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.05] pb-3">
              <div className="flex items-center space-x-2">
                <Crosshair className="w-4 h-4 text-val-cyan" />
                <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">
                  COMBAT BALLISTICS SIMULATOR
                </h3>
              </div>
              <span className="font-mono text-xs text-val-cyan font-bold">{testRange} METERS</span>
            </div>

            {/* Slider */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max="50"
                value={testRange}
                onChange={(e) => {
                  audio.playHover();
                  setTestRange(Number(e.target.value));
                }}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-val-cyan focus:outline-none"
              />
              <div className="flex justify-between font-mono text-[8px] text-gray-500">
                <span>0M (CLOSE PROXIMITY)</span>
                <span>25M (STANDARD ENGAGEMENT)</span>
                <span>50M (LONG RANGE)</span>
              </div>
            </div>

            {/* Simulated Head, Body, Leg Damage Indicator Graphics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/[0.02] border border-white/[0.05] p-3 rounded text-center">
                <div className="font-mono text-[9px] text-gray-500 mb-0.5 uppercase">HEAD IMPACT</div>
                <div className="font-display font-black text-2xl text-val-red">
                  {damage.head}
                </div>
                <div className="font-mono text-[8px] text-gray-500">
                  {damage.head >= 150 ? "1 BULLET KILL" : "2 BULLETS"}
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.05] p-3 rounded text-center">
                <div className="font-mono text-[9px] text-gray-500 mb-0.5 uppercase">BODY IMPACT</div>
                <div className="font-display font-black text-2xl text-white">
                  {damage.body}
                </div>
                <div className="font-mono text-[8px] text-gray-500">
                  {Math.ceil(150 / (damage.body || 1))} BULLETS
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.05] p-3 rounded text-center">
                <div className="font-mono text-[9px] text-gray-500 mb-0.5 uppercase">LEGS IMPACT</div>
                <div className="font-display font-black text-2xl text-gray-400">
                  {damage.leg}
                </div>
                <div className="font-mono text-[8px] text-gray-500">
                  {Math.ceil(150 / (damage.leg || 1))} BULLETS
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: CORE BALLISTIC SPECS & SKINS TERMINAL (col-span-4) */}
      <div className="xl:col-span-4 space-y-6">
        {selectedWeapon && (
          <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-4">
            <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider border-b border-white/[0.05] pb-3">
              BALLISTIC SPEC SHEET
            </h3>

            {rawStats ? (
              <div className="grid grid-cols-2 gap-4 font-mono text-[10px]">
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500 block">FIRE RATE:</span>
                    <span className="text-white font-bold">{rawStats.fireRate} r/sec</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">MAGAZINE SIZE:</span>
                    <span className="text-white font-bold">{rawStats.magazineSize} rnds</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">RELOAD SPEED:</span>
                    <span className="text-white font-bold">{rawStats.reloadTimeSeconds} sec</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500 block">FIRST SHOT ACC:</span>
                    <span className="text-white font-bold">{(100 - (rawStats.firstShotAccuracy * 10)).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">WALL PENETRATION:</span>
                    <span className="text-val-cyan font-bold">{getWallPenLabel(rawStats.wallPenetration)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">SHOP COST:</span>
                    <span className="text-val-cyan font-bold">¤{selectedWeapon.shopData?.cost || "FREE"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white/[0.02] border border-white/[0.05] text-center rounded font-mono text-xs text-gray-500">
                MELEE COMBAT SPECIFICATIONS // NO FIREARM STATS
              </div>
            )}
          </div>
        )}

        {/* CUSTOM WEAPON SKINS TERMINAL */}
        {selectedWeapon && selectedWeapon.skins && selectedWeapon.skins.length > 0 && (
          <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-4">
            <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider border-b border-white/[0.05] pb-3">
              SKIN & CHROMAS INTEGRATOR
            </h3>

            {/* Skins list select list */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-gray-500 block uppercase">
                AVAILABLE COSMETICS DESIGNS:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {selectedWeapon.skins
                  .filter((skin) => skin.displayIcon && !skin.displayName.includes("Standard"))
                  .slice(0, 15)
                  .map((skin) => (
                    <button
                      key={skin.uuid}
                      onClick={() => handleSkinSelect(skin)}
                      className={`px-3 py-2 border rounded font-display text-[10px] uppercase tracking-wider whitespace-nowrap shrink-0 transition-all ${
                        selectedSkin?.uuid === skin.uuid
                          ? "bg-val-cyan/10 border-val-cyan text-val-cyan"
                          : "bg-white/[0.02] border-white/[0.08] text-gray-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {skin.displayName.replace(selectedWeapon.displayName, "").trim() || "SPECIAL"}
                    </button>
                  ))}
              </div>
            </div>

            {/* Selected Skin details & chroma variants */}
            {selectedSkin && (
              <div className="space-y-4 pt-3 border-t border-white/[0.03]">
                <div className="flex justify-between items-center">
                  <h4 className="font-display font-bold text-xs text-white uppercase">
                    {selectedSkin.displayName}
                  </h4>
                  <span className="font-mono text-[8px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-400">
                    VARIANT SWATCHES
                  </span>
                </div>

                {/* Chromas circles */}
                {selectedSkin.chromas && selectedSkin.chromas.length > 1 && (
                  <div className="flex items-center space-x-2">
                    {selectedSkin.chromas.map((chroma) => (
                      <button
                        key={chroma.uuid}
                        onClick={() => handleChromaSelect(chroma)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center overflow-hidden ${
                          selectedChroma?.uuid === chroma.uuid ? "border-val-cyan scale-105" : "border-white/10"
                        }`}
                        title={chroma.displayName}
                      >
                        {chroma.swatch ? (
                          <img
                            src={chroma.swatch}
                            alt="swatch"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-gray-700 to-gray-500" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Level up specifications / Streamed Videos */}
                {selectedSkin.levels && selectedSkin.levels.length > 0 && (
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] text-gray-500 block uppercase">
                      WEAPON EVOLUTION UPGRADES:
                    </span>
                    <div className="space-y-1.5">
                      {selectedSkin.levels.map((level, idx) => (
                        <div
                          key={level.uuid}
                          className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/[0.05] font-mono text-[9px]"
                        >
                          <div className="text-gray-300">
                            Lvl {idx + 1}: {level.displayName.split(" - ")[1] || "Visual Variant"}
                          </div>
                          {level.streamedVideo ? (
                            <a
                              href={level.streamedVideo}
                              target="_blank"
                              rel="noreferrer"
                              onMouseEnter={() => audio.playHover()}
                              onClick={() => audio.playClick()}
                              className="text-val-cyan flex items-center space-x-1 hover:underline cursor-pointer"
                            >
                              <span>STREAM LOG</span>
                              <ChevronRight className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-gray-500 uppercase">SYS_UNLOCKED</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
