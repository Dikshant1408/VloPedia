/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Shield, Info, Users, Swords, Map, Sparkles, Trophy, Calendar, ListFilter, Target, Flame } from "lucide-react";
import { 
  fetchAgents, 
  fetchWeapons, 
  fetchMaps, 
  fetchCompetitiveTiers, 
  fetchGameModes, 
  fetchSeasons, 
  Agent, 
  Weapon, 
  MapData, 
  CompetitiveTier, 
  GameMode, 
  Season 
} from "../services/valorantService";
import { playSFX } from "../utils/sfx";
import RadianiteCore3D from "./RadianiteCore3D";
import TiltCard from "./TiltCard";

interface DatabaseHubProps {
  subTab: string;
  onNavigate: (pageId: string) => void;
}

export default function DatabaseHub({ subTab, onNavigate }: DatabaseHubProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [maps, setMaps] = useState<MapData[]>([]);
  const [gameModes, setGameModes] = useState<GameMode[]>([]);
  const [competitiveTiers, setCompetitiveTiers] = useState<CompetitiveTier[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [a, w, m, tiersData, modesData, seasonsData] = await Promise.all([
          fetchAgents(),
          fetchWeapons(),
          fetchMaps(),
          fetchCompetitiveTiers(),
          fetchGameModes(),
          fetchSeasons()
        ]);
        
        setAgents(a);
        setWeapons(w);
        setMaps(m);
        
        // Filter game modes
        const validModes = (modesData || []).filter(mode => mode.displayName && mode.displayIcon);
        setGameModes(validModes);

        // Filter seasons
        const validSeasons = (seasonsData || []).filter(s => s.displayName && s.displayName.toLowerCase().includes("episode"));
        setSeasons(validSeasons);

        // Extract active competitive tiers from the group that actually contains standard divisions (typically has over 20 tiers)
        const activeGroup = (tiersData || []).find(g => g.tiers && g.tiers.length > 20) || (tiersData || [])[tiersData.length - 1];
        if (activeGroup && activeGroup.tiers) {
          // Filter out tiers without icons/badges or name
          const validTiers = activeGroup.tiers.filter(t => t.largeIcon || t.smallIcon);
          setCompetitiveTiers(validTiers);
        }
      } catch (err) {
        console.error("Error loading DatabaseHub data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (subTab === "overview") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Banner */}
        <div className="relative mb-10 overflow-hidden border border-[#ECE8E1]/10 bg-gradient-to-r from-[#FA4454]/10 via-transparent to-[#0DF2F2]/5 p-8 clip-diagonal">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#FA4454]/5 rounded-full blur-3xl" />
          <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-[#0DF2F2]/5 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="w-2 h-2 bg-[#FA4454] animate-pulse" />
                <span className="eyebrow">SYSTEM DATABASE</span>
              </div>
              <h1 className="font-display font-black text-4xl sm:text-5xl tracking-tight text-[#ECE8E1] mb-4">
                TACTICAL DATA HUB
              </h1>
              <p className="text-white/60 max-w-xl font-sans text-sm leading-relaxed">
                Welcome to the official Valorant Protocol Database. Monitor elite agents, weapons, map architectures, game modes, competitive standings, and seasonal timelines in real time.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 font-mono">
              <div className="border border-white/10 bg-[#0B141A]/80 p-4 clip-diagonal-sm min-w-[120px] text-center">
                <span className="text-2xl font-black text-[#FA4454] block">{loading ? "..." : agents.length}</span>
                <span className="text-[10px] text-white/40 tracking-wider">ACTIVE AGENTS</span>
              </div>
              <div className="border border-white/10 bg-[#0B141A]/80 p-4 clip-diagonal-sm min-w-[120px] text-center">
                <span className="text-2xl font-black text-[#0DF2F2] block">{loading ? "..." : weapons.length}</span>
                <span className="text-[10px] text-white/40 tracking-wider">WEAPONS REGISTERED</span>
              </div>
              <div className="border border-white/10 bg-[#0B141A]/80 p-4 clip-diagonal-sm min-w-[120px] text-center">
                <span className="text-2xl font-black text-white block">{loading ? "..." : maps.length}</span>
                <span className="text-[10px] text-white/40 tracking-wider">TACTICAL MAPS</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Core & Technical Overview Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
            <RadianiteCore3D />
          </div>
          <div className="flex flex-col justify-between border border-[#0DF2F2]/20 bg-[#0DF2F2]/5 p-6 clip-diagonal relative overflow-hidden min-h-[360px] md:min-h-[420px]">
            <div className="absolute right-0 top-0 w-48 h-48 bg-[#0DF2F2]/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-2 h-2 bg-[#0DF2F2] rounded-full animate-ping" />
                <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">RADIANITE DIAGNOSTICS</span>
              </div>
              <h3 className="font-display font-black text-2xl text-white tracking-wide mb-3 uppercase">QUANTUM REACTOR</h3>
              <p className="text-white/70 text-xs leading-relaxed mb-4">
                Raw Radianite core energy containment grid. High-density kinetic fields keep the crystalline lattice stable for tactical procurement.
              </p>
              <div className="space-y-2 border-t border-white/10 pt-4">
                <div className="flex justify-between font-mono text-[9px] text-white/50 border-b border-white/5 pb-1">
                  <span>ENERGY_YIELD</span>
                  <span className="text-[#0DF2F2] font-bold">14.8 GigaWatts</span>
                </div>
                <div className="flex justify-between font-mono text-[9px] text-white/50 border-b border-white/5 pb-1">
                  <span>STABILITY_RATIO</span>
                  <span className="text-white/80">99.982% CONSTANT</span>
                </div>
                <div className="flex justify-between font-mono text-[9px] text-white/50 border-b border-white/5 pb-1">
                  <span>PARTICLE_DENSITY</span>
                  <span className="text-white/80">E-14 RADIANS / CC</span>
                </div>
              </div>
            </div>
        </div>
      </div>

        {/* Database Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              id: "agents",
              title: "ROSTER AGENTS",
              desc: "Deep-dive into Agent abilities, roles, bios, and official voice transmissions.",
              icon: Users,
              color: "#FA4454",
              count: `${agents.length} AGENTS`
            },
            {
              id: "weapons",
              title: "WEAPONS ARSENAL",
              desc: "Complete ballistic reports, spray patterns, damage statistics, and buy costs.",
              icon: Swords,
              color: "#0DF2F2",
              count: `${weapons.length} WEAPONS`
            },
            {
              id: "maps",
              title: "TACTICAL MAPS",
              desc: "Aerial blueprint overlays, spike plant locations, barrier guidelines, and coordinates.",
              icon: Map,
              color: "#ECE8E1",
              count: `${maps.length} MAPS`
            },
            {
              id: "game-modes",
              title: "GAME MODES",
              desc: "Review match rules, durations, spike timings, credit guidelines, and Premier criteria.",
              icon: Target,
              color: "#FA4454",
              count: `${loading ? "..." : (gameModes.length > 0 ? gameModes.length : 7)} MODES`
            },
            {
              id: "ranks",
              title: "COMPETITIVE RANKS",
              desc: "Standings analysis from Iron 1 to Radiant. MMR rules, distribution, and badge specs.",
              icon: Trophy,
              color: "#0DF2F2",
              count: `${loading ? "..." : (competitiveTiers.length > 0 ? competitiveTiers.length : 25)} TIERS`
            },
            {
              id: "timeline",
              title: "SEASON TIMELINE",
              desc: "Historical chronology of Episodes, Acts, agent releases, and patch milestones.",
              icon: Calendar,
              color: "#ECE8E1",
              count: loading ? "..." : (seasons.length > 0 ? `${seasons.length} EPISODES` : "EPISODES")
            }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="h-full"
              >
                <TiltCard
                  onClick={() => {
                    playSFX.selectSurge();
                    onNavigate(item.id);
                  }}
                  onMouseEnter={() => playSFX.hoverClick()}
                  className="relative bg-[#0B141A]/90 border border-[rgba(236,232,225,0.08)] hover:border-[#FA4454]/40 hover:bg-[#FA4454]/5 p-6 clip-diagonal-sm cursor-none interactive-tactical group transition-all h-full flex flex-col justify-between"
                  maxTilt={8}
                >
                  <div 
                    className="absolute top-0 left-0 w-1 h-full bg-[#FA4454] opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 border border-white/5 bg-white/[0.02] rounded-xs group-hover:border-white/20 transition-colors">
                        <Icon className="w-6 h-6" style={{ color: item.color }} />
                      </div>
                      <span className="corner-chip">
                        {item.count}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-[#ECE8E1] tracking-wider mb-2 group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-white/50 text-xs leading-relaxed mb-4">
                      {item.desc}
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* Tactical Intel Alert Block */}
        <div className="border border-[#0DF2F2]/20 bg-[#0DF2F2]/5 p-6 clip-diagonal flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-[#0DF2F2]/10 rounded-sm text-[#0DF2F2] shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-mono text-xs text-[#0DF2F2] tracking-[0.2em] font-bold uppercase mb-1">
              VALORANT INTEL BULLETIN
            </h4>
            <p className="text-white/70 text-xs leading-relaxed">
              Valorant is a tactical 5v5 character-based shooter. Teams play as Attackers or Defenders to plant or defuse a spike. Precision gunplay combined with tactical agent abilities determines match success. Use this database to master weapon statistics and match parameters.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (subTab === "game-modes") {
    const modes = gameModes.length > 0 
      ? gameModes.map((mode, idx) => {
          const matchedPreset = [
            { key: "competitive", badge: "TACTICAL EXCELLENCE", desc: "The standard 5v5 ranked matchmaking queue. Teams take turns attacking and defending. First to 13 rounds wins, with dynamic overtime rules requiring win-by-two." },
            { key: "unrated", badge: "STANDARD CASUAL", desc: "Classic 5v5 unranked mode. Matches follow standard competitive structures but do not affect player rank standings. Ideal for warming up, practicing line-ups, and leveling up." },
            { key: "swiftplay", badge: "FAST-PACED SPREE", desc: "A rapid, streamlined version of standard 5v5 unrated matches. Shorter round counts and set economy states let players enjoy the core experience in half the time." },
            { key: "spike rush", badge: "ARCADE ACTION", desc: "A chaotic 5v5 skirmish where every attacker holds a Spike, weapon loads are randomized every round, and dynamic upgrade orbs are placed around the maps." },
            { key: "deathmatch", badge: "MECHANICAL FOCUS", desc: "Free-for-all warm-up mode focusing purely on gunplay mechanics. Abilities are disabled, respawns are instant, and first to 40 wins." },
            { key: "premier", badge: "SEMI-PRO ESPORTS", desc: "The path-to-pro competitive tournament system integrated directly inside the client. Create or join a 5-to-7 player roster and battle in weekly brackets." }
          ].find(p => mode.displayName.toLowerCase().includes(p.key));

          return {
            name: mode.displayName.toUpperCase(),
            desc: matchedPreset?.desc || `Official Valorant match protocol. Engage in ${mode.displayName} operations under secure parameters with custom configurations.`,
            badge: matchedPreset?.badge || "TACTICAL ENGAGEMENT",
            color: idx % 2 === 0 ? "#FA4454" : "#0DF2F2",
            icon: mode.displayIcon,
            specs: [
              { label: "TIMEOUTS ALLOWED", value: mode.allowsMatchTimeouts ? "YES" : "NO" },
              { label: "MINIGAME TYPE", value: mode.isMinigame ? "YES" : "NO" },
              { label: "DURATION TYPE", value: mode.duration || "STANDARD MATCH" },
              { label: "SYSTEM PROTOCOL ID", value: mode.uuid.split("-")[0].toUpperCase() }
            ]
          };
        })
      : [
          {
            name: "COMPETITIVE",
            desc: "The standard 5v5 ranked matchmaking queue. Teams take turns attacking and defending. First to 13 rounds wins, with dynamic overtime rules requiring win-by-two.",
            specs: [
              { label: "TEAM SIZE", value: "5 VS 5" },
              { label: "ROUND COUNT", value: "FIRST TO 13 (OT INCLUDED)" },
              { label: "SPIKE TIMER", value: "45 SECONDS" },
              { label: "BUY TIME", value: "30 SECONDS" },
              { label: "CREDITS START", value: "800 CREDITS" },
              { label: "RANK IMPACT", value: "DETERMINES COMPETITIVE MMR" }
            ],
            badge: "TACTICAL EXCELLENCE",
            color: "#FA4454",
            icon: null
          },
          {
            name: "UNRATED",
            desc: "Classic 5v5 unranked mode. Matches follow standard competitive structures but do not affect player rank standings. Ideal for warming up, practicing line-ups, and leveling up accounts.",
            specs: [
              { label: "TEAM SIZE", value: "5 VS 5" },
              { label: "ROUND COUNT", value: "FIRST TO 13 (NO OVERTIME)" },
              { label: "SPIKE TIMER", value: "45 SECONDS" },
              { label: "BUY TIME", value: "30 SECONDS" },
              { label: "CREDITS START", value: "800 CREDITS" },
              { label: "RANK IMPACT", value: "NONE (CASUAL QUEUE)" }
            ],
            badge: "STANDARD CASUAL",
            color: "#0DF2F2",
            icon: null
          },
          {
            name: "SWIFTPLAY",
            desc: "A rapid, streamlined version of standard 5v5 unrated matches. Shorter round counts and set economy states let players enjoy the core experience in half the time.",
            specs: [
              { label: "TEAM SIZE", value: "5 VS 5" },
              { label: "ROUND COUNT", value: "FIRST TO 5" },
              { label: "SPIKE TIMER", value: "45 SECONDS" },
              { label: "BUY TIME", value: "15 SECONDS" },
              { label: "CREDITS START", value: "1,250 CREDITS (RAMPS RAPIDLY)" },
              { label: "AVERAGE DURATION", value: "12-15 MINUTES" }
            ],
            badge: "FAST-PACED SPREE",
            color: "#ECE8E1",
            icon: null
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
          <div className="flex items-center space-x-2 mb-2">
            <span className="w-2 h-2 bg-[#FA4454]" />
            <span className="eyebrow">SYSTEM DATABASE</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#ECE8E1] tracking-tight uppercase">
            MATCH PROTOCOLS // GAME MODES
          </h2>
          <p className="text-white/50 text-sm max-w-2xl mt-2">
            Analyze official game rules, victory conditions, and lobby setups. Match parameters are updated directly from server-side files in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {modes.map((mode, idx) => (
            <div 
              key={mode.name}
              className="relative surface-glass p-6 clip-diagonal flex flex-col justify-between hover:border-[rgba(236,232,225,0.12)]"
            >
              <div 
                className="absolute top-0 left-0 w-1 h-full bg-[#FA4454] opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <div>
                <div className="flex justify-between items-start mb-4 gap-2">
                  <div className="flex items-center gap-3">
                    {mode.icon && (
                      <img 
                        src={mode.icon} 
                        alt={mode.name} 
                        className="w-10 h-10 object-contain shrink-0 filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <h3 className="font-display font-black text-2xl text-white tracking-wide">
                      {mode.name}
                    </h3>
                  </div>
                  <span className="corner-chip">
                    {mode.badge}
                  </span>
                </div>
                <p className="text-white/60 text-xs leading-relaxed mb-6">
                  {mode.desc}
                </p>
              </div>

              <div>
                <div className="border-t border-white/10 pt-4">
                  <h4 className="font-mono text-[10px] text-white/40 tracking-wider mb-3 uppercase">TECHNICAL PARAMETERS</h4>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                    {mode.specs.map((spec) => (
                      <div key={spec.label} className="flex flex-col border-b border-white/5 pb-1">
                        <span className="font-mono text-[9px] text-white/40">{spec.label}</span>
                        <span className="font-mono text-xs font-semibold text-[#ECE8E1] mt-0.5">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (subTab === "ranks") {
    const ranks = [
      { name: "IRON", color: "#6A6A6A", description: "The foundational competitive tier. Focus on mechanical aiming, learning agent abilities, and basic map layouts." },
      { name: "BRONZE", color: "#A87C43", description: "Stepping up basic coordination. Begin combining abilities with team pushes and developing standard crosshair placement." },
      { name: "SILVER", color: "#C0C0C0", description: "Solid mechanical baselines. Teams coordinate trades, buy-rounds are semi-regularly aligned, and active communication begins." },
      { name: "GOLD", color: "#E5C158", description: "The intermediate standard. Advanced map control, customized aim training, regular call-outs, and deliberate economy play." },
      { name: "PLATINUM", color: "#3B82A6", description: "High-tier execution. Fast rotation reading, clutch execution under pressure, and active counter-play setup." },
      { name: "DIAMOND", color: "#A635CD", description: "Elite-level capability. Perfect crosshair discipline, sophisticated utility pairings, and deep counter-strat mechanics." },
      { name: "ASCENDANT", color: "#1FA884", description: "Mastery threshold. Supreme consistency, leadership communication, and fluid tactical pivoting based on opponents' state." },
      { name: "IMMORTAL", color: "#B32F42", description: "Top 1% of competitive play. Full five-stack synergy or top solo execution. Matches are decided by seconds and millimeters." },
      { name: "RADIANT", color: "#FA4454", description: "The ultimate peak. Limited to the top 500 players per geographic region. Complete tactical and mechanical dominance." }
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
          <div className="flex items-center space-x-2 mb-2">
            <span className="w-2 h-2 bg-[#0DF2F2]" />
            <span className="eyebrow">SYSTEM DATABASE</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#ECE8E1] tracking-tight uppercase">
            COMPETITIVE STANDINGS // RANK TIERS
          </h2>
          <p className="text-white/50 text-sm max-w-2xl mt-2">
            Valorant's competitive ladder spans 25 individual tiers grouped into 9 major divisions. Reach tactical perfection to advance through security ratings.
          </p>
        </div>

        {/* MMR System Explainer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="border border-[#FA4454]/30 bg-[#FA4454]/5 p-6 clip-diagonal">
            <h3 className="font-mono text-sm text-[#FA4454] tracking-widest font-bold mb-2">MMR VS RR SYSTEM</h3>
            <p className="text-white/70 text-xs leading-relaxed">
              <strong>Matchmaking Rating (MMR)</strong> is your hidden skill standing. <strong>Rank Rating (RR)</strong> is the visible metric used to define your badge. Win matches, outperform expectations, and defeat higher-ranked opponents to maximize RR gains.
            </p>
          </div>
          <div className="border border-[#0DF2F2]/30 bg-[#0DF2F2]/5 p-6 clip-diagonal">
            <h3 className="font-mono text-sm text-[#0DF2F2] tracking-widest font-bold mb-2">PROMOTIONS & DEMOTIONS</h3>
            <p className="text-white/70 text-xs leading-relaxed">
              Reaching 100 RR triggers automatic promotion. Dropping below 0 RR triggers demotion protection for exactly one match. Immortal and Radiant tiers utilize regional leaderboards instead of fixed RR milestones.
            </p>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-6 clip-diagonal">
            <h3 className="font-mono text-sm text-white/60 tracking-widest font-bold mb-2">RANK DECAY RULES</h3>
            <p className="text-white/70 text-xs leading-relaxed">
              Valorant does not utilize flat rating decay. However, your visual badge is hidden after 14 days of inactivity. Simply complete a single competitive match to re-establish your division standing immediately.
            </p>
          </div>
        </div>

        {/* Rank Division Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ranks.map((rank, idx) => {
            const matchedTiers = competitiveTiers.filter(
              t => t.tierName && t.tierName.toUpperCase().startsWith(rank.name)
            );
            // Get the highest tier (or first if single tier like Radiant) for the main rank icon
            const highestTier = matchedTiers[matchedTiers.length - 1] || matchedTiers[0];
            const mainIcon = highestTier ? (highestTier.largeIcon || highestTier.smallIcon) : null;

            return (
              <div 
                key={rank.name}
                className="surface-glass p-6 clip-diagonal group transition-colors relative flex flex-col justify-between min-h-[340px] hover:border-[rgba(236,232,225,0.12)]"
              >
                <div>
                  <div 
                    className="absolute top-2 right-2 w-24 h-24 text-white/[0.02] font-black font-display flex items-center justify-center text-8xl pointer-events-none select-none"
                    style={{ color: `${rank.color}11` }}
                  >
                    0{idx + 1}
                  </div>
                  <div className="flex items-center space-x-4 mb-4">
                    {/* Ranks badge visualizer */}
                    {mainIcon ? (
                      <div className="w-16 h-16 flex items-center justify-center relative bg-white/[0.02] border border-white/5 p-1 shrink-0">
                        <img 
                          src={mainIcon} 
                          alt={rank.name} 
                          className="w-14 h-14 object-contain filter drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] group-hover:scale-110 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div 
                        className="w-12 h-12 flex items-center justify-center transform rotate-45 border shrink-0"
                        style={{ borderColor: rank.color, backgroundColor: `${rank.color}15` }}
                      >
                        <div 
                          className="w-6 h-6 transform -rotate-45 font-display font-black text-xs text-center flex items-center justify-center"
                          style={{ color: rank.color }}
                        >
                          {rank.name[0]}
                        </div>
                      </div>
                    )}
                    <div>
                      <h3 className="font-display font-black text-xl text-white tracking-wider">
                        {rank.name}
                      </h3>
                      <span className="font-mono text-[9px] text-[#0DF2F2] tracking-widest uppercase">
                        {matchedTiers.length > 0 
                          ? `${matchedTiers.length} TIERS INDEXED` 
                          : "TIERS 1 - 3 // MULTI_LEVEL"}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed mb-6">
                    {rank.description}
                  </p>
                </div>

                {matchedTiers.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <span className="font-mono text-[9px] text-white/30 tracking-widest uppercase block mb-3">
                      SUB-TIER DESIGNATIONS
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {matchedTiers.map((tier) => (
                        <div 
                          key={tier.tier}
                          className="flex flex-col items-center justify-center bg-white/[0.01] border border-white/5 p-2 rounded-xs hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer grow basis-[60px]"
                        >
                          {(tier.largeIcon || tier.smallIcon) ? (
                            <img 
                              src={tier.largeIcon || tier.smallIcon || ""} 
                              alt={tier.tierName} 
                              className="w-8 h-8 object-contain mb-1 filter drop-shadow-[0_1px_5px_rgba(255,255,255,0.1)]"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-8 h-8 flex items-center justify-center font-bold text-white/40 text-xs">
                              ?
                            </div>
                          )}
                          <span className="font-mono text-[8px] text-white/60 text-center leading-tight whitespace-nowrap">
                            {tier.tierName.toUpperCase().replace(rank.name, "").trim() || "PEAK"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  }

  if (subTab === "timeline") {
    const acts = [
      { episode: "EPISODE 9", title: "COLLISION", date: "June 2024 - Present", highlight: "Released Vyse, Abyss tactical mapping, balance overhaul for duelists, updated Premier scheduling structure." },
      { episode: "EPISODE 8", title: "DEFIANCE", date: "January 2024 - June 2024", highlight: "Released Clove, Outlaw sniper weapon, fully revamped sniper meta, introduced competitive Sunset changes." },
      { episode: "EPISODE 7", title: "EVOLUTION", date: "June 2023 - January 2024", highlight: "Released Iso & Deadlock, Team Deathmatch game mode, Sunset map, fully reworked progression systems." },
      { episode: "EPISODE 6", title: "REVELATION", date: "January 2023 - June 2023", highlight: "Released Gekko, Lotus map, competitive map pool rotation, custom tactical fan cosmetics, updated UI v2." },
      { episode: "EPISODE 5", title: "DIMENSION", date: "June 2022 - January 2023", highlight: "Released Harbor, Pearl underwater map, Ascendant competitive tier added, major pearl balancing patches." },
      { episode: "EPISODE 4", title: "DISRUPTION", date: "January 2022 - June 2022", highlight: "Released Neon & Fade, Fracture map changes, major weapon adjustments to Ares/Melee, VCT Masters Reykjavik." },
      { episode: "EPISODE 3", title: "REFLECTION", date: "June 2021 - January 2022", highlight: "Released KAY/O & Chamber, Fracture map, complete weapon/ability price overhaul, competitive tier updates." },
      { episode: "EPISODE 2", title: "FORMATION", date: "January 2021 - June 2021", highlight: "Released Yoru & Astra, Breeze tropical island map, major ranked system overhaul, VCT Masters Reykjavik LAN." },
      { episode: "EPISODE 1", title: "IGNITION", date: "June 2020 - January 2021", highlight: "Valorant launch! Released Reyna, Killjoy, Skye, Icebox ice-map, first competitive acts, First Strike." }
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
          <div className="flex items-center space-x-2 mb-2">
            <span className="w-2 h-2 bg-[#FA4454]" />
            <span className="eyebrow">SYSTEM DATABASE</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#ECE8E1] tracking-tight uppercase">
            SEASON TIMELINE // PROTOCOL HISTORY
          </h2>
          <p className="text-white/50 text-sm max-w-2xl mt-2">
            Chronological logging of Episodes and Acts. Revisit historic patches, map additions, and elite agent recruitment releases.
          </p>
        </div>

        {/* Timeline Path */}
        <div className="relative border-l-2 border-white/10 ml-4 pl-8 space-y-12">
          {acts.map((act, idx) => (
            <motion.div 
              key={act.episode}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[41px] top-1.5 w-6 h-6 rounded-full bg-[#0B141A] border-2 border-[#FA4454] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#FA4454]" />
              </div>

              <div className="surface-glass p-6 clip-diagonal relative hover:border-[#FA4454]/40 transition-colors">
                <span className="font-mono text-xs text-[#0DF2F2] tracking-widest uppercase">
                  {act.date}
                </span>
                <h3 className="font-display font-black text-2xl text-white tracking-wider mt-1 mb-2">
                  {act.episode} // {act.title}
                </h3>
                <p className="text-white/70 text-xs leading-relaxed font-sans">
                  {act.highlight}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return null;
}
