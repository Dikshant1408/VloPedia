"use client";

/**
 * Tactical Deck Scene — VloPedia Headquarters Intelligence Environment.
 *
 * Art Direction:
 *   - Dark, cinematic VALORANT tactical intelligence command deck.
 *   - Clean central negative space zone framing the VloPedia logo, search, and UI.
 *   - Deep architectural depth with distant structural silhouettes and soft atmospheric fog.
 *   - The signature "VALORANT Intelligence Core" floating on the right deck console.
 *   - High-fidelity PBR materials: matte gunmetal, brushed titanium, and subtle Radianite accents.
 *   - ZERO random low-poly buildings, beige blockouts, or spinning toy dioramas.
 */

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { type HomeWorldCategory } from "../home-world.config";

interface TacticalDeckSceneProps {
  activeCategory?: HomeWorldCategory;
  prefersReducedMotion?: boolean;
}

export function TacticalDeckSceneObjects({
  activeCategory = "idle",
  prefersReducedMotion = false,
}: TacticalDeckSceneProps) {
  // References
  const sceneGroupRef     = useRef<THREE.Group>(null);
  const coreGroupRef      = useRef<THREE.Group>(null);
  const coreHeartRef      = useRef<THREE.Mesh>(null);
  const radarRingRef      = useRef<THREE.Mesh>(null);
  const sweepLineRef      = useRef<THREE.Group>(null);
  const telemetryRingsRef = useRef<THREE.Group>(null);
  const domainNodesRef    = useRef<THREE.Group>(null);

  // Dynamic color driven by category
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

  // ── 1. Geometries Memoized ──
  const coreGeo       = useMemo(() => new THREE.IcosahedronGeometry(0.72, 0), []);
  const coreEdges     = useMemo(() => new THREE.EdgesGeometry(coreGeo), [coreGeo]);
  const coreHeartGeo  = useMemo(() => new THREE.OctahedronGeometry(0.38, 0), []);
  const ringGeo1      = useMemo(() => new THREE.RingGeometry(1.05, 1.07, 48), []);
  const ringGeo2      = useMemo(() => new THREE.RingGeometry(1.22, 1.24, 48), []);
  const radarDiscGeo  = useMemo(() => new THREE.RingGeometry(0.1, 4.2, 64), []);

  // ── 2. Materials Memoized ──
  const floorPlateMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0E121A",
    roughness: 0.82,
    metalness: 0.45,
  }), []);

  const structuralBeamMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0B0E14",
    roughness: 0.9,
    metalness: 0.6,
  }), []);

  const coreExoshellMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#121622",
    roughness: 0.28,
    metalness: 0.88,
    flatShading: true,
  }), []);

  const wireframeMat = useMemo(() => new THREE.LineBasicMaterial({
    color: "#FF4655",
    transparent: true,
    opacity: 0.6,
  }), []);

  const heartMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#FF4655",
    emissive: "#FF4655",
    emissiveIntensity: 1.6,
    metalness: 0.2,
    roughness: 0.1,
  }), []);

  // ── 3. Animation Loop ──
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Lerp accent color smoothly
    currentAccent.current.lerp(targetAccentColor, Math.min(1, delta * 3.5));
    if (heartMat) {
      heartMat.color.copy(currentAccent.current);
      heartMat.emissive.copy(currentAccent.current);
    }
    if (wireframeMat) {
      wireframeMat.color.copy(currentAccent.current);
    }

    if (prefersReducedMotion) return;

    // Subtle radar disc pulse expansion
    if (radarRingRef.current) {
      const pulse = ((t * 0.35) % 1);
      radarRingRef.current.scale.set(0.6 + pulse * 1.8, 0.6 + pulse * 1.8, 1);
      (radarRingRef.current.material as THREE.Material).opacity = (1 - pulse) * 0.22;
    }

    // Slow sweeping scanline across tactical floor
    if (sweepLineRef.current) {
      sweepLineRef.current.rotation.z = -t * 0.35;
    }

    // Intelligence Core subtle floating & breathing (No aggressive spinning!)
    if (coreGroupRef.current) {
      coreGroupRef.current.position.y = 0.25 + Math.sin(t * 0.6) * 0.025;
      coreGroupRef.current.rotation.y = 0.4 + Math.sin(t * 0.2) * 0.03;
      coreGroupRef.current.rotation.x = 0.15 + Math.cos(t * 0.25) * 0.02;
    }

    // Inner crystal pulse
    if (coreHeartRef.current) {
      const p = 1 + Math.sin(t * 1.8) * 0.04;
      coreHeartRef.current.scale.set(p, p, p);
    }

    // Telemetry rings slow counter-rotation
    if (telemetryRingsRef.current) {
      telemetryRingsRef.current.rotation.z = t * 0.08;
    }

    // Category-specific subtle shifts
    if (domainNodesRef.current) {
      domainNodesRef.current.rotation.y = t * 0.04;
    }
  });

  return (
    <group ref={sceneGroupRef}>
      {/* ── ATMOSPHERIC FOG: Deep Void (#080A0F) ── */}
      <fogExp2 attach="fog" args={["#080A0F", 0.05]} />

      {/* ══════════════════════════════════════════════════════════
          LAYER 1 & 2: DISTANT ARCHITECTURAL TRUSSES & SILHOUETTES
          (Framed far back to create genuine scale and depth)
      ══════════════════════════════════════════════════════════ */}
      <group position={[0, 2.0, -11]}>
        {/* Overhead Command Deck Roof Truss */}
        <mesh position={[0, 4.2, 0]} material={structuralBeamMat}>
          <boxGeometry args={[26, 0.4, 0.8]} />
        </mesh>

        {/* Far Background Support Columns */}
        {[-8, -4, 4, 8].map((x) => (
          <mesh key={x} position={[x, 0, 0]} material={structuralBeamMat}>
            <boxGeometry args={[0.5, 9, 0.5]} />
          </mesh>
        ))}

        {/* Distant Minimal Red & Cyan Status Telemetry Lights */}
        <mesh position={[-8, 3.6, 0.3]}>
          <boxGeometry args={[0.06, 0.6, 0.06]} />
          <meshBasicMaterial color="#FF4655" />
        </mesh>
        <mesh position={[8, 3.6, 0.3]}>
          <boxGeometry args={[0.06, 0.6, 0.06]} />
          <meshBasicMaterial color="#00E5FF" />
        </mesh>
      </group>

      {/* ══════════════════════════════════════════════════════════
          LAYER 3 & 4: TACTICAL COMMAND DECK FLOOR & SCANNING GRID
          (Sits low at y = -1.1, completely opening up the center)
      ══════════════════════════════════════════════════════════ */}
      <group position={[0, -1.05, 0]}>
        {/* Large segmented tactical floor plates */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={floorPlateMat}>
          <planeGeometry args={[22, 16]} />
        </mesh>

        {/* Recessed Hairline Seams */}
        <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[21.5, 15.5]} />
          <meshBasicMaterial color="#080A0F" wireframe />
        </mesh>

        {/* Central Deck Radar Sweep Surface (Subtle expanding ring) */}
        <mesh
          ref={radarRingRef}
          position={[0, 0.004, -1.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          geometry={radarDiscGeo}
        >
          <meshBasicMaterial
            color={currentAccent.current}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Slow Radar Sweep Beam */}
        <group ref={sweepLineRef} position={[0, 0.006, -1.5]}>
          <mesh position={[1.8, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.6, 0.03]} />
            <meshBasicMaterial color={currentAccent.current} transparent opacity={0.35} />
          </mesh>
        </group>

        {/* Left Flanking Console Deck (x = -4.0, frames the UI) */}
        <group position={[-4.0, 0.35, -0.5]} rotation={[0, 0.25, 0]}>
          <mesh material={structuralBeamMat}>
            <boxGeometry args={[2.2, 0.7, 3.2]} />
          </mesh>
          {/* Subtle diagnostic strip */}
          <mesh position={[0.9, 0.36, 0]}>
            <boxGeometry args={[0.04, 0.02, 2.6]} />
            <meshBasicMaterial color="#00E5FF" transparent opacity={0.5} />
          </mesh>
        </group>

        {/* Right Flanking Console Terminal (x = 2.4, supports the Core) */}
        <group position={[2.4, 0.35, -0.2]} rotation={[0, -0.22, 0]}>
          <mesh material={structuralBeamMat} receiveShadow>
            <boxGeometry args={[2.5, 0.7, 3.4]} />
          </mesh>
          {/* Recessed console rim */}
          <mesh position={[-1.0, 0.36, 0]}>
            <boxGeometry args={[0.04, 0.02, 2.8]} />
            <meshBasicMaterial color="#FF4655" transparent opacity={0.5} />
          </mesh>
        </group>
      </group>

      {/* ══════════════════════════════════════════════════════════
          LAYER 5: THE VALORANT INTELLIGENCE CORE
          (Positioned on right flank console, leaving center wide open)
      ══════════════════════════════════════════════════════════ */}
      <group ref={coreGroupRef} position={[2.4, 0.25, -0.2]}>
        {/* Outer Faceted Gunmetal Armor Shell */}
        <mesh geometry={coreGeo} material={coreExoshellMat} castShadow receiveShadow />

        {/* Hairline Precision Chassis Seams */}
        <lineSegments geometry={coreEdges} material={wireframeMat} />

        {/* Inner Luminous Radianite Crystalline Heart */}
        <mesh ref={coreHeartRef} geometry={coreHeartGeo} material={heartMat} />

        {/* Localized Emissive Core Radiance */}
        <pointLight color={currentAccent.current} intensity={1.8} distance={3.5} />

        {/* Concentric Telemetry Orbit Rings */}
        <group ref={telemetryRingsRef} rotation={[Math.PI / 3, 0, 0]}>
          <mesh geometry={ringGeo1}>
            <meshBasicMaterial color={currentAccent.current} transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>
          <mesh geometry={ringGeo2} rotation={[0, 0, Math.PI / 4]}>
            <meshBasicMaterial color="#384556" transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Reactive Domain Overlays */}
        <group ref={domainNodesRef}>
          {/* AGENTS: 4 Tactical Ability Diamonds */}
          {activeCategory === "agents" && (
            <group>
              {[
                [0, 1.2, 0],
                [1.2, 0, 0],
                [0, -1.2, 0],
                [-1.2, 0, 0],
              ].map((pos, i) => (
                <mesh key={i} position={pos as [number, number, number]}>
                  <octahedronGeometry args={[0.09, 0]} />
                  <meshStandardMaterial color="#FF4655" emissive="#FF4655" emissiveIntensity={2.0} />
                </mesh>
              ))}
            </group>
          )}

          {/* WEAPONS: Ballistic Targeting Vector */}
          {activeCategory === "weapons" && (
            <group rotation={[0, 0, Math.PI / 4]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[2.4, 0.015, 0.015]} />
                <meshBasicMaterial color="#F59E0B" />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.015, 2.4, 0.015]} />
                <meshBasicMaterial color="#F59E0B" />
              </mesh>
            </group>
          )}

          {/* MAPS: Concentric Contour Rings */}
          {activeCategory === "maps" && (
            <group>
              {[-0.3, 0, 0.3].map((y, i) => (
                <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.0 + i * 0.15, 1.02 + i * 0.15, 36]} />
                  <meshBasicMaterial color="#00E5FF" transparent opacity={0.4} side={THREE.DoubleSide} />
                </mesh>
              ))}
            </group>
          )}

          {/* SKINS: Specular Golden Prisms */}
          {activeCategory === "skins" && (
            <group>
              {[
                [0.9, 0.9, 0.5],
                [-0.9, -0.8, 0.5],
                [0.5, -0.9, -0.8],
              ].map((pos, i) => (
                <mesh key={i} position={pos as [number, number, number]}>
                  <tetrahedronGeometry args={[0.09, 0]} />
                  <meshStandardMaterial
                    color="#EAB308"
                    emissive="#EAB308"
                    emissiveIntensity={1.8}
                    metalness={0.9}
                  />
                </mesh>
              ))}
            </group>
          )}
        </group>
      </group>
    </group>
  );
}
