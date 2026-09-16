"use client";

import React, { Suspense, useRef, lazy, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { HomeWorldCategory } from "../home-world.config";
import { HomeWorldCamera } from "./home-world-camera";
import { getActiveScene, type SceneDefinition } from "./scene-registry";

// ── Scene-level lighting driven by SceneDefinition config ─────────────────

function SceneLighting({
  sceneDef,
  isSearching,
}: {
  sceneDef: SceneDefinition;
  isSearching?: boolean;
}) {
  const ambRef = useRef<THREE.AmbientLight>(null);
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const accRef = useRef<THREE.PointLight>(null);
  const { lighting: L } = sceneDef;

  useFrame((_, delta) => {
    const dim = isSearching ? 0.42 : 1.0;
    const lf  = Math.min(1, delta * 4.0);

    if (ambRef.current) {
      ambRef.current.intensity = THREE.MathUtils.lerp(
        ambRef.current.intensity, L.ambientIntensity * dim, lf
      );
    }
    if (keyRef.current) {
      keyRef.current.intensity = THREE.MathUtils.lerp(
        keyRef.current.intensity, L.keyLightIntensity * dim, lf
      );
    }
    if (accRef.current) {
      accRef.current.intensity = THREE.MathUtils.lerp(
        accRef.current.intensity, L.accentIntensity * (isSearching ? 0.55 : 1.0), lf
      );
    }
  });

  return (
    <>
      <ambientLight ref={ambRef} color={L.ambientColor} intensity={L.ambientIntensity} />
      <directionalLight
        ref={keyRef}
        color={L.keyLightColor}
        intensity={L.keyLightIntensity}
        position={L.keyLightPosition}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={18}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-bias={-0.0005}
      />
      <pointLight
        ref={accRef}
        color={L.accentColor}
        intensity={L.accentIntensity}
        position={L.accentPosition}
        distance={8}
      />
      <directionalLight
        color={L.fillColor}
        intensity={L.fillIntensity}
        position={L.fillPosition}
      />
    </>
  );
}

// ── Scene loader — lazy-imports the correct SceneObjects per registry entry ──

function DynamicSceneObjects({
  sceneDef,
  prefersReducedMotion,
}: {
  sceneDef: SceneDefinition;
  prefersReducedMotion?: boolean;
}) {
  const [Component, setComponent] = useState<React.ComponentType<{ prefersReducedMotion?: boolean }> | null>(null);

  useEffect(() => {
    let cancelled = false;
    sceneDef.importObjects().then(({ SceneObjects }) => {
      if (!cancelled) setComponent(() => SceneObjects);
    });
    return () => { cancelled = true; };
  }, [sceneDef]);

  if (!Component) return null;
  return <Component prefersReducedMotion={prefersReducedMotion} />;
}

// ── Exported scene ────────────────────────────────────────────────────────

export interface HomeWorldSceneProps {
  activeCategory: HomeWorldCategory;
  isSearching?: boolean;
  prefersReducedMotion?: boolean;
}

export function HomeWorldScene({
  activeCategory,
  isSearching = false,
  prefersReducedMotion = false,
}: HomeWorldSceneProps) {
  // Scene resolved once per page session — no mid-session swap
  const [sceneDef] = useState<SceneDefinition>(() => getActiveScene());

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      camera={{
        fov: sceneDef.camera.fov,
        position: sceneDef.camera.states.idle.position,
        near: 0.1,
        far: 30,
      }}
      className="h-full w-full pointer-events-none"
    >
      <Suspense fallback={null}>
        <SceneLighting sceneDef={sceneDef} isSearching={isSearching} />
        <HomeWorldCamera
          activeCategory={activeCategory}
          cameraConfig={sceneDef.camera}
          prefersReducedMotion={prefersReducedMotion}
          isSearching={isSearching}
        />
        <DynamicSceneObjects
          sceneDef={sceneDef}
          prefersReducedMotion={prefersReducedMotion}
        />
      </Suspense>
    </Canvas>
  );
}
