"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CoreDomain, DOMAIN_METADATA } from "./intelligence-core.config";

interface CoreSceneProps {
  activeDomain: CoreDomain;
  prefersReducedMotion?: boolean;
}

// ── 1. The Core Hero Object ────────────────────────────────────────────────

function IntelligenceCoreMesh({ activeDomain, prefersReducedMotion = false }: CoreSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const outerShellRef = useRef<THREE.Mesh>(null);
  const innerShellRef = useRef<THREE.Mesh>(null);
  const coreHeartRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.LineSegments>(null);
  const ringsGroupRef = useRef<THREE.Group>(null);
  const domainGroupRef = useRef<THREE.Group>(null);

  // Dynamic state targets
  const targetColor = useMemo(() => {
    return new THREE.Color(DOMAIN_METADATA[activeDomain]?.accentColor || "#FF4655");
  }, [activeDomain]);

  const currentColor = useRef(new THREE.Color("#FF4655"));
  const assemblyTime = useRef(0);
  const [isAssembled, setIsAssembled] = useState(prefersReducedMotion);

  // Mouse parallax tracking
  const { pointer } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });

  // Geometries memoized
  const outerGeo = useMemo(() => new THREE.IcosahedronGeometry(1.5, 0), []);
  const outerEdges = useMemo(() => new THREE.EdgesGeometry(outerGeo), [outerGeo]);
  const innerGeo = useMemo(() => new THREE.DodecahedronGeometry(1.15, 0), []);
  const heartGeo = useMemo(() => new THREE.OctahedronGeometry(0.7, 0), []);

  // Material definitions
  const outerMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#10141D",
      metalness: 0.88,
      roughness: 0.28,
      flatShading: true,
    });
  }, []);

  const innerGlassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#0D1118",
      transparent: true,
      opacity: 0.35,
      metalness: 0.95,
      roughness: 0.12,
      flatShading: true,
    });
  }, []);

  const heartMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#FF4655",
      emissive: "#FF4655",
      emissiveIntensity: 1.4,
      metalness: 0.2,
      roughness: 0.1,
      flatShading: true,
    });
  }, []);

  const wireframeMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: "#FF4655",
      transparent: true,
      opacity: 0.45,
    });
  }, []);

  // Domain specific geometries
  const ringGeo1 = useMemo(() => new THREE.RingGeometry(1.9, 1.93, 64), []);
  const ringGeo2 = useMemo(() => new THREE.RingGeometry(2.2, 2.22, 64), []);
  const reticleLineGeo = useMemo(() => {
    const points = [
      new THREE.Vector3(-2.6, 0, 0),
      new THREE.Vector3(2.6, 0, 0),
      new THREE.Vector3(0, -2.6, 0),
      new THREE.Vector3(0, 2.6, 0),
    ];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // 1. Discovery Assembly Transition (0 to 1.2s)
    if (!isAssembled) {
      assemblyTime.current += delta;
      const progress = Math.min(1, assemblyTime.current / 1.2);
      // Smooth cubic ease out
      const ease = 1 - Math.pow(1 - progress, 3);

      if (outerShellRef.current) {
        const scale = 1.6 - (1 - ease) * 0.4;
        outerShellRef.current.scale.setScalar(scale);
      }
      if (wireframeRef.current) {
        wireframeMaterial.opacity = 0.1 + ease * 0.4;
      }
      if (heartMaterial) {
        heartMaterial.emissiveIntensity = ease * 1.5;
      }
      if (progress >= 1) {
        setIsAssembled(true);
      }
    }

    // 2. Color Transition Lerp
    currentColor.current.lerp(targetColor, Math.min(1, delta * 4));
    if (heartMaterial) {
      heartMaterial.color.copy(currentColor.current);
      heartMaterial.emissive.copy(currentColor.current);
    }
    if (wireframeMaterial) {
      wireframeMaterial.color.copy(currentColor.current);
    }

    // 3. Subtle Parallax & Calm Idle Breathing (NO spinning!)
    if (!prefersReducedMotion && groupRef.current) {
      // Gentle mouse parallax
      targetRotation.current.x = pointer.y * 0.12;
      targetRotation.current.y = pointer.x * 0.18;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x + Math.sin(t * 0.4) * 0.015,
        Math.min(1, delta * 3)
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y + 0.35 + Math.sin(t * 0.25) * 0.02,
        Math.min(1, delta * 3)
      );

      // Subtle breathing
      const breath = 1 + Math.sin(t * 0.6) * 0.01;
      groupRef.current.scale.set(breath, breath, breath);

      // Heart inner pulse
      if (coreHeartRef.current) {
        const pulse = 1 + Math.sin(t * 1.8) * 0.035;
        coreHeartRef.current.scale.set(pulse, pulse, pulse);
        coreHeartRef.current.rotation.y = t * 0.05;
      }

      // Domain-specific subtle transformations
      if (domainGroupRef.current) {
        domainGroupRef.current.rotation.z = Math.sin(t * 0.3) * 0.04;
      }
    }

    // 4. Domain-specific material adaptations
    if (outerMaterial) {
      if (activeDomain === "skins") {
        outerMaterial.metalness = THREE.MathUtils.lerp(outerMaterial.metalness, 0.98, delta * 3);
        outerMaterial.roughness = THREE.MathUtils.lerp(outerMaterial.roughness, 0.08, delta * 3);
      } else {
        outerMaterial.metalness = THREE.MathUtils.lerp(outerMaterial.metalness, 0.88, delta * 3);
        outerMaterial.roughness = THREE.MathUtils.lerp(outerMaterial.roughness, 0.28, delta * 3);
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ── Layer 1: Outer Faceted Gunmetal Armor Shell ── */}
      <mesh ref={outerShellRef} geometry={outerGeo} material={outerMaterial} castShadow receiveShadow />

      {/* ── Layer 2: Precision Structural Chassis Edges ── */}
      <lineSegments ref={wireframeRef} geometry={outerEdges} material={wireframeMaterial} />

      {/* ── Layer 3: Smoked Translucent Silica Shield ── */}
      <mesh ref={innerShellRef} geometry={innerGeo} material={innerGlassMaterial} />

      {/* ── Layer 4: Central Radianite Crystalline Heart ── */}
      <mesh ref={coreHeartRef} geometry={heartGeo} material={heartMaterial} />

      {/* ── Layer 5: Internal Point Light Source ── */}
      <pointLight color={currentColor.current} intensity={2.2} distance={5} />

      {/* ── Layer 6: Concentric Tactical Telemetry Rings ── */}
      <group ref={ringsGroupRef} rotation={[Math.PI / 3, 0, 0]}>
        <mesh geometry={ringGeo1}>
          <meshBasicMaterial color={currentColor.current} transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
        <mesh geometry={ringGeo2} rotation={[0, 0, Math.PI / 4]}>
          <meshBasicMaterial color="#384556" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* ── Layer 7: Interactive Domain Transformation Overlays ── */}
      <group ref={domainGroupRef}>
        {/* AGENTS: 4 Tactical Ability Orbital Diamonds */}
        {activeDomain === "agents" && (
          <group>
            {[
              { pos: [0, 2.2, 0], label: "X" },
              { pos: [2.2, 0, 0], label: "E" },
              { pos: [0, -2.2, 0], label: "C" },
              { pos: [-2.2, 0, 0], label: "Q" },
            ].map((node, i) => (
              <mesh key={i} position={node.pos as [number, number, number]}>
                <octahedronGeometry args={[0.18, 0]} />
                <meshStandardMaterial
                  color="#FF4655"
                  emissive="#FF4655"
                  emissiveIntensity={1.8}
                  roughness={0.2}
                />
              </mesh>
            ))}
          </group>
        )}

        {/* WEAPONS: Ballistic Targeting Reticle Axis */}
        {activeDomain === "weapons" && (
          <group rotation={[0, 0, Math.PI / 4]}>
            <lineSegments geometry={reticleLineGeo}>
              <lineBasicMaterial color="#F59E0B" transparent opacity={0.5} />
            </lineSegments>
            {/* Range notch indicators */}
            {[-1.8, -0.9, 0.9, 1.8].map((offset, i) => (
              <mesh key={i} position={[offset, 0, 0]}>
                <boxGeometry args={[0.02, 0.2, 0.02]} />
                <meshBasicMaterial color="#F59E0B" />
              </mesh>
            ))}
          </group>
        )}

        {/* MAPS: Topographic Elevation Rings + Site Markers */}
        {activeDomain === "maps" && (
          <group>
            {[-0.6, 0, 0.6].map((y, i) => (
              <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.8 + i * 0.2, 1.82 + i * 0.2, 48]} />
                <meshBasicMaterial color="#0DF2F2" transparent opacity={0.35 - i * 0.08} side={THREE.DoubleSide} />
              </mesh>
            ))}
            {/* Site Markers A, B, C */}
            {[
              [-1.8, 0.2, 0.8],
              [0, 0.4, -1.8],
              [1.8, -0.1, 0.5],
            ].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]}>
                <boxGeometry args={[0.15, 0.15, 0.15]} />
                <meshStandardMaterial color="#0DF2F2" emissive="#0DF2F2" emissiveIntensity={1.5} />
              </mesh>
            ))}
          </group>
        )}

        {/* SKINS: Specular Prisms & Chromatic Accents */}
        {activeDomain === "skins" && (
          <group>
            {[
              [1.4, 1.4, 0.8],
              [-1.4, -1.2, 0.8],
              [0.8, -1.4, -1.2],
            ].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]}>
                <tetrahedronGeometry args={[0.16, 0]} />
                <meshStandardMaterial
                  color="#EAB308"
                  emissive="#EAB308"
                  emissiveIntensity={1.6}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
            ))}
          </group>
        )}

        {/* BUNDLES: Interconnected Collection Node Web */}
        {activeDomain === "bundles" && (
          <group>
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i * Math.PI * 2) / 5;
              const x = Math.cos(angle) * 2.1;
              const y = Math.sin(angle) * 2.1;
              return (
                <group key={i}>
                  <mesh position={[x, y, 0]}>
                    <dodecahedronGeometry args={[0.14, 0]} />
                    <meshStandardMaterial color="#EC4899" emissive="#EC4899" emissiveIntensity={1.5} />
                  </mesh>
                </group>
              );
            })}
          </group>
        )}

        {/* TOOLS: Analytical Matrix Dials */}
        {activeDomain === "tools" && (
          <group rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <mesh>
              <ringGeometry args={[2.0, 2.05, 32]} />
              <meshBasicMaterial color="#10B981" transparent opacity={0.4} side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 3]}>
              <ringGeometry args={[2.2, 2.24, 32]} />
              <meshBasicMaterial color="#06B6D4" transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}

