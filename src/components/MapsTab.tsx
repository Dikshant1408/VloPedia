/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Globe,
  MapPin,
  Compass,
  TrendingUp,
  Shield,
  Activity,
  Award,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Flame,
  Cloud,
  Eye,
  Crosshair,
  Info,
  Map,
} from "lucide-react";
import { ValorantMap } from "../types/valorant";
import { valorantApi } from "../services/api";
import { audio } from "../services/audio";

interface MapsTabProps {
  initialMapId?: string;
  accentColor: string;
}

export interface TacticalMarker {
  id: string;
  type: "callout" | "plant" | "smoke" | "angle" | "lobby";
  label: string;
  subLabel: string;
  description: string;
  agentSuggestion?: string;
  abilitySuggestion?: string;
  x: number;
  y: number;
}

export interface TacticalRoute {
  id: string;
  name: string;
  startName: string;
  endName: string;
  points: { x: number; y: number }[];
  color: string;
}

// Dynamically categorize map callouts into structured tactical assets
function getTacticalMarkers(map: ValorantMap): TacticalMarker[] {
  if (!map.callouts) return [];
  
  return map.callouts.map((c, idx) => {
    const name = c.regionName.toLowerCase();
    
    let type: "callout" | "plant" | "smoke" | "angle" | "lobby" = "callout";
    let label = c.regionName;
    let subLabel = c.superRegionName ? `${c.superRegionName} Region` : "Tactical Area";
    let description = "General map region and tactical location used for callouts and team coordination.";
    let agentSuggestion = "";
    let abilitySuggestion = "";
    
    if (name.includes("site")) {
      type = "plant";
      label = `${c.regionName} Spike Zone`;
      description = `Critical spike plant zone. Ensure team coverage from key post-plant angles. Clear of any defender setups before execution.`;
      agentSuggestion = "Killjoy / Viper";
      abilitySuggestion = "Swarm Grenade / Snake Bite";
    } else if (
      name.includes("main") || 
      name.includes("garage") || 
      name.includes("garden") || 
      name.includes("market") || 
      name.includes("link") || 
      name.includes("connector") ||
      name.includes("choke") ||
      name.includes("doors") ||
      name.includes("hookah") ||
      name.includes("bath")
    ) {
      type = "smoke";
      label = `${c.regionName} Smoke Choke`;
      description = `Critical entry choke point. Use vision-blocking smokes to slow down aggressive rushes or to divide defender sightlines during executes.`;
      agentSuggestion = "Omen / Brimstone / Astra";
      abilitySuggestion = "Dark Cover / Sky Smoke";
    } else if (
      name.includes("heaven") || 
      name.includes("tower") || 
      name.includes("rafters") || 
      name.includes("window") || 
      name.includes("belt") || 
      name.includes("nest") || 
      name.includes("top") || 
      name.includes("screen") ||
      name.includes("boiler") ||
      name.includes("vent")
    ) {
      type = "angle";
      label = `${c.regionName} Sniper Hold`;
      description = `High-ground vantage point or long sightline. Provides heavy defensive coverage over main entries. Use flashing or blinding utility to dislodge.`;
      agentSuggestion = "Jett / Chamber";
      abilitySuggestion = "Operator / Headhunter";
    } else if (name.includes("lobby") || name.includes("spawn") || name.includes("yard")) {
      type = "lobby";
      label = `${c.regionName} Staging`;
      description = `Pre-round staging and team execution startup zone. Ideal for early round defaults, visual baiting, and dynamic coordinate routing.`;
    }
    
    return {
      id: `${map.uuid}-marker-${idx}`,
      type,
      label,
      subLabel,
      description,
      agentSuggestion,
      abilitySuggestion,
      x: c.location.x,
      y: c.location.y
    };
  });
}

