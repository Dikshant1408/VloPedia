"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Users, 
  ShieldAlert, 
  Flame, 
  Eye, 
  Swords, 
  Shield, 
  Save, 
  X, 
  MapPin, 
  Share2, 
  Check, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { RoleBadge } from "@/components/role-badge";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import type { ValorantAgent } from "@/lib/valorant-types";
import { slugify } from "@/lib/utils";

/* ── Role display config ── */
const ROLE_CONFIG = [
  { key: "Duelist",    icon: Flame,      color: "bg-role-duelist"    },
  { key: "Controller", icon: Eye,        color: "bg-role-controller" },
  { key: "Initiator",  icon: Swords,     color: "bg-role-initiator"  },
  { key: "Sentinel",   icon: Shield,     color: "bg-role-sentinel"   },
];

const MAP_OPTIONS = [
  { id: "ascent",   name: "Ascent",   bestControllers: ["Omen", "Astra"], bestInitiators: ["Sova", "KAY/O"] },
  { id: "bind",     name: "Bind",     bestControllers: ["Brimstone", "Viper"], bestInitiators: ["Skye", "Fade", "Gekko"] },
  { id: "haven",    name: "Haven",    bestControllers: ["Omen", "Astra"], bestInitiators: ["Sova", "Breach"] },
  { id: "sunset",   name: "Sunset",   bestControllers: ["Omen", "Clove"], bestInitiators: ["Fade", "Gekko", "Breach"] },
  { id: "lotus",    name: "Lotus",    bestControllers: ["Omen", "Viper", "Clove"], bestInitiators: ["Fade", "Gekko", "Breach"] },
  { id: "split",    name: "Split",    bestControllers: ["Omen", "Astra", "Viper"], bestInitiators: ["Skye", "Breach"] },
  { id: "breeze",   name: "Breeze",   bestControllers: ["Viper", "Harbor"], bestInitiators: ["Sova", "KAY/O"] },
  { id: "icebox",   name: "Icebox",   bestControllers: ["Viper", "Harbor"], bestInitiators: ["Sova", "Gekko", "KAY/O"] },
  { id: "abyss",    name: "Abyss",    bestControllers: ["Omen", "Astra"], bestInitiators: ["Sova", "Fade"] },
  { id: "pearl",    name: "Pearl",    bestControllers: ["Astra", "Viper"], bestInitiators: ["Fade", "KAY/O"] },
  { id: "fracture", name: "Fracture", bestControllers: ["Brimstone", "Omen"], bestInitiators: ["Breach", "Fade"] },
];

