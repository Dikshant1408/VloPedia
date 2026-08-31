"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Share2, 
  Check, 
  Copy, 
  Sparkles, 
  Crosshair as CrosshairIcon, 
  Sliders, 
  Shield, 
  Flame, 
  Target, 
  Monitor, 
  Mouse, 
  Keyboard as KeyboardIcon, 
  ExternalLink 
} from "lucide-react";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ValorantAgent } from "@/lib/valorant-types";
import { slugify } from "@/lib/utils";

const WEAPONS_LIST = [
  "Vandal", "Phantom", "Operator", "Sheriff", "Ghost", "Spectre", 
  "Guardian", "Odin", "Outlaw", "Judge", "Marshal", "Classic"
];

const SKINS_SAMPLE = [
  "Reaver Vandal", "Prime Vandal", "Kuronami Vandal", "Araxyys Vandal", "Glitchpop Vandal",
  "Prime 2.0 Phantom", "Oni Phantom", "Recon Phantom", "Protocol 781-A Phantom", "Spectrum Phantom",
  "Ion Operator", "Elderflame Operator", "Origin Operator", "Araxys Operator",
  "Neo Frontier Sheriff", "Singularity Sheriff", "Magepunk Ghost", "Sovereign Ghost"
];

export default function SetupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B141A]" />}>
      <SetupInner />
    </Suspense>
  );
}

