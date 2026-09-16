"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HOME_WORLD_CONFIG } from "./home-world.config";

interface HomeWorldObjectsProps {
  prefersReducedMotion?: boolean;
}

export function HomeWorldObjects({ prefersReducedMotion = false }: HomeWorldObjectsProps) {
  const agentRef = useRef<THREE.Group>(null);
  const rimLightRef = useRef<THREE.PointLight>(null);
  const dustRef = useRef<THREE.Points>(null);

  const { dustPositions, dustPhases } = useMemo(() => {
    const count = 80;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 8.0;
      positions[i3 + 1] = Math.random() * 4.5 + 0.2;
      positions[i3 + 2] = (Math.random() - 0.5) * 6.5;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { dustPositions: positions, dustPhases: phases };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (agentRef.current && !prefersReducedMotion) {
      agentRef.current.position.y = 0.52 + Math.sin(t * 1.1) * 0.012;
      agentRef.current.rotation.y = 0.35 + Math.sin(t * 0.4) * 0.018;
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity = 0.65 + Math.sin(t * 1.8) * 0.12;
    }
    if (dustRef.current && !prefersReducedMotion) {
      const pos = dustRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < dustPhases.length; i++) {
        const i3 = i * 3;
        pos[i3 + 1] = dustPositions[i3 + 1] + Math.sin(t * 0.38 + dustPhases[i]) * 0.22;
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>

      {/* BACKGROUND — Ascent-inspired layered skyline */}
      <group position={[0, 0, -6.5]}>
        <mesh position={[-3.2, 1.8, 0]}>
          <boxGeometry args={[0.55, 5.5, 0.55]} />
          <meshStandardMaterial color="#0a0c10" roughness={1} metalness={0} />
        </mesh>
        <mesh position={[3.6, 2.4, -0.5]}>
          <boxGeometry args={[0.7, 7.0, 0.7]} />
          <meshStandardMaterial color="#09090c" roughness={1} metalness={0} />
        </mesh>
        <mesh position={[-1.4, 1.0, 0.4]}>
          <boxGeometry args={[1.0, 3.2, 0.8]} />
          <meshStandardMaterial color="#0c0e13" roughness={1} metalness={0} />
        </mesh>
        <mesh position={[1.6, 0.8, 0.2]}>
          <boxGeometry args={[1.2, 2.8, 0.9]} />
          <meshStandardMaterial color="#0d0f14" roughness={1} metalness={0} />
        </mesh>
        <mesh position={[0, 1.0, 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[18, 6]} />
          <meshBasicMaterial color="#0a0c12" transparent opacity={0.38} depthWrite={false} />
        </mesh>
      </group>

      {/* MIDGROUND — Courtyard paving */}
      <mesh position={[0, -0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[7.0, 0.28, 5.5]} />
        <meshStandardMaterial color={HOME_WORLD_CONFIG.palette.platformBase} roughness={0.75} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.5, 5.0]} />
        <meshStandardMaterial color="#1c2028" roughness={0.85} metalness={0.08} polygonOffset polygonOffsetFactor={-1} />
      </mesh>
      <mesh position={[-2.8, 0.01, 0]}>
        <boxGeometry args={[0.04, 0.014, 4.2]} />
        <meshStandardMaterial color={HOME_WORLD_CONFIG.palette.crateAccentRed} emissive={HOME_WORLD_CONFIG.palette.crateAccentRed} emissiveIntensity={0.5} />
      </mesh>

      {/* MIDGROUND — Ascent wall + archway */}
      <group position={[-1.1, 1.4, -2.2]} rotation={[0, 0.15, 0]}>
        <mesh position={[-1.0, 0, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.6, 2.8, 0.28]} />
          <meshStandardMaterial color="#1e2430" roughness={0.9} metalness={0.08} />
        </mesh>
        <mesh position={[0.55, 1.1, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.3, 0.36, 0.28]} />
          <meshStandardMaterial color={HOME_WORLD_CONFIG.palette.wallAccent} roughness={0.75} metalness={0.2} />
        </mesh>
        <mesh position={[1.28, 0.1, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.38, 2.6, 0.28]} />
          <meshStandardMaterial color="#1a1f28" roughness={0.88} metalness={0.1} />
        </mesh>
        <mesh position={[0.2, -1.28, 0.17]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 3.2, 10]} />
          <meshStandardMaterial color="#2e3845" roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[-1.0, 1.42, 0.02]}>
          <boxGeometry args={[1.65, 0.035, 0.05]} />
          <meshStandardMaterial color="#ff4655" emissive="#ff4655" emissiveIntensity={0.55} />
        </mesh>
      </group>

      {/* FOREGROUND — Parapet wall */}
      <group position={[2.5, 0.18, 2.3]} rotation={[0, -0.38, 0]}>
        <mesh receiveShadow castShadow>
          <boxGeometry args={[2.0, 0.7, 0.38]} />
          <meshStandardMaterial color="#12151a" roughness={0.88} metalness={0.12} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <boxGeometry args={[2.06, 0.065, 0.44]} />
          <meshStandardMaterial color="#22282f" roughness={0.65} metalness={0.28} />
        </mesh>
        <mesh position={[-0.9, 0.52, 0]}>
          <boxGeometry args={[0.12, 0.38, 0.4]} />
          <meshStandardMaterial color="#1c2228" roughness={0.7} metalness={0.2} />
        </mesh>
        <mesh position={[0.9, 0.52, 0]}>
          <boxGeometry args={[0.12, 0.38, 0.4]} />
          <meshStandardMaterial color="#1c2228" roughness={0.7} metalness={0.2} />
        </mesh>
      </group>

      {/* Supply container — grounded */}
      <group position={[-2.0, 0.36, 0.9]} rotation={[0, -0.28, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.72, 0.72]} />
          <meshStandardMaterial color={HOME_WORLD_CONFIG.palette.crateMetal} roughness={0.48} metalness={0.52} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.76, 0.18, 0.76]} />
          <meshStandardMaterial color="#252c35" roughness={0.6} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.37]}>
          <boxGeometry args={[0.5, 0.028, 0.014]} />
          <meshStandardMaterial color="#ff4655" emissive="#ff4655" emissiveIntensity={0.75} />
        </mesh>
      </group>

      {/* Elevation steps */}
      <group position={[1.9, 0, 0.9]}>
        <mesh position={[0, 0.065, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.3, 0.13, 0.75]} />
          <meshStandardMaterial color="#20262e" roughness={0.72} metalness={0.18} />
        </mesh>
        <mesh position={[0, 0.19, -0.5]} receiveShadow castShadow>
          <boxGeometry args={[1.3, 0.13, 0.65]} />
          <meshStandardMaterial color="#1c2229" roughness={0.72} metalness={0.18} />
        </mesh>
      </group>

      {/* SUBJECT — Agent silhouette (always present, cinematic breathing) */}
      <group ref={agentRef} position={[-0.7, 0.52, -0.5]} rotation={[0, 0.35, 0]}>
        <mesh castShadow receiveShadow position={[0, 0.32, 0]}>
          <capsuleGeometry args={[0.155, 0.5, 8, 16]} />
          <meshStandardMaterial color="#111418" roughness={0.45} metalness={0.28} />
        </mesh>
        <mesh castShadow position={[0, 0.78, 0]}>
          <sphereGeometry args={[0.115, 16, 16]} />
          <meshStandardMaterial color="#181d22" roughness={0.42} metalness={0.22} />
        </mesh>
        <mesh position={[0, 0.56, 0]}>
          <boxGeometry args={[0.5, 0.095, 0.22]} />
          <meshStandardMaterial color="#1e242c" roughness={0.52} metalness={0.38} />
        </mesh>
        <mesh position={[-0.075, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.048, 0.058, 0.52, 8]} />
          <meshStandardMaterial color="#0f1215" roughness={0.65} />
        </mesh>
        <mesh position={[0.075, -0.16, 0]} castShadow>
          <cylinderGeometry args={[0.048, 0.058, 0.52, 8]} />
          <meshStandardMaterial color="#0f1215" roughness={0.65} />
        </mesh>
        <pointLight ref={rimLightRef} color="#ff4655" intensity={0.75} distance={3.2} position={[-0.4, 0.8, -0.6]} />
        <pointLight color="#c8d8e8" intensity={0.18} distance={2.5} position={[0.5, 0.6, 0.8]} />
      </group>

      {/* Weapon — always present, resting at archway */}
      <group position={[0.5, 0.56, -0.9]} rotation={[0.2, 0.42, -0.16]}>
        <mesh castShadow>
          <boxGeometry args={[1.1, 0.13, 0.06]} />
          <meshStandardMaterial color="#141820" roughness={0.32} metalness={0.72} />
        </mesh>
        <mesh position={[0.72, 0.01, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.48, 8]} />
          <meshStandardMaterial color="#252d38" roughness={0.28} metalness={0.82} />
        </mesh>
        <mesh position={[-0.05, -0.14, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.11, 0.22, 0.055]} />
          <meshStandardMaterial color="#0f1318" roughness={0.55} metalness={0.45} />
        </mesh>
        <mesh position={[0.12, 0.09, 0]}>
          <boxGeometry args={[0.085, 0.038, 0.032]} />
          <meshStandardMaterial color="#ff4655" emissive="#ff4655" emissiveIntensity={1.4} />
        </mesh>
        <mesh position={[-0.62, 0.015, 0]}>
          <boxGeometry args={[0.22, 0.09, 0.055]} />
          <meshStandardMaterial color="#191e26" roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* Atmospheric dust motes */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.028} color={HOME_WORLD_CONFIG.palette.dustMotes} transparent opacity={0.45} sizeAttenuation depthWrite={false} />
      </points>

      {/* Ground shadow */}
      <mesh position={[0, -0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.5, 7.0]} />
        <meshBasicMaterial color="#060810" transparent opacity={0.7} />
      </mesh>

    </group>
  );
}