// ── 2. Cinematic Lighting Rig ─────────────────────────────────────────────

function IntelligenceCoreLighting({ activeDomain }: { activeDomain: CoreDomain }) {
  const meta = DOMAIN_METADATA[activeDomain] || DOMAIN_METADATA.idle;

  return (
    <>
      {/* Soft gunmetal ambient floor */}
      <ambientLight color="#0D1118" intensity={1.2} />

      {/* Main crisp studio rim keylight */}
      <directionalLight
        position={[4, 5, 4]}
        intensity={2.8}
        color="#F8FAFC"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Soft cool fill from opposite flank */}
      <directionalLight
        position={[-5, -2, -3]}
        intensity={1.2}
        color="#1E293B"
      />

      {/* Domain-specific dramatic accent rim light */}
      <pointLight
        position={[-3, 2, 2]}
        color={meta.accentColor}
        intensity={1.8}
        distance={10}
      />

      {/* Bottom tactical reflection */}
      <pointLight
        position={[2, -4, 1]}
        color={meta.secondaryColor}
        intensity={1.0}
        distance={8}
      />
    </>
  );
}

// ── 3. Exported Interactive Canvas ────────────────────────────────────────

export function IntelligenceCore3D({
  activeDomain,
  prefersReducedMotion = false,
}: CoreSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      camera={{
        fov: 42,
        position: [0, 0.1, 5.2],
        near: 0.1,
        far: 25,
      }}
      className="h-full w-full pointer-events-none"
    >
      <IntelligenceCoreLighting activeDomain={activeDomain} />
      <IntelligenceCoreMesh
        activeDomain={activeDomain}
        prefersReducedMotion={prefersReducedMotion}
      />
    </Canvas>
  );
}
