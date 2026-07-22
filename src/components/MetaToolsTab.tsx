/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sliders,
  Award,
  Crosshair,
  Compass,
  Download,
  RefreshCw,
  Plus,
  Trash2,
  Play,
  Calculator,
  Sword,
  Shield,
  Activity,
  CheckCircle,
  HelpCircle,
  Trophy,
  Sparkles,
  ChevronRight,
  User,
} from "lucide-react";
import { Agent, Weapon } from "../types/valorant";
import { valorantApi } from "../services/api";
import { audio } from "../services/audio";

interface MetaToolsTabProps {
  accentColor: string;
}

const CROSSHAIR_BACKGROUNDS = [
  { id: "haven", name: "HAVEN LONG A", url: "https://media.valorant-api.com/maps/2ee402b8-430b-922c-cc4a-1f85bab7d530/splash.png" },
  { id: "ascent", name: "ASCENT B SITE", url: "https://media.valorant-api.com/maps/d9605473-4d7a-913a-4925-2c92e2cfed0f/splash.png" },
  { id: "bind", name: "BIND SHOWER", url: "https://media.valorant-api.com/maps/7eae2e1b-4097-b766-1731-29e850334d1d/splash.png" },
];

const QUIZ_QUESTIONS = [
  {
    q: "Which agent represents their home country of South Korea?",
    options: ["Neon", "Jett", "Sova", "Sage"],
    correct: 1,
    hint: "Think about high mobility wind-based abilities.",
  },
  {
    q: "What is the standard cost of the Vandal rifle in the credit shop?",
    options: ["¤ 2,900", "¤ 3,200", "¤ 1,600", "¤ 2,100"],
    correct: 0,
    hint: "It matches the price of the Phantom rifle.",
  },
  {
    q: "Sage represents which country in her lore profile?",
    options: ["Japan", "South Korea", "China", "Taiwan"],
    correct: 2,
    hint: "She is a Sentinel focused on jade-based walls.",
  },
  {
    q: "Which duelist ultimate equips a set of highly accurate throwing knives?",
    options: ["Reyna", "Phoenix", "Yoru", "Jett"],
    correct: 3,
    hint: "Her knives recharge instantly on achieving a kill.",
  },
  {
    q: "What is the name of the official professional team-based competitive system?",
    options: ["Premier", "Championship", "Swiftplay", "Champions League"],
    correct: 0,
    hint: "Register weekly lineups and play on maps rosters.",
  },
];

