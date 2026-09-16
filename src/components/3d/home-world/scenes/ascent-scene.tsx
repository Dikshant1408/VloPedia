"use client";

/**
 * Ascent Scene — VloPedia inaugural cinematic environment.
 *
 * Composition philosophy:
 *   BACKGROUND  : clock tower silhouette + Venetian roofline + hazy sky
 *   MIDGROUND   : central elevated courtyard + warm stone archway + agent subject
 *   FOREGROUND  : lower parapet wall + supply container (depth framing)
 *
 * Palette: warm Mediterranean — cream stone, terracotta, warm sunlight.
 * No generic dark navy. The floor is warm stone, not cold concrete.
 *
 * All objects always present. Category hover shifts camera only (see scene-registry.ts).
 */

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Ascent warm stone palette
const P = {
  stoneDark:     "#2a2318",   // dark shadow stone
  stoneMid:      "#3a3025",   // midtone stone
  stoneWarm:     "#4a3d2e",   // warm lit stone face
  stoneCream:    "#5c4d3a",   // cream highlight
  plasterWarm:   "#382e22",   // warm plaster wall
  terracotta:    "#6b3a28",   // terracotta accent
  floorBase:     "#2e2518",   // floor stone
  floorInlay:    "#352a1c",   // floor flagstone
  wood:          "#3d2e1a",   // timber/wood element
  metalDark:     "#1a1e24",   // dark metal
  metalMid:      "#252d35",   // mid metal
  rimRed:        "#ff4655",   // VALORANT red
  skyDark:       "#080b10",   // far background
  skyMid:        "#0c0f16",   // mid sky
  fog:           "#0e1118",   // atmospheric haze
  dust:          "#d4c9b8",   // warm dust particles
} as const;

interface AscentSceneObjectsProps {
  prefersReducedMotion?: boolean;
}

