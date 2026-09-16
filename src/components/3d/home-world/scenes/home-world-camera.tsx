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
  const { camera, pointer, size } = useThree();
  const cfg = cameraConfig;

  const idleState = useMemo(
    () => cfg.states.idle ?? { position: [0.15, 1.22, 4.4], lookAt: [0, 0.55, 0] },
    [cfg.states.idle]
  );

  const targetPos   = useRef(new THREE.Vector3(...idleState.position));
  const targetLook  = useRef(new THREE.Vector3(...idleState.lookAt));
  const currentLook = useRef(new THREE.Vector3(...idleState.lookAt));

  useEffect(() => {
    camera.position.set(...(idleState.position as [number, number, number]));
    camera.lookAt(...(idleState.lookAt as [number, number, number]));
  }, [camera, idleState]);

  useFrame((state, delta) => {
    // ── 1. Responsive Composition by Viewport (Point 12) ──
    // Desktop: wide cinematic composition (agent on left-mid, architecture on right)
    // Tablet: agent moves closer to center
    // Mobile: camera crops directly to the agent focal silhouette
    const isMobileViewport = size.width < 768 || (size.width / size.height) < 0.85;
    const isTabletViewport = size.width >= 768 && size.width < 1024;

    const activeState = cfg.states[activeCategory] ?? idleState;

    // Base position adjusted by responsive composition
    let basePosX = activeState.position[0];
    let basePosY = activeState.position[1];
    let basePosZ = activeState.position[2];

    let baseLookX = activeState.lookAt[0];
    let baseLookY = activeState.lookAt[1];
    let baseLookZ = activeState.lookAt[2];

    if (isMobileViewport) {
      // Crop to agent focal point in vertical portrait frame
      basePosX = -0.45;
      basePosY = 0.95;
      basePosZ = 3.2;
      baseLookX = -0.45;
      baseLookY = 0.65;
      baseLookZ = -1.35;
    } else if (isTabletViewport) {
      basePosX = -0.15;
      basePosY = 1.12;
      basePosZ = 3.8;
      baseLookX = -0.25;
      baseLookY = 0.58;
      baseLookZ = -0.6;
    }

    if (prefersReducedMotion) {
      camera.position.set(basePosX, basePosY, basePosZ);
      camera.lookAt(baseLookX, baseLookY, baseLookZ);
      return;
    }

    const t = state.clock.getElapsedTime();
    const cycle = (t % 18) / 18; // 18-second coordinated cinematic loop

    // ── 2. Phase 5 (11–14s) Cinematic Push-in Ease ──
    let pushInZ = 0;
    if (cycle >= 0.611 && cycle < 0.778) {
      const p = (cycle - 0.611) / 0.167;
      // Gentle 10cm forward push-in during Phase 5
      pushInZ = -Math.sin(p * Math.PI) * 0.10;
    }

    // ── 3. Ultra-slow, calm breathing drift (Point 6 & 10) ──
    const driftX = Math.sin(t * cfg.driftSpeed) * cfg.driftAmplitudeX;
    const driftY = Math.cos(t * cfg.driftSpeed * 0.7) * cfg.driftAmplitudeY;
    const driftZ = Math.sin(t * cfg.driftSpeed * 0.45) * (cfg.driftAmplitudeX * 0.5);

    // ── 4. Minimal, clamped mouse parallax (±2.3 degrees max) ──
    const px = THREE.MathUtils.clamp(pointer.x, -1, 1);
    const py = THREE.MathUtils.clamp(pointer.y, -1, 1);
    const parX = px * (cfg.parallaxMaxAngle * 4.2);
    const parY = -py * (cfg.parallaxMaxAngle * 2.2);

    // ── 5. Search focus reaction: subtle cinematic elevation ──
    const sZ = isSearching ? 0.35 : 0;
    const sY = isSearching ? 0.06 : 0;

    targetPos.current.set(
      basePosX + driftX + parX,
      basePosY + driftY + parY + sY,
      basePosZ + driftZ + sZ + pushInZ
    );

    const lf = Math.min(1, delta * 2.4);
    camera.position.lerp(targetPos.current, lf);

    targetLook.current.set(
      baseLookX + parX * 0.2,
      baseLookY + parY * 0.2,
      baseLookZ
    );
    currentLook.current.lerp(targetLook.current, lf);
    camera.lookAt(currentLook.current);
  });

  return null;
}

export default HomeWorldCamera;
