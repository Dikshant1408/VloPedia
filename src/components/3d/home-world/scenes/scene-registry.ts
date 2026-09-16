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

export interface SceneDefinition {
  /** Unique identifier — matches directory name */
  id: string;
  /** Human-readable name shown in debug/UI */
  name: string;
  /**
   * Zero-based month index (0 = Jan … 11 = Dec).
   * A scene with month: null is never auto-selected; it can be forced manually.
   */
  month: number | null;
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
    month: 8, // September — inaugural scene
    camera: {
      fov: 40,
      driftAmplitudeX: 0.07,
      driftAmplitudeY: 0.045,
      driftSpeed: 0.32,
      parallaxMaxAngle: 0.07,
      states: {
        idle:    { position: [0.2, 1.25, 4.6],   lookAt: [0, 0.55, 0] },
        agents:  { position: [-0.5, 1.1, 3.8],   lookAt: [-0.7, 0.95, -0.2] },
        maps:    { position: [0.5, 2.0, 5.0],    lookAt: [0, 0.5, -0.8] },
        weapons: { position: [0.9, 1.0, 3.6],    lookAt: [0.6, 0.6, -0.5] },
        skins:   { position: [-0.3, 1.2, 3.9],   lookAt: [-0.3, 0.8, 0.2] },
      },
    },
    lighting: {
      ambientColor: "#c8baa8",       // warm Mediterranean ambient
      ambientIntensity: 0.6,
      keyLightColor: "#ffe8b0",      // golden-hour sun
      keyLightIntensity: 2.2,
      keyLightPosition: [5.0, 6.0, 3.0],
      accentColor: "#ff4655",        // VALORANT red rim
      accentIntensity: 1.1,
      accentPosition: [-2.5, 2.0, 1.0],
      fillColor: "#b8cce0",          // cool sky fill
      fillIntensity: 0.4,
      fillPosition: [-3.5, 4.0, -2.0],
    },
    importObjects: () =>
      import("./ascent-scene").then((m) => ({ SceneObjects: m.AscentSceneObjects })),
  },
  // Future scenes: Haven (month: 9), Lotus (month: 10), Pearl (month: 11)
];

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Returns the scene that should be shown for the current month.
 * Falls back to the first registered scene if no match.
 */
export function getActiveScene(): SceneDefinition {
  const month = new Date().getMonth(); // 0-indexed
  return (
    SCENE_REGISTRY.find((s) => s.month === month) ?? SCENE_REGISTRY[0]
  );
}

/**
 * Returns a scene by id, or undefined if not found.
 */
export function getSceneById(id: string): SceneDefinition | undefined {
  return SCENE_REGISTRY.find((s) => s.id === id);
}
