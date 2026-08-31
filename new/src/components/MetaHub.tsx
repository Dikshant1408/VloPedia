/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fetchAgents, Agent } from "../services/valorantService";
import { playSFX } from "../utils/sfx";
import { Shield, Sparkles, Filter, Users, Swords, AlertTriangle, Layers, ThumbsUp, MapPin } from "lucide-react";

interface MetaHubProps {
  subTab: string;
}

export default function MetaHub({ subTab }: MetaHubProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  // Matchup simulation state
  const [agentA, setAgentA] = useState<string>("");
  const [agentB, setAgentB] = useState<string>("");

  // Tier List local override state
  const [tierData, setTierData] = useState<{ [key: string]: string[] }>({
    S: ["Jett", "Viper", "Omen", "Sova"],
    A: ["Raze", "Killjoy", "Fade", "KAY/O", "Cypher", "Gekko"],
    B: ["Reyna", "Brimstone", "Sage", "Chamber", "Breach", "Neon"],
    C: ["Astra", "Yoru", "Harbor", "Deadlock", "Iso"]
  });

  useEffect(() => {
    async function loadAgents() {
      try {
        const data = await fetchAgents();
        setAgents(data);
        
        // Initialize default select option
        if (data.length > 1) {
          setAgentA(data[0].uuid);
          setAgentB(data[1].uuid);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAgents();
  }, []);

  const handleMoveTier = (agentName: string, targetTier: string) => {
    const updated = { ...tierData };
    // Remove from existing tiers
    Object.keys(updated).forEach((tier) => {
      updated[tier] = updated[tier].filter((a) => a !== agentName);
    });
    // Add to target
    updated[targetTier].push(agentName);
    setTierData(updated);
    playSFX.tick();
  };

  // 1. INTERACTIVE TIER LIST BUILDER
  if (subTab === "tier-list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >

        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="eyebrow mb-2">
              <span className="w-2 h-2 bg-[#FA4454]" />
              <span>META ANALYTICS</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#ECE8E1] tracking-tighter">
              AGENT COMPETITIVE TIER LIST
            </h2>
            <p className="text-white/50 text-sm max-w-xl mt-2">
              Current competitive meta ratings. Click on any Agent card to dynamically shift their tier assignment.
            </p>
          </div>
        </div>

        {/* Interactive Tier Builder */}
        <div className="space-y-4 mb-10">
          {["S", "A", "B", "C"].map((tier) => {
            const colors: { [key: string]: string } = {
              S: "bg-[#FA4454]/20 border-[#FA4454] text-[#FA4454]",
              A: "bg-[#0DF2F2]/20 border-[#0DF2F2] text-[#0DF2F2]",
              B: "bg-[#ECE8E1]/10 border-white/30 text-white/80",
              C: "bg-white/5 border-white/10 text-white/40"
            };

            return (
              <div 
                key={tier}
                className="flex border border-white/10 bg-[#0B141A]/85 clip-diagonal-sm"
              >
                {/* Tier Badge */}
                <div className={`w-24 sm:w-32 flex items-center justify-center font-display font-black text-3xl border-r border-white/10 ${colors[tier]}`}>
                  {tier}
                </div>

                {/* Tier Contents */}
                <div className="flex-1 p-4 flex flex-wrap gap-3 min-h-[80px] bg-[#0B141A]/85 border border-white/10 rounded-br-xl rounded-tr-xl">
                  {tierData[tier].map((agentName) => {
                    const agent = agents.find((a) => a.displayName.toUpperCase() === agentName.toUpperCase());
                    return (
                      <div 
                        key={agentName}
                        className="group relative flex items-center gap-2 bg-[#0B141A] border border-white/10 px-3 py-1.5 hover:border-[#FA4454]/40 transition-all clip-diagonal-sm"
                      >
                        {agent?.displayIconSmall && (
                          <img 
                            src={agent.displayIconSmall} 
                            alt={agentName} 
                            className="w-6 h-6 object-contain"
                            referrerPolicy="no-referrer"
                          />
                        )}
          <span className="font-mono text-xs text-white tracking-wider font-bold">
            {agentName}
          </span>

                        {/* Interactive Move Popup on hover */}
                        <div className="absolute left-0 right-0 bottom-full mb-1 hidden group-hover:flex justify-center gap-1 bg-[#0B141A] border border-white/20 p-1 z-30 shadow-lg">
                          {["S", "A", "B", "C"].map((t) => (
                            <button
                              key={t}
                              onClick={() => handleMoveTier(agentName, t)}
                              className="w-5 h-5 text-[10px] font-mono bg-white/5 hover:bg-[#FA4454] hover:text-white rounded-xs"
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {tierData[tier].length === 0 && (
                    <span className="font-mono text-xs text-white/20 self-center uppercase italic">Tier Empty // Drop agents here</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // 2. META COMPS VISUALIZER
  if (subTab === "comps") {
    const mapsMetaComps = [
      {
        map: "ASCENT",
        compName: "Standard Double Initiator",
        composition: ["Jett", "Omen", "Sova", "KAY/O", "Killjoy"],
        synergy: "98% Tactical Synergy",
        strat: "The golden standard for Ascent. Jett opens bombsites with Omen's smokes while Sova and KAY/O execute heavy recon flushes. Killjoy provides tight B-site defensive lockouts.",
        color: "#FA4454"
      },
      {
        map: "BIND",
        compName: "Double Controller Teleport Strategy",
        composition: ["Raze", "Viper", "Brimstone", "Skye", "Fade"],
        synergy: "94% Tactical Synergy",
        strat: "High-level zone denial. Viper coordinates toxic walls across short areas, while Brimstone executes rapid 3-smoke hits. Raze utilizes blast-packs on tight sites to trade Skye/Fade scouts.",
        color: "#0DF2F2"
      },
      {
        map: "HAVEN",
        compName: "Triple Site Flex Control",
        composition: ["Jett", "Omen", "Sova", "Breach", "Killjoy"],
        synergy: "91% Tactical Synergy",
        strat: "Perfect for Haven's 3-site configuration. Breach coordinates stun lines on A-long or C-garage, letting Sova gather rapid recon information. Killjoy secures C-site single-handedly.",
        color: "#ECE8E1"
      },
      {
        map: "SPLIT",
        compName: "Sage Barrier & Duel Duelist Meta",
        composition: ["Raze", "Jett", "Omen", "Sage", "Cypher"],
        synergy: "89% Tactical Synergy",
        strat: "Heavily defensive layout. Sage sections off Mid-vents with barrier walls, while Cypher coordinates camera lines on B. Raze and Jett push A-main aggressively to secure quick map control.",
        color: "#FA4454"
      }
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="mb-10">
          <div className="eyebrow mb-2">
            <span className="w-2 h-2 bg-[#FA4454]" />
            <span>TEAM COMPOSITIONS</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#ECE8E1] tracking-tighter">
            TACTICAL META COMPS
          </h2>
          <p className="text-white/50 text-sm max-w-xl mt-2">
            Analyze professional esports and radiant compositions. Coordinate utility pairings across various active tactical map designs.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {mapsMetaComps.map((comp) => (
            <div 
              key={comp.map}
              className="surface-glass border-[rgba(236,232,225,0.12)] p-6 clip-diagonal-sm hover:border-[#FA4454]/40 hover:bg-[#FA4454]/5 flex flex-col justify-between group relative"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[#FA4454] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div>
                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0DF2F2]" />
                    <span className="font-display font-black text-lg text-white tracking-widest">{comp.map}</span>
                  </div>
                  <span className="font-mono text-xs text-[#FA4454] font-semibold uppercase">{comp.synergy}</span>
                </div>

                <h3 className="font-display font-bold text-base text-[#0DF2F2] mb-3">
                  {comp.compName}
                </h3>

                {/* Team Roster Avatars Display */}
                <div className="flex flex-wrap gap-4 my-4">
                  {comp.composition.map((agentName) => {
                    const agent = agents.find((a) => a.displayName.toUpperCase() === agentName.toUpperCase());
                    return (
                      <div key={agentName} className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-white/[0.02] border border-white/10 rounded-full flex items-center justify-center p-1 overflow-hidden hover:border-[#FA4454] transition-colors">
                          {agent?.displayIconSmall ? (
                            <img 
                              src={agent.displayIconSmall} 
                              alt={agentName} 
                              className="w-10 h-10 object-contain rounded-full"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="font-mono text-xs font-bold">{agentName[0]}</span>
                          )}
                        </div>
                        <span className="font-mono text-[9px] text-white/50 uppercase mt-1">{agentName}</span>
                      </div>
                    );
                  })}
                </div>

                <p className="text-white/60 text-xs leading-relaxed mt-4 bg-white/[0.01] border border-white/5 p-4 rounded-xs">
                  {comp.strat}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // 3. AGENT MATCHUPS MATRIX
  if (subTab === "matchups") {
    const selectedAgentA = agents.find((a) => a.uuid === agentA);
    const selectedAgentB = agents.find((a) => a.uuid === agentB);

    // Dynamic procedural matchup calculation based on agent names / roles
    const getWinRate = (nameA?: string, nameB?: string) => {
      if (!nameA || !nameB) return "50.0%";
      const seed = nameA.charCodeAt(0) + nameB.charCodeAt(1);
      const wr = 42 + (seed % 17);
      return `${wr.toFixed(1)}%`;
    };

    const getMatchupVerdict = (roleA?: string, roleB?: string) => {
      if (roleA === roleB) {
        return "Skill-check dominant. Rely heavily on utility timing and communication triggers.";
      }
      if (roleA === "Duelist" && roleB === "Sentinel") {
        return "Sentinel favored on defense. Sentinel traps deny direct entry, forcing heavy double-initiator utility setups.";
      }
      if (roleA === "Sentinel" && roleB === "Duelist") {
        return "Sentinel favored. Coordinate barrier lines and trip lines to catch over-aggressive site entries.";
      }
      if (roleA === "Controller" && roleB === "Initiator") {
        return "Controller favored in post-plants. Smokes block direct recon lines, securing defuse cover options.";
      }
      return "Balanced matchup. Leverage map elevation and tactical coordinate setups.";
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="mb-10">
          <div className="eyebrow mb-2">
            <span className="w-2 h-2 bg-[#FA4454]" />
            <span>SIMULATOR DECK</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#ECE8E1] tracking-tighter">
            TACTICAL AGENT MATCHUPS
          </h2>
          <p className="text-white/50 text-sm max-w-xl mt-2">
            Simulate 1v1 tactical engagements. Analyze win-rate matrices, counter parameters, and tactical advantages.
          </p>
        </div>

        {/* Selection Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Agent A Selector */}
          <div className="bg-[#0B141A]/90 border border-white/10 p-6 clip-diagonal">
            <label className="font-mono text-xs text-[#FA4454] tracking-widest block mb-2">CHOOSE FIRST AGENT (A)</label>
            <select
              value={agentA}
              onChange={(e) => { setAgentA(e.target.value); playSFX.tick(); }}
              className="w-full bg-[#0B141A] border border-white/10 text-white p-3 font-mono text-xs focus:outline-none uppercase"
            >
              {agents.map((a) => (
                <option key={a.uuid} value={a.uuid}>
                  {a.displayName} ({a.role?.displayName || "AGENT"})
                </option>
              ))}
            </select>

            {selectedAgentA && (
              <div className="flex items-center gap-4 mt-6">
                {selectedAgentA.displayIconSmall && (
                  <img src={selectedAgentA.displayIconSmall} alt={selectedAgentA.displayName} className="w-12 h-12" referrerPolicy="no-referrer" />
                )}
                <div>
                  <h4 className="font-display font-black text-lg text-white uppercase">{selectedAgentA.displayName}</h4>
                  <span className="font-mono text-[10px] text-white/50 uppercase">{selectedAgentA.role?.displayName}</span>
                </div>
              </div>
            )}
          </div>

          {/* Agent B Selector */}
          <div className="bg-[#0B141A]/90 border border-white/10 p-6 clip-diagonal">
            <label className="font-mono text-xs text-[#0DF2F2] tracking-widest block mb-2">CHOOSE SECOND AGENT (B)</label>
            <select
              value={agentB}
              onChange={(e) => { setAgentB(e.target.value); playSFX.tick(); }}
              className="w-full bg-[#0B141A] border border-white/10 text-white p-3 font-mono text-xs focus:outline-none uppercase"
            >
              {agents.map((a) => (
                <option key={a.uuid} value={a.uuid}>
                  {a.displayName} ({a.role?.displayName || "AGENT"})
                </option>
              ))}
            </select>

            {selectedAgentB && (
              <div className="flex items-center gap-4 mt-6">
                {selectedAgentB.displayIconSmall && (
                  <img src={selectedAgentB.displayIconSmall} alt={selectedAgentB.displayName} className="w-12 h-12" referrerPolicy="no-referrer" />
                )}
                <div>
                  <h4 className="font-display font-black text-lg text-white uppercase">{selectedAgentB.displayName}</h4>
                  <span className="font-mono text-[10px] text-white/50 uppercase">{selectedAgentB.role?.displayName}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Matchup Report Verdict */}
        {selectedAgentA && selectedAgentB && (
          <div className="border border-white/10 bg-[#0B141A]/95 p-8 clip-diagonal text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#FA4454] via-white/20 to-[#0DF2F2]" />
            <span className="font-mono text-xs text-white/40 tracking-widest block mb-2 uppercase">PROTOCOL ENGAGEMENT VERDICT</span>
            
            <div className="flex justify-center items-center gap-6 sm:gap-12 my-6">
              <span className="font-display font-black text-3xl sm:text-4xl text-[#FA4454]">{selectedAgentA.displayName.toUpperCase()}</span>
              <div className="text-center bg-white/5 border border-white/10 p-3 clip-diagonal-sm min-w-[100px]">
                <span className="font-mono text-[9px] text-white/30 block">COUNTER INDEX</span>
                <span className="font-mono text-xl font-black text-[#0DF2F2]">{getWinRate(selectedAgentA.displayName, selectedAgentB.displayName)}</span>
              </div>
              <span className="font-display font-black text-3xl sm:text-4xl text-[#0DF2F2]">{selectedAgentB.displayName.toUpperCase()}</span>
            </div>

            <div className="max-w-xl mx-auto border-t border-white/5 pt-4">
              <span className="font-mono text-[10px] text-[#FA4454] tracking-widest block mb-1 font-bold uppercase">STRATEGIC ALIGNMENT</span>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                {getMatchupVerdict(selectedAgentA.role?.displayName, selectedAgentB.role?.displayName)}
              </p>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return null;
}
