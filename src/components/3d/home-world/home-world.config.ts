export type HomeWorldCategory = "idle" | "agents" | "maps" | "weapons" | "skins";

export interface CameraStateConfig {
  position: [number, number, number];
  lookAt: [number, number, number];
}

export interface HomeWorldConfig {
  camera: {
    fov: number;
    driftAmplitudeX: number;
    driftAmplitudeY: number;
    driftSpeed: number;
    parallaxMaxAngle: number;
    states: Record<HomeWorldCategory, CameraStateConfig>;
  };
  lighting: {
    ambientColor: string;
    ambientIntensity: number;
    keyLightColor: string;
    keyLightIntensity: number;
    keyLightPosition: [number, number, number];
    accentRedColor: string;
    accentRedIntensity: number;
    accentRedPosition: [number, number, number];
  };
  palette: {
    platformBase: string;
    platformTrim: string;
    wallBase: string;
    wallAccent: string;
    crateMetal: string;
    crateAccentRed: string;
    skySilhouette: string;
    dustMotes: string;
  };
}

export const HOME_WORLD_CONFIG: HomeWorldConfig = {
  camera: {
    fov: 40,
    driftAmplitudeX: 0.09,
    driftAmplitudeY: 0.06,
    driftSpeed: 0.38,
    parallaxMaxAngle: 0.08, // ~4.6 degrees
    states: {
      idle: {
        position: [0.3, 1.3, 4.8],
        lookAt: [0, 0.5, 0],
      },
      agents: {
        position: [-0.3, 1.2, 3.9],
        lookAt: [-0.6, 0.9, -0.2],
      },
      maps: {
        position: [0.6, 2.1, 5.2],
        lookAt: [0.1, 0.4, -0.6],
      },
      weapons: {
        position: [0.7, 1.1, 3.8],
        lookAt: [0.45, 0.6, -0.4],
      },
      skins: {
        position: [-0.5, 1.3, 4.1],
        lookAt: [-0.4, 0.8, 0.3],
      },
    },
  },
  lighting: {
    ambientColor: "#94a3b8",
    ambientIntensity: 0.9,
    keyLightColor: "#fff4e6", // warm sunlight
    keyLightIntensity: 1.85,
    keyLightPosition: [4.5, 5.5, 3.5],
    accentRedColor: "#ff4655", // VALORANT Red
    accentRedIntensity: 1.25,
    accentRedPosition: [-2.5, 2.0, 1.0],
  },
  palette: {
    platformBase: "#181b1f",
    platformTrim: "#2a2f36",
    wallBase: "#22272e",
    wallAccent: "#1a1e23",
    crateMetal: "#16191d",
    crateAccentRed: "#ff4655",
    skySilhouette: "#0f1216",
    dustMotes: "#e2e8f0",
  },
};
