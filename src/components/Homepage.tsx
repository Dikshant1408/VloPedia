/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Search,
  Activity,
  Award,
  BookOpen,
  TrendingUp,
  ExternalLink,
  Cpu,
  Globe,
  Radio,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Agent, Weapon, ValorantMap, Bundle } from "../types/valorant";
import { valorantApi } from "../services/api";
import { audio } from "../services/audio";

interface HomepageProps {
  onNavigate: (tabId: string, itemId?: string) => void;
  accentColor: string;
}

export default function Homepage({ onNavigate, accentColor }: HomepageProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [maps, setMaps] = useState<ValorantMap[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{ id: string; type: string; name: string; info: string; icon: string }>
  >([]);

  // Simulated countdown timer for Shop Bundle
  const [timerString, setTimerString] = useState("14:24:52");

  useEffect(() => {
    async function loadData() {
      try {
        const [agentsData, weaponsData, mapsData, bundlesData] = await Promise.all([
          valorantApi.getAgents(),
          valorantApi.getWeapons(),
          valorantApi.getMaps(),
          valorantApi.getBundles(),
        ]);
        setAgents(agentsData);
        setWeapons(weaponsData);
        setMaps(mapsData);
        setBundles(bundlesData);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync shop timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = 23 - now.getHours();
      const minutes = 59 - now.getMinutes();
      const seconds = 59 - now.getSeconds();
      setTimerString(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Global live search matches
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: typeof searchResults = [];

    // Search Agents
    agents.forEach((agent) => {
      if (
        agent.displayName.toLowerCase().includes(query) ||
        agent.role?.displayName.toLowerCase().includes(query)
      ) {
        results.push({
          id: agent.uuid,
          type: "agents",
          name: agent.displayName,
          info: agent.role?.displayName || "Agent",
          icon: agent.displayIcon,
        });
      }
    });

    // Search Weapons
    weapons.forEach((weapon) => {
      const cat = weapon.shopData?.categoryText || "Weapon";
      if (weapon.displayName.toLowerCase().includes(query) || cat.toLowerCase().includes(query)) {
        results.push({
          id: weapon.uuid,
          type: "weapons",
          name: weapon.displayName,
          info: `${cat} - ¤${weapon.shopData?.cost || "0"}`,
          icon: weapon.displayIcon,
        });
      }
    });

    // Search Maps
    maps.forEach((map) => {
      if (map.displayName.toLowerCase().includes(query)) {
        results.push({
          id: map.uuid,
          type: "maps",
          name: map.displayName,
          info: map.coordinates || "Tactical Map",
          icon: map.listViewIcon || map.splash,
        });
      }
    });

    // Search Bundles
    bundles.forEach((bundle) => {
      if (bundle.displayName.toLowerCase().includes(query)) {
        results.push({
          id: bundle.uuid,
          type: "collection",
          name: bundle.displayName,
          info: "Featured Bundle",
          icon: bundle.displayIcon,
        });
      }
    });

    setSearchResults(results.slice(0, 5));
  }, [searchQuery, agents, weapons, maps, bundles]);

  const handleSearchResultClick = (type: string, id: string) => {
    audio.playSelect();
    onNavigate(type, id);
    setSearchQuery("");
  };

  return (
    <div className="space-y-10 w-full pb-10">
      {/* HERO SECTION WITH ANIMATED RADIANITE CORE */}
      <section className="relative min-h-[460px] rounded-xl overflow-hidden border border-white/[0.05] bg-gradient-to-br from-val-black via-val-dark to-val-navy/50 flex flex-col justify-center p-6 lg:p-12 val-grid-dots">
        {/* Core background glow overlay */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-val-red/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-val-cyan/10 blur-[100px] pointer-events-none" />

        {/* 3D Animated Radianite Core (Canvas/CSS hybrid) */}
        <div className="absolute right-6 lg:right-24 top-1/2 -translate-y-1/2 w-[300px] h-[300px] pointer-events-none hidden md:flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Spinning background military orbital rings */}
            <div className="absolute w-[240px] h-[240px] border border-white/5 rounded-full animate-spin-slow" />
            <div className="absolute w-[200px] h-[200px] border-2 border-dashed border-val-cyan/20 rounded-full animate-spin-reverse-slow" />
            <div className="absolute w-[150px] h-[150px] border border-val-red/10 rounded-full animate-pulse-slow" />

            {/* Glowing Radianite Core Pyramids */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotateY: [0, 180, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-24 h-24 relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Core geometry simulated via glowing diamond cards */}
              <div
                className="absolute inset-0 bg-gradient-to-tr from-val-red via-val-red/80 to-transparent opacity-90 blur-[1px] rotate-45"
                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
              />
              <div
                className="absolute inset-2 bg-gradient-to-tr from-val-cyan via-val-cyan/50 to-transparent opacity-80 blur-[2px] -rotate-45 animate-pulse"
                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
              />
              <div className="absolute inset-6 bg-white opacity-95 rounded-full blur-[8px] animate-ping" />
            </motion.div>

            {/* Floating particles shards orbiting the core */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-4 bg-val-cyan border border-white/20 rounded-sm opacity-70"
                animate={{
                  y: [Math.random() * 20 - 10, Math.random() * -60 - 40, Math.random() * 20 - 10],
                  x: [Math.random() * 20 - 10, Math.random() * 80 - 40, Math.random() * 20 - 10],
                  rotate: [0, 360],
                  opacity: [0.6, 0.9, 0.6],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  top: `${130 + Math.sin(i) * 70}px`,
                  left: `${130 + Math.cos(i) * 70}px`,
                }}
              />
            ))}
          </div>
        </div>

        {/* HERO CONTENT */}
        <div className="max-w-2xl relative z-10 space-y-6">
          <div className="flex items-center space-x-2 bg-white/[0.03] border border-white/[0.08] px-2.5 py-1 rounded w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-val-cyan animate-pulse" />
            <span className="font-mono text-[9px] tracking-widest text-val-cyan uppercase">
              Riot Connection Protocols Active
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-display font-black text-4xl lg:text-6xl tracking-tight text-white uppercase leading-none">
              ENTER THE <br />
              <span className="text-val-red">VALORANT</span> ARCHIVE
            </h1>
            <p className="font-sans text-sm text-gray-400 max-w-lg leading-relaxed font-light">
              Experience the premier interactive encyclopedia. Instantly updated with the official
              live Riot API. Explore dynamic agent files, damage specs, map radars, battlepass paths, and meta systems.
            </p>
          </div>

          {/* DYNAMIC SEARCH BAR */}
          <div className="relative max-w-md">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Agent, Weapon, Map, or Skin... (CTRL + K)"
                className="w-full bg-val-black/90 border border-white/[0.1] rounded py-3.5 pl-11 pr-4 text-sm font-sans focus:outline-none focus:border-val-red focus:ring-1 focus:ring-val-red transition-all text-white placeholder-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white font-mono text-xs"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Suggestions Overlay */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-val-dark border border-white/[0.1] rounded shadow-2xl z-50 overflow-hidden divide-y divide-white/[0.05]">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSearchResultClick(result.type, result.id)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-val-red/10 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded bg-white/[0.03] overflow-hidden flex items-center justify-center shrink-0 border border-white/[0.05]">
                        <img
                          src={result.icon}
                          alt={result.name}
                          className="max-w-full max-h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-display font-bold text-white group-hover:text-val-red transition-colors">
                          {result.name}
                        </div>
                        <div className="text-[10px] font-mono text-gray-400">{result.info}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1.5 font-mono text-[9px] text-gray-500 group-hover:text-white">
                      <span>GO TO {result.type.toUpperCase()}</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DYNAMIC DATABASE SUMMARY COUNTERS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "AGENTS FILE",
            count: loading ? "..." : agents.length,
            desc: "Tactical rosters indexed",
            icon: Award,
            tab: "agents",
          },
          {
            label: "WEAPON PROFILES",
            count: loading ? "..." : weapons.length,
            desc: "Accurate ballistics stats",
            icon: Cpu,
            tab: "weapons",
          },
          {
            label: "MAP RADARS",
            count: loading ? "..." : maps.length,
            desc: "Spike site layouts",
            icon: Globe,
            tab: "maps",
          },
          {
            label: "FEATURED BUNDLES",
            count: loading ? "..." : bundles.length,
            desc: "Riot skin packages",
            icon: Sparkles,
            tab: "collection",
          },
        ].map((stat, i) => (
          <button
            key={i}
            onClick={() => {
              audio.playClick();
              onNavigate(stat.tab);
            }}
            className="p-5 bg-white/[0.01] border border-white/[0.05] rounded-lg text-left hover:bg-white/[0.03] hover:border-white/[0.1] transition-all duration-200 group relative overflow-hidden"
          >
            {/* Hover accent slide */}
            <div className="absolute top-0 left-0 w-[2px] h-full bg-val-red scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
            <div className="flex justify-between items-start mb-2">
              <span className="font-mono text-[10px] tracking-wider text-gray-400">
                {stat.label}
              </span>
              <stat.icon className="w-4 h-4 text-gray-500 group-hover:text-val-cyan transition-colors" />
            </div>
            <div className="font-display font-black text-3xl text-white group-hover:text-val-cyan transition-colors">
              {stat.count}
            </div>
            <p className="font-mono text-[9px] text-gray-500 mt-1 uppercase">{stat.desc}</p>
          </button>
        ))}
      </section>

      {/* DETAILED DIAGNOSTICS & SYSTEM STATUS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Riot API Health */}
        <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
            <span className="font-display font-bold text-xs tracking-wider uppercase text-white">
              VALORANT API DIAGNOSTICS
            </span>
            <Radio className="w-4 h-4 text-val-cyan animate-pulse" />
          </div>
          <div className="space-y-3 font-mono text-[10px]">
            <div className="flex justify-between">
              <span className="text-gray-400">ENDPOINT API:</span>
              <span className="text-val-cyan font-bold">ONLINE (v1)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">DATA LOAD:</span>
              <span className="text-white">DYNAMIC AUTO-SYNC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">API CACHE STATUS:</span>
              <span className="text-val-cyan">LOCAL STORAGE ENABLED</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">RESPONSE PING:</span>
              <span className="text-white">41 ms // INSTANT</span>
            </div>
          </div>
        </div>

        {/* Featured Live Battle Pass Progress */}
        <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
            <span className="font-display font-bold text-xs tracking-wider uppercase text-white">
              CURRENT SEASON BATTLEPASS
            </span>
            <TrendingUp className="w-4 h-4 text-val-red" />
          </div>
          <div className="space-y-3 font-mono text-[10px]">
            <div className="flex justify-between">
              <span className="text-gray-400">EPISODE:</span>
              <span className="text-white font-bold">EPISODE 9 // RETRIBUTION</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ACT:</span>
              <span className="text-val-red font-bold">ACT III (LIVE)</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded overflow-hidden">
              <div className="bg-val-red h-full w-[78%] animate-pulse" />
            </div>
            <div className="flex justify-between text-[9px] text-gray-500">
              <span>78% SEASON PROGRESS</span>
              <span>12 DAYS REMAINING</span>
            </div>
          </div>
        </div>

        {/* Live Shop Simulator Status */}
        <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
            <span className="font-display font-bold text-xs tracking-wider uppercase text-white">
              STORE ROTATOR PREVIEW
            </span>
            <Clock className="w-4 h-4 text-val-purple" />
          </div>
          <div className="space-y-3 font-mono text-[10px]">
            <div className="flex justify-between">
              <span className="text-gray-400">VP STORE ROTATION:</span>
              <span className="text-white font-bold">{timerString}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">STORE BUNDLE:</span>
              <span className="text-val-purple font-bold">VALORANT RGX 11z Pro v3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">FEATURED PRICE:</span>
              <span className="text-white">¤ 8,700 VP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">SHOP SIMULATOR:</span>
              <span className="text-val-cyan hover:underline cursor-pointer" onClick={() => onNavigate("collection")}>
                LAUNCH STORE SIMULATOR →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* VALORANT LATEST NEWS FEED & PATCH HIGHLIGHTS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Patch Summary */}
        <div className="bg-white/[0.01] border border-white/[0.05] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-val-red rounded-full" />
              <span className="font-display font-bold text-xs text-white uppercase tracking-wider">
                LATEST PATCH BUFFS / NERFS
              </span>
            </div>
            <span className="font-mono text-[10px] text-gray-400">VERSION 9.08</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-val-red/5 border border-val-red/10 rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="font-display font-bold text-xs text-val-red">JETT GRENADE NERF</span>
                <span className="font-mono text-[9px] bg-val-red/25 px-1.5 py-0.5 rounded text-white">REDUCED</span>
              </div>
              <p className="font-sans text-[11px] text-gray-400 leading-relaxed font-light">
                Cloudburst duration decreased from 4.5 seconds to 3.5 seconds. Re-equip delay slightly increased.
              </p>
            </div>

            <div className="p-3 bg-val-cyan/5 border border-val-cyan/10 rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="font-display font-bold text-xs text-val-cyan">SAGE SLOW ORB BUFF</span>
                <span className="font-mono text-[9px] bg-val-cyan/25 px-1.5 py-0.5 rounded text-white">INCREASED</span>
              </div>
              <p className="font-sans text-[11px] text-gray-400 leading-relaxed font-light">
                Sage slow orb movement reduction increased by 10%. Area expansion speed buffed.
              </p>
            </div>

            <div className="p-3 bg-val-purple/5 border border-val-purple/10 rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="font-display font-bold text-xs text-val-purple">COMPETITIVE QUEUE MAPS</span>
                <span className="font-mono text-[9px] bg-val-purple/25 px-1.5 py-0.5 rounded text-white">ROSTER UPDATE</span>
              </div>
              <p className="font-sans text-[11px] text-gray-400 leading-relaxed font-light">
                Sunset has returned to competitive map rotation. Split removed for minor adjustment.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Skin Spotlight */}
        <div className="relative group rounded-lg overflow-hidden border border-white/[0.05] bg-gradient-to-tr from-val-black to-val-dark p-5 flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-val-purple/10 rounded-full blur-[40px] pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-3 z-10">
            <span className="font-display font-bold text-xs text-white uppercase tracking-wider">
              FEATURED SKIN SPOTLIGHT
            </span>
            <span className="font-mono text-[9px] text-val-purple uppercase font-bold">ULTRA PREMIUM</span>
          </div>

          <div className="my-4 flex items-center justify-between z-10 gap-4">
            <div className="space-y-1 max-w-[55%]">
              <h3 className="font-display font-black text-xl text-white tracking-wide uppercase leading-tight">
                RGX 11z Pro Blade
              </h3>
              <p className="font-sans text-[11px] text-gray-400 leading-normal font-light">
                Features interactive customizable LED colors, animated internal components, and custom sound wave kill banner tracker.
              </p>
            </div>
            <div className="w-[45%] h-24 flex items-center justify-center">
              <motion.img
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                src="https://media.valorant-api.com/weaponskins/4ef54d1d-44aa-aa84-a15d-f19b2dfbf7ff/displayicon.png"
                alt="RGX Blade"
                className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_12px_rgba(200,70,255,0.4)]"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback if image fails
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>

          <button
            onClick={() => onNavigate("weapons")}
            className="w-full bg-val-purple/20 hover:bg-val-purple/35 text-val-purple border border-val-purple/40 hover:border-val-purple py-2 px-4 rounded text-center text-xs font-display font-bold uppercase tracking-wider transition-colors duration-200 z-10"
          >
            INSPECT SKINS IN WEAPONS ENGINE
          </button>
        </div>
      </section>
    </div>
  );
}
