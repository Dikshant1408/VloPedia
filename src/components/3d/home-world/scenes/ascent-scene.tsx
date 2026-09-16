"use client";

/**
 * Ascent Scene — VloPedia inaugural cinematic environment.
 *
 * Art Direction:
 *   - Genuine daylight Mediterranean atmosphere: warm limestone, pale stucco,
 *     terracotta roof tiles, and an airy daylight cream/blue sky.
 *   - No generic dark gaming voids or red emissive architectural LED strips.
 *   - Clear focal hierarchy: 1. Stylized Agent Subject -> 2. Architecture -> 3. Environment.
 *   - Stylized silhouette agent with tailored coat drape and cinematic rim light,
 *     avoiding low-poly primitive mannequins.
 *   - Coordinated 12-second cinematic cycle for calm, living atmosphere.
 */

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Sunlit Mediterranean Palette
const P = {
  stoneCream:    "#ded2c0",   // Sunlit Venetian limestone / marble face
  stoneWarm:     "#c2b19b",   // Warm lit stone midtone
  stoneShadow:   "#82725e",   // Soft warm ambient shadow in daylight
  stoneDark:     "#635545",   // Deep architectural crevices
  plasterWarm:   "#ece0ce",   // Pale Mediterranean stucco plaster
  plasterLit:    "#f7f0e4",   // Highlit stucco wall
  terracotta:    "#b85438",   // Warm Italian clay roof tiles & cornices
  terracottaDark:"#913c24",   // Shaded terracotta tile edge
  floorBase:     "#b5a48e",   // Courtyard base flagstones
  floorInlay:    "#a4937d",   // Decorative geometric inlay paving
  woodWarm:      "#6a4e36",   // Cedar pergola beams & lintels
  metalTactical: "#3c434c",   // Neutral matte tactical metal
  metalHighlight:"#56606d",   // Polished crate bevel
  skyDaylight:   "#86b6e4",   // Far daylight Mediterranean sky
  skyHorizon:    "#eee7d8",   // Warm golden horizon haze
  fogSunlit:     "#dfebf7",   // Sunlit atmospheric depth haze
  dustGold:      "#ffe8bf",   // Warm golden dust motes in sunbeams
  rimRed:        "#ff4655",   // VALORANT red — strictly reserved for agent silhouette rim
} as const;

interface AscentSceneObjectsProps {
  prefersReducedMotion?: boolean;
}

