/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  Sparkles,
  Shield,
  Zap,
  Target,
  Search,
  Eye,
  MessageSquare,
  HelpCircle,
  AlertTriangle,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  VolumeX,
  Music,
  SlidersHorizontal,
} from "lucide-react";
import { Agent } from "../types/valorant";
import { valorantApi } from "../services/api";
import { audio } from "../services/audio";
import AbilityViewerModal from "./AbilityViewerModal";

interface AgentsTabProps {
  initialAgentId?: string;
  accentColor: string;
}

export interface VoiceLineTrack {
  id: string;
  title: string;
  subtitle: string;
  transcript: string;
  url: string;
  category: "ultimate" | "ability" | "round_start" | "match_entry" | "generic";
}

const getVoiceLineTracksForAgent = (agent: Agent): VoiceLineTrack[] => {
  const tracks: VoiceLineTrack[] = [];
  
  const defaultTranscripts: Record<string, { title: string; subtitle: string; transcript: string; category: string }[]> = {
    Jett: [
      { title: "BLADE STORM", subtitle: "Ultimate Cast Quote", transcript: "Watch this! Get out of my way!", category: "ultimate" },
      { title: "TAILWIND EXPLOSION", subtitle: "Ability Dash Callout", transcript: "Wind at my back! Catch me if you can.", category: "ability" },
      { title: "SQUAD ENTRY BRIEFS", subtitle: "Pre-Round Motivation", transcript: "Think you can keep up? You want me to carry? Okay.", category: "round_start" },
    ],
    Sage: [
      { title: "RESURRECTION CHANT", subtitle: "Ultimate Revival Callout", transcript: "Your duty is not over! Rest here.", category: "ultimate" },
      { title: "BARRIER CONSTRUCT", subtitle: "Ability Wall Raised", transcript: "I am both shield and sword. Wall raised.", category: "ability" },
      { title: "MEDITATION DIALOG", subtitle: "Staging Area Comms", transcript: "We are protectors. Stand strong, no one dies here.", category: "round_start" },
    ],
    Phoenix: [
      { title: "RUN IT BACK BLAST", subtitle: "Ultimate Cast Quote", transcript: "Joke's over, you're dead! Let's do this again.", category: "ultimate" },
      { title: "CURVEBALL ECLIPSE", subtitle: "Ability Blind Callout", transcript: "Watch your eyes! Blinding light.", category: "ability" },
      { title: "ROUND IGNITION CHAT", subtitle: "Squad Motivation", transcript: "C'mon, let's go! Keep it hot, keep it moving.", category: "round_start" },
    ],
    Sova: [
      { title: "HUNTER'S FURY BEAM", subtitle: "Ultimate Hostile Echo", transcript: "I am the hunter! Nowhere to run!", category: "ultimate" },
      { title: "RECON BOLT DETECT", subtitle: "Ability Radar Intel", transcript: "Revealing area! Shock dart deployed.", category: "ability" },
      { title: "HUNTER READY STATUS", subtitle: "Staging Area Comms", transcript: "Sova report. I will find them, stay alert.", category: "round_start" },
    ],
    Reyna: [
      { title: "EMPRESS TRANSIT", subtitle: "Ultimate Frenzy Echo", transcript: "They will cower! The hunt is ours.", category: "ultimate" },
      { title: "SOUL HARVEST FEED", subtitle: "Combat Devour Shout", transcript: "Give me your soul! More, more!", category: "ability" },
      { title: "EMPRYNE PREPARATIONS", subtitle: "Pre-Round Command", transcript: "The hunt begins. Don't block my sightlines.", category: "round_start" },
    ],
    Omen: [
      { title: "SHADOW SHIFT CHANT", subtitle: "Ultimate Teleport Echo", transcript: "Scatter! Watch them run, I am everywhere.", category: "ultimate" },
      { title: "PARANOIA INJECTION", subtitle: "Ability Sight Blur", transcript: "Behind you. Can you see them?", category: "ability" },
      { title: "SHADOW DREAR DECK", subtitle: "Pre-Round Staging Area", transcript: "I am Omen. The shadows have called.", category: "round_start" },
    ],
    Killjoy: [
      { title: "LOCKDOWN SHIELD", subtitle: "Ultimate Field Cast", transcript: "Initiating security protocol! You should run.", category: "ultimate" },
      { title: "ALARM_BOT ENGAGEMENT", subtitle: "Ability Trap Deploy", transcript: "Alarmbot deployed! Turret active, watch my back.", category: "ability" },
      { title: "TECH CALIBRATIONS", subtitle: "Pre-Round Diagnostic", transcript: "My tech works perfectly! Relax, my bots have this.", category: "round_start" },
    ],
    Viper: [
      { title: "VIPER PIT EXPANSION", subtitle: "Ultimate Gas Canopy", transcript: "Welcome to my world! Viper's pit active.", category: "ultimate" },
      { title: "TOXIC SCREEN INJECT", subtitle: "Ability Boundary Cloud", transcript: "Poison cloud active. Don't breathe.", category: "ability" },
      { title: "CHEMICAL COMMANDS", subtitle: "Pre-Round Squad Brief", transcript: "They're dead already. Keep them suffocated.", category: "round_start" },
    ],
  };

  const agentName = agent.displayName;
  const templates = defaultTranscripts[agentName] || [
    { title: "TACTICAL COMS ARCHIVE", subtitle: "Classified Intel Stream", transcript: `System decryption key: ${agent.uuid.substring(0, 8).toUpperCase()}. Comms ready.`, category: "generic" },
    { title: "OPERATIONAL STATUS", subtitle: "Operational Readiness Shout", transcript: "Operational readiness established. Checking battlegrounds.", category: "ability" },
    { title: "BATTLEFIELD REPORT", subtitle: "Deployment Coordinates", transcript: "Deploying. Clear sightlines and stand by for commands.", category: "round_start" },
  ];

  if (agent.voiceLine && agent.voiceLine.mediaList && agent.voiceLine.mediaList.length > 0) {
    agent.voiceLine.mediaList.forEach((media, idx) => {
      const template = templates[idx % templates.length];
      tracks.push({
        id: `${agent.uuid}-track-${idx}`,
        title: template.title,
        subtitle: template.subtitle,
        transcript: template.transcript,
        url: media.wwise,
        category: template.category as any,
      });
    });
  }

  if (tracks.length === 0) {
    templates.forEach((template, idx) => {
      tracks.push({
        id: `${agent.uuid}-fallback-${idx}`,
        title: template.title,
        subtitle: template.subtitle,
        transcript: template.transcript,
        url: "",
        category: template.category as any,
      });
    });
  }

  return tracks;
};

