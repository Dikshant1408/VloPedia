/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import BackgroundCanvas from "./components/BackgroundCanvas";
import CustomCursor from "./components/CustomCursor";
import AgentsHub from "./components/AgentsHub";
import WeaponMatrix from "./components/WeaponMatrix";
import MapsHub from "./components/MapsHub";
import CrosshairsHub from "./components/CrosshairsHub";
import DatabaseHub from "./components/DatabaseHub";
import CollectionHub from "./components/CollectionHub";
import MetaHub from "./components/MetaHub";
import ToolsHub from "./components/ToolsHub";
import PlayerLeaderboardHub from "./components/PlayerLeaderboardHub";
import EsportsHub from "./components/EsportsHub";
import NewsHub from "./components/NewsHub";
import GuidesHub from "./components/GuidesHub";

import { playSFX } from "./utils/sfx";
import { Volume2, VolumeX, Shield, Cpu, Clock, Terminal, Radio, Menu, X, ChevronRight } from "lucide-react";

const NAVIGATION_GROUPS = [
  {
    category: "DATABASE",
    items: [
      { id: "overview", label: "Overview" },
      { id: "agents", label: "Roster Agents" },
      { id: "weapons", label: "Arsenal Procurement" },
      { id: "maps", label: "Tactical Maps" },
      { id: "game-modes", label: "Game Modes" },
      { id: "ranks", label: "Competitive Ranks" },
      { id: "timeline", label: "Season Timeline" },
    ]
  },
  {
    category: "COLLECTION",
    items: [
      { id: "skins", label: "Weapon Skins" },
      { id: "store", label: "Featured Store" },
      { id: "bundles", label: "Bundle Catalog" },
      { id: "contracts", label: "Contracts & Passes" },
      { id: "buddies", label: "Gun Buddies" },
      { id: "sprays", label: "Sprays" },
      { id: "cards", label: "Player Cards" },
    ]
  },
  {
    category: "META",
    items: [
      { id: "tier-list", label: "Agent Tier List" },
      { id: "comps", label: "Meta Comps" },
      { id: "matchups", label: "Agent Matchups" },
    ]
  },
  {
    category: "TOOLS",
    items: [
      { id: "comp-builder", label: "Comp Builder" },
      { id: "crosshair-gen", label: "Crosshair Generator" },
      { id: "sens-calc", label: "Sensitivity Calc" },
      { id: "economy", label: "Economy Guide" },
      { id: "weapon-compare", label: "Weapon Compare" },
      { id: "quiz", label: "Agent Quiz" },
    ]
  },
  {
    category: "PLAYER REGISTRY",
    items: [
      { id: "player-lookup", label: "Player Lookup" },
      { id: "leaderboard", label: "Leaderboard" },
    ]
  },
  {
    category: "ESPORTS",
    items: [
      { id: "scores", label: "Live Scores" },
      { id: "pro-players", label: "Pro Players" },
    ]
  },
  {
    category: "NEWS & MEDIA",
    items: [
      { id: "news", label: "All News" },
      { id: "patch-notes", label: "Patch Notes" },
      { id: "game-updates", label: "Game Updates" },
    ]
  },
  {
    category: "TACTICAL GUIDES",
    items: [
      { id: "guides", label: "Guides" },
    ]
  }
];