export default function MetaToolsTab({ accentColor }: MetaToolsTabProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);

  // Tools tabs: crosshair, tier, sens, comp, compare, quiz
  const [activeToolTab, setActiveToolTab] = useState<string>("crosshair");

  // --- TIER BUILDER STATES ---
  const [tierList, setTierList] = useState<Record<string, string[]>>({
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
  });

  // --- CROSSHAIR BUILDER STATES ---
  const [crosshairColor, setCrosshairColor] = useState<string>("#00ff00");
  const [innerLines, setInnerLines] = useState({
    opacity: 1,
    length: 6,
    thickness: 2,
    offset: 3,
  });
  const [centerDot, setCenterDot] = useState({
    show: false,
    thickness: 2,
    opacity: 1,
  });
  const [outlines, setOutlines] = useState({
    show: true,
    opacity: 0.5,
    thickness: 1,
  });
  const [selectedBg, setSelectedBg] = useState<string>(CROSSHAIR_BACKGROUNDS[0].url);
  const [exportString, setExportString] = useState("0;P;c;1;h;0;0t;2;0l;6;0o;3;0a;1.0;0f;0;1t;0;1l;0;1o;0;1a;0;1m;0;1f;0");

  // --- SENSITIVITY CALCULATOR STATES ---
  const [sourceGame, setSourceGame] = useState<string>("cs2");
  const [sensInput, setSensInput] = useState<number>(1.2);
  const [dpiInput, setDpiInput] = useState<number>(800);
  const [valSensOutput, setValSensOutput] = useState<number>(0.377);
  const [edpiOutput, setEdpiOutput] = useState<number>(301.6);
  const [cm360Output, setCm360Output] = useState<number>(43.2);

  // --- COMPOSITION BUILDER STATES ---
  const [compAgents, setCompAgents] = useState<string[]>([]);
  const [compScore, setCompScore] = useState<number>(0);
  const [compRoleCounts, setCompRoleCounts] = useState({ Duelist: 0, Sentinel: 0, Initiator: 0, Controller: 0 });

  // --- WEAPON COMPARISON STATES ---
  const [weaponA, setWeaponA] = useState<Weapon | null>(null);
  const [weaponB, setWeaponB] = useState<Weapon | null>(null);

  // --- TACTICAL QUIZ STATES ---
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [userXp, setUserXp] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<number>(1);

  useEffect(() => {
    async function loadData() {
      try {
        const [agentsData, weaponsData] = await Promise.all([
          valorantApi.getAgents(),
          valorantApi.getWeapons(),
        ]);
        setAgents(agentsData);
        setWeapons(weaponsData);

        if (weaponsData.length > 1) {
          setWeaponA(weaponsData[0]);
          setWeaponB(weaponsData[1]);
        }

        // Initialize tier S
        if (agentsData.length >= 3) {
          setTierList({
            S: [agentsData[0].uuid],
            A: [agentsData[1].uuid],
            B: [],
            C: [],
            D: [],
          });
        }

        // Load XP
        const savedXp = localStorage.getItem("vlopedia_xp");
        if (savedXp) {
          const xp = Number(savedXp);
          setUserXp(xp);
          setUserLevel(Math.floor(xp / 500) + 1);
        }
      } catch (err) {
        console.error("Error loading metatools data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // --- TIER BUILDER ACTION HELPERS ---
  const assignAgentToTier = (agentUuid: string, tier: string) => {
    audio.playClick();
    const updated = { ...tierList };
    Object.keys(updated).forEach((key) => {
      updated[key] = updated[key].filter((id) => id !== agentUuid);
    });
    if (tier !== "none") {
      updated[tier].push(agentUuid);
    }
    setTierList(updated);
  };

  const clearTiers = () => {
    audio.playClick();
    setTierList({ S: [], A: [], B: [], C: [], D: [] });
  };

  // --- CROSSHAIR HELPERS ---
  const handleRandomCrosshair = () => {
    audio.playSuccess();
    const colors = ["#00ff00", "#00ffff", "#ff0000", "#ffffff", "#ffff00", "#ff00ff"];
    setCrosshairColor(colors[Math.floor(Math.random() * colors.length)]);
    setInnerLines({
      opacity: Number((Math.random() * 0.5 + 0.5).toFixed(1)),
      length: Math.floor(Math.random() * 8 + 2),
      thickness: Math.floor(Math.random() * 4 + 1),
      offset: Math.floor(Math.random() * 6 + 1),
    });
    setCenterDot({
      show: Math.random() > 0.6,
      thickness: Math.floor(Math.random() * 3 + 1),
      opacity: Number((Math.random() * 0.5 + 0.5).toFixed(1)),
    });
    setOutlines({
      show: Math.random() > 0.4,
      opacity: Number((Math.random() * 0.5).toFixed(1)),
      thickness: 1,
    });
  };

  useEffect(() => {
    const colorId = crosshairColor === "#00ff00" ? "1" : "5";
    const code = `0;P;c;${colorId};h;0;0t;${innerLines.thickness};0l;${innerLines.length};0o;${innerLines.offset};0a;${innerLines.opacity};0f;0;1t;0;1l;0;1o;0;1a;0;1m;0;1f;0`;
    setExportString(code);
  }, [innerLines, centerDot, outlines, crosshairColor]);

  // --- SENSITIVITY CALCULATION EFFECT ---
  useEffect(() => {
    const gameMultipliers: Record<string, number> = {
      cs2: 1 / 3.18,
      apex: 1 / 3.18,
      overwatch: 1 / 10.6,
      fortnite: 1 / 12.5,
      r6: 1 / 11.2,
      pubg: 1 / 10.1,
      valorant: 1,
    };

    const multiplier = gameMultipliers[sourceGame] || 1;
    const computedValSens = Number((sensInput * multiplier).toFixed(3));
    const computedEdpi = Math.round(dpiInput * computedValSens);
    const cm360 = computedValSens > 0 ? Number(((360 / (dpiInput * computedValSens * 0.070014)) * 2.54).toFixed(1)) : 0;

    setValSensOutput(computedValSens);
    setEdpiOutput(computedEdpi);
    setCm360Output(cm360);
  }, [sourceGame, sensInput, dpiInput]);

  // --- COMPOSITION BUILDER EFFECT ---
  useEffect(() => {
    const counts = { Duelist: 0, Sentinel: 0, Initiator: 0, Controller: 0 };
    compAgents.forEach((uuid) => {
      const a = agents.find((ag) => ag.uuid === uuid);
      if (a && a.role) {
        const rName = a.role.displayName;
        if (rName in counts) {
          counts[rName as keyof typeof counts]++;
        }
      }
    });

    setCompRoleCounts(counts);

    // Compute Composition synergy score (0-100%)
    let score = 0;
    if (compAgents.length > 0) {
      // 5-agent team bonus
      score += compAgents.length * 10;
      // Ideal role variety bonus
      const rolesRepresented = Object.values(counts).filter((c) => c > 0).length;
      score += rolesRepresented * 10;
      // Balance checks
      if (counts.Controller >= 1) score += 10; // Smokes are critical!
      if (counts.Initiator >= 1) score += 5;   // Flash/recon
      if (counts.Sentinel >= 1) score += 5;    // Area lock
      if (counts.Duelist >= 1) score += 5;     // Entry frag
      if (counts.Controller === 1 && counts.Duelist <= 2) score += 5; // Balanced team composition
    }

    setCompScore(Math.min(score, 100));
  }, [compAgents, agents]);

  const toggleCompAgent = (uuid: string) => {
    audio.playClick();
    if (compAgents.includes(uuid)) {
      setCompAgents(compAgents.filter((id) => id !== uuid));
    } else {
      if (compAgents.length >= 5) {
        audio.playError();
        return;
      }
      setCompAgents([...compAgents, uuid]);
    }
  };

  const clearComp = () => {
    audio.playClick();
    setCompAgents([]);
  };

  // --- TACTICAL QUIZ HELPERS ---
  const handleAnswerSubmit = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === QUIZ_QUESTIONS[currentQuestion].correct;
    if (isCorrect) {
      audio.playSuccess();
      const newScore = quizScore + 100;
      setQuizScore(newScore);

      const newXp = userXp + 100;
      setUserXp(newXp);
      setUserLevel(Math.floor(newXp / 500) + 1);
      localStorage.setItem("vlopedia_xp", newXp.toString());
    } else {
      audio.playError();
    }

    // Next question delay
    setTimeout(() => {
      setSelectedOption(null);
      setShowHint(false);
      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setQuizFinished(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    audio.playSelect();
    setCurrentQuestion(0);
    setQuizFinished(false);
    setSelectedOption(null);
    setShowHint(false);
    setQuizScore(0);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-val-cyan border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs tracking-widest text-val-cyan animate-pulse">
          CONFIGURING METATOOLS MODULES // API_REQ
        </span>
      </div>
    );
  }

  const allAssignedIds = Object.values(tierList).flat();
  const unassignedAgents = agents.filter((a) => !allAssignedIds.includes(a.uuid));

  return (
    <div className="space-y-6 w-full pb-10">
      {/* HUD HEADER SUB TABS */}
      <div className="flex border-b border-white/[0.05] gap-1 overflow-x-auto scrollbar-none">
        {[
          { id: "crosshair", label: "CROSSHAIR LABS", icon: Crosshair },
          { id: "tier", label: "AGENT TIER LIST", icon: Award },
          { id: "sens", label: "SENS CONVERTER", icon: Sliders },
          { id: "comp", label: "COMP BUILDER", icon: Compass },
          { id: "compare", label: "WEAPONS COMPARATOR", icon: Sword },
          { id: "quiz", label: "TACTICAL QUIZ", icon: Trophy },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeToolTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                audio.playSelect();
                setActiveToolTab(tab.id);
              }}
              className={`px-4 py-3.5 text-xs font-display font-medium uppercase tracking-wider flex items-center space-x-2 border-b-2 whitespace-nowrap transition-all relative ${
                isActive
                  ? "border-val-cyan text-val-cyan bg-val-cyan/5"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- CROSSHAIR BUILDER VIEW --- */}
      {activeToolTab === "crosshair" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-5">
            <div className="font-mono text-[10px] tracking-widest text-gray-400 border-b border-white/[0.05] pb-2 uppercase">
              CROSSHAIR PARAMETER ADJUST
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[10px] text-gray-500 block">CROSSHAIR RETICLE COLOR</span>
              <div className="flex space-x-2">
                {[
                  { label: "Green", hex: "#00ff00" },
                  { label: "Cyan", hex: "#00ffff" },
                  { label: "Red", hex: "#ff0000" },
                  { label: "White", hex: "#ffffff" },
                  { label: "Yellow", hex: "#ffff00" },
                  { label: "Purple", hex: "#ff00ff" },
                ].map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => {
                      audio.playClick();
                      setCrosshairColor(color.hex);
                    }}
                    className={`w-6 h-6 rounded-full border transition-transform ${
                      crosshairColor === color.hex ? "ring-2 ring-white scale-110" : "border-white/10"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <span className="font-mono text-[10px] text-gray-500 block uppercase">INNER LINE PARAMETERS</span>
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[9px] text-gray-400">
                  <span>INNER OPACITY</span>
                  <span>{innerLines.opacity}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={innerLines.opacity}
                  onChange={(e) => setInnerLines({ ...innerLines, opacity: Number(e.target.value) })}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-val-cyan"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[9px] text-gray-400">
                  <span>INNER LENGTH</span>
                  <span>{innerLines.length}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={innerLines.length}
                  onChange={(e) => setInnerLines({ ...innerLines, length: Number(e.target.value) })}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-val-cyan"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[9px] text-gray-400">
                  <span>INNER THICKNESS</span>
                  <span>{innerLines.thickness}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={innerLines.thickness}
                  onChange={(e) => setInnerLines({ ...innerLines, thickness: Number(e.target.value) })}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-val-cyan"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[9px] text-gray-400">
                  <span>INNER OFFSET (GAP)</span>
                  <span>{innerLines.offset}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={innerLines.offset}
                  onChange={(e) => setInnerLines({ ...innerLines, offset: Number(e.target.value) })}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-val-cyan"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/[0.05]">
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-gray-500 block uppercase">CENTER RETICLE DOT</span>
                <label className="flex items-center space-x-2 text-xs font-mono text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={centerDot.show}
                    onChange={(e) => {
                      audio.playClick();
                      setCenterDot({ ...centerDot, show: e.target.checked });
                    }}
                    className="rounded border-gray-600 bg-val-black text-val-cyan w-4 h-4"
                  />
                  <span>SHOW CENTER DOT</span>
                </label>
              </div>
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-gray-500 block uppercase">OUTLINE PROTECTION</span>
                <label className="flex items-center space-x-2 text-xs font-mono text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={outlines.show}
                    onChange={(e) => {
                      audio.playClick();
                      setOutlines({ ...outlines, show: e.target.checked });
                    }}
                    className="rounded border-gray-600 bg-val-black text-val-cyan w-4 h-4"
                  />
                  <span>SHOW OUTLINES</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-white/[0.05]">
              <button
                onClick={handleRandomCrosshair}
                className="flex-1 bg-val-cyan/15 hover:bg-val-cyan/30 text-val-cyan border border-val-cyan/30 py-2.5 rounded font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>GENERATE RANDOM</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-4">
              <div className="font-mono text-[10px] tracking-widest text-gray-400 border-b border-white/[0.05] pb-2 uppercase flex justify-between">
                <span>LIVE COMBAT RETICLE VIEW</span>
                <span className="text-val-cyan">SYS_RENDER</span>
              </div>

              <div className="flex gap-2 pb-1">
                {CROSSHAIR_BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      audio.playClick();
                      setSelectedBg(bg.url);
                    }}
                    className={`px-2.5 py-1 rounded text-[9px] font-mono border uppercase tracking-wider transition-all ${
                      selectedBg === bg.url
                        ? "bg-val-cyan/15 border-val-cyan text-val-cyan"
                        : "bg-white/5 border-white/10 text-gray-400"
                    }`}
                  >
                    {bg.name}
                  </button>
                ))}
              </div>

              <div
                className="w-full aspect-[1.5/1] rounded-lg overflow-hidden border border-white/10 bg-cover bg-center flex items-center justify-center relative shadow-2xl"
                style={{
                  backgroundImage: `url(${selectedBg})`,
                }}
              >
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                <div className="w-48 h-48 flex items-center justify-center relative pointer-events-none">
                  {outlines.show && (
                    <div className="absolute" style={{ opacity: outlines.opacity }}>
                      <div
                        className="absolute bg-black"
                        style={{
                          width: `${innerLines.thickness + 2}px`,
                          height: `${innerLines.length + 2}px`,
                          top: `calc(50% - ${innerLines.length / 2 + 1}px - ${innerLines.offset + 1}px)`,
                          left: `calc(50% - ${innerLines.thickness / 2 + 1}px)`,
                        }}
                      />
                      <div
                        className="absolute bg-black"
                        style={{
                          width: `${innerLines.thickness + 2}px`,
                          height: `${innerLines.length + 2}px`,
                          bottom: `calc(50% - ${innerLines.length / 2 + 1}px - ${innerLines.offset + 1}px)`,
                          left: `calc(50% - ${innerLines.thickness / 2 + 1}px)`,
                        }}
                      />
                      <div
                        className="absolute bg-black"
                        style={{
                          width: `${innerLines.length + 2}px`,
                          height: `${innerLines.thickness + 2}px`,
                          left: `calc(50% - ${innerLines.length / 2 + 1}px - ${innerLines.offset + 1}px)`,
                          top: `calc(50% - ${innerLines.thickness / 2 + 1}px)`,
                        }}
                      />
                      <div
                        className="absolute bg-black"
                        style={{
                          width: `${innerLines.length + 2}px`,
                          height: `${innerLines.thickness + 2}px`,
                          right: `calc(50% - ${innerLines.length / 2 + 1}px - ${innerLines.offset + 1}px)`,
                          top: `calc(50% - ${innerLines.thickness / 2 + 1}px)`,
                        }}
                      />
                    </div>
                  )}

                  <div
                    className="absolute"
                    style={{
                      width: `${innerLines.thickness}px`,
                      height: `${innerLines.length}px`,
                      backgroundColor: crosshairColor,
                      opacity: innerLines.opacity,
                      top: `calc(50% - ${innerLines.length / 2}px - ${innerLines.offset}px)`,
                      left: `calc(50% - ${innerLines.thickness / 2}px)`,
                    }}
                  />
                  <div
                    className="absolute"
                    style={{
                      width: `${innerLines.thickness}px`,
                      height: `${innerLines.length}px`,
                      backgroundColor: crosshairColor,
                      opacity: innerLines.opacity,
                      bottom: `calc(50% - ${innerLines.length / 2}px - ${innerLines.offset}px)`,
                      left: `calc(50% - ${innerLines.thickness / 2}px)`,
                    }}
                  />
                  <div
                    className="absolute"
                    style={{
                      width: `${innerLines.length}px`,
                      height: `${innerLines.thickness}px`,
                      backgroundColor: crosshairColor,
                      opacity: innerLines.opacity,
                      left: `calc(50% - ${innerLines.length / 2}px - ${innerLines.offset}px)`,
                      top: `calc(50% - ${innerLines.thickness / 2}px)`,
                    }}
                  />
                  <div
                    className="absolute"
                    style={{
                      width: `${innerLines.length}px`,
                      height: `${innerLines.thickness}px`,
                      backgroundColor: crosshairColor,
                      opacity: innerLines.opacity,
                      right: `calc(50% - ${innerLines.length / 2}px - ${innerLines.offset}px)`,
                      top: `calc(50% - ${innerLines.thickness / 2}px)`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[9px] text-gray-500 uppercase">
                  VALORANT IMPORT/EXPORT CROSSHAIR CODE:
                </span>
                <div className="flex bg-val-black rounded p-2.5 border border-white/[0.05] relative">
                  <input
                    type="text"
                    readOnly
                    value={exportString}
                    className="font-mono text-[10px] text-val-cyan w-full pr-16 bg-transparent outline-none border-none select-all"
                  />
                  <button
                    onClick={() => {
                      audio.playSuccess();
                      navigator.clipboard.writeText(exportString);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/10 px-2.5 py-1 border border-white/10 rounded font-mono text-[9px] text-white"
                  >
                    COPY CODE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- AGENT TIER BUILDER VIEW --- */}
      {activeToolTab === "tier" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white/[0.01] border border-white/[0.05] p-3.5 rounded-lg font-mono text-[10px]">
            <span className="text-gray-400">CLASSIFIED SYSTEM: CLICK ROSTER PLACEMENT</span>
            <button
              onClick={clearTiers}
              className="px-2.5 py-1 text-val-red hover:bg-val-red/10 border border-val-red/20 rounded font-bold uppercase transition-colors"
            >
              RESET TIER LIST
            </button>
          </div>

          <div className="space-y-3 bg-val-black/45 border border-white/[0.05] p-3.5 rounded-xl">
            {["S", "A", "B", "C", "D"].map((tier) => {
              const rowColors: Record<string, string> = {
                S: "bg-val-red/20 text-val-red border-val-red/30",
                A: "bg-val-orange/20 text-val-orange border-val-orange/30",
                B: "bg-val-purple/20 text-val-purple border-val-purple/30",
                C: "bg-val-cyan/20 text-val-cyan border-val-cyan/30",
                D: "bg-gray-800/40 text-gray-400 border-gray-700/40",
              };

              return (
                <div
                  key={tier}
                  className="flex border border-white/[0.04] rounded bg-white/[0.01] min-h-[90px]"
                >
                  <div
                    className={`w-16 lg:w-24 shrink-0 flex items-center justify-center border-r font-display font-black text-2xl lg:text-3xl tracking-tight ${rowColors[tier]}`}
                  >
                    {tier}
                  </div>
                  <div className="flex-1 flex flex-wrap items-center p-3 gap-3">
                    {tierList[tier].map((agentUuid) => {
                      const agentObj = agents.find((a) => a.uuid === agentUuid);
                      if (!agentObj) return null;
                      return (
                        <div
                          key={agentUuid}
                          onClick={() => assignAgentToTier(agentUuid, "none")}
                          className="w-12 h-12 rounded border border-white/10 overflow-hidden bg-white/5 relative group cursor-pointer hover:border-val-red hover:scale-105 transition-all"
                          title="Click to remove from row"
                        >
                          <img
                            src={agentObj.displayIcon}
                            alt={agentObj.displayName}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-val-red font-mono text-[8px] font-bold">
                            REMOVE
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {unassignedAgents.length > 0 && (
            <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-3">
              <span className="font-mono text-[10px] text-gray-500 block uppercase">
                AVAILABLE ROSTER RESERVES (CLICK TO PLACE):
              </span>
              <div className="flex flex-wrap gap-2">
                {unassignedAgents.map((agent) => (
                  <div
                    key={agent.uuid}
                    className="flex items-center space-x-1.5 p-1 bg-white/[0.02] border border-white/[0.05] hover:border-val-cyan rounded cursor-pointer group"
                  >
                    <img
                      src={agent.displayIcon}
                      alt={agent.displayName}
                      className="w-8 h-8 rounded object-cover border border-white/5"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col pr-2">
                      <span className="font-display font-bold text-[10px] text-white">
                        {agent.displayName}
                      </span>
                      <div className="flex space-x-1.5 text-[8px] font-mono text-gray-500">
                        {["S", "A", "B", "C", "D"].map((t) => (
                          <button
                            key={t}
                            onClick={() => assignAgentToTier(agent.uuid, t)}
                            className="hover:text-val-cyan text-[9px] font-bold font-display"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- SENSITIVITY CALCULATOR VIEW --- */}
      {activeToolTab === "sens" && (
        <div className="max-w-2xl mx-auto bg-white/[0.01] border border-white/[0.05] p-6 rounded-lg space-y-6">
          <div className="flex items-center space-x-2 border-b border-white/[0.05] pb-3">
            <Calculator className="w-5 h-5 text-val-cyan" />
            <h3 className="font-display font-bold text-xs text-white uppercase tracking-wider">
              VALORANT TACTICAL SENSITIVITY CALCULATOR
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-gray-500 uppercase block">
                  SOURCE GAME SPECIFICATION
                </label>
                <select
                  value={sourceGame}
                  onChange={(e) => {
                    audio.playClick();
                    setSourceGame(e.target.value);
                  }}
                  className="w-full bg-val-black border border-white/[0.08] text-xs py-2 px-3 rounded text-white font-mono focus:outline-none focus:border-val-cyan"
                >
                  <option value="cs2">CS2 / CS:GO</option>
                  <option value="apex">Apex Legends</option>
                  <option value="overwatch">Overwatch 2</option>
                  <option value="fortnite">Fortnite</option>
                  <option value="r6">Rainbow Six Siege</option>
                  <option value="pubg">PUBG</option>
                  <option value="valorant">Valorant (Self conversion)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-gray-500 uppercase block">
                  SOURCE IN-GAME SENSITIVITY
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={sensInput}
                  onChange={(e) => setSensInput(Number(e.target.value))}
                  className="w-full bg-val-black border border-white/[0.08] text-xs py-2 px-3 rounded text-white font-mono focus:outline-none focus:border-val-cyan"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] text-gray-500 uppercase block">
                  MOUSE HARDWARE DPI
                </label>
                <input
                  type="number"
                  step="50"
                  value={dpiInput}
                  onChange={(e) => setDpiInput(Number(e.target.value))}
                  className="w-full bg-val-black border border-white/[0.08] text-xs py-2 px-3 rounded text-white font-mono focus:outline-none focus:border-val-cyan"
                />
              </div>
            </div>

            <div className="space-y-4 bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg justify-center flex flex-col">
              <div className="font-mono text-[10px] tracking-widest text-gray-400 border-b border-white/[0.05] pb-2 uppercase">
                CALCULATOR_RESULTS
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] text-gray-400">VALORANT IN-GAME SENS:</span>
                  <span className="font-display font-black text-xl text-val-cyan">
                    {valSensOutput}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-white/[0.03] pt-2.5">
                  <span className="font-mono text-[10px] text-gray-400">CALCULATED eDPI:</span>
                  <span className="font-display font-black text-lg text-white">
                    {edpiOutput}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-white/[0.03] pt-2.5">
                  <span className="font-mono text-[10px] text-gray-400">PHYSICAL DISTANCE (CM/360):</span>
                  <span className="font-display font-black text-lg text-val-red">
                    {cm360Output} cm
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- AGENT COMPOSITION BUILDER VIEW --- */}
      {activeToolTab === "comp" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Roster picker grid (col-span-6) */}
          <div className="lg:col-span-6 bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-4">
            <div className="flex justify-between items-center border-b border-white/[0.05] pb-2">
              <span className="font-mono text-[10px] text-gray-400 uppercase">
                TACTICAL COMBAT ROSTER SELECTION
              </span>
              <button
                onClick={clearComp}
                className="font-mono text-[9px] text-val-red uppercase font-bold hover:underline"
              >
                CLEAR LINEUP
              </button>
            </div>

            <p className="font-sans text-[11px] text-gray-400 font-light leading-normal">
              Click up to 5 agents below to inspect their tactical synergies, role variety, and map compatibility scores.
            </p>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {agents.map((agent) => {
                const isSelected = compAgents.includes(agent.uuid);
                return (
                  <button
                    key={agent.uuid}
                    onClick={() => toggleCompAgent(agent.uuid)}
                    className={`aspect-square rounded border flex flex-col items-center justify-center p-1.5 transition-all relative ${
                      isSelected
                        ? "bg-val-cyan/15 border-val-cyan scale-103 shadow-lg"
                        : "bg-white/[0.02] border-white/[0.08] hover:border-white/20"
                    }`}
                  >
                    <img
                      src={agent.displayIcon}
                      alt={agent.displayName}
                      className="max-h-[80%] max-w-[80%] object-contain rounded"
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-display font-bold text-[8px] text-white truncate w-full text-center uppercase mt-1">
                      {agent.displayName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Synergy analyzer scores card (col-span-6) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-4">
              <div className="border-b border-white/[0.05] pb-2 font-mono text-[10px] text-gray-400 uppercase">
                STRATEGIC ROSTER ANALYZER
              </div>

              {/* Roster list */}
              <div className="flex space-x-2">
                {[...Array(5)].map((_, idx) => {
                  const agentUuid = compAgents[idx];
                  const agentObj = agentUuid ? agents.find((a) => a.uuid === agentUuid) : null;
                  return (
                    <div
                      key={idx}
                      className="flex-1 aspect-square rounded border border-white/[0.05] bg-white/[0.01] flex items-center justify-center relative overflow-hidden group"
                    >
                      {agentObj ? (
                        <>
                          <img
                            src={agentObj.displayIcon}
                            alt="agent"
                            className="max-h-[90%] max-w-[90%] object-contain"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            onClick={() => toggleCompAgent(agentObj.uuid)}
                            className="absolute inset-0 bg-val-red/60 text-white font-mono text-[8px] font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            REMOVE
                          </button>
                        </>
                      ) : (
                        <span className="font-display font-black text-xs text-white/5">?</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Synergy Score */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between font-mono text-[10px]">
                  <span className="text-gray-400">LINEUP SYNERGY INDEX:</span>
                  <span className="text-val-cyan font-bold">{compScore}%</span>
                </div>
                <div className="w-full bg-white/5 h-3 rounded overflow-hidden">
                  <div
                    className="bg-val-cyan h-full transition-all duration-300"
                    style={{ width: `${compScore}%` }}
                  />
                </div>
              </div>

              {/* Roles balance info */}
              <div className="grid grid-cols-4 gap-2 text-center font-mono text-[9px] pt-2">
                <div className="bg-white/[0.02] border border-white/[0.05] p-2 rounded">
                  <div className="text-gray-500">DUELIST</div>
                  <div className="text-white font-bold">{compRoleCounts.Duelist}</div>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.05] p-2 rounded">
                  <div className="text-gray-500">SENTINEL</div>
                  <div className="text-white font-bold">{compRoleCounts.Sentinel}</div>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.05] p-2 rounded">
                  <div className="text-gray-500">INITIATOR</div>
                  <div className="text-white font-bold">{compRoleCounts.Initiator}</div>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.05] p-2 rounded">
                  <div className="text-gray-500">CONTROL</div>
                  <div className="text-white font-bold">{compRoleCounts.Controller}</div>
                </div>
              </div>

              {/* Strategic Advice Notes */}
              <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded font-sans text-xs font-light text-gray-300 space-y-1">
                <div className="font-mono text-[9px] text-val-cyan font-bold uppercase">ARCHIVE ADVICE:</div>
                {compAgents.length === 0 ? (
                  <p>Awaiting squad recruitment selections...</p>
                ) : (
                  <ul className="list-disc pl-4 space-y-1">
                    {compRoleCounts.Controller === 0 && (
                      <li className="text-val-red">Warning: Composition lacks vision-blocking controllers.</li>
                    )}
                    {compRoleCounts.Initiator === 0 && (
                      <li className="text-val-orange">No initiators: recon capabilities reduced.</li>
                    )}
                    {compRoleCounts.Duelist === 0 && (
                      <li className="text-gray-400">No duelists: entry fragmentation depends purely on utilities.</li>
                    )}
                    {compScore >= 80 && (
                      <li className="text-val-cyan font-medium">Excellent variety: high tactical adaptability.</li>
                    )}
                    <li className="text-gray-400">Suggested maps: Ascent, Bind, Split.</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- WEAPON COMPARISON VIEW --- */}
      {activeToolTab === "compare" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 bg-white/[0.01] border border-white/[0.05] p-3.5 rounded-lg">
            {/* weapon A selector */}
            <div className="space-y-1">
              <span className="font-mono text-[9px] text-gray-500 uppercase block">PRIMARY SPECIMEN (WEAPON A)</span>
              <select
                value={weaponA?.uuid || ""}
                onChange={(e) => {
                  audio.playClick();
                  const found = weapons.find((w) => w.uuid === e.target.value);
                  if (found) setWeaponA(found);
                }}
                className="w-full bg-val-black border border-white/[0.08] text-xs py-2 px-3 rounded text-white font-mono focus:outline-none"
              >
                {weapons.map((w) => (
                  <option key={w.uuid} value={w.uuid}>
                    {w.displayName.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* weapon B selector */}
            <div className="space-y-1">
              <span className="font-mono text-[9px] text-gray-500 uppercase block">COMPARATIVE SPECIMEN (WEAPON B)</span>
              <select
                value={weaponB?.uuid || ""}
                onChange={(e) => {
                  audio.playClick();
                  const found = weapons.find((w) => w.uuid === e.target.value);
                  if (found) setWeaponB(found);
                }}
                className="w-full bg-val-black border border-white/[0.08] text-xs py-2 px-3 rounded text-white font-mono focus:outline-none"
              >
                {weapons.map((w) => (
                  <option key={w.uuid} value={w.uuid}>
                    {w.displayName.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison table */}
          {weaponA && weaponB && (
            <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-lg space-y-4 font-mono text-[10px]">
              <div className="border-b border-white/[0.05] pb-2 text-gray-400 uppercase">
                BALLISTIC SPEC COMPARATIVE SUMMARY
              </div>

              <div className="space-y-4">
                {/* Cost comparison */}
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-val-cyan">{weaponA.displayName}: ¤{weaponA.shopData?.cost || 0}</span>
                    <span className="text-gray-500">CREDITS COST</span>
                    <span className="text-val-purple">{weaponB.displayName}: ¤{weaponB.shopData?.cost || 0}</span>
                  </div>
                  <div className="flex h-3 rounded overflow-hidden bg-white/5">
                    <div
                      className="bg-val-cyan h-full transition-all"
                      style={{ width: `${((weaponA.shopData?.cost || 0) / 6000) * 100}%` }}
                    />
                    <div className="w-[1px] bg-white/20" />
                    <div
                      className="bg-val-purple h-full transition-all ml-auto"
                      style={{ width: `${((weaponB.shopData?.cost || 0) / 6000) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Magazine size */}
                {weaponA.weaponStats && weaponB.weaponStats && (
                  <>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-val-cyan">{weaponA.displayName}: {weaponA.weaponStats.magazineSize} rnds</span>
                        <span className="text-gray-500">MAGAZINE CAPACITY</span>
                        <span className="text-val-purple">{weaponB.displayName}: {weaponB.weaponStats.magazineSize} rnds</span>
                      </div>
                      <div className="flex h-3 rounded overflow-hidden bg-white/5">
                        <div
                          className="bg-val-cyan h-full transition-all"
                          style={{ width: `${(weaponA.weaponStats.magazineSize / 100) * 100}%` }}
                        />
                        <div className="w-[1px] bg-white/20" />
                        <div
                          className="bg-val-purple h-full transition-all ml-auto"
                          style={{ width: `${(weaponB.weaponStats.magazineSize / 100) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Fire rate */}
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-val-cyan">{weaponA.displayName}: {weaponA.weaponStats.fireRate} r/s</span>
                        <span className="text-gray-500">FIRE RATE ACCUM</span>
                        <span className="text-val-purple">{weaponB.displayName}: {weaponB.weaponStats.fireRate} r/s</span>
                      </div>
                      <div className="flex h-3 rounded overflow-hidden bg-white/5">
                        <div
                          className="bg-val-cyan h-full transition-all"
                          style={{ width: `${(weaponA.weaponStats.fireRate / 16) * 100}%` }}
                        />
                        <div className="w-[1px] bg-white/20" />
                        <div
                          className="bg-val-purple h-full transition-all ml-auto"
                          style={{ width: `${(weaponB.weaponStats.fireRate / 16) * 100}%` }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- TACTICAL QUIZ VIEW --- */}
      {activeToolTab === "quiz" && (
        <div className="max-w-xl mx-auto bg-white/[0.01] border border-white/[0.05] p-6 rounded-lg space-y-6">
          {/* User Score HUD */}
          <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-val-cyan animate-bounce" />
              <div>
                <div className="text-xs font-display font-black text-white">
                  AGENT CLIENT LEVEL {userLevel}
                </div>
                <div className="font-mono text-[8px] text-gray-500 uppercase">
                  {userXp % 500} / 500 XP TO LEVEL UP
                </div>
              </div>
            </div>
            <div className="text-right font-mono text-xs">
              <div className="text-gray-400">TOTAL SCORE:</div>
              <div className="font-bold text-val-cyan">{quizScore} PTS</div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!quizFinished ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-5"
              >
                <div className="flex justify-between items-center font-mono text-[9px] text-gray-500">
                  <span>TRIVIA TEST: QUESTION {currentQuestion + 1} OF {QUIZ_QUESTIONS.length}</span>
                  <span className="text-val-cyan">¤ +100 XP / COMS</span>
                </div>

                <h4 className="font-display font-bold text-base text-white tracking-wide uppercase leading-snug">
                  {QUIZ_QUESTIONS[currentQuestion].q}
                </h4>

                <div className="space-y-2">
                  {QUIZ_QUESTIONS[currentQuestion].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        audio.playClick();
                        setSelectedOption(idx);
                      }}
                      className={`w-full text-left p-3.5 rounded border font-mono text-xs transition-all ${
                        selectedOption === idx
                          ? "bg-val-cyan/15 border-val-cyan text-white"
                          : "bg-white/[0.02] border-white/[0.08] text-gray-300 hover:bg-white/[0.04]"
                      }`}
                    >
                      {idx + 1}. {opt.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Hint */}
                <div className="pt-2">
                  {!showHint ? (
                    <button
                      type="button"
                      onClick={() => {
                        audio.playClick();
                        setShowHint(true);
                      }}
                      className="font-mono text-[9px] text-gray-500 hover:text-white underline cursor-pointer"
                    >
                      REVEAL COMS HINT
                    </button>
                  ) : (
                    <p className="font-mono text-[10px] text-val-cyan bg-val-cyan/5 p-2.5 rounded border border-val-cyan/10">
                      HINT: {QUIZ_QUESTIONS[currentQuestion].hint}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleAnswerSubmit}
                  disabled={selectedOption === null}
                  className={`w-full py-3.5 rounded font-display font-bold text-xs uppercase tracking-wider transition-all border ${
                    selectedOption === null
                      ? "bg-white/5 border-white/10 text-gray-500 cursor-default"
                      : "bg-val-cyan text-white hover:bg-val-cyan/80 border-val-cyan"
                  }`}
                >
                  TRANSMIT ANSWER
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-6"
              >
                <div className="w-16 h-16 bg-val-cyan/20 border-2 border-val-cyan rounded-full flex items-center justify-center mx-auto text-val-cyan animate-pulse">
                  <CheckCircle className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-display font-black text-xl text-white uppercase tracking-wider">
                    EVALUATION COMPLETED
                  </h4>
                  <p className="font-sans text-xs text-gray-400 font-light max-w-sm mx-auto">
                    You have successfully completed the tactical competency evaluation program.
                  </p>
                </div>

                <button
                  onClick={resetQuiz}
                  className="bg-val-cyan text-white hover:bg-val-cyan/80 px-6 py-3 rounded font-display font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  RE-TEST PROTOCOLS
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
