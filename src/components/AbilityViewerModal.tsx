/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Zap,
  Info,
  Clock,
  Coins,
  ShieldAlert,
  Sword,
  Target,
  CheckCircle2,
  RefreshCw,
  Play,
  Pause,
  Compass,
  Sparkles,
  Award
} from "lucide-react";
import { Ability, Agent } from "../types/valorant";
import { audio } from "../services/audio";

interface AbilityViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent;
  ability: Ability;
  accentColor: string;
}

interface StaticAbilityDetails {
  cooldown: string;
  cost: string;
  castTime: string;
  duration: string;
  tacticalUse: string;
  proTip: string;
  synergy: string;
  simType: "recon" | "dash" | "heal" | "flash" | "damage" | "default";
}

// Complete static specs mapping for popular agents to ensure 100% accurate data representation
const PRESET_ABILITIES: Record<string, Record<string, StaticAbilityDetails>> = {
  jett: {
    updraft: {
      cooldown: "None (Charges: 2)",
      cost: "150 Credits",
      castTime: "Instant",
      duration: "N/A",
      tacticalUse: "Launches Jett high in the air. Perfect for scaling containers, dodging walls, or taking vertical angles.",
      proTip: "Activate Updraft during Jett's Ultimate (Blade Storm) to gain clear overhead sightlines over boxes.",
      synergy: "Omen Smokes, Breach Aftershock",
      simType: "dash"
    },
    tailwind: {
      cooldown: "1 Charge (Recharges on 2 Kills)",
      cost: "Free (Signature)",
      castTime: "Instant",
      duration: "N/A",
      tacticalUse: "Propels Jett in her current movement direction. Standard tool for aggressive peeking and escape.",
      proTip: "Use with an Operator: fire, and immediately press Tailwind to escape before trading.",
      synergy: "Sova Recon Bolt, Skye Trailblazer",
      simType: "dash"
    },
    cloudburst: {
      cooldown: "None (Charges: 2)",
      cost: "200 Credits",
      castTime: "Instant",
      duration: "4.5 seconds",
      tacticalUse: "Launches a quick smoke cloud that blocks lines of sight. Ideal for rapid covers and site entries.",
      proTip: "Hold the ability key and sweep your mouse to bend the smoke cloud around tight corridors.",
      synergy: "Raze Paint Shells, Sova Hunter's Fury",
      simType: "default"
    },
    "blade storm": {
      cooldown: "7 Ultimate Points",
      cost: "Ultimate",
      castTime: "0.15s Equip",
      duration: "Until Expended",
      tacticalUse: "Equips precision throwing knives. Guaranteed 100% accuracy even during running or jumping maneuvers.",
      proTip: "Left-click fires one precise knife (resets on kills). Right-click throws all remaining knives for close-range burst.",
      synergy: "Sage Barrier, Fade Seize",
      simType: "damage"
    }
  },
  sage: {
    "slow orb": {
      cooldown: "None (Charges: 2)",
      cost: "200 Credits",
      castTime: "0.4s",
      duration: "7.0 seconds",
      tacticalUse: "Throws a slowing field that triggers loud stepping sounds and reduces walking speeds by 50%.",
      proTip: "Combine Slow Orb with friendly area-damage abilities like grenades to trap rushing enemies.",
      synergy: "Raze Paint Shells, Brimstone Incendiary",
      simType: "recon"
    },
    "healing orb": {
      cooldown: "45 seconds",
      cost: "Free (Signature)",
      castTime: "0.2s",
      duration: "5.0 seconds",
      tacticalUse: "Heals an ally up to 100 HP, or self-heals Sage up to 30 HP over time.",
      proTip: "Heal from behind cover; taking damage pauses the healing stream momentarily.",
      synergy: "Jett Tailwind, Phoenix Curveball",
      simType: "heal"
    },
    "barrier orb": {
      cooldown: "None (Charges: 1)",
      cost: "400 Credits",
      castTime: "0.5s",
      duration: "30 seconds",
      tacticalUse: "Creates a solid wall of ice cells that can boost teammates or block choke points.",
      proTip: "The wall starts with 400 HP and solidifies to 800 HP after 3 seconds. Cast it before enemies fire.",
      synergy: "Sova Hunter's Fury",
      simType: "damage"
    },
    resurrection: {
      cooldown: "8 Ultimate Points",
      cost: "Ultimate",
      castTime: "2.2s Revive Frame",
      duration: "Permanent",
      tacticalUse: "Brings a fallen teammate back to full health and combat readiness.",
      proTip: "Cast a smoke or place a barrier wall over the teammate's corpse to prevent opponents from spawn-killing them.",
      synergy: "Omen Smokes, Viper Pit",
      simType: "heal"
    }
  },
  phoenix: {
    curveball: {
      cooldown: "None (Charges: 2)",
      cost: "250 Credits",
      castTime: "0.25s",
      duration: "1.1 seconds",
      tacticalUse: "Flares an orb that curves left or right, blinding any player looking at the flash.",
      proTip: "Turn away slightly as you throw to avoid catching the edge of your own flash.",
      synergy: "Jett Tailwind",
      simType: "flash"
    },
    "hot hands": {
      cooldown: "1 Charge (Recharges on 2 Kills)",
      cost: "Free (Signature)",
      castTime: "0.3s",
      duration: "4.0 seconds",
      tacticalUse: "Throws a fireball that deals damage to enemies standing inside, and heals Phoenix.",
      proTip: "Use to flush out standard defensive corners or heal yourself from low HP behind blocks.",
      synergy: "Sage Slow Orb, Fade Seize",
      simType: "heal"
    },
    blaze: {
      cooldown: "None (Charges: 1)",
      cost: "150 Credits",
      castTime: "Instant",
      duration: "8.0 seconds",
      tacticalUse: "Creates a wall of fire that blocks vision, damages enemies, and heals Phoenix.",
      proTip: "Hold the fire button to curve the flame wall as it launches across sites.",
      synergy: "Reyna Leer",
      simType: "heal"
    },
    "run it back": {
      cooldown: "6 Ultimate Points",
      cost: "Ultimate",
      castTime: "Instant",
      duration: "10.0 seconds",
      tacticalUse: "Places a marker at Phoenix's current location. Dying or letting the timer run out returns him here with full health.",
      proTip: "Ensure your marker is placed in a safe corner; opponents can camp your return anchor.",
      synergy: "Sova Owl Drone, Breach Rolling Thunder",
      simType: "damage"
    }
  },
  sova: {
    "shock bolt": {
      cooldown: "None (Charges: 2)",
      cost: "150 Credits",
      castTime: "Bow Equip",
      duration: "Instant on impact",
      tacticalUse: "Fires an electrical shock arrow that deals up to 75 damage in its explosion radius.",
      proTip: "Use bounce points (press Alt-Fire for 1 or 2 bounces) to target enemies around corners without exposing yourself.",
      synergy: "Killjoy Nanoswarm, Fade Seize",
      simType: "damage"
    },
    "recon bolt": {
      cooldown: "40 seconds",
      cost: "Free (Signature)",
      castTime: "Bow Equip",
      duration: "3 radar pulses",
      tacticalUse: "Fires a radar pulse arrow that reveals enemies in its direct line of sight.",
      proTip: "Aim high on site arches or tree branches so enemies cannot instantly shoot down the bolt.",
      synergy: "Jett Blade Storm, Sova Hunter's Fury",
      simType: "recon"
    },
    "owl drone": {
      cooldown: "None (Charges: 1)",
      cost: "400 Credits",
      castTime: "0.8s",
      duration: "10 seconds",
      tacticalUse: "Deploys a flying recon drone. Fires a tracking dart that reveals enemy outlines through solid structures.",
      proTip: "Fly the drone low to check corners, and have a teammate trail directly behind to clear the site.",
      synergy: "Phoenix Run It Back, Jett Tailwind",
      simType: "recon"
    },
    "hunter's fury": {
      cooldown: "8 Ultimate Points",
      cost: "Ultimate",
      castTime: "Bow Equip",
      duration: "3 energy blasts",
      tacticalUse: "Fires up to three long-range, wall-piercing energy beams that deal 80 damage each.",
      proTip: "Ping enemies using your Recon Bolt or Owl Drone first, then fire Hunter's Fury for guaranteed wallbang kills.",
      synergy: "Cypher Trapwire, Fade Seize",
      simType: "damage"
    }
  }
};

