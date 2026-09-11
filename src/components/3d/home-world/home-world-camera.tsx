"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HOME_WORLD_CONFIG } from "./home-world.config";

interface HomeWorldCameraProps {
  prefersReducedMotion?: boolean;
  isSearching?: boolean;
}

export function HomeWorldCamera({ prefersReducedMotion = false, isSearching = false }: HomeWorldCameraProps) {
  const { camera, pointer } = useThree();
  const targetPos = useRef(new THREE.Vector3(...HOME_WORLD_CONFIG.camera.initialPosition));
  const targetLookAt = useRef(new THREE.Vector3(...HOME_WORLD_CONFIG.camera.lookAt));
  const currentLookAt = useRef(new THREE.Vector3(...HOME_WORLD_CONFIG.camera.lookAt));

  // Initialize camera position
  useEffect(() => {
    camera.position.set(...HOME_WORLD_CONFIG.camera.initialPosition);
    camera.lookAt(...HOME_WORLD_CONFIG.camera.lookAt);
  }, [camera]);

  useFrame((state, delta) => {
    if (prefersReducedMotion) {
      camera.position.set(...HOME_WORLD_CONFIG.camera.initialPosition);
      camera.lookAt(...HOME_WORLD_CONFIG.camera.lookAt);
      return;
    }

    const t = state.clock.getElapsedTime();
    const config = HOME_WORLD_CONFIG.camera;

    // 1. Slow harmonic idle drift (~8-10 second organic period)
    const driftX = Math.sin(t * config.driftSpeed) * config.driftAmplitudeX;
    const driftY = Math.cos(t * config.driftSpeed * 0.65) * config.driftAmplitudeY;
    const driftZ = Math.sin(t * config.driftSpeed * 0.4) * (config.driftAmplitudeX * 0.4);

    // 2. Mouse parallax reaction (clamped to max ~5-8 degrees)
    const px = THREE.MathUtils.clamp(pointer.x, -1, 1);
    const py = THREE.MathUtils.clamp(pointer.y, -1, 1);
    const parallaxX = px * (config.parallaxMaxAngle * 4.5);
    const parallaxY = -py * (config.parallaxMaxAngle * 2.5);

    // 3. Search focus reaction: subtle pull-back when searching
    const searchOffsetZ = isSearching ? 0.35 : 0;
    const searchOffsetY = isSearching ? 0.08 : 0;

    targetPos.current.set(
      config.initialPosition[0] + driftX + parallaxX,
      config.initialPosition[1] + driftY + parallaxY + searchOffsetY,
      config.initialPosition[2] + driftZ + searchOffsetZ
    );

    // Smooth lerp (damped with delta for framerate independence)
    const lerpFactor = Math.min(1, delta * 3.2);
    camera.position.lerp(targetPos.current, lerpFactor);

    // Smooth look-at tracking
    targetLookAt.current.set(
      config.lookAt[0] + parallaxX * 0.3,
      config.lookAt[1] + parallaxY * 0.3,
      config.lookAt[2]
    );
    currentLookAt.current.lerp(targetLookAt.current, lerpFactor);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
