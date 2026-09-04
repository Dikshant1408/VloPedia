"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { 
  Zap, Shield, Target, Users, Share2, ArrowRight, 
  Copy, CheckCircle, Crosshair, AlertTriangle, Sparkles, 
  Play, RotateCcw, Plus, Minus, DollarSign, Save, 
  BarChart2, Award, TrendingUp, HelpCircle 
} from "lucide-react";
import { toast } from "sonner";
import { getAgentKnowledgeNode } from "@/lib/knowledge-graph";

const MAPS = ["Ascent", "Bind", "Haven", "Sunset", "Lotus", "Split", "Icebox", "Breeze", "Abyss", "Fracture"];
const AGENTS = ["Jett", "Omen", "Sova", "Raze", "Cypher", "Killjoy", "Reyna", "Clove", "Viper", "Fade", "Gekko", "KAY/O", "Breach", "Neon", "Yoru", "Iso", "Vyse", "Sage"];
const SIDES = ["Attack", "Defense"] as const;

const MAP_COMPS: Record<string, { comp: string[]; synergy: number; desc: string }> = {
  Ascent: { comp: ["Jett", "Omen", "Sova", "Killjoy", "KAY/O"], synergy: 96, desc: "The gold-standard pro meta comp for Ascent. Heavy Mid control with Recon and one-way smokes." },
  Bind: { comp: ["Raze", "Brimstone", "Viper", "Fade", "Cypher"], synergy: 94, desc: "Double controller choke denial with explosive Satchel entries into Hookah and A Lamps." },
  Haven: { comp: ["Jett", "Omen", "Sova", "Breach", "Killjoy"], synergy: 92, desc: "Triple-site coverage with Breach Stuns and Sova Recon arrows clearing Garage." },
  Sunset: { comp: ["Raze", "Clove", "Gekko", "Fade", "Cypher"], synergy: 95, desc: "Dominant Mid Courtyard control with Wingman auto-plant and Cypher B site lock." },
  Lotus: { comp: ["Raze", "Omen", "Fade", "Killjoy", "Viper"], synergy: 93, desc: "A Rubble and C Mound fast contest with rotating hollow smokes." },
  Split: { comp: ["Raze", "Omen", "Skye", "Cypher", "Viper"], synergy: 91, desc: "Mid Mail and B Heaven vertical control with heavy Sentinel anchor setups." },
  Icebox: { comp: ["Jett", "Viper", "Sova", "Killjoy", "Sage"], synergy: 94, desc: "A Site vertical Updraft Operator angles and B Main wall plant safety." },
  Breeze: { comp: ["Jett", "Viper", "Sova", "Cypher", "KAY/O"], synergy: 95, desc: "Long-range Vandal/Operator duels with full-length Toxic Screen line splits." },
  Abyss: { comp: ["Jett", "Omen", "Sova", "Vyse", "Cypher"], synergy: 92, desc: "High verticality with mid chasm control and isolation traps." },
  Fracture: { comp: ["Raze", "Brimstone", "Breach", "Fade", "Killjoy"], synergy: 90, desc: "Pincer attacks from both spawns with rolling Breach fault lines." },
};

export interface CompletedMatchLog {
  id: string;
  date: string;
  map: string;
  agent: string;
  result: "VICTORY" | "DEFEAT";
  myScore: number;
  enemyScore: number;
  adr: number;
  kills: number;
  deaths: number;
  firstKills: number;
  firstDeaths: number;
  clutches: number;
  strengths: string[];
  problems: string[];
  recommendation: string;
}

