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
  // References for reactive transition elements
  const agentEmblemRef = useRef<THREE.Group>(null);
  const mapRadarRef = useRef<THREE.Group>(null);
  const weaponPropRef = useRef<THREE.Group>(null);
  const skinArtifactRef = useRef<THREE.Group>(null);
  const dustParticlesRef = useRef<THREE.Points>(null);

  // Target opacities for smooth category interpolation
  const categoryWeights = useRef({
    agents: 0,
    maps: 0,
    weapons: 0,
    skins: 0,
  });

  // 1. Generate Dust Particle Positions
  const { dustPositions, dustInitY } = useMemo(() => {
    const count = 55;
    const positions = new Float32Array(count * 3);
    const initY = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 4.5;
      positions[i3 + 1] = Math.random() * 2.8 + 0.1;
      positions[i3 + 2] = (Math.random() - 0.5) * 3.5;
      initY[i] = positions[i3 + 1];
    }
    return { dustPositions: positions, dustInitY: initY };
  }, []);

  // Frame Loop for Animations and State Lerping
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const lerpSpeed = delta * 5.0;

    // Interpolate category weights smoothly
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

    // Update Agent Emblem
    if (agentEmblemRef.current) {
      const w = categoryWeights.current.agents;
      agentEmblemRef.current.scale.setScalar(THREE.MathUtils.lerp(0.001, 1, w));
      if (!prefersReducedMotion) {
        agentEmblemRef.current.rotation.y = t * 0.4;
        agentEmblemRef.current.position.y = 1.1 + Math.sin(t * 1.5) * 0.04;
      }
    }

    // Update Map Radar Hologram
    if (mapRadarRef.current) {
      const w = categoryWeights.current.maps;
      mapRadarRef.current.scale.setScalar(THREE.MathUtils.lerp(0.001, 1, w));
      if (!prefersReducedMotion) {
        mapRadarRef.current.rotation.y = t * 0.2;
      }
    }

    // Update Weapon Silhouette Highlight
    if (weaponPropRef.current) {
      const w = categoryWeights.current.weapons;
      weaponPropRef.current.scale.setScalar(THREE.MathUtils.lerp(0.85, 1.05, w));
      weaponPropRef.current.position.y = THREE.MathUtils.lerp(0.45, 0.52, w);
    }

    // Update Skin Radiant Artifact
    if (skinArtifactRef.current) {
      const w = categoryWeights.current.skins;
      skinArtifactRef.current.scale.setScalar(THREE.MathUtils.lerp(0.001, 1, w));
      if (!prefersReducedMotion) {
        skinArtifactRef.current.rotation.x = t * 0.6;
        skinArtifactRef.current.rotation.y = t * 0.8;
        skinArtifactRef.current.position.y = 0.95 + Math.sin(t * 2.0) * 0.05;
      }
    }

    // Dust particles gentle vertical drift
    if (dustParticlesRef.current && !prefersReducedMotion) {
      const pos = dustParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < dustInitY.length; i++) {
        const i3 = i * 3;
        pos[i3 + 1] = dustInitY[i] + Math.sin(t * 0.5 + i) * 0.25;
      }
      dustParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -0.3, 0]}>
      {/* ════════════════════════════════════════════════════
          1. FLOATING TACTICAL DIORAMA PLATFORM
      ════════════════════════════════════════════════════ */}
      {/* Main beveled foundation slab */}
      <mesh position={[0, -0.12, 0]} receiveShadow castShadow>
        <boxGeometry args={[3.2, 0.24, 2.6]} />
        <meshStandardMaterial
          color={HOME_WORLD_CONFIG.palette.platformBase}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Platform edge border trim */}
      <mesh position={[0, -0.12, 1.31]}>
        <boxGeometry args={[3.22, 0.12, 0.04]} />
        <meshStandardMaterial
          color={HOME_WORLD_CONFIG.palette.platformTrim}
          roughness={0.5}
          metalness={0.4}
        />
      </mesh>
      <mesh position={[0, -0.12, -1.31]}>
        <boxGeometry args={[3.22, 0.12, 0.04]} />
        <meshStandardMaterial
          color={HOME_WORLD_CONFIG.palette.platformTrim}
          roughness={0.5}
          metalness={0.4}
        />
      </mesh>

      {/* Platform surface grid inlay (subtle architectural grooving) */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.8, 2.2]} />
        <meshStandardMaterial
          color="#1e2329"
          roughness={0.8}
          metalness={0.1}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>

      {/* Subtle VALORANT Red inset edge accent line */}
      <mesh position={[-1.38, 0.01, 0]}>
        <boxGeometry args={[0.04, 0.015, 2.0]} />
        <meshStandardMaterial
          color={HOME_WORLD_CONFIG.palette.crateAccentRed}
          emissive={HOME_WORLD_CONFIG.palette.crateAccentRed}
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* ════════════════════════════════════════════════════
          2. ARCHITECTURAL ELEVATION STEPS
      ════════════════════════════════════════════════════ */}
      <group position={[1.1, 0, 0.6]}>
        <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.8, 0.1, 0.45]} />
          <meshStandardMaterial color="#262b32" roughness={0.7} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.14, -0.32]} receiveShadow castShadow>
          <boxGeometry args={[0.8, 0.08, 0.4]} />
          <meshStandardMaterial color="#22272e" roughness={0.7} metalness={0.2} />
        </mesh>
      </group>

      {/* ════════════════════════════════════════════════════
          3. MINIMALIST WALL & DOORWAY REVEAL
      ════════════════════════════════════════════════════ */}
      <group position={[-0.8, 0.85, -0.75]} rotation={[0, 0.15, 0]}>
        {/* Main concrete wall block */}
        <mesh receiveShadow castShadow>
          <boxGeometry args={[1.5, 1.7, 0.16]} />
          <meshStandardMaterial
            color={HOME_WORLD_CONFIG.palette.wallBase}
            roughness={0.85}
            metalness={0.1}
          />
        </mesh>

        {/* Angled architectural reveal chamfer */}
        <mesh position={[0.74, 0, 0]} rotation={[0, 0.45, 0]}>
          <boxGeometry args={[0.2, 1.7, 0.12]} />
          <meshStandardMaterial color="#1a1e23" roughness={0.6} metalness={0.3} />
        </mesh>

        {/* Industrial conduit run at base of wall */}
        <mesh position={[0, -0.78, 0.11]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 1.48, 12]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.7} />
        </mesh>
      </group>

      {/* ════════════════════════════════════════════════════
          4. TACTICAL RADIANITE CONTAINER / CRATE
      ════════════════════════════════════════════════════ */}
      <group position={[-0.75, 0.28, 0.4]} rotation={[0, -0.22, 0]}>
        {/* Main crate body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.55, 0.55, 0.55]} />
          <meshStandardMaterial
            color={HOME_WORLD_CONFIG.palette.crateMetal}
            roughness={0.45}
            metalness={0.5}
          />
        </mesh>

        {/* Crate corner protection bumpers */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.58, 0.12, 0.58]} />
          <meshStandardMaterial color="#2d333b" roughness={0.6} metalness={0.3} />
        </mesh>

        {/* Red tactical seal line */}
        <mesh position={[0, 0, 0.28]}>
          <boxGeometry args={[0.42, 0.025, 0.015]} />
          <meshStandardMaterial
            color={HOME_WORLD_CONFIG.palette.crateAccentRed}
            emissive={HOME_WORLD_CONFIG.palette.crateAccentRed}
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>

      {/* ════════════════════════════════════════════════════
          5. REACTIVE THEMATIC PROPS (HOVER INTERACTIONS)
      ════════════════════════════════════════════════════ */}

      {/* PROP A: AGENTS — Holographic Emblem */}
      <group ref={agentEmblemRef} position={[0.55, 1.1, 0.1]} scale={0.001}>
        <mesh>
          <octahedronGeometry args={[0.26, 0]} />
          <meshStandardMaterial
            color="#ff4655"
            emissive="#ff4655"
            emissiveIntensity={1.2}
            wireframe
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>
        <pointLight color="#ff4655" intensity={1.5} distance={2.5} />
      </group>

      {/* PROP B: MAPS — Holographic Radar Sandtable */}
      <group ref={mapRadarRef} position={[0.2, 0.05, 0.2]} scale={0.001}>
        {/* Radar disc ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.44, 32]} />
          <meshStandardMaterial
            color="#94a3b8"
            emissive="#94a3b8"
            emissiveIntensity={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Radar center grid */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.39, 24]} />
          <meshStandardMaterial
            color="#334155"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Site A Beacon */}
        <mesh position={[-0.18, 0.08, -0.1]}>
          <cylinderGeometry args={[0.015, 0.015, 0.16, 8]} />
          <meshStandardMaterial color="#ff4655" emissive="#ff4655" emissiveIntensity={1.5} />
        </mesh>
        {/* Site B Beacon */}
        <mesh position={[0.2, 0.08, 0.12]}>
          <cylinderGeometry args={[0.015, 0.015, 0.16, 8]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* PROP C: WEAPONS — Rifle Silhouette leaning on wall */}
      <group
        ref={weaponPropRef}
        position={[-0.35, 0.48, -0.55]}
        rotation={[0.18, 0.35, -0.15]}
      >
        {/* Stock & receiver body */}
        <mesh castShadow>
          <boxGeometry args={[0.85, 0.12, 0.05]} />
          <meshStandardMaterial
            color="#181b20"
            roughness={0.35}
            metalness={0.7}
          />
        </mesh>
        {/* Barrel */}
        <mesh position={[0.55, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.38, 8]} />
          <meshStandardMaterial color="#2d333b" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Magazine */}
        <mesh position={[-0.05, -0.12, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.1, 0.16, 0.04]} />
          <meshStandardMaterial color="#111316" roughness={0.5} metalness={0.5} />
        </mesh>
        {/* Red optic point */}
        <mesh position={[0.08, 0.08, 0]}>
          <boxGeometry args={[0.08, 0.04, 0.03]} />
          <meshStandardMaterial color="#ff4655" emissive="#ff4655" emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* PROP D: SKINS — Radiant Artisan Artifact */}
      <group ref={skinArtifactRef} position={[-0.75, 0.95, 0.4]} scale={0.001}>
        <mesh castShadow>
          <dodecahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.8}
            roughness={0.15}
            metalness={0.6}
          />
        </mesh>
        <pointLight color="#f59e0b" intensity={1.8} distance={2.2} />
      </group>

      {/* ════════════════════════════════════════════════════
          6. FLOATING DUST / ATMOSPHERIC MOTES
      ════════════════════════════════════════════════════ */}
      <points ref={dustParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color={HOME_WORLD_CONFIG.palette.dustMotes}
          transparent
          opacity={0.45}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Ground Contact Shadow Plane */}
      <mesh position={[0, -0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, 3.6]} />
        <meshBasicMaterial color="#0b0e11" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}