export function AscentSceneObjects({ prefersReducedMotion = false }: AscentSceneObjectsProps) {
  const agentGroupRef = useRef<THREE.Group>(null);
  const coatRef       = useRef<THREE.Group>(null);
  const rimLightRef   = useRef<THREE.PointLight>(null);
  const sunbeamRef    = useRef<THREE.Group>(null);
  const dustRef       = useRef<THREE.Points>(null);

  // Warm golden sunlit dust motes suspended in courtyard air
  const { dustPos, dustPhase, dustSpeed } = useMemo(() => {
    const count = 65;
    const pos   = new Float32Array(count * 3);
    const phase = new Float32Array(count);
    const speed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3]     = (Math.random() - 0.5) * 8.0;
      pos[i3 + 1] = Math.random() * 4.2 + 0.2;
      pos[i3 + 2] = (Math.random() - 0.5) * 6.5;
      phase[i]    = Math.random() * Math.PI * 2;
      speed[i]    = 0.4 + Math.random() * 0.6;
    }
    return { dustPos: pos, dustPhase: phase, dustSpeed: speed };
  }, []);

  // ── Coordinated 12-Second Cinematic Loop ──
  useFrame((state) => {
    if (prefersReducedMotion) return;

    const t = state.clock.getElapsedTime();
    const cycle = (t % 12) / 12; // Normalized 0..1 over 12s
    const angle = cycle * Math.PI * 2;

    // 1. Agent subtle breathing & weight shift (harmonic sine loop)
    if (agentGroupRef.current) {
      // Natural respiratory rise and slight lateral weight shift
      const breath = Math.sin(angle);
      const sway   = Math.cos(angle * 0.5);
      agentGroupRef.current.position.y = 0.58 + breath * 0.012;
      agentGroupRef.current.rotation.y = 0.32 + sway * 0.015;
    }

    // 2. Tactical coat cloth gentle drape motion in the sea breeze
    if (coatRef.current) {
      const wind = Math.sin(angle * 1.5 + 0.4);
      coatRef.current.rotation.z = wind * 0.02;
      coatRef.current.rotation.x = Math.cos(angle * 1.2) * 0.015;
    }

    // 3. Subtle daylight sunbeam shimmer / atmospheric refraction
    if (sunbeamRef.current) {
      sunbeamRef.current.rotation.y = Math.sin(angle * 0.8) * 0.02;
    }

    // 4. Rim light pulse — sunbeam grazing agent's silhouette
    if (rimLightRef.current) {
      rimLightRef.current.intensity = 0.85 + Math.sin(angle * 2.0) * 0.08;
    }

    // 5. Dust motes drifting gently through the sunlit air
    if (dustRef.current) {
      const arr = dustRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < dustPhase.length; i++) {
        const i3 = i * 3;
        // Harmonic vertical and lateral drift
        arr[i3 + 1] = dustPos[i3 + 1] + Math.sin(t * 0.4 * dustSpeed[i] + dustPhase[i]) * 0.22;
        arr[i3]     = dustPos[i3]     + Math.cos(t * 0.25 * dustSpeed[i] + dustPhase[i]) * 0.12;
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>

      {/* ═══════════════════════════════════════════════════════
          SKY HORIZON & DISTANT ATMOSPHERE
          Pale daylight gradient — warmth on the horizon, blue above.
      ═══════════════════════════════════════════════════════ */}
      <mesh position={[0, 4.5, -11.0]}>
        <planeGeometry args={[26, 15]} />
        <meshBasicMaterial color={P.skyDaylight} />
      </mesh>
      {/* Warm horizon haze plane */}
      <mesh position={[0, 1.2, -10.5]}>
        <planeGeometry args={[24, 7]} />
        <meshBasicMaterial color={P.skyHorizon} transparent opacity={0.65} />
      </mesh>

      {/* ═══════════════════════════════════════════════════════
          BACKGROUND — Ascent Clock Tower & Venetian Rooflines
          Clean architectural silhouettes against the Mediterranean daylight.
      ═══════════════════════════════════════════════════════ */}
      <group position={[0, 0, -7.5]}>
        {/* Main Clock Tower Shaft */}
        <mesh position={[-3.0, 3.4, 0]} receiveShadow>
          <boxGeometry args={[0.95, 8.8, 0.95]} />
          <meshStandardMaterial color={P.stoneCream} roughness={0.88} metalness={0.05} />
        </mesh>
        {/* Clock Face Panel (Venetian circular recessed dial) */}
        <mesh position={[-3.0, 6.2, 0.49]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.05, 24]} />
          <meshStandardMaterial color={P.stoneShadow} roughness={0.9} />
        </mesh>
        {/* Clock hands / center pin */}
        <mesh position={[-3.0, 6.2, 0.52]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color={P.stoneDark} />
        </mesh>

        {/* Tower Belfry Cornice */}
        <mesh position={[-3.0, 7.85, 0]}>
          <boxGeometry args={[1.22, 0.35, 1.22]} />
          <meshStandardMaterial color={P.stoneWarm} roughness={0.85} />
        </mesh>
        {/* Open Belfry Arched Piers */}
        <mesh position={[-3.38, 8.4, 0]}>
          <boxGeometry args={[0.22, 0.85, 0.9]} />
          <meshStandardMaterial color={P.stoneWarm} roughness={0.85} />
        </mesh>
        <mesh position={[-2.62, 8.4, 0]}>
          <boxGeometry args={[0.22, 0.85, 0.9]} />
          <meshStandardMaterial color={P.stoneWarm} roughness={0.85} />
        </mesh>
        {/* Bell suggestion inside belfry aperture */}
        <mesh position={[-3.0, 8.4, 0]}>
          <cylinderGeometry args={[0.12, 0.18, 0.35, 12]} />
          <meshStandardMaterial color={P.metalTactical} roughness={0.6} metalness={0.4} />
        </mesh>

        {/* Terracotta Pyramid Roof Peak */}
        <mesh position={[-3.0, 9.25, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.78, 1.15, 4]} />
          <meshStandardMaterial color={P.terracotta} roughness={0.75} />
        </mesh>

        {/* Right Venetian Villa Massing */}
        <mesh position={[3.2, 1.8, -0.6]} receiveShadow>
          <boxGeometry args={[3.2, 5.4, 1.8]} />
          <meshStandardMaterial color={P.plasterWarm} roughness={0.92} />
        </mesh>
        {/* Terracotta Pitch Roof */}
        <mesh position={[3.2, 4.65, -0.6]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[3.4, 0.35, 2.0]} />
          <meshStandardMaterial color={P.terracotta} roughness={0.78} />
        </mesh>
        {/* Classical Chimneys */}
        <mesh position={[2.2, 5.3, -0.5]}>
          <boxGeometry args={[0.32, 1.2, 0.32]} />
          <meshStandardMaterial color={P.plasterLit} roughness={0.85} />
        </mesh>
        <mesh position={[3.6, 5.1, -0.7]}>
          <boxGeometry args={[0.26, 0.9, 0.26]} />
          <meshStandardMaterial color={P.plasterLit} roughness={0.85} />
        </mesh>

        {/* Left Side Terracotta Stepped Building */}
        <mesh position={[-0.9, 1.0, 0.2]} receiveShadow>
          <boxGeometry args={[2.2, 3.6, 1.2]} />
          <meshStandardMaterial color={P.plasterWarm} roughness={0.9} />
        </mesh>
        <mesh position={[-0.9, 2.9, 0.2]}>
          <boxGeometry args={[2.35, 0.24, 1.35]} />
          <meshStandardMaterial color={P.terracotta} roughness={0.75} />
        </mesh>

        {/* Atmospheric Depth Fog Plane separating background from courtyard */}
        <mesh position={[0, 1.8, 1.5]}>
          <planeGeometry args={[16, 6]} />
          <meshBasicMaterial color={P.fogSunlit} transparent opacity={0.22} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════
          MIDGROUND — Sunlit Courtyard Platform & Roman Archway
          Authentic limestone masonry, arches, and cedar timber pergola.
      ═══════════════════════════════════════════════════════ */}
      <group position={[0, 0, -3.2]}>
        {/* Courtyard Raised Platform Base */}
        <mesh position={[0, 0.12, 0]} receiveShadow>
          <boxGeometry args={[7.2, 0.3, 4.8]} />
          <meshStandardMaterial color={P.floorBase} roughness={0.84} metalness={0.06} />
        </mesh>

        {/* Decorative Flagstone Inlay Pattern */}
        <mesh position={[0, 0.28, 0.2]} receiveShadow>
          <boxGeometry args={[4.2, 0.04, 3.4]} />
          <meshStandardMaterial color={P.floorInlay} roughness={0.78} metalness={0.08} />
        </mesh>

        {/* ── Roman Semicircular Archway Wall ── */}
        {/* Left Archway Pier */}
        <mesh position={[-0.95, 1.6, -0.4]} receiveShadow castShadow>
          <boxGeometry args={[0.55, 2.8, 0.42]} />
          <meshStandardMaterial color={P.stoneCream} roughness={0.82} metalness={0.05} />
        </mesh>
        {/* Left Pier Capital / Trim */}
        <mesh position={[-0.95, 2.95, -0.4]}>
          <boxGeometry args={[0.65, 0.16, 0.48]} />
          <meshStandardMaterial color={P.stoneWarm} roughness={0.8} />
        </mesh>

        {/* Right Archway Pier */}
        <mesh position={[1.35, 1.6, -0.4]} receiveShadow castShadow>
          <boxGeometry args={[0.55, 2.8, 0.42]} />
          <meshStandardMaterial color={P.stoneCream} roughness={0.82} metalness={0.05} />
        </mesh>
        {/* Right Pier Capital / Trim */}
        <mesh position={[1.35, 2.95, -0.4]}>
          <boxGeometry args={[0.65, 0.16, 0.48]} />
          <meshStandardMaterial color={P.stoneWarm} roughness={0.8} />
        </mesh>

        {/* Archway Entablature / Lintel Beam */}
        <mesh position={[0.2, 3.3, -0.4]} receiveShadow castShadow>
          <boxGeometry args={[3.2, 0.55, 0.48]} />
          <meshStandardMaterial color={P.stoneCream} roughness={0.8} />
        </mesh>
        {/* Keystone Centerpiece (Authentic Roman masonry) */}
        <mesh position={[0.2, 3.05, -0.16]}>
          <boxGeometry args={[0.28, 0.48, 0.12]} />
          <meshStandardMaterial color={P.stoneWarm} roughness={0.75} />
        </mesh>

        {/* Cedar Timber Pergola Beams extending across archway */}
        <group position={[0.2, 3.65, 0]}>
          {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]} castShadow>
              <boxGeometry args={[0.12, 0.16, 1.6]} />
              <meshStandardMaterial color={P.woodWarm} roughness={0.7} metalness={0.1} />
            </mesh>
          ))}
        </group>

        {/* Left Adjoining Courtyard Wall */}
        <mesh position={[-2.6, 1.3, -0.4]} receiveShadow castShadow>
          <boxGeometry args={[2.8, 2.3, 0.36]} />
          <meshStandardMaterial color={P.plasterWarm} roughness={0.9} />
        </mesh>
        {/* Wall Terracotta Capstone */}
        <mesh position={[-2.6, 2.48, -0.4]}>
          <boxGeometry args={[2.95, 0.12, 0.44]} />
          <meshStandardMaterial color={P.terracotta} roughness={0.75} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════
          FOREGROUND — Parapet Wall & Tactical Supply Container
          Frames the shot with cinematic foreground depth.
      ═══════════════════════════════════════════════════════ */}
      {/* Right Fore Parapet Wall */}
      <group position={[2.8, 0.3, 1.8]} rotation={[0, -0.32, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[2.4, 0.75, 0.46]} />
          <meshStandardMaterial color={P.stoneWarm} roughness={0.85} metalness={0.05} />
        </mesh>
        {/* Sunlit Limestone Capstone */}
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[2.52, 0.1, 0.54]} />
          <meshStandardMaterial color={P.stoneCream} roughness={0.78} />
        </mesh>
      </group>

      {/* Matte Tactical Container (Neutral hardware, zero emissive strips) */}
      <group position={[-2.3, 0.45, 0.6]} rotation={[0, -0.22, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.78, 0.78, 0.78]} />
          <meshStandardMaterial color={P.metalTactical} roughness={0.48} metalness={0.35} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.82, 0.22, 0.82]} />
          <meshStandardMaterial color={P.metalHighlight} roughness={0.55} metalness={0.25} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════
          FOCAL SUBJECT — Stylized Silhouetted Agent
          Standing in deliberate hero posture, 3/4 back-facing towards
          the sunlit archway. Flowing tailored coat silhouette,
          high tactical collar, chiaroscuro rim lighting.
          (Eliminates generic low-poly mannequin boxes/cylinders).
      ═══════════════════════════════════════════════════════ */}
      <group ref={agentGroupRef} position={[-0.45, 0.58, -1.35]} rotation={[0, 0.32, 0]}>
        {/* Ground Occlusion Shadow under Agent */}
        <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.85, 0.85]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.4} />
        </mesh>

        {/* Tailored Tactical Coat Drape (Flowing asymmetrical silhouette) */}
        <group ref={coatRef}>
          {/* Upper Coat / Shoulders (Tailored broad silhouette) */}
          <mesh position={[0, 0.48, -0.02]} castShadow>
            <boxGeometry args={[0.52, 0.38, 0.26]} />
            <meshStandardMaterial color={P.stoneDark} roughness={0.65} metalness={0.15} />
          </mesh>

          {/* High Architectural Collar / Cowl framing the silhouette */}
          <mesh position={[0, 0.74, -0.04]} castShadow>
            <cylinderGeometry args={[0.18, 0.22, 0.22, 16, 1, true]} />
            <meshStandardMaterial color={P.stoneDark} roughness={0.7} side={THREE.DoubleSide} />
          </mesh>

          {/* Agent Head / Hooded Silhouette (Obscured facial detail, strong edge) */}
          <mesh position={[0, 0.84, -0.02]} castShadow>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial color={P.stoneDark} roughness={0.7} />
          </mesh>

          {/* Flowing Mid-Coat Body */}
          <mesh position={[0, 0.16, 0.01]} castShadow>
            <cylinderGeometry args={[0.22, 0.32, 0.52, 16]} />
            <meshStandardMaterial color={P.stoneDark} roughness={0.68} metalness={0.12} />
          </mesh>

          {/* Asymmetrical Coat Tails / Hem swaying in the breeze */}
          <mesh position={[-0.04, -0.22, 0.04]} rotation={[0.08, 0, -0.05]} castShadow>
            <cylinderGeometry args={[0.31, 0.42, 0.58, 16, 1, true]} />
            <meshStandardMaterial color={P.stoneDark} roughness={0.72} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Tapered Tactical Stance (Slim boots grounded on Mediterranean stone) */}
        <mesh position={[-0.1, -0.38, -0.02]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 0.44, 12]} />
          <meshStandardMaterial color={P.stoneDark} roughness={0.8} />
        </mesh>
        <mesh position={[0.12, -0.38, -0.02]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 0.44, 12]} />
          <meshStandardMaterial color={P.stoneDark} roughness={0.8} />
        </mesh>

        {/* ── Cinematic 3-Point Character Lighting ── */}
        {/* 1. VALORANT Red Rim Backlight — cuts the dark coat against the sunlit archway */}
        <pointLight
          ref={rimLightRef}
          color={P.rimRed}
          intensity={0.85}
          distance={3.2}
          position={[-0.55, 0.85, -0.75]}
        />
        {/* 2. Soft Sky Blue Fill — cool daylight separation from left */}
        <pointLight
          color={P.skyDaylight}
          intensity={0.45}
          distance={3.0}
          position={[-1.2, 0.6, 0.4]}
        />
        {/* 3. Warm Mediterranean Stone Ambient Bounce from courtyard floor */}
        <pointLight
          color={P.stoneCream}
          intensity={0.35}
          distance={2.4}
          position={[0.4, -0.1, 0.8]}
        />
      </group>

      {/* ═══════════════════════════════════════════════════════
          ATMOSPHERE — Golden Dust Motes Catching Sunbeams
      ═══════════════════════════════════════════════════════ */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPos, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.038}
          color={P.dustGold}
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default AscentSceneObjects;
