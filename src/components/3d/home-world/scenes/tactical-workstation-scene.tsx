"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { HomeWorldCategory } from "../home-world.config";

interface TacticalWorkstationSceneProps {
  activeCategory?: HomeWorldCategory;
  prefersReducedMotion?: boolean;
}

export function TacticalWorkstationSceneObjects({
  activeCategory = "idle",
  prefersReducedMotion = false,
}: TacticalWorkstationSceneProps) {
  const sceneGroupRef     = useRef<THREE.Group>(null);
  const workstationRef    = useRef<THREE.Group>(null);
  const weaponGroupRef    = useRef<THREE.Group>(null);
  const scanPlaneRef      = useRef<THREE.Mesh>(null);
  const coreChamberRef    = useRef<THREE.Mesh>(null);
  const reticleRingRef    = useRef<THREE.Group>(null);
  const telemetryDataRef  = useRef<THREE.Group>(null);
  const gridPlateRef      = useRef<THREE.Mesh>(null);

  // Dynamic tactical accent color based on user category hover/focus
  const targetAccentColor = useMemo(() => {
    switch (activeCategory) {
      case "agents":  return new THREE.Color("#FF4655");
      case "weapons": return new THREE.Color("#F59E0B");
      case "maps":    return new THREE.Color("#7DD3FC");
      case "skins":   return new THREE.Color("#EAB308");
      default:        return new THREE.Color("#FF4655");
    }
  }, [activeCategory]);

  const currentAccent = useRef(new THREE.Color("#FF4655"));

  // ── Palette Tokens (from specification) ──
  // Primary background: #07090D, Surface: #0D1118, Secondary: #151A22
  // Accent Red: #FF4655, Diagnostic Cyan: #7DD3FC, Text: #F5F5F5, Muted: #7C8491
  const C = {
    bg:          "#07090D",
    surface:     "#0D1118",
    surfaceDark: "#090C11",
    metalMatte:  "#151A22",
    metalBevel:  "#1E2633",
    glass:       "#0D131C",
    redAccent:   "#FF4655",
    cyanAccent:  "#7DD3FC",
    gridLine:    "#1A2332",
    textWhite:   "#F5F5F5",
  };

  // ── Memoized Materials ──
  const tableBaseMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: C.surface,
    roughness: 0.88,
    metalness: 0.35,
  }), []);

  const tableBevelMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: C.metalMatte,
    roughness: 0.65,
    metalness: 0.6,
  }), []);

  const holographicGlassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: C.glass,
    transparent: true,
    opacity: 0.75,
    roughness: 0.15,
    metalness: 0.85,
    transmission: 0.6,
    thickness: 0.5,
  }), []);

  const weaponGunmetalMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#181D26",
    roughness: 0.32,
    metalness: 0.82,
  }), []);

  const weaponAccentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#252E3D",
    roughness: 0.45,
    metalness: 0.7,
  }), []);

  const wireframeMat = useMemo(() => new THREE.LineBasicMaterial({
    color: C.redAccent,
    transparent: true,
    opacity: 0.7,
  }), []);

  const chamberGlowMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: C.redAccent,
    emissive: C.redAccent,
    emissiveIntensity: 2.2,
    metalness: 0.1,
    roughness: 0.2,
  }), []);

  const scanBeamMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: C.redAccent,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
    depthWrite: false,
  }), []);

  const gridLineMat = useMemo(() => new THREE.LineBasicMaterial({
    color: C.gridLine,
    transparent: true,
    opacity: 0.4,
  }), []);

  const cyanSeamMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: C.cyanAccent,
    transparent: true,
    opacity: 0.6,
  }), []);

  const redSeamMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: C.redAccent,
    transparent: true,
    opacity: 0.75,
  }), []);

  // ── Procedural Data Hologram Textures (Agents, Weapons, Skins, Maps, Bundles) ──
  const { dataTexture1, dataTexture2 } = useMemo(() => {
    const createDataCanvas = (lines: string[], accent: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "rgba(7, 9, 13, 0.88)";
        ctx.fillRect(0, 0, 512, 256);

        // Thin technical border
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 2;
        ctx.strokeRect(4, 4, 504, 248);

        // Corner tick marks
        ctx.fillStyle = accent;
        ctx.fillRect(4, 4, 16, 3);
        ctx.fillRect(4, 4, 3, 16);
        ctx.fillRect(492, 4, 16, 3);
        ctx.fillRect(505, 4, 3, 16);

        // Typography
        ctx.font = "bold 20px monospace";
        ctx.fillStyle = accent;
        ctx.fillText(lines[0] || "", 24, 42);

        ctx.font = "14px monospace";
        ctx.fillStyle = "rgba(245, 245, 245, 0.75)";
        lines.slice(1).forEach((line, idx) => {
          ctx.fillText(line, 24, 78 + idx * 30);
        });
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    };

    if (typeof document === "undefined") {
      return { dataTexture1: null, dataTexture2: null };
    }

    const t1 = createDataCanvas([
      "TACTICAL ARMORY // VANDAL",
      "SYS.ID: RIFLE-07A // CALIBER: 7.62mm",
      "FIRE RATE: 9.75 rds/s  (SINGLE-TAP OPT)",
      "BALLISTICS: 160 HEAD // 40 BODY // 34 LEG",
      "STATUS: TOURNAMENT STANDARD // ACTIVE",
    ], C.redAccent);

    const t2 = createDataCanvas([
      "VLOPEDIA DATABASE TELEMETRY",
      "OPERATIVES: 29 CATALOGED (PATCH 13.06)",
      "ARSENAL: 21 WEAPONS // 1,400+ SKINS",
      "MAP POOL: 18 SECTORS (7 COMPETITIVE)",
      "DATABASE READY // CTR-K COMMAND PALETTE",
    ], C.cyanAccent);

    return { dataTexture1: t1, dataTexture2: t2 };
  }, []);

  // ── 3D Weapon Model (Stylized VALORANT Vandal / Tactical Rifle Silhouette) ──
  const weaponMeshes = useMemo(() => {
    return (
      <group position={[0, 0, 0]} rotation={[0.08, -0.4, 0.05]}>
        {/* Main Upper Receiver */}
        <mesh position={[0, 0.12, 0]} material={weaponGunmetalMat} castShadow>
          <boxGeometry args={[1.5, 0.18, 0.1]} />
        </mesh>

        {/* Lower Receiver & Trigger Guard */}
        <mesh position={[-0.15, -0.04, 0]} material={weaponAccentMat}>
          <boxGeometry args={[0.9, 0.14, 0.09]} />
        </mesh>

        {/* Tactical Ergonomic Handguard */}
        <mesh position={[0.75, 0.11, 0]} material={weaponAccentMat}>
          <boxGeometry args={[0.85, 0.15, 0.09]} />
        </mesh>

        {/* Precision Fluted Barrel */}
        <mesh position={[1.45, 0.13, 0]} rotation={[0, 0, Math.PI / 2]} material={weaponGunmetalMat}>
          <cylinderGeometry args={[0.024, 0.028, 0.7, 16]} />
        </mesh>

        {/* Crown Muzzle Brake / Compensator */}
        <mesh position={[1.82, 0.13, 0]} rotation={[0, 0, Math.PI / 2]} material={weaponAccentMat}>
          <cylinderGeometry args={[0.038, 0.034, 0.12, 12]} />
        </mesh>

        {/* Curved Banana Magazine (Angled forward) */}
        <mesh position={[0.1, -0.22, 0]} rotation={[0, 0, 0.22]} material={weaponGunmetalMat}>
          <boxGeometry args={[0.18, 0.38, 0.08]} />
        </mesh>

        {/* Pistol Grip */}
        <mesh position={[-0.38, -0.18, 0]} rotation={[0, 0, -0.35]} material={weaponAccentMat}>
          <boxGeometry args={[0.12, 0.28, 0.08]} />
        </mesh>

        {/* Angular Lightweight Tactical Stock */}
        <mesh position={[-0.95, 0.08, 0]} material={weaponAccentMat}>
          <boxGeometry args={[0.55, 0.16, 0.07]} />
        </mesh>
        <mesh position={[-1.25, 0.02, 0]} material={weaponGunmetalMat}>
          <boxGeometry args={[0.1, 0.28, 0.08]} />
        </mesh>

        {/* Picatinny Top Optics Rail */}
        <mesh position={[0.05, 0.23, 0]} material={weaponAccentMat}>
          <boxGeometry args={[1.2, 0.035, 0.07]} />
        </mesh>

        {/* Holographic Reflex Sight */}
        <mesh position={[0.1, 0.31, 0]} material={weaponGunmetalMat}>
          <boxGeometry args={[0.26, 0.12, 0.08]} />
        </mesh>
        {/* Sight Optical Reticle Glass */}
        <mesh position={[0.1, 0.32, 0]}>
          <boxGeometry args={[0.015, 0.08, 0.06]} />
          <meshBasicMaterial color={C.redAccent} transparent opacity={0.65} />
        </mesh>

        {/* Luminous Radianite Chamber Core (Visible in ejection port) */}
        <mesh ref={coreChamberRef} position={[0.02, 0.13, 0.052]}>
          <boxGeometry args={[0.18, 0.07, 0.02]} />
          <primitive object={chamberGlowMat} />
        </mesh>

        {/* Dynamic Radianite Core Light Emission */}
        <pointLight color={C.redAccent} intensity={1.6} distance={2.4} position={[0.02, 0.13, 0.2]} />
      </group>
    );
  }, [weaponGunmetalMat, weaponAccentMat, chamberGlowMat, C.redAccent]);

  // ── Workstation Grid Floor Plane Lines ──
  const floorGridPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const size = 14;
    const step = 0.8;
    for (let i = -size; i <= size; i += step) {
      points.push(new THREE.Vector3(-size, 0, i));
      points.push(new THREE.Vector3(size, 0, i));
      points.push(new THREE.Vector3(i, 0, -size));
      points.push(new THREE.Vector3(i, 0, size));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  // ── Concentric Inspection Target Reticle Rings ──
  const targetRings = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const count = 64;
    const radius = 1.35;
    for (let i = 0; i <= count; i++) {
      const th = (i / count) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(th) * radius, 0, Math.sin(th) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  // ── Animation Loop ──
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Lerp accent color smoothly
    currentAccent.current.lerp(targetAccentColor, Math.min(1, delta * 3.5));
    chamberGlowMat.color.copy(currentAccent.current);
    chamberGlowMat.emissive.copy(currentAccent.current);
    wireframeMat.color.copy(currentAccent.current);
    scanBeamMat.color.copy(currentAccent.current);

    if (prefersReducedMotion) return;

    // 1. Subtle, slow floating inspection of weapon (Calm & Expensive, NOT spinning!)
    if (weaponGroupRef.current) {
      weaponGroupRef.current.position.y = 0.65 + Math.sin(t * 0.9) * 0.025;
      weaponGroupRef.current.rotation.y = -0.32 + Math.sin(t * 0.35) * 0.04;
      weaponGroupRef.current.rotation.z = 0.04 + Math.cos(t * 0.45) * 0.015;
    }

    // 2. Holographic Scanning Laser traversing the weapon horizontally
    if (scanPlaneRef.current) {
      // Oscillate between x = -1.2 and x = 1.8
      const scanX = Math.sin(t * 1.1) * 1.5 + 0.3;
      scanPlaneRef.current.position.x = scanX;
      scanBeamMat.opacity = 0.15 + Math.sin(t * 2.2) * 0.08;
    }

    // 3. Chamber Radianite breathing pulse
    if (coreChamberRef.current) {
      const pulse = 1.8 + Math.sin(t * 2.0) * 0.4;
      chamberGlowMat.emissiveIntensity = pulse;
    }

    // 4. Reticle ring subtle counter rotation
    if (reticleRingRef.current) {
      reticleRingRef.current.rotation.y = t * 0.12;
    }

    // 5. Floating data panels gentle floating drift
    if (telemetryDataRef.current) {
      telemetryDataRef.current.position.y = Math.sin(t * 0.7) * 0.015;
    }
  });

  return (
    <group ref={sceneGroupRef}>
      {/* ── ATMOSPHERIC DEPTH: Deep Void Fog (#07090D) ── */}
      <fogExp2 attach="fog" args={[C.bg, 0.038]} />

      {/* ══════════════════════════════════════════════════════════
          LAYER 1: DISTANT ARCHITECTURAL BUNKER FRAMEWORK
          (Clean, minimalist silhouettes receding into deep fog)
      ══════════════════════════════════════════════════════════ */}
      <group position={[0, 3.2, -12]}>
        {/* Overhead Gantry Rail */}
        <mesh position={[0, 4.0, 0]} material={tableBevelMat}>
          <boxGeometry args={[34, 0.28, 0.5]} />
        </mesh>
        {/* Structural Support Struts */}
        {[-9, -5, 5, 9].map((x) => (
          <mesh key={x} position={[x, 0, 0]} material={tableBevelMat}>
            <boxGeometry args={[0.3, 10, 0.3]} />
          </mesh>
        ))}
        {/* Subtle Status Light Bars */}
        <mesh position={[-9, 3.2, 0.2]}>
          <boxGeometry args={[0.04, 0.4, 0.04]} />
          <primitive object={redSeamMat} />
        </mesh>
        <mesh position={[9, 3.2, 0.2]}>
          <boxGeometry args={[0.04, 0.4, 0.04]} />
          <primitive object={cyanSeamMat} />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════════
          LAYER 2: TACTICAL COMMAND DECK FLOOR & GRID
          (Sits low at y = -1.35, keeping center completely clear)
      ══════════════════════════════════════════════════════════ */}
      <group position={[0, -1.35, 0]}>
        {/* Dark Ground Base */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={tableBaseMat}>
          <planeGeometry args={[36, 28]} />
        </mesh>

        {/* Razor-thin Vector Floor Grid */}
        <lineSegments position={[0, 0.002, 0]} geometry={floorGridPoints} material={gridLineMat} />
      </group>

      {/* ══════════════════════════════════════════════════════════
          LAYER 3: THE FUTURISTIC TACTICAL WORKSTATION / DATABASE TABLE
          (Positioned on the RIGHT/CENTER-RIGHT: x = 2.4, y = -0.5, z = -0.2.
           Leaves the left and dead-center OPEN for VloPedia UI and Search!)
      ══════════════════════════════════════════════════════════ */}
      <group ref={workstationRef} position={[2.2, -0.65, -0.4]}>
        {/* Main Workstation Console Pedestal / Plinth */}
        <mesh position={[0, 0.1, 0]} material={tableBaseMat} receiveShadow castShadow>
          <boxGeometry args={[3.8, 0.45, 2.6]} />
        </mesh>

        {/* Bevelled Tactical Chamfer Perimeter Rim */}
        <mesh position={[0, 0.34, 0]} material={tableBevelMat}>
          <boxGeometry args={[3.95, 0.05, 2.75]} />
        </mesh>

        {/* Recessed Diagnostic Seams (Red and Cyan hairline lights) */}
        <mesh position={[0, 0.37, 1.34]}>
          <boxGeometry args={[3.4, 0.015, 0.02]} />
          <primitive object={redSeamMat} />
        </mesh>
        <mesh position={[0, 0.37, -1.34]}>
          <boxGeometry args={[3.4, 0.015, 0.02]} />
          <primitive object={cyanSeamMat} />
        </mesh>

        {/* Holographic Projection Surface Plate (Glass surface) */}
        <mesh position={[0, 0.375, 0]} rotation={[-Math.PI / 2, 0, 0]} material={holographicGlassMat}>
          <planeGeometry args={[3.5, 2.3]} />
        </mesh>

        {/* Concentric Inspection Reticle on Table Surface */}
        <group ref={reticleRingRef} position={[0, 0.385, 0]}>
          <lineLoop geometry={targetRings} material={wireframeMat} />
        </group>

        {/* ── Holographic Vertical Scanning Plane ── */}
        <mesh ref={scanPlaneRef} position={[0, 0.72, 0]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.02, 1.1]} />
          <primitive object={scanBeamMat} />
        </mesh>

        {/* ── Centerpiece Object: Stylized VALORANT Weapon Silhouette ── */}
        <group ref={weaponGroupRef}>
          {weaponMeshes}
        </group>

        {/* ── Floating Holographic Data Panels (Tactical Telemetry) ── */}
        <group ref={telemetryDataRef}>
          {/* Panel 1: Weapon Schematics & Ballistics (Floating above left of weapon) */}
          {dataTexture1 && (
            <mesh position={[-1.25, 1.25, 0.35]} rotation={[0, 0.18, 0]}>
              <planeGeometry args={[1.5, 0.75]} />
              <meshBasicMaterial map={dataTexture1} transparent opacity={0.88} side={THREE.DoubleSide} />
            </mesh>
          )}

          {/* Panel 2: Database Status & Category Metrics (Floating to the right) */}
          {dataTexture2 && (
            <mesh position={[1.35, 1.15, -0.2]} rotation={[0, -0.22, 0]}>
              <planeGeometry args={[1.4, 0.7]} />
              <meshBasicMaterial map={dataTexture2} transparent opacity={0.88} side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>
      </group>
    </group>
  );
}

export default TacticalWorkstationSceneObjects;
