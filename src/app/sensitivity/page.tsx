"use client";

import React, { useState, useEffect } from "react";
import { Activity, Info } from "lucide-react";
import { Container } from "@/components/container";
import { Reveal, PageTransition } from "@/components/motion-system";

const GAME_MULTIPLIERS: Record<string, number> = {
  "VALORANT":      0.07,
  "CS2":           0.022,
  "Apex Legends":  0.022,
  "Overwatch 2":   0.006,
  "Fortnite":      0.5655,
};

export default function SensitivityPage() {
  const [sourceGame,  setSourceGame]  = useState("CS2");
  const [targetGame,  setTargetGame]  = useState("VALORANT");
  const [sourceSens,  setSourceSens]  = useState("2.0");
  const [dpi,         setDpi]         = useState("800");
  const [valSens,     setValSens]     = useState(0);
  const [edpi,        setEdpi]        = useState(0);

  useEffect(() => {
    const s  = parseFloat(sourceSens) || 0;
    const d  = parseFloat(dpi)        || 0;
    const sy = GAME_MULTIPLIERS[sourceGame] ?? 0.022;
    const ty = GAME_MULTIPLIERS[targetGame] ?? 0.07;
    const converted = sy > 0 && ty > 0 ? parseFloat(((sy / ty) * s).toFixed(4)) : 0;
    setValSens(converted);
    setEdpi(parseFloat((converted * d).toFixed(1)));
  }, [sourceGame, targetGame, sourceSens, dpi]);

  const getSensCategory = () => {
    if (edpi === 0) return { label: "N/A", text: "Enter your DPI and sensitivity above.", color: "text-muted" };
    if (edpi < 200) return { label: "Low Sens — Arm Sweeper", text: "Wide physical sweeps. Great for long-range precision. Use a large mousepad.", color: "text-sky-400" };
    if (edpi <= 400) return { label: "Meta Standard — Medium", text: "Optimal range for most pro players. Balanced for entries and precision.", color: "text-success" };
    return { label: "High Sens — Wrist Flicker", text: "Minimal wrist movement. Fast close-range tracking, susceptible to micro-shakes.", color: "text-primary" };
  };

  const cat = getSensCategory();

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        {/* Tactical grid */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-tactical-grid bg-tactical-dots opacity-20 z-0" />

        <div className="relative z-10">
          {/* Header */}
          <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
            <Container>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
                <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">DPI INTEGRATOR</span>
              </div>
              <h1 className="font-display text-5xl uppercase tracking-tight text-white sm:text-6xl">SENSITIVITY</h1>
              <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-secondary">
                Convert sensitivity between games and calculate your effective DPI.
              </p>
            </Container>
          </div>

          <Container className="py-16">
            <div className="grid gap-8 md:grid-cols-2">

              {/* Input panel */}
              <Reveal className="border border-border bg-[#0D1A22] p-6 space-y-6 cut-corner-br">
                <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary border-b border-border pb-4">
                  Conversion Inputs
                </h2>

                <div className="space-y-2">
                  <label htmlFor="source-game" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">Source Game</label>
                  <select id="source-game" value={sourceGame} onChange={e => setSourceGame(e.target.value)}
                    className="w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] px-3 py-2.5 font-mono text-sm text-foreground focus:border-primary focus:outline-none">
                    {Object.keys(GAME_MULTIPLIERS).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="source-sens" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">Source Sensitivity</label>
                  <input id="source-sens" type="number" value={sourceSens} min="0.01" max="100" step="0.01"
                    onChange={e => setSourceSens(e.target.value)} placeholder="e.g. 2.0"
                    className="w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] px-3 py-2.5 font-mono text-sm text-foreground focus:border-primary focus:outline-none" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="target-game" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">Target Game</label>
                  <select id="target-game" value={targetGame} onChange={e => setTargetGame(e.target.value)}
                    className="w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] px-3 py-2.5 font-mono text-sm text-foreground focus:border-primary focus:outline-none">
                    {Object.keys(GAME_MULTIPLIERS).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="dpi-input" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">Mouse DPI</label>
                  <input id="dpi-input" type="number" value={dpi} min="100" max="32000" step="100"
                    onChange={e => setDpi(e.target.value)} placeholder="e.g. 800"
                    className="w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] px-3 py-2.5 font-mono text-sm text-foreground focus:border-primary focus:outline-none" />
                </div>
              </Reveal>

              {/* Results */}
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <Reveal className="border border-border bg-[#0D1A22] p-6 cut-corner-br">
                    <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-muted mb-2">
                      {targetGame} Sensitivity
                    </span>
                    <span className="font-mono text-4xl font-black text-white">{valSens || "—"}</span>
                  </Reveal>
                  <Reveal className="border border-primary/30 bg-primary-softer p-6 cut-corner-br">
                    <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-muted mb-2">eDPI</span>
                    <span className="font-mono text-4xl font-black text-primary">{edpi || "—"}</span>
                  </Reveal>
                </div>

                <Reveal className="border border-border bg-[#0D1A22] p-6 space-y-3 cut-corner-br">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <Activity className="h-4 w-4 text-primary" aria-hidden="true" />
                    <h2 className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">Sensitivity Profile</h2>
                  </div>
                  <p className={`font-mono text-[10px] font-black uppercase tracking-wider ${cat.color}`}>{cat.label}</p>
                  <p className="font-sans text-xs leading-relaxed text-muted">{cat.text}</p>
                </Reveal>

                <Reveal className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)]/50 p-5">
                  <div className="flex items-start gap-3">
                    <Info className="h-4 w-4 text-muted mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-white mb-1">Formula</p>
                      <p className="font-mono text-[10px] text-muted leading-relaxed">
                        target_sens = (source_yaw / target_yaw) × source_sens<br />
                        eDPI = target_sens × DPI
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </PageTransition>
  );
}
