"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { HomeWorldCategory } from "../home-world.config";
import type { SceneCameraConfig } from "./scene-registry";

interface HomeWorldCameraProps {
  activeCategory: HomeWorldCategory;
  cameraConfig: SceneCameraConfig;
  prefersReducedMotion?: boolean;
  isSearching?: boolean;
}

export function HomeWorldCamera({
  activeCategory = "idle",
  cameraConfig,
  prefersReducedMotion = false,
  isSearching = false,
}: HomeWorldCameraProps) {
  const { camera, pointer } = useThree();
  const cfg = cameraConfig;

  const idleState = useMemo(
    () => cfg.states.idle ?? { position: [0, 1.25, 4.5], lookAt: [0, 0.5, 0] },
    [cfg.states.idle]
  );
  const targetPos    = useRef(new THREE.Vector3(...idleState.position));
  const targetLook   = useRef(new THREE.Vector3(...idleState.lookAt));
  const currentLook  = useRef(new THREE.Vector3(...idleState.lookAt));

  useEffect(() => {
    camera.position.set(...idleState.position as [number, number, number]);
    camera.lookAt(...idleState.lookAt as [number, number, number]);
  }, [camera, idleState]);

  useFrame((state, delta) => {
    const activeState = cfg.states[activeCategory] ?? idleState;

    if (prefersReducedMotion) {
      camera.position.set(...activeState.position as [number, number, number]);
      camera.lookAt(...activeState.lookAt as [number, number, number]);
      return;
    }

    const t = state.clock.getElapsedTime();

    // Organic drift
    const driftX = Math.sin(t * cfg.driftSpeed) * cfg.driftAmplitudeX;
    const driftY = Math.cos(t * cfg.driftSpeed * 0.7) * cfg.driftAmplitudeY;
    const driftZ = Math.sin(t * cfg.driftSpeed * 0.45) * (cfg.driftAmplitudeX * 0.5);

    // Mouse parallax
    const px = THREE.MathUtils.clamp(pointer.x, -1, 1);
    const py = THREE.MathUtils.clamp(pointer.y, -1, 1);
    const parX = px * (cfg.parallaxMaxAngle * 4.5);
    const parY = -py * (cfg.parallaxMaxAngle * 2.4);

    // Search focus: cinematic pull-back
    const sZ = isSearching ? 0.38 : 0;
    const sY = isSearching ? 0.07 : 0;

    targetPos.current.set(
      activeState.position[0] + driftX + parX,
      activeState.position[1] + driftY + parY + sY,
      activeState.position[2] + driftZ + sZ
    );

    const lf = Math.min(1, delta * 2.6);
    camera.position.lerp(targetPos.current, lf);

    targetLook.current.set(
      activeState.lookAt[0] + parX * 0.22,
      activeState.lookAt[1] + parY * 0.22,
      activeState.lookAt[2]
    );
    currentLook.current.lerp(targetLook.current, lf);
    camera.lookAt(currentLook.current);
  });

  return null;
}
