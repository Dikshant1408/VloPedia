"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HOME_WORLD_CONFIG, type HomeWorldCategory } from "./home-world.config";
import { HomeWorldCamera } from "./home-world-camera";
import { HomeWorldObjects } from "./home-world-objects";

interface HomeWorldSceneProps {
  activeCategory: HomeWorldCategory;
  isSearching?: boolean;
  prefersReducedMotion?: boolean;
}

function SceneLighting({ isSearching }: { isSearching?: boolean }) {
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const accentLightRef = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    const lerpSpeed = delta * 4.0;
    const targetDim = isSearching ? 0.55 : 1.0;

    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(
        ambientLightRef.current.intensity,
        HOME_WORLD_CONFIG.lighting.ambientIntensity * targetDim,
        lerpSpeed
      );
    }
    if (keyLightRef.current) {
      keyLightRef.current.intensity = THREE.MathUtils.lerp(
        keyLightRef.current.intensity,
        HOME_WORLD_CONFIG.lighting.keyLightIntensity * targetDim,
        lerpSpeed
      );
    }
    if (accentLightRef.current) {
      accentLightRef.current.intensity = THREE.MathUtils.lerp(
        accentLightRef.current.intensity,
        HOME_WORLD_CONFIG.lighting.accentRedIntensity * (isSearching ? 0.7 : 1.0),
        lerpSpeed
      );
    }
  });

  return (
    <>
      {/* 1. Soft neutral ambient light */}
      <ambientLight
        ref={ambientLightRef}
        color={HOME_WORLD_CONFIG.lighting.ambientColor}
        intensity={HOME_WORLD_CONFIG.lighting.ambientIntensity}
      />

      {/* 2. Warm directional key light with soft shadow mapping */}
      <directionalLight
        ref={keyLightRef}
        color={HOME_WORLD_CONFIG.lighting.keyLightColor}
        intensity={HOME_WORLD_CONFIG.lighting.keyLightIntensity}
        position={HOME_WORLD_CONFIG.lighting.keyLightPosition}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={12}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-bias={-0.0005}
      />

      {/* 3. Subtle VALORANT Red rim/accent light */}
      <pointLight
        ref={accentLightRef}
        color={HOME_WORLD_CONFIG.lighting.accentRedColor}
        intensity={HOME_WORLD_CONFIG.lighting.accentRedIntensity}
        position={HOME_WORLD_CONFIG.lighting.accentRedPosition}
        distance={6}
      />

      {/* 4. Subtle fill light from opposite corner */}
      <directionalLight
        color="#e2e8f0"
        intensity={0.4}
        position={[-3, 2, -2]}
      />
    </>
  );
}

export function HomeWorldScene({
  activeCategory,
  isSearching = false,
  prefersReducedMotion = false,
}: HomeWorldSceneProps) {
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
        fov: HOME_WORLD_CONFIG.camera.fov,
        position: HOME_WORLD_CONFIG.camera.initialPosition,
        near: 0.1,
        far: 25,
      }}
      className="h-full w-full pointer-events-none"
    >
      <Suspense fallback={null}>
        <SceneLighting isSearching={isSearching} />
        <HomeWorldCamera
          prefersReducedMotion={prefersReducedMotion}
          isSearching={isSearching}
        />
        <HomeWorldObjects
          activeCategory={activeCategory}
          prefersReducedMotion={prefersReducedMotion}
        />
      </Suspense>
    </Canvas>
  );
}
