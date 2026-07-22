/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  VolumeX,
  Sliders,
  Shield,
  Activity,
  Award,
  Globe,
  Compass,
  Cpu,
  Bookmark,
  Radio,
} from "lucide-react";
import { audio } from "../services/audio";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

export const NAVIGATION_TABS = [
  { id: "home", label: "DASHBOARD", icon: Compass },
  { id: "agents", label: "AGENTS", icon: Award },
  { id: "weapons", label: "WEAPONS", icon: Cpu },
  { id: "maps", label: "MAPS", icon: Globe },
  { id: "collection", label: "COLLECTION", icon: Bookmark },
  { id: "meta", label: "METATOOLS", icon: Sliders },
  { id: "player-registry", label: "REGISTRY", icon: Shield },
  { id: "game-modes", label: "MODES", icon: Activity },
];

function TacticalAudioVisualizer({ accentColor }: { accentColor: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set stable micro proportions
    canvas.width = 60;
    canvas.height = 16;

    const dataArray = new Uint8Array(128);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const activeAnalyser = audio.getAnalyser();
      if (activeAnalyser && !audio.isMuted()) {
        activeAnalyser.getByteTimeDomainData(dataArray);

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = accentColor || "#00f5ff";
        ctx.beginPath();

        const sliceWidth = canvas.width / dataArray.length;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      } else {
        // Flatline telemetry
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [accentColor]);

  return (
    <div className="flex items-center space-x-1.5 bg-white/[0.02] border border-white/[0.08] rounded px-2 h-7" title="Real-time Web Audio API signal feed">
      <span className="font-mono text-[7px] text-gray-500 tracking-wider">SIG_FEED</span>
      <canvas ref={canvasRef} className="w-[60px] h-4 opacity-75" />
    </div>
  );
}

export default function Layout({
  children,
  activeTab,
  setActiveTab,
  accentColor,
  setAccentColor,
}: LayoutProps) {
  const [isMuted, setIsMuted] = useState(audio.isMuted());
  const [ambientEnabled, setAmbientEnabled] = useState(audio.isAmbientPlaying());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Custom cursor & snapping physics refs
  const ringElRef = useRef<HTMLDivElement | null>(null);
  const glowElRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const [mouseInViewport, setMouseInViewport] = useState(false);
  const [isSnappedState, setIsSnappedState] = useState(false);

  // Background Particle System (60 FPS, Canvas-based, Zero-dependency)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }> = [];

    const colors = [accentColor, "#ffffff", "#00f5ff", "#ff4655"];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Grid line overlay (subtle military look)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [accentColor]);

  // Track global mouse coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Monitor cursor viewport presence
  useEffect(() => {
    const handleMouseEnter = () => setMouseInViewport(true);
    const handleMouseLeave = () => setMouseInViewport(false);
    
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    // Automatically trigger active on first mouse move
    const handleFirstMove = () => {
      setMouseInViewport(true);
      window.removeEventListener("mousemove", handleFirstMove);
    };
    window.addEventListener("mousemove", handleFirstMove);

    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousemove", handleFirstMove);
    };
  }, []);

  // Real-time animation loop for the custom magnetic cursor (high-performance direct-DOM update)
  useEffect(() => {
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let currentWidth = 16;
    let currentHeight = 16;
    let currentRadius = 9999;
    let currentOpacity = 0;
    let currentGlowOpacity = 0;
    let currentGlowScale = 1.0;

    let animFrameId: number;

    const tick = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Offscreen start position handling
      if (mx < 0 && my < 0) {
        animFrameId = requestAnimationFrame(tick);
        return;
      }

      // Default non-snapped values
      let targetX = mx;
      let targetY = my;
      let targetWidth = 16;
      let targetHeight = 16;
      let targetRadius = 9999;
      let targetOpacity = mouseInViewport ? 0.65 : 0;
      let targetGlowOpacity = mouseInViewport ? 0.15 : 0;
      let targetGlowScale = 1.0;
      let isSnapped = false;

      if (mouseInViewport) {
        // Gather all elements that should attract the custom cursor
        const elements = document.querySelectorAll(
          "button, a, [role='button'], .cursor-pointer, input, select, textarea, [data-magnetic]"
        );

        let minDistance = Infinity;
        let closestEl: Element | null = null;
        let closestRect: DOMRect | null = null;

        elements.forEach((el) => {
          // Skip if the element belongs to our custom cursor divs to avoid self-reference recursion
          if (
            ringElRef.current?.contains(el) ||
            glowElRef.current?.contains(el) ||
            el === ringElRef.current ||
            el === glowElRef.current
          ) {
            return;
          }

          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;

          // Check closest distance to rectangle boundaries
          const rLeft = rect.left;
          const rRight = rect.right;
          const rTop = rect.top;
          const rBottom = rect.bottom;

          let distToX = 0;
          if (mx < rLeft) distToX = rLeft - mx;
          else if (mx > rRight) distToX = mx - rRight;

          let distToY = 0;
          if (my < rTop) distToY = rTop - my;
          else if (my > rBottom) distToY = my - rBottom;

          const rectDistance = Math.sqrt(distToX * distToX + distToY * distToY);

          if (rectDistance < minDistance) {
            minDistance = rectDistance;
            closestEl = el;
            closestRect = rect;
          }
        });

        // Attraction pull radius
        const pullThreshold = 80;

        if (closestEl && closestRect) {
          const rect = closestRect;
          const elCenterX = rect.left + rect.width / 2;
          const elCenterY = rect.top + rect.height / 2;

          // Inside element? Hover snap lock active
          const isInside =
            mx >= rect.left && mx <= rect.right && my >= rect.top && my <= rect.bottom;

          if (isInside) {
            isSnapped = true;
            // Snaps towards the center but keeps a subtle, organic float with actual mouse position
            targetX = elCenterX + (mx - elCenterX) * 0.15;
            targetY = elCenterY + (my - elCenterY) * 0.15;
            
            // Sleek compact tactical reticle size (no more giant box outlines!)
            targetWidth = 24;
            targetHeight = 24;
            targetRadius = 9999; // Keep a crisp circle/reticle form

            targetOpacity = 1.0;
            targetGlowOpacity = 0.45; // Refined highlight glow
            targetGlowScale = 1.25;
          } else if (minDistance < pullThreshold) {
            // Proximity attraction logic (pull-towards and brighten glow as pointer approaches)
            const factor = (pullThreshold - minDistance) / pullThreshold;
            
            // Magnetic pull toward center
            targetX = mx + (elCenterX - mx) * factor * 0.45;
            targetY = my + (elCenterY - my) * factor * 0.45;
            
            // Soft glow illumination
            targetGlowOpacity = 0.15 + factor * 0.25;
            targetOpacity = 0.65 + factor * 0.25;
            targetGlowScale = 1.0 + factor * 0.15;
          }
        }
      } else {
        targetOpacity = 0;
        targetGlowOpacity = 0;
      }

      // Smooth physics-like interpolation (lerp)
      const speedPos = isSnapped ? 0.26 : 0.18; // Lock instantly, float loosely when free-trailing
      currentX = currentX + (targetX - currentX) * speedPos;
      currentY = currentY + (targetY - currentY) * speedPos;
      
      currentWidth = currentWidth + (targetWidth - currentWidth) * 0.2;
      currentHeight = currentHeight + (targetHeight - currentHeight) * 0.2;
      currentRadius = currentRadius + (targetRadius - currentRadius) * 0.2;
      currentOpacity = currentOpacity + (targetOpacity - currentOpacity) * 0.15;
      currentGlowOpacity = currentGlowOpacity + (targetGlowOpacity - currentGlowOpacity) * 0.15;
      currentGlowScale = currentGlowScale + (targetGlowScale - currentGlowScale) * 0.15;

      // Update styling on DOM nodes directly for extreme performance (60/120+ fps)
      if (ringElRef.current) {
        ringElRef.current.style.left = `${currentX}px`;
        ringElRef.current.style.top = `${currentY}px`;
        ringElRef.current.style.width = `${currentWidth}px`;
        ringElRef.current.style.height = `${currentHeight}px`;
        ringElRef.current.style.borderRadius = `${currentRadius}px`;
        ringElRef.current.style.opacity = `${currentOpacity}`;

        if (isSnapped) {
          ringElRef.current.style.borderColor = accentColor;
          ringElRef.current.style.boxShadow = `0 0 16px ${accentColor}50, inset 0 0 8px ${accentColor}20`;
        } else {
          ringElRef.current.style.borderColor = "rgba(255, 255, 255, 0.35)";
          ringElRef.current.style.boxShadow = "none";
        }
      }

      if (glowElRef.current) {
        glowElRef.current.style.left = `${currentX}px`;
        glowElRef.current.style.top = `${currentY}px`;
        glowElRef.current.style.transform = `translate(-50%, -50%) scale(${currentGlowScale})`;
        glowElRef.current.style.opacity = `${currentGlowOpacity}`;
        glowElRef.current.style.backgroundColor = accentColor;
      }

      // Sync the snap state into React state so React can render the corner lock brackets beautifully
      setIsSnappedState(isSnapped);

      animFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => cancelAnimationFrame(animFrameId);
  }, [mouseInViewport, accentColor]);

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    audio.setMuted(newState);
    if (!newState) {
      audio.playClick();
    }
  };

  const toggleAmbient = () => {
    const newState = !ambientEnabled;
    setAmbientEnabled(newState);
    audio.setAmbientPlaying(newState);
    audio.playClick();
  };

  const handleTabChange = (tabId: string) => {
    audio.playSelect();
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-val-black text-gray-100 flex flex-col font-sans overflow-x-hidden relative selection:bg-val-red selection:text-white">
      {/* Custom Cursor Glow (Ambient backlight) */}
      <div
        ref={glowElRef}
        className="fixed pointer-events-none z-50 rounded-full blur-2xl transition-colors duration-300"
        style={{
          width: "120px",
          height: "120px",
          transform: "translate(-50%, -50%)",
          opacity: 0,
        }}
      />

      {/* Custom Cursor Ring / Reticle Box */}
      <div
        ref={ringElRef}
        className="fixed pointer-events-none z-50 border transition-all duration-150 flex items-center justify-center mix-blend-screen"
        style={{
          transform: "translate(-50%, -50%)",
          opacity: 0,
        }}
      >
        {/* Center Dot */}
        <div
          className="w-1 h-1 bg-white rounded-full transition-transform duration-200"
          style={{
            transform: isSnappedState ? "scale(0)" : "scale(1)",
            opacity: isSnappedState ? 0 : 0.8,
          }}
        />

        {/* Corner Lock Brackets - only visible when snapped to emphasize tactical HUD feeling */}
        <div
          className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 transition-all duration-300"
          style={{
            borderColor: isSnappedState ? accentColor : "transparent",
            transform: isSnappedState ? "translate(-1px, -1px)" : "translate(2px, 2px)",
          }}
        />
        <div
          className="absolute top-0 right-0 w-1.5 h-1.5 border-t-2 border-r-2 transition-all duration-300"
          style={{
            borderColor: isSnappedState ? accentColor : "transparent",
            transform: isSnappedState ? "translate(1px, -1px)" : "translate(-2px, 2px)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-2 border-l-2 transition-all duration-300"
          style={{
            borderColor: isSnappedState ? accentColor : "transparent",
            transform: isSnappedState ? "translate(-1px, 1px)" : "translate(2px, -2px)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 transition-all duration-300"
          style={{
            borderColor: isSnappedState ? accentColor : "transparent",
            transform: isSnappedState ? "translate(1px, 1px)" : "translate(-2px, -2px)",
          }}
        />
      </div>

      {/* Ambient Background FX */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#ff4655_0%,transparent_70%)] opacity-10" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(18, 25, 35, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
            backgroundSize: "100% 2px, 3px 100%",
          }}
        />
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-val-red z-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-val-red z-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-val-red z-30 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-val-red z-30 pointer-events-none" />

      {/* Background canvas particles */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Decorative Outer Grid Lines and Borders (Riot Client feel) */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-10" />
      <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-white/[0.02] pointer-events-none z-10 hidden lg:block" />
      <div className="absolute right-6 top-0 bottom-0 w-[1px] bg-white/[0.02] pointer-events-none z-10 hidden lg:block" />

      {/* HEADER BAR */}
      <header className="h-16 border-b border-white/10 bg-val-black/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 relative z-20">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <div
            className="flex items-center space-x-2.5 group cursor-pointer"
            onClick={() => handleTabChange("home")}
          >
            <div className="w-8 h-8 bg-val-red flex items-center justify-center rotate-45 transition-transform duration-300 group-hover:rotate-135">
              <div className="w-4 h-4 bg-white rotate-45" />
            </div>
            <div>
              <span className="font-sans font-black text-2xl tracking-tighter uppercase italic text-white group-hover:text-val-cyan transition-colors duration-200">
                VLOPEDIA
              </span>
              <span className="hidden sm:inline-block font-mono text-[9px] tracking-widest text-val-red ml-2 bg-val-red/10 px-1.5 py-0.5 border border-val-red/20 uppercase italic">
                v2.1.0 // LIVE
              </span>
            </div>
          </div>
        </div>

        {/* Tactical Accent Switcher & Sound controls */}
        <div className="flex items-center space-x-6">
          {/* Tactical Search Indicator from Immersive UI */}
          <div
            onClick={() => {
              audio.playClick();
              window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
            }}
            className="cursor-pointer bg-white/5 border border-white/10 hover:border-val-cyan px-4 py-1.5 rounded-sm flex items-center gap-3 transition-all duration-200 hidden md:flex"
            title="Search Database (Ctrl+K)"
          >
            <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">SEARCH_DATABASE</span>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/70 font-mono">CTRL+K</span>
          </div>

          {/* Theme customizer */}
          <div className="flex items-center space-x-2 bg-white/[0.02] border border-white/[0.05] px-2 py-1 rounded">
            <span className="font-mono text-[9px] tracking-wider text-gray-500 mr-1 hidden sm:inline">
              ACCENT
            </span>
            {[
              { label: "cyan", hex: "#00f5ff" },
              { label: "red", hex: "#ff4655" },
              { label: "purple", hex: "#c846ff" },
              { label: "orange", hex: "#ff7f00" },
            ].map((color) => (
              <button
                key={color.label}
                onClick={() => {
                  audio.playClick();
                  setAccentColor(color.hex);
                }}
                className={`w-3 h-3 rounded-full transition-transform hover:scale-125 ${
                  accentColor === color.hex ? "ring-2 ring-white scale-110" : ""
                }`}
                style={{ backgroundColor: color.hex }}
                title={`${color.label.toUpperCase()} PROTOCOL`}
              />
            ))}
          </div>

          {/* Real-time Web Audio Analyser Waveform Visualizer */}
          <TacticalAudioVisualizer accentColor={accentColor} />

          {/* Ambient soundscape toggle */}
          <button
            onClick={toggleAmbient}
            onMouseEnter={() => audio.playHover()}
            className="text-gray-400 hover:text-white transition-all duration-200 relative p-1 cursor-pointer active:scale-90"
            title={ambientEnabled ? "Mute Background Tactical Soundscape" : "Play Background Tactical Soundscape"}
          >
            <Radio className={`w-5 h-5 transition-colors ${ambientEnabled ? "text-val-cyan animate-pulse" : "text-gray-600 hover:text-gray-400"}`} />
          </button>

          {/* Sound volume controller */}
          <button
            onClick={toggleMute}
            onMouseEnter={() => audio.playHover()}
            className="text-gray-400 hover:text-white transition-colors duration-200 relative p-1 cursor-pointer active:scale-90"
            title={isMuted ? "Unmute Sounds" : "Mute Sounds"}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-val-red" /> : <Volume2 className="w-5 h-5 text-val-cyan" />}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        {/* RESPONSIVE CLIENT NAVIGATION BAR */}
        <nav className="lg:w-64 bg-[#0b0e11]/80 backdrop-blur-sm lg:bg-[#0b0e11]/40 lg:border-r border-white/10 flex flex-row lg:flex-col justify-between overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto shrink-0 p-3 lg:p-6 gap-2 lg:gap-6 relative z-20">
          <div className="flex flex-row lg:flex-col items-center lg:items-stretch w-full gap-1 lg:gap-1.5 min-w-max lg:min-w-0">
            <div className="hidden lg:block font-mono text-[10px] text-val-red font-bold tracking-[0.3em] mb-4 uppercase">
              CLIENT MENU // SYSTEM_STATS
            </div>

            {NAVIGATION_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  onMouseEnter={() => audio.playHover()}
                  className={`flex items-center space-x-3 px-4 py-3 rounded text-left transition-all duration-200 relative group w-full lg:w-auto ${
                    isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                  }`}
                  style={
                    isActive
                      ? {
                          borderLeft: `2px solid ${accentColor}`,
                          backgroundImage: `linear-gradient(to right, ${accentColor}18, transparent)`,
                        }
                      : {}
                  }
                >
                  <Icon
                    className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12"
                    style={{ color: isActive ? accentColor : "#9ca3af" }}
                  />
                  <span className="font-sans font-bold text-[11px] tracking-[0.2em] uppercase">
                    {tab.label}
                  </span>

                  {isActive && (
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rotate-45 animate-pulse"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar decorative footer */}
          <div className="hidden lg:block mt-auto pt-6 border-t border-white/10">
            <div className="bg-white/5 border border-white/10 p-4 relative overflow-hidden">
              <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-[0.2em] mb-2">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                <span style={{ color: accentColor }}>SYS_STABLE</span>
              </div>
              <p className="text-[10px] font-sans text-white/60 leading-relaxed">
                VALORANT API Connection active. Server response 42ms.
              </p>
            </div>
          </div>
        </nav>

        {/* CENTRAL VIEW AREA */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex-1 flex flex-col w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="h-12 border-t border-white/10 bg-[#0b0e11] flex flex-col md:flex-row items-center justify-between px-6 font-mono text-[9px] text-white/30 relative z-20 gap-2 py-2 md:py-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-val-cyan rounded-full animate-pulse" />
            <span className="tracking-[0.15em] font-bold">API STATUS: OPERATIONAL</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-val-red rounded-full" />
            <span className="tracking-[0.15em] font-bold">LAST SYNC: 2 SEC AGO</span>
          </div>
        </div>

        <div className="hidden lg:block text-center text-gray-500 text-[8px] tracking-[0.15em] uppercase">
          © 2026 VLOPEDIA. BUILT FOR TACTICAL EXCELLENCE. NOT AFFILIATED WITH RIOT GAMES.
        </div>

        <div className="flex items-center gap-6">
          <span className="hover:text-white cursor-pointer transition-colors" onClick={() => audio.playClick()}>
            PRIVACY
          </span>
          <span className="hover:text-white cursor-pointer transition-colors" onClick={() => audio.playClick()}>
            TERMS
          </span>
          <span className="text-white/10 italic font-black text-xs tracking-widest hidden sm:inline">
            VALORANT PROTOCOL // INTEL DIVISION
          </span>
        </div>
      </footer>
    </div>
  );
}
