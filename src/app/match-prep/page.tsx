"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { 
  Zap, Shield, Target, Users, Share2, ArrowRight, 
  Copy, CheckCircle, Crosshair, AlertTriangle, Sparkles 
} from "lucide-react";
import { toast } from "sonner";
import { getAgentKnowledgeNode } from "@/lib/knowledge-graph";

const MAPS = ["Ascent", "Bind", "Haven", "Sunset", "Lotus", "Split", "Icebox", "Breeze", "Abyss", "Fracture"];
const AGENTS = ["Jett", "Omen", "Sova", "Raze", "Cypher", "Killjoy", "Reyna", "Clove", "Viper", "Fade", "Gekko", "KAY/O", "Breach", "Neon", "Yoru", "Iso", "Vyse", "Sage"];
const SIDES = ["Attack", "Defense"] as const;
const ECONOMY_STATES = [
  { id: "full-buy", label: "Full Buy ($3,900+)", desc: "Vandal/Phantom + Full Armor + Utility" },
  { id: "force-buy", label: "Force Buy ($2,000 - $3,500)", desc: "Spectre/Bulldog/Sheriff + Half Armor" },
  { id: "eco-save", label: "Eco Save (<$2,000)", desc: "Classic/Ghost + Save for next round" },
  { id: "bonus-round", label: "Round 2/3 Bonus", desc: "Carry over Round 1 winning SMG/Sheriff" },
];

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