export default function AgentsTab({ initialAgentId, accentColor }: AgentsTabProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeAbilityIndex, setActiveAbilityIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [isAbilityViewerOpen, setIsAbilityViewerOpen] = useState(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<any>(null);

  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const data = await valorantApi.getAgents();
        setAgents(data);
        if (data.length > 0) {
          if (initialAgentId) {
            const found = data.find((a) => a.uuid === initialAgentId);
            setSelectedAgent(found || data[0]);
          } else {
            setSelectedAgent(data[0]);
          }
        }
      } catch (err) {
        console.error("Error loading agents", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAgents();

    return () => {
      clearInterval(timerRef.current);
    };
  }, [initialAgentId]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 4.5);
    }
  };

  // Handle active agent change and reset ability index
  const selectAgent = (agent: Agent) => {
    audio.playSelect();
    setSelectedAgent(agent);
    setActiveAbilityIndex(0);
    setIsPlayingVoice(false);
    setCurrentTrackIndex(0);
    setCurrentTime(0);
    setDuration(0);
    stopSimulatedPlayback();
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // range -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // range -0.5 to 0.5
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const startSimulatedPlayback = (trackDuration = 4) => {
    clearInterval(timerRef.current);
    setCurrentTime(0);
    setDuration(trackDuration);
    setIsPlayingVoice(true);

    const interval = 100; // tick every 100ms
    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= trackDuration) {
          clearInterval(timerRef.current);
          setIsPlayingVoice(false);
          return trackDuration;
        }
        return prev + 0.1;
      });
    }, interval);
  };

  const stopSimulatedPlayback = () => {
    clearInterval(timerRef.current);
  };

  const tracks = selectedAgent ? getVoiceLineTracksForAgent(selectedAgent) : [];
  const currentTrack = tracks[currentTrackIndex] || null;

  // Toggle Play / Pause
  const handlePlayPause = () => {
    if (!currentTrack) return;
    audio.playClick();

    if (isPlayingVoice) {
      if (currentTrack.url && audioRef.current) {
        audioRef.current.pause();
        setIsPlayingVoice(false);
      } else {
        stopSimulatedPlayback();
        setIsPlayingVoice(false);
      }
    } else {
      if (currentTrack.url && audioRef.current) {
        stopSimulatedPlayback();
        audioRef.current.src = currentTrack.url;
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.loop = isLooping;
        audioRef.current.play()
          .then(() => {
            setIsPlayingVoice(true);
          })
          .catch((e) => {
            console.error("Audio playback error", e);
            audio.playError();
          });
      } else {
        const estDuration = currentTrack.transcript.length * 0.05 + 1.5;
        startSimulatedPlayback(Number(estDuration.toFixed(1)));
      }
    }
  };

  // Change Track
  const handleTrackChange = (index: number) => {
    if (index < 0 || index >= tracks.length) return;
    audio.playSelect();
    
    // Stop current
    if (audioRef.current) {
      audioRef.current.pause();
    }
    stopSimulatedPlayback();
    setIsPlayingVoice(false);

    // Update index
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setDuration(0);

    // Auto play new track
    setTimeout(() => {
      const nextTrack = tracks[index];
      if (!nextTrack) return;
      if (nextTrack.url && audioRef.current) {
        audioRef.current.src = nextTrack.url;
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.loop = isLooping;
        audioRef.current.play()
          .then(() => {
            setIsPlayingVoice(true);
          })
          .catch((e) => {
            console.error("Audio playback error", e);
          });
      } else {
        const estDuration = nextTrack.transcript.length * 0.05 + 1.5;
        startSimulatedPlayback(Number(estDuration.toFixed(1)));
      }
    }, 150);
  };

  const handleScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (currentTrack?.url && audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
    }
  };

  const toggleMute = () => {
    audio.playClick();
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) {
      audioRef.current.muted = nextMute;
    }
  };

  const toggleLoop = () => {
    audio.playClick();
    const nextLoop = !isLooping;
    setIsLooping(nextLoop);
    if (audioRef.current) {
      audioRef.current.loop = nextLoop;
    }
  };

  const handleAudioEnded = () => {
    if (isLooping) {
      if (currentTrack?.url && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.error(e));
      } else {
        const estDuration = currentTrack ? currentTrack.transcript.length * 0.05 + 1.5 : 4.5;
        startSimulatedPlayback(Number(estDuration.toFixed(1)));
      }
    } else {
      setIsPlayingVoice(false);
    }
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms}`;
  };

  // Filter agents based on search query and selected role
  // Memoized to prevent recalculation on frequent audio currentTime updates
  const filteredAgents = React.useMemo(() => {
    const query = searchQuery.toLowerCase();
    const roleMatch = selectedRole.toLowerCase();
    return agents.filter((agent) => {
      const matchesSearch = agent.displayName.toLowerCase().includes(query);
      const matchesRole =
        selectedRole === "all" || agent.role?.displayName.toLowerCase() === roleMatch;
      return matchesSearch && matchesRole;
    });
  }, [agents, searchQuery, selectedRole]);

  const getDifficulty = (devName: string) => {
    // Generate difficulty level from dev name length
    const hash = devName.length % 3;
    if (hash === 0) return { label: "EASY // TR_01", color: "text-val-cyan" };
    if (hash === 1) return { label: "MEDIUM // TR_02", color: "text-val-purple" };
    return { label: "DIFFICULT // TR_03", color: "text-val-red" };
  };

  const getAgentTactics = (agentName: string) => {
    // Simulated meta dynamics based on real Valorant meta
    const data: Record<
      string,
      { strong: string[]; weak: string[]; maps: string[]; origin: string }
    > = {
      Jett: {
        strong: ["Cypher", "Sage", "Sova"],
        weak: ["Breach", "Kay/O", "Skye"],
        maps: ["Haven", "Ascent", "Breeze"],
        origin: "South Korea",
      },
      Sage: {
        strong: ["Jett", "Raze", "Neon"],
        weak: ["Sova", "Fade", "Breach"],
        maps: ["Split", "Bind", "Icebox"],
        origin: "China",
      },
      Phoenix: {
        strong: ["Sage", "Viper", "Killjoy"],
        weak: ["Skye", "Omen", "Astra"],
        maps: ["Bind", "Ascent", "Pearl"],
        origin: "United Kingdom",
      },
      Sova: {
        strong: ["Cypher", "Killjoy", "Viper"],
        weak: ["Jett", "Raze", "Neon"],
        maps: ["Ascent", "Icebox", "Haven"],
        origin: "Russia",
      },
      Reyna: {
        strong: ["Phoenix", "Sage", "Fade"],
        weak: ["Breach", "Kay/O", "Omen"],
        maps: ["Ascent", "Bind", "Haven"],
        origin: "Mexico",
      },
    };

    return (
      data[agentName] || {
        strong: ["Duelists", "Sentinels"],
        weak: ["Initiators", "Controllers"],
        maps: ["Ascent", "Bind", "Lotus"],
        origin: "Unknown Classified",
      }
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-val-red border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs tracking-widest text-val-red animate-pulse">
          LOADING AGENT ROSTERS // API_REQ
        </span>
      </div>
    );
  }

  const tactics = selectedAgent ? getAgentTactics(selectedAgent.displayName) : null;
  const difficulty = selectedAgent ? getDifficulty(selectedAgent.developerName) : null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start w-full">
      {/* Hidden HTML Audio Tag for Official Voice Lines */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        className="hidden"
      />

      {/* LEFT COLUMN: FILTERS & SCROLLABLE ROSTER GRID (col-span-3) */}
      <div className="xl:col-span-3 space-y-4">
        <div className="bg-white/[0.01] border border-white/[0.05] p-4 rounded-lg space-y-4">
          <div className="font-mono text-[10px] tracking-widest text-gray-400">
            INDEX ROSTERS_SEC
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Agents..."
              className="w-full bg-val-black border border-white/[0.08] rounded py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-val-red focus:ring-1 focus:ring-val-red text-white"
            />
          </div>

          {/* Role filter buttons */}
          <div className="grid grid-cols-2 gap-1.5">
            {["all", "duelist", "sentinel", "initiator", "controller"].map((role) => (
              <button
                key={role}
                onClick={() => {
                  audio.playClick();
                  setSelectedRole(role);
                }}
                className={`px-2 py-1.5 text-[9px] font-display font-medium rounded tracking-wider border uppercase transition-all ${
                  selectedRole === role
                    ? "bg-val-red/15 border-val-red text-white"
                    : "bg-transparent border-white/[0.05] text-gray-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable roster cards */}
        <div className="max-h-[500px] xl:max-h-[620px] overflow-y-auto space-y-2 pr-1">
          {filteredAgents.length === 0 ? (
            <div className="text-center py-8 font-mono text-[11px] text-gray-500">
              NO MATCHES FOUND
            </div>
          ) : (
            filteredAgents.map((agent) => (
              <button
                key={agent.uuid}
                onClick={() => selectAgent(agent)}
                className={`w-full flex items-center justify-between p-3 rounded text-left transition-all relative ${
                  selectedAgent?.uuid === agent.uuid
                    ? "bg-gradient-to-r from-white/[0.04] to-transparent border border-white/10"
                    : "bg-transparent border border-transparent hover:bg-white/[0.01]"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded overflow-hidden bg-white/5 border border-white/10 shrink-0">
                    <img
                      src={agent.displayIcon}
                      alt={agent.displayName}
                      className="w-full h-full object-cover scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm tracking-wide text-white">
                      {agent.displayName}
                    </h4>
                    <span className="font-mono text-[9px] tracking-wider text-gray-500 uppercase">
                      {agent.role?.displayName || "CLASS"}
                    </span>
                  </div>
                </div>

                {selectedAgent?.uuid === agent.uuid && (
                  <span className="w-2 h-2 rounded-full bg-val-red" />
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* CENTRAL COLUMN: ROTATABLE Hologram & Portraited Card (col-span-5) */}
      <div className="xl:col-span-5 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          {selectedAgent && (
            <motion.div
              key={selectedAgent.uuid}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm"
            >
              {/* Main Holographic card panel */}
              <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative aspect-[3/4] bg-gradient-to-br from-val-navy via-val-black to-val-dark border-2 border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col justify-between group clip-val-card transition-all cursor-crosshair"
                style={{
                  perspective: "1000px",
                  transform: `rotateX(${mousePos.y * -20}deg) rotateY(${mousePos.x * 20}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Embedded dynamic background gradient from developerColors */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-10 transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${selectedAgent.background})`,
                    filter: "brightness(0.7) contrast(1.2)",
                  }}
                />

                {/* Cyber grid overlays */}
                <div className="absolute inset-0 val-grid-dots opacity-40 pointer-events-none" />

                {/* Outer tactical layout metadata */}
                <div className="flex justify-between items-start z-10 font-mono text-[9px] text-gray-500">
                  <div className="space-y-0.5">
                    <div>CLASSIFIED ARCHIVE // AGENT_FILE</div>
                    <div className="text-val-cyan">{selectedAgent.uuid.substring(0, 8).toUpperCase()}</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-white font-bold uppercase">
                    {selectedAgent.role?.displayName || "Duelist"}
                  </div>
                </div>

                {/* Massive Portrait Centerpiece */}
                <div className="flex-1 relative flex items-center justify-center overflow-hidden pointer-events-none">
                  {selectedAgent.fullPortraitV2 || selectedAgent.fullPortrait ? (
                    <motion.img
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.15, duration: 0.4 }}
                      src={selectedAgent.fullPortraitV2 || selectedAgent.fullPortrait || ""}
                      alt={selectedAgent.displayName}
                      className="max-h-[90%] max-w-[95%] object-contain filter drop-shadow-[0_8px_24px_rgba(255,70,85,0.3)] z-10"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <HelpCircle className="w-20 h-20 text-white/10" />
                  )}
                </div>

                {/* Footer labels */}
                <div className="z-10 mt-auto space-y-1">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display font-black text-4xl text-white tracking-tight uppercase leading-none">
                      {selectedAgent.displayName}
                    </h2>
                    <span className="font-mono text-xs text-val-cyan tracking-wider font-bold">
                      {tactics?.origin.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[9px] text-gray-400">
                    <span>DEVELOPMENT: {selectedAgent.developerName.toUpperCase()}</span>
                    <span>RELEASE: 2020-06-02</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT COLUMN: BIOGRAPHY, INTERACTIVE ABILITIES & LORE (col-span-4) */}
      <div className="xl:col-span-4 space-y-6">
        <AnimatePresence mode="wait">
          {selectedAgent && (
            <motion.div
              key={selectedAgent.uuid + "_details"}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Bio block & Voice actor play button */}
              <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-4">
                <div className="flex justify-between items-center border-b border-white/[0.05] pb-3">
                  <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">
                    BIOGRAPHY LOGS
                  </h3>

                  {/* Quick-play active audio quote from custom player */}
                  {currentTrack && (
                    <button
                      onClick={handlePlayPause}
                      onMouseEnter={() => audio.playHover()}
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded text-[9px] font-mono border uppercase tracking-wider transition-all duration-200 ${
                        isPlayingVoice
                          ? "bg-val-cyan/20 border-val-cyan text-val-cyan animate-pulse"
                          : "bg-val-red/15 border-val-red/30 text-val-red hover:bg-val-red/30"
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isPlayingVoice ? "PAUSE CHANNEL" : "PLAY ACTIVE COM"}</span>
                    </button>
                  )}
                </div>

                <p className="font-sans text-xs text-gray-300 leading-relaxed font-light">
                  {selectedAgent.description}
                </p>

                {/* Difficulty level bar */}
                {difficulty && (
                  <div className="space-y-1.5 pt-2 border-t border-white/[0.03]">
                    <div className="flex justify-between items-center font-mono text-[9px]">
                      <span className="text-gray-500">DIFFICULTY RATING:</span>
                      <span className={`${difficulty.color} font-bold`}>{difficulty.label}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded overflow-hidden">
                      <div
                        className={`h-full ${
                          difficulty.label.includes("TR_01")
                            ? "bg-val-cyan w-1/3"
                            : difficulty.label.includes("TR_02")
                            ? "bg-val-purple w-2/3"
                            : "bg-val-red w-full"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* TACTICAL COMMS PLAYER */}
              <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-4">
                <style>{`
                  @keyframes voiceWave {
                    0%, 100% { height: 3px; }
                    50% { height: 26px; }
                  }
                  .voice-bar {
                    animation: voiceWave 0.8s ease-in-out infinite alternate;
                  }
                `}</style>

                <div className="flex justify-between items-center border-b border-white/[0.05] pb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isPlayingVoice ? "bg-val-cyan animate-ping" : "bg-gray-500"}`} />
                    <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">
                      TACTICAL AUDIO COMMS
                    </h3>
                  </div>
                  <span className="font-mono text-[8px] text-gray-500">
                    STATUS // {isPlayingVoice ? "DECODING_ACTIVE" : "STANDBY"}
                  </span>
                </div>

                {/* Track Tab Grid */}
                <div className="grid grid-cols-3 gap-1">
                  {tracks.map((track, idx) => {
                    const isCurrent = currentTrackIndex === idx;
                    return (
                      <button
                        key={track.id}
                        onClick={() => handleTrackChange(idx)}
                        className={`py-1.5 px-1 rounded text-[9px] font-mono border uppercase tracking-wider transition-all duration-150 flex flex-col items-center justify-center ${
                          isCurrent
                            ? "bg-val-cyan/10 border-val-cyan text-val-cyan font-bold"
                            : "bg-white/[0.01] border-white/[0.05] text-gray-400 hover:bg-white/[0.03] hover:text-white"
                        }`}
                      >
                        <span className="text-[7px] text-gray-500">COM_0{idx + 1}</span>
                        <span className="truncate max-w-[80px] mt-0.5">{track.title.split(" ")[0]}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Main Player Display Box */}
                {currentTrack && (
                  <div className="bg-val-black/60 border border-white/[0.05] p-3.5 rounded-lg space-y-3 relative overflow-hidden">
                    <div className="absolute top-1.5 right-1.5 font-mono text-[7px] text-gray-600">
                      SYS_STREAM_S{currentTrackIndex + 1}
                    </div>

                    {/* Metadata */}
                    <div className="space-y-0.5">
                      <h4 className="font-display font-bold text-[11px] text-white tracking-wide uppercase">
                        {currentTrack.title}
                      </h4>
                      <p className="font-mono text-[8px] text-gray-400">
                        {currentTrack.subtitle.toUpperCase()}
                      </p>
                    </div>

                    {/* Waveform visualizer */}
                    <div className="flex items-end justify-center space-x-1.5 h-10 bg-val-black/40 border border-white/[0.03] rounded-lg p-2.5 overflow-hidden">
                      {Array.from({ length: 16 }).map((_, idx) => {
                        const delay = (idx * 0.05).toFixed(2);
                        const baseHeight = [12, 24, 16, 8, 28, 20, 14, 22, 10, 26, 18, 12, 20, 16, 24, 8][idx];
                        return (
                          <div
                            key={idx}
                            className={`w-1 rounded-t-sm transition-all duration-300 ${
                              isPlayingVoice ? "bg-val-cyan voice-bar" : "bg-gray-700"
                            }`}
                            style={{
                              animationDelay: `${delay}s`,
                              animationDuration: `${(0.5 + idx * 0.04).toFixed(2)}s`,
                              height: isPlayingVoice ? undefined : "3px",
                              maxHeight: `${baseHeight}px`,
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Transcript console */}
                    <div className="p-2.5 bg-val-black/80 border-l border-val-cyan/40 rounded text-[10px] font-mono text-gray-300 italic min-h-[48px] flex items-center relative">
                      <span className="text-val-cyan/60 mr-1.5 select-none font-bold">»</span>
                      <p className="leading-relaxed">
                        "{currentTrack.transcript}"
                      </p>
                    </div>

                    {/* Scrubber and Time progress */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <input
                          type="range"
                          min={0}
                          max={duration || 100}
                          step={0.01}
                          value={currentTime}
                          onChange={handleScrubChange}
                          className="flex-1 accent-val-cyan bg-white/10 h-1 rounded cursor-pointer outline-none"
                        />
                      </div>
                      <div className="flex justify-between font-mono text-[8px] text-gray-500">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Interactive controls deck */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-2">
                        {/* Repeat */}
                        <button
                          onClick={toggleLoop}
                          className={`p-1.5 rounded transition-all ${
                            isLooping
                              ? "text-val-cyan bg-val-cyan/10"
                              : "text-gray-500 hover:text-white hover:bg-white/5"
                          }`}
                          title={isLooping ? "Looping active" : "Enable looping"}
                        >
                          <Repeat className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Playback arrows and core state */}
                      <div className="flex items-center space-x-2.5">
                        <button
                          onClick={() => handleTrackChange(currentTrackIndex - 1)}
                          disabled={currentTrackIndex === 0}
                          className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                          <SkipBack className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={handlePlayPause}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-val-black transition-all shadow-md transform active:scale-95 ${
                            isPlayingVoice
                              ? "bg-val-cyan hover:bg-val-cyan/80 ring-2 ring-val-cyan/25"
                              : "bg-val-red hover:bg-val-red/80 hover:scale-105"
                          }`}
                        >
                          {isPlayingVoice ? (
                            <Pause className="w-4 h-4 fill-val-black" />
                          ) : (
                            <Play className="w-4 h-4 fill-val-black translate-x-0.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleTrackChange(currentTrackIndex + 1)}
                          disabled={currentTrackIndex === tracks.length - 1}
                          className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                          <SkipForward className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Volume controls */}
                      <div className="flex items-center space-x-1.5 group/volume">
                        <button
                          onClick={toggleMute}
                          className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                          {isMuted ? (
                            <VolumeX className="w-3.5 h-3.5 text-val-red" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-12 md:w-16 h-1 bg-white/10 accent-val-cyan rounded outline-none group-hover/volume:opacity-100 transition-opacity duration-200 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* INTERACTIVE ABILITIES PANEL */}
              <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-4">
                <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider border-b border-white/[0.05] pb-3">
                  TACTICAL ABILITY INSPECTOR
                </h3>

                {/* Ability slot selector bar */}
                <div className="flex justify-between gap-1.5">
                  {selectedAgent.abilities.map((ability, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        audio.playClick();
                        if (activeAbilityIndex === idx) {
                          setIsAbilityViewerOpen(true);
                        } else {
                          setActiveAbilityIndex(idx);
                        }
                      }}
                      className={`flex-1 aspect-square rounded border flex items-center justify-center p-1 transition-all relative group/item ${
                        activeAbilityIndex === idx
                          ? "bg-val-red/15 border-val-red text-val-red ring-1 ring-val-red/30 scale-105"
                          : "bg-white/[0.02] border-white/[0.08] text-gray-400 hover:border-white/20 hover:text-white"
                      }`}
                      title={`Click to select. Click again to inspect ${ability.displayName}`}
                    >
                      {ability.displayIcon ? (
                        <img
                          src={ability.displayIcon}
                          alt={ability.displayName}
                          className="max-h-[75%] max-w-[75%] object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )}

                      {/* Micro hover indicator */}
                      <span className="absolute bottom-1 right-1 opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none">
                        <Eye className="w-2.5 h-2.5 text-val-cyan" />
                      </span>
                    </button>
                  ))}
                </div>

                {/* Selected Ability Description Card */}
                {selectedAgent.abilities[activeAbilityIndex] && (
                  <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded min-h-[110px] space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between font-mono text-[9px] text-gray-400">
                        <span className="uppercase text-val-cyan font-bold">
                          {selectedAgent.abilities[activeAbilityIndex].slot === "Ultimate"
                            ? "ULTIMATE SPEC"
                            : `SLOT: ${selectedAgent.abilities[activeAbilityIndex].slot.toUpperCase()}`}
                        </span>
                        <span>CHARGES: MULTI</span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-white tracking-wide">
                        {selectedAgent.abilities[activeAbilityIndex].displayName}
                      </h4>
                      <p className="font-sans text-[11px] text-gray-400 leading-relaxed font-light">
                        {selectedAgent.abilities[activeAbilityIndex].description}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        audio.playClick();
                        setIsAbilityViewerOpen(true);
                      }}
                      className="mt-2 w-full bg-val-cyan/10 hover:bg-val-cyan/20 border border-val-cyan/30 hover:border-val-cyan/50 text-val-cyan transition-all py-1.5 px-3 rounded font-display font-bold text-[10px] tracking-wider uppercase flex items-center justify-center space-x-1.5 active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>LAUNCH TACTICAL SIMULATOR</span>
                    </button>
                  </div>
                )}
              </div>

              {/* META TACTICS, STRENGTHS & LORE COUNTERS */}
              {tactics && (
                <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-4">
                  <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider border-b border-white/[0.05] pb-3">
                    BATTLEGROUND COMBAT DYNAMICS
                  </h3>

                  <div className="grid grid-cols-2 gap-4 font-mono text-[10px]">
                    <div className="space-y-2">
                      <div className="text-val-cyan flex items-center space-x-1">
                        <Target className="w-3.5 h-3.5" />
                        <span className="font-bold">STRONG AGAINST</span>
                      </div>
                      <ul className="space-y-1 list-disc pl-4 text-gray-300">
                        {tactics.strong.map((s, idx) => (
                          <li key={idx} className="font-light">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div className="text-val-red flex items-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span className="font-bold">WEAK AGAINST</span>
                      </div>
                      <ul className="space-y-1 list-disc pl-4 text-gray-300">
                        {tactics.weak.map((w, idx) => (
                          <li key={idx} className="font-light">
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommended Maps list */}
                  <div className="pt-3 border-t border-white/[0.03] space-y-1">
                    <span className="font-mono text-[9px] text-gray-500 uppercase">
                      STRATEGIC META MAPS:
                    </span>
                    <div className="flex gap-2">
                      {tactics.maps.map((mapName, idx) => (
                        <span
                          key={idx}
                          className="bg-white/[0.03] border border-white/[0.05] px-2 py-0.5 rounded text-[9px] text-white font-mono uppercase"
                        >
                          {mapName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ability Viewer Modal */}
        {selectedAgent && selectedAgent.abilities[activeAbilityIndex] && (
          <AbilityViewerModal
            isOpen={isAbilityViewerOpen}
            onClose={() => setIsAbilityViewerOpen(false)}
            agent={selectedAgent}
            ability={selectedAgent.abilities[activeAbilityIndex]}
            accentColor={accentColor}
          />
        )}
      </div>
    </div>
  );
}
