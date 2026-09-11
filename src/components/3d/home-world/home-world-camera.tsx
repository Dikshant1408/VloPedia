"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { HOME_WORLD_CONFIG, type HomeWorldCategory } from "./home-world.config";

interface HomeWorldCameraProps {
  activeCategory: HomeWorldCategory;
  prefersReducedMotion?: boolean;
  isSearching?: boolean;
}

export function HomeWorldCamera({
  activeCategory = "idle",
  prefersReducedMotion = false,
  isSearching = false,
}: HomeWorldCameraProps) {
  const { camera, pointer } = useThree();

  const targetPos = useRef(new THREE.Vector3(...HOME_WORLD_CONFIG.camera.states.idle.position));
  const targetLookAt = useRef(new THREE.Vector3(...HOME_WORLD_CONFIG.camera.states.idle.lookAt));
  const currentLookAt = useRef(new THREE.Vector3(...HOME_WORLD_CONFIG.camera.states.idle.lookAt));

  // Initialize camera position
  useEffect(() => {
    const defaultState = HOME_WORLD_CONFIG.camera.states.idle;
    camera.position.set(...defaultState.position);
    camera.lookAt(...defaultState.lookAt);
  }, [camera]);

  useFrame((state, delta) => {
    const config = HOME_WORLD_CONFIG.camera;
    const activeState = config.states[activeCategory] || config.states.idle;

    if (prefersReducedMotion) {
      camera.position.set(...activeState.position);
      camera.lookAt(...activeState.lookAt);
      return;
    }

    const t = state.clock.getElapsedTime();

    // 1. Slow organic breathing drift
    const driftX = Math.sin(t * config.driftSpeed) * config.driftAmplitudeX;
    const driftY = Math.cos(t * config.driftSpeed * 0.7) * config.driftAmplitudeY;
    const driftZ = Math.sin(t * config.driftSpeed * 0.45) * (config.driftAmplitudeX * 0.5);

    // 2. Clamped mouse parallax (~5 degrees maximum)
    const px = THREE.MathUtils.clamp(pointer.x, -1, 1);
    const py = THREE.MathUtils.clamp(pointer.y, -1, 1);
    const parallaxX = px * (config.parallaxMaxAngle * 4.8);
    const parallaxY = -py * (config.parallaxMaxAngle * 2.6);

    // 3. Search focus reaction: subtle cinematic pull-back
    const searchOffsetZ = isSearching ? 0.4 : 0;
    const searchOffsetY = isSearching ? 0.08 : 0;

    targetPos.current.set(
      activeState.position[0] + driftX + parallaxX,
      activeState.position[1] + driftY + parallaxY + searchOffsetY,
      activeState.position[2] + driftZ + searchOffsetZ
    );

    // Damped interpolation for smooth cinematic gliding
    const lerpFactor = Math.min(1, delta * 2.8);
    camera.position.lerp(targetPos.current, lerpFactor);

    // Target look-at with subtle parallax influence
    targetLookAt.current.set(
      activeState.lookAt[0] + parallaxX * 0.25,
      activeState.lookAt[1] + parallaxY * 0.25,
      activeState.lookAt[2]
    );
    currentLookAt.current.lerp(targetLookAt.current, lerpFactor);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
