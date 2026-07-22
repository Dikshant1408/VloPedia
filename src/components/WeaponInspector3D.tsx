/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "motion/react";
import {
  RotateCw,
  RefreshCw,
  Sliders,
  Tv,
  Eye,
  Settings,
  AlertTriangle,
  Info
} from "lucide-react";

interface WeaponInspector3DProps {
  imageUrl: string;
  weaponName: string;
  weaponCategory: string;
  accentColor: string;
}

// 1. CLASS-BASED ERROR BOUNDARY FOR WEBGL & THREE.JS CRASH PROTECTION
class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode; onError?: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("3D Canvas crashed, falling back to 2D mode:", error, errorInfo);
    if (this.props.onError) {
      this.props.onError();
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// 2. HELPER TO CHECK WEBGL AVAILABILITY AT RUNTIME
function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

// 3. ASYNC SAFE TEXTURE LOADER HOOK (NOT SUSPENSE-BASED, AVOIDS INTERRUPTS)
function useSafeTexture(url: string) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    let isMounted = true;

    loader.load(
      url,
      (tex) => {
        if (isMounted) {
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          setTexture(tex);
          setError(false);
          setLoading(false);
        }
      },
      undefined,
      (err) => {
        console.warn("Failed to load weapon texture in WebGL. Falling back gracefully...", err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { texture, error, loading };
}

// 4. DYNAMIC THREE.JS WEAPON HOLOGRAM COMPONENT
function WeaponHologram({
  texture,
  isReloading,
  setIsReloading,
  isInspecting,
  setIsInspecting,
  themeColor,
  laserScanPos,
}: {
  texture: THREE.Texture;
  isReloading: boolean;
  setIsReloading: (val: boolean) => void;
  isInspecting: boolean;
  setIsInspecting: (val: boolean) => void;
  themeColor: string;
  laserScanPos: number;
}) {
  const groupRef = useRef<THREE.Group | null>(null);
  const weaponPlaneRef = useRef<THREE.Mesh | null>(null);
  const magazineRef = useRef<THREE.Mesh | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);

  const reloadTimer = useRef(0);
  const inspectTimer = useRef(0);

  const particleCount = 80;
  const particlePositions = useRef<Float32Array | null>(null);
  const particleVelocities = useRef<Float32Array | null>(null);

  if (!particlePositions.current) {
    const pos = new Float32Array(particleCount * 3);
    const vels = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.2;

      vels[i * 3] = (Math.random() - 0.5) * 0.01;
      vels[i * 3 + 1] = Math.random() * 0.02 + 0.008;
      vels[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    particlePositions.current = pos;
    particleVelocities.current = vels;
  }

  useFrame((state, delta) => {
    // 1. Float animation
    if (groupRef.current && !isReloading && !isInspecting) {
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.2) * 0.08;
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.35) * 0.1;
    }

    // 2. Inspect Rotation Showcase
    if (isInspecting && groupRef.current) {
      inspectTimer.current += delta;
      const progress = inspectTimer.current / 2.2;

      if (progress >= 1.0) {
        setIsInspecting(false);
        inspectTimer.current = 0;
        groupRef.current.rotation.set(0, 0, 0);
      } else {
        groupRef.current.rotation.y = progress * Math.PI * 2;
        groupRef.current.rotation.x = Math.sin(progress * Math.PI) * 0.3;
        groupRef.current.rotation.z = Math.sin(progress * Math.PI * 2) * 0.1;
        groupRef.current.position.y = Math.sin(progress * Math.PI) * 0.25;
      }
    }

    // 3. Tactical Reload Sequence
    if (isReloading && groupRef.current) {
      reloadTimer.current += delta;
      const progress = reloadTimer.current / 1.5;

      if (progress >= 1.0) {
        setIsReloading(false);
        reloadTimer.current = 0;
        if (magazineRef.current) {
          magazineRef.current.position.set(-0.3, -0.5, 0.04);
          magazineRef.current.scale.set(1, 1, 1);
        }
        groupRef.current.rotation.z = 0;
        groupRef.current.position.y = 0;
      } else {
        if (progress < 0.3) {
          const t = progress / 0.3;
          groupRef.current.rotation.z = -0.3 * t;
          groupRef.current.position.y = -0.1 * t;

          if (magazineRef.current) {
            magazineRef.current.position.y = -0.5 - (progress * 3.5);
            magazineRef.current.scale.y = 0.8;
          }
        } else if (progress >= 0.3 && progress < 0.7) {
          const t = (progress - 0.3) / 0.4;
          if (magazineRef.current) {
            magazineRef.current.position.y = -3.5 + (t * 3.0);
            magazineRef.current.scale.set(1.1, 1.1, 1.1);
          }
        } else {
          const t = (progress - 0.7) / 0.3;
          groupRef.current.rotation.z = -0.3 * (1 - t);
          groupRef.current.position.y = -0.1 * (1 - t);
          if (magazineRef.current) {
            magazineRef.current.position.set(-0.3, -0.5, 0.04);
            magazineRef.current.scale.set(1, 1, 1);
          }
        }
      }
    }

    // 4. Update dynamic particles
    if (particleSystemRef.current && particlePositions.current && particleVelocities.current) {
      const geo = particleSystemRef.current.geometry;
      const positions = geo.attributes.position.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleVelocities.current[i * 3 + 1];

        if (positions[i * 3 + 1] > 1.8) {
          positions[i * 3] = (Math.random() - 0.5) * 5.5;
          positions[i * 3 + 1] = -1.2;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  const img = texture.image as HTMLImageElement | undefined;
  const aspect = img ? img.width / img.height : 2.5;
  const planeWidth = 5.0;
  const planeHeight = planeWidth / aspect;

  const primaryColor =
    themeColor === "cyan"
      ? "#00f5ff"
      : themeColor === "red"
      ? "#ff4655"
      : themeColor === "purple"
      ? "#b388ff"
      : "#ffd700";

  return (
    <group ref={groupRef}>
      {/* 1. Base Weapon plane */}
      <mesh ref={weaponPlaneRef} position={[0, 0, 0]}>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <meshBasicMaterial
          map={texture}
          transparent={true}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* 2. Cyber hologram backing grid */}
      <mesh position={[0, 0, -0.06]}>
        <planeGeometry args={[planeWidth + 0.3, planeHeight + 0.2]} />
        <meshBasicMaterial
          color={primaryColor}
          wireframe={true}
          transparent={true}
          opacity={0.05}
        />
      </mesh>

      {/* Grid mounting frames */}
      <mesh position={[-(planeWidth / 2 + 0.15), 0, 0]}>
        <boxGeometry args={[0.06, 0.5, 0.08]} />
        <meshStandardMaterial
          color={primaryColor}
          roughness={0.2}
          metalness={0.8}
          emissive={primaryColor}
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[planeWidth / 2 + 0.15, 0, 0]}>
        <boxGeometry args={[0.06, 0.5, 0.08]} />
        <meshStandardMaterial
          color={primaryColor}
          roughness={0.2}
          metalness={0.8}
          emissive={primaryColor}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* 3. Ejectable Reload Magazine */}
      <mesh ref={magazineRef} position={[-0.3, -0.5, 0.04]}>
        <boxGeometry args={[0.2, 0.45, 0.06]} />
        <meshStandardMaterial
          color="#10141f"
          metalness={0.7}
          roughness={0.3}
          emissive={isReloading ? primaryColor : "#030406"}
          emissiveIntensity={isReloading ? 1.2 : 0.05}
        />
      </mesh>

      {/* 4. Particle Field */}
      <points ref={particleSystemRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions.current, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.038}
          color={primaryColor}
          transparent={true}
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 5. Linear Scan bar */}
      <mesh position={[laserScanPos, 0, 0.03]}>
        <boxGeometry args={[0.02, planeHeight + 0.4, 0.12]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent={true}
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// 5. RETICLE RADAR BASE
function GridSector({ themeColor }: { themeColor: string }) {
  const primaryColor =
    themeColor === "cyan"
      ? "#00f5ff"
      : themeColor === "red"
      ? "#ff4655"
      : themeColor === "purple"
      ? "#b388ff"
      : "#ffd700";

  return (
    <group position={[0, -2.0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 3.8, 24]} />
        <meshBasicMaterial
          color={primaryColor}
          wireframe={true}
          transparent={true}
          opacity={0.06}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[1.5, 1.54, 12]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent={true}
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}

// 6. MAIN RESILIENT WEAPON INSPECTOR COMPONENT
export default function WeaponInspector3D({
  imageUrl,
  weaponName,
  weaponCategory,
  accentColor,
}: WeaponInspector3DProps) {
  const [isReloading, setIsReloading] = useState(false);
  const [isInspecting, setIsInspecting] = useState(false);
  const [laserScanPos, setLaserScanPos] = useState(0);
  const [scanDirection, setScanDirection] = useState(1);
  const [lightingPreset, setLightingPreset] = useState<"neon" | "tactical" | "dark">("neon");

  // WebGL Availability and Manual Toggle States
  const [webGlSupported, setWebGlSupported] = useState(false);
  const [use3DMode, setUse3DMode] = useState(true);

  // Load texture with our safe non-suspending, cross-origin robust handler
  const { texture, error: textureError, loading: textureLoading } = useSafeTexture(imageUrl);

  // Initialize WebGL check once at mount
  useEffect(() => {
    const supported = checkWebGLSupport();
    setWebGlSupported(supported);
    // If WebGL fails, fallback to 2D immediately
    if (!supported) {
      setUse3DMode(false);
    }
  }, []);

  // Safe fallback to 2D when there is a loading error
  useEffect(() => {
    if (textureError) {
      setUse3DMode(false);
    }
  }, [textureError]);

  // Moving scanline loop (active in both 3D and 2D)
  useEffect(() => {
    let frameId: number;
    const updateScanline = () => {
      setLaserScanPos((prev) => {
        let next = prev + 0.045 * scanDirection;
        if (next > 2.6) {
          setScanDirection(-1);
          return 2.6;
        }
        if (next < -2.6) {
          setScanDirection(1);
          return -2.6;
        }
        return next;
      });
      frameId = requestAnimationFrame(updateScanline);
    };
    frameId = requestAnimationFrame(updateScanline);
    return () => cancelAnimationFrame(frameId);
  }, [scanDirection]);

  // Handle color themes
  const getThemeColor = () => {
    const clean = accentColor.toLowerCase();
    if (clean.includes("cyan") || clean.includes("00f5ff")) return "cyan";
    if (clean.includes("red") || clean.includes("ff4655")) return "red";
    if (clean.includes("purple") || clean.includes("b388ff")) return "purple";
    return "cyan";
  };

  const themeColor = getThemeColor();
  const primaryColorHex =
    themeColor === "cyan"
      ? "#00f5ff"
      : themeColor === "red"
      ? "#ff4655"
      : themeColor === "purple"
      ? "#b388ff"
      : "#ffd700";

  const handleInspect = () => {
    if (isInspecting || isReloading) return;
    setIsInspecting(true);
  };

  const handleReload = () => {
    if (isReloading || isInspecting) return;
    setIsReloading(true);
  };

  // 7. GORGEOUS 2D TACTICAL PREVIEW CARD (Reserves context/features completely)
  const render2DPreview = () => (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#070b13] via-[#04060c] to-[#020306] p-8 select-none">
      {/* Background visual styling */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.08)_0%,transparent_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />

      {/* Cyber Hologram Rings */}
      <div className="absolute w-[280px] md:w-[360px] aspect-square rounded-full border border-white/5 pointer-events-none animate-[spin_25s_linear_infinite] opacity-30" />
      <div className="absolute w-[240px] md:w-[300px] aspect-square rounded-full border border-dashed border-val-cyan/10 pointer-events-none animate-[spin_40s_linear_infinite_reverse]" />

      {/* Moving scanline */}
      <div
        className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-val-cyan to-transparent pointer-events-none opacity-40"
        style={{
          left: `${((laserScanPos + 2.6) / 5.2) * 100}%`,
          transition: "left 0.05s linear",
        }}
      />

      {/* Image frame animating with reload & inspect loops */}
      <motion.div
        animate={
          isInspecting
            ? {
                rotateY: [0, 180, 360],
                scale: [1, 1.08, 1],
                y: [0, -12, 0],
              }
            : isReloading
            ? {
                rotateZ: [0, -14, -14, 0],
                y: [0, 8, -6, 0],
              }
            : {
                y: [0, -6, 0],
              }
        }
        transition={
          isInspecting
            ? { duration: 2.2, ease: "easeInOut" }
            : isReloading
            ? { duration: 1.5, ease: "easeInOut" }
            : { repeat: Infinity, duration: 4.5, ease: "easeInOut" }
        }
        onAnimationComplete={() => {
          setIsInspecting(false);
          setIsReloading(false);
        }}
        className="max-h-[75%] max-w-[90%] flex items-center justify-center relative z-10"
        style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
      >
        <img
          src={imageUrl}
          alt={weaponName}
          className="max-h-full max-w-full object-contain filter drop-shadow-[0_12px_30px_rgba(0,245,255,0.3)] transition-transform duration-300"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Replace broken images safely with empty block
            e.currentTarget.style.display = "none";
          }}
        />

        {/* Tactical scanning bracket overlay */}
        <div className="absolute -inset-4 border border-val-cyan/15 pointer-events-none rounded-lg">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-val-cyan/40" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-val-cyan/40" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-val-cyan/40" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-val-cyan/40" />
        </div>

        {/* 2D Magazine reloading popup HUD */}
        {isReloading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1.1, 1, 0.9] }}
            transition={{ duration: 1.5 }}
            className="absolute -bottom-8 bg-val-black/90 border border-val-cyan/30 text-[8px] font-mono text-val-cyan px-2 py-0.5 rounded uppercase flex items-center space-x-1 shadow-lg pointer-events-none"
          >
            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            <span>RE-INSERTING MAGAZINE...</span>
          </motion.div>
        )}
      </motion.div>

      {/* Floating telemetry lines inside grid */}
      <div className="absolute bottom-3 left-4 font-mono text-[7px] text-gray-500 flex items-center space-x-2">
        <span className="w-1.5 h-1.5 rounded-full bg-val-cyan animate-pulse" />
        <span>PREV_ENGINE: TACTICAL_2D_RENDER</span>
      </div>
    </div>
  );

  // If the safe texture is loading, show a high-tech loader inside the viewport.
  // This completely bypasses R3F/Suspense locks!
  if (textureLoading && use3DMode && webGlSupported) {
    return (
      <div className="w-full aspect-[1.8/1] min-h-[300px] md:min-h-[380px] bg-[#020408] border border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-3 shadow-2xl relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.05)_0%,transparent_70%)] pointer-events-none animate-pulse" />
        <RefreshCw className="w-8 h-8 text-val-cyan animate-spin" />
        <span className="font-mono text-[9px] text-val-cyan tracking-widest animate-pulse uppercase">
          BOOTING HOLOGRAM MATRIX // LOADING {weaponName.toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-gradient-to-b from-[#090d16] to-[#04060b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group">
      {/* HUD HEADER CONTROL PANEL */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
        <div className="flex flex-col space-y-0.5">
          <span className="bg-val-cyan/15 border border-val-cyan/30 text-val-cyan font-mono text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wider w-max pointer-events-auto flex items-center space-x-1">
            <Sliders className="w-2.5 h-2.5 text-val-cyan" />
            <span>STUDIO PROJECTOR</span>
          </span>
          <span className="font-display font-black text-white text-base md:text-lg uppercase tracking-tight">
            {weaponName}
          </span>
        </div>

        {/* Toggle between 3D and 2D manual buttons */}
        <div className="flex items-center space-x-2 pointer-events-auto bg-black/40 p-1 rounded border border-white/5">
          <button
            onClick={() => {
              if (webGlSupported) {
                setUse3DMode(true);
              }
            }}
            disabled={!webGlSupported}
            className={`px-2 py-1 rounded text-[8px] font-mono transition-all uppercase flex items-center space-x-1 ${
              !webGlSupported
                ? "text-gray-600 cursor-not-allowed"
                : use3DMode
                ? "bg-val-cyan text-val-black font-bold shadow-[0_0_8px_rgba(0,180,216,0.5)]"
                : "text-gray-400 hover:text-white"
            }`}
            title={webGlSupported ? "Render in fully interactive 3D WebGL" : "WebGL not available"}
          >
            <span>3D</span>
          </button>
          <button
            onClick={() => setUse3DMode(false)}
            className={`px-2 py-1 rounded text-[8px] font-mono transition-all uppercase ${
              !use3DMode
                ? "bg-val-cyan text-val-black font-bold shadow-[0_0_8px_rgba(0,180,216,0.5)]"
                : "text-gray-400 hover:text-white"
            }`}
            title="Display as high-contrast 2D Tactical HUD"
          >
            <span>2D</span>
          </button>
        </div>
      </div>

      {/* INSPECTOR VIEW CONTAINER */}
      <div className="w-full aspect-[1.8/1] min-h-[300px] md:min-h-[380px] bg-[#020408] relative">
        {use3DMode && webGlSupported && texture ? (
          <CanvasErrorBoundary fallback={render2DPreview()} onError={() => setUse3DMode(false)}>
            <Canvas
              camera={{ position: [0, 0, 4.6], fof: 58 } as any}
              gl={{ antialias: true, alpha: true }}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            >
              {/* Adaptive Lighting setups */}
              {lightingPreset === "neon" && (
                <>
                  <ambientLight intensity={0.45} />
                  <pointLight position={[5, 4, 5]} color={primaryColorHex} intensity={2.0} />
                  <pointLight position={[-5, -4, -4]} color="#00f5ff" intensity={1.2} />
                  <directionalLight position={[0, 8, 3]} intensity={1.5} color="#ffffff" />
                </>
              )}

              {lightingPreset === "tactical" && (
                <>
                  <ambientLight intensity={0.85} />
                  <directionalLight position={[8, 8, 8]} intensity={2.8} color="#ffffff" />
                  <directionalLight position={[-8, 4, -4]} intensity={1.0} color="#abc4f0" />
                </>
              )}

              {lightingPreset === "dark" && (
                <>
                  <ambientLight intensity={0.12} />
                  <pointLight position={[0, 2.5, 2.5]} color={primaryColorHex} intensity={1.8} distance={8} />
                </>
              )}

              <WeaponHologram
                texture={texture}
                isReloading={isReloading}
                setIsReloading={setIsReloading}
                isInspecting={isInspecting}
                setIsInspecting={setIsInspecting}
                themeColor={themeColor}
                laserScanPos={laserScanPos}
              />

              <GridSector themeColor={themeColor} />

              <OrbitControls
                enableDamping={true}
                dampingFactor={0.05}
                minDistance={2.8}
                maxDistance={6.5}
                maxPolarAngle={Math.PI / 2 + 0.08}
                minPolarAngle={Math.PI / 4}
              />
            </Canvas>
          </CanvasErrorBoundary>
        ) : (
          render2DPreview()
        )}

        {/* Hover / Interact instructions */}
        <div className="absolute bottom-4 left-4 font-mono text-[7px] text-gray-500 pointer-events-none uppercase">
          {use3DMode
            ? "[DRAG TO ROTATE // SCROLL TO ZOOM]"
            : "[STABLE 2D PROJECTION MODULE]"}
        </div>

        {/* Right HUD telemetry lines */}
        <div className="absolute right-4 bottom-4 font-mono text-[7px] text-gray-500 text-right space-y-0.5 pointer-events-none select-none">
          <div>ENGINE: {use3DMode ? "THREEJS_WebGL_R3F" : "MOTION_2D_FALLBACK"}</div>
          <div>FPS: 60 // SYNCED</div>
          <div>STATE: {isReloading ? "CYLINDRICAL_RELOAD" : isInspecting ? "ORBITAL_INSPECT" : "SYSTEM_READY"}</div>
        </div>
      </div>

      {/* FOOTER ACTION TOOLBAR */}
      <div className="border-t border-white/10 p-4 bg-[#050811] flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center space-x-2">
          {/* Inspect Trigger */}
          <button
            onClick={handleInspect}
            disabled={isInspecting || isReloading}
            className={`px-4 py-2 rounded text-xs font-display font-bold uppercase border transition-all flex items-center space-x-1.5 ${
              isInspecting
                ? "bg-val-cyan/10 border-val-cyan/20 text-val-cyan cursor-not-allowed"
                : "bg-val-cyan/15 border-val-cyan/35 text-white hover:bg-val-cyan hover:text-val-black hover:border-transparent active:scale-95"
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isInspecting ? "animate-spin" : ""}`} />
            <span>INSPECT GUN</span>
          </button>

          {/* Reload Trigger */}
          <button
            onClick={handleReload}
            disabled={isReloading || isInspecting}
            className={`px-4 py-2 rounded text-xs font-display font-bold uppercase border transition-all flex items-center space-x-1.5 ${
              isReloading
                ? "bg-val-purple/15 border-val-purple/20 text-val-purple cursor-not-allowed"
                : "bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 active:scale-95"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? "animate-spin" : ""}`} />
            <span>RELOAD MAG</span>
          </button>
        </div>

        {/* Studio Lighting Presets (visible in 3D Mode only) */}
        {use3DMode && (
          <div className="flex items-center space-x-1.5">
            <span className="font-mono text-[7px] text-gray-400 uppercase mr-1">PROJECTOR MODE:</span>
            <button
              onClick={() => setLightingPreset("neon")}
              className={`px-1.5 py-0.5 rounded text-[7px] font-mono border transition-all ${
                lightingPreset === "neon"
                  ? "bg-val-cyan/15 border-val-cyan text-val-cyan"
                  : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
              }`}
            >
              NEON
            </button>
            <button
              onClick={() => setLightingPreset("tactical")}
              className={`px-1.5 py-0.5 rounded text-[7px] font-mono border transition-all ${
                lightingPreset === "tactical"
                  ? "bg-val-cyan/15 border-val-cyan text-val-cyan"
                  : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
              }`}
            >
              TACTICAL
            </button>
            <button
              onClick={() => setLightingPreset("dark")}
              className={`px-1.5 py-0.5 rounded text-[7px] font-mono border transition-all ${
                lightingPreset === "dark"
                  ? "bg-val-cyan/15 border-val-cyan text-val-cyan"
                  : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
              }`}
            >
              STEALTH
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
