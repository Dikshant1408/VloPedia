export type HomeWorldCategory = "idle" | "agents" | "maps" | "weapons" | "skins";

export interface HomeWorldConfig {
  camera: {
    fov: number;
    initialPosition: [number, number, number];
    lookAt: [number, number, number];
    driftAmplitudeX: number;
    driftAmplitudeY: number;
    driftSpeed: number;
    parallaxMaxAngle: number; // in radians (~6 degrees = 0.1 rad)
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
    crateMetal: string;
    crateAccentRed: string;
    dustMotes: string;
  };
}

export const HOME_WORLD_CONFIG: HomeWorldConfig = {
  camera: {
    fov: 36,
    initialPosition: [0.8, 1.4, 4.4],
    lookAt: [0, 0.2, 0],
    driftAmplitudeX: 0.08,
    driftAmplitudeY: 0.05,
    driftSpeed: 0.45,
    parallaxMaxAngle: 0.09, // ~5.2 degrees
  },
  lighting: {
    ambientColor: "#f1f5f9",
    ambientIntensity: 0.85,
    keyLightColor: "#fff8f0",
    keyLightIntensity: 1.6,
    keyLightPosition: [3.5, 4.2, 3],
    accentRedColor: "#ff4655", // VALORANT Red
    accentRedIntensity: 1.1,
    accentRedPosition: [-2.2, 1.8, 1.2],
  },
  palette: {
    platformBase: "#1c2024",
    platformTrim: "#2e343b",
    wallBase: "#22272d",
    crateMetal: "#181b1f",
    crateAccentRed: "#ff4655",
    dustMotes: "#cbd5e1",
  },
};
