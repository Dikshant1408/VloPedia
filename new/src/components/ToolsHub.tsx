/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { fetchAgents, fetchWeapons, Agent, Weapon } from "../services/valorantService";
import { playSFX } from "../utils/sfx";
import { Users, Swords, Calculator, TrendingUp, HelpCircle, Shield, Sparkles, Plus, Trash2, ArrowRight } from "lucide-react";
import CrosshairsHub from "./CrosshairsHub";

interface ToolsHubProps {
  subTab: string;
}

export default function ToolsHub({ subTab }: ToolsHubProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Comp Builder State
  const [compMap, setCompMap] = useState("ASCENT");
  const [selectedCompAgents, setSelectedCompAgents] = useState<Agent[]>([]);

  // 2. Sens Calc State
  const [sourceGame, setSourceGame] = useState("CSGO");
  const [sourceSens, setSourceSens] = useState<number>(1.2);
  const [dpi, setDpi] = useState<number>(800);

  // 3. Economy Guide State
  const [teamCredits, setTeamCredits] = useState<number>(3900);

  // 4. Weapon Compare State
  const [compareWeaponA, setCompareWeaponA] = useState<string>("");
  const [compareWeaponB, setCompareWeaponB] = useState<string>("");

  // 5. Quiz State
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const quizQuestions = [
    {
      q: "Which Agent is code-named 'Sabine' in their lore dossiers?",
      options: ["Reyna", "Viper", "Fade", "Sage"],
      answer: 1,
      explain: "Viper's real name is Dr. Sabine Callas, often referred to as Sabine by Omen and other agents."
    },
    {
      q: "What is the headshot multiplier damage of the Sheriff revolver at 30 meters?",
      options: ["145 Damage", "159 Damage", "160 Damage", "150 Damage"],
      answer: 0,
      explain: "The Sheriff deals 145 headshot damage beyond 30 meters, meaning it will not one-shot a fully-armored opponent (150 HP)."
    },
    {
      q: "Which initiator hails from Turkey and commands nightmares?",
      options: ["Breach", "Sova", "Fade", "Gekko"],
      answer: 2,
      explain: "Fade is a Turkish bounty hunter who uses nightmares and terror trails to hunt down target coordinates."
    },
    {
      q: "How many credits are awarded to a player who successfully plants the Spike?",
      options: ["200 Credits", "300 Credits", "100 Credits", "0 Credits"],
      answer: 1,
      explain: "Planting the Spike awards exactly 300 credits to the planter, while the rest of the team also receives round completion awards."
    },
    {
      q: "What is Jett's ultimate ability name?",
      options: ["Blade Storm", "Tailwind", "Cloudburst", "Updraft"],
      answer: 0,
      explain: "Jett's ultimate is Blade Storm, equipping highly accurate throwing daggers that reset on kills."
    }
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const [a, w] = await Promise.all([fetchAgents(), fetchWeapons()]);
        setAgents(a);
        setWeapons(w);
        if (w.length > 1) {
          // Defaults for comparison
          const vandal = w.find((x) => x.displayName === "Vandal") || w[0];
          const phantom = w.find((x) => x.displayName === "Phantom") || w[1];
          setCompareWeaponA(vandal.uuid);
          setCompareWeaponB(phantom.uuid);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 1. COMP BUILDER LOGIC
  const handleAddAgentToComp = (agent: Agent) => {
    if (selectedCompAgents.length >= 5) return;
    if (selectedCompAgents.some((a) => a.uuid === agent.uuid)) return;
    setSelectedCompAgents([...selectedCompAgents, agent]);
    playSFX.tick();
  };

  const handleRemoveAgentFromComp = (uuid: string) => {
    setSelectedCompAgents(selectedCompAgents.filter((a) => a.uuid !== uuid));
    playSFX.hoverClick();
  };

  const getRoleCount = (roleName: string) => {
    return selectedCompAgents.filter((a) => a.role?.displayName === roleName).length;
  };

  const getCompSynergyScore = () => {
    if (selectedCompAgents.length === 0) return 0;
    let score = 50;
    const rolesPresent = new Set(selectedCompAgents.map((a) => a.role?.displayName));
    score += rolesPresent.size * 10; // More roles is better synergy
    if (rolesPresent.has("Controller")) score += 10; // Essential
    if (rolesPresent.has("Initiator")) score += 5;
    if (rolesPresent.has("Sentinel")) score += 5;
    return Math.min(score, 100);
  };

  // 2. SENS CALC LOGIC
  const getValorantSens = () => {
    const conversions: { [key: string]: number } = {
      CSGO: 3.181818,
      APEX: 3.181818,
      OW: 10.6,
      R6S: 38.39,
      FORTNITE: 12.6
    };
    const div = conversions[sourceGame] || 3.18;
    return (sourceSens / div).toFixed(3);
  };

  const geteDPI = () => {
    const valSens = parseFloat(getValorantSens());
    return Math.round(valSens * dpi);
  };

  // 3. ECONOMY RULES LOGIC
  const getEconomyVerdict = () => {
    if (teamCredits < 1500) {
      return {
        type: "FULL ECO (SAVE)",
        desc: "Save all credits. Do not buy weapons. Focus on picking up dead players' weapons or surprise melee ambushes. Save minimum 2000 credits for the next round.",
        recs: ["Classic (Free)", "Shorty ($150)", "Light Shields ($400)"],
        color: "#FA4454"
      };
    } else if (teamCredits < 3300) {
      return {
        type: "HALF BUY / FORCE BUY",
        desc: "Buy cheaper weapons (Spectre, Ares, Sheriff) along with light shields. Keep some credits to guarantee a minimum of 3900 for the subsequent full-buy round.",
        recs: ["Spectre ($1600)", "Sheriff ($800)", "Light Shields ($400)"],
        color: "#ECE8E1"
      };
    } else {
      return {
        type: "FULL BUY ROUND",
        desc: "Equip primary rifles (Vandal or Phantom), Heavy Shield armor, and complete agent utility suites. This represents the maximum combat-effectiveness loadout.",
        recs: ["Vandal ($2900)", "Phantom ($2900)", "Heavy Shields ($1000)", "Full Utility"],
        color: "#0DF2F2"
      };
    }
  };

  // Renders CrosshairsHub directly
  if (subTab === "crosshair-gen") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <CrosshairsHub />
      </motion.div>
    );
  }

  // 1. COMP BUILDER
  if (subTab === "comp-builder") {
    const synergy = getCompSynergyScore();
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
            <span>TEAM COORDINATION</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#ECE8E1] tracking-tighter">
            TACTICAL COMP BUILDER
          </h2>
          <p className="text-white/50 text-sm max-w-xl mt-2">
            Draft a 5-agent tournament squad. Our system calculates immediate tactical synergy ratings and role balance parameters.
          </p>
        </div>

        {/* Map selection */}
        <div className="flex items-center gap-4 bg-[#0B141A]/90 border border-white/10 p-4 clip-diagonal-sm mb-8">
          <span className="font-mono text-xs text-white/40 uppercase">TACTICAL OPERATION MAP:</span>
          <select
            value={compMap}
            onChange={(e) => setCompMap(e.target.value)}
            className="bg-[#0B141A] border border-white/10 text-[#0DF2F2] p-2 font-mono text-xs focus:outline-none uppercase"
          >
            {["ASCENT", "BIND", "HAVEN", "SPLIT", "SUNSET", "LOTUS", "ICEBOX", "BREEZE", "ABYSS"].map((m) => (
              <option key={m} value={m}>
                {m} MAP ARCHITECTURE
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active 5-Man Roster */}
          <div className="lg:col-span-2 border-[rgba(236,232,225,0.12)] surface-glass p-6 clip-diagonal-sm relative">
            <h3 className="font-mono text-sm text-[#FA4454] font-bold uppercase tracking-widest mb-4">
              ACTIVE ROSTER ({selectedCompAgents.length} / 5)
            </h3>

            <div className="grid grid-cols-5 gap-4 min-h-[160px] mb-6">
              {[0, 1, 2, 3, 4].map((slot) => {
                const agent = selectedCompAgents[slot];
                return (
                  <div
                    key={slot}
                    className="aspect-square bg-white/[0.01] border border-dashed border-white/15 flex flex-col items-center justify-center p-2 relative clip-diagonal-sm group hover:border-[#FA4454]/40 transition-colors"
                  >
                    {agent ? (
                      <>
                        <button
                          onClick={() => handleRemoveAgentFromComp(agent.uuid)}
                          className="absolute top-1 right-1 p-1 bg-[#FA4454]/20 hover:bg-[#FA4454] text-[#FA4454] hover:text-white rounded-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-none interactive-tactical"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        {agent.displayIconSmall && (
                          <img
                            src={agent.displayIconSmall}
                            alt={agent.displayName}
                            className="w-12 h-12 object-contain"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <span className="font-mono text-[9px] text-white uppercase font-bold mt-2 text-center leading-tight">
                          {agent.displayName}
                        </span>
                        <span className="font-mono text-[7px] text-[#ECE8E1]/60 uppercase mt-0.5 text-center leading-tight">
                          {agent.role?.displayName || "AGENT"}
                        </span>

                      </>
                      ) : (
                      <span className="font-mono text-[10px] text-white/20 uppercase italic">EMPTY</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Synergy Dashboard */}
            {selectedCompAgents.length > 0 && (
              <div className="border-t border-white/5 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="font-mono text-xs text-[#0DF2F2] block mb-2 uppercase">ROLE DISTRIBUTION</span>
                  <div className="space-y-2 font-mono text-xs">
                    {["Duelist", "Sentinel", "Initiator", "Controller"].map((role) => {
                      const count = getRoleCount(role);
                      return (
                        <div key={role} className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-white/40 uppercase">{role}S</span>
                          <span className="text-white font-bold">{count} / 5</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-center bg-white/[0.02] border border-white/10 p-4 clip-diagonal-sm flex flex-col justify-center">
                  <span className="font-mono text-[10px] text-white/40 block mb-1 uppercase">TACTICAL SYNERGY SCORE</span>
                  <span className="font-display font-black text-4xl text-[#0DF2F2]">{synergy}%</span>
                  <span className="font-mono text-[9px] text-[#FA4454] mt-2 block uppercase font-bold">
                    {getRoleCount("Controller") === 0 ? "WARNING: NO SMOKES SELECTED!" : "ROSTER SECURED // STABLE"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Roster Picker Selector List */}
          <div className="border-[rgba(236,232,225,0.12)] surface-glass p-6 clip-diagonal-sm h-[500px] overflow-y-auto">
            <h3 className="font-mono text-sm text-[#0DF2F2] font-bold uppercase tracking-widest mb-4">
              AGENT POOL REGISTER
            </h3>

            {loading ? (
              <div className="text-center py-12 font-mono text-white/20">FETCHING ROSTER...</div>
            ) : (
              <div className="space-y-2">
                {agents.map((agent) => {
                  const isSelected = selectedCompAgents.some((a) => a.uuid === agent.uuid);
                  return (
                    <div
                      key={agent.uuid}
                      onClick={() => !isSelected && handleAddAgentToComp(agent)}
                      className={`flex items-center justify-between p-3 border clip-diagonal-sm cursor-none interactive-tactical transition-colors ${
                        isSelected
                          ? "bg-white/5 border-white/10 opacity-40 cursor-not-allowed"
                          : "bg-white/[0.01] border-white/10 hover:border-[#FA4454]/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {agent.displayIconSmall && (
                          <img
                            src={agent.displayIconSmall}
                            alt={agent.displayName}
                            className="w-8 h-8 rounded-full border border-white/10"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <div>
                          <span className="font-mono text-xs font-bold text-white uppercase">{agent.displayName}</span>
                          <span className="font-mono text-[8px] text-white/40 block uppercase">
                            {agent.role?.displayName || "AGENT"}
                          </span>
                        </div>
                      </div>
                      {!isSelected && <Plus className="w-4 h-4 text-[#FA4454]" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // 2. SENSITIVITY CALCULATOR
  if (subTab === "sens-calc") {
    const convertedSens = getValorantSens();
    const edpi = geteDPI();

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
            <span>AIM CONVERSION</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#ECE8E1] tracking-tighter">
            SENSITIVITY TRANSLATOR
          </h2>
          <p className="text-white/50 text-sm max-w-xl mt-2">
            Translate sensitivity coefficients from external games directly into Valorant Protocol variables. Standardize your eDPI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="surface-glass border-[rgba(236,232,225,0.12)] p-6 clip-diagonal-sm space-y-6">
            <div>
              <label className="font-mono text-xs text-white/40 block mb-2 uppercase">SOURCE TITLE / CONVERSION COEF</label>
              <select
                value={sourceGame}
                onChange={(e) => { setSourceGame(e.target.value); playSFX.tick(); }}
                className="w-full bg-[#0B141A] border border-white/10 text-white p-3 font-mono text-xs focus:outline-none uppercase"
              >
                <option value="CSGO">CS:GO / CS2 (SOURCE)</option>
                <option value="APEX">APEX LEGENDS</option>
                <option value="OW">OVERWATCH 1 / 2</option>
                <option value="R6S">RAINBOW SIX SIEGE</option>
                <option value="FORTNITE">FORTNITE SENS</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-xs text-white/40 block mb-2 uppercase">SOURCE SENSITIVITY VALUE</label>
              <input
                type="number"
                step="0.01"
                value={sourceSens}
                onChange={(e) => { setSourceSens(parseFloat(e.target.value) || 0); playSFX.tick(); }}
                className="w-full bg-[#05080B] border border-white/10 text-white p-3 font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-xs text-white/40 block mb-2 uppercase">HARDWARE DPI RATIO</label>
              <input
                type="number"
                step="50"
                value={dpi}
                onChange={(e) => { setDpi(parseInt(e.target.value) || 0); playSFX.tick(); }}
                className="w-full bg-[#05080B] border border-white/10 text-white p-3 font-mono text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Outputs */}
          <div className="surface-glass border-[rgba(236,232,225,0.12)] p-8 clip-diagonal-sm flex flex-col justify-between relative overflow-hidden text-center group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#0DF2F2]" />
            <span className="font-mono text-xs text-white/40 tracking-widest block uppercase mb-4">TACTICAL AIM REPORT</span>

            <div className="space-y-6">
              <div>
                <span className="font-mono text-xs text-white/30 block uppercase mb-1">TRANSLATED VALORANT SENSITIVITY</span>
                <span className="font-display font-black text-4xl sm:text-5xl text-[#0DF2F2]">{convertedSens}</span>
              </div>
              <div className="w-full h-px bg-white/5" />
              <div>
                <span className="font-mono text-xs text-white/30 block uppercase mb-1">YOUR CALCULATED EDPI STANDING</span>
                <span className="font-display font-black text-3xl text-[#FA4454]">{edpi} eDPI</span>
                <span className="font-mono text-[9px] text-white/20 block mt-1 uppercase">
                  (VAL_SENS * DPI = SENS_MULTIPLIER)
                </span>
              </div>
            </div>

            <div className="mt-8 font-mono text-[9px] text-white/30 uppercase">
              RETAIN AIM ENGINE REPLICABILITY // ACTIVE
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // 3. ECONOMY ROUND ADVISOR
  if (subTab === "economy") {
    const verdict = getEconomyVerdict();

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
            <span>FINANCIAL INTELLIGENCE</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#ECE8E1] tracking-tighter">
            ROUND ECONOMY ADVISOR
          </h2>
          <p className="text-white/50 text-sm max-w-xl mt-2">
            Maintain positive team accounts. Input average team credits to receive immediate tactical procurement guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="surface-glass border-[rgba(236,232,225,0.12)] p-6 clip-diagonal-sm flex flex-col justify-between">
            <div>
              <label className="font-mono text-xs text-white/40 block mb-4 uppercase">AVERAGE TEAM VAL_CREDITS</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="9000"
                  step="100"
                  value={teamCredits}
                  onChange={(e) => { setTeamCredits(parseInt(e.target.value)); playSFX.tick(); }}
                  className="flex-1 accent-[#FA4454]"
                />
                <span className="font-mono text-lg font-black text-white w-20 text-right">${teamCredits}</span>
              </div>

              {/* Economy Rules Cheat Sheet */}
              <div className="mt-8 space-y-2 font-mono text-xs border-t border-white/5 pt-4">
                <span className="text-[#0DF2F2] text-[10px] block uppercase font-bold mb-2">CREDITS REWARDS POLICY</span>
                <div className="flex justify-between text-white/50">
                  <span>ROUND WINNER AWARD</span>
                  <span className="text-white font-bold">+$3,000</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>ROUND LOSER AWARD</span>
                  <span className="text-white font-bold">+$1,900 to +$2,900</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>SPIKE PLANT BONUS</span>
                  <span className="text-white font-bold">+$300 (WHOLE TEAM)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Decision Verdict */}
          <div className="surface-glass border-[rgba(236,232,225,0.12)] p-8 clip-diagonal-sm relative flex flex-col justify-between">
            <div 
              className="absolute top-0 left-0 w-2 h-full" 
              style={{ backgroundColor: verdict.color }}
            />
            <div>
              <span className="font-mono text-xs text-white/40 tracking-widest block uppercase mb-1">STRATEGIC VERDICT</span>
                  <h3 className="font-display font-black text-2xl text-white tracking-wider uppercase mb-3" style={{ color: verdict.color }}>
                {verdict.type}
              </h3>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                {verdict.desc}
              </p>

              <h4 className="font-mono text-[10px] text-[#0DF2F2] tracking-widest uppercase mb-2">RECOMMENDED PURCHASES</h4>
              <div className="flex flex-wrap gap-2">
                {verdict.recs.map((rec) => (
                  <span key={rec} className="font-mono text-xs bg-white/[0.03] border border-white/10 px-3 py-1.5 text-white/80 uppercase">
                    {rec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // 4. WEAPON COMPARE TOOL
  if (subTab === "weapon-compare") {
    const selectedWeaponA = weapons.find((w) => w.uuid === compareWeaponA);
    const selectedWeaponB = weapons.find((w) => w.uuid === compareWeaponB);

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
            <span>BALLISTICS DEP</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#ECE8E1] tracking-tighter">
            ARSENAL COMPARATIVE ANALYSIS
          </h2>
          <p className="text-white/50 text-sm max-w-xl mt-2">
            Side-by-side comparative diagnostics of weapon firepower, reload times, firing rates, and buying costs.
          </p>
        </div>

        {/* Comparers select */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="surface-glass border-[rgba(236,232,225,0.12)] p-4 clip-diagonal-sm">
            <label className="font-mono text-[10px] text-white/40 uppercase block mb-1">WEAPON MODEL A</label>
            <select
              value={compareWeaponA}
              onChange={(e) => { setCompareWeaponA(e.target.value); playSFX.tick(); }}
              className="w-full bg-[#0B141A] border border-white/10 text-white p-2 font-mono text-xs focus:outline-none uppercase"
            >
              {weapons.map((w) => (
                <option key={w.uuid} value={w.uuid}>{w.displayName}</option>
              ))}
            </select>
          </div>

          <div className="surface-glass border-[rgba(236,232,225,0.12)] p-4 clip-diagonal-sm">
            <label className="font-mono text-[10px] text-white/40 uppercase block mb-1">WEAPON MODEL B</label>
            <select
              value={compareWeaponB}
              onChange={(e) => { setCompareWeaponB(e.target.value); playSFX.tick(); }}
              className="w-full bg-[#0B141A] border border-white/10 text-white p-2 font-mono text-xs focus:outline-none uppercase"
            >
              {weapons.map((w) => (
                <option key={w.uuid} value={w.uuid}>{w.displayName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Weapons comparison charts */}
        {selectedWeaponA && selectedWeaponB && (
          <div className="surface-glass border-[rgba(236,232,225,0.12)] p-6 clip-diagonal-sm">
            <div className="grid grid-cols-2 gap-6 text-center border-b border-white/5 pb-6 mb-6">
              <div>
                <h3 className="font-display font-black text-2xl text-[#FA4454] uppercase">{selectedWeaponA.displayName}</h3>
                <span className="font-mono text-xs text-white/40 uppercase">{selectedWeaponA.category}</span>
              </div>
              <div className="border-l border-white/10">
                <h3 className="font-display font-black text-2xl text-[#0DF2F2] uppercase">{selectedWeaponB.displayName}</h3>
                <span className="font-mono text-xs text-white/40 uppercase">{selectedWeaponB.category}</span>
              </div>
            </div>

            {/* Comparison Metrics */}
            <div className="space-y-6 font-mono text-xs">
              {[
                { label: "ACQUISITION COST", valA: selectedWeaponA.shopData?.cost || 0, valB: selectedWeaponB.shopData?.cost || 0, max: 5000, suffix: " CREDITS" },
                { label: "MAGAZINE CAPACITY", valA: selectedWeaponA.weaponStats?.magazineSize || 0, valB: selectedWeaponB.weaponStats?.magazineSize || 0, max: 100 },
                { label: "BALISTIC FIRE RATE", valA: selectedWeaponA.weaponStats?.fireRate || 0, valB: selectedWeaponB.weaponStats?.fireRate || 0, max: 16, suffix: " RDS/SEC" },
                { label: "RELOAD SPEED TIMING", valA: selectedWeaponA.weaponStats?.reloadTimeSeconds || 0, valB: selectedWeaponB.weaponStats?.reloadTimeSeconds || 0, max: 5, inverse: true, suffix: " SEC" }
              ].map((metric) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex justify-between font-bold text-white/60">
                    <span>{metric.label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Weapon A Bar */}
                    <div className="flex items-center gap-2 justify-end">
                      <span className="font-bold text-white">{metric.valA}{metric.suffix || ""}</span>
                      <div className="w-1/2 bg-white/5 h-3 overflow-hidden relative border border-white/10">
                        <div className="bg-[#FA4454] h-full transition-all duration-300" style={{ width: `${(metric.valA / metric.max) * 100}%` }} />
                      </div>
                    </div>
                    {/* Weapon B Bar */}
                    <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                      <div className="w-1/2 bg-white/5 h-3 overflow-hidden relative border border-white/10">
                        <div className="bg-[#0DF2F2] h-full transition-all duration-300" style={{ width: `${(metric.valB / metric.max) * 100}%` }} />
                      </div>
                      <span className="font-bold text-white">{metric.valB}{metric.suffix || ""}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // 5. AGENT QUIZ
  if (subTab === "quiz") {
    const handleAnswerClick = (index: number) => {
      if (isAnswerSubmitted) return;
      setSelectedAnswer(index);
      playSFX.tick();
    };

    const handleAnswerSubmit = () => {
      if (selectedAnswer === null) return;
      setIsAnswerSubmitted(true);
      if (selectedAnswer === quizQuestions[currentQuestion].answer) {
        setQuizScore(quizScore + 1);
        playSFX.selectSurge();
      } else {
        playSFX.scanBeep();
      }
    };

    const handleNextQuestion = () => {
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setCurrentQuestion(currentQuestion + 1);
      playSFX.tick();
    };

    const handleRestartQuiz = () => {
      setQuizStarted(true);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setQuizScore(0);
      playSFX.selectSurge();
    };

    const getQuizRankTitle = (score: number) => {
      if (score === 5) return "RADIANT TACTICIAN";
      if (score >= 3) return "IMMORTAL COMMANDER";
      return "IRON RECRUIT";
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
            <span>PROTOCOL ACADEMY</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#ECE8E1] tracking-tighter">
            INTELLIGENCE ASSESSMENT QUIZ
          </h2>
          <p className="text-white/50 text-sm max-w-xl mt-2">
            Assess your database intelligence score on Agent history, weapon statistics, and map architectures.
          </p>
        </div>

        {!quizStarted ? (
          <div className="border-[rgba(236,232,225,0.12)] surface-glass p-8 clip-diagonal-sm text-center max-w-2xl mx-auto">
            <HelpCircle className="w-16 h-16 text-[#FA4454] mx-auto mb-4 animate-bounce" />
            <h3 className="font-display font-black text-2xl text-white tracking-wider mb-2">READY TO COMMENCE ASSESMENT?</h3>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
              Test your mechanical and operational knowledge about Valorant. This assessment covers ultimate names, ballistics reports, and dossier lore facts.
            </p>
            <button
              onClick={handleRestartQuiz}
              onMouseEnter={() => playSFX.hoverClick()}
              className="bg-[#FA4454] hover:bg-[#FA4454]/90 text-white font-mono text-xs font-bold uppercase px-6 py-3 tracking-widest clip-diagonal-sm cursor-none interactive-tactical"
            >
              COMMENCE TEST ROUTINE // START
            </button>
          </div>
        ) : currentQuestion < quizQuestions.length ? (
          <div className="border-[rgba(236,232,225,0.12)] surface-glass p-8 clip-diagonal-sm max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
              <span className="font-mono text-xs text-[#0DF2F2] tracking-widest uppercase">QUESTION 0{currentQuestion + 1} / 05</span>
              <span className="font-mono text-xs text-white/40">SCORE: {quizScore} / 5</span>
            </div>

            <h3 className="font-display font-bold text-xl text-white tracking-wider mb-6">
              {quizQuestions[currentQuestion].q}
            </h3>

            <div className="space-y-3">
              {quizQuestions[currentQuestion].options.map((opt, idx) => {
                let btnStyle = "border-white/10 hover:border-white/20 bg-white/[0.01]";
                if (selectedAnswer === idx) {
                  btnStyle = "border-[#FA4454] bg-[#FA4454]/10 text-white";
                }
                if (isAnswerSubmitted) {
                  if (idx === quizQuestions[currentQuestion].answer) {
                    btnStyle = "border-[#0DF2F2] bg-[#0DF2F2]/10 text-[#0DF2F2]";
                  } else if (selectedAnswer === idx) {
                    btnStyle = "border-[#FA4454] bg-[#FA4454]/15 text-[#FA4454]";
                  } else {
                    btnStyle = "border-white/5 bg-transparent opacity-45";
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswerClick(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-4 border clip-diagonal-sm font-mono text-xs text-left uppercase transition-colors flex items-center justify-between cursor-none interactive-tactical ${btnStyle}`}
                  >
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Answer feedback */}
            {isAnswerSubmitted && (
              <div className="bg-white/[0.02] border border-white/10 p-4 clip-diagonal-sm mt-6 font-sans text-xs leading-relaxed text-white/80">
                <strong className="font-mono text-[#0DF2F2] block mb-1 uppercase">EXPLANATION</strong>
                {quizQuestions[currentQuestion].explain}
              </div>
            )}

            <div className="flex justify-end mt-8 border-t border-white/5 pt-4">
              {!isAnswerSubmitted ? (
                <button
                  onClick={handleAnswerSubmit}
                  disabled={selectedAnswer === null}
                  className={`px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest clip-diagonal-sm cursor-none interactive-tactical ${
                    selectedAnswer === null
                      ? "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
                      : "bg-[#0DF2F2] text-[#010a10]"
                  }`}
                >
                  SUBMIT DECISION // ENTER
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="bg-white/5 border border-white/10 hover:border-white/20 text-white font-mono text-xs font-bold uppercase px-6 py-3 tracking-widest clip-diagonal-sm cursor-none interactive-tactical flex items-center gap-2"
                >
                  <span>{currentQuestion === quizQuestions.length - 1 ? "FINISH EXAM" : "NEXT INQUIRY"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="border-[rgba(236,232,225,0.12)] surface-glass p-8 clip-diagonal-sm text-center max-w-2xl mx-auto">
            <h3 className="font-display font-black text-3xl text-white mb-2 uppercase">ASSESSMENT PROTOCOL COMPLETED</h3>
            <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.2em] block mb-6 uppercase">EXAM SCORE REPORT</span>

            <div className="w-32 h-32 rounded-full border-4 border-[#FA4454] flex items-center justify-center font-display font-black text-4xl text-white mx-auto mb-6">
              {quizScore} / 5
            </div>

            <h4 className="font-display font-bold text-xl text-[#0DF2F2] mb-1 uppercase">
              {getQuizRankTitle(quizScore)}
            </h4>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-6">
              Radianite synchronization rate score: {quizScore * 20}%. Re-initialize the diagnostic examination routine to hone tactical knowledge capabilities.
            </p>

            <button
              onClick={handleRestartQuiz}
              onMouseEnter={() => playSFX.hoverClick()}
              className="bg-[#FA4454] hover:bg-[#FA4454]/90 text-white font-mono text-xs font-bold uppercase px-6 py-3 tracking-widest clip-diagonal-sm cursor-none interactive-tactical"
            >
              RE-ATTEMPT ROUTINE // START
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  return null;
}
