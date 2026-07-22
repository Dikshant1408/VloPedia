/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Award,
  Clock,
  Shield,
  Activity,
  User,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Crosshair,
  HelpCircle,
} from "lucide-react";
import { CompetitiveTier, GameMode } from "../types/valorant";
import { valorantApi } from "../services/api";
import { audio } from "../services/audio";

interface GameModesTabProps {
  accentColor: string;
}

const MODES_DATA = [
  {
    id: "comp",
    title: "COMPETITIVE MODE",
    rules: "First team to 13 rounds wins. Win by 2 rounds in Overtime. Features dynamic team economy, shop buying phases, weapon purchases, and tactical strategic placements.",
    rounds: "First to 13 (OT Win by 2)",
    economy: "STANDARD BUY PHASE (¤800 - ¤9,000 credit cap)",
    matchLen: "30 - 45 min",
    rewards: "RANK RATING (RR) progression, Competitive Gun Buddies",
    color: "text-val-cyan",
  },
  {
    id: "premier",
    title: "PREMIER PRO SYSTEM",
    rules: "Professional team-based competitive system. Register a team of 5-7 players, compete in weekly matches on scheduled maps, and qualify for the playoff tournament.",
    rounds: "First to 13 (OT Win by 1)",
    economy: "STANDARD COMP BUY PHASE",
    matchLen: "35 - 50 min",
    rewards: "Premier crests, player cards, division titles",
    color: "text-val-red",
  },
  {
    id: "swift",
    title: "SWIFTPLAY SYSTEM",
    rules: "A shorter version of the standard Unrated mode. Perfect for quick training, warmups, or testing out new agent setups without committing to a full match.",
    rounds: "First to 5 rounds",
    economy: "SPEED BUY (Start at ¤800, rapid credit gains)",
    matchLen: "12 - 15 min",
    rewards: "Standard account experience (XP)",
    color: "text-val-purple",
  },
  {
    id: "spike",
    title: "SPIKE RUSH MATCH",
    rules: "Fast-paced mode with randomized weapon loadouts for everyone. Multiple tactical power-up orbs spawn around the map (Speed, Health, Golden Gun, Damage multiplier).",
    rounds: "First to 4 rounds",
    economy: "NO BUY PHASE (All attackers hold a Spike)",
    matchLen: "8 - 10 min",
    rewards: "1,000 flat XP reward",
    color: "text-val-orange",
  },
];