export function AscentSceneObjects({ prefersReducedMotion = false }: AscentSceneObjectsProps) {
  const agentRef = useRef<THREE.Group>(null);
  const rimRef   = useRef<THREE.PointLight>(null);
  const dustRef  = useRef<THREE.Points>(null);

  // Warm dust motes — larger, less blue than default
  const { dustPos, dustPhase } = useMemo(() => {
    const n = 70;
    const pos   = new Float32Array(n * 3);
    const phase = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const i3 = i * 3;
      pos[i3]     = (Math.random() - 0.5) * 7.5;
      pos[i3 + 1] = Math.random() * 4.0 + 0.3;
      pos[i3 + 2] = (Math.random() - 0.5) * 6.0;
      phase[i] = Math.random() * Math.PI * 2;
    }
    return { dustPos: pos, dustPhase: phase };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Agent: slow Mediterranean breathing (warmer, more settled than a battle pose)
    if (agentRef.current && !prefersReducedMotion) {
      agentRef.current.position.y = 0.62 + Math.sin(t * 0.9) * 0.01;
      agentRef.current.rotation.y = 0.28 + Math.sin(t * 0.35) * 0.015;
    }

    // Rim light: subtle pulse — sunbeam flicker
    if (rimRef.current) {
      rimRef.current.intensity = 1.05 + Math.sin(t * 1.6) * 0.1;
    }

    // Dust drift
    if (dustRef.current && !prefersReducedMotion) {
      const arr = dustRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < dustPhase.length; i++) {
        const i3 = i * 3;
        arr[i3 + 1] = dustPos[i3 + 1] + Math.sin(t * 0.32 + dustPhase[i]) * 0.2;
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>

      {/* ═══════════════════════════════════════════════════════
          BACKGROUND — Ascent clock tower + Venetian roofline
          Silhouettes against hazy sky.
      ═══════════════════════════════════════════════════════ */}
      <group position={[0, 0, -7.0]}>
        {/* Clock tower — Ascent's most recognisable silhouette */}
        <mesh position={[-2.8, 3.2, 0]}>
          <boxGeometry args={[0.85, 9.0, 0.85]} />
          <meshStandardMaterial color={P.skyDark} roughness={1} metalness={0} />
        </mesh>
        {/* Clock tower top — octagonal belfry suggestion */}
        <mesh position={[-2.8, 7.8, 0]}>
          <boxGeometry args={[1.1, 0.6, 1.1]} />
          <meshStandardMaterial color={P.skyDark} roughness={1} metalness={0} />
        </mesh>
        <mesh position={[-2.8, 8.2, 0]}>
          <boxGeometry args={[0.35, 1.0, 0.35]} />
          <meshStandardMaterial color={P.skyDark} roughness={1} metalness={0} />
        </mesh>

        {/* Venetian building mass — right */}
        <mesh position={[3.0, 1.4, -0.5]}>
          <boxGeometry args={[2.8, 4.8, 1.4]} />
          <meshStandardMaterial color={P.skyMid} roughness={1} metalness={0} />
        </mesh>
        {/* Roofline cornice */}
        <mesh position={[3.0, 3.9, -0.5]}>
          <boxGeometry args={[3.0, 0.22, 1.6]} />
          <meshStandardMaterial color={P.skyDark} roughness={1} metalness={0} />
        </mesh>
        {/* Chimney stacks */}
        <mesh position={[2.1, 4.5, -0.4]}>
          <boxGeometry args={[0.28, 1.3, 0.28]} />
          <meshStandardMaterial color={P.skyDark} roughness={1} metalness={0} />
        </mesh>
        <mesh position={[3.4, 4.3, -0.6]}>
          <boxGeometry args={[0.22, 0.9, 0.22]} />
          <meshStandardMaterial color={P.skyDark} roughness={1} metalness={0} />
        </mesh>

        {/* Left lower building */}
        <mesh position={[-0.8, 0.8, 0.3]}>
          <boxGeometry args={[2.0, 3.2, 1.0]} />
          <meshStandardMaterial color={P.skyMid} roughness={1} metalness={0} />
        </mesh>

        {/* Atmospheric haze plane */}
        <mesh position={[0, 1.5, 2.0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 7]} />
          <meshBasicMaterial color={P.fog} transparent opacity={0.45} depthWrite={false} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════
          MIDGROUND — Ascent central courtyard
          Warm stone floor, flagging inlay.
      ═══════════════════════════════════════════════════════ */}

      {/* Main courtyard slab */}
      <mesh position={[0, -0.14, 0]} receiveShadow castShadow>
        <boxGeometry args={[7.2, 0.28, 5.8]} />
        <meshStandardMaterial color={P.stoneDark} roughness={0.85} metalness={0.08} />
      </mesh>
      {/* Warm stone flagstone surface — key colour difference from generic scenes */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.8, 5.4]} />
        <meshStandardMaterial color={P.floorInlay} roughness={0.9} metalness={0.05} polygonOffset polygonOffsetFactor={-1} />
      </mesh>
      {/* Terracotta border strip — left edge */}
      <mesh position={[-3.0, 0.01, 0]}>
        <boxGeometry args={[0.05, 0.015, 4.5]} />
        <meshStandardMaterial color={P.terracotta} emissive={P.rimRed} emissiveIntensity={0.18} />
      </mesh>

      {/* Elevated central platform (Ascent's raised mid courtyard) */}
      <group position={[0, 0, -1.2]}>
        <mesh position={[0, 0.14, 0]} receiveShadow castShadow>
          <boxGeometry args={[3.2, 0.28, 2.2]} />
          <meshStandardMaterial color={P.stoneMid} roughness={0.8} metalness={0.1} />
        </mesh>
        {/* Platform steps front */}
        <mesh position={[0, 0.08, 1.2]} receiveShadow castShadow>
          <boxGeometry args={[3.2, 0.16, 0.32]} />
          <meshStandardMaterial color={P.stoneWarm} roughness={0.78} metalness={0.1} />
        </mesh>
        {/* Warm stone inlay on platform top */}
        <mesh position={[0, 0.285, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[3.0, 2.0]} />
          <meshStandardMaterial color={P.stoneCream} roughness={0.85} metalness={0.06} polygonOffset polygonOffsetFactor={-1} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════
          MIDGROUND — Ascent archway wall
          Warm plaster + stone pillar language.
      ═══════════════════════════════════════════════════════ */}
      <group position={[-0.9, 1.5, -2.5]} rotation={[0, 0.12, 0]}>
        {/* Left wall mass */}
        <mesh position={[-1.1, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.8, 3.0, 0.32]} />
          <meshStandardMaterial color={P.plasterWarm} roughness={0.92} metalness={0.06} />
        </mesh>
        {/* Stone pillar face detail on left wall */}
        <mesh position={[-1.1, 0, 0.17]}>
          <boxGeometry args={[0.28, 3.0, 0.04]} />
          <meshStandardMaterial color={P.stoneWarm} roughness={0.85} metalness={0.08} />
        </mesh>

        {/* Archway lintel */}
        <mesh position={[0.5, 1.18, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.4, 0.38, 0.32]} />
          <meshStandardMaterial color={P.stoneMid} roughness={0.82} metalness={0.12} />
        </mesh>
        {/* Keystone centrepiece */}
        <mesh position={[0.5, 1.02, 0.17]}>
          <boxGeometry args={[0.22, 0.42, 0.06]} />
          <meshStandardMaterial color={P.stoneWarm} roughness={0.75} metalness={0.15} />
        </mesh>

        {/* Right pillar */}
        <mesh position={[1.3, 0.1, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.44, 2.8, 0.32]} />
          <meshStandardMaterial color={P.plasterWarm} roughness={0.9} metalness={0.07} />
        </mesh>
        {/* Red Radianite accent strip at top */}
        <mesh position={[-1.1, 1.52, 0.18]}>
          <boxGeometry args={[1.85, 0.032, 0.06]} />
          <meshStandardMaterial color={P.rimRed} emissive={P.rimRed} emissiveIntensity={0.45} />
        </mesh>
        {/* Terracotta accent — base cornice */}
        <mesh position={[-0.2, -1.48, 0.18]}>
          <boxGeometry args={[2.6, 0.055, 0.06]} />
          <meshStandardMaterial color={P.terracotta} roughness={0.7} metalness={0.1} />
        </mesh>
        {/* Wooden beam conduit */}
        <mesh position={[0.1, -1.38, 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.028, 0.028, 3.4, 10]} />
          <meshStandardMaterial color={P.wood} roughness={0.65} metalness={0.2} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════
          FOREGROUND — Left wing wall + parapet
          Creates the cinematic depth frame.
      ═══════════════════════════════════════════════════════ */}
      <group position={[2.6, 0.2, 2.4]} rotation={[0, -0.35, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[2.2, 0.72, 0.42]} />
          <meshStandardMaterial color={P.stoneDark} roughness={0.88} metalness={0.1} />
        </mesh>
        {/* Capstone — warm lit top */}
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[2.28, 0.07, 0.48]} />
          <meshStandardMaterial color={P.stoneWarm} roughness={0.72} metalness={0.15} />
        </mesh>
        {/* Parapet posts */}
        <mesh position={[-0.95, 0.54, 0]}>
          <boxGeometry args={[0.14, 0.4, 0.44]} />
          <meshStandardMaterial color={P.stoneMid} roughness={0.75} metalness={0.12} />
        </mesh>
        <mesh position={[0.95, 0.54, 0]}>
          <boxGeometry args={[0.14, 0.4, 0.44]} />
          <meshStandardMaterial color={P.stoneMid} roughness={0.75} metalness={0.12} />
        </mesh>
      </group>

      {/* Ascent-style supply container — warm metal, not pure black */}
      <group position={[-2.1, 0.38, 1.0]} rotation={[0, -0.25, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.74, 0.74, 0.74]} />
          <meshStandardMaterial color={P.metalDark} roughness={0.5} metalness={0.5} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.78, 0.19, 0.78]} />
          <meshStandardMaterial color={P.metalMid} roughness={0.62} metalness={0.32} />
        </mesh>
        <mesh position={[0, 0, 0.38]}>
          <boxGeometry args={[0.52, 0.03, 0.015]} />
          <meshStandardMaterial color={P.rimRed} emissive={P.rimRed} emissiveIntensity={0.72} />
        </mesh>
      </group>

      {/* Elevation steps — right side */}
      <group position={[2.0, 0, 1.0]}>
        <mesh position={[0, 0.07, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.4, 0.14, 0.8]} />
          <meshStandardMaterial color={P.stoneMid} roughness={0.78} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.21, -0.55]} receiveShadow castShadow>
          <boxGeometry args={[1.4, 0.14, 0.68]} />
          <meshStandardMaterial color={P.stoneDark} roughness={0.78} metalness={0.1} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════
          SUBJECT — Agent silhouette
          Warm atmospheric rim. Standing on platform, facing camera.
      ═══════════════════════════════════════════════════════ */}
      <group ref={agentRef} position={[-0.6, 0.62, -1.1]} rotation={[0, 0.28, 0]}>
        {/* Torso */}
        <mesh castShadow receiveShadow position={[0, 0.34, 0]}>
          <capsuleGeometry args={[0.16, 0.52, 8, 16]} />
          <meshStandardMaterial color={P.stoneDark} roughness={0.48} metalness={0.22} />
        </mesh>
        {/* Head */}
        <mesh castShadow position={[0, 0.82, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={P.stoneMid} roughness={0.44} metalness={0.2} />
        </mesh>
        {/* Pauldrons */}
        <mesh position={[0, 0.58, 0]}>
          <boxGeometry args={[0.52, 0.1, 0.24]} />
          <meshStandardMaterial color={P.stoneMid} roughness={0.55} metalness={0.35} />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.08, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.54, 8]} />
          <meshStandardMaterial color={P.stoneDark} roughness={0.68} />
        </mesh>
        <mesh position={[0.08, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.54, 8]} />
          <meshStandardMaterial color={P.stoneDark} roughness={0.68} />
        </mesh>

        {/* Warm VALORANT red rim light — from behind-left, golden-hour bounce */}
        <pointLight ref={rimRef} color={P.rimRed} intensity={1.1} distance={3.5} position={[-0.5, 0.9, -0.7]} />
        {/* Warm sun bounce from front — Mediterranean feel */}
        <pointLight color="#ffe0a0" intensity={0.25} distance={2.8} position={[0.6, 0.4, 0.9]} />
      </group>

      {/* ═══════════════════════════════════════════════════════
          Weapon — resting at archway base
      ═══════════════════════════════════════════════════════ */}
      <group position={[0.55, 0.58, -1.0]} rotation={[0.18, 0.4, -0.14]}>
        <mesh castShadow>
          <boxGeometry args={[1.1, 0.14, 0.065]} />
          <meshStandardMaterial color={P.metalDark} roughness={0.34} metalness={0.7} />
        </mesh>
        <mesh position={[0.72, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.019, 0.019, 0.5, 8]} />
          <meshStandardMaterial color={P.metalMid} roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[-0.05, -0.15, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.12, 0.23, 0.06]} />
          <meshStandardMaterial color={P.stoneDark} roughness={0.58} metalness={0.42} />
        </mesh>
        <mesh position={[0.12, 0.095, 0]}>
          <boxGeometry args={[0.09, 0.04, 0.034]} />
          <meshStandardMaterial color={P.rimRed} emissive={P.rimRed} emissiveIntensity={1.3} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════
          ATMOSPHERE — Warm dust motes + soft ground shadow
      ═══════════════════════════════════════════════════════ */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color={P.dust}
          transparent
          opacity={0.42}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Warm ground shadow — not pure black, has warm undertone */}
      <mesh position={[0, -0.27, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9.0, 7.5]} />
        <meshBasicMaterial color="#08060a" transparent opacity={0.65} />
      </mesh>

    </group>
  );
}