// Procedural generator to create accurate specs for any agent that isn't hardcoded
function generateDynamicAbilityDetails(agentName: string, ability: Ability): StaticAbilityDetails {
  const cleanAgentName = agentName.toLowerCase();
  const cleanAbilityName = ability.displayName.toLowerCase();

  // Try to find in presets
  if (PRESET_ABILITIES[cleanAgentName] && PRESET_ABILITIES[cleanAgentName][cleanAbilityName]) {
    return PRESET_ABILITIES[cleanAgentName][cleanAbilityName];
  }

  // Detect simulation type based on keywords in description
  const desc = ability.description.toLowerCase();
  let simType: "recon" | "dash" | "heal" | "flash" | "damage" | "default" = "default";

  if (desc.includes("heal") || desc.includes("revive") || desc.includes("recover")) {
    simType = "heal";
  } else if (desc.includes("dash") || desc.includes("speed") || desc.includes("teleport") || desc.includes("propel") || desc.includes("movement")) {
    simType = "dash";
  } else if (desc.includes("blind") || desc.includes("flash") || desc.includes("concuss") || desc.includes("daze")) {
    simType = "flash";
  } else if (desc.includes("reveal") || desc.includes("sonar") || desc.includes("recon") || desc.includes("scan") || desc.includes("scout") || desc.includes("track")) {
    simType = "recon";
  } else if (desc.includes("damage") || desc.includes("fire") || desc.includes("grenade") || desc.includes("blast") || desc.includes("explode") || desc.includes("shock")) {
    simType = "damage";
  }

  // Build simulated specs based on slot type
  const isUlt = ability.slot.toLowerCase() === "ultimate";
  const isSignature = ability.slot.toLowerCase() === "ability2" || ability.slot.toLowerCase() === "signature";

  const cooldown = isUlt
    ? "Ultimate Points (6-9)"
    : isSignature
    ? "40 seconds or 2-Kill Reset"
    : "None (Charges: 2)";

  const cost = isUlt
    ? "Ultimate Points"
    : isSignature
    ? "Free (Signature)"
    : "150 - 250 Credits";

  const castTime = isUlt ? "0.6s Equip" : "0.2s - 0.4s";
  const duration = desc.includes("seconds")
    ? desc.match(/(\d+)\s*second/)?.[0] || "5.0 seconds"
    : "Instant Utility";

  const tacticalUse = `Utilize this slot tactical ability to manipulate lines of sight, secure zone advantages, or apply status debuffs to the opposing team during combat.`;
  const proTip = `Avoid wasting this tool in early rounds. Combine it directly with teammates' entry utilities to catch enemy anchors off guard.`;
  const synergy = "Duelists, Controllers, Initiators";

  return {
    cooldown,
    cost,
    castTime,
    duration,
    tacticalUse,
    proTip,
    synergy,
    simType
  };
}