export default function MatchPrepPage() {
  const [selectedMap, setSelectedMap] = useState("Ascent");
  const [selectedSide, setSelectedSide] = useState<"Attack" | "Defense">("Attack");
  const [selectedAgent, setSelectedAgent] = useState("Jett");
  
  // Live Match State Session
  const [currentRound, setCurrentRound] = useState(1);
  const [myScore, setMyScore] = useState(0);
  const [enemyScore, setEnemyScore] = useState(0);
  const [credits, setCredits] = useState(800);
  const [lossStreak, setLossStreak] = useState(0);

  // Post-Match Review Form State
  const [postAdr, setPostAdr] = useState(164);
  const [postKills, setPostKills] = useState(21);
  const [postDeaths, setPostDeaths] = useState(14);
  const [postFk, setPostFk] = useState(5);
  const [postFd, setPostFd] = useState(3);
  const [postClutches, setPostClutches] = useState(1);
  const [postResult, setPostResult] = useState<"VICTORY" | "DEFEAT">("VICTORY");
  const [postAnalysis, setPostAnalysis] = useState<CompletedMatchLog | null>(null);

  // Load session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("vlopedia_active_match_session");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.map) setSelectedMap(data.map);
        if (data.side) setSelectedSide(data.side);
        if (data.agent) setSelectedAgent(data.agent);
        if (data.round) setCurrentRound(data.round);
        if (data.myScore !== undefined) setMyScore(data.myScore);
        if (data.enemyScore !== undefined) setEnemyScore(data.enemyScore);
        if (data.credits) setCredits(data.credits);
        if (data.lossStreak !== undefined) setLossStreak(data.lossStreak);
      }
    } catch (e) {}
  }, []);

  const saveSession = () => {
    const session = {
      map: selectedMap,
      side: selectedSide,
      agent: selectedAgent,
      round: currentRound,
      myScore,
      enemyScore,
      credits,
      lossStreak,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem("vlopedia_active_match_session", JSON.stringify(session));
    toast.success("Match session state saved!");
  };

  const handleRoundOutcome = (won: boolean) => {
    const nextLossStreak = won ? 0 : Math.min(lossStreak + 1, 3);
    const bonus = won ? 3000 : 1900 + nextLossStreak * 500;
    const newCredits = Math.min(credits + bonus, 9000);

    setCredits(newCredits);
    setLossStreak(nextLossStreak);
    setCurrentRound(r => r + 1);
    if (won) setMyScore(s => s + 1);
    else setEnemyScore(s => s + 1);

    toast.info(`Round ${currentRound} recorded (${won ? "VICTORY +$3,000" : `DEFEAT +$${bonus}`}). Next Round: $${newCredits} Credits.`);
  };

  const generatePostMatchReview = () => {
    const kdRatio = Number((postKills / Math.max(1, postDeaths)).toFixed(2));
    const fkDifferential = postFk - postFd;

    const strengths: string[] = [];
    const problems: string[] = [];

    // Strengths evaluation
    if (postFk >= 4) {
      strengths.push(`High opening impact (${postFk} First Bloods) created numbers advantages for team.`);
    }
    if (postAdr >= 150) {
      strengths.push(`High combat efficiency (${postAdr} ADR) dealt consistent round-winning chip damage.`);
    }
    if (kdRatio >= 1.2) {
      strengths.push(`Positive frag differential (${kdRatio} K/D) provided reliable trade security.`);
    }
    if (postClutches >= 1) {
      strengths.push(`Clutch composure (${postClutches} clutch won) secured high-pressure rounds.`);
    }
    if (strengths.length === 0) {
      strengths.push("Disciplined utility support and team spacing.");
    }

    // Problem evaluation
    if (postFd >= 4) {
      problems.push(`Over-aggressive first contact (${postFd} First Deaths) left teammates in 4v5 deficits.`);
    }
    if (postFk >= 3 && postResult === "DEFEAT") {
      problems.push("Low conversion after opening kills (rounds lost despite securing the first blood).");
    }
    if (postAdr < 110) {
      problems.push(`Low combat contribution (${postAdr} ADR) resulted in insufficient site pressure.`);
    }
    if (kdRatio < 0.85) {
      problems.push(`Negative engagement trades (${kdRatio} K/D) caused fast defensive collapses.`);
    }
    if (problems.length === 0) {
      problems.push("Minor late-round communication gaps on rotations.");
    }

    // Recommendation
    let recommendation = "Maintain crosshair discipline and anchor bomb sites with utility safety.";
    if (postFd >= 4) {
      recommendation = `On ${selectedMap}, avoid dry peeking main chokepoints without flash or recon support. Wait for initiator util.`;
    } else if (postFk >= 3 && postResult === "DEFEAT") {
      recommendation = "After finding the first blood, immediately consolidate crossfires with teammates rather than pushing for multi-kills.";
    } else if (postAdr >= 150) {
      recommendation = `Continue setting the offensive tempo on ${selectedAgent}. Coordinate site executes with smoke timing.`;
    }

    const log: CompletedMatchLog = {
      id: `match-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      map: selectedMap,
      agent: selectedAgent,
      result: postResult,
      myScore: postResult === "VICTORY" ? Math.max(13, myScore) : Math.min(11, myScore),
      enemyScore: postResult === "VICTORY" ? Math.min(11, enemyScore) : Math.max(13, enemyScore),
      adr: postAdr,
      kills: postKills,
      deaths: postDeaths,
      firstKills: postFk,
      firstDeaths: postFd,
      clutches: postClutches,
      strengths,
      problems,
      recommendation
    };

    setPostAnalysis(log);

    // Persist to match history for My VALORANT
    try {
      const historyRaw = localStorage.getItem("vlopedia_match_history");
      const historyList: CompletedMatchLog[] = historyRaw ? JSON.parse(historyRaw) : [];
      historyList.unshift(log);
      if (historyList.length > 30) historyList.pop();
      localStorage.setItem("vlopedia_match_history", JSON.stringify(historyList));
      toast.success("Post-match review generated and saved to your personal match history!");
    } catch (e) {}
  };

  const knowledgeNode = getAgentKnowledgeNode(selectedAgent);
  const mapComp = MAP_COMPS[selectedMap] || MAP_COMPS.Ascent;

  // Economy calculation
  const nextLossBonus = 1900 + lossStreak * 500;
  let ecoCall = "FULL BUY";
  let maxSpend = 0;
  if (credits >= 3900) {
    ecoCall = "FULL BUY (VANDAL/PHANTOM + FULL ARMOR)";
    maxSpend = credits - 3900;
  } else if (credits + nextLossBonus >= 3900) {
    maxSpend = credits + nextLossBonus - 3900;
    ecoCall = `HALF BUY (SPEND MAX $${maxSpend})`;
  } else {
    ecoCall = "FULL ECO / SAVE (BUY NOTHING)";
  }

  const breadcrumbItems = [
    { label: "Tools", href: "/tools" },
    { label: "Match Command Companion" }
  ];

  const copyBriefing = () => {
    const text = `[VLOPEDIA MATCH COMMAND // ${selectedMap.toUpperCase()} - ${selectedSide.toUpperCase()}]
Agent: ${selectedAgent} | Round: ${currentRound} (${myScore}-${enemyScore}) | Credits: $${credits}
Call: ${ecoCall}
Recommended Comp: ${mapComp.comp.join(" / ")} (${mapComp.synergy}% Synergy)`;
    navigator.clipboard.writeText(text);
    toast.success("Match briefing copied to clipboard! Paste it into team chat.");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground py-12">
        <Container className="space-y-10">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(236,232,225,0.08)] pb-8">
            <div className="space-y-2">
              <Breadcrumbs items={breadcrumbItems} />
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-8 bg-primary" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary font-bold">
                  VLOPEDIA MATCH COMMAND // 5-STAGE LOOP
                </span>
              </div>
              <h1 className="font-display font-black text-4xl uppercase tracking-tight text-white sm:text-5xl">
                MATCH COMMAND & POST-REVIEW
              </h1>
              <p className="font-sans text-sm text-secondary max-w-2xl leading-relaxed">
                Full tactical lifecycle: Match Setup $\to$ Opening Prep $\to$ Live Round Tracking $\to$ Economy Directives $\to$ Post-Match Diagnostics.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={saveSession}
                className="font-mono text-xs uppercase px-3 py-2 border border-[rgba(236,232,225,0.15)] bg-[#0D1820] text-secondary hover:text-white flex items-center gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Session</span>
              </button>

              <button
                onClick={copyBriefing}
                className="font-mono text-xs uppercase px-4 py-2 border border-primary/40 bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors flex items-center gap-2 shrink-0"
              >
                <Copy className="h-4 w-4" />
                <span>Copy Match Briefing</span>
              </button>
            </div>
          </div>

          {/* ── STAGE 1: MATCH CONFIGURATION ── */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Map */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal space-y-2">
              <label className="block font-mono text-[10px] uppercase text-primary font-bold">01 // BATTLEGROUND</label>
              <select
                value={selectedMap}
                onChange={(e) => setSelectedMap(e.target.value)}
                className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2.5 font-sans text-xs text-white focus:border-primary focus:outline-none"
              >
                {MAPS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Side */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal space-y-2">
              <label className="block font-mono text-[10px] uppercase text-primary font-bold">02 // SIDE</label>
              <div className="grid grid-cols-2 gap-2">
                {SIDES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSide(s)}
                    className={`py-2 text-xs font-mono uppercase font-bold border transition-all ${
                      selectedSide === s
                        ? s === "Attack" ? "border-primary bg-primary/20 text-primary" : "border-[#0DF2F2] bg-[#0DF2F2]/20 text-[#0DF2F2]"
                        : "border-[rgba(236,232,225,0.1)] text-muted hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Agent */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal space-y-2">
              <label className="block font-mono text-[10px] uppercase text-primary font-bold">03 // YOUR OPERATIVE</label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2.5 font-sans text-xs text-white focus:border-primary focus:outline-none"
              >
                {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Live Credits */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal space-y-2">
              <label className="block font-mono text-[10px] uppercase text-primary font-bold">04 // LIVE CREDITS</label>
              <input
                type="number"
                step="100"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value) || 0)}
                className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2 font-mono text-sm text-white focus:border-primary focus:outline-none font-bold"
              />
            </div>

          </div>

          {/* ── STAGES 2 & 3: LIVE ROUND TRACKER & ASSIST ── */}
          <div className="border border-[#0DF2F2]/40 bg-gradient-to-r from-[#0DF2F2]/10 via-[#0D1A22] to-[#0D1A22] p-6 clip-diagonal space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(236,232,225,0.08)] pb-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-[#0DF2F2]" />
                <div>
                  <span className="font-mono text-[10px] uppercase text-[#0DF2F2] font-bold block">LIVE ROUND ASSIST</span>
                  <h3 className="font-display font-black text-xl uppercase text-white">
                    ROUND {currentRound} · SCORE: {myScore} – {enemyScore}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRoundOutcome(true)}
                  className="font-mono text-xs uppercase px-3 py-1.5 border border-primary/40 bg-primary/20 text-primary font-bold hover:bg-primary/30 transition-colors"
                >
                  ✓ Round Won (+3,000)
                </button>
                <button
                  onClick={() => handleRoundOutcome(false)}
                  className="font-mono text-xs uppercase px-3 py-1.5 border border-error/40 bg-error/20 text-error font-bold hover:bg-error/30 transition-colors"
                >
                  ✗ Round Lost (+{nextLossBonus})
                </button>
                <button
                  onClick={() => { setCurrentRound(1); setMyScore(0); setEnemyScore(0); setCredits(800); setLossStreak(0); }}
                  className="font-mono text-[10px] uppercase px-2 py-1.5 border border-[rgba(236,232,225,0.1)] text-muted hover:text-white"
                  title="Reset Match Session"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 font-mono text-xs">
              <div className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.06)]">
                <span className="text-[10px] text-muted uppercase block">Economy Directive:</span>
                <span className="font-bold text-white block mt-0.5">{ecoCall}</span>
              </div>
              <div className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.06)]">
                <span className="text-[10px] text-muted uppercase block">Guaranteed Next Round:</span>
                <span className="font-bold text-[#0DF2F2] block mt-0.5">${credits + nextLossBonus} Minimum</span>
              </div>
              <div className="p-3 bg-[#08111A] border border-[rgba(236,232,225,0.06)]">
                <span className="text-[10px] text-muted uppercase block">Current Loss Streak:</span>
                <span className="font-bold text-amber-400 block mt-0.5">{lossStreak} Consecutive Losses</span>
              </div>
            </div>
          </div>

          {/* ── STAGE 4: TACTICAL BLUEPRINT ── */}
          <div className="grid gap-8 lg:grid-cols-3">
            
            {/* Left 2 Columns: Round Tactical Blueprint */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="border border-primary/40 bg-[#0D1A22] p-6 sm:p-8 clip-diagonal space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-primary" />
                    <h2 className="font-display font-black text-2xl uppercase text-white">
                      OPENING GAMEPLAN // {selectedAgent.toUpperCase()} ON {selectedMap.toUpperCase()} ({selectedSide.toUpperCase()})
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-primary font-bold">
                    {knowledgeNode.meta.tier}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-mono text-xs uppercase font-bold text-white tracking-wider">
                    Opening Round Strategy
                  </h3>
                  <p className="font-sans text-sm text-secondary leading-relaxed bg-[#08111A] p-4 border border-[rgba(236,232,225,0.04)]">
                    {selectedSide === "Attack"
                      ? `Establish default presence on ${selectedMap}. Use utility to pressure ${selectedMap === "Ascent" ? "Mid Top & A Main" : "Primary Chokepoints"} before committing executes.`
                      : `Anchor ${selectedMap === "Ascent" ? "A Tree or B Lane" : "Primary Site Chokepoints"}. Avoid taking unassisted contact without escape utility primed.`}
                  </p>
                </div>

                <div className="border border-error/20 bg-error/5 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-error font-mono text-xs uppercase font-bold">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Opposing Counterplay Alert</span>
                  </div>
                  <p className="font-sans text-xs text-secondary leading-relaxed">
                    {knowledgeNode.tactical.counters[0]?.counterReason || "Beware of opposing crowd control and suppression utility disabling your escape paths."}
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: 5-Agent Map Meta Composition */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-6">
              <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#0DF2F2]" />
                  <h3 className="font-display font-black text-lg uppercase text-white">Ideal {selectedMap} Comp</h3>
                </div>
                <span className="font-mono text-xs font-bold text-[#0DF2F2]">{mapComp.synergy}/100</span>
              </div>

              <div className="space-y-2">
                {mapComp.comp.map((agentName) => (
                  <div key={agentName} className="flex items-center justify-between p-2.5 border border-[rgba(236,232,225,0.04)] bg-[#08111A]">
                    <span className="font-sans text-xs font-bold text-white">{agentName}</span>
                    <Link
                      href={`/agents/${agentName.toLowerCase()}`}
                      className="font-mono text-[10px] text-muted hover:text-primary transition-colors"
                    >
                      Dossier →
                    </Link>
                  </div>
                ))}
              </div>

              <p className="font-sans text-xs text-secondary leading-relaxed border-t border-[rgba(236,232,225,0.06)] pt-3">
                {mapComp.desc}
              </p>
            </div>

          </div>

          {/* ── STAGE 5: POST-MATCH TACTICAL REVIEW & DIAGNOSTICS ── */}
          <div className="border border-primary/40 bg-[#0D1A22] p-6 sm:p-8 clip-diagonal space-y-6 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(236,232,225,0.08)] pb-4">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-primary" />
                <div>
                  <span className="font-mono text-[10px] uppercase text-primary font-bold block">STAGE 05 // POST-MATCH DEBRIEF</span>
                  <h2 className="font-display font-black text-2xl uppercase text-white">
                    POST-MATCH REVIEW & PERFORMANCE DIAGNOSTICS
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={generatePostMatchReview}
                className="font-mono text-xs uppercase px-4 py-2 border border-primary bg-primary text-black font-black hover:bg-primary-hover transition-colors flex items-center gap-2"
              >
                <BarChart2 className="h-4 w-4" />
                <span>Run Tactical Debrief</span>
              </button>
            </div>

            {/* Input Form */}
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6 font-mono text-xs">
              <div>
                <label className="block text-[10px] uppercase text-muted mb-1">Result</label>
                <select
                  value={postResult}
                  onChange={(e) => setPostResult(e.target.value as "VICTORY" | "DEFEAT")}
                  className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2 text-white font-bold"
                >
                  <option value="VICTORY">VICTORY</option>
                  <option value="DEFEAT">DEFEAT</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-muted mb-1">ADR (Damage/Rnd)</label>
                <input
                  type="number"
                  value={postAdr}
                  onChange={(e) => setPostAdr(Number(e.target.value) || 0)}
                  className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-muted mb-1">Kills / Deaths</label>
                <div className="grid grid-cols-2 gap-1">
                  <input
                    type="number"
                    value={postKills}
                    onChange={(e) => setPostKills(Number(e.target.value) || 0)}
                    placeholder="K"
                    className="bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-2 py-2 text-white font-bold text-center"
                  />
                  <input
                    type="number"
                    value={postDeaths}
                    onChange={(e) => setPostDeaths(Number(e.target.value) || 0)}
                    placeholder="D"
                    className="bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-2 py-2 text-white font-bold text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-muted mb-1">First Kills (FK)</label>
                <input
                  type="number"
                  value={postFk}
                  onChange={(e) => setPostFk(Number(e.target.value) || 0)}
                  className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-muted mb-1">First Deaths (FD)</label>
                <input
                  type="number"
                  value={postFd}
                  onChange={(e) => setPostFd(Number(e.target.value) || 0)}
                  className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-muted mb-1">Clutches Won</label>
                <input
                  type="number"
                  value={postClutches}
                  onChange={(e) => setPostClutches(Number(e.target.value) || 0)}
                  className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2 text-white font-bold"
                />
              </div>
            </div>

            {/* Generated Diagnostic Results */}
            {postAnalysis && (
              <div className="pt-4 border-t border-[rgba(236,232,225,0.08)] space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  
                  {/* Strengths */}
                  <div className="p-4 bg-[#08111A] border border-emerald-500/30 clip-diagonal space-y-2">
                    <span className="font-mono text-[10px] uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Identified Strengths</span>
                    </span>
                    <ul className="space-y-1 font-sans text-xs text-secondary">
                      {postAnalysis.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Leaks / Problems */}
                  <div className="p-4 bg-[#08111A] border border-error/30 clip-diagonal space-y-2">
                    <span className="font-mono text-[10px] uppercase text-error font-bold flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Tactical Leaks & Problems</span>
                    </span>
                    <ul className="space-y-1 font-sans text-xs text-secondary">
                      {postAnalysis.problems.map((p, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-error font-bold">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="p-4 bg-[#08111A] border border-[#0DF2F2]/30 clip-diagonal space-y-2">
                    <span className="font-mono text-[10px] uppercase text-[#0DF2F2] font-bold flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>Next Match Focus</span>
                    </span>
                    <p className="font-sans text-xs text-white leading-relaxed">
                      {postAnalysis.recommendation}
                    </p>
                  </div>

                </div>

                <div className="flex items-center justify-between font-mono text-xs text-muted pt-2">
                  <span>Logged to personal improvement history ({postAnalysis.kills}K / {postAnalysis.deaths}D · {postAnalysis.adr} ADR)</span>
                  <Link href="/profile" className="text-primary hover:underline">
                    View Trend in My VALORANT →
                  </Link>
                </div>
              </div>
            )}

          </div>

        </Container>
      </div>
    </PageTransition>
  );
}
