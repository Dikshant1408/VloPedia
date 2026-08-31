/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Agent, fetchAgents } from "../services/valorantService";
import { useTextDecoder } from "../hooks/useTextDecoder";
import { playSFX } from "../utils/sfx";
import { Shield, Volume2, Sparkles, Target, Crosshair, HelpCircle, ArrowLeft, Layers } from "lucide-react";
import TiltCard from "./TiltCard";

// Individual Agent Card Component with custom hovering and decoder integration
interface AgentCardProps {
  agent: Agent;
  onSelect: () => void;
  key?: string;
}

function AgentCard({ agent, onSelect }: AgentCardProps) {
  const { displayText, trigger } = useTextDecoder(agent.displayName.toUpperCase());

  const handleMouseEnter = () => {
    playSFX.hoverClick();
    trigger();
  };

  const roleName = agent.role?.displayName || "AGENT";

  // Match the first gradient color or fallback
  const accentColor = agent.backgroundGradientColors?.[0]
    ? `#${agent.backgroundGradientColors[0].slice(0, 6)}`
    : "#FA4454";

  return (
    <motion.div
      layoutId={`agent-container-${agent.uuid}`}
      className="h-96"
    >
      <TiltCard
        onClick={() => {
          playSFX.selectSurge();
          onSelect();
        }}
        onMouseEnter={handleMouseEnter}
        className="relative h-full bg-[#0B141A]/90 border border-[rgba(236,232,225,0.08)] hover:border-[#FA4454]/40 hover:bg-[#FA4454]/5 transition-colors duration-300 overflow-hidden group clip-diagonal-sm cursor-none interactive-tactical flex flex-col justify-end p-6"
        maxTilt={12}
      >
        {/* Dynamic Background Grid and Gradient glow */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 group-hover:opacity-45 transition-opacity duration-500 scale-105 group-hover:scale-100" style={{ backgroundImage: agent.background ? `url(${agent.background})` : "none" }} />
        <div 
          className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-500 bg-radial at-bottom-left"
          style={{
            backgroundImage: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`
          }}
        />
        
        {/* Background large role or code */}
        <div className="absolute top-2 right-4 text-white/[0.03] font-black text-6xl select-none font-display tracking-tighter">
          0{agent.displayName.charCodeAt(0) % 10}
        </div>

        {/* Hover accent bar */}
        <div className="absolute top-0 left-0 w-1 h-full bg-[#FA4454] opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Full Body Portrait */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {agent.fullPortraitV2 || agent.fullPortrait ? (
            <motion.img
              src={agent.fullPortraitV2 || agent.fullPortrait || ""}
              alt={agent.displayName}
              referrerPolicy="no-referrer"
              className="h-[110%] w-auto object-contain object-bottom select-none translate-y-6 group-hover:translate-y-2 group-hover:scale-105 transition-all duration-500 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
            />
          ) : (
            /* Tactical Outline Fallback */
            <div className="w-40 h-40 border border-dashed border-white/10 rounded-full flex items-center justify-center animate-spin-slow">
              <Crosshair className="w-12 h-12 text-white/10" />
            </div>
          )}
        </div>

        {/* Info card at the bottom */}
        <div className="relative z-10 flex flex-col">
          {/* Role label */}
          <div className="flex items-center space-x-1.5 mb-1 bg-black/60 py-0.5 px-2 self-start rounded-xs border border-white/5">
            {agent.role?.displayIcon ? (
              <img src={agent.role.displayIcon} alt={roleName} className="w-3 h-3 invert" referrerPolicy="no-referrer" />
            ) : (
              <Layers className="w-3 h-3 text-[#0DF2F2]" />
            )}
            <span className="font-mono text-[9px] text-[#0DF2F2] tracking-wider uppercase">
              {roleName}
            </span>
          </div>

          {/* Decoder Name display */}
          <h3 className="font-display font-black text-2xl text-[#ECE8E1] tracking-tight flex items-baseline">
            {displayText}
            <span className="w-1.5 h-1.5 bg-[#FA4454] ml-1.5 inline-block group-hover:animate-ping" />
          </h3>
        </div>

        {/* Top right tactical corner wire */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/20 pointer-events-none group-hover:border-[#FA4454]/60 transition-colors" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/20 pointer-events-none group-hover:border-[#FA4454]/60 transition-colors" />
      </TiltCard>
    </motion.div>
  );
}

export default function AgentsHub() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeRole, setActiveRole] = useState<string>("ALL");
  const [selectedAbility, setSelectedAbility] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [playingVoice, setPlayingVoice] = useState(false);

  // Load Agents
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const data = await fetchAgents();
      // Filter duplicate agents just in case
      const uniqueAgents = data.filter(
        (agent, index, self) => self.findIndex((a) => a.uuid === agent.uuid) === index
      );
      setAgents(uniqueAgents);
      setIsLoading(false);
    }
    load();
  }, []);

  // Filter list of roles based on Agents
  const roles: string[] = ["ALL", ...Array.from(new Set(agents.map((a) => a.role?.displayName).filter(Boolean) as string[]))];

  const filteredAgents = agents.filter((agent) => {
    if (activeRole === "ALL") return true;
    return agent.role?.displayName === activeRole;
  });

  // Handle Voice Line Playback using standard Audio element
  const playVoiceLine = (agent: Agent) => {
    if (!agent.voiceLine || !agent.voiceLine.mediaList?.length) return;
    const audioUrl = agent.voiceLine.mediaList[0].wave;
    if (!audioUrl) return;

    try {
      setPlayingVoice(true);
      playSFX.scanBeep();
      const audio = new Audio(audioUrl);
      audio.volume = 0.6;
      audio.play();
      audio.onended = () => setPlayingVoice(false);
      audio.onerror = () => setPlayingVoice(false);
    } catch (e) {
      setPlayingVoice(false);
    }
  };

  // Sound effects on filters
  const handleRoleFilterSelect = (role: string) => {
    playSFX.tick();
    setActiveRole(role);
  };

  // Reset selected ability when switching agents
  const selectAgentHandler = (agent: Agent) => {
    setSelectedAgent(agent);
    setSelectedAbility(0);
  };

  return (
    <div className="w-full min-h-screen pt-4 pb-20 relative">
      {/* Dynamic scan grid layout overlay */}
      <div className="absolute inset-0 pointer-events-none tactical-grid-bg opacity-[0.2]" />

      <AnimatePresence mode="wait">
        {!selectedAgent ? (
          /* GRID VIEW */
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
          >
            {/* Tactical Grid Filter Panel */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/10 pb-8 mb-12 mt-6">
              <div>
                <span className="flex items-center space-x-2 mb-1">
                  <span className="w-2 h-2 bg-[#FA4454]" />
                  <span className="eyebrow">DATABASE ONLINE</span>
                </span>
                <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight uppercase flex items-center mt-1">
                  TACTICAL PROTOCOL
                  <span className="w-2.5 h-2.5 bg-[#0DF2F2] ml-3 rounded-full animate-pulse" />
                </h1>
                <p className="font-mono text-xs text-white/40 mt-1 max-w-lg leading-relaxed">
                  Decoupled cryptographic profile intelligence interface covering combat roster protocols, mechanical ratings, and operational ability metrics.
                </p>
              </div>

              {/* Filtering Menu */}
              <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
                {roles.map((role) => {
                  const isActive = activeRole === role;
                  return (
                    <button
                      key={role}
                      onClick={() => handleRoleFilterSelect(role!)}
                      className={`px-4 py-2 font-mono text-[11px] tracking-widest uppercase border transition-all duration-300 clip-diagonal-sm cursor-none interactive-tactical ${
                        isActive
                          ? "bg-[#FA4454] border-[#FA4454] text-white text-glow-red"
                          : "bg-[#0B141A]/60 border-[rgba(236,232,225,0.08)] hover:border-[#0DF2F2] hover:text-[#0DF2F2] text-white/60"
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Loading Roster */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-40 space-y-4">
                <div className="relative w-16 h-16 border-2 border-white/5 rounded-full flex items-center justify-center">
                  <div className="absolute inset-0 border-2 border-[#FA4454] border-t-transparent rounded-full animate-spin" />
                  <Crosshair className="w-6 h-6 text-[#FA4454] animate-pulse" />
                </div>
                <span className="font-mono text-xs text-white/40 animate-pulse tracking-widest">
                  Loading agents...
                </span>
              </div>
            ) : (
              /* Asymmetric Bento-like grid of agents */
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
              >
                {filteredAgents.map((agent) => (
                  <AgentCard
                    key={agent.uuid}
                    agent={agent}
                    onSelect={() => selectAgentHandler(agent)}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* IMMERSIVE DETAILED BREAKDOWN */
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
          >
            {/* Floating Navigation Header */}
            <div className="flex justify-between items-center py-6 border-b border-white/10 mb-8 mt-4">
              <button
                onClick={() => {
                  playSFX.tick();
                  setSelectedAgent(null);
                }}
                className="flex items-center space-x-2 px-4 py-2 border border-white/10 bg-[#0B141A]/80 hover:border-[#FA4454] hover:text-[#FA4454] text-white/70 font-mono text-xs tracking-widest uppercase transition-all clip-diagonal-sm cursor-none interactive-tactical"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>RETURN TO ROSTER</span>
              </button>

            </div>

            {/* Immersive Profile Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative min-h-[70vh]">
              {/* Left Column: Abilities & Biometric Spec (Grid 5) */}
              <div className="lg:col-span-5 space-y-6 z-10">
                {/* Agent Tactical Callout */}
                <div className="bg-[#0B141A]/95 border border-white/10 p-6 clip-diagonal relative">
                  <div className="absolute top-0 right-0 w-16 h-16 flex items-center justify-center text-white/[0.02] font-black text-6xl">
                    0{selectedAgent.displayName.length}
                  </div>
                  
                  <span className="eyebrow mb-1">AGENT SPECIFICATION CARD</span>
                  <h2 className="font-display font-black text-5xl text-[#ECE8E1] tracking-tighter uppercase mb-2">
                    {selectedAgent.displayName}
                  </h2>

                  {/* Role with icon */}
                  {selectedAgent.role && (
                    <div className="flex items-center space-x-2.5 bg-white/[0.04] px-3 py-1.5 rounded-sm border border-white/5 inline-flex mb-4">
                      {selectedAgent.role.displayIcon ? (
                        <img
                          src={selectedAgent.role.displayIcon}
                          alt={selectedAgent.role.displayName}
                          className="w-4 h-4 invert"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Layers className="w-4 h-4 text-[#0DF2F2]" />
                      )}
                      <span className="font-mono text-xs font-bold text-[#0DF2F2] tracking-wider uppercase">
                        {selectedAgent.role.displayName}
                      </span>
                    </div>
                  )}

                  <p className="font-sans text-sm text-white/70 leading-relaxed font-light">
                    {selectedAgent.description}
                  </p>

                  {/* Play Voice Line SFX */}
                  {selectedAgent.voiceLine && (
                    <button
                      onClick={() => playVoiceLine(selectedAgent)}
                      className={`mt-4 px-4 py-2.5 border flex items-center space-x-2.5 font-mono text-[11px] tracking-widest uppercase transition-all duration-300 clip-diagonal-sm cursor-none interactive-tactical w-full justify-center ${
                        playingVoice
                          ? "bg-[#FA4454] border-[#FA4454] text-white text-glow-red animate-pulse"
                          : "bg-white/[0.03] border-white/10 hover:border-[#0DF2F2] hover:text-[#0DF2F2] text-white/80"
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{playingVoice ? "BROADCASTING COMPONENT..." : "DECRYPT VOICE TRANSMISSION"}</span>
                    </button>
                  )}
                </div>

                {/* Abilities Selector Matrix */}
                <div className="bg-[#0B141A]/95 border border-white/10 p-6 clip-diagonal space-y-4">
                  <span className="font-mono text-[10px] text-white/40 tracking-widest font-bold block">
                    TACTICAL RESOURCE PROTOCOLS (ABILITIES)
                  </span>

                  {/* Row of custom Ability Icons */}
                  <div className="grid grid-cols-4 gap-3">
                    {selectedAgent.abilities.map((ability, idx) => {
                      const isSelected = selectedAbility === idx;
                      return (
                        <button
                          key={ability.slot + idx}
                          onClick={() => {
                            playSFX.tick();
                            setSelectedAbility(idx);
                          }}
                          className={`h-16 border rounded-sm flex items-center justify-center transition-all relative cursor-none interactive-tactical ${
                            isSelected
                              ? "bg-[#FA4454]/15 border-[#FA4454]"
                              : "bg-white/[0.02] border-white/10 hover:border-[#0DF2F2]/60 hover:bg-[#0DF2F2]/5"
                          }`}
                        >
                          {ability.displayIcon ? (
                            <img
                              src={ability.displayIcon}
                              alt={ability.displayName}
                              className={`w-9 h-9 object-contain transition-transform ${
                                isSelected ? "scale-110 filter drop-shadow-[0_0_5px_rgba(250,68,84,0.5)] invert" : "opacity-60 hover:opacity-90 hover:scale-105"
                              }`}
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="font-mono font-bold text-xs">
                              {ability.slot.slice(-1)}
                            </span>
                          )}
                          <div
                            className={`absolute bottom-1 right-1 font-mono text-[8px] text-white/40`}
                          >
                            Q{idx + 1}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Ability Information */}
                  {selectedAgent.abilities[selectedAbility] && (
                    <motion.div
                      key={selectedAbility}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border-t border-white/5 pt-4 mt-2 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-black text-lg text-white tracking-tight uppercase">
                          {selectedAgent.abilities[selectedAbility].displayName}
                        </h4>
                        <span className="font-mono text-[9px] text-[#0DF2F2] border border-[#0DF2F2]/20 px-2 py-0.5 rounded-xs uppercase">
                          {selectedAgent.abilities[selectedAbility].slot}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-white/60 leading-relaxed font-light">
                        {selectedAgent.abilities[selectedAbility].description}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Middle/Right Column: Stunning Immersive WebGL Profile Stage (Grid 7) */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[500px] lg:min-h-[600px]">
                {/* Immersive backdrop with custom Agent gradient colors */}
                <div
                  className="absolute inset-0 rounded-full blur-[120px] opacity-25 -z-10 mix-blend-screen transition-all duration-700"
                  style={{
                    background: `radial-gradient(circle, #${
                      selectedAgent.backgroundGradientColors?.[0]?.slice(0, 6) || "FA4454"
                    } 0%, transparent 70%)`,
                  }}
                />

                {/* Big Display Text in page background (Stroked name) */}
                <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none -z-10">
                  <span className="font-display font-black text-[12vw] tracking-tighter uppercase custom-text-stroke leading-none select-none opacity-40">
                    {selectedAgent.displayName}
                  </span>
                </div>

                {/* Main Fullportrait Visual */}
                <div className="relative w-full h-full max-w-lg lg:h-[550px] flex items-end justify-center">
                  {selectedAgent.fullPortraitV2 || selectedAgent.fullPortrait ? (
                    <motion.img
                      initial={{ opacity: 0, scale: 0.9, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 70, damping: 15 }}
                      src={selectedAgent.fullPortraitV2 || selectedAgent.fullPortrait || ""}
                      alt={selectedAgent.displayName}
                      referrerPolicy="no-referrer"
                      className="max-h-full w-auto object-contain select-none filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] z-10 hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    /* Large holographic tactical wireframe blueprint fallback */
                    <div className="relative flex flex-col items-center justify-center h-96 w-96 border border-white/5 bg-[#0B141A]/60 rounded-full animate-spin-slow">
                      <Crosshair className="w-16 h-16 text-[#FA4454]/40" />
                      <div className="absolute inset-4 border border-dashed border-[#0DF2F2]/20 rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
