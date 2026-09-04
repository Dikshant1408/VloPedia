"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Sparkles, ArrowRight, CheckCircle, Shield, Zap, Target, RefreshCw, HelpCircle, Layers } from "lucide-react";

interface AgentRecommendation {
  name: string;
  role: string;
  matchScore: number;
  mapFitScore: number;
  playstyleScore: number;
  teamSynergyScore: number;
  slug: string;
  why: string;
  reasons: string[];
  bestWeapon: string;
  signatureAbility: string;
}

const AGENT_DATABASE: Record<string, { role: string; slug: string; playstyle: string[]; weapon: string; ability: string }> = {
  Jett: { role: "Duelist", slug: "jett", playstyle: ["aggressive", "aim", "solo"], weapon: "Operator / Vandal", ability: "Tailwind (Dash)" },
  Reyna: { role: "Duelist", slug: "reyna", playstyle: ["aggressive", "aim", "solo"], weapon: "Vandal", ability: "Dismiss (Invulnerability)" },
  Raze: { role: "Duelist", slug: "raze", playstyle: ["aggressive", "utility", "team"], weapon: "Phantom / Vandal", ability: "Blast Pack (Satchel)" },
  Omen: { role: "Controller", slug: "omen", playstyle: ["tactical", "utility", "solo", "team"], weapon: "Phantom", ability: "Dark Cover (Hollow Smokes)" },
  Clove: { role: "Controller", slug: "clove", playstyle: ["aggressive", "aim", "solo"], weapon: "Vandal / Phantom", ability: "Not Dead Yet (Self-Revive)" },
  Viper: { role: "Controller", slug: "viper", playstyle: ["tactical", "utility", "team"], weapon: "Phantom", ability: "Toxic Screen (Wall)" },
  Sova: { role: "Initiator", slug: "sova", playstyle: ["tactical", "utility", "team"], weapon: "Vandal / Odin", ability: "Recon Bolt (Intel)" },
  Fade: { role: "Initiator", slug: "fade", playstyle: ["aggressive", "utility", "solo", "team"], weapon: "Vandal", ability: "Haunt (Vision Reveal)" },
  Gekko: { role: "Initiator", slug: "gekko", playstyle: ["tactical", "utility", "solo", "team"], weapon: "Vandal", ability: "Wingman (Auto Plant/Defuse)" },
  Cypher: { role: "Sentinel", slug: "cypher", playstyle: ["tactical", "utility", "solo"], weapon: "Phantom / Vandal", ability: "Trapwire (Site Anchor)" },
  Killjoy: { role: "Sentinel", slug: "killjoy", playstyle: ["tactical", "utility", "team"], weapon: "Phantom", ability: "Lockdown (Area Denial)" },
  Sage: { role: "Sentinel", slug: "sage", playstyle: ["tactical", "utility", "team"], weapon: "Vandal", ability: "Barrier Orb (Wall)" },
};

