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
    const targetDim = isSearching ? 0.45 : 1.0;

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
        HOME_WORLD_CONFIG.lighting.accentRedIntensity * (isSearching ? 0.6 : 1.0),
        lerpSpeed
      );
    }
  });

  return (
    <>
      {/* 1. Soft neutral ambient fill */}
      <ambientLight
        ref={ambientLightRef}
        color={HOME_WORLD_CONFIG.lighting.ambientColor}
        intensity={HOME_WORLD_CONFIG.lighting.ambientIntensity}
      />

      {/* 2. Warm directional golden-hour sunlight */}
      <directionalLight
        ref={keyLightRef}
        color={HOME_WORLD_CONFIG.lighting.keyLightColor}
        intensity={HOME_WORLD_CONFIG.lighting.keyLightIntensity}
        position={HOME_WORLD_CONFIG.lighting.keyLightPosition}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={16}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-bias={-0.0005}
      />

      {/* 3. Subtle VALORANT Red rim/accent light */}
      <pointLight
        ref={accentLightRef}
        color={HOME_WORLD_CONFIG.lighting.accentRedColor}
        intensity={HOME_WORLD_CONFIG.lighting.accentRedIntensity}
        position={HOME_WORLD_CONFIG.lighting.accentRedPosition}
        distance={7}
      />

      {/* 4. Soft sky dome fill */}
      <directionalLight
        color="#cbd5e1"
        intensity={0.45}
        position={[-3.5, 3.5, -2]}
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
        toneMappingExposure: 1.1,
      }}
      camera={{
        fov: HOME_WORLD_CONFIG.camera.fov,
        position: HOME_WORLD_CONFIG.camera.states.idle.position,
        near: 0.1,
        far: 30,
      }}
      className="h-full w-full pointer-events-none"
    >
      <Suspense fallback={null}>
        <SceneLighting isSearching={isSearching} />
        <HomeWorldCamera
          activeCategory={activeCategory}
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
