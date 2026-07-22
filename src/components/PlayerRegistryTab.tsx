/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Award,
  Shield,
  Activity,
  User,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Crosshair,
  Trophy,
} from "lucide-react";
import { ValorantMap } from "../types/valorant";
import { valorantApi } from "../services/api";
import { audio } from "../services/audio";

interface PlayerRegistryTabProps {
  accentColor: string;
}

// Preset leaderboards data
const LEADERBOARD_PRESETS = [
  { rank: 1, name: "Sentinels TenZ", tag: "NA1", rating: 1245, acs: 268, hs: 29.4, agent: "Jett", region: "NA" },
  { rank: 2, name: "Fnatic Boaster", tag: "EU1", rating: 1192, acs: 215, hs: 22.1, agent: "Omen", region: "EU" },
  { rank: 3, name: "PRX Something", tag: "SG1", rating: 1184, acs: 285, hs: 26.5, agent: "Reyna", region: "AP" },
  { rank: 4, name: "Yay", tag: "DIABLO", rating: 1142, acs: 252, hs: 32.1, agent: "Chamber", region: "NA" },
  { rank: 5, name: "LOUD Aspas", tag: "BR1", rating: 1135, acs: 271, hs: 28.2, agent: "Jett", region: "BR" },
  { rank: 6, name: "EDG Kangkang", tag: "CN1", rating: 1121, acs: 292, hs: 24.8, agent: "Jett", region: "AP" },
  { rank: 7, name: "ScreaM", tag: "ONETAP", rating: 1095, acs: 248, hs: 34.6, agent: "Phoenix", region: "EU" },
  { rank: 8, name: "Derke", tag: "FNC", rating: 1084, acs: 259, hs: 25.4, agent: "Raze", region: "EU" },
];