export default function App() {
  const [activePage, setActivePage] = useState<string>("overview");
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePageChange = (pageId: string) => {
    if (!isMuted) {
      playSFX.selectSurge();
    }
    setActivePage(pageId);
    setIsMobileMenuOpen(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      playSFX.tick();
    }
  };

  const formatTime = (date: Date) => {
    return date.toISOString().replace("T", "  ").substring(0, 20) + " UTC";
  };

  const renderActivePage = () => {
    if (activePage === "agents") return <AgentsHub />;
    if (activePage === "weapons") return <WeaponMatrix />;
    if (activePage === "maps") return <MapsHub />;
    if (["overview", "game-modes", "ranks", "timeline"].includes(activePage)) {
      return <DatabaseHub subTab={activePage} onNavigate={handlePageChange} />;
    }

    if (["skins", "store", "bundles", "contracts", "buddies", "sprays", "cards"].includes(activePage)) {
      return <CollectionHub subTab={activePage} />;
    }

    if (["tier-list", "comps", "matchups"].includes(activePage)) {
      return <MetaHub subTab={activePage} />;
    }

    if (["comp-builder", "crosshair-gen", "sens-calc", "economy", "weapon-compare", "quiz"].includes(activePage)) {
      return <ToolsHub subTab={activePage} />;
    }

    if (["player-lookup", "leaderboard"].includes(activePage)) {
      return <PlayerLeaderboardHub subTab={activePage} />;
    }

    if (["scores", "pro-players"].includes(activePage)) {
      return <EsportsHub subTab={activePage} />;
    }

    if (["news", "patch-notes", "game-updates"].includes(activePage)) {
      return <NewsHub subTab={activePage} />;
    }

    if (activePage === "guides") {
      return <GuidesHub />;
    }

    return <DatabaseHub subTab="overview" onNavigate={handlePageChange} />;
  };

  const renderNavigationList = () => {
    return (
      <div className="space-y-8">
        {NAVIGATION_GROUPS.map((group) => (
          <div key={group.category} className="space-y-1">
            <span className="eyebrow px-2 select-none block mb-3">
              {group.category}
            </span>
            {group.items.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handlePageChange(item.id)}
                  onMouseEnter={() => playSFX.hoverClick()}
                  className={`w-full flex items-center justify-between px-3 py-2 font-mono text-[11px] tracking-wide uppercase border transition-all duration-200 clip-diagonal-sm cursor-none interactive-tactical relative group ${
                    isActive
                      ? "bg-[#FA4454]/10 border-[#FA4454]/50 text-[#FA4454] font-bold text-glow-red"
                      : "bg-transparent border-transparent hover:border-[rgba(236,232,225,0.1)] text-white/60 hover:text-white"
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isActive ? "text-[#FA4454] translate-x-0.5" : "text-white/20 group-hover:text-white/50"
                  }`} />
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen text-[#ECE8E1] select-none flex flex-col justify-between overflow-x-hidden border border-[#1A2C38]/60 bg-[#0B141A]">
      <BackgroundCanvas />

      <CustomCursor />

      <header className="sticky top-0 z-40 bg-[#0B141A]/92 border-b border-[rgba(236,232,225,0.08)] backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          <div
            onClick={() => handlePageChange("overview")}
            className="flex items-center space-x-4 cursor-none interactive-tactical"
          >
            <div className="w-9 h-9 bg-[#FA4454] flex items-center justify-center transform rotate-45 group relative">
              <div className="transform -rotate-45 font-black text-lg text-[#0B141A]">V</div>
            </div>

            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tighter leading-none text-[#ECE8E1]">
                ValoVault
              </span>
              <span className="font-mono text-[9px] text-[#0DF2F2] tracking-[0.22em] opacity-80 uppercase mt-0.5">
                Tactical Encyclopedia // v2.0 Online
              </span>
            </div>
          </div>

          <div className="flex space-x-6 items-center font-mono text-xs tracking-widest">
            <div className="hidden lg:flex flex-col text-right select-none pointer-events-none">
              <span className="text-[#0DF2F2] font-medium">SYSTEM STATUS: ACTIVE</span>
              <span className="opacity-40 text-[9px]">RADIANITE STABILITY: 99.2%</span>
            </div>
            <div className="hidden lg:block w-px h-8 bg-[#ECE8E1]/20"></div>
            <div className="hidden lg:flex flex-col text-right select-none pointer-events-none">
              <span className="opacity-80">LATENCY: 14MS</span>
              <span className="opacity-40 text-[9px]">{formatTime(currentTime)}</span>
            </div>

            <button
              onClick={toggleMute}
              className="p-2 border border-[rgba(236,232,225,0.1)] rounded-sm hover:border-[#0DF2F2] text-white/60 hover:text-[#0DF2F2] bg-white/[0.02] transition-colors cursor-none interactive-tactical"
              title={isMuted ? "Unmute tactical sound" : "Mute tactical sound"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => { playSFX.tick(); setIsMobileMenuOpen(!isMobileMenuOpen); }}
              className="lg:hidden p-2 border border-white/10 rounded-sm text-white/60 hover:text-white bg-white/[0.02] transition-colors cursor-none interactive-tactical"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto relative min-h-0">

        <aside className="w-80 border-r border-[rgba(236,232,225,0.08)] bg-[#0B141A]/95 hidden lg:block sticky top-16 h-[calc(100vh-8rem)] overflow-y-auto overflow-x-hidden p-6 select-none custom-scrollbar shrink-0">
          {renderNavigationList()}
        </aside>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 top-16 z-30 bg-[#0B141A]/98 backdrop-blur-md overflow-y-auto p-6"
            >
              {renderNavigationList()}
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 min-h-0 overflow-y-auto relative p-4 sm:p-6 lg:p-8">

          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full h-full"
            >
              {renderActivePage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <footer className="bg-[#0B141A]/98 border-t border-[rgba(236,232,225,0.08)] py-5 z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-center md:text-left">

          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-[9px] font-mono text-white/30 tracking-widest font-bold">
              <Shield className="w-3.5 h-3.5 text-[#FA4454]" />
              <span>COMMUNITY API REGISTRY DISPATCH // STATUS_SECURED</span>
            </div>
            <p className="font-mono text-[8px] text-white/20 leading-relaxed uppercase">
              ValoVault is an independent fan project utilizing official community assets. It is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Valorant.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-right bg-white/[0.01] border border-white/5 p-2 rounded-xs">
            <Cpu className="w-4 h-4 text-[#0DF2F2]" />
            <div className="flex flex-col text-left">
              <span className="font-mono text-[8px] text-[#0DF2F2] tracking-widest font-bold">ENGINE STATUS</span>
              <span className="font-mono text-[9px] text-white/60">THREE.JS // WEBGL // ACCELERATED</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