export default function GameModesTab({ accentColor }: GameModesTabProps) {
  const [tiers, setTiers] = useState<CompetitiveTier[]>([]);
  const [loading, setLoading] = useState(true);

  // Active sub-section: modes, ranks
  const [activeModesSubTab, setActiveModesSubTab] = useState<string>("modes");

  // Selected mode
  const [selectedMode, setSelectedMode] = useState(MODES_DATA[0]);

  // Selected rank for details
  const [selectedRank, setSelectedRank] = useState<CompetitiveTier | null>(null);

  useEffect(() => {
    async function loadRanks() {
      try {
        const data = await valorantApi.getCompetitiveTiers();
        setTiers(data);
        if (data.length > 0) {
          // Default to Radiant (index last)
          setSelectedRank(data[data.length - 1]);
        }
      } catch (err) {
        console.error("Error loading ranks", err);
      } finally {
        setLoading(false);
      }
    }
    loadRanks();
  }, []);

  const handleModeSelect = (mode: typeof MODES_DATA[0]) => {
    audio.playSelect();
    setSelectedMode(mode);
  };

  const handleRankSelect = (rank: CompetitiveTier) => {
    audio.playClick();
    setSelectedRank(rank);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-val-red border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs tracking-widest text-val-red animate-pulse">
          CONFIGURING MODE SCHEMATICS // API_REQ
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full pb-10">
      {/* GAME MODES TAB NAVIGATION */}
      <div className="flex border-b border-white/[0.05] gap-1 overflow-x-auto">
        {[
          { id: "modes", label: "GAME MODE MANIFESTS", icon: Activity },
          { id: "ranks", label: "RANK PROGRESSION LADDER", icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModesSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                audio.playSelect();
                setActiveModesSubTab(tab.id);
              }}
              className={`px-5 py-3 text-xs font-display font-medium uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-all relative ${
                isActive
                  ? "border-val-red text-val-red bg-val-red/5"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- GAME MODES SUB TAB --- */}
      {activeModesSubTab === "modes" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Modes List (col-span-4) */}
          <div className="lg:col-span-4 space-y-2">
            <span className="font-mono text-[9px] text-gray-500 uppercase block mb-1">
              SELECT GAME SYSTEM:
            </span>
            {MODES_DATA.map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleModeSelect(mode)}
                className={`w-full flex items-center justify-between p-4 rounded text-left border transition-all ${
                  selectedMode.id === mode.id
                    ? "bg-gradient-to-r from-val-red/10 to-transparent border-val-red"
                    : "bg-transparent border-white/[0.03] hover:bg-white/[0.01]"
                }`}
              >
                <div>
                  <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">
                    {mode.title}
                  </h4>
                  <span className="font-mono text-[8px] text-gray-500 uppercase">
                    SYSTEM TIME: {mode.matchLen}
                  </span>
                </div>
                {selectedMode.id === mode.id && <span className="w-1.5 h-1.5 rounded-full bg-val-red" />}
              </button>
            ))}
          </div>

          {/* Mode Rules details (col-span-8) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMode.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-white/[0.01] border border-white/[0.05] p-6 rounded-lg space-y-6"
              >
                <div className="border-b border-white/[0.05] pb-4">
                  <h3 className="font-display font-black text-2xl text-white tracking-wide uppercase leading-none">
                    {selectedMode.title}
                  </h3>
                  <span className="font-mono text-[9px] text-val-cyan font-bold uppercase tracking-widest mt-1.5 block">
                    TACTICAL CLIENT SYSTEM SPEC
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] text-gray-500 block">GAME RULES & DYNAMICS</span>
                    <p className="font-sans text-xs text-gray-300 leading-relaxed font-light">
                      {selectedMode.rules}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[10px] pt-4 border-t border-white/[0.03]">
                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-500 block">MATCH TIMING:</span>
                        <span className="text-white font-bold uppercase">{selectedMode.matchLen}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">WINNING CONDITION:</span>
                        <span className="text-white font-bold uppercase">{selectedMode.rounds}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-gray-500 block">ECONOMY RATING:</span>
                        <span className="text-white font-bold uppercase">{selectedMode.economy}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">COMPLETION BONUS:</span>
                        <span className="text-val-cyan font-bold uppercase">{selectedMode.rewards}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* --- RANK PROGRESSION SUB TAB --- */}
      {activeModesSubTab === "ranks" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Ranks Ladder grid list (col-span-8) */}
          <div className="xl:col-span-8 bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-4">
            <span className="font-mono text-[10px] text-gray-500 uppercase block border-b border-white/[0.05] pb-2">
              COMPETITIVE RANK RADIAL LADDER INDEX ({tiers.length})
            </span>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {tiers.map((rank) => (
                <button
                  key={rank.tier}
                  onClick={() => handleRankSelect(rank)}
                  className={`aspect-square border rounded-lg p-2.5 flex flex-col items-center justify-center gap-1 transition-all group ${
                    selectedRank?.tier === rank.tier
                      ? "bg-val-cyan/10 border-val-cyan"
                      : "bg-white/[0.02] border-white/[0.08] hover:border-white/20"
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    {rank.largeIcon ? (
                      <img
                        src={rank.largeIcon}
                        alt={rank.tierName}
                        className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <HelpCircle className="w-8 h-8 text-white/5" />
                    )}
                  </div>
                  <span className="font-display font-black text-[8px] text-white truncate w-full text-center uppercase" title={rank.tierName}>
                    {rank.tierName}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Rank details scorecard (col-span-4) */}
          <div className="xl:col-span-4">
            <AnimatePresence mode="wait">
              {selectedRank && (
                <motion.div
                  key={selectedRank.tier}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-4"
                >
                  <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-white/[0.05]">
                    <div className="w-20 h-20 bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 flex items-center justify-center shadow-lg">
                      {selectedRank.largeIcon ? (
                        <img
                          src={selectedRank.largeIcon}
                          alt={selectedRank.tierName}
                          className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,245,255,0.3)]"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <HelpCircle className="w-10 h-10 text-white/10" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-display font-black text-lg text-white uppercase tracking-wider">
                        {selectedRank.tierName}
                      </h3>
                      <span className="font-mono text-[9px] text-val-cyan font-bold uppercase">
                        DIVISION: {selectedRank.divisionName.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Competitive telemetry */}
                  <div className="space-y-3 font-mono text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">MMR ACCUMULATION:</span>
                      <span className="text-white font-bold">
                        {selectedRank.tierName.includes("RADIANT")
                          ? "GLOBAL TOP 500 LIMITS"
                          : `${selectedRank.tier * 100} - ${(selectedRank.tier + 1) * 100} MMR`}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">RR RANGE TO UPGRADE:</span>
                      <span className="text-white font-bold">0 - 100 RR POINTS</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">QUEUE CONSTRAINTS:</span>
                      <span className="text-val-cyan font-bold">
                        {selectedRank.tierName.includes("IMMORTAL") || selectedRank.tierName.includes("RADIANT")
                          ? "SOLO / DUO COMS ONLY"
                          : "OPEN TACTICAL PARTY"}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-white/[0.03] text-[9px] text-gray-500">
                      <span>RATING RECOUP ON MATCH:</span>
                      <span className="text-white">+10 to +30 RR (Win) // -10 to -25 RR (Loss)</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
