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
    id: "ascent",
    name: "Ascent",
    status: "active",
    releaseDate: "2026-09-16",
    featuredMonth: 8, // September — inaugural active scene
    fallbackImage: "/images/map-ascent.webp",
    mobileFallbackImage: "/images/map-ascent.webp",
    camera: {
      fov: 38,
      driftAmplitudeX: 0.04,   // Calm, subtle ambient drift
      driftAmplitudeY: 0.025,
      driftSpeed: 0.18,        // Slower, graceful breathing
      parallaxMaxAngle: 0.04,  // Restrained mouse parallax (~2.3 degrees)
      states: {
        idle:    { position: [0.15, 1.22, 4.4],  lookAt: [0, 0.55, 0] },
        agents:  { position: [-0.45, 1.05, 3.6], lookAt: [-0.65, 0.95, -0.2] },
        maps:    { position: [0.4, 1.85, 4.8],   lookAt: [0, 0.5, -0.8] },
        weapons: { position: [0.85, 1.0, 3.5],   lookAt: [0.55, 0.6, -0.5] },
        skins:   { position: [-0.25, 1.15, 3.7], lookAt: [-0.25, 0.8, 0.2] },
      },
    },
    lighting: {
      ambientColor: "#ece2d2",       // Warm Mediterranean ambient fill
      ambientIntensity: 0.7,
      keyLightColor: "#fff3d6",      // Warm golden Mediterranean daylight
      keyLightIntensity: 2.6,
      keyLightPosition: [5.5, 7.0, 3.5],
      accentColor: "#ff4655",        // Subtle VALORANT red rim for agent silhouette
      accentIntensity: 0.75,
      accentPosition: [-2.2, 1.8, 0.8],
      fillColor: "#8ebde8",          // Cool Mediterranean sky dome fill
      fillIntensity: 0.5,
      fillPosition: [-4.0, 5.0, -2.0],
    },
    importObjects: () =>
      import("./ascent-scene").then((m) => ({ SceneObjects: m.AscentSceneObjects })),
  },
  // Future scenes registered with status 'in_development' to prevent premature auto-swap
  {
    id: "haven",
    name: "Haven",
    status: "in_development",
    releaseDate: "2026-10-01",
    featuredMonth: 9,
    fallbackImage: "/images/map-ascent.webp",
    mobileFallbackImage: "/images/map-ascent.webp",
    camera: {
      fov: 38,
      driftAmplitudeX: 0.04,
      driftAmplitudeY: 0.025,
      driftSpeed: 0.18,
      parallaxMaxAngle: 0.04,
      states: {
        idle: { position: [0, 1.2, 4.5], lookAt: [0, 0.5, 0] },
      },
    },
    lighting: {
      ambientColor: "#d8c8b4",
      ambientIntensity: 0.6,
      keyLightColor: "#ffe4c4",
      keyLightIntensity: 2.2,
      keyLightPosition: [4.0, 6.0, 3.0],
      accentColor: "#ff4655",
      accentIntensity: 0.6,
      accentPosition: [-2.0, 1.5, 1.0],
      fillColor: "#9ec5e8",
      fillIntensity: 0.4,
      fillPosition: [-3.0, 4.0, -2.0],
    },
    importObjects: () =>
      import("./ascent-scene").then((m) => ({ SceneObjects: m.AscentSceneObjects })),
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
