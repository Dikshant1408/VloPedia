"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Play, RotateCw, Shield, Sparkles, Volume2, VolumeX } from "lucide-react";
import { Container } from "@/components/container";
import { PageTransition } from "@/components/motion-system";

interface FlexInspectClientProps {
  item: {
    uuid: string;
    displayName: string;
    displayIcon: string;
    assetPath: string;
  };
}

export function FlexInspectClient({ item }: FlexInspectClientProps) {
  const [animationMode, setAnimationMode] = useState<"idle" | "inspect" | "diagnostic" | "hologram">("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [scanActive, setScanActive] = useState(false);
  
  // Audio synthesizer references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const humNodeRef = useRef<OscillatorNode | null>(null);
  const humGainRef = useRef<GainNode | null>(null);

  // Initialize Web Audio API on first user interaction
  const initAudio = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Create ambient background hum
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A hum
      gain.gain.setValueAtTime(isMuted ? 0 : 0.04, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      humNodeRef.current = osc;
      humGainRef.current = gain;
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  };

  // Play synthetic trigger beeps and sweeps
  const playSound = (type: "beep" | "sweep" | "click") => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx || isMuted || ctx.state === "suspended") return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "beep") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "sweep") {
      osc.type = "sawtooth";
      // Biquad filter for retro sci-fi sweep
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      osc.disconnect(gain);
      osc.connect(filter);
      filter.connect(gain);

      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.6);
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } else if (type === "click") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    }
  };

  // Toggle Mute
  useEffect(() => {
    if (humGainRef.current && audioCtxRef.current) {
      humGainRef.current.gain.setValueAtTime(isMuted ? 0 : 0.04, audioCtxRef.current.currentTime);
    }
  }, [isMuted]);

  // Clean up Audio
  useEffect(() => {
    return () => {
      if (humNodeRef.current) {
        try { humNodeRef.current.stop(); } catch {}
      }
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch {}
      }
    };
  }, []);

  // Handle keypress "Y" to trigger inspect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "y") {
        e.preventDefault();
        triggerInspect();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [animationMode, isMuted]);

  // Mouse move tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (animationMode === "diagnostic") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Cap tilts
    setRotation({
      x: -y / 15,
      y: x / 15,
    });
  };

  const handleMouseLeave = () => {
    if (animationMode !== "diagnostic") {
      setRotation({ x: 0, y: 0 });
    }
  };

  // Inspect Animation
  const triggerInspect = () => {
    playSound("sweep");
    setAnimationMode("inspect");
    setScanActive(true);

    // End inspect animation after 1.8s
    setTimeout(() => {
      setAnimationMode("idle");
      setScanActive(false);
    }, 1800);
  };

  // Clean Name
  const cleanName = item.displayName.endsWith(" Flex")
    ? item.displayName.slice(0, -5)
    : item.displayName;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#060D13] text-foreground select-none relative overflow-hidden">
        
        {/* Holographic matrix background line */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,44,58,0.15)_0%,transparent_75%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,36,46,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,36,46,0.1)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* HUD Header */}
        <div className="border-b border-[rgba(236,232,225,0.06)] bg-[#0A141C]/80 backdrop-blur-md py-5 sticky top-0 z-50">
          <Container className="flex items-center justify-between">
            <Link
              href="/flex"
              onClick={() => playSound("click")}
              className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-muted hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Expressions
            </Link>

            <div className="flex items-center gap-4">
              <span className="font-mono text-[9px] text-[#0DF2F2]/50 tracking-[0.2em] hidden md:inline">SYSTEM STATUS: LINKED</span>
              <button
                onClick={() => {
                  setIsMuted(!isMuted);
                  playSound("click");
                }}
                className="p-2 border border-[rgba(236,232,225,0.08)] bg-black/30 hover:border-primary/50 text-muted hover:text-primary transition-all focus:outline-none"
                title={isMuted ? "Unmute HUD sounds" : "Mute HUD sounds"}
              >
                {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              </button>
            </div>
          </Container>
        </div>

        <Container className="py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          
          {/* Main Inspection Viewport */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={initAudio}
              className={`relative aspect-square md:aspect-[4/3] w-full border border-[rgba(236,232,225,0.08)] bg-[#071118]/90 overflow-hidden flex items-center justify-center cursor-crosshair group transition-all duration-300 ${
                animationMode === "hologram" ? "border-[#0DF2F2]/20 shadow-[inset_0_0_30px_rgba(13,242,242,0.03)]" : ""
              }`}
            >
              
              {/* Corner Sci-Fi bracket decoration */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-muted/30" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-muted/30" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-muted/30" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-muted/30" />

              {/* Viewport Overlay HUD details */}
              <div className="absolute top-5 left-6 font-mono text-[9px] text-muted/60 tracking-wider">
                SYS.VIEW.PERSPECTIVE [3D_GRID]
              </div>
              <div className="absolute bottom-5 left-6 font-mono text-[9px] text-muted/60 tracking-wider">
                FOV: 45° | ACC_AXIS: X/Y
              </div>
              <div className="absolute bottom-5 right-6 font-mono text-[9px] text-[#0DF2F2] tracking-wider animate-pulse">
                MODE: {animationMode.toUpperCase()}
              </div>

              {/* Grid backdrop */}
              <div className="absolute w-[60%] h-[60%] border border-[rgba(13,242,242,0.05)] rounded-full flex items-center justify-center animate-spin-slow pointer-events-none">
                <div className="w-[80%] h-[80%] border border-dashed border-[rgba(13,242,242,0.05)] rounded-full" />
              </div>

              {/* Holographic Scanline (inspect only) */}
              {scanActive && (
                <div className="absolute inset-x-0 h-0.5 bg-[#0DF2F2]/40 shadow-[0_0_12px_#0DF2F2] animate-scan z-20 pointer-events-none" />
              )}

              {/* Floating Flex Item Asset Image */}
              <div 
                className="relative w-44 h-44 md:w-56 md:h-56 z-10 transition-transform duration-100 ease-out"
                style={{
                  transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                }}
              >
                <div className={`w-full h-full relative transition-all duration-300 ${
                  animationMode === "inspect" ? "animate-inspect-spin scale-110" : 
                  animationMode === "diagnostic" ? "animate-diagnostic-orbit" :
                  animationMode === "hologram" ? "brightness-150 drop-shadow-[0_0_20px_#0DF2F2]" :
                  "animate-float"
                }`}>
                  
                  {/* Hologram tint mask */}
                  {animationMode === "hologram" && (
                    <div className="absolute inset-0 bg-[#0DF2F2] mix-blend-color z-20 pointer-events-none opacity-60 rounded-full" />
                  )}

                  <Image
                    src={item.displayIcon}
                    alt={cleanName}
                    fill
                    sizes="(max-width: 768px) 176px, 224px"
                    className="object-contain p-4 drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                    unoptimized
                    priority
                  />
                </div>
              </div>

              {/* Grid overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(13,242,242,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(13,242,242,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            </div>

            {/* Viewport Control Panel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              
              <button
                onClick={triggerInspect}
                disabled={animationMode === "inspect"}
                className={`py-3 border font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none ${
                  animationMode === "inspect"
                    ? "border-[#0DF2F2] bg-[#0DF2F2]/10 text-[#0DF2F2]"
                    : "border-[rgba(236,232,225,0.08)] bg-[#0A141C] hover:border-primary/50 text-white"
                }`}
              >
                <Play className="h-3 w-3" /> Inspect (Y)
              </button>

              <button
                onClick={() => {
                  playSound("beep");
                  setAnimationMode(animationMode === "diagnostic" ? "idle" : "diagnostic");
                  setRotation({ x: 0, y: 0 });
                }}
                className={`py-3 border font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none ${
                  animationMode === "diagnostic"
                    ? "border-[#0DF2F2] bg-[#0DF2F2]/10 text-[#0DF2F2]"
                    : "border-[rgba(236,232,225,0.08)] bg-[#0A141C] hover:border-primary/50 text-white"
                }`}
              >
                <RotateCw className="h-3 w-3" /> Diagnostic Mode
              </button>

              <button
                onClick={() => {
                  playSound("beep");
                  setAnimationMode(animationMode === "hologram" ? "idle" : "hologram");
                  setRotation({ x: 0, y: 0 });
                }}
                className={`py-3 border font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none ${
                  animationMode === "hologram"
                    ? "border-[#0DF2F2] bg-[#0DF2F2]/20 text-[#0DF2F2] shadow-[0_0_15px_rgba(13,242,242,0.15)]"
                    : "border-[rgba(236,232,225,0.08)] bg-[#0A141C] hover:border-primary/50 text-white"
                }`}
              >
                <Sparkles className="h-3 w-3" /> Hologram Mode
              </button>

              <button
                onClick={() => {
                  playSound("beep");
                  setAnimationMode("idle");
                  setRotation({ x: 0, y: 0 });
                }}
                className={`py-3 border border-[rgba(236,232,225,0.08)] bg-[#0A141C] hover:border-primary/50 font-mono text-[10px] font-bold uppercase tracking-wider text-white transition-all duration-300 focus:outline-none`}
              >
                Reset Axis
              </button>

            </div>
          </div>

          {/* Sidebar Metadata */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Header Identity */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0A141C] p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-[#0DF2F2] px-2 py-0.5 font-mono text-[9px] font-black text-black uppercase tracking-wider">
                  TOY
                </span>
                <span className="font-mono text-[10px] text-muted tracking-wider">EXPRESSION ACC.</span>
              </div>
              <h2 className="font-display text-4xl uppercase tracking-tight text-white">{cleanName}</h2>
              <div className="font-mono text-[10px] text-muted/60 leading-relaxed word-break-all">
                Asset: {item.assetPath}
              </div>
            </div>

            {/* Specifications Card */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0A141C] p-6 space-y-4 font-mono">
              <div className="border-b border-[rgba(236,232,225,0.06)] pb-2 flex justify-between items-center">
                <span className="text-[10px] text-muted">ID / HUE</span>
                <span className="text-[10px] text-white font-bold">{item.uuid.substring(0, 8)}</span>
              </div>
              <div className="border-b border-[rgba(236,232,225,0.06)] pb-2 flex justify-between items-center">
                <span className="text-[10px] text-muted">CLASS</span>
                <span className="text-[10px] text-[#0DF2F2] font-bold">EQUIPPABLE TOTEM</span>
              </div>
              <div className="border-b border-[rgba(236,232,225,0.06)] pb-2 flex justify-between items-center">
                <span className="text-[10px] text-muted">COMPATIBILITY</span>
                <span className="text-[10px] text-white font-bold">ALL AGENTS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted">INSPECT TRIGGER</span>
                <span className="text-[10px] text-primary font-bold">KEY [Y]</span>
              </div>
            </div>

            {/* Diagnostic Information */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0A141C] p-6 space-y-3 font-mono text-[10px] leading-relaxed">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Shield className="h-3.5 w-3.5" />
                <span>DIAGNOSTIC LOGS</span>
              </div>
              <p className="text-muted">
                Handheld interactive totem widget designed to play custom kinetic physics animations on command. Integrated dynamic collision and scan filters inside client UI.
              </p>
              <div className="pt-2 border-t border-[rgba(236,232,225,0.06)] flex items-center justify-between text-[9px] text-muted/50">
                <span>BUFFER STATUS: 100%</span>
                <span>CHROMA: VERIFIED</span>
              </div>
            </div>

          </div>

        </Container>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scan {
            0% { top: 0%; }
            50% { top: 100%; }
            100% { top: 0%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(1.5deg); }
          }
          @keyframes inspect-spin {
            0% { transform: rotate(0deg) scale(1); }
            40% { transform: rotate(180deg) scale(1.1); filter: brightness(1.4) drop-shadow(0 0 15px #0df2f2); }
            100% { transform: rotate(360deg) scale(1); }
          }
          @keyframes diagnostic-orbit {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(360deg); }
          }
          .animate-scan {
            animation: scan 2s linear infinite;
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
          .animate-inspect-spin {
            animation: inspect-spin 1.8s cubic-bezier(0.25, 1, 0.5, 1);
          }
          .animate-diagnostic-orbit {
            animation: diagnostic-orbit 6s linear infinite;
          }
          .animate-spin-slow {
            animation: spin 24s linear infinite;
          }
        `}} />

      </div>
    </PageTransition>
  );
}
