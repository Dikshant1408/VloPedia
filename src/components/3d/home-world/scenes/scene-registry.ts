import type React from "react";

// ── Types ──────────────────────────────────────────────────────────────────

export interface CameraStateConfig {
  position: [number, number, number];
  lookAt: [number, number, number];
}

export interface SceneLightingConfig {
  ambientColor: string;
  ambientIntensity: number;
  keyLightColor: string;
  keyLightIntensity: number;
  keyLightPosition: [number, number, number];
  accentColor: string;
  accentIntensity: number;
  accentPosition: [number, number, number];
  fillColor: string;
  fillIntensity: number;
  fillPosition: [number, number, number];
}

export interface SceneCameraConfig {
  fov: number;
  driftAmplitudeX: number;
  driftAmplitudeY: number;
  driftSpeed: number;
  parallaxMaxAngle: number;
  states: Record<string, CameraStateConfig>;
}

export type SceneStatus = "active" | "in_development" | "archived";

export interface SceneDefinition {
  /** Unique identifier — matches directory name */
  id: string;
  /** Human-readable name shown in debug/UI */
  name: string;
  /** Production readiness status — only 'active' scenes are rendered in production */
  status: SceneStatus;
  /** Release date ISO string */
  releaseDate: string;
  /**
   * Zero-based month index (0 = Jan … 11 = Dec) if designated for seasonal rotation.
   * Null means manual or default selection only.
   */
  featuredMonth: number | null;
  /** High-resolution cinematic still for non-WebGL & desktop fallback */
  fallbackImage: string;
  /** Lightweight responsive image for mobile fallback */
  mobileFallbackImage: string;
  /** Camera configuration for this scene */
  camera: SceneCameraConfig;
  /** Lighting configuration for this scene */
  lighting: SceneLightingConfig;
  /**
   * Lazy-import factory for the scene objects component.
   * Keeps individual scene bundles out of the main chunk.
   */
  importObjects: () => Promise<{ SceneObjects: React.ComponentType<{ prefersReducedMotion?: boolean }> }>;
}

// ── Registry ───────────────────────────────────────────────────────────────

export const SCENE_REGISTRY: SceneDefinition[] = [
  {
    id: "tactical-workstation",
    name: "Tactical Armory Workstation",
    status: "active",
    releaseDate: "2026-10-05",
    featuredMonth: null,
    fallbackImage: "/images/tactical-grid-bg.png",
    mobileFallbackImage: "/images/tactical-grid-bg.png",
    camera: {
      fov: 38,
      driftAmplitudeX: 0.015,
      driftAmplitudeY: 0.01,
      driftSpeed: 0.1,
      parallaxMaxAngle: 0.025, // 2-3 degrees clamped
      states: {
        idle:    { position: [0.12, 0.65, 4.2],  lookAt: [0.3, 0.2, 0] },
        agents:  { position: [0.25, 0.62, 4.0],  lookAt: [0.9, 0.25, 0] },
        maps:    { position: [-0.1, 0.7, 4.3],   lookAt: [0.4, 0.2, 0] },
        weapons: { position: [0.35, 0.62, 3.9],  lookAt: [1.2, 0.28, 0] },
        skins:   { position: [0.28, 0.65, 4.0],  lookAt: [1.0, 0.25, 0] },
      },
    },
    lighting: {
      ambientColor: "#07090D",
      ambientIntensity: 0.85,
      keyLightColor: "#F5F5F5",
      keyLightIntensity: 1.8,
      keyLightPosition: [3.5, 5.0, 3.5],
      accentColor: "#FF4655",
      accentIntensity: 1.6,
      accentPosition: [2.2, 1.2, 0.5],
      fillColor: "#7DD3FC",
      fillIntensity: 0.45,
      fillPosition: [-3.5, 2.0, -1.0],
    },
    importObjects: () =>
      import("./tactical-workstation-scene").then((m) => ({ SceneObjects: m.TacticalWorkstationSceneObjects })),
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Returns the currently active production scene.
 * Enforces content strategy: only scenes with status === 'active' can be selected.
 * If the current month scene is not yet active, safely falls back to the inaugural active scene.
 */
export function getActiveScene(): SceneDefinition {
  const currentMonth = new Date().getMonth(); // 0-indexed (0=Jan..11=Dec)
  const activeScenes = SCENE_REGISTRY.filter((s) => s.status === "active");

  // Look for an active scene scheduled for the current month
  const monthlyActive = activeScenes.find((s) => s.featuredMonth === currentMonth);
  if (monthlyActive) return monthlyActive;

  // Fallback to first validated active scene (Ascent)
  return activeScenes[0] ?? SCENE_REGISTRY[0];
}

/**
 * Returns a scene by id if registered and active.
 */
export function getSceneById(id: string): SceneDefinition | undefined {
  return SCENE_REGISTRY.find((s) => s.id === id && s.status === "active");
}
