"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, ShieldAlert, Flame, Eye, Swords, Shield, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { RoleBadge } from "@/components/role-badge";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { valorantDb } from "@/lib/valorant-db";
import type { ValorantAgent } from "@/lib/valorant-types";

/* ── Role display config ── */
const ROLE_CONFIG = [
  { key: "Duelist",    icon: Flame,      color: "bg-role-duelist"    },
  { key: "Controller", icon: Eye,        color: "bg-role-controller" },
  { key: "Initiator",  icon: Swords,     color: "bg-role-initiator"  },
  { key: "Sentinel",   icon: Shield,     color: "bg-role-sentinel"   },
];

/* ── Synergy analysis ── */
function getSynergy(agents: ValorantAgent[]): { type: "info"|"warning"|"success"; text: string }[] {
  const out: { type: "info"|"warning"|"success"; text: string }[] = [];
  if (agents.length === 0) { out.push({ type:"info", text:"Select agents to begin analysis." }); return out; }
  if (agents.length < 5)   { out.push({ type:"info", text:`Roster incomplete (${agents.length}/5).` }); }

  const counts = {
    Duelist:    agents.filter(a => a.role?.displayName === "Duelist").length,
    Controller: agents.filter(a => a.role?.displayName === "Controller").length,
    Initiator:  agents.filter(a => a.role?.displayName === "Initiator").length,
    Sentinel:   agents.filter(a => a.role?.displayName === "Sentinel").length,
  };

  if (counts.Controller === 0) out.push({ type:"warning", text:"No Controller — executes will be open to enemy vision. Add a smoke agent." });
  else if (counts.Controller >= 2) out.push({ type:"success", text:"Double Controller — excellent site control and flexible rotations." });

  if (counts.Initiator === 0)  out.push({ type:"warning", text:"No Initiator — lacking flashes and intel. Site entry will be high risk." });
  if (counts.Duelist === 0)    out.push({ type:"warning", text:"No Duelist — missing space-creation entries. Site executes may stall." });
  else if (counts.Duelist >= 3) out.push({ type:"warning", text:"Triple Duelist — aggressive overdrive. Dependent on winning early skirmishes." });
  if (counts.Sentinel === 0)   out.push({ type:"warning", text:"No Sentinel — no passive flank coverage. Vulnerable to fast splits." });

  if (agents.length === 5 && !out.some(a => a.type === "warning")) {
    out.push({ type:"success", text:"Balanced composition — meets standard meta thresholds." });
  }
  return out;
}

