"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Activity, 
  Share2, 
  Check, 
  Sliders, 
  Info, 
  TrendingUp, 
  Target, 
  HelpCircle 
} from "lucide-react";
import { Container } from "@/components/container";
import { Reveal, PageTransition } from "@/components/motion-system";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GameConversion {
  name: string;
  yaw: number; // degrees per count
  step: number;
  defaultSens: number;
}

const SUPPORTED_GAMES: Record<string, GameConversion> = {
  "CS2": {
    name: "Counter-Strike 2 / CS:GO",
    yaw: 0.022,
    step: 0.01,
    defaultSens: 1.20,
  },
  "Apex": {
    name: "Apex Legends",
    yaw: 0.022,
    step: 0.01,
    defaultSens: 1.20,
  },
  "Overwatch2": {
    name: "Overwatch 2",
    yaw: 0.006,
    step: 0.1,
    defaultSens: 4.00,
  },
  "R6S": {
    name: "Rainbow Six Siege (Default Multiplier)",
    yaw: 0.00572,
    step: 1,
    defaultSens: 50,
  },
  "Fortnite": {
    name: "Fortnite (% Slider)",
    yaw: 0.005555,
    step: 0.1,
    defaultSens: 6.0,
  },
  "COD": {
    name: "Call of Duty / Warzone",
    yaw: 0.0066,
    step: 0.1,
    defaultSens: 4.5,
  },
  "VALORANT": {
    name: "VALORANT (Direct Calculation)",
    yaw: 0.07,
    step: 0.01,
    defaultSens: 0.35,
  },
};

const PRO_BENCHMARKS = [
  { name: "TenZ", team: "Sentinels", edpi: 240, sens: 0.30, dpi: 800, cm360: 54.4 },
  { name: "Aspas", team: "Leviatán", edpi: 320, sens: 0.40, dpi: 800, cm360: 40.8 },
  { name: "Demon1", team: "NRG", edpi: 200, sens: 0.25, dpi: 800, cm360: 65.3 },
  { name: "Boaster", team: "Fnatic", edpi: 200, sens: 0.25, dpi: 800, cm360: 65.3 },
  { name: "Chronicle", team: "Fnatic", edpi: 184, sens: 0.23, dpi: 800, cm360: 71.0 },
  { name: "Derke", team: "Team Vitality", edpi: 272, sens: 0.34, dpi: 800, cm360: 48.0 },
];

export default function SensitivityPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B141A]" />}>
      <SensitivityInner />
    </Suspense>
  );
}

function SensitivityInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialGame = searchParams.get("game") || "CS2";
  const initialSens = searchParams.get("sens") || "1.2";
  const initialDpi  = searchParams.get("dpi")  || "800";

  const [sourceGame, setSourceGame] = useState(
    SUPPORTED_GAMES[initialGame] ? initialGame : "CS2"
  );
  const [sourceSens, setSourceSens] = useState(initialSens);
  const [dpi, setDpi]               = useState(initialDpi);
  const [copied, setCopied]         = useState(false);

  // Sync state to URL without reloading
  useEffect(() => {
    const params = new URLSearchParams();
    if (sourceGame) params.set("game", sourceGame);
    if (sourceSens) params.set("sens", sourceSens);
    if (dpi) params.set("dpi", dpi);
    const newUrl = `/sensitivity?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, [sourceGame, sourceSens, dpi]);

  // Calculations
  const calculated = useMemo(() => {
    const s = parseFloat(sourceSens) || 0;
    const d = parseFloat(dpi) || 800;
    const gameConfig = SUPPORTED_GAMES[sourceGame] || SUPPORTED_GAMES["CS2"];

    // Yaw conversion to Valorant (Valorant yaw = 0.07)
    const valYaw = 0.07;
    const valSensRaw = s > 0 ? (s * gameConfig.yaw) / valYaw : 0;
    const valSens = parseFloat(valSensRaw.toFixed(4));
    const edpi = parseFloat((valSens * d).toFixed(1));

    // cm / 360 = (360 / (valSens * 0.07 * d)) * 2.54
    const cm360Raw = (valSens > 0 && d > 0) ? (360 / (valSens * valYaw * d)) * 2.54 : 0;
    const cm360 = parseFloat(cm360Raw.toFixed(1));

    return {
      valSens,
      edpi,
      cm360,
    };
  }, [sourceGame, sourceSens, dpi]);

  // Tier classification
  const tierInfo = useMemo(() => {
    const { edpi } = calculated;
    if (edpi === 0) return { label: "Awaiting Input", color: "text-muted", badge: "border-border text-muted", desc: "Enter sensitivity and DPI above." };
    if (edpi < 200) return { label: "Low Sens · Arm Aiming", color: "text-sky-400", badge: "border-sky-500/40 bg-sky-500/10 text-sky-400", desc: "Requires broad arm sweeps across large mousepads. Maximum micro-adjustment precision." };
    if (edpi <= 300) return { label: "Meta Standard · Pro Baseline", color: "text-emerald-400", badge: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400", desc: "Optimal balance between snappy crosshair placement, micro-flicks, and 180° turn checks." };
    if (edpi <= 400) return { label: "Medium-High · Hybrid Flicks", color: "text-amber-400", badge: "border-amber-500/40 bg-amber-500/10 text-amber-400", desc: "Faster target acquisition with minimal wrist exhaustion. Favored by entry duelists." };
    return { label: "Ultra High · Wrist Aiming", color: "text-primary", badge: "border-primary/40 bg-primary/10 text-primary", desc: "Extreme speed for rapid 180s. Requires exceptional wrist motor control to prevent jitter." };
  }, [calculated]);

  // Copy share URL
  const copyShareUrl = () => {
    const url = `${window.location.origin}/sensitivity?game=${sourceGame}&sens=${sourceSens}&dpi=${dpi}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Sensitivity link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        {/* Header */}
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
                  <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">
                    TACTICAL DPI ENGINE
                  </span>
                </div>
                <h1 className="font-display text-5xl uppercase tracking-tight text-white sm:text-6xl">
                  SENSITIVITY CALCULATOR
                </h1>
                <p className="mt-2 max-w-2xl font-sans text-sm text-secondary">
                  Convert mouse sensitivity from CS2, Apex, Overwatch & calculate true eDPI, cm/360°, and pro tier benchmarks.
                </p>
              </div>

              {/* Share button */}
              <Button
                variant="primary"
                size="sm"
                onClick={copyShareUrl}
                className="gap-2 font-mono text-xs uppercase"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                {copied ? "Link Copied" : "Share Sens"}
              </Button>
            </div>
          </Container>
        </div>

        <Container className="py-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] mb-14">
            
            {/* Input Config Card */}
            <div className="border border-[rgba(236,232,225,0.1)] bg-[#0D1820] p-6 space-y-6">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary border-b border-[rgba(236,232,225,0.08)] pb-4">
                Source Configuration
              </h2>

              <div className="space-y-4">
                {/* Source Game */}
                <div className="space-y-1.5">
                  <label htmlFor="source-game-select" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                    Source Game
                  </label>
                  <select
                    id="source-game-select"
                    value={sourceGame}
                    onChange={e => setSourceGame(e.target.value)}
                    className="w-full border border-[rgba(236,232,225,0.12)] bg-[#0B141A] px-3.5 py-2.5 font-mono text-sm text-white focus:border-primary focus:outline-none"
                  >
                    {Object.entries(SUPPORTED_GAMES).map(([key, config]) => (
                      <option key={key} value={key} className="bg-[#0B141A] text-white">
                        {config.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Source Sens */}
                <div className="space-y-1.5">
                  <label htmlFor="source-sens-input" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                    Sensitivity in {SUPPORTED_GAMES[sourceGame]?.name.split(" ")[0]}
                  </label>
                  <input
                    id="source-sens-input"
                    type="number"
                    value={sourceSens}
                    step={SUPPORTED_GAMES[sourceGame]?.step || 0.01}
                    min="0.01"
                    max="1000"
                    onChange={e => setSourceSens(e.target.value)}
                    placeholder="e.g. 1.20"
                    className="w-full border border-[rgba(236,232,225,0.12)] bg-[#0B141A] px-3.5 py-2.5 font-mono text-sm text-white focus:border-primary focus:outline-none"
                  />
                </div>

                {/* DPI */}
                <div className="space-y-1.5">
                  <label htmlFor="dpi-setting-input" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                    Mouse DPI (Hardware Resolution)
                  </label>
                  <input
                    id="dpi-setting-input"
                    type="number"
                    value={dpi}
                    step="50"
                    min="100"
                    max="32000"
                    onChange={e => setDpi(e.target.value)}
                    placeholder="e.g. 800"
                    className="w-full border border-[rgba(236,232,225,0.12)] bg-[#0B141A] px-3.5 py-2.5 font-mono text-sm text-white focus:border-primary focus:outline-none"
                  />
                  {/* Preset DPI buttons */}
                  <div className="flex gap-2 pt-1">
                    {["400", "800", "1600", "3200"].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDpi(d)}
                        className={`font-mono text-[10px] px-2 py-1 border transition-colors ${
                          dpi === d 
                            ? "border-primary bg-primary/10 text-primary font-bold" 
                            : "border-[rgba(236,232,225,0.08)] bg-surface text-muted hover:text-white"
                        }`}
                      >
                        {d} DPI
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Converted Output Card */}
            <div className="border border-[rgba(236,232,225,0.1)] bg-[#0D1820] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-4 mb-6">
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[#0DF2F2]">
                    VALORANT Converted Profile
                  </h3>
                  <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${tierInfo.badge}`}>
                    {tierInfo.label.split("·")[0].trim()}
                  </span>
                </div>

                {/* 3 Large Metric Blocks */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="border border-[rgba(236,232,225,0.08)] bg-[#0B141A] p-4 text-center">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-muted block mb-1">
                      VALORANT SENS
                    </span>
                    <span className="font-display font-black text-2xl sm:text-3xl text-primary">
                      {calculated.valSens || "0.00"}
                    </span>
                  </div>

                  <div className="border border-[rgba(236,232,225,0.08)] bg-[#0B141A] p-4 text-center">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-muted block mb-1">
                      EFFECTIVE DPI (eDPI)
                    </span>
                    <span className="font-display font-black text-2xl sm:text-3xl text-[#0DF2F2]">
                      {calculated.edpi || "0"}
                    </span>
                  </div>

                  <div className="border border-[rgba(236,232,225,0.08)] bg-[#0B141A] p-4 text-center">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-muted block mb-1">
                      DISTANCE / 360°
                    </span>
                    <span className="font-display font-black text-2xl sm:text-3xl text-white">
                      {calculated.cm360 ? `${calculated.cm360} cm` : "—"}
                    </span>
                  </div>
                </div>

                {/* Aim Archetype description */}
                <div className="border border-[rgba(236,232,225,0.08)] bg-surface p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="font-mono text-xs font-bold uppercase text-white">
                      {tierInfo.label}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-muted leading-relaxed">
                    {tierInfo.desc}
                  </p>
                </div>
              </div>

              {/* Pro Range Reference */}
              <div className="mt-6 border-t border-[rgba(236,232,225,0.08)] pt-4 font-mono text-[10px] text-muted flex items-center justify-between">
                <span>VCT Pro Meta Average: <strong className="text-white">200–300 eDPI</strong></span>
                <span className={calculated.edpi >= 200 && calculated.edpi <= 300 ? "text-emerald-400 font-bold" : "text-amber-400"}>
                  {calculated.edpi >= 200 && calculated.edpi <= 300 ? "Within Pro Range" : "Outside Meta Range"}
                </span>
              </div>
            </div>
          </div>

          {/* Pro Player Benchmark Table */}
          <div className="border border-[rgba(236,232,225,0.1)] bg-[#0D1820] p-6">
            <div className="flex items-center justify-between mb-4 border-b border-[rgba(236,232,225,0.08)] pb-3">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-white">
                VCT Pro Player Sensitivity Benchmarks
              </h3>
              <span className="font-mono text-[10px] text-muted">
                Calculated on 800 DPI standard
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[rgba(236,232,225,0.08)] text-muted uppercase text-[10px]">
                    <th className="py-2.5 px-3">Player</th>
                    <th className="py-2.5 px-3">Team</th>
                    <th className="py-2.5 px-3">In-Game Sens</th>
                    <th className="py-2.5 px-3">DPI</th>
                    <th className="py-2.5 px-3">eDPI</th>
                    <th className="py-2.5 px-3">cm / 360°</th>
                    <th className="py-2.5 px-3 text-right">Quick Apply</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(236,232,225,0.04)]">
                  {PRO_BENCHMARKS.map(pro => (
                    <tr key={pro.name} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 font-bold text-white uppercase">{pro.name}</td>
                      <td className="py-3 px-3 text-muted">{pro.team}</td>
                      <td className="py-3 px-3 text-primary font-bold">{pro.sens}</td>
                      <td className="py-3 px-3 text-muted">{pro.dpi}</td>
                      <td className="py-3 px-3 text-[#0DF2F2] font-bold">{pro.edpi}</td>
                      <td className="py-3 px-3 text-muted">{pro.cm360} cm</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSourceGame("VALORANT");
                            setSourceSens(pro.sens.toString());
                            setDpi(pro.dpi.toString());
                            toast.info(`Applied ${pro.name}'s sensitivity!`);
                          }}
                          className="font-mono text-[10px] uppercase px-2 py-1 border border-primary/40 bg-primary/10 text-primary hover:bg-primary hover:text-black transition-colors"
                        >
                          Load
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </div>
    </PageTransition>
  );
}