/* ── Tactical Agent Trait Database ── */
const AGENT_TRAITS: Record<string, {
  execution: number;
  siteControl: number;
  info: number;
  postPlant: number;
  defense: number;
  flash: boolean;
  recon: boolean;
  smoke: boolean;
  stall: boolean;
  entry: boolean;
}> = {
  "Jett":      { execution: 98, siteControl: 45, info: 10, postPlant: 35, defense: 60, flash: false, recon: false, smoke: true,  stall: false, entry: true  },
  "Raze":      { execution: 94, siteControl: 75, info: 25, postPlant: 80, defense: 75, flash: false, recon: false, smoke: false, stall: true,  entry: true  },
  "Reyna":     { execution: 82, siteControl: 40, info: 15, postPlant: 30, defense: 45, flash: true,  recon: false, smoke: false, stall: false, entry: true  },
  "Phoenix":   { execution: 80, siteControl: 60, info: 10, postPlant: 65, defense: 55, flash: true,  recon: false, smoke: true,  stall: true,  entry: true  },
  "Yoru":      { execution: 86, siteControl: 50, info: 55, postPlant: 45, defense: 50, flash: true,  recon: true,  smoke: false, stall: false, entry: true  },
  "Neon":      { execution: 96, siteControl: 55, info: 10, postPlant: 30, defense: 50, flash: true,  recon: false, smoke: true,  stall: true,  entry: true  },
  "Iso":       { execution: 84, siteControl: 50, info: 15, postPlant: 40, defense: 60, flash: false, recon: false, smoke: true,  stall: true,  entry: true  },
  
  "Omen":      { execution: 80, siteControl: 94, info: 40, postPlant: 65, defense: 82, flash: true,  recon: false, smoke: true,  stall: false, entry: false },
  "Brimstone": { execution: 88, siteControl: 92, info: 10, postPlant: 98, defense: 78, flash: false, recon: false, smoke: true,  stall: true,  entry: false },
  "Viper":     { execution: 75, siteControl: 98, info: 15, postPlant: 98, defense: 94, flash: false, recon: false, smoke: true,  stall: true,  entry: false },
  "Astra":     { execution: 82, siteControl: 96, info: 60, postPlant: 86, defense: 90, flash: false, recon: false, smoke: true,  stall: true,  entry: false },
  "Harbor":    { execution: 85, siteControl: 88, info: 15, postPlant: 70, defense: 68, flash: false, recon: false, smoke: true,  stall: true,  entry: false },
  "Clove":     { execution: 84, siteControl: 86, info: 20, postPlant: 60, defense: 70, flash: false, recon: false, smoke: true,  stall: true,  entry: true  },
  
  "Sova":      { execution: 75, siteControl: 70, info: 98, postPlant: 92, defense: 80, flash: false, recon: true,  smoke: false, stall: true,  entry: false },
  "Fade":      { execution: 88, siteControl: 75, info: 96, postPlant: 75, defense: 78, flash: false, recon: true,  smoke: false, stall: true,  entry: false },
  "Breach":    { execution: 96, siteControl: 85, info: 30, postPlant: 82, defense: 84, flash: true,  recon: false, smoke: false, stall: true,  entry: false },
  "Skye":      { execution: 85, siteControl: 65, info: 90, postPlant: 60, defense: 72, flash: true,  recon: true,  smoke: false, stall: false, entry: false },
  "Gekko":     { execution: 92, siteControl: 78, info: 88, postPlant: 88, defense: 75, flash: true,  recon: true,  smoke: false, stall: true,  entry: false },
  "KAY/O":     { execution: 90, siteControl: 80, info: 86, postPlant: 80, defense: 76, flash: true,  recon: true,  smoke: false, stall: true,  entry: false },
  
  "Cypher":    { execution: 50, siteControl: 85, info: 96, postPlant: 70, defense: 98, flash: false, recon: true,  smoke: true,  stall: true,  entry: false },
  "Killjoy":   { execution: 65, siteControl: 88, info: 90, postPlant: 96, defense: 98, flash: false, recon: true,  smoke: false, stall: true,  entry: false },
  "Deadlock":  { execution: 55, siteControl: 82, info: 65, postPlant: 78, defense: 94, flash: false, recon: false, smoke: false, stall: true,  entry: false },
  "Chamber":   { execution: 60, siteControl: 45, info: 70, postPlant: 40, defense: 86, flash: false, recon: true,  smoke: false, stall: true,  entry: false },
  "Sage":      { execution: 60, siteControl: 75, info: 20, postPlant: 72, defense: 90, flash: false, recon: false, smoke: false, stall: true,  entry: false },
  "Vyse":      { execution: 70, siteControl: 86, info: 50, postPlant: 82, defense: 96, flash: true,  recon: false, smoke: false, stall: true,  entry: false },
};

export default function CompBuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B141A]" />}>
      <CompBuilderInner />
    </Suspense>
  );
}