function getTacticalRoutes(map: ValorantMap): TacticalRoute[] {
  if (!map.callouts) return [];
  const routes: TacticalRoute[] = [];
  const callouts = map.callouts;
  
  const findCalloutBySub = (search: string) => {
    return callouts.find(c => c.regionName.toLowerCase().includes(search.toLowerCase()));
  };
  
  // Handcraft key routes using real coordinates from map callouts database
  const tryAddRoute = (id: string, name: string, startSearch: string, midSearch: string | null, endSearch: string, color: string) => {
    const start = findCalloutBySub(startSearch);
    const mid = midSearch ? findCalloutBySub(midSearch) : null;
    const end = findCalloutBySub(endSearch);
    
    if (start && end) {
      const points = [start.location];
      if (mid) points.push(mid.location);
      points.push(end.location);
      
      routes.push({
        id,
        name,
        startName: start.regionName,
        endName: end.regionName,
        points,
        color
      });
    }
  };
  
  // Custom execution routes (A Site, B Site, C Site, Mid Splits)
  tryAddRoute("a-exec", "A Site Attack Vector", "A Lobby", "A Main", "A Site", "#ff4655");
  tryAddRoute("b-exec", "B Site Attack Vector", "B Lobby", "B Main", "B Site", "#00f5ff");
  tryAddRoute("c-exec", "C Site Attack Vector", "C Lobby", "C Main", "C Site", "#ffb200");
  tryAddRoute("mid-split-a", "Mid-to-A Splitting Vector", "Mid", "A Link", "A Site", "#e2e8f0");
  tryAddRoute("mid-split-b", "Mid-to-B Splitting Vector", "Mid", "B Link", "B Site", "#e2e8f0");
  
  return routes;
}