export default function PlayerRegistryTab({ accentColor }: PlayerRegistryTabProps) {
  const [maps, setMaps] = useState<ValorantMap[]>([]);
  const [loading, setLoading] = useState(true);

  // Active sub-view: leaderboard, career-search
  const [activeRegTab, setActiveRegTab] = useState<string>("leaderboard");

  // Leaderboard filters
  const [activeRegion, setActiveRegion] = useState<string>("all");
  const [leaderboardSearch, setLeaderboardSearch] = useState("");

  // Career search state
  const [careerQuery, setCareerQuery] = useState("");
  const [searchedProfile, setSearchedProfile] = useState<any | null>(null);

  useEffect(() => {
    async function loadMaps() {
      try {
        const data = await valorantApi.getMaps();
        setMaps(data.filter((m) => m.displayIcon));
      } catch (err) {
        console.error("Error maps career", err);
      } finally {
        setLoading(false);
      }
    }
    loadMaps();
  }, []);

  const handleCareerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerQuery.trim()) return;

    audio.playSuccess();

    // Parse tag or default
    const parts = careerQuery.split("#");
    const name = parts[0] || "Recruit";
    const tag = parts[1] || "606";

    // Generate fully immersive career telemetry based on seed string
    const seed = name.charCodeAt(0) + name.length;
    const computedHs = (22 + (seed % 14)).toFixed(1);
    const computedAcs = 200 + (seed % 95);
    const computedKd = (1.05 + (seed % 6) * 0.1).toFixed(2);
    const winrate = 48 + (seed % 17);

    // Pick 3 random maps for history
    const randomMaps = maps.length > 0 ? [...maps].sort(() => 0.5 - Math.random()).slice(0, 3) : [];

    const mockProfile = {
      name,
      tag,
      rankName: seed % 2 === 0 ? "RADIANT" : "IMMORTAL 3",
      rankIcon: seed % 2 === 0 
        ? "https://media.valorant-api.com/competitivetiers/03621f13-849b-4114-b0d8-5561b71d0711/27/largeicon.png"
        : "https://media.valorant-api.com/competitivetiers/03621f13-849b-4114-b0d8-5561b71d0711/24/largeicon.png",
      acs: computedAcs,
      hs: computedHs,
      kd: computedKd,
      winrate,
      favWeapon: seed % 3 === 0 ? "Vandal" : seed % 3 === 1 ? "Phantom" : "Operator",
      favAgent: seed % 3 === 0 ? "Jett" : seed % 3 === 1 ? "Omen" : "Sage",
      matches: [
        {
          id: "m1",
          mapName: randomMaps[0]?.displayName || "Ascent",
          mapSplash: randomMaps[0]?.splash || "",
          win: seed % 2 === 0,
          score: seed % 2 === 0 ? "13 - 8" : "11 - 13",
          kda: `${18 + (seed % 5)} / ${12 + (seed % 3)} / ${6 + (seed % 3)}`,
          mvp: seed % 4 === 0,
        },
        {
          id: "m2",
          mapName: randomMaps[1]?.displayName || "Bind",
          mapSplash: randomMaps[1]?.splash || "",
          win: seed % 3 !== 0,
          score: seed % 3 !== 0 ? "13 - 10" : "5 - 13",
          kda: `${21 - (seed % 4)} / ${14 + (seed % 2)} / ${4 + (seed % 4)}`,
          mvp: seed % 3 !== 0,
        },
        {
          id: "m3",
          mapName: randomMaps[2]?.displayName || "Haven",
          mapSplash: randomMaps[2]?.splash || "",
          win: seed % 4 !== 0,
          score: seed % 4 !== 0 ? "13 - 5" : "9 - 13",
          kda: `${15 + (seed % 3)} / ${10 + (seed % 4)} / ${9 - (seed % 3)}`,
          mvp: false,
        },
      ],
    };

    setSearchedProfile(mockProfile);
  };

  const filteredLeaderboard = LEADERBOARD_PRESETS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(leaderboardSearch.toLowerCase()) || p.tag.toLowerCase().includes(leaderboardSearch.toLowerCase());
    const matchesRegion = activeRegion === "all" || p.region === activeRegion;
    return matchesSearch && matchesRegion;
  });

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-val-cyan border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs tracking-widest text-val-cyan animate-pulse">
          FETCHING REGISTRY RECORDS // API_REQ
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full pb-10">
      {/* REGISTRY NAVIGATION HEADERS */}
      <div className="flex border-b border-white/[0.05] gap-1 overflow-x-auto">
        {[
          { id: "leaderboard", label: "RADIANT LEADERBOARDS", icon: Trophy },
          { id: "career", label: "PLAYER CAREER PROFILES", icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeRegTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                audio.playSelect();
                setActiveRegTab(tab.id);
              }}
              className={`px-5 py-3 text-xs font-display font-medium uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-all relative ${
                isActive
                  ? "border-val-cyan text-val-cyan bg-val-cyan/5"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- LEADERBOARD SUB TAB VIEW --- */}
      {activeRegTab === "leaderboard" && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/[0.01] border border-white/[0.05] p-3.5 rounded-lg">
            {/* Search filter */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={leaderboardSearch}
                onChange={(e) => setLeaderboardSearch(e.target.value)}
                placeholder="Search leaderboard..."
                className="w-full bg-val-black border border-white/[0.08] rounded py-1.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-val-cyan"
              />
            </div>

            {/* Region select tab buttons */}
            <div className="flex bg-white/5 border border-white/10 p-0.5 rounded gap-0.5">
              {["all", "NA", "EU", "AP", "BR"].map((reg) => (
                <button
                  key={reg}
                  onClick={() => {
                    audio.playClick();
                    setActiveRegion(reg);
                  }}
                  className={`px-3 py-1 text-[9px] font-mono rounded font-bold uppercase transition-all ${
                    activeRegion === reg ? "bg-val-cyan/20 text-val-cyan" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard Table Row Layout */}
          <div className="bg-white/[0.01] border border-white/[0.05] rounded-lg overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px] border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-white/[0.05] text-gray-500 text-[9px] tracking-wider uppercase bg-white/[0.01]">
                  <th className="py-3 px-4 w-16">RANK</th>
                  <th className="py-3 px-4">PLAYER SPEC</th>
                  <th className="py-3 px-4 text-center">REGION</th>
                  <th className="py-3 px-4 text-right">RATING (RR)</th>
                  <th className="py-3 px-4 text-right">AVG ACS</th>
                  <th className="py-3 px-4 text-right">HEADSHOT %</th>
                  <th className="py-3 px-4 text-center">SIGNATURE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredLeaderboard.map((player) => (
                  <tr
                    key={player.rank}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    onClick={() => {
                      setCareerQuery(`${player.name}#${player.tag}`);
                      setActiveRegTab("career");
                    }}
                  >
                    <td className="py-3.5 px-4 font-display font-black text-sm text-gray-400 group-hover:text-val-cyan">
                      #{player.rank}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-display font-bold text-xs text-white group-hover:text-val-cyan transition-colors">
                          {player.name}
                        </span>
                        <span className="text-gray-500">#{player.tag}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="bg-white/5 px-2 py-0.5 rounded text-[9px] font-bold text-gray-400 border border-white/5">
                        {player.region}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-val-cyan">
                      {player.rating} RR
                    </td>
                    <td className="py-3.5 px-4 text-right text-white">
                      {player.acs}
                    </td>
                    <td className="py-3.5 px-4 text-right text-gray-400">
                      {player.hs}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-val-red bg-val-red/5 px-1.5 py-0.5 border border-val-red/10 rounded text-[9px]">
                        {player.agent}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- PLAYER CAREER PROFILES SUB TAB --- */}
      {activeRegTab === "career" && (
        <div className="space-y-6">
          {/* Custom profile search bar form */}
          <form
            onSubmit={handleCareerSearch}
            className="flex gap-2 max-w-md bg-white/[0.01] border border-white/[0.05] p-3 rounded-lg"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
              <input
                type="text"
                value={careerQuery}
                onChange={(e) => setCareerQuery(e.target.value)}
                placeholder="Search Riot Career (e.g. TenZ#NA1, yay#diablo)..."
                className="w-full bg-val-black border border-white/[0.08] rounded py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-val-cyan"
              />
            </div>
            <button
              type="submit"
              className="bg-val-cyan/15 hover:bg-val-cyan/25 text-val-cyan border border-val-cyan/30 px-4 py-2 rounded text-xs font-display font-bold uppercase tracking-wider transition-colors"
            >
              RETRIEVE
            </button>
          </form>

          {/* Searched Career Profile Showcase Panel */}
          {searchedProfile ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Profile Card Banner summary (col-span-4) */}
              <div className="lg:col-span-4 bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-6">
                <div className="flex items-center space-x-4 border-b border-white/[0.05] pb-4">
                  {/* Huge Rank Emblem */}
                  <div className="w-16 h-16 shrink-0 bg-white/[0.02] border border-white/[0.05] rounded-lg p-1.5 flex items-center justify-center">
                    <img
                      src={searchedProfile.rankIcon}
                      alt={searchedProfile.rankName}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,245,255,0.3)]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">
                        {searchedProfile.name}
                      </h3>
                      <span className="font-mono text-xs text-gray-500">#{searchedProfile.tag}</span>
                    </div>
                    <span className="font-mono text-[9px] text-val-cyan font-bold uppercase bg-val-cyan/10 px-1.5 py-0.5 border border-val-cyan/10 rounded">
                      {searchedProfile.rankName}
                    </span>
                  </div>
                </div>

                {/* Overall performance Stats dossier */}
                <div className="space-y-4 pt-1 font-mono text-[10px]">
                  <div className="font-mono text-[9px] tracking-widest text-gray-500 uppercase">
                    SEASON PERFORMANCE SUMMARY
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded">
                      <div className="text-gray-500 mb-0.5">K/D RATIO:</div>
                      <div className="font-display font-black text-xl text-white">
                        {searchedProfile.kd}
                      </div>
                    </div>

                    <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded">
                      <div className="text-gray-500 mb-0.5">HEADSHOT%:</div>
                      <div className="font-display font-black text-xl text-val-cyan">
                        {searchedProfile.hs}%
                      </div>
                    </div>

                    <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded">
                      <div className="text-gray-500 mb-0.5">AVG COMBAT ACS:</div>
                      <div className="font-display font-black text-xl text-white">
                        {searchedProfile.acs}
                      </div>
                    </div>

                    <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded">
                      <div className="text-gray-500 mb-0.5">MATCH WINRATE:</div>
                      <div className="font-display font-black text-xl text-val-red">
                        {searchedProfile.winrate}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/[0.03]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">FAVORITE WEAPON:</span>
                      <span className="text-white font-bold uppercase">{searchedProfile.favWeapon}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">FAVORITE AGENT:</span>
                      <span className="text-white font-bold uppercase">{searchedProfile.favAgent}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match history logs (col-span-8) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="font-display font-bold text-xs text-white uppercase tracking-wider">
                  RECENT ACT PERFORMANCE HISTORY MATCHES
                </div>

                <div className="space-y-3">
                  {searchedProfile.matches.map((match: any) => (
                    <div
                      key={match.id}
                      className="border border-white/[0.05] bg-gradient-to-r from-val-black/90 to-val-dark/30 rounded-lg overflow-hidden flex relative items-center justify-between"
                    >
                      {/* background map preview card */}
                      <div
                        className="absolute inset-y-0 right-0 w-32 bg-cover bg-center opacity-15 pointer-events-none"
                        style={{
                          backgroundImage: `url(${match.mapSplash})`,
                          maskImage: "linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0))",
                        }}
                      />

                      <div className="flex items-center space-x-4 p-4 z-10">
                        {/* Side victory indicator tab bar */}
                        <div
                          className={`w-1.5 h-12 rounded-full shrink-0 ${
                            match.win ? "bg-val-cyan" : "bg-val-red"
                          }`}
                        />

                        <div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`font-display font-bold text-sm uppercase ${
                                match.win ? "text-val-cyan" : "text-val-red"
                              }`}
                            >
                              {match.win ? "VICTORY" : "DEFEAT"}
                            </span>
                            {match.mvp && (
                              <span className="bg-val-purple/20 text-val-purple border border-val-purple/25 text-[8px] font-mono font-bold px-1 py-0.5 rounded uppercase tracking-widest">
                                MATCH MVP
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[9px] text-gray-500 uppercase">
                            MAP: {match.mapName.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Score metrics */}
                      <div className="p-4 flex items-center space-x-12 z-10 text-right">
                        <div>
                          <div className="font-mono text-xs font-bold text-white">
                            {match.score}
                          </div>
                          <span className="font-mono text-[8px] text-gray-500 block uppercase">SCORE</span>
                        </div>

                        <div>
                          <div className="font-mono text-xs font-bold text-gray-300">
                            {match.kda}
                          </div>
                          <span className="font-mono text-[8px] text-gray-500 block uppercase">K/D/A</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-white/[0.05] bg-white/[0.01] p-12 text-center rounded-lg space-y-3">
              <div className="text-gray-500 font-mono text-xs">
                NO ACTIVE RECORD RETRIEVED // INPUT PILOT COGNIZANTS
              </div>
              <p className="font-sans text-[11px] text-gray-400 font-light max-w-sm mx-auto">
                Type any gamer identifier (e.g. <b>TenZ#NA1</b>, <b>Asuna#101</b>, or a custom name of your choice!) to generate a custom analytical carrier file.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