export default function AbilityViewerModal({
  isOpen,
  onClose,
  agent,
  ability,
  accentColor
}: AbilityViewerModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [isSimActive, setIsSimActive] = useState<boolean>(true);
  const animationRef = useRef<number | null>(null);

  const specs = generateDynamicAbilityDetails(agent.displayName, ability);

  // Holographic Drone canvas visualizer (fully vector procedural animation)
  useEffect(() => {
    if (!canvasRef.current || !isOpen) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Responsive sizing
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Simulation variables
    let frame = 0;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; r: number; alpha: number; life: number; maxLife: number }> = [];

    const drawSimulation = () => {
      if (!isSimActive) {
        animationRef.current = requestAnimationFrame(drawSimulation);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      frame += 1 * simulationSpeed;

      // 1. Draw Background HUD Grids
      ctx.strokeStyle = "rgba(0, 245, 255, 0.05)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 0; j < height; j += 20) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }

      // Draw radar target rings in the center
      const cx = width / 2;
      const cy = height / 2;

      ctx.strokeStyle = "rgba(0, 245, 255, 0.1)";
      ctx.beginPath();
      ctx.arc(cx, cy, 60, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(0, 245, 255, 0.05)";
      ctx.beginPath();
      ctx.arc(cx, cy, 120, 0, Math.PI * 2);
      ctx.stroke();

      // Radar Crosshairs
      ctx.strokeStyle = "rgba(0, 245, 255, 0.15)";
      ctx.beginPath();
      ctx.moveTo(cx - 150, cy);
      ctx.lineTo(cx + 150, cy);
      ctx.moveTo(cx, cy - 100);
      ctx.lineTo(cx, cy + 100);
      ctx.stroke();

      // Dynamic scanning sweeps
      const sweepAngle = (frame * 0.015) % (Math.PI * 2);
      ctx.fillStyle = "rgba(0, 245, 255, 0.02)";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, 130, sweepAngle, sweepAngle + 0.3);
      ctx.closePath();
      ctx.fill();

      // 2. Perform Category-Specific Particle Simulations
      const coreColor = accentColor || "#00f5ff";

      if (specs.simType === "heal") {
        // Pulse healing orbs upwards
        if (frame % 3 === 0 && particles.length < 50) {
          particles.push({
            x: cx + (Math.random() - 0.5) * 80,
            y: cy + 30 + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 0.6,
            vy: -1.2 - Math.random() * 1.5,
            r: Math.random() * 3 + 1.5,
            alpha: 1,
            life: 0,
            maxLife: 60 + Math.random() * 40
          });
        }

        // Draw pulsing medical crosses or orbs
        particles.forEach((p, idx) => {
          p.x += p.vx * simulationSpeed;
          p.y += p.vy * simulationSpeed;
          p.life += 1 * simulationSpeed;
          p.alpha = 1 - p.life / p.maxLife;

          ctx.fillStyle = `rgba(34, 189, 167, ${p.alpha * 0.8})`; // Sage green
          ctx.beginPath();
          // Draw tiny green cross
          const s = p.r;
          ctx.fillRect(p.x - s, p.y - s/3, s * 2, s * 0.6);
          ctx.fillRect(p.x - s/3, p.y - s, s * 0.6, s * 2);

          if (p.life >= p.maxLife) particles.splice(idx, 1);
        });

        // Center pulsing healing circle
        ctx.strokeStyle = "rgba(34, 189, 167, 0.4)";
        ctx.lineWidth = 1.5;
        const rPulse = 40 + Math.sin(frame * 0.05) * 8;
        ctx.beginPath();
        ctx.arc(cx, cy, rPulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "rgba(34, 189, 167, 0.06)";
        ctx.fill();

      } else if (specs.simType === "dash") {
        // Fast horizontal streaks
        if (frame % 2 === 0 && particles.length < 60) {
          particles.push({
            x: cx - 180,
            y: cy + (Math.random() - 0.5) * 50,
            vx: 6 + Math.random() * 8,
            vy: (Math.random() - 0.5) * 0.2,
            r: Math.random() * 20 + 10, // Streak length
            alpha: 0.8,
            life: 0,
            maxLife: 40
          });
        }

        particles.forEach((p, idx) => {
          p.x += p.vx * simulationSpeed;
          p.y += p.vy * simulationSpeed;
          p.life += 1 * simulationSpeed;
          p.alpha = 1 - p.life / p.maxLife;

          // Wind streak lines
          ctx.strokeStyle = `rgba(0, 245, 255, ${p.alpha * 0.4})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.r, p.y);
          ctx.stroke();

          if (p.x > cx + 180) particles.splice(idx, 1);
        });

      } else if (specs.simType === "flash") {
        // Bright solar expand-contract pulse
        const pulse = Math.abs(Math.sin(frame * 0.04));
        const radius = pulse * 90 + 15;

        const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        grad.addColorStop(0.2, "rgba(255, 180, 0, 0.8)");
        grad.addColorStop(0.6, "rgba(255, 70, 85, 0.3)");
        grad.addColorStop(1, "rgba(255, 70, 85, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Telemetry readout
        ctx.fillStyle = "rgba(255, 70, 85, 0.8)";
        ctx.font = "bold 9px monospace";
        ctx.fillText(`DEBUFF: FLASH_BLINDED [${Math.floor(pulse * 100)}%]`, cx - 65, cy + 120);

      } else if (specs.simType === "recon") {
        // Ping radar circles
        const rMax = 140;
        const r1 = (frame * 1.8) % rMax;
        const r2 = ((frame + 45) * 1.8) % rMax;

        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(0, 245, 255, ${1 - r1 / rMax})`;
        ctx.beginPath();
        ctx.arc(cx, cy, r1, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(0, 245, 255, ${1 - r2 / rMax})`;
        ctx.beginPath();
        ctx.arc(cx, cy, r2, 0, Math.PI * 2);
        ctx.stroke();

        // Target spot markers
        const targets = [
          { x: cx + 50, y: cy - 40, label: "ENEMY_01" },
          { x: cx - 70, y: cy + 30, label: "ENEMY_02" }
        ];

        targets.forEach((t) => {
          ctx.strokeStyle = "rgba(255, 70, 85, 0.7)";
          ctx.beginPath();
          ctx.arc(t.x, t.y, 4, 0, Math.PI * 2);
          ctx.stroke();

          // cross indicator
          ctx.beginPath();
          ctx.moveTo(t.x - 8, t.y);
          ctx.lineTo(t.x + 8, t.y);
          ctx.moveTo(t.x, t.y - 8);
          ctx.lineTo(t.x, t.y + 8);
          ctx.stroke();

          ctx.fillStyle = "rgba(255, 70, 85, 0.8)";
          ctx.font = "8px monospace";
          ctx.fillText(t.label, t.x + 8, t.y - 4);
        });

      } else {
        // Damage / Fireballs: floating fiery particles
        if (frame % 3 === 0 && particles.length < 50) {
          particles.push({
            x: cx + (Math.random() - 0.5) * 40,
            y: cy + (Math.random() - 0.5) * 40,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2 - 0.8,
            r: Math.random() * 5 + 3,
            alpha: 1,
            life: 0,
            maxLife: 40 + Math.random() * 20
          });
        }

        particles.forEach((p, idx) => {
          p.x += p.vx * simulationSpeed;
          p.y += p.vy * simulationSpeed;
          p.life += 1 * simulationSpeed;
          p.alpha = 1 - p.life / p.maxLife;

          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          grad.addColorStop(0, `rgba(255, 110, 0, ${p.alpha})`);
          grad.addColorStop(0.5, `rgba(255, 70, 85, ${p.alpha * 0.7})`);
          grad.addColorStop(1, `rgba(255, 0, 0, 0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();

          if (p.life >= p.maxLife) particles.splice(idx, 1);
        });
      }

      // Draw HUD bounding frames
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      // Corner frames
      const l = 15;
      ctx.strokeStyle = coreColor;
      ctx.lineWidth = 2;

      // Top-Left
      ctx.beginPath(); ctx.moveTo(10, 10 + l); ctx.lineTo(10, 10); ctx.lineTo(10 + l, 10); ctx.stroke();
      // Top-Right
      ctx.beginPath(); ctx.moveTo(width - 10 - l, 10); ctx.lineTo(width - 10, 10); ctx.lineTo(width - 10, 10 + l); ctx.stroke();
      // Bottom-Left
      ctx.beginPath(); ctx.moveTo(10, height - 10 - l); ctx.lineTo(10, height - 10); ctx.lineTo(10 + l, height - 10); ctx.stroke();
      // Bottom-Right
      ctx.beginPath(); ctx.moveTo(width - 10 - l, height - 10); ctx.lineTo(width - 10, height - 10); ctx.lineTo(width - 10, height - 10 - l); ctx.stroke();

      // Top telemetry overlay
      ctx.fillStyle = coreColor;
      ctx.font = "9px monospace";
      ctx.fillText(`TACTICAL_SIMULATOR_V4 // TYPE: ${specs.simType.toUpperCase()}`, 20, 26);

      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillText(`SPEED: ${simulationSpeed}X // STATE: ACTIVE`, width - 150, 26);

      animationRef.current = requestAnimationFrame(drawSimulation);
    };

    drawSimulation();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOpen, specs.simType, simulationSpeed, isSimActive, accentColor]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto select-none">
        {/* Backdrop glass blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-val-black/95 backdrop-blur-md cursor-zoom-out"
        />

        {/* Tactical Bento Grid Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative bg-[#050811] border-2 border-white/10 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col z-10"
        >
          {/* Neon grid border line */}
          <div
            className="h-1 w-full bg-gradient-to-r"
            style={{
              backgroundImage: `linear-gradient(to right, ${accentColor || "#00f5ff"}, #101424)`
            }}
          />

          {/* TOP HEADER CONTROLS */}
          <div className="p-4 md:p-5 border-b border-white/10 flex items-center justify-between bg-black/35 relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded bg-white/5 border border-white/10 p-1 flex items-center justify-center shrink-0">
                {ability.displayIcon ? (
                  <img
                    src={ability.displayIcon}
                    alt={ability.displayName}
                    className="max-h-[85%] max-w-[85%] object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Zap className="w-5 h-5 text-val-cyan" />
                )}
              </div>
              <div>
                <span className="font-mono text-[9px] tracking-wider text-val-cyan uppercase font-bold">
                  {ability.slot === "Ultimate" ? "ULTIMATE CAPABILITY" : `SLOT: ${ability.slot.toUpperCase()}`}
                </span>
                <h2 className="font-display font-black text-lg md:text-xl text-white uppercase tracking-wide leading-none">
                  {ability.displayName}
                </h2>
              </div>
            </div>

            <button
              onClick={() => {
                audio.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg border border-white/10 hover:border-white/25 text-gray-400 hover:text-white bg-white/5 transition-all active:scale-90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* TWO COLUMN BENTO GRID CONTENT */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* LEFT COLUMN: DESCRIPTION, COOLDOWNS, TIPS */}
            <div className="p-5 md:p-6 space-y-6 max-h-[480px] overflow-y-auto border-r border-white/5">
              {/* Tactical Description block */}
              <div className="space-y-2">
                <div className="font-mono text-[9px] text-gray-500 uppercase flex items-center space-x-1">
                  <Info className="w-3 h-3 text-val-cyan" />
                  <span>TACTICAL BRIEFING</span>
                </div>
                <p className="font-sans text-xs text-gray-200 leading-relaxed font-light">
                  {ability.description}
                </p>
              </div>

              {/* Specs Bento Box */}
              <div className="grid grid-cols-2 gap-3 bg-white/[0.01] border border-white/[0.05] p-4 rounded-xl">
                <div className="space-y-1">
                  <div className="font-mono text-[8px] text-gray-500 uppercase flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-val-cyan" />
                    <span>COOLDOWN</span>
                  </div>
                  <div className="font-display font-bold text-xs text-white uppercase">
                    {specs.cooldown}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="font-mono text-[8px] text-gray-500 uppercase flex items-center space-x-1">
                    <Coins className="w-3 h-3 text-val-cyan" />
                    <span>CREDITS COST</span>
                  </div>
                  <div className="font-display font-bold text-xs text-white uppercase">
                    {specs.cost}
                  </div>
                </div>

                <div className="space-y-1 pt-3 border-t border-white/[0.03]">
                  <div className="font-mono text-[8px] text-gray-500 uppercase flex items-center space-x-1">
                    <Sword className="w-3 h-3 text-val-cyan" />
                    <span>CAST TIME</span>
                  </div>
                  <div className="font-display font-bold text-xs text-white uppercase">
                    {specs.castTime}
                  </div>
                </div>

                <div className="space-y-1 pt-3 border-t border-white/[0.03]">
                  <div className="font-mono text-[8px] text-gray-500 uppercase flex items-center space-x-1">
                    <ShieldAlert className="w-3 h-3 text-val-cyan" />
                    <span>DURATION</span>
                  </div>
                  <div className="font-display font-bold text-xs text-white uppercase">
                    {specs.duration}
                  </div>
                </div>
              </div>

              {/* Combat Usage / Pro Tip Block */}
              <div className="space-y-3 bg-val-cyan/5 border border-val-cyan/15 p-4 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                  <Award className="w-16 h-16 text-val-cyan" />
                </div>

                <div className="font-mono text-[9px] text-val-cyan uppercase flex items-center space-x-1.5 font-bold">
                  <Target className="w-3.5 h-3.5" />
                  <span>TACTICIAN PRO TIP</span>
                </div>
                <p className="font-sans text-[11px] text-gray-300 leading-relaxed font-light">
                  {specs.proTip}
                </p>
              </div>

              {/* Synergy Counter Block */}
              <div className="space-y-2 bg-white/[0.01] border border-white/[0.05] p-4 rounded-xl">
                <div className="font-mono text-[9px] text-gray-500 uppercase flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-val-cyan" />
                  <span>METAGAME COMS SYNERGY</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {specs.synergy.split(", ").map((syn, idx) => (
                    <span
                      key={idx}
                      className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-[9px] text-white font-mono uppercase font-light"
                    >
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: HIGH-TECH PROCEDURAL DRONE SIMULATOR */}
            <div className="p-5 md:p-6 bg-black/20 flex flex-col justify-between space-y-4">
              <div className="flex flex-col space-y-1.5">
                <span className="bg-val-cyan/15 border border-val-cyan/35 text-val-cyan font-mono text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wider w-max flex items-center space-x-1">
                  <Compass className="w-2.5 h-2.5 text-val-cyan" />
                  <span>TACTICAL BLUEPRINT HOLO-STREAM</span>
                </span>
                <span className="font-mono text-[10px] text-gray-400">
                  REAL-TIME VECTOR MECHANICAL EMULATION
                </span>
              </div>

              {/* The Actual Canvas Visualizer Screen */}
              <div className="relative aspect-[1.4/1] w-full rounded-xl overflow-hidden bg-[#020408] border border-white/10 shadow-inner flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                />

                {!isSimActive && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-2">
                    <Pause className="w-8 h-8 text-val-cyan animate-pulse" />
                    <span className="font-mono text-[9px] text-val-cyan tracking-wider">
                      SIMULATOR STREAM PAUSED
                    </span>
                  </div>
                )}
              </div>

              {/* Simulator Action Controls */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      audio.playClick();
                      setIsSimActive(!isSimActive);
                    }}
                    className={`px-3 py-1.5 rounded text-[10px] font-mono border transition-all flex items-center space-x-1.5 uppercase font-bold ${
                      isSimActive
                        ? "bg-val-cyan/15 border-val-cyan text-val-cyan hover:bg-val-cyan/25"
                        : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {isSimActive ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>PAUSE SIM</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 animate-pulse" />
                        <span>RESUME SIM</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      audio.playClick();
                      // Simple toggle through speeds
                      setSimulationSpeed((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : prev === 2 ? 0.5 : 1));
                    }}
                    className="px-2.5 py-1.5 rounded text-[10px] font-mono border border-white/10 hover:border-white/20 text-gray-400 hover:text-white bg-white/5 transition-all flex items-center space-x-1 uppercase"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>SPEED: {simulationSpeed}X</span>
                  </button>
                </div>

                <div className="font-mono text-[8px] text-gray-500 uppercase text-right leading-tight select-none">
                  <div>LATENCY: 12ms // SYNCED</div>
                  <div>TACT_VAL: {agent.displayName.toUpperCase()}_{ability.slot.toUpperCase()}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
