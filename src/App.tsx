/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Homepage from "./components/Homepage";
import AgentsTab from "./components/AgentsTab";
import WeaponsTab from "./components/WeaponsTab";
import MapsTab from "./components/MapsTab";
import CollectionTab from "./components/CollectionTab";
import MetaToolsTab from "./components/MetaToolsTab";
import PlayerRegistryTab from "./components/PlayerRegistryTab";
import GameModesTab from "./components/GameModesTab";
import { Search, Compass, Award, Cpu, Globe, Sliders, Shield, Activity, Bookmark } from "lucide-react";
import { audio } from "./services/audio";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [accentColor, setAccentColor] = useState<string>("#00f5ff");
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Keyboard shortcut listener for CTRL + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        audio.playSuccess();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // SEO & Google Indexing Dynamic Schema & Tag Injector
  useEffect(() => {
    const baseOrigin = window.location.origin;

    const metaMap: Record<string, { title: string; description: string; breadcrumbs: { name: string; item: string }[] }> = {
      home: {
        title: "VloPedia - The Ultimate VALORANT Encyclopedia & Tactical Guide",
        description: "Step into VloPedia, the premier encyclopedia for VALORANT. Explore in-depth guides, dynamic stats, interactive widgets, and advanced simulators designed for competitive edge.",
        breadcrumbs: [
          { name: "Home", item: `${baseOrigin}/` }
        ]
      },
      agents: {
        title: "Agents Database | VloPedia VALORANT Guide",
        description: "Complete database of all VALORANT agents with tactical breakdown, signature abilities, interactive voice line audio player, and custom metadata analytics.",
        breadcrumbs: [
          { name: "Home", item: `${baseOrigin}/` },
          { name: "Agents Database", item: `${baseOrigin}/#/agents` }
        ]
      },
      weapons: {
        title: "Weapons Armory & Shop | VloPedia VALORANT Guide",
        description: "Analyze VALORANT weapon recoil profiles, stats, fire rates, damage graphs, skin shops, and simulated performance comparisons.",
        breadcrumbs: [
          { name: "Home", item: `${baseOrigin}/` },
          { name: "Weapons Armory", item: `${baseOrigin}/#/weapons` }
        ]
      },
      maps: {
        title: "Interactive Tactical Radar Maps | VloPedia VALORANT Guide",
        description: "High-fidelity interactive tactical radar overlay for VALORANT maps. Discover attack vectors, smoke chokes, plant sites, sightlines, and operator suggestions.",
        breadcrumbs: [
          { name: "Home", item: `${baseOrigin}/` },
          { name: "Interactive Maps", item: `${baseOrigin}/#/maps` }
        ]
      },
      collection: {
        title: "Skins & Bundles Store | VloPedia VALORANT Guide",
        description: "Browse featured custom gun skins, current client bundles, buddy buddies, player cards, and check store rotations.",
        breadcrumbs: [
          { name: "Home", item: `${baseOrigin}/` },
          { name: "Skins & Bundles Store", item: `${baseOrigin}/#/collection` }
        ]
      },
      meta: {
        title: "Crosshair Labs & Sensitivity | VloPedia VALORANT Guide",
        description: "Customize crosshairs with a fully interactive simulator, convert mouse sensitivities between popular FPS titles, and take tactical competency quizzes.",
        breadcrumbs: [
          { name: "Home", item: `${baseOrigin}/` },
          { name: "Crosshair & Sensitivity Labs", item: `${baseOrigin}/#/meta` }
        ]
      },
      "player-registry": {
        title: "Radiant Leaderboards & Careers | VloPedia VALORANT Guide",
        description: "View regional Radiant leaderboards, look up verified competitive profiles, analyze combat scores, winrates, and career statistics.",
        breadcrumbs: [
          { name: "Home", item: `${baseOrigin}/` },
          { name: "Radiant Leaderboards", item: `${baseOrigin}/#/player-registry` }
        ]
      },
      "game-modes": {
        title: "Game Modes & Competitive Guide | VloPedia VALORANT Guide",
        description: "Master all VALORANT game modes, standard spikes, competitive ranking structures, and rank ladders with our exhaustive reference book.",
        breadcrumbs: [
          { name: "Home", item: `${baseOrigin}/` },
          { name: "Game Modes Guide", item: `${baseOrigin}/#/game-modes` }
        ]
      },
    };

    const currentMeta = metaMap[activeTab] || metaMap.home;

    // 1. Update Document Title
    document.title = currentMeta.title;

    // 2. Update Description Meta Tag
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement("meta");
      descMeta.setAttribute("name", "description");
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute("content", currentMeta.description);

    // Update Open Graph (OG) description
    let ogDescMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescMeta) {
      ogDescMeta.setAttribute("content", currentMeta.description);
    }

    // Update OG title
    let ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute("content", currentMeta.title);
    }

    // Update Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", `${baseOrigin}${activeTab === 'home' ? '/' : '/#/' + activeTab}`);

    // Update OG URL
    let ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (ogUrlMeta) {
      ogUrlMeta.setAttribute("content", `${baseOrigin}${activeTab === 'home' ? '/' : '/#/' + activeTab}`);
    }

    // 3. Update/Inject JSON-LD Schema (WebSite & BreadcrumbList)
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "VloPedia",
      "url": baseOrigin,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${baseOrigin}/#/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": currentMeta.breadcrumbs.map((crumb, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": crumb.name,
        "item": crumb.item
      }))
    };

    let scriptElement = document.getElementById("vlopedia-seo-schema");
    if (!scriptElement) {
      scriptElement = document.createElement("script");
      scriptElement.id = "vlopedia-seo-schema";
      scriptElement.setAttribute("type", "application/ld+json");
      document.head.appendChild(scriptElement);
    }

    scriptElement.textContent = JSON.stringify([websiteSchema, breadcrumbSchema], null, 2);
  }, [activeTab]);

  // Registry list of searchable navigation points and databases
  const searchableItems = [
    { name: "Jett", category: "Agent", targetTab: "agents" },
    { name: "Omen", category: "Agent", targetTab: "agents" },
    { name: "Sova", category: "Agent", targetTab: "agents" },
    { name: "Phoenix", category: "Agent", targetTab: "agents" },
    { name: "Vandal", category: "Weapon", targetTab: "weapons" },
    { name: "Phantom", category: "Weapon", targetTab: "weapons" },
    { name: "Sheriff", category: "Weapon", targetTab: "weapons" },
    { name: "Operator", category: "Weapon", targetTab: "weapons" },
    { name: "Ascent", category: "Map", targetTab: "maps" },
    { name: "Bind", category: "Map", targetTab: "maps" },
    { name: "Haven", category: "Map", targetTab: "maps" },
    { name: "Split", category: "Map", targetTab: "maps" },
    { name: "Weapon Skins Store", category: "Collection", targetTab: "collection" },
    { name: "Player Cards Inventory", category: "Collection", targetTab: "collection" },
    { name: "Crosshair Labs Generator", category: "Metatools", targetTab: "meta" },
    { name: "Sensitivity Converter", category: "Metatools", targetTab: "meta" },
    { name: "Tactical Competency Quiz", category: "Metatools", targetTab: "meta" },
    { name: "Regional Radiant Leaderboards", category: "Registry", targetTab: "player-registry" },
    { name: "Riot Career Profiles Search", category: "Registry", targetTab: "player-registry" },
    { name: "Competitive Ranking Systems", category: "Game Modes", targetTab: "game-modes" },
  ];

  const filteredSearch = searchableItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSelect = (targetTab: string) => {
    audio.playSelect();
    setActiveTab(targetTab);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "home":
        return <Homepage onNavigate={setActiveTab} accentColor={accentColor} />;
      case "agents":
        return <AgentsTab accentColor={accentColor} />;
      case "weapons":
        return <WeaponsTab accentColor={accentColor} />;
      case "maps":
        return <MapsTab accentColor={accentColor} />;
      case "collection":
        return <CollectionTab accentColor={accentColor} />;
      case "meta":
        return <MetaToolsTab accentColor={accentColor} />;
      case "player-registry":
        return <PlayerRegistryTab accentColor={accentColor} />;
      case "game-modes":
        return <GameModesTab accentColor={accentColor} />;
      default:
        return <Homepage onNavigate={setActiveTab} accentColor={accentColor} />;
    }
  };

  return (
    <>
      <Layout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        accentColor={accentColor}
        setAccentColor={setAccentColor}
      >
        {renderActiveTab()}

        {/* Tactical Search Floating HUD Trigger button at bottom-right */}
        <button
          onClick={() => {
            audio.playSuccess();
            setSearchOpen(true);
          }}
          className="fixed bottom-14 right-6 bg-val-black border border-white/10 hover:border-val-cyan text-gray-300 hover:text-white p-3 rounded-full shadow-2xl transition-all duration-200 z-40 flex items-center justify-center space-x-2 cursor-pointer"
          title="Open Global search (Ctrl+K)"
        >
          <Search className="w-5 h-5 animate-pulse text-val-cyan" />
          <span className="hidden md:inline font-mono text-[9px] tracking-widest text-gray-500 uppercase">
            CTRL + K
          </span>
        </button>
      </Layout>

      {/* GLOBAL SEARCH DIALOG OVERLAY */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-val-black/90 backdrop-blur-sm flex items-start justify-center z-50 pt-24 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="bg-val-dark border border-white/[0.08] max-w-lg w-full rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input row */}
            <div className="flex items-center space-x-3 p-4 border-b border-white/[0.05]">
              <Search className="w-5 h-5 text-val-cyan" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type keywords to search VLOPEDIA (e.g. Vandal, Jett, Store)..."
                className="bg-transparent w-full border-none outline-none text-xs text-white placeholder-gray-500 focus:ring-0 font-sans"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="font-mono text-[9px] border border-white/10 rounded px-1.5 py-0.5 text-gray-500 hover:text-white hover:bg-white/5"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[300px] overflow-y-auto divide-y divide-white/[0.03]">
              {filteredSearch.length > 0 ? (
                filteredSearch.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSearchSelect(item.targetTab)}
                    className="p-3.5 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-display font-bold text-xs text-white group-hover:text-val-cyan transition-colors uppercase">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-mono text-[8px] bg-white/5 px-2 py-0.5 border border-white/5 rounded text-gray-400 group-hover:text-val-cyan">
                      {item.category.toUpperCase()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 font-mono text-[10px]">
                  NO COMBAT RECORD MATCHED THE QUERY
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
