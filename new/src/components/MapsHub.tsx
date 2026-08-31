/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapData, fetchMaps } from "../services/valorantService";
import { playSFX } from "../utils/sfx";
import { Crosshair, MapPin, Compass, Info, ArrowLeft, Maximize } from "lucide-react";

export default function MapsHub() {
  const [maps, setMaps] = useState<MapData[]>([]);
  const [selectedMap, setSelectedMap] = useState<MapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const data = await fetchMaps();
      // Filter out duplicate or training range maps if necessary, or keep all
      const uniqueMaps = data.filter(
        (map, index, self) => self.findIndex((m) => m.uuid === map.uuid) === index
      );
      setMaps(uniqueMaps);
      setIsLoading(false);
    }
    load();
  }, []);

  const handleMapSelect = (map: MapData) => {
    playSFX.selectSurge();
    setSelectedMap(map);
  };

  return (
    <div className="w-full min-h-screen pt-4 pb-20 relative">
      <div className="absolute inset-0 pointer-events-none tactical-grid-bg opacity-[0.2]" />

      <AnimatePresence mode="wait">
        {!selectedMap ? (
          /* ALL MAPS LIST VIEW */
          <motion.div
            key="maps-grid"
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
                  <span className="eyebrow">GEOSPATIAL REGISTRY</span>
                </span>
                <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight uppercase flex items-center mt-1">
                  TACTICAL MAPS
                  <span className="w-2.5 h-2.5 bg-[#0DF2F2] ml-3 rounded-full animate-pulse" />
                </h1>
                <p className="font-mono text-xs text-white/40 mt-1 max-w-lg leading-relaxed">
                  Decoupled topological schematics registry. Inspect coordinate systems, regional descriptions, and high-fidelity tactical layout maps.
                </p>
              </div>
            </div>

            {/* Grid layout */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-40 space-y-4">
                <div className="relative w-16 h-16 border-2 border-white/5 rounded-full flex items-center justify-center">
                  <div className="absolute inset-0 border-2 border-[#FA4454] border-t-transparent rounded-full animate-spin" />
                  <Crosshair className="w-6 h-6 text-[#FA4454] animate-pulse" />
                </div>
                <span className="font-mono text-xs text-white/40 animate-pulse tracking-widest">
                  Loading maps...
                </span>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {maps.map((map) => {
                  return (
                    <motion.div
                      key={map.uuid}
                      onClick={() => handleMapSelect(map)}
                      whileHover={{ y: -6, transition: { duration: 0.2 } }}
                      className="bg-[#0B141A]/95 border border-[rgba(236,232,225,0.08)] hover:border-[#FA4454]/40 hover:bg-[#FA4454]/5 transition-colors duration-300 p-0 clip-diagonal relative group cursor-none interactive-tactical flex flex-col justify-end h-80 overflow-hidden"
                    >
                      {/* Hover accent bar */}
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#FA4454] opacity-0 group-hover:opacity-100 transition-opacity" />
                      {/* Full Splash Image */}
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-100 group-hover:scale-105"
                        style={{ backgroundImage: `url(${map.splash})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B141A] via-[#0B141A]/40 to-transparent opacity-95 group-hover:opacity-80 transition-opacity duration-300" />

                      {/* Coordinates overlay at top */}
                      {map.coordinates && (
                        <span className="corner-chip">
                          {map.coordinates}
                        </span>
                      )}

                      {/* Display Info Card */}
                      <div className="relative z-10 p-6 flex flex-col space-y-2">
                <span className="font-mono text-[8px] text-[#FA4454] tracking-widest font-bold block uppercase select-none pointer-events-none">
                  {map.displayName.slice(0, 3)}
                </span>
                        
                        <h3 className="font-display font-black text-3xl text-white tracking-tight uppercase flex items-baseline select-none pointer-events-none">
                          {map.displayName}
                        </h3>

                        {map.tacticalDescription && (
                          <p className="font-mono text-[10px] text-white/50 uppercase select-none pointer-events-none tracking-tight">
                            {map.tacticalDescription}
                          </p>
                        )}
                      </div>

                      {/* Decors */}
                      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 group-hover:border-[#FA4454]/60 transition-all pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/10 group-hover:border-[#FA4454]/60 transition-all pointer-events-none" />
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* MAP INSPECT VIEW WITH MINIMAP OVERLAY */
          <motion.div
            key="map-inspector"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center py-6 border-b border-white/10 mb-8 mt-4">
              <button
                onClick={() => {
                  playSFX.tick();
                  setSelectedMap(null);
                }}
                className="flex items-center space-x-2 px-4 py-2 border border-white/10 bg-[#0B141A]/80 hover:border-[#FA4454] hover:text-[#FA4454] text-white/70 font-mono text-xs tracking-widest uppercase transition-all clip-diagonal-sm cursor-none interactive-tactical"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>RETURN TO MAPS</span>
              </button>

              <span className="w-2 h-2 rounded-full bg-[#0DF2F2]" />
            </div>

            {/* Immersive Splash Dossier layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Column: Dossier Details & Coordinates (Grid 5) */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                 <div className="bg-[#0B141A]/95 border border-white/10 p-6 clip-diagonal relative flex-1">
                  <div className="absolute top-2 right-4 text-white/[0.02] font-black text-6xl font-display">
                    MAP
                  </div>

                  <span className="eyebrow mb-1">TOPOGRAPHY SPECIFICATION CARD</span>
                  <h2 className="font-display font-black text-5xl text-white tracking-tighter uppercase mb-2">
                    {selectedMap.displayName}
                  </h2>

                  {selectedMap.coordinates && (
                    <div className="flex items-center space-x-2 bg-white/[0.04] px-3 py-1.5 rounded-sm border border-white/5 inline-flex mb-4">
                      <MapPin className="w-3.5 h-3.5 text-[#0DF2F2]" />
                      <span className="font-mono text-xs font-bold text-[#0DF2F2] tracking-wider uppercase">
                        {selectedMap.coordinates}
                      </span>
                    </div>
                  )}

                  {/* Descriptions */}
                  <div className="space-y-4 mt-4 border-t border-white/5 pt-6">
                    <div>
                      <h4 className="font-mono text-[10px] text-[#FA4454] tracking-widest font-bold uppercase mb-1">
                        TACTICAL OVERVIEW
                      </h4>
                      <p className="font-sans text-sm text-white/70 leading-relaxed font-light">
                        {selectedMap.tacticalDescription || "Operational theater layout optimized for standard multi-site planting and extraction protocols."}
                      </p>
                    </div>

                    {selectedMap.narrativeDescription && (
                      <div>
                        <h4 className="font-mono text-[10px] text-[#0DF2F2] tracking-widest font-bold uppercase mb-1">
                          NARRATIVE DISPATCH
                        </h4>
                        <p className="font-sans text-xs text-white/50 leading-relaxed font-light italic">
                          "{selectedMap.narrativeDescription}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tactical Measurement Box */}
                <div className="bg-[#0B141A]/95 border border-white/10 p-6 clip-diagonal relative select-none pointer-events-none">
                  <span className="font-mono text-[10px] text-white/40 tracking-widest font-bold block mb-3">
                    VECTOR MEASUREMENTS // SCALE
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col border-l border-white/10 pl-3">
                      <span className="font-mono text-[9px] text-white/40 uppercase">MULTIPLIER X</span>
                      <span className="font-mono text-xs font-bold text-[#0DF2F2]">{selectedMap.xMultiplier.toFixed(6)}</span>
                    </div>
                    <div className="flex flex-col border-l border-white/10 pl-3">
                      <span className="font-mono text-[9px] text-white/40 uppercase">MULTIPLIER Y</span>
                      <span className="font-mono text-xs font-bold text-[#0DF2F2]">{selectedMap.yMultiplier.toFixed(6)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Immersive Layout minimap and Splash overlay (Grid 7) */}
              <div className="lg:col-span-7 bg-[#0B141A]/95 border border-white/10 clip-diagonal relative min-h-[450px] lg:min-h-[500px] flex items-center justify-center p-8 overflow-hidden">
                {/* Background wallpaper with blur and overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center filter blur-md opacity-40 scale-105"
                  style={{ backgroundImage: `url(${selectedMap.splash})` }}
                />
                <div className="absolute inset-0 bg-[#0B141A]/85" />

                {/* Tactical minimap vector display */}
                <div className="relative max-w-sm w-full aspect-square z-10 flex items-center justify-center bg-black/65 border border-white/10 p-6 rounded-md clip-diagonal relative group">
                  {selectedMap.displayIcon ? (
                    <img
                      src={selectedMap.displayIcon}
                      alt={`${selectedMap.displayName} Radar`}
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full object-contain filter invert drop-shadow-[0_0_10px_rgba(13,242,242,0.4)] group-hover:scale-105 transition-transform duration-500 select-none"
                    />
                  ) : (
                    /* Holographic blueprint missing map layout fallback */
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <Compass className="w-16 h-16 text-[#FA4454] animate-pulse" />
                      <span className="font-mono text-xs text-white/40">VECTOR LAYOUT CLASSIFIED</span>
                    </div>
                  )}

                  {/* Miniature radar telemetry HUD info */}
                  <div className="absolute bottom-3 right-3 text-right">
                    <span className="font-mono text-[8px] text-[#0DF2F2]/40 block tracking-widest uppercase">MINIMAP_GRID</span>
                    <span className="font-mono text-[10px] text-[#0DF2F2] font-bold uppercase">{selectedMap.displayName} RADAR</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
