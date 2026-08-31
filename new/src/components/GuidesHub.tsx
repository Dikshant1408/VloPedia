/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { playSFX } from "../utils/sfx";
import { BookOpen, MapPin, Eye, Play, Star, Sparkles, Shield, Compass, Swords } from "lucide-react";

export default function GuidesHub() {
  const [activeCategory, setActiveCategory] = useState<"LINEUPS" | "WARMUP" | "POSITIONING">("LINEUPS");

  // 1. Lineups Data
  const lineups = [
    {
      map: "ASCENT",
      agent: "SOVA",
      target: "A-SITE DEFAULT RECON",
      steps: [
        "Position Sova flush against the key garden boxes outside A-main entrance.",
        "Aim crosshair tip at the top corner apex of the third decorative window pane.",
        "Set bounce index multiplier count to: 1 BOUNCE.",
        "Release shock charge tension to exactly: 2 BARS POWER.",
        "Recon dart lands directly atop A-site high scaffolding, fully scanning default planting grids."
      ],
      difficulty: "MEDIUM",
      icon: "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b63a9f/displayicon.png"
    },
    {
      map: "BIND",
      agent: "BRIMSTONE",
      target: "B-SITE POST-PLANT MOLLY",
      steps: [
        "Align character flush inside the corner of the teleporter B-short egress structure.",
        "Aim at the third protruding structural steel beam overhead.",
        "Set bounce index multiplier to: 0 BOUNCES.",
        "Release instant fire-key trigger launch.",
        "Incendiary molly lands precisely on the default B container planting point, preventing defuses for 8.5 seconds."
      ],
      difficulty: "EASY",
      icon: "https://media.valorant-api.com/agents/9f0d7850-443a-995a-9279-78b2461d1b63/displayicon.png"
    }
  ];

  // 2. Warmups Data
  const warmups = [
    {
      title: "BALLISTIC AIM DRILL",
      duration: "10 MINUTES",
      desc: "Focus on micro-adjustments and visual flick muscle memory inside the range.",
      steps: [
        "Set target bots to: EASY/MEDIUM SPEED with armor activated.",
        "Equip Sheriff or Guardian and stand on the central trigger grid platform.",
        "Flick precisely to bot heads, focusing entirely on visual micro-adjustments rather than speed.",
        "Progress to 100 consecutive successful eliminations, keeping target error below 5%."
      ],
      color: "#0DF2F2"
    },
    {
      title: "PRE-FIRE STRACE DRILLS",
      duration: "15 MINUTES",
      desc: "Warm up crosshair placement and movement counter-strafing variables.",
      steps: [
        "Boot up standard Deathmatch queue.",
        "Practice counter-strafing: alternate key toggles (A and D) to halt character velocity instantly before fire-clicks.",
        "Keep crosshair aligned at exactly player headshot height across corners."
      ],
      color: "#FA4454"
    }
  ];

  // 3. Positioning Rules Data
  const positions = [
    {
      rule: "ANGLING OFF-ANGLES",
      desc: "Gain positional advantages by holding lines that opponents do not expect.",
      detail: "Avoid holding generic, highly pre-fired corners on defensive sites. Leverage agent mobility (e.g. Jett Updraft, Chamber Teleport) to stand atop elevated structural assets. This forces attackers to adjust vertical aim scales, securing immediate combat-efficiency wins."
    },
    {
      rule: "PEEKER'S ADVANTAGE",
      desc: "Utilize movement velocity to offset server latency delays.",
      detail: "When clearing corners, press A or D to peek at maximum horizontal velocity (slice peeking). Do not press W. This maximizes the Peeker's Advantage, ensuring you see defensive anchors a split-second before their server register processes your model location."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="eyebrow mb-3">
            <span className="w-2 h-2 bg-[#FA4454]" />
            Operational Tutorials
          </div>
          <h2 className="font-display font-black text-4xl text-[#ECE8E1] tracking-tight uppercase">
            Tactical Training Repositories
          </h2>
          <p className="text-white/50 text-base max-w-xl mt-3">
            Deepen operational mechanics. Master ability setup coordinates, aim calibration drills, and peeking positioning rules.
          </p>
        </div>

        {/* Category Switch buttons */}
          <div className="flex gap-2 font-mono text-xs border border-[rgba(236,232,225,0.08)] p-1 bg-[#0B141A]">
          {["LINEUPS", "WARMUP", "POSITIONING"].map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat as any); playSFX.tick(); }}
              className={`px-4 py-2 font-bold uppercase transition-all duration-300 clip-diagonal-sm ${
                activeCategory === cat ? "bg-[#FA4454] text-white" : "text-white/40 hover:text-white"
              }`}
            >
              {cat} Guides
            </button>
          ))}
        </div>
      </div>

      {/* Guide Content Render */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* 1. LINEUPS GUIDES */}
          {activeCategory === "LINEUPS" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lineups.map((lineup, lIdx) => (
                <div 
                  key={lIdx} 
                className="bg-[#0B141A]/90 surface-glass border border-[rgba(236,232,225,0.08)] p-6 clip-diagonal-sm flex flex-col justify-between group relative"
              >
                <span className="absolute top-0 left-0 w-1 h-full bg-[#FA4454] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div>
                    <div className="flex justify-between items-center mb-5 border-b border-[rgba(236,232,225,0.08)] pb-4">
                      <div className="flex items-center gap-3">
                        {lineup.icon && (
                          <img src={lineup.icon} alt={lineup.agent} className="w-8 h-8 rounded-full border border-[rgba(236,232,225,0.08)]" referrerPolicy="no-referrer" />
                        )}
                        <div>
                          <h3 className="font-display font-black text-lg text-white leading-tight">{lineup.agent} // {lineup.map}</h3>
                          <span className="font-mono text-[10px] text-white/40 uppercase block mt-0.5">{lineup.target}</span>
                        </div>
                      </div>
                      <span className="corner-chip">{lineup.difficulty}</span>
                    </div>

                    <ol className="list-decimal pl-4 space-y-3 font-sans text-sm text-white/70">
                      {lineup.steps.map((step, sIdx) => (
                        <li key={sIdx} className="leading-relaxed">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. WARMUP ROUTINES */}
          {activeCategory === "WARMUP" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {warmups.map((warm, wIdx) => (
                <div 
                  key={wIdx} 
                  className="bg-[#0B141A]/90 surface-glass border border-[rgba(236,232,225,0.08)] p-6 clip-diagonal-sm relative group"
                >
                  <span className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: warm.color }} />
                  <div className="flex justify-between items-center mb-5 border-b border-[rgba(236,232,225,0.08)] pb-4">
                    <h3 className="font-display font-black text-xl text-white tracking-wider uppercase">{warm.title}</h3>
                    <span className="corner-chip">{warm.duration}</span>
                  </div>
                  <p className="text-white/50 text-sm mb-6 leading-relaxed font-sans">{warm.desc}</p>
                  
                  <ul className="space-y-3 font-sans text-sm text-white/70 list-disc pl-4">
                    {warm.steps.map((st, sIdx) => (
                      <li key={sIdx} className="leading-relaxed">{st}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* 3. POSITIONING RULES */}
          {activeCategory === "POSITIONING" && (
            <div className="space-y-8">
              {positions.map((pos, pIdx) => (
                 <div key={pIdx} className="bg-[#0B141A]/90 surface-glass border border-[rgba(236,232,225,0.08)] p-6 clip-diagonal-sm relative group">
                   <span className="corner-chip">POSITIONAL RULE 0{pIdx + 1}</span>
                   <h3 className="font-display font-black text-xl text-white tracking-wider mb-2 uppercase">{pos.rule}</h3>
                   <span className="font-mono text-xs text-[#FA4454] uppercase tracking-widest block mb-4 font-bold">{pos.desc}</span>
                   <p className="text-white/70 text-sm sm:text-base leading-relaxed font-sans border-t border-[rgba(236,232,225,0.08)] pt-5">
                     {pos.detail}
                   </p>
                 </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
