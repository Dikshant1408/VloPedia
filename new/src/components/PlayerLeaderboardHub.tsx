/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fetchAgents, Agent } from "../services/valorantService";
import { playSFX } from "../utils/sfx";
import { Search, Trophy, Shield, User, Sparkles, Filter, ExternalLink, Calendar, Heart } from "lucide-react";

interface PlayerLeaderboardHubProps {
  subTab: string;
}

export default function PlayerLeaderboardHub({ subTab }: PlayerLeaderboardHubProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  // Leaderboard region filter
  const [region, setRegion] = useState("NA");
  const [leaderboardSearch, setLeaderboardSearch] = useState("");

  // Player lookup state
  const [lookupName, setLookupName] = useState("TenZ");
  const [lookupTag, setLookupTag] = useState("SEN");
  const [searchedProfile, setSearchedProfile] = useState<any | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    async function loadAgents() {
      try {
        const data = await fetchAgents();
        setAgents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAgents();
  }, []);

  // Preset Player lookup database
  const PLAYERS_DATABASE: { [key: string]: any } = {
    "tenz#sen": {
      name: "TenZ",
      tag: "SEN",
      rank: "RADIANT #04",
      rr: "1,145 RR",
      headshotRate: "28.4%",
      winRate: "62.1%",
      matchesPlayed: "348 Matches",
      signatureAgents: ["Jett", "Yoru", "Omen"],
      avgCombatScore: "264 ACS",
      recentMatches: [
        { map: "ASCENT", outcome: "VICTORY", score: "13 - 8", acs: "312 ACS", kda: "26 / 12 / 6" },
        { map: "BIND", outcome: "VICTORY", score: "13 - 11", acs: "254 ACS", kda: "21 / 15 / 4" },
        { map: "HAVEN", outcome: "DEFEAT", score: "9 - 13", acs: "298 ACS", kda: "24 / 16 / 2" }
      ]
    },
    "shroud#123": {
      name: "Shroud",
      tag: "123",
      rank: "IMMORTAL 3",
      rr: "420 RR",
      headshotRate: "24.2%",
      winRate: "54.8%",
      matchesPlayed: "210 Matches",
      signatureAgents: ["Omen", "Viper", "Sova"],
      avgCombatScore: "218 ACS",
      recentMatches: [
        { map: "SPLIT", outcome: "VICTORY", score: "13 - 4", acs: "232 ACS", kda: "18 / 9 / 11" },
        { map: "ASCENT", outcome: "DEFEAT", score: "11 - 13", acs: "204 ACS", kda: "15 / 17 / 5" }
      ]
    },
    "tarik#sen": {
      name: "Tarik",
      tag: "SEN",
      rank: "RADIANT #42",
      rr: "890 RR",
      headshotRate: "22.8%",
      winRate: "56.4%",
      matchesPlayed: "412 Matches",
      signatureAgents: ["Jett", "Raze", "Breach"],
      avgCombatScore: "238 ACS",
      recentMatches: [
        { map: "SUNSET", outcome: "VICTORY", score: "13 - 9", acs: "245 ACS", kda: "20 / 14 / 8" },
        { map: "LOTUS", outcome: "VICTORY", score: "13 - 6", acs: "284 ACS", kda: "22 / 10 / 4" }
      ]
    }
  };

  const handlePlayerSearch = () => {
    if (!lookupName || !lookupTag) return;
    setSearching(true);
    playSFX.selectSurge();

    setTimeout(() => {
      const key = `${lookupName.trim().toLowerCase()}#${lookupTag.trim().toLowerCase()}`;
      const found = PLAYERS_DATABASE[key];
      if (found) {
        setSearchedProfile(found);
      } else {
        // Generate random realistic stats for non-presets
        const randSeed = lookupName.charCodeAt(0) + lookupTag.charCodeAt(0);
        const win = (45 + (randSeed % 20)).toFixed(1);
        const hs = (18 + (randSeed % 12)).toFixed(1);
        const acs = 180 + (randSeed % 110);
        setSearchedProfile({
          name: lookupName,
          tag: lookupTag,
          rank: randSeed % 2 === 0 ? "IMMORTAL 2" : "DIAMOND 3",
          rr: `${120 + (randSeed % 300)} RR`,
          headshotRate: `${hs}%`,
          winRate: `${win}%`,
          matchesPlayed: `${80 + (randSeed % 200)} Matches`,
          signatureAgents: ["Jett", "Viper"],
          avgCombatScore: `${acs} ACS`,
          recentMatches: [
            { map: "ASCENT", outcome: "VICTORY", score: "13 - 10", acs: `${acs + 10} ACS`, kda: "19 / 14 / 5" },
            { map: "BIND", outcome: "DEFEAT", score: "7 - 13", acs: `${acs - 20} ACS`, kda: "12 / 16 / 4" }
          ]
        });
      }
      setSearching(false);
    }, 800);
  };

  // Preset global leaderboard mock
  const LEADERBOARD_PRESETS: { [key: string]: any[] } = {
    NA: [
      { pos: 1, name: "TenZ", tag: "SEN", rr: "1,145 RR", wins: "182 Wins", main: "Jett" },
      { pos: 2, name: "tarik", tag: "SEN", rr: "1,090 RR", wins: "164 Wins", main: "Raze" },
      { pos: 3, name: "Cryocells", tag: "100T", rr: "1,042 RR", wins: "152 Wins", main: "Jett" },
      { pos: 4, name: "Zellsis", tag: "SEN", rr: "998 RR", wins: "141 Wins", main: "Killjoy" },
      { pos: 5, name: "shroud", tag: "123", rr: "940 RR", wins: "124 Wins", main: "Omen" }
    ],
    EU: [
      { pos: 1, name: "Derke", tag: "FNC", rr: "1,210 RR", wins: "198 Wins", main: "Jett" },
      { pos: 2, name: "Boaster", tag: "FNC", rr: "1,112 RR", wins: "171 Wins", main: "Omen" },
      { pos: 3, name: "Alfajer", tag: "FNC", rr: "1,080 RR", wins: "162 Wins", main: "Killjoy" },
      { pos: 4, name: "Chronicle", tag: "FNC", rr: "1,034 RR", wins: "151 Wins", main: "Breach" }
    ],
    AP: [
      { pos: 1, name: "f0rsakeN", tag: "PRX", rr: "1,190 RR", wins: "185 Wins", main: "Yoru" },
      { pos: 2, name: "something", tag: "PRX", rr: "1,165 RR", wins: "179 Wins", main: "Jett" },
      { pos: 3, name: "d4v41", tag: "PRX", rr: "1,050 RR", wins: "159 Wins", main: "Viper" },
      { pos: 4, name: "mindfreak", tag: "PRX", rr: "982 RR", wins: "142 Wins", main: "Omen" }
    ]
  };

  const activeLeaderboard = LEADERBOARD_PRESETS[region] || LEADERBOARD_PRESETS.NA;

  // 1. PLAYER LOOKUP VIEW
  if (subTab === "player-lookup") {
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
            <span className="w-2 h-2 bg-[#0DF2F2]" />
            Roster Search
          </div>
            <h2 className="font-display font-black text-5xl sm:text-6xl text-[#ECE8E1] tracking-tight uppercase">
              Player Combat Lookup
            </h2>
          <p className="text-white/50 text-base max-w-xl mt-3">
            Inquire tactical player records directly from server-side files. Search custom or preset rosters like <strong>TenZ#SEN</strong>, <strong>Shroud#123</strong>, or <strong>Tarik#SEN</strong>.
          </p>
        </div>

        {/* Input fields */}
            <div className="flex flex-col sm:flex-row gap-5 mb-10 bg-[#0B141A]/90 surface-glass border border-[rgba(236,232,225,0.08)] p-10 clip-diagonal-sm">
          <div className="flex-1">
            <label className="font-mono text-[11px] text-white/40 uppercase block mb-2">Riot ID (Name)</label>
            <input
              type="text"
              value={lookupName}
              onChange={(e) => setLookupName(e.target.value)}
              placeholder="e.g. TenZ"
              className="w-full bg-[#0B141A] border border-[rgba(236,232,225,0.08)] text-white p-3.5 font-mono text-xs focus:outline-none focus:border-[#0DF2F2]/40"
            />
          </div>
          <div className="w-full sm:w-32">
            <label className="font-mono text-[11px] text-white/40 uppercase block mb-2">Tagline</label>
            <input
              type="text"
              value={lookupTag}
              onChange={(e) => setLookupTag(e.target.value)}
              placeholder="e.g. SEN"
              className="w-full bg-[#0B141A] border border-[rgba(236,232,225,0.08)] text-white p-3.5 font-mono text-xs focus:outline-none focus:border-[#0DF2F2]/40 uppercase"
            />
          </div>
          <button
            onClick={handlePlayerSearch}
            disabled={searching}
            onMouseEnter={() => playSFX.hoverClick()}
            className="bg-[#0DF2F2] hover:bg-[#0DF2F2]/90 text-[#0B141A] font-mono text-xs font-bold uppercase px-6 py-3.5 tracking-widest clip-diagonal-sm self-end h-12 flex items-center justify-center min-w-[140px]"
          >
            {searching ? "Looking Up..." : "Lookup User"}
          </button>
        </div>

        {/* Searched profile results details */}
        {searchedProfile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-[rgba(236,232,225,0.08)] bg-[#0B141A]/90 surface-glass p-10 clip-diagonal-sm"
          >
            {/* Upper grid */}
            <div className="flex flex-col md:flex-row justify-between border-b border-[rgba(236,232,225,0.08)] pb-8 mb-8 gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-white/[0.02] border border-[#0DF2F2] rounded-xs flex items-center justify-center font-display font-black text-2xl text-white">
                  {searchedProfile.name[0]}
                </div>
                <div>
                  <h3 className="font-display font-black text-3xl text-white tracking-wider">
                    {searchedProfile.name} <span className="text-white/30 text-lg">#{searchedProfile.tag}</span>
                  </h3>
                  <span className="font-mono text-xs text-[#0DF2F2] uppercase tracking-widest font-bold">
                    {searchedProfile.rank} // {searchedProfile.rr}
                  </span>
                </div>
              </div>

              {/* Stats blocks */}
              <div className="flex flex-wrap gap-5 font-mono text-center">
                <div className="border border-[rgba(236,232,225,0.08)] bg-white/[0.01] p-4 rounded-xs min-w-[110px]">
                  <span className="text-white/40 text-[10px] uppercase block">HEADSHOT %</span>
                  <span className="text-white font-bold text-base">{searchedProfile.headshotRate}</span>
                </div>
                <div className="border border-[rgba(236,232,225,0.08)] bg-white/[0.01] p-4 rounded-xs min-w-[110px]">
                  <span className="text-white/40 text-[10px] uppercase block">WIN RATE</span>
                  <span className="text-white font-bold text-base">{searchedProfile.winRate}</span>
                </div>
                <div className="border border-[rgba(236,232,225,0.08)] bg-white/[0.01] p-4 rounded-xs min-w-[110px]">
                  <span className="text-white/40 text-[10px] uppercase block">COMBAT SCORE</span>
                  <span className="text-[#FA4454] font-black text-base">{searchedProfile.avgCombatScore}</span>
                </div>
              </div>
            </div>

            {/* Signature Agents and Match History */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1 border border-[rgba(236,232,225,0.08)] p-5 rounded-xs">
                <h4 className="font-mono text-xs text-white/40 tracking-wider uppercase mb-5">SIGNATURE AGENTS</h4>
                <div className="space-y-3">
                  {searchedProfile.signatureAgents.map((agentName: string) => {
                    const agent = agents.find((a) => a.displayName.toUpperCase() === agentName.toUpperCase());
                    return (
                      <div key={agentName} className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-3 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          {agent?.displayIconSmall && (
                            <img src={agent.displayIconSmall} alt={agentName} className="w-6 h-6" referrerPolicy="no-referrer" />
                          )}
                          <span className="text-white uppercase font-bold">{agentName}</span>
                        </div>
                        <span className="text-white/40 uppercase">MAIN AGENT</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-2 border border-[rgba(236,232,225,0.08)] p-5 rounded-xs">
                <h4 className="font-mono text-xs text-white/40 tracking-wider uppercase mb-5">RECENT MATCH RESULTS</h4>
                <div className="space-y-4 font-mono text-xs">
                  {searchedProfile.recentMatches.map((m: any, idx: number) => (
                    <div 
                      key={idx} 
                      className={`flex justify-between items-center p-4 border rounded-xs ${
                        m.outcome === "VICTORY" ? "border-[#0DF2F2]/20 bg-[#0DF2F2]/5" : "border-[#FA4454]/20 bg-[#FA4454]/5"
                      }`}
                    >
                      <div>
                        <span className="text-white font-bold uppercase">{m.map}</span>
                        <span className="text-white/40 block text-[11px] mt-1">{m.kda} KDA</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${m.outcome === "VICTORY" ? "text-[#0DF2F2]" : "text-[#FA4454]"}`}>
                          {m.outcome} // {m.score}
                        </span>
                        <span className="text-white/40 block text-[11px] mt-1">{m.acs}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }

  // 2. LEADERBOARD VIEW
  if (subTab === "leaderboard") {
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
              <span className="w-2 h-2 bg-[#FA4454]" />
              Global Sectors
            </div>
            <h2 className="font-display font-black text-5xl sm:text-6xl text-[#ECE8E1] tracking-tight uppercase">
              Tactical Leaderboards
            </h2>
            <p className="text-white/50 text-base max-w-xl mt-3">
              Explore live global rank standings of top-tier players filtered by regional databanks.
            </p>
          </div>

          {/* Region Switch buttons */}
            <div className="flex gap-2 font-mono text-xs border border-[rgba(236,232,225,0.08)] p-1 bg-[#0B141A]">
            {["NA", "EU", "AP"].map((reg) => (
              <button
                key={reg}
                onClick={() => { setRegion(reg); playSFX.tick(); }}
                className={`px-4 py-2 font-bold uppercase transition-all duration-300 clip-diagonal-sm ${
                  region === reg ? "bg-[#FA4454] text-white" : "text-white/40 hover:text-white"
                }`}
              >
                {reg} Region
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table Grid */}
          <div className="border border-[rgba(236,232,225,0.08)] bg-[#0B141A]/90 surface-glass p-10 clip-diagonal-sm overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-white/80 min-w-[600px]">
            <thead>
              <tr className="border-b border-[rgba(236,232,225,0.08)] pb-5 text-white/40 font-bold uppercase">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3">Player</th>
                <th className="py-3">Rating</th>
                <th className="py-3">Wins</th>
                <th className="py-3 px-4">Main</th>
              </tr>
            </thead>
            <tbody>
              {activeLeaderboard.map((player) => (
                <tr key={player.pos} className="border-b border-[rgba(236,232,225,0.08)] hover:bg-white/[0.01] transition-colors">
                  <td className="py-5 px-4 font-black text-[#FA4454]">#0{player.pos}</td>
                  <td className="py-5 font-bold text-white uppercase">
                    {player.name} <span className="text-white/30 text-[10px]">#{player.tag}</span>
                  </td>
                  <td className="py-5 text-[#0DF2F2] font-semibold">{player.rr}</td>
                  <td className="py-5 text-white/60">{player.wins}</td>
                  <td className="py-5 px-4">
                    <span className="border border-[rgba(236,232,225,0.08)] px-2.5 py-1 bg-white/[0.02] uppercase font-bold text-[10px]">
                      {player.main}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  }

  return null;
}