function SetupInner() {
  const searchParams = useSearchParams();

  const [agents, setAgents]             = useState<ValorantAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>(searchParams.get("agent") || "jett");
  const [sens, setSens]                 = useState<string>(searchParams.get("sens") || "0.32");
  const [dpi, setDpi]                   = useState<string>(searchParams.get("dpi") || "800");
  const [crosshair, setCrosshair]       = useState<string>(
    searchParams.get("ch") || "0;s;1;P;c;5;h;0;m;1;0t;1;0l;2;0o;2;0a;1"
  );
  const [primaryGun, setPrimaryGun]     = useState<string>(searchParams.get("gun") || "Vandal");
  const [primarySkin, setPrimarySkin]   = useState<string>(searchParams.get("skin") || "Reaver Vandal");
  const [mouse, setMouse]               = useState<string>(searchParams.get("mouse") || "Logitech G Pro X Superlight 2");
  const [keyboard, setKeyboard]         = useState<string>(searchParams.get("kb") || "Wooting 60HE");
  const [monitor, setMonitor]           = useState<string>(searchParams.get("hz") || "240Hz Fast IPS");
  const [copiedLink, setCopiedLink]     = useState(false);
  const [copiedCrosshair, setCopiedCrosshair] = useState(false);

  // Fetch agents
  useEffect(() => {
    fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true")
      .then(r => r.json())
      .then(j => {
        if (j?.data) setAgents(j.data);
      })
      .catch(() => {});
  }, []);

  // Calculate eDPI
  const edpi = useMemo(() => {
    const s = parseFloat(sens) || 0;
    const d = parseFloat(dpi) || 800;
    return parseFloat((s * d).toFixed(1));
  }, [sens, dpi]);

  const activeAgentData = useMemo(() => {
    return agents.find(a => slugify(a.displayName) === slugify(selectedAgent)) || null;
  }, [agents, selectedAgent]);

  // Sync parameters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedAgent) params.set("agent", selectedAgent);
    if (sens) params.set("sens", sens);
    if (dpi) params.set("dpi", dpi);
    if (crosshair) params.set("ch", crosshair);
    if (primaryGun) params.set("gun", primaryGun);
    if (primarySkin) params.set("skin", primarySkin);
    if (mouse) params.set("mouse", mouse);
    if (keyboard) params.set("kb", keyboard);
    if (monitor) params.set("hz", monitor);

    const newUrl = `/setup?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, [selectedAgent, sens, dpi, crosshair, primaryGun, primarySkin, mouse, keyboard, monitor]);

  const copyShareableLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success("Setup link copied! Share it with your squad.");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const copyCrosshairCode = () => {
    navigator.clipboard.writeText(crosshair);
    setCopiedCrosshair(true);
    toast.success("Crosshair code copied to clipboard!");
    setTimeout(() => setCopiedCrosshair(false), 2500);
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
                    TACTICAL LOADOUT CARD
                  </span>
                </div>
                <h1 className="font-display text-5xl uppercase tracking-tight text-white sm:text-6xl">
                  MY VALORANT SETUP
                </h1>
                <p className="mt-2 max-w-2xl font-sans text-sm text-secondary">
                  Create and share your operative main, mouse DPI, in-game sensitivity, crosshair profile, and favorite skins.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={copyShareableLink}
                className="gap-2 font-mono text-xs uppercase"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
                {copiedLink ? "Link Copied" : "Share Setup"}
              </Button>
            </div>
          </Container>
        </div>

        <Container className="py-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            
            {/* Setup Editor Form */}
            <div className="border border-[rgba(236,232,225,0.1)] bg-[#0D1820] p-6 space-y-6">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary border-b border-[rgba(236,232,225,0.08)] pb-4">
                Customize Your Profile
              </h2>

              {/* Main Agent */}
              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                  Main Operative
                </label>
                <select
                  value={selectedAgent}
                  onChange={e => setSelectedAgent(e.target.value)}
                  className="w-full border border-[rgba(236,232,225,0.12)] bg-[#0B141A] px-3.5 py-2.5 font-mono text-sm text-white focus:border-primary focus:outline-none uppercase"
                >
                  {agents.map(a => (
                    <option key={a.uuid} value={slugify(a.displayName)} className="bg-[#0B141A] text-white">
                      {a.displayName} ({a.role?.displayName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Aim & Sensitivity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                    In-Game Sens
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={sens}
                    onChange={e => setSens(e.target.value)}
                    className="w-full border border-[rgba(236,232,225,0.12)] bg-[#0B141A] px-3.5 py-2.5 font-mono text-sm text-white focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                    Mouse DPI
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={dpi}
                    onChange={e => setDpi(e.target.value)}
                    className="w-full border border-[rgba(236,232,225,0.12)] bg-[#0B141A] px-3.5 py-2.5 font-mono text-sm text-white focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Crosshair Profile */}
              <div className="space-y-1.5">
                <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                  Crosshair Import Code
                </label>
                <input
                  type="text"
                  value={crosshair}
                  onChange={e => setCrosshair(e.target.value)}
                  placeholder="0;s;1;P;c;5;..."
                  className="w-full border border-[rgba(236,232,225,0.12)] bg-[#0B141A] px-3.5 py-2.5 font-mono text-xs text-white focus:border-primary focus:outline-none"
                />
              </div>

              {/* Favorite Weapon & Skin */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                    Signature Weapon
                  </label>
                  <select
                    value={primaryGun}
                    onChange={e => setPrimaryGun(e.target.value)}
                    className="w-full border border-[rgba(236,232,225,0.12)] bg-[#0B141A] px-3.5 py-2.5 font-mono text-sm text-white focus:border-primary focus:outline-none"
                  >
                    {WEAPONS_LIST.map(w => (
                      <option key={w} value={w} className="bg-[#0B141A] text-white">
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                    Signature Skin
                  </label>
                  <input
                    type="text"
                    value={primarySkin}
                    onChange={e => setPrimarySkin(e.target.value)}
                    placeholder="e.g. Reaver Vandal"
                    className="w-full border border-[rgba(236,232,225,0.12)] bg-[#0B141A] px-3.5 py-2.5 font-mono text-sm text-white focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Hardware Peripherals */}
              <div className="space-y-3 pt-2 border-t border-[rgba(236,232,225,0.08)]">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#0DF2F2] block">
                  Hardware Rig
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-mono text-[9px] text-muted uppercase">Mouse</label>
                    <input
                      type="text"
                      value={mouse}
                      onChange={e => setMouse(e.target.value)}
                      className="w-full border border-[rgba(236,232,225,0.08)] bg-[#0B141A] px-2 py-1.5 font-mono text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] text-muted uppercase">Keyboard</label>
                    <input
                      type="text"
                      value={keyboard}
                      onChange={e => setKeyboard(e.target.value)}
                      className="w-full border border-[rgba(236,232,225,0.08)] bg-[#0B141A] px-2 py-1.5 font-mono text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[9px] text-muted uppercase">Monitor</label>
                    <input
                      type="text"
                      value={monitor}
                      onChange={e => setMonitor(e.target.value)}
                      className="w-full border border-[rgba(236,232,225,0.08)] bg-[#0B141A] px-2 py-1.5 font-mono text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Shareable Profile Card */}
            <div className="space-y-4">
              <div className="border border-primary/40 bg-[#0D1820] p-6 shadow-2xl relative overflow-hidden">
                {/* Agent background silhouette */}
                {activeAgentData?.background && (
                  <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-10 pointer-events-none">
                    <Image
                      src={activeAgentData.background}
                      alt=""
                      fill
                      className="object-cover object-right"
                      unoptimized
                    />
                  </div>
                )}

                <div className="relative z-10 space-y-6">
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 border border-primary bg-[#0B141A] overflow-hidden">
                        {activeAgentData ? (
                          <Image
                            src={activeAgentData.displayIconSmall || activeAgentData.displayIcon}
                            alt={activeAgentData.displayName}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        ) : (
                          <Flame className="h-6 w-6 text-primary m-auto mt-3" />
                        )}
                      </div>
                      <div>
                        <span className="font-mono text-[9px] text-primary uppercase tracking-[0.3em] font-bold block">
                          VALORANT PLAYER PROFILE
                        </span>
                        <h3 className="font-display font-black text-2xl uppercase tracking-tight text-white">
                          {activeAgentData?.displayName || selectedAgent.toUpperCase()} MAIN
                        </h3>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-[9px] text-muted uppercase block">ROLE</span>
                      <span className="font-mono text-xs font-bold text-[#0DF2F2] uppercase">
                        {activeAgentData?.role?.displayName || "OPERATIVE"}
                      </span>
                    </div>
                  </div>

                  {/* Sens & eDPI Metrics */}
                  <div className="grid grid-cols-3 gap-2 border border-[rgba(236,232,225,0.08)] bg-[#0B141A] p-3 text-center">
                    <div>
                      <span className="font-mono text-[8px] text-muted uppercase block">SENSITIVITY</span>
                      <span className="font-display font-bold text-lg text-white">{sens}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[8px] text-muted uppercase block">DPI</span>
                      <span className="font-display font-bold text-lg text-white">{dpi}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[8px] text-muted uppercase block">eDPI</span>
                      <span className="font-display font-bold text-lg text-[#0DF2F2]">{edpi}</span>
                    </div>
                  </div>

                  {/* Weapon & Skin */}
                  <div className="border border-[rgba(236,232,225,0.08)] bg-[#0B141A] p-3 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[8px] text-muted uppercase block">FAVORITE WEAPON</span>
                      <span className="font-display font-bold text-sm text-white uppercase">{primaryGun}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[8px] text-muted uppercase block">SKIN</span>
                      <span className="font-mono text-xs text-primary font-bold">{primarySkin}</span>
                    </div>
                  </div>

                  {/* Crosshair code */}
                  <div className="border border-[rgba(236,232,225,0.08)] bg-[#0B141A] p-3 flex items-center justify-between">
                    <div className="min-w-0 pr-3">
                      <span className="font-mono text-[8px] text-muted uppercase block">CROSSHAIR CODE</span>
                      <span className="font-mono text-xs text-muted truncate block">{crosshair}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyCrosshairCode}
                      className="shrink-0 h-7 text-[10px] gap-1 px-2.5"
                    >
                      {copiedCrosshair ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copiedCrosshair ? "Copied" : "Copy Code"}
                    </Button>
                  </div>

                  {/* Gear Spec Footer */}
                  <div className="border-t border-[rgba(236,232,225,0.08)] pt-3 flex items-center justify-between font-mono text-[10px] text-muted">
                    <span className="truncate pr-2">🖱 {mouse} · ⌨ {keyboard}</span>
                    <span className="shrink-0 text-[#0DF2F2]">VloPedia</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  className="flex-1 gap-2 font-mono text-xs uppercase"
                  onClick={copyShareableLink}
                >
                  <Share2 className="h-4 w-4" />
                  Copy Shareable Setup Link
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </PageTransition>
  );
}