export default function MatchPrepPage() {
  const [selectedMap, setSelectedMap] = useState("Ascent");
  const [selectedSide, setSelectedSide] = useState<"Attack" | "Defense">("Attack");
  const [selectedAgent, setSelectedAgent] = useState("Jett");
  const [selectedEco, setSelectedEco] = useState("full-buy");

  const knowledgeNode = getAgentKnowledgeNode(selectedAgent);
  const mapComp = MAP_COMPS[selectedMap] || MAP_COMPS.Ascent;

  const breadcrumbItems = [
    { label: "Tools", href: "/tools" },
    { label: "Match Prep Companion" }
  ];

  // Dynamic game plan generator
  const isAttack = selectedSide === "Attack";
  const gamePlan = {
    openingMove: isAttack
      ? `Establish immediate default presence on ${selectedMap}. Use utility to pressure ${selectedMap === "Ascent" ? "Mid Top & A Main" : selectedMap === "Bind" ? "A Short & B Long" : "Main Chokepoints"} before committing executes.`
      : `Anchor ${selectedMap === "Ascent" ? "A Tree or B Lane" : "Primary Site Chokepoints"}. Avoid taking unassisted contact without escape utility primed.`,
    utilityTrigger: isAttack
      ? `Coordinate your primary ability with your team's initiator when crosshairs clear the first 50/50 corner.`
      : `Deploy stall utility only when sound cues confirm an enemy execute commitment; do not waste utility on dry probes.`,
    primaryDanger: knowledgeNode.tactical.counters[0] 
      ? `Beware of opposing ${knowledgeNode.tactical.counters[0].agentName}: ${knowledgeNode.tactical.counters[0].counterReason}`
      : "Beware of opposing crowd control and suppression utility disabling your escapes.",
    weaponRecommendation: selectedEco === "full-buy"
      ? (knowledgeNode.tactical.signatureWeapons[0]?.name || "Vandal / Phantom") + " + Full Heavy Armor"
      : selectedEco === "force-buy"
      ? "Bulldog / Spectre / Sheriff + Light Armor"
      : selectedEco === "eco-save"
      ? "Classic / Ghost + Full Utility (Save for next round)"
      : "Carry forward previous round gun + buy Full Armor",
  };

  const copyBriefing = () => {
    const text = `[VLOPEDIA MATCH PREP // ${selectedMap.toUpperCase()} - ${selectedSide.toUpperCase()}]
Agent: ${selectedAgent} | Econ: ${selectedEco.toUpperCase()}
Opening Plan: ${gamePlan.openingMove}
Buy: ${gamePlan.weaponRecommendation}
Hazards: ${gamePlan.primaryDanger}
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
                  PRE-ROUND TACTICAL ASSISTANT
                </span>
              </div>
              <h1 className="font-display font-black text-4xl uppercase tracking-tight text-white sm:text-5xl">
                MATCH PREP COMPANION
              </h1>
              <p className="font-sans text-sm text-secondary max-w-2xl">
                Configure your active map, side, agent, and credit economy to generate an instant, pro-vetted round gameplan, buy strategy, and team synergy blueprint.
              </p>
            </div>

            <button
              onClick={copyBriefing}
              className="font-mono text-xs uppercase px-4 py-2.5 border border-primary/40 bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors flex items-center gap-2 shrink-0"
            >
              <Copy className="h-4 w-4" />
              <span>Copy Team Briefing</span>
            </button>
          </div>

          {/* Configuration Selector Matrix */}
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
              <label className="block font-mono text-[10px] uppercase text-primary font-bold">03 // YOUR AGENT</label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2.5 font-sans text-xs text-white focus:border-primary focus:outline-none"
              >
                {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Economy State */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal space-y-2">
              <label className="block font-mono text-[10px] uppercase text-primary font-bold">04 // ECONOMY STATUS</label>
              <select
                value={selectedEco}
                onChange={(e) => setSelectedEco(e.target.value)}
                className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2.5 font-sans text-xs text-white focus:border-primary focus:outline-none"
              >
                {ECONOMY_STATES.map(eco => <option key={eco.id} value={eco.id}>{eco.label}</option>)}
              </select>
            </div>

          </div>

          {/* ── Generated Tactical Directive ── */}
          <div className="grid gap-8 lg:grid-cols-3">
            
            {/* Left 2 Columns: Round Tactical Blueprint */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="border border-primary/40 bg-[#0D1A22] p-6 sm:p-8 clip-diagonal space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-primary" />
                    <h2 className="font-display font-black text-2xl uppercase text-white">
                      ROUND DIRECTIVE // {selectedAgent.toUpperCase()} ON {selectedMap.toUpperCase()} ({selectedSide.toUpperCase()})
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-primary font-bold">
                    {knowledgeNode.meta.tier}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="border border-[rgba(236,232,225,0.06)] bg-[#08111A] p-4 space-y-1.5">
                    <span className="font-mono text-[9px] uppercase text-muted block">Recommended Gun & Armor</span>
                    <span className="font-sans text-sm font-bold text-primary block">{gamePlan.weaponRecommendation}</span>
                  </div>

                  <div className="border border-[rgba(236,232,225,0.06)] bg-[#08111A] p-4 space-y-1.5">
                    <span className="font-mono text-[9px] uppercase text-muted block">Utility Priority</span>
                    <span className="font-sans text-sm font-bold text-white block">{gamePlan.utilityTrigger}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-mono text-xs uppercase font-bold text-white tracking-wider">
                    Opening Round Strategy
                  </h3>
                  <p className="font-sans text-sm text-secondary leading-relaxed bg-[#08111A] p-4 border border-[rgba(236,232,225,0.04)]">
                    {gamePlan.openingMove}
                  </p>
                </div>

                <div className="border border-error/20 bg-error/5 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-error font-mono text-xs uppercase font-bold">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Opposing Counterplay Alert</span>
                  </div>
                  <p className="font-sans text-xs text-secondary leading-relaxed">
                    {gamePlan.primaryDanger}
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

              <Link
                href={`/comp-builder?map=${selectedMap.toLowerCase()}&agents=${mapComp.comp.map(a => a.toLowerCase()).join(",")}`}
                className="w-full block text-center font-mono text-xs uppercase py-2 border border-[#0DF2F2]/40 bg-[#0DF2F2]/10 text-[#0DF2F2] font-bold hover:bg-[#0DF2F2]/20 transition-colors"
              >
                Customize Full 5-Stack Comp →
              </Link>
            </div>

          </div>

        </Container>
      </div>
    </PageTransition>
  );
}
