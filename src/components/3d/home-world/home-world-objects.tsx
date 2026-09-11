"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HOME_WORLD_CONFIG, type HomeWorldCategory } from "./home-world.config";

interface HomeWorldObjectsProps {
  activeCategory: HomeWorldCategory;
  prefersReducedMotion?: boolean;
}

export function HomeWorldObjects({ activeCategory, prefersReducedMotion = false }: HomeWorldObjectsProps) {
  // References for interactive elements
  const agentSilhouetteRef = useRef<THREE.Group>(null);
  const agentGlowRef = useRef<THREE.PointLight>(null);
  const mapRadarRef = useRef<THREE.Group>(null);
  const weaponPropRef = useRef<THREE.Group>(null);
  const skinArtifactRef = useRef<THREE.Group>(null);
  const dustParticlesRef = useRef<THREE.Points>(null);

  // Category weight targets for smooth transition
  const categoryWeights = useRef({
    agents: 0,
    maps: 0,
    weapons: 0,
    skins: 0,
  });

  // Generate atmospheric dust motes
  const { dustPositions, dustInitY } = useMemo(() => {
    const count = 70;
    const positions = new Float32Array(count * 3);
    const initY = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 7.0;
      positions[i3 + 1] = Math.random() * 3.8 + 0.1;
      positions[i3 + 2] = (Math.random() - 0.5) * 6.0;
      initY[i] = positions[i3 + 1];
    }
    return { dustPositions: positions, dustInitY: initY };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const lerpSpeed = delta * 4.5;

    // Smoothly interpolate category states
    categoryWeights.current.agents = THREE.MathUtils.lerp(
      categoryWeights.current.agents,
      activeCategory === "agents" ? 1 : 0,
      lerpSpeed
    );
    categoryWeights.current.maps = THREE.MathUtils.lerp(
      categoryWeights.current.maps,
      activeCategory === "maps" ? 1 : 0,
      lerpSpeed
    );
    categoryWeights.current.weapons = THREE.MathUtils.lerp(
      categoryWeights.current.weapons,
      activeCategory === "weapons" ? 1 : 0,
      lerpSpeed
    );
    categoryWeights.current.skins = THREE.MathUtils.lerp(
      categoryWeights.current.skins,
      activeCategory === "skins" ? 1 : 0,
      lerpSpeed
    );

    // 1. Agent Silhouette Reaction
    if (agentSilhouetteRef.current) {
      const w = categoryWeights.current.agents;
      if (!prefersReducedMotion) {
        // Subtle breathing micro-motion
        agentSilhouetteRef.current.position.y = 0.52 + Math.sin(t * 1.4) * 0.015;
      }
      if (agentGlowRef.current) {
        agentGlowRef.current.intensity = THREE.MathUtils.lerp(0.4, 2.2, w);
      }
    }

    // 2. Map Radar Reaction
    if (mapRadarRef.current) {
      const w = categoryWeights.current.maps;
      mapRadarRef.current.scale.setScalar(THREE.MathUtils.lerp(0.001, 1, w));
      if (!prefersReducedMotion) {
        mapRadarRef.current.rotation.y = t * 0.25;
      }
    }

    // 3. Weapon Highlight Reaction
    if (weaponPropRef.current) {
      const w = categoryWeights.current.weapons;
      weaponPropRef.current.scale.setScalar(THREE.MathUtils.lerp(0.9, 1.12, w));
    }

    // 4. Skin Artifact Reaction
    if (skinArtifactRef.current) {
      const w = categoryWeights.current.skins;
      skinArtifactRef.current.scale.setScalar(THREE.MathUtils.lerp(0.001, 1, w));
      if (!prefersReducedMotion) {
        skinArtifactRef.current.rotation.x = t * 0.6;
        skinArtifactRef.current.rotation.y = t * 0.8;
      }
    }

    // 5. Dust motes drifting
    if (dustParticlesRef.current && !prefersReducedMotion) {
      const pos = dustParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < dustInitY.length; i++) {
        const i3 = i * 3;
        pos[i3 + 1] = dustInitY[i] + Math.sin(t * 0.45 + i) * 0.25;
      }
      dustParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* ════════════════════════════════════════════════════
          1. DISTANT SKYLINE & FLOATING ARCHITECTURAL SPIRES
      ════════════════════════════════════════════════════ */}
      <group position={[0, 1.8, -5.5]}>
        {/* Distant Spire 1 */}
        <mesh position={[-2.4, 0.4, 0]}>
          <boxGeometry args={[0.7, 3.8, 0.7]} />
          <meshStandardMaterial
            color={HOME_WORLD_CONFIG.palette.skySilhouette}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        {/* Distant Spire 2 */}
        <mesh position={[2.8, 0.8, -0.5]}>
          <boxGeometry args={[0.9, 4.4, 0.9]} />
          <meshStandardMaterial
            color={HOME_WORLD_CONFIG.palette.skySilhouette}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        {/* Distant Floating Island Chunk */}
        <mesh position={[0.4, 1.6, -1.0]} rotation={[0.1, 0.2, -0.05]}>
          <dodecahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial
            color="#0c0e12"
            roughness={0.95}
            metalness={0.05}
          />
        </mesh>
      </group>

      {/* ════════════════════════════════════════════════════
          2. MIDGROUND COURTYARD PLATFORM & STEPS
      ════════════════════════════════════════════════════ */}
      {/* Main paved courtyard platform */}
      <mesh position={[0, -0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[6.2, 0.3, 5.0]} />
        <meshStandardMaterial
          color={HOME_WORLD_CONFIG.palette.platformBase}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Beveled edge border trim */}
      <mesh position={[0, -0.15, 2.51]}>
        <boxGeometry args={[6.22, 0.16, 0.05]} />
        <meshStandardMaterial
          color={HOME_WORLD_CONFIG.palette.platformTrim}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Courtyard stone flagstone grid inlay */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.6, 4.4]} />
        <meshStandardMaterial
          color="#1e2228"
          roughness={0.8}
          metalness={0.1}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>

      {/* Subtle VALORANT Red inset trim line along courtyard */}
      <mesh position={[-2.4, 0.012, 0]}>
        <boxGeometry args={[0.04, 0.015, 3.8]} />
        <meshStandardMaterial
          color={HOME_WORLD_CONFIG.palette.crateAccentRed}
          emissive={HOME_WORLD_CONFIG.palette.crateAccentRed}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Architectural Elevation Steps */}
      <group position={[1.8, 0, 0.8]}>
        <mesh position={[0, 0.06, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.2, 0.12, 0.7]} />
          <meshStandardMaterial color="#242930" roughness={0.7} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.18, -0.45]} receiveShadow castShadow>
          <boxGeometry args={[1.2, 0.12, 0.6]} />
          <meshStandardMaterial color="#20252c" roughness={0.7} metalness={0.2} />
        </mesh>
      </group>

      {/* ════════════════════════════════════════════════════
          3. ARCHITECTURAL WALL & ARCHED PORTAL
      ════════════════════════════════════════════════════ */}
      <group position={[-1.3, 1.25, -1.0]} rotation={[0, 0.22, 0]}>
        {/* Left Wall Block */}
        <mesh position={[-0.85, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.4, 2.5, 0.24]} />
          <meshStandardMaterial
            color={HOME_WORLD_CONFIG.palette.wallBase}
            roughness={0.85}
            metalness={0.15}
          />
        </mesh>

        {/* Archway Lintel Beam */}
        <mesh position={[0.45, 1.05, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.2, 0.4, 0.24]} />
          <meshStandardMaterial
            color={HOME_WORLD_CONFIG.palette.wallAccent}
            roughness={0.7}
            metalness={0.25}
          />
        </mesh>

        {/* Right Portal Pillar */}
        <mesh position={[1.15, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.4, 2.5, 0.24]} />
          <meshStandardMaterial
            color={HOME_WORLD_CONFIG.palette.wallBase}
            roughness={0.85}
            metalness={0.15}
          />
        </mesh>

        {/* Industrial Conduit Line at Base */}
        <mesh position={[0.2, -1.18, 0.15]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 2.8, 12]} />
          <meshStandardMaterial color="#334155" roughness={0.35} metalness={0.7} />
        </mesh>
      </group>

      {/* ════════════════════════════════════════════════════
          4. STYLIZED AGENT SILHOUETTE
      ════════════════════════════════════════════════════ */}
      <group ref={agentSilhouetteRef} position={[-0.75, 0.52, -0.45]} rotation={[0, 0.35, 0]}>
        {/* Stylized Body / Torso */}
        <mesh castShadow receiveShadow position={[0, 0.32, 0]}>
          <capsuleGeometry args={[0.16, 0.48, 8, 16]} />
          <meshStandardMaterial
            color="#14171b"
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>

        {/* Head Silhouette */}
        <mesh castShadow position={[0, 0.76, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#1c2026"
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>

        {/* Stylized Tactical Shoulder Pauldrons */}
        <mesh position={[0, 0.54, 0]}>
          <boxGeometry args={[0.48, 0.1, 0.22]} />
          <meshStandardMaterial color="#22272e" roughness={0.5} metalness={0.4} />
        </mesh>

        {/* Legs Base */}
        <mesh position={[-0.08, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.48, 8]} />
          <meshStandardMaterial color="#111316" roughness={0.6} />
        </mesh>
        <mesh position={[0.08, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.06, 0.48, 8]} />
          <meshStandardMaterial color="#111316" roughness={0.6} />
        </mesh>

        {/* Agent Dedicated Red Rim Accent Light */}
        <pointLight
          ref={agentGlowRef}
          color="#ff4655"
          intensity={0.6}
          distance={2.8}
          position={[-0.2, 0.6, -0.3]}
        />
      </group>

      {/* ════════════════════════════════════════════════════
          5. TACTICAL SUPPLY CONTAINER / CRATE
      ════════════════════════════════════════════════════ */}
      <group position={[-1.5, 0.35, 0.6]} rotation={[0, -0.35, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial
            color={HOME_WORLD_CONFIG.palette.crateMetal}
            roughness={0.45}
            metalness={0.55}
          />
        </mesh>

        {/* Outer Corner Protective Framing */}
        <mesh>
          <boxGeometry args={[0.74, 0.16, 0.74]} />
          <meshStandardMaterial color="#2d333b" roughness={0.6} metalness={0.3} />
        </mesh>

        {/* Red Radianite Seal Inlay */}
        <mesh position={[0, 0, 0.36]}>
          <boxGeometry args={[0.52, 0.03, 0.015]} />
          <meshStandardMaterial
            color={HOME_WORLD_CONFIG.palette.crateAccentRed}
            emissive={HOME_WORLD_CONFIG.palette.crateAccentRed}
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>

      {/* ════════════════════════════════════════════════════
          6. FOREGROUND FRAMING PARAPET (CINEMATIC DEPTH)
      ════════════════════════════════════════════════════ */}
      <group position={[2.4, 0.15, 2.2]} rotation={[0, -0.4, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[1.8, 0.65, 0.35]} />
          <meshStandardMaterial
            color="#13161a"
            roughness={0.85}
            metalness={0.15}
          />
        </mesh>
        {/* Parapet capstone */}
        <mesh position={[0, 0.34, 0]}>
          <boxGeometry args={[1.86, 0.06, 0.4]} />
          <meshStandardMaterial color="#252b33" roughness={0.6} metalness={0.3} />
        </mesh>
      </group>

      {/* ════════════════════════════════════════════════════
          7. CATEGORY-REACTIVE THEMATIC PROPS
      ════════════════════════════════════════════════════ */}

      {/* PROP A: MAPS — Holographic Radar Sandtable on Courtyard */}
      <group ref={mapRadarRef} position={[0.6, 0.08, 0.2]} scale={0.001}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.6, 32]} />
          <meshStandardMaterial
            color="#94a3b8"
            emissive="#94a3b8"
            emissiveIntensity={1.0}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.54, 24]} />
          <meshStandardMaterial color="#334155" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
        {/* Site A Beacon */}
        <mesh position={[-0.22, 0.12, -0.14]}>
          <cylinderGeometry args={[0.02, 0.02, 0.24, 8]} />
          <meshStandardMaterial color="#ff4655" emissive="#ff4655" emissiveIntensity={1.6} />
        </mesh>
        {/* Site B Beacon */}
        <mesh position={[0.26, 0.12, 0.16]}>
          <cylinderGeometry args={[0.02, 0.02, 0.24, 8]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.4} />
        </mesh>
      </group>

      {/* PROP B: WEAPONS — Tactical Rifle Silhouette resting near archway */}
      <group
        ref={weaponPropRef}
        position={[0.45, 0.55, -0.85]}
        rotation={[0.22, 0.45, -0.18]}
      >
        <mesh castShadow>
          <boxGeometry args={[1.05, 0.14, 0.06]} />
          <meshStandardMaterial color="#16191e" roughness={0.35} metalness={0.7} />
        </mesh>
        <mesh position={[0.68, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} />
          <meshStandardMaterial color="#2d333b" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[-0.06, -0.15, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.12, 0.2, 0.05]} />
          <meshStandardMaterial color="#111316" roughness={0.5} metalness={0.5} />
        </mesh>
        {/* Red Optic dot */}
        <mesh position={[0.1, 0.09, 0]}>
          <boxGeometry args={[0.09, 0.04, 0.03]} />
          <meshStandardMaterial color="#ff4655" emissive="#ff4655" emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* PROP C: SKINS — Radiant Collection Relic */}
      <group ref={skinArtifactRef} position={[-1.5, 1.25, 0.6]} scale={0.001}>
        <mesh castShadow>
          <dodecahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.9}
            roughness={0.15}
            metalness={0.65}
          />
        </mesh>
        <pointLight color="#f59e0b" intensity={2.2} distance={2.8} />
      </group>

      {/* ════════════════════════════════════════════════════
          8. ATMOSPHERIC SUNBEAM DUST PARTICLES
      ════════════════════════════════════════════════════ */}
      <points ref={dustParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.032}
          color={HOME_WORLD_CONFIG.palette.dustMotes}
          transparent
          opacity={0.55}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Ground Contact Shadow */}
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.5, 6.0]} />
        <meshBasicMaterial color="#080a0d" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}