function CompBuilderInner() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [liveAgents, setLiveAgents]   = useState<ValorantAgent[]>([]);
  const [selectedMap, setSelectedMap] = useState<string>(searchParams.get("map") || "ascent");
  const [slots, setSlots]             = useState<(ValorantAgent|null)[]>([null,null,null,null,null]);
  const [copied, setCopied]           = useState(false);

  // Fetch agents
  useEffect(() => {
    fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true")
      .then(r => r.json())
      .then(j => {
        const fetched: ValorantAgent[] = j.data ?? [];
        setLiveAgents(fetched);

        // Pre-fill from query params if available
        const agentQuery = searchParams.get("agents");
        if (agentQuery && fetched.length > 0) {
          const names = agentQuery.split(",");
          const initialSlots: (ValorantAgent|null)[] = [null,null,null,null,null];
          names.slice(0, 5).forEach((n, i) => {
            const found = fetched.find(a => slugify(a.displayName) === slugify(n));
            if (found) initialSlots[i] = found;
          });
          setSlots(initialSlots);
        }
      })
      .catch(() => {});
  }, [searchParams]);

  const agents = liveAgents;

  /* ── Slot management ── */
  const assign = (agent: ValorantAgent, slotIdx: number) => {
    const existingSlot = slots.findIndex(s => s?.uuid === agent.uuid);
    if (existingSlot !== -1 && existingSlot !== slotIdx) {
      toast.error(`${agent.displayName} is already in slot ${existingSlot + 1}`);
      return;
    }
    setSlots(prev => {
      const n = [...prev];
      n[slotIdx] = agent;
      return n;
    });
  };

  const remove = (idx: number) => setSlots(prev => { const n = [...prev]; n[idx] = null; return n; });
  const clear  = () => setSlots([null,null,null,null,null]);

  const clickAgent = (agent: ValorantAgent) => {
    const alreadyIn = slots.findIndex(s => s?.uuid === agent.uuid);
    if (alreadyIn !== -1) {
      remove(alreadyIn);
      return;
    }
    const empty = slots.findIndex(s => s === null);
    if (empty === -1) {
      toast.info("All 5 slots are filled. Remove an agent first.");
      return;
    }
    assign(agent, empty);
  };

  /* ── Detailed Tactical Analysis Calculation ── */
  const activeAgents = useMemo(() => slots.filter((a): a is ValorantAgent => Boolean(a)), [slots]);

  const tacticalStats = useMemo(() => {
    if (activeAgents.length === 0) {
      return {
        overall: 0,
        execution: 0,
        siteControl: 0,
        info: 0,
        postPlant: 0,
        defense: 0,
        hasSmokes: false,
        hasFlash: false,
        hasRecon: false,
        hasEntry: false,
        hasSentinel: false,
        feedback: [] as { type: "info" | "warning" | "success"; text: string }[],
      };
    }

    let execSum = 0;
    let siteSum = 0;
    let infoSum = 0;
    let postSum = 0;
    let defSum  = 0;

    let hasFlash = false;
    let hasRecon = false;
    let hasSmoke = false;
    let hasEntry = false;
    let hasSentinel = false;

    const currentMapInfo = MAP_OPTIONS.find(m => m.id === selectedMap);

    activeAgents.forEach(a => {
      const trait = AGENT_TRAITS[a.displayName] || {
        execution: 70, siteControl: 70, info: 50, postPlant: 50, defense: 60,
        flash: false, recon: false, smoke: a.role?.displayName === "Controller",
        stall: a.role?.displayName === "Sentinel", entry: a.role?.displayName === "Duelist"
      };

      execSum += trait.execution;
      siteSum += trait.siteControl;
      infoSum += trait.info;
      postSum += trait.postPlant;
      defSum  += trait.defense;

      if (trait.flash) hasFlash = true;
      if (trait.recon) hasRecon = true;
      if (trait.smoke) hasSmoke = true;
      if (trait.entry) hasEntry = true;
      if (a.role?.displayName === "Sentinel") hasSentinel = true;
    });

    const count = activeAgents.length;
    // Normalize to 100 based on standard 5-man baseline
    let execScore = Math.min(100, Math.round(execSum / 5));
    let siteScore = Math.min(100, Math.round(siteSum / 5));
    let infoScore = Math.min(100, Math.round(infoSum / 5));
    let postScore = Math.min(100, Math.round(postSum / 5));
    let defScore  = Math.min(100, Math.round(defSum / 5));

    // Map synergy bonus
    let mapSynergyBonus = 0;
    if (currentMapInfo) {
      activeAgents.forEach(a => {
        if (currentMapInfo.bestControllers.includes(a.displayName)) mapSynergyBonus += 4;
        if (currentMapInfo.bestInitiators.includes(a.displayName)) mapSynergyBonus += 4;
      });
    }

    // Role synergy penalties & bonuses
    let penalty = 0;
    const feedback: { type: "info" | "warning" | "success"; text: string }[] = [];

    if (!hasSmoke) {
      penalty += 20;
      feedback.push({ type: "warning", text: "No Controller / Vision Blockers — sightlines will remain exposed during site takes." });
    } else {
      feedback.push({ type: "success", text: "Smoke utility active — executes and sightline breaks secured." });
    }

    if (!hasEntry) {
      penalty += 12;
      feedback.push({ type: "warning", text: "No primary Duelist / Entry — team may struggle to break crosshairs and take forward space." });
    }

    if (!hasRecon && !hasFlash) {
      penalty += 15;
      feedback.push({ type: "warning", text: "No Flash or Intel utility — dry-peeking angles increases round fatality." });
    } else if (hasRecon && hasFlash) {
      feedback.push({ type: "success", text: "Complete initiation kit: Info gathering + Flash blind synergy." });
    }

    if (!hasSentinel) {
      penalty += 10;
      feedback.push({ type: "warning", text: "No Sentinel — vulnerable to fast flank rotations and silent splits." });
    } else {
      feedback.push({ type: "success", text: "Flank coverage & defensive anchor utility online." });
    }

    if (count < 5) {
      feedback.push({ type: "info", text: `Roster in progress: ${count}/5 agents selected.` });
    }

    const rawAvg = (execScore + siteScore + infoScore + postScore + defScore) / 5;
    const overall = count === 0 ? 0 : Math.min(100, Math.max(10, Math.round(rawAvg + (count === 5 ? 10 : 0) + mapSynergyBonus - penalty)));

    return {
      overall,
      execution: execScore,
      siteControl: siteScore,
      info: infoScore,
      postPlant: postScore,
      defense: defScore,
      hasSmokes: hasSmoke,
      hasFlash,
      hasRecon,
      hasEntry,
      hasSentinel,
      feedback,
    };
  }, [activeAgents, selectedMap]);

  /* ── Copy shareable link ── */
  const shareComp = () => {
    const agentSlugs = slots.filter(Boolean).map(a => slugify(a!.displayName)).join(",");
    const url = `${window.location.origin}/comp-builder?map=${selectedMap}&agents=${agentSlugs}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Composition link copied to clipboard!");
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
                  <span className="w-2 h-2 bg-primary animate-pulse" aria-hidden="true" />
                  <span className="font-mono text-xs text-primary tracking-[0.25em] uppercase font-bold">
                    TACTICAL LINEUP ENGINE
                  </span>
                </div>
                <h1 className="font-display text-5xl uppercase tracking-tight text-white sm:text-6xl">
                  COMP BUILDER
                </h1>
                <p className="mt-2 max-w-2xl font-sans text-sm text-secondary">
                  Evaluate 5-agent team synergy, site control ratings, entry potential, and map-specific advantages.
                </p>
              </div>

              {/* Map Selector */}
              <div className="flex items-center gap-3 border border-[rgba(236,232,225,0.12)] bg-[#0D1820] p-2.5">
                <MapPin className="h-4 w-4 text-[#0DF2F2]" />
                <label htmlFor="map-select" className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                  MAP:
                </label>
                <select
                  id="map-select"
                  value={selectedMap}
                  onChange={e => setSelectedMap(e.target.value)}
                  className="bg-transparent font-mono text-xs font-bold text-white uppercase focus:outline-none cursor-pointer"
                >
                  {MAP_OPTIONS.map(m => (
                    <option key={m.id} value={m.id} className="bg-[#0D1820] text-white">
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Container>
        </div>

        <Container className="py-12">
          {/* Active 5 Slots */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-white">
                  Active Roster ({activeAgents.length}/5)
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={clear} className="text-xs h-8">
                  Clear
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={shareComp} 
                  disabled={activeAgents.length === 0}
                  className="gap-1.5 text-xs h-8"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                  {copied ? "Link Copied" : "Share Comp"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {slots.map((agent, idx) => (
                <div
                  key={idx}
                  className={`relative min-h-[180px] sm:min-h-[220px] border flex flex-col items-center justify-center p-3 transition-all ${
                    agent 
                      ? "border-primary/40 bg-[#0D1820]" 
                      : "border-dashed border-[rgba(236,232,225,0.12)] bg-[#0B141A]/50"
                  }`}
                >
                  {agent ? (
                    <>
                      <button
                        onClick={() => remove(idx)}
                        className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-primary text-muted hover:text-white transition-colors z-20"
                        title="Remove agent"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <div className="relative h-24 sm:h-32 w-full mb-2">
                        <Image
                          src={agent.bustPortrait || agent.fullPortrait}
                          alt={agent.displayName}
                          fill
                          sizes="180px"
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <span className="font-display font-black text-sm uppercase tracking-wide text-white">
                        {agent.displayName}
                      </span>
                      <span className="font-mono text-[9px] text-muted uppercase mt-0.5">
                        {agent.role?.displayName}
                      </span>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <span className="font-mono text-[10px] text-muted uppercase block">
                        Slot {idx + 1}
                      </span>
                      <span className="font-sans text-xs text-muted/60 mt-1 block">
                        Click an operative below
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tactical Breakdown & Scores */}
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] mb-14">
            {/* Tactical Ratings */}
            <div className="border border-[rgba(236,232,225,0.1)] bg-[#0D1820] p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-4">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#0DF2F2]">
                    EVALUATION ON {selectedMap.toUpperCase()}
                  </span>
                  <h2 className="font-display text-2xl uppercase tracking-tight text-white mt-0.5">
                    Composition Synergy Score
                  </h2>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-5xl font-black text-primary">
                    {tacticalStats.overall}
                  </span>
                  <span className="font-mono text-sm text-muted">/100</span>
                </div>
              </div>

              {/* Dimension Stat Bars */}
              <div className="space-y-4">
                {[
                  { label: "EXECUTION (Entry & Space)", value: tacticalStats.execution, color: "bg-role-duelist" },
                  { label: "SITE CONTROL (Smokes & Denials)", value: tacticalStats.siteControl, color: "bg-role-controller" },
                  { label: "INFO / INTEL (Recon & Drones)", value: tacticalStats.info, color: "bg-role-initiator" },
                  { label: "POST-PLANT (Stall & Defuse Denial)", value: tacticalStats.postPlant, color: "bg-[#0DF2F2]" },
                  { label: "DEFENSIVE ANCHOR (Trips & Delay)", value: tacticalStats.defense, color: "bg-role-sentinel" },
                ].map(stat => (
                  <div key={stat.label} className="space-y-1.5">
                    <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider">
                      <span className="text-muted">{stat.label}</span>
                      <span className="font-bold text-white">{stat.value}/100</span>
                    </div>
                    <div className="h-2 w-full bg-[#0B141A] overflow-hidden">
                      <div 
                        className={`h-full ${stat.color} transition-all duration-500`}
                        style={{ width: `${stat.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Feedback */}
            <div className="border border-[rgba(236,232,225,0.1)] bg-[#0D1820] p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary border-b border-[rgba(236,232,225,0.08)] pb-3 mb-4">
                  Tactical Breakdown & Warnings
                </h3>
                <div className="space-y-3">
                  {tacticalStats.feedback.map((f, i) => (
                    <div
                      key={i}
                      className={`p-3 border text-xs font-sans flex items-start gap-2.5 ${
                        f.type === "warning" 
                          ? "border-warning/30 bg-warning/5 text-amber-200" 
                          : f.type === "success" 
                          ? "border-success/30 bg-success/5 text-emerald-200" 
                          : "border-border bg-surface text-secondary"
                      }`}
                    >
                      {f.type === "warning" && <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />}
                      {f.type === "success" && <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />}
                      {f.type === "info" && <Info className="h-4 w-4 text-[#0DF2F2] shrink-0 mt-0.5" />}
                      <span>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-[rgba(236,232,225,0.08)] pt-4 font-mono text-[10px] text-muted flex items-center justify-between">
                <span>Map-weighted meta engine</span>
                <span className="text-[#0DF2F2]">Patch 9.04 active</span>
              </div>
            </div>
          </div>

          {/* Operative Selection Grid */}
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-white mb-4">
              Select Agents ({agents.length} Available)
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {agents.map(agent => {
                const isSelected = slots.some(s => s?.uuid === agent.uuid);
                return (
                  <button
                    key={agent.uuid}
                    onClick={() => clickAgent(agent)}
                    className={`relative p-3 border text-left transition-all flex flex-col items-center group ${
                      isSelected 
                        ? "border-primary bg-primary/10 opacity-60" 
                        : "border-[rgba(236,232,225,0.08)] bg-[#0D1820] hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    <div className="relative h-16 w-16 mb-2">
                      <Image
                        src={agent.displayIconSmall || agent.displayIcon}
                        alt={agent.displayName}
                        fill
                        sizes="64px"
                        className="object-contain transition-transform group-hover:scale-105"
                        unoptimized
                      />
                    </div>
                    <span className="font-display font-bold text-xs uppercase tracking-wide text-white truncate w-full text-center">
                      {agent.displayName}
                    </span>
                    <span className="font-mono text-[9px] text-muted uppercase mt-0.5">
                      {agent.role?.displayName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Container>
      </div>
    </PageTransition>
  );
}
