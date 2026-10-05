"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { HomeWorldCategory } from "../home-world.config";

interface TacticalDeckSceneObjectsProps {
  activeCategory?: HomeWorldCategory;
  prefersReducedMotion?: boolean;
}

export function TacticalDeckSceneObjects({
  activeCategory = "idle",
  prefersReducedMotion = false,
}: TacticalDeckSceneObjectsProps) {
  const sceneGroupRef     = useRef<THREE.Group>(null);
  const coreGroupRef      = useRef<THREE.Group>(null);
  const ring1Ref          = useRef<THREE.Group>(null);
  const ring2Ref          = useRef<THREE.Group>(null);
  const ring3Ref          = useRef<THREE.Group>(null);
  const crystalRef        = useRef<THREE.Mesh>(null);
  const coreLightRef      = useRef<THREE.PointLight>(null);
  const radarSweepRef     = useRef<THREE.Group>(null);
  const radarWaveRef      = useRef<THREE.Mesh>(null);
  const particlesRef      = useRef<THREE.Points>(null);

  // Dynamic tactical accent color driven by user category focus
  const targetAccentColor = useMemo(() => {
    switch (activeCategory) {
      case "agents":  return new THREE.Color("#FF4655");
      case "weapons": return new THREE.Color("#F59E0B");
      case "maps":    return new THREE.Color("#00E5FF");
      case "skins":   return new THREE.Color("#EAB308");
      default:        return new THREE.Color("#FF4655");
    }
  }, [activeCategory]);

  const currentAccent = useRef(new THREE.Color("#FF4655"));

  // ── Memoized Materials (High-end matte tactical metal & emissive holographics) ──
  const floorGridMat = useMemo(() => new THREE.LineBasicMaterial({
    color: "#1E293B",
    transparent: true,
    opacity: 0.35,
  }), []);

  const floorBaseMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#07090E",
    roughness: 0.85,
    metalness: 0.35,
  }), []);

  const emitterBaseMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#11151F",
    roughness: 0.45,
    metalness: 0.85,
  }), []);

  const emitterGlowRingMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#FF4655",
    transparent: true,
    opacity: 0.75,
  }), []);

  const beamMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: "#FF4655",
    transparent: true,
    opacity: 0.08,
    side: THREE.DoubleSide,
    depthWrite: false,
  }), []);

  const holoRingMat1 = useMemo(() => new THREE.LineBasicMaterial({
    color: "#FF4655",
    transparent: true,
    opacity: 0.65,
  }), []);

  const holoRingMat2 = useMemo(() => new THREE.LineBasicMaterial({
    color: "#00E5FF",
    transparent: true,
    opacity: 0.45,
  }), []);

  const holoRingMat3 = useMemo(() => new THREE.LineBasicMaterial({
    color: "#94A3B8",
    transparent: true,
    opacity: 0.3,
  }), []);

  const crystalMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#FF4655",
    emissive: "#FF4655",
    emissiveIntensity: 1.8,
    metalness: 0.2,
    roughness: 0.15,
  }), []);

  const trussMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0A0D13",
    roughness: 0.92,
    metalness: 0.5,
  }), []);

  // ── Geometries ──
  // Grid lines across the tactical floor
  const floorGridLines = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const size = 16;
    const step = 1.0;
    for (let i = -size; i <= size; i += step) {
      // Horizontal lines (Z-direction)
      points.push(new THREE.Vector3(-size, 0, i));
      points.push(new THREE.Vector3(size, 0, i));
      // Vertical lines (X-direction)
      points.push(new THREE.Vector3(i, 0, -size));
      points.push(new THREE.Vector3(i, 0, size));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, []);

  // Concentric radar sweep floor rings
  const radarRingGeo = useMemo(() => new THREE.RingGeometry(2.4, 2.42, 64), []);
  const radarWaveGeo = useMemo(() => new THREE.RingGeometry(0.1, 4.8, 64), []);

  // Holographic rings (Astrolabe / Gyroscope telemetry)
  const ringGeo1 = useMemo(() => {
    const circlePoints: THREE.Vector3[] = [];
    const segments = 64;
    const r = 0.85;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      circlePoints.push(new THREE.Vector3(Math.cos(theta) * r, Math.sin(theta) * r, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(circlePoints);
  }, []);

  const ringGeo2 = useMemo(() => {
    const circlePoints: THREE.Vector3[] = [];
    const segments = 48;
    const r = 1.05;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      circlePoints.push(new THREE.Vector3(Math.cos(theta) * r, Math.sin(theta) * r, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(circlePoints);
  }, []);

  const ringGeo3 = useMemo(() => {
    const circlePoints: THREE.Vector3[] = [];
    const segments = 36;
    const r = 0.65;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      circlePoints.push(new THREE.Vector3(Math.cos(theta) * r, Math.sin(theta) * r, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(circlePoints);
  }, []);

  // Radianite Core Crystal
  const crystalGeo = useMemo(() => new THREE.OctahedronGeometry(0.26, 0), []);

  // Projection light cone
  const coneGeo = useMemo(() => new THREE.CylinderGeometry(0.65, 0.28, 1.8, 24, 1, true), []);

  // Holographic floating data particles around the Core
  const { particlePositions, particlePhases } = useMemo(() => {
    const count = 32;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
      const radius = 0.45 + Math.random() * 0.65;
      positions[i3]     = Math.cos(angle) * radius;
      positions[i3 + 1] = (Math.random() - 0.5) * 0.9;
      positions[i3 + 2] = Math.sin(angle) * radius;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { particlePositions: positions, particlePhases: phases };
  }, []);

  // ── Frame Animation Loop ──
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Smooth color lerping to active category
    currentAccent.current.lerp(targetAccentColor, Math.min(1, delta * 3.5));

    // Update holographic colors
    crystalMat.color.copy(currentAccent.current);
    crystalMat.emissive.copy(currentAccent.current);
    holoRingMat1.color.copy(currentAccent.current);
    emitterGlowRingMat.color.copy(currentAccent.current);
    beamMat.color.copy(currentAccent.current);
    if (coreLightRef.current) {
      coreLightRef.current.color.copy(currentAccent.current);
    }

    if (prefersReducedMotion) return;

    // Floor Radar Scanning Sweep (Slow, purposeful rotation)
    if (radarSweepRef.current) {
      radarSweepRef.current.rotation.y = -t * 0.32;
    }

    // Floor Radar Expanding Pulse Wave
    if (radarWaveRef.current) {
      const p = (t * 0.28) % 1;
      radarWaveRef.current.scale.set(0.2 + p * 1.6, 0.2 + p * 1.6, 1);
      (radarWaveRef.current.material as THREE.Material).opacity = (1 - p) * 0.22;
    }

    // Holographic Gyroscope Astrolabe (Delicate, calm counter-rotations)
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.25;
      ring1Ref.current.rotation.y = t * 0.18;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.22;
      ring2Ref.current.rotation.z = t * 0.15;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -t * 0.3;
      ring3Ref.current.rotation.z = -t * 0.2;
    }

    // Floating Crystal Breathing Pulse
    if (crystalRef.current) {
      const breath = Math.sin(t * 1.6) * 0.04;
      crystalRef.current.position.y = 0.95 + breath;
      crystalRef.current.rotation.y = t * 0.45;
      crystalRef.current.rotation.x = Math.sin(t * 0.8) * 0.15;
      crystalMat.emissiveIntensity = 1.6 + Math.sin(t * 2.2) * 0.4;
    }

    // Floating Holographic Data Particles
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlePhases.length; i++) {
        const i3 = i * 3;
        pos[i3 + 1] = particlePositions[i3 + 1] + Math.sin(t * 1.2 + particlePhases[i]) * 0.08;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={sceneGroupRef}>
      {/* ── ATMOSPHERIC FOG: Deep Cinematic Black/Navy (#080A0F) ── */}
      <fogExp2 attach="fog" args={["#080A0F", 0.042]} />

      {/* ══════════════════════════════════════════════════════════
          LAYER 1: DISTANT ARCHITECTURAL BUNKER FRAMEWORK
          (Clean, minimalist silhouettes receding into deep fog)
      ══════════════════════════════════════════════════════════ */}
      <group position={[0, 2.5, -14]}>
        {/* Overhead Command Deck Gantry Beam */}
        <mesh position={[0, 5.0, 0]} material={trussMat}>
          <boxGeometry args={[32, 0.35, 0.6]} />
        </mesh>

        {/* Structural Struts (Far left and far right — zero center clutter) */}
        {[-10, -6, 6, 10].map((x) => (
          <mesh key={x} position={[x, 0, 0]} material={trussMat}>
            <boxGeometry args={[0.35, 12, 0.35]} />
          </mesh>
        ))}

        {/* Faint Telemetry Indicator Pin-Lights */}
        <mesh position={[-10, 4.2, 0.2]}>
          <boxGeometry args={[0.04, 0.3, 0.04]} />
          <meshBasicMaterial color="#FF4655" />
        </mesh>
        <mesh position={[10, 4.2, 0.2]}>
          <boxGeometry args={[0.04, 0.3, 0.04]} />
          <meshBasicMaterial color="#00E5FF" />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════════
          LAYER 2: TACTICAL COMMAND DECK FLOOR & RADAR MATRIX
          (Grounded at y = -1.25, ensuring clean negative space in center)
      ══════════════════════════════════════════════════════════ */}
      <group position={[0, -1.25, 0]}>
        {/* Base dark floor plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={floorBaseMat}>
          <planeGeometry args={[36, 28]} />
        </mesh>

        {/* Razor-thin Vector Floor Grid */}
        <lineSegments position={[0, 0.002, 0]} geometry={floorGridLines} material={floorGridMat} />

        {/* Concentric Tactical Rings etched in the center deck */}
        <mesh position={[0, 0.004, -1.2]} rotation={[-Math.PI / 2, 0, 0]} geometry={radarRingGeo}>
          <meshBasicMaterial color="#FF4655" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>

        {/* Expanding Radar Wave */}
        <mesh
          ref={radarWaveRef}
          position={[0, 0.005, -1.2]}
          rotation={[-Math.PI / 2, 0, 0]}
          geometry={radarWaveGeo}
        >
          <meshBasicMaterial color="#FF4655" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>

        {/* Rotating Radar Sweep Line */}
        <group ref={radarSweepRef} position={[0, 0.006, -1.2]}>
          <mesh position={[2.1, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4.2, 0.02]} />
            <meshBasicMaterial color="#FF4655" transparent opacity={0.4} />
          </mesh>
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════════
          LAYER 3: THE VALORANT INTELLIGENCE CORE
          (Positioned on right flank console at x = 2.4, y = -0.4,
           leaving the center 100% OPEN for VloPedia UI and Search)
      ══════════════════════════════════════════════════════════ */}
      <group ref={coreGroupRef} position={[2.5, -0.4, -0.2]}>
        {/* Ground Projector Emitter Base (Stepped dark metallic cylinder) */}
        <mesh position={[0, -0.75, 0]} material={emitterBaseMat} receiveShadow>
          <cylinderGeometry args={[0.75, 0.88, 0.18, 32]} />
        </mesh>
        <mesh position={[0, -0.65, 0]} material={emitterBaseMat}>
          <cylinderGeometry args={[0.55, 0.72, 0.12, 32]} />
        </mesh>

        {/* Luminous Core Emitter Rim Ring */}
        <mesh position={[0, -0.58, 0]} rotation={[-Math.PI / 2, 0, 0]} material={emitterGlowRingMat}>
          <ringGeometry args={[0.48, 0.54, 36]} />
        </mesh>

        {/* Upward Volumetric Hologram Light Cone */}
        <mesh position={[0, 0.25, 0]} geometry={coneGeo} material={beamMat} />

        {/* Localized Emissive Core Radiance */}
        <pointLight ref={coreLightRef} position={[0, 0.95, 0]} intensity={1.8} distance={3.8} />

        {/* ── Holographic Gyroscope / Astrolabe Coordinate Rings ── */}
        <group position={[0, 0.95, 0]}>
          {/* Ring 1 (Main Radianite Red telemetry axis) */}
          <group ref={ring1Ref}>
            <lineSegments geometry={ringGeo1} material={holoRingMat1} />
          </group>

          {/* Ring 2 (Secondary Cyan diagnostic axis) */}
          <group ref={ring2Ref} rotation={[Math.PI / 4, 0, 0]}>
            <lineSegments geometry={ringGeo2} material={holoRingMat2} />
          </group>

          {/* Ring 3 (Inner Latitude Coordinate axis) */}
          <group ref={ring3Ref} rotation={[0, Math.PI / 3, 0]}>
            <lineSegments geometry={ringGeo3} material={holoRingMat3} />
          </group>

          {/* Center Holographic Radianite Heart Crystal */}
          <mesh ref={crystalRef} geometry={crystalGeo} material={crystalMat} />

          {/* Orbiting Holographic Data Nodes */}
          <points ref={particlesRef}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
            </bufferGeometry>
            <pointsMaterial
              size={0.035}
              color="#FF4655"
              transparent
              opacity={0.75}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </points>
        </group>
      </group>
    </group>
  );
}

export default TacticalDeckSceneObjects;