export default function WhatShouldIPlayPage() {
  const [playstyle, setPlaystyle] = useState<"aggressive" | "tactical">("aggressive");
  const [focus, setFocus] = useState<"aim" | "utility">("aim");
  const [queueType, setQueueType] = useState<"solo" | "team">("solo");
  const [selectedMap, setSelectedMap] = useState("Ascent");

  const breadcrumbItems = [
    { label: "Tools", href: "/tools" },
    { label: "What Should I Play?" }
  ];

  // Calculate recommendations with explainable breakdown
  const recommendations: AgentRecommendation[] = Object.entries(AGENT_DATABASE).map(([name, data]) => {
    let playstyleSubScore = 70;
    if (data.playstyle.includes(playstyle)) playstyleSubScore += 18;
    if (data.playstyle.includes(focus)) playstyleSubScore += 10;
    playstyleSubScore = Math.min(playstyleSubScore, 98);

    let teamSynergySubScore = 72;
    if (data.playstyle.includes(queueType)) teamSynergySubScore += 16;
    if (data.role === "Controller" || data.role === "Initiator") teamSynergySubScore += 8;
    teamSynergySubScore = Math.min(teamSynergySubScore, 96);

    let mapFitSubScore = 75;
    if (selectedMap === "Ascent" && ["Sova", "Omen", "Killjoy", "Jett"].includes(name)) mapFitSubScore = 95;
    else if (selectedMap === "Bind" && ["Raze", "Viper", "Brimstone", "Fade"].includes(name)) mapFitSubScore = 94;
    else if (selectedMap === "Sunset" && ["Cypher", "Clove", "Gekko", "Raze"].includes(name)) mapFitSubScore = 96;
    else if (selectedMap === "Haven" && ["Sova", "Breach", "Jett", "Omen"].includes(name)) mapFitSubScore = 93;
    else mapFitSubScore = 84;

    // Weighted Overall Score: (MapFit * 0.35) + (Playstyle * 0.35) + (TeamSynergy * 0.30)
    const overallScore = Math.round((mapFitSubScore * 0.35) + (playstyleSubScore * 0.35) + (teamSynergySubScore * 0.30));

    const reasons: string[] = [
      playstyle === "aggressive" ? "You prefer proactive duels and early space creation." : "You prefer disciplined site anchoring and utility stall.",
      `${selectedMap} heavily rewards ${data.role.toLowerCase()} utility on standard default rounds.`,
      queueType === "solo" ? "Kit provides self-sufficient playmaking without relying on teammates." : "Kit enables coordinated multi-agent executes."
    ];

    const whyDesc = playstyle === "aggressive"
      ? `${name} matches your aggressive tempo with immediate space-creation utility and high dueling confidence.`
      : `${name} provides structured round control, setting up teammates and anchoring bomb sites with disciplined utility.`;

    return {
      name,
      role: data.role,
      matchScore: overallScore,
      mapFitScore: mapFitSubScore,
      playstyleScore: playstyleSubScore,
      teamSynergyScore: teamSynergySubScore,
      slug: data.slug,
      why: whyDesc,
      reasons,
      bestWeapon: data.weapon,
      signatureAbility: data.ability,
    };
  }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground py-12">
        <Container className="space-y-10">
          
          <div className="space-y-3 border-b border-[rgba(236,232,225,0.08)] pb-6">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-8 bg-primary" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary font-bold">
                TACTICAL OPERATIVE RECOMMENDER
              </span>
            </div>
            <h1 className="font-display font-black text-4xl uppercase tracking-tight text-white sm:text-5xl">
              WHAT AGENT SHOULD I PLAY?
            </h1>
            <p className="font-sans text-sm text-secondary max-w-2xl">
              Answer 4 tactical preferences to receive an algorithmically matched VALORANT agent recommendation complete with transparent scoring breakdown and map-specific strategy.
            </p>
          </div>

          {/* Interactive Questionnaire */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Question 1: Combat Temperament */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal space-y-3">
              <span className="font-mono text-[10px] uppercase text-primary font-bold block">01 // COMBAT TEMPO</span>
              <h3 className="font-display font-black text-base uppercase text-white">Your Preferred Pace</h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setPlaystyle("aggressive")}
                  className={`w-full text-left p-3 font-sans text-xs border transition-all ${
                    playstyle === "aggressive" 
                      ? "border-primary bg-primary/10 text-white font-bold" 
                      : "border-[rgba(236,232,225,0.08)] text-muted hover:text-white"
                  }`}
                >
                  ⚡ Aggressive / Fast Entry
                </button>
                <button
                  type="button"
                  onClick={() => setPlaystyle("tactical")}
                  className={`w-full text-left p-3 font-sans text-xs border transition-all ${
                    playstyle === "tactical" 
                      ? "border-primary bg-primary/10 text-white font-bold" 
                      : "border-[rgba(236,232,225,0.08)] text-muted hover:text-white"
                  }`}
                >
                  🛡️ Methodical / Site Anchor
                </button>
              </div>
            </div>

            {/* Question 2: Mechanical Focus */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal space-y-3">
              <span className="font-mono text-[10px] uppercase text-primary font-bold block">02 // CORE STRENGTH</span>
              <h3 className="font-display font-black text-base uppercase text-white">Focus Area</h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setFocus("aim")}
                  className={`w-full text-left p-3 font-sans text-xs border transition-all ${
                    focus === "aim" 
                      ? "border-primary bg-primary/10 text-white font-bold" 
                      : "border-[rgba(236,232,225,0.08)] text-muted hover:text-white"
                  }`}
                >
                  🎯 Raw Aim & First Contact
                </button>
                <button
                  type="button"
                  onClick={() => setFocus("utility")}
                  className={`w-full text-left p-3 font-sans text-xs border transition-all ${
                    focus === "utility" 
                      ? "border-primary bg-primary/10 text-white font-bold" 
                      : "border-[rgba(236,232,225,0.08)] text-muted hover:text-white"
                  }`}
                >
                  🧩 Lineups & Team Utility
                </button>
              </div>
            </div>

            {/* Question 3: Queue Style */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal space-y-3">
              <span className="font-mono text-[10px] uppercase text-primary font-bold block">03 // TEAM DYNAMICS</span>
              <h3 className="font-display font-black text-base uppercase text-white">Queue Environment</h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setQueueType("solo")}
                  className={`w-full text-left p-3 font-sans text-xs border transition-all ${
                    queueType === "solo" 
                      ? "border-primary bg-primary/10 text-white font-bold" 
                      : "border-[rgba(236,232,225,0.08)] text-muted hover:text-white"
                  }`}
                >
                  👤 Solo Queue (Self-Reliant)
                </button>
                <button
                  type="button"
                  onClick={() => setQueueType("team")}
                  className={`w-full text-left p-3 font-sans text-xs border transition-all ${
                    queueType === "team" 
                      ? "border-primary bg-primary/10 text-white font-bold" 
                      : "border-[rgba(236,232,225,0.08)] text-muted hover:text-white"
                  }`}
                >
                  👥 5-Stack / Coordinated Team
                </button>
              </div>
            </div>

            {/* Question 4: Target Map */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal space-y-3">
              <span className="font-mono text-[10px] uppercase text-primary font-bold block">04 // BATTLEGROUND</span>
              <h3 className="font-display font-black text-base uppercase text-white">Active Map</h3>
              <select
                value={selectedMap}
                onChange={(e) => setSelectedMap(e.target.value)}
                className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-3 font-sans text-xs text-white focus:border-primary focus:outline-none"
              >
                {["Ascent", "Bind", "Haven", "Sunset", "Lotus", "Split", "Icebox", "Breeze", "Abyss", "Fracture"].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

          </div>

          {/* ── Top Recommendations ── */}
          <div className="space-y-6 pt-6 border-t border-[rgba(236,232,225,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-black text-2xl uppercase text-white">
                  YOUR TOP 3 MATCHES FOR {selectedMap.toUpperCase()}
                </h2>
                <span className="font-mono text-xs text-muted">
                  Mathematical Model: (MapFit × 0.35) + (Playstyle × 0.35) + (TeamFit × 0.30)
                </span>
              </div>
              <Link
                href="/methodology"
                className="font-mono text-xs text-[#0DF2F2] hover:underline flex items-center gap-1"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>How this ranking was calculated</span>
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {recommendations.map((rec, i) => (
                <div
                  key={rec.name}
                  className={`border p-6 clip-diagonal space-y-4 shadow-xl relative ${
                    i === 0 
                      ? "border-primary bg-[#0D1A22] ring-1 ring-primary/40" 
                      : "border-[rgba(236,232,225,0.08)] bg-[#08111A]"
                  }`}
                >
                  {i === 0 && (
                    <div className="absolute -top-3 right-4 bg-primary text-black font-mono text-[9px] uppercase font-black px-2 py-0.5">
                      #1 RECOMMENDED MATCH
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] uppercase text-muted block">{rec.role}</span>
                      <h3 className="font-display font-black text-2xl uppercase text-white">{rec.name}</h3>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-2xl font-black text-primary">{rec.matchScore}%</span>
                      <span className="font-mono text-[9px] uppercase text-muted block">Match Score</span>
                    </div>
                  </div>

                  {/* Explainable Sub-Score Matrix */}
                  <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-center bg-[#08111A] p-2.5 border border-[rgba(236,232,225,0.04)]">
                    <div>
                      <span className="text-muted block uppercase">Map Fit</span>
                      <strong className="text-white text-xs">{rec.mapFitScore}%</strong>
                    </div>
                    <div>
                      <span className="text-muted block uppercase">Playstyle</span>
                      <strong className="text-[#0DF2F2] text-xs">{rec.playstyleScore}%</strong>
                    </div>
                    <div>
                      <span className="text-muted block uppercase">Team Fit</span>
                      <strong className="text-emerald-400 text-xs">{rec.teamSynergyScore}%</strong>
                    </div>
                  </div>

                  {/* Why this recommendation */}
                  <div className="space-y-1.5 font-sans text-xs text-secondary leading-snug">
                    <span className="font-mono text-[9px] uppercase text-primary font-bold block">Why {rec.name}:</span>
                    <ul className="space-y-1">
                      {rec.reasons.map((r, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-muted">
                          <span className="text-[#0DF2F2] font-bold">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-[rgba(236,232,225,0.06)] pt-3 space-y-2 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted">Signature Utility:</span>
                      <span className="text-white font-bold">{rec.signatureAbility}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Recommended Buy:</span>
                      <span className="text-[#0DF2F2] font-bold">{rec.bestWeapon}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      href={`/agents/${rec.slug}`}
                      className="w-full text-center font-mono text-xs uppercase py-2 border border-primary/40 bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors"
                    >
                      View {rec.name} Dossier →
                    </Link>
                    <Link
                      href={`/comp-builder?agents=${rec.slug}&map=${selectedMap.toLowerCase()}`}
                      className="w-full text-center font-mono text-[10px] uppercase py-1.5 text-muted hover:text-white transition-colors"
                    >
                      Build {selectedMap} Comp with {rec.name}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </Container>
      </div>
    </PageTransition>
  );
}
