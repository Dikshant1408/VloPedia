"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Sparkles, ArrowRight, CheckCircle, Shield, Zap, Target, RefreshCw } from "lucide-react";

interface AgentRecommendation {
  name: string;
  role: string;
  matchScore: number;
  slug: string;
  why: string;
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

  // Calculate recommendations
  const recommendations: AgentRecommendation[] = Object.entries(AGENT_DATABASE).map(([name, data]) => {
    let score = 70;
    if (data.playstyle.includes(playstyle)) score += 12;
    if (data.playstyle.includes(focus)) score += 10;
    if (data.playstyle.includes(queueType)) score += 8;

    // Map modifiers
    if (selectedMap === "Ascent" && (name === "Sova" || name === "Omen" || name === "Killjoy" || name === "Jett")) score += 5;
    if (selectedMap === "Bind" && (name === "Raze" || name === "Brimstone" || name === "Viper")) score += 5;
    if (selectedMap === "Sunset" && (name === "Cypher" || name === "Clove" || name === "Gekko")) score += 5;

    score = Math.min(score, 98);

    const whyDesc = playstyle === "aggressive"
      ? `${name} matches your aggressive tempo with immediate space-creation utility and high dueling confidence.`
      : `${name} provides structured round control, setting up teammates and anchoring bomb sites with disciplined utility.`;

    return {
      name,
      role: data.role,
      matchScore: score,
      slug: data.slug,
      why: whyDesc,
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
              Answer 4 tactical preferences to receive an algorithmically matched VALORANT agent recommendation complete with weapon synergy and map-specific strategy.
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
            <div className="flex items-center justify-between">
              <h2 className="font-display font-black text-2xl uppercase text-white">
                YOUR TOP 3 MATCHES FOR {selectedMap.toUpperCase()}
              </h2>
              <span className="font-mono text-xs text-muted">
                Weighted by Role Synergy & Map Win-Rates
              </span>
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
                      <span className="font-mono text-xl font-black text-primary">{rec.matchScore}%</span>
                      <span className="font-mono text-[9px] uppercase text-muted block">Fit Score</span>
                    </div>
                  </div>

                  <p className="font-sans text-xs text-secondary leading-relaxed">
                    {rec.why}
                  </p>

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