export default function MapsTab({ initialMapId, accentColor }: MapsTabProps) {
  const [maps, setMaps] = useState<ValorantMap[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMap, setSelectedMap] = useState<ValorantMap | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Map interaction
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showCallouts, setShowCallouts] = useState(true);
  const [activeCategory, setActiveCategory] = useState<"all" | "callouts" | "plant" | "smoke" | "angle" | "routes">("all");
  const [selectedMarker, setSelectedMarker] = useState<TacticalMarker | null>(null);

  useEffect(() => {
    async function loadMaps() {
      try {
        const data = await valorantApi.getMaps();
        // Filter out non-tactical maps (like Range or training grounds usually don't have displayIcon)
        const tacticalMaps = data.filter((m) => m.displayIcon);
        setMaps(tacticalMaps);
        if (tacticalMaps.length > 0) {
          if (initialMapId) {
            const found = tacticalMaps.find((m) => m.uuid === initialMapId);
            setSelectedMap(found || tacticalMaps[0]);
          } else {
            setSelectedMap(tacticalMaps[0]);
          }
        }
      } catch (err) {
        console.error("Error loading maps", err);
      } finally {
        setLoading(false);
      }
    }
    loadMaps();
  }, [initialMapId]);

  const handleMapSelect = (map: ValorantMap) => {
    audio.playSelect();
    setSelectedMap(map);
    setZoomLevel(1); // reset zoom
    setActiveCategory("all");
    setSelectedMarker(null);
  };

  const adjustZoom = (amount: number) => {
    audio.playClick();
    setZoomLevel((prev) => Math.min(Math.max(prev + amount, 0.75), 2.25));
  };

  // Convert map local 3D coordinates into relative 0-100% canvas coordinates
  // Formula: percentageX = (y * xMultiplier) + xScalarToAdd
  // percentageY = (x * yMultiplier) + yScalarToAdd
  const getCalloutPosition = (x: number, y: number) => {
    if (!selectedMap) return { left: "50%", top: "50%" };
    const px = (y * selectedMap.xMultiplier + selectedMap.xScalarToAdd) * 100;
    const py = (x * selectedMap.yMultiplier + selectedMap.yScalarToAdd) * 100;
    return {
      left: `${px.toFixed(2)}%`,
      top: `${py.toFixed(2)}%`,
    };
  };

  const getPercentCoords = (x: number, y: number) => {
    if (!selectedMap) return { x: 50, y: 50 };
    const px = (y * selectedMap.xMultiplier + selectedMap.xScalarToAdd) * 100;
    const py = (x * selectedMap.yMultiplier + selectedMap.yScalarToAdd) * 100;
    return { x: px, y: py };
  };

  const getMapTactics = (mapName: string) => {
    // Strategic meta overlays
    const data: Record<
      string,
      {
        attackerWinrate: number;
        defenderWinrate: number;
        keyComps: string[];
        spikeSpots: string[];
        angles: string[];
      }
    > = {
      Ascent: {
        attackerWinrate: 47.8,
        defenderWinrate: 52.2,
        keyComps: ["Jett", "Sova", "Omen", "Killjoy", "KAY/O"],
        spikeSpots: ["A Site behind Generator", "B Site default Boat House"],
        angles: ["Mid Courtyard Archway", "A Main Choke Point"],
      },
      Bind: {
        attackerWinrate: 51.4,
        defenderWinrate: 48.6,
        keyComps: ["Raze", "Skye", "Viper", "Brimstone", "Cypher"],
        spikeSpots: ["A default open to Hookah", "B default behind Container"],
        angles: ["Showers choke point", "B Hookah entry angle"],
      },
      Haven: {
        attackerWinrate: 49.6,
        defenderWinrate: 50.4,
        keyComps: ["Jett", "Sova", "Breach", "Omen", "Killjoy"],
        spikeSpots: ["A site default back-site", "B site middle default", "C site default open"],
        angles: ["A Long sightlines", "C Garage entryway"],
      },
      Split: {
        attackerWinrate: 44.5,
        defenderWinrate: 55.5,
        keyComps: ["Raze", "Breach", "Omen", "Cypher", "Sage"],
        spikeSpots: ["A Site default box side", "B Site back pillar default"],
        angles: ["Mid Vent corner", "B Heaven rafters"],
      },
      Icebox: {
        attackerWinrate: 52.1,
        defenderWinrate: 47.9,
        keyComps: ["Jett", "Viper", "Killjoy", "Sova", "Sage"],
        spikeSpots: ["A site default nested box", "B site default corner"],
        angles: ["A Belt sniper sightline", "B Yellow cover angle"],
      },
    };

    return (
      data[mapName] || {
        attackerWinrate: 49.0,
        defenderWinrate: 51.0,
        keyComps: ["Jett", "Omen", "Sova", "Viper", "Killjoy"],
        spikeSpots: ["A Site Default", "B Site Default"],
        angles: ["Main choke point", "Heaven connector"],
      }
    );
  };

  const filteredMaps = maps.filter((m) =>
    m.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-val-red border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs tracking-widest text-val-red animate-pulse">
          MAPPING SPIKE CONNECTIONS // API_REQ
        </span>
      </div>
    );
  }

  const tactics = selectedMap ? getMapTactics(selectedMap.displayName) : null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start w-full">
      {/* LEFT COLUMN: MAP LIST FILTERS & SELECTOR GRID */}
      <div className="xl:col-span-3 space-y-4">
        <div className="bg-white/[0.01] border border-white/[0.05] p-4 rounded-lg space-y-4">
          <div className="font-mono text-[10px] tracking-widest text-gray-400">
            TACTICAL_SITES
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Maps..."
              className="w-full bg-val-black border border-white/[0.08] rounded py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-val-red focus:ring-1 focus:ring-val-red text-white"
            />
          </div>
        </div>

        {/* Maps scroll gallery */}
        <div className="max-h-[500px] xl:max-h-[620px] overflow-y-auto space-y-2 pr-1">
          {filteredMaps.map((map) => (
            <button
              key={map.uuid}
              onClick={() => handleMapSelect(map)}
              className={`w-full relative h-28 rounded-lg overflow-hidden text-left border group transition-all duration-200 ${
                selectedMap?.uuid === map.uuid ? "border-val-red scale-102 shadow-lg" : "border-white/[0.05]"
              }`}
            >
              {/* background image */}
              <img
                src={map.splash}
                alt={map.displayName}
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.45] group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              {/* gradient filter overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-val-black via-transparent to-transparent opacity-90" />

              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end z-10">
                <div>
                  <h4 className="font-display font-black text-lg text-white tracking-wide uppercase leading-none">
                    {map.displayName}
                  </h4>
                  <span className="font-mono text-[8px] text-gray-400 uppercase tracking-widest block mt-1">
                    GPS: {map.coordinates || "CLASSIFIED"}
                  </span>
                </div>
                {selectedMap?.uuid === map.uuid && (
                  <span className="w-2.5 h-2.5 bg-val-red rounded-full rotate-45" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CENTRAL COLUMN: INTERACTIVE TACTICAL RADAR WIDGET (col-span-5) */}
      <div className="xl:col-span-5 space-y-4">
        <style>{`
          @keyframes tacticalDash {
            to {
              stroke-dashoffset: -20;
            }
          }
          .tactical-line-animate {
            stroke-dasharray: 6, 4;
            animation: tacticalDash 1.5s linear infinite;
          }
        `}</style>

        <AnimatePresence mode="wait">
          {selectedMap && (
            <motion.div
              key={selectedMap.uuid + "_radar"}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="bg-val-black/40 border border-white/10 rounded-xl overflow-hidden shadow-2xl relative flex flex-col"
            >
              {/* Header controllers */}
              <div className="p-3.5 bg-val-dark/95 border-b border-white/[0.05] flex items-center justify-between font-mono text-[9px] relative z-10">
                <span className="text-gray-400">TACTICAL RADAR: {selectedMap.displayName.toUpperCase()}</span>
                <div className="flex items-center space-x-3">
                  {/* Zoom controls */}
                  <div className="flex bg-white/5 border border-white/10 rounded overflow-hidden">
                    <button
                      onClick={() => adjustZoom(-0.25)}
                      className="px-2 py-1 text-gray-400 hover:text-white hover:bg-white/5 transition-colors border-r border-white/10"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => adjustZoom(0.25)}
                      className="px-2 py-1 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Toggle labels */}
                  <button
                    onClick={() => {
                      audio.playClick();
                      setShowCallouts(!showCallouts);
                    }}
                    className={`px-2 py-1 rounded border transition-all ${
                      showCallouts
                        ? "bg-val-red/10 border-val-red text-val-red"
                        : "bg-white/5 border-white/10 text-gray-400"
                    }`}
                  >
                    {showCallouts ? "HIDE SYSTEM" : "SHOW SYSTEM"}
                  </button>
                </div>
              </div>

              {/* Tactical Filter Tabs */}
              <div className="px-3.5 py-2 bg-val-dark/40 border-b border-white/[0.05] flex items-center gap-1.5 overflow-x-auto scrollbar-none z-10">
                {[
                  { id: "all", label: "ALL", icon: Globe },
                  { id: "callouts", label: "REGIONS", icon: MapPin },
                  { id: "plant", label: "PLANTS", icon: Crosshair },
                  { id: "smoke", label: "SMOKES", icon: Cloud },
                  { id: "angle", label: "SIGHTLINES", icon: Eye },
                  { id: "routes", label: "VECTORS", icon: Compass },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        audio.playClick();
                        setActiveCategory(tab.id as any);
                        setSelectedMarker(null);
                      }}
                      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-[9px] font-mono tracking-wider transition-all border shrink-0 ${
                        isActive
                          ? "bg-white/10 border-white/20 text-white font-bold shadow-md"
                          : "bg-transparent border-transparent text-gray-400 hover:text-white hover:bg-white/[0.02]"
                      }`}
                    >
                      <Icon className={`w-3 h-3 ${isActive ? "text-val-red" : "text-gray-500"}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Main Interactive Map Stage */}
              <div className="aspect-square w-full bg-val-black/90 flex items-center justify-center overflow-hidden relative">
                {/* Background radar grid pattern */}
                <div className="absolute inset-0 val-grid-dots opacity-30 pointer-events-none" />

                {/* Radar image viewport with CSS scale zoom */}
                <div
                  className="w-full h-full relative transition-transform duration-300 origin-center"
                  style={{
                    transform: `scale(${zoomLevel})`,
                  }}
                >
                  {selectedMap.displayIcon ? (
                    <img
                      src={selectedMap.displayIcon}
                      alt={`${selectedMap.displayName} Radar`}
                      className="w-full h-full block filter invert-0 brightness-110 contrast-125 pointer-events-none select-none"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-xs text-gray-500">
                      RADAR MATRIX UNAVAILABLE
                    </div>
                  )}

                  {/* SVG Tactical attack vectors */}
                  {selectedMap.displayIcon && showCallouts && (activeCategory === "all" || activeCategory === "routes") && (
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none z-10"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="glow-red" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ff4655" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#ff4655" stopOpacity="0.2" />
                        </linearGradient>
                        <linearGradient id="glow-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#00f5ff" stopOpacity="0.2" />
                        </linearGradient>
                        <linearGradient id="glow-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffb200" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#ffb200" stopOpacity="0.2" />
                        </linearGradient>
                      </defs>

                      {getTacticalRoutes(selectedMap).map((route) => {
                        const pathCoords = route.points.map((pt) => getPercentCoords(pt.x, pt.y));
                        if (pathCoords.length < 2) return null;

                        const d = `M ${pathCoords[0].x.toFixed(2)} ${pathCoords[0].y.toFixed(2)} ` +
                          pathCoords.slice(1).map((pt) => `L ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`).join(" ");

                        const gradId = route.id.includes("a-") ? "glow-red" : route.id.includes("b-") ? "glow-cyan" : "glow-gold";

                        return (
                          <g key={route.id}>
                            {/* Outer shadow glow path */}
                            <path
                              d={d}
                              fill="none"
                              stroke={`url(#${gradId})`}
                              strokeWidth="1.2"
                              className="opacity-70"
                            />
                            {/* Inner animated dashed path */}
                            <path
                              d={d}
                              fill="none"
                              stroke={route.color}
                              strokeWidth="0.5"
                              className="tactical-line-animate opacity-90"
                            />
                            {/* Pulse marker at destination */}
                            <circle
                              cx={pathCoords[pathCoords.length - 1].x}
                              cy={pathCoords[pathCoords.length - 1].y}
                              r="1"
                              fill={route.color}
                              className="animate-ping"
                            />
                          </g>
                        );
                      })}
                    </svg>
                  )}

                  {/* Tactical Indicators & Callouts Overlay */}
                  {showCallouts &&
                    getTacticalMarkers(selectedMap)
                      .filter((marker) => {
                        if (activeCategory === "all") return true;
                        if (activeCategory === "callouts") return marker.type === "callout" || marker.type === "lobby";
                        if (activeCategory === "plant") return marker.type === "plant";
                        if (activeCategory === "smoke") return marker.type === "smoke";
                        if (activeCategory === "angle") return marker.type === "angle";
                        if (activeCategory === "routes") return marker.type === "plant" || marker.type === "lobby";
                        return true;
                      })
                      .map((marker) => {
                        const pos = getCalloutPosition(marker.x, marker.y);
                        const isSelected = selectedMarker?.id === marker.id;

                        // Style variables based on type
                        let ringColor = "border-white";
                        let bgColor = "bg-val-red";
                        let iconColor = "text-white";

                        if (marker.type === "plant") {
                          ringColor = "border-val-red animate-pulse";
                          bgColor = "bg-val-red";
                        } else if (marker.type === "smoke") {
                          ringColor = "border-val-cyan";
                          bgColor = "bg-val-cyan/60";
                        } else if (marker.type === "angle") {
                          ringColor = "border-yellow-400";
                          bgColor = "bg-yellow-400/80";
                        } else if (marker.type === "lobby") {
                          ringColor = "border-white";
                          bgColor = "bg-gray-500";
                        }

                        return (
                          <div
                            key={marker.id}
                            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-20 group cursor-pointer"
                            style={{
                              left: pos.left,
                              top: pos.top,
                            }}
                            onClick={() => {
                              audio.playSelect();
                              setSelectedMarker(marker);
                            }}
                          >
                            {/* Marker circle visual */}
                            <div
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border shadow-lg transition-transform duration-200 ${
                                isSelected ? "scale-130 ring-2 ring-val-red ring-offset-2 ring-offset-val-black" : "hover:scale-120"
                              } ${ringColor} ${bgColor}`}
                            >
                              {marker.type === "plant" && (
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                              )}
                              {marker.type === "smoke" && (
                                <Cloud className="w-2 h-2 text-white" />
                              )}
                              {marker.type === "angle" && (
                                <Eye className="w-2 h-2 text-val-black" />
                              )}
                            </div>

                            {/* Floating Hover Label */}
                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-val-dark/95 border border-white/10 text-[8px] font-mono font-bold text-white px-2 py-0.5 rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl uppercase flex items-center space-x-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-val-red" />
                              <span>{marker.label.replace(" Spike Zone", "").replace(" Smoke Choke", "")}</span>
                            </div>
                          </div>
                        );
                      })}
                </div>

                {/* Floating Selected Marker Intel Panel inside map stage */}
                <AnimatePresence>
                  {selectedMarker && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute bottom-3 left-3 right-3 bg-val-dark/95 border border-white/15 rounded-lg p-3.5 shadow-2xl z-30 flex flex-col space-y-1.5 max-w-[95%] mx-auto font-sans"
                    >
                      {/* Top bar with category & close */}
                      <div className="flex justify-between items-center border-b border-white/[0.08] pb-1.5">
                        <span className="font-mono text-[8px] tracking-widest text-val-red uppercase flex items-center gap-1">
                          {selectedMarker.type === "plant" && <Crosshair className="w-3 h-3" />}
                          {selectedMarker.type === "smoke" && <Cloud className="w-3 h-3 text-val-cyan" />}
                          {selectedMarker.type === "angle" && <Eye className="w-3 h-3 text-yellow-400" />}
                          {selectedMarker.type === "lobby" && <MapPin className="w-3 h-3" />}
                          {selectedMarker.type === "callout" && <Info className="w-3 h-3" />}
                          SYSTEM_INTEL // {selectedMarker.type.toUpperCase()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            audio.playClick();
                            setSelectedMarker(null);
                          }}
                          className="font-mono text-[9px] text-gray-500 hover:text-white transition-colors"
                        >
                          [DISMISS]
                        </button>
                      </div>

                      {/* Header */}
                      <div>
                        <h4 className="font-display font-bold text-xs text-white uppercase leading-none">
                          {selectedMarker.label}
                        </h4>
                        <span className="font-mono text-[8px] text-gray-400 mt-1 block">
                          {selectedMarker.subLabel.toUpperCase()}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[10px] text-gray-300 font-light leading-relaxed">
                        {selectedMarker.description}
                      </p>

                      {/* Recommendations */}
                      {selectedMarker.agentSuggestion && (
                        <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.05] p-1.5 rounded text-[8px] font-mono">
                          <span className="text-gray-400">RECOMMENDED OPERATORS:</span>
                          <span className="text-white font-bold uppercase text-right">
                            {selectedMarker.agentSuggestion} ({selectedMarker.abilitySuggestion})
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Coordinates Specs */}
              <div className="p-3 bg-val-dark/50 border-t border-white/[0.05] flex justify-between font-mono text-[9px] text-gray-500">
                <span>COORD SCALE: {selectedMap.xMultiplier.toFixed(6)} : {selectedMap.yMultiplier.toFixed(6)}</span>
                <span>SYSTEM GPS: {selectedMap.coordinates}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT COLUMN: STRATEGIC META AND MAP ANALYSIS (col-span-4) */}
      <div className="xl:col-span-4 space-y-6">
        <AnimatePresence mode="wait">
          {selectedMap && tactics && (
            <motion.div
              key={selectedMap.uuid + "_tactics"}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Winrate stats breakdown chart */}
              <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-4">
                <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider border-b border-white/[0.05] pb-3">
                  SIDES RECON WIN RATES
                </h3>

                <div className="space-y-4">
                  {/* Attacker Winrate */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-val-cyan flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5" /> ATTACK SIDE OVERALL
                      </span>
                      <span className="text-white font-bold">{tactics.attackerWinrate}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2.5 rounded overflow-hidden">
                      <div
                        className="bg-val-cyan h-full transition-all duration-500"
                        style={{ width: `${tactics.attackerWinrate}%` }}
                      />
                    </div>
                  </div>

                  {/* Defender Winrate */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-val-red flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5" /> DEFEND SIDE OVERALL
                      </span>
                      <span className="text-white font-bold">{tactics.defenderWinrate}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2.5 rounded overflow-hidden">
                      <div
                        className="bg-val-red h-full transition-all duration-500"
                        style={{ width: `${tactics.defenderWinrate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended agent Meta Composition */}
              <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-4">
                <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider border-b border-white/[0.05] pb-3">
                  DOMINANT META ROSTER
                </h3>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {tactics.keyComps.map((agentName, idx) => (
                      <span
                        key={idx}
                        className="bg-white/[0.03] border border-white/[0.05] px-2.5 py-1 rounded text-[10px] font-mono text-white flex items-center space-x-1.5 uppercase"
                      >
                        <Award className="w-3.5 h-3.5 text-val-red" />
                        <span>{agentName}</span>
                      </span>
                    ))}
                  </div>
                  <p className="font-sans text-[11px] text-gray-400 font-light leading-relaxed">
                    This selection holds a high 54.3% average tier-lobby win rate on {selectedMap.displayName}, yielding maximum map coverage and site denial.
                  </p>
                </div>
              </div>

              {/* Common Spike plant spots */}
              <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-4">
                <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider border-b border-white/[0.05] pb-3">
                  SPIKE CO-ORD LOCKS
                </h3>

                <div className="space-y-2">
                  {tactics.spikeSpots.map((spot, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white/[0.02] border border-white/[0.05] rounded flex items-start space-x-3"
                    >
                      <MapPin className="w-4 h-4 text-val-cyan shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="font-display font-bold text-xs text-white uppercase">
                          PLANT SPEC {idx === 0 ? "A" : "B"}
                        </div>
                        <p className="font-sans text-[11px] text-gray-400 font-light mt-0.5">
                          {spot}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