export default function CompBuilderPage() {
  const { user } = useAuth();
  const [liveAgents, setLiveAgents] = useState<ValorantAgent[]>([]);
  const [slots, setSlots]           = useState<(ValorantAgent|null)[]>([null,null,null,null,null]);
  const [compName, setCompName]     = useState("");
  const [dragging, setDragging]     = useState<ValorantAgent|null>(null);
  const [dragTarget, setDragTarget] = useState<number|null>(null);

  useEffect(() => {
    fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true")
      .then(r => r.json())
      .then(j => setLiveAgents(j.data ?? []))
      .catch(() => {});
  }, []);

  const agents = liveAgents.length > 0 ? liveAgents : [];

  /* ── Slot management ── */
  const assign = (agent: ValorantAgent, slotIdx: number) => {
    // Duplicate check
    const existingSlot = slots.findIndex(s => s?.uuid === agent.uuid);
    if (existingSlot !== -1 && existingSlot !== slotIdx) {
      toast.error(`${agent.displayName} is already in slot ${existingSlot + 1}`, { className:"font-mono rounded-none" });
      return;
    }
    setSlots(prev => { const n=[...prev]; n[slotIdx]=agent; return n; });
  };

  const remove = (idx: number) => setSlots(prev => { const n=[...prev]; n[idx]=null; return n; });
  const clear  = () => setSlots([null,null,null,null,null]);

  /* ── Click to add to first empty slot ── */
  const clickAgent = (agent: ValorantAgent) => {
    const alreadyIn = slots.findIndex(s => s?.uuid === agent.uuid);
    if (alreadyIn !== -1) { remove(alreadyIn); return; }
    const empty = slots.findIndex(s => s === null);
    if (empty === -1) { toast.info("All 5 slots are filled.", { className:"font-mono rounded-none" }); return; }
    assign(agent, empty);
  };

  /* ── Drag and drop ── */
  const onDragStart = (agent: ValorantAgent) => setDragging(agent);
  const onDragOver  = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragTarget(idx); };
  const onDrop      = (e: React.DragEvent, idx: number) => { e.preventDefault(); if (dragging) assign(dragging, idx); setDragging(null); setDragTarget(null); };
  const onDragEnd   = () => { setDragging(null); setDragTarget(null); };

  /* ── Save comp ── */
  const saveComp = () => {
    if (!user) { toast.info("Sign in to save compositions", { className:"font-mono rounded-none" }); return; }
    const filled = slots.filter(Boolean);
    if (filled.length < 5) { toast.info("Fill all 5 slots before saving", { className:"font-mono rounded-none" }); return; }
    toast.success(`Saved "${compName || "My Comp"}"`, { className:"font-mono rounded-none border-primary/40" });
  };

  const filledAgents = slots.filter(Boolean) as ValorantAgent[];
  const synergy = getSynergy(filledAgents);

  const counts: Record<string,number> = { Duelist:0, Controller:0, Initiator:0, Sentinel:0 };
  for (const a of filledAgents) if (a.role?.displayName) counts[a.role.displayName] = (counts[a.role.displayName]||0) + 1;

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
                <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">ROSTER MODULATOR</span>
              </div>
              <h1 className="font-display text-5xl uppercase tracking-tight text-white sm:text-6xl">COMP BUILDER</h1>
              <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-secondary">
                Build and save 5-agent compositions. Drag agents into slots or click to assign.
              </p>
            </Container>
          </div>

          <Container className="py-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_320px]">

              {/* Left — slots + agent roster */}
              <div className="space-y-10">

                {/* 5 slots */}
                <Reveal>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                        Team Composition — {filledAgents.length}/5
                      </span>
                      <button type="button" onClick={clear}
                        className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted transition-colors hover:text-primary">
                        Clear all
                      </button>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      {slots.map((agent, i) => (
                        <div
                          key={i}
                          onDragOver={e => onDragOver(e, i)}
                          onDrop={e => onDrop(e, i)}
                          className={[
                            "relative border transition-all duration-200",
                            agent
                              ? "border-primary/60 bg-[#0D1A22]"
                              : dragTarget === i
                              ? "border-primary bg-primary/10"
                              : "border-dashed border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)]/30",
                          ].join(" ")}
                          style={{ aspectRatio: "3/4" }}
                        >
                          {agent ? (
                            <>
                              <Image src={agent.fullPortrait||agent.bustPortrait} alt={agent.displayName}
                                fill sizes="120px" className="object-cover object-top opacity-70" unoptimized />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 p-2">
                                <p className="font-display text-[11px] uppercase text-white leading-none">{agent.displayName}</p>
                              </div>
                              <button type="button" onClick={() => remove(i)} aria-label={`Remove ${agent.displayName}`}
                                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center bg-black/70 text-muted transition-colors hover:text-primary focus-visible:outline-none">
                                <X className="h-3 w-3" aria-hidden="true" />
                              </button>
                            </>
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-1">
                              <Users className="h-5 w-5 text-muted" aria-hidden="true" />
                              <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-muted">
                                Slot {i+1}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>

                {/* Save comp */}
                <Reveal>
                  <div className="flex flex-wrap items-center gap-3 border border-border bg-[#0D1A22] p-4">
                    <label htmlFor="comp-name" className="sr-only">Composition name</label>
                    <input id="comp-name" type="text" value={compName} onChange={e => setCompName(e.target.value)}
                      placeholder="Name your composition…"
                      className="flex-1 min-w-[160px] border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] px-3 py-2 font-sans text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none" />
                    <Button variant="primary" onClick={saveComp} className="cut-corner-br gap-2">
                      <Save className="h-3.5 w-3.5" aria-hidden="true" /> Save Comp
                    </Button>
                  </div>
                </Reveal>

                {/* Agent roster */}
                <Reveal>
                  <div className="space-y-4">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                      Agent Roster
                    </span>
                    <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
                      {agents.map(agent => {
                        const inSlot = slots.some(s => s?.uuid === agent.uuid);
                        return (
                          <button
                            key={agent.uuid}
                            type="button"
                            onClick={() => clickAgent(agent)}
                            draggable
                            onDragStart={() => onDragStart(agent)}
                            onDragEnd={onDragEnd}
                            aria-pressed={inSlot}
                            aria-label={`${inSlot ? "Remove" : "Add"} ${agent.displayName}`}
                            className={[
                              "relative overflow-hidden border transition-all duration-200 cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                              inSlot ? "border-primary bg-primary/10" : "border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] hover:border-white/30",
                            ].join(" ")}
                            style={{ aspectRatio: "1/1.2" }}
                          >
                            <Image src={agent.bustPortrait||agent.displayIcon} alt={agent.displayName}
                              fill sizes="80px"
                              className={`object-cover transition-opacity ${inSlot?"opacity-90":"opacity-50 hover:opacity-80"}`}
                              unoptimized />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/85 px-1 py-0.5 text-center font-mono text-[7px] font-bold uppercase text-foreground truncate">
                              {agent.displayName}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Right — role balance + synergy */}
              <div className="space-y-5">

                {/* Role balance */}
                <Reveal className="border border-border bg-[#0D1A22] p-5 space-y-4 cut-corner-br">
                  <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary border-b border-border pb-3">
                    Role Balance
                  </h2>
                  {ROLE_CONFIG.map(r => (
                    <div key={r.key} className="space-y-1.5">
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <div className="flex items-center gap-2">
                          <r.icon className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                          <span className="font-bold uppercase tracking-wider text-muted">{r.key}</span>
                        </div>
                        <span className="font-bold text-white">{counts[r.key]||0}/5</span>
                      </div>
                      <div className="stat-bar-track" role="progressbar" aria-valuenow={counts[r.key]||0} aria-valuemin={0} aria-valuemax={5}>
                        <div className={`stat-bar-fill h-full ${r.color}`}
                          style={{ transform: `scaleX(${((counts[r.key]||0)/5)})` }} />
                      </div>
                    </div>
                  ))}
                </Reveal>

                {/* Synergy notes */}
                <Reveal className="border border-border bg-[#0D1A22] p-5 space-y-3 cut-corner-br">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <ShieldAlert className="h-4 w-4 text-primary" aria-hidden="true" />
                    <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                      Synergy Notes
                    </h2>
                  </div>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {synergy.map((s,i) => (
                      <div key={i} className={[
                        "border p-3 font-sans text-[11px] leading-relaxed",
                        s.type==="warning" ? "border-error/25 bg-[rgba(250,68,84,0.05)] text-error"
                          : s.type==="success" ? "border-success/25 bg-[rgba(34,197,94,0.05)] text-success"
                          : "border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] text-muted",
                      ].join(" ")}>
                        {s.text}
                      </div>
                    ))}
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
