/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { playSFX } from "../utils/sfx";
import { Trophy, Calendar, ExternalLink, Play, Search, Settings, Shield, Tv, Sparkles } from "lucide-react";

interface EsportsHubProps {
  subTab: string;
}

export default function EsportsHub({ subTab }: EsportsHubProps) {
  // 1. Live Scores State
  const proMatches = [
    {
      id: 1,
      tournament: "VCT AMERICAS STAGE 2",
      status: "LIVE - MAP 2 IN PROGRESS",
      teamA: "SENTINELS",
      teamB: "100 THIEVES",
      scoreA: 1,
      scoreB: 0,
      mapScores: ["Map 1 (Ascent): SEN 13 - 10 100T", "Map 2 (Bind): SEN 8 - 9 100T"],
      color: "#FA4454"
    },
    {
      id: 2,
      tournament: "VCT EMEA STAGE 2",
      status: "UPCOMING - 18:30 UTC",
      teamA: "FNATIC",
      teamB: "NATIVE NAVI",
      scoreA: 0,
      scoreB: 0,
      mapScores: [],
      color: "#0DF2F2"
    },
    {
      id: 3,
      tournament: "VCT PACIFIC STAGE 2",
      status: "COMPLETED",
      teamA: "PAPER REX",
      teamB: "T1 ESPORTS",
      scoreA: 2,
      scoreB: 0,
      mapScores: ["Map 1 (Sunset): PRX 13 - 6 T1", "Map 2 (Lotus): PRX 13 - 11 T1"],
      color: "#ECE8E1"
    }
  ];

  // 2. Pro Players State
  const proPlayers = [
    { name: "TenZ", team: "SENTINELS", role: "Duelist / Controller", dpi: 800, sens: 0.3, edpi: 240, crosshair: "0;s;1;P;c;5;h;0;m;1;0t;1;0l;2;0o;2;0a;1", mouse: "Lamzu Atlantis Mini", keyboard: "Wooting 60HE", monitor: "360Hz ROG" },
    { name: "Chronicle", team: "FNATIC", role: "Flex Initiator", dpi: 800, sens: 0.23, edpi: 184, crosshair: "0;P;c;5;h;0;m;1;0t;1;0l;3;0o;2;0a;1", mouse: "G Pro X Superlight 2", keyboard: "Wooting 60HE", monitor: "360Hz Zowie" },
    { name: "Aspas", team: "LEVIATÁN", role: "Duelist", dpi: 800, sens: 0.4, edpi: 320, crosshair: "0;P;c;5;o;1;d;1;z;1;f;0;0t;1;0l;1;0o;1;0a;1", mouse: "Zowie EC2-CW", keyboard: "SteelSeries Apex Pro", monitor: "540Hz ROG" },
    { name: "Boaster", team: "FNATIC", role: "IGL Controller", dpi: 800, sens: 0.25, edpi: 200, crosshair: "0;s;1;P;c;1;o;1;d;1;0b;0;1b;0", mouse: "G Pro X Superlight 2", keyboard: "Wooting 60HE", monitor: "360Hz ROG" }
  ];

  const [proSearchQuery, setProSearchQuery] = useState("");

  const filteredProPlayers = proPlayers.filter((player) =>
    player.name.toLowerCase().includes(proSearchQuery.toLowerCase()) ||
    player.team.toLowerCase().includes(proSearchQuery.toLowerCase())
  );

  // 1. LIVE SCORES VIEW
  if (subTab === "scores") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
      >
        <div className="mb-14">
          <div className="eyebrow mb-3">
            <span className="w-2 h-2 bg-[#FA4454]" />
            Live Transponders
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-[#ECE8E1] tracking-tight uppercase">
            VCT Live Match Matrix
          </h2>
          <p className="text-white/50 text-base max-w-xl mt-3">
            Track real-time tournament standings, match points, and map-by-map scores from official Valorant Champions Tour brackets.
          </p>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {proMatches.map((match) => (
            <div
              key={match.id}
              className="bg-[#0B141A]/90 surface-glass border border-[rgba(236,232,225,0.08)] p-8 clip-diagonal-sm relative hover:border-[#FA4454]/40 hover:bg-[#FA4454]/5 transition-all flex flex-col justify-between group"
            >
              <span className="corner-chip">{match.status}</span>
              <div className="absolute top-0 left-0 w-1 h-full bg-[#FA4454] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <span className="font-mono text-xs text-white/40 tracking-wider block mb-5 uppercase">
                  {match.tournament}
                </span>

                <div className="flex justify-between items-center my-8">
                  <div className="text-left">
                    <h3 className="font-display font-black text-2xl text-white tracking-widest">{match.teamA}</h3>
                    <span className="font-mono text-[10px] text-[#0DF2F2]">Seeded</span>
                  </div>
                  <div className="flex items-center gap-4 text-center bg-white/[0.02] border border-[rgba(236,232,225,0.08)] px-5 py-2.5 clip-diagonal-sm">
                    <span className="font-display font-black text-3xl text-[#FA4454]">{match.scoreA}</span>
                    <span className="font-mono text-xs text-white/20">VS</span>
                    <span className="font-display font-black text-3xl text-[#0DF2F2]">{match.scoreB}</span>
                  </div>
                  <div className="text-right">
                    <h3 className="font-display font-black text-2xl text-white tracking-widest">{match.teamB}</h3>
                    <span className="font-mono text-[10px] text-white/40">Challenger</span>
                  </div>
                </div>

                {/* Map details */}
                {match.mapScores.length > 0 && (
                  <div className="border-t border-[rgba(236,232,225,0.08)] pt-5 space-y-2">
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest block mb-3">Map Details</span>
                    {match.mapScores.map((score, sIdx) => (
                      <div key={sIdx} className="font-mono text-xs text-white/70 border-b border-[rgba(236,232,225,0.08)] pb-2">
                        {score}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // 2. PRO PLAYERS CONFIGS
  if (subTab === "pro-players") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
      >
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
          <div className="eyebrow mb-3">
            <span className="w-2 h-2 bg-[#0DF2F2]" />
            Tactical Profile Refs
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-[#ECE8E1] tracking-tight uppercase">
            Pro Player Hardware Configs
          </h2>
            <p className="text-white/50 text-base max-w-xl mt-3">
              Explore peripheral setups, DPI multipliers, sensitivity scores, and crosshair codes of elite VCT championship contenders.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={proSearchQuery}
              onChange={(e) => setProSearchQuery(e.target.value)}
              placeholder="Search squad (e.g. TenZ, Fnatic)..."
              className="w-full bg-[#0B141A]/90 border border-[rgba(236,232,225,0.08)] rounded-none p-3 pl-10 font-mono text-xs text-white uppercase tracking-widest focus:outline-none focus:border-[#0DF2F2]/40"
            />
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProPlayers.map((player) => (
            <div
              key={player.name}
              className="bg-[#0B141A]/90 surface-glass border border-[rgba(236,232,225,0.08)] p-8 clip-diagonal-sm hover:border-[#0DF2F2]/40 hover:bg-[#0DF2F2]/5 transition-colors group relative"
            >
              <span className="absolute top-0 left-0 w-1 h-full bg-[#0DF2F2] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-center mb-5 border-b border-[rgba(236,232,225,0.08)] pb-4">
                <div>
                  <h3 className="font-display font-black text-2xl text-white tracking-widest uppercase">
                    {player.name}
                  </h3>
                  <span className="font-mono text-xs text-[#FA4454] font-bold uppercase">{player.team} // {player.role}</span>
                </div>
                <span className="font-mono text-[10px] border border-[#0DF2F2]/30 px-2 py-0.5 text-[#0DF2F2] uppercase">
                  Active Ref
                </span>
              </div>

              {/* Hardware & Settings Parameters Grid */}
              <div className="grid grid-cols-2 gap-5 font-mono text-xs text-white/70">
                <div className="border-b border-[rgba(236,232,225,0.08)] pb-2">
                  <span className="text-white/30 block uppercase text-[10px]">Mouse DPI</span>
                  <span className="text-white font-bold">{player.dpi} DPI</span>
                </div>
                <div className="border-b border-[rgba(236,232,225,0.08)] pb-2">
                  <span className="text-white/30 block uppercase text-[10px]">In-Game Sens</span>
                  <span className="text-white font-bold">{player.sens}</span>
                </div>
                <div className="border-b border-[rgba(236,232,225,0.08)] pb-2">
                  <span className="text-white/30 block uppercase text-[10px]">Total eDPI</span>
                  <span className="text-[#0DF2F2] font-bold">{player.edpi}</span>
                </div>
                <div className="border-b border-[rgba(236,232,225,0.08)] pb-2">
                  <span className="text-white/30 block uppercase text-[10px]">Display Device</span>
                  <span className="text-white font-bold">{player.monitor}</span>
                </div>
              </div>

              {/* Gear descriptions */}
              <div className="mt-5 grid grid-cols-2 gap-5 font-mono text-xs text-white/50 border-t border-[rgba(236,232,225,0.08)] pt-4">
                <div>
                  <span className="text-white/30 block text-[9px] uppercase">Mouse</span>
                  <span className="text-white uppercase text-[11px]">{player.mouse}</span>
                </div>
                <div>
                  <span className="text-white/30 block text-[9px] uppercase">Keyboard</span>
                  <span className="text-white uppercase text-[11px]">{player.keyboard}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return null;
}
