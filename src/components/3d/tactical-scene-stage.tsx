"use client";

import React, { useRef, useMemo, useEffect, Suspense, forwardRef, useImperativeHandle } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

export interface TacticalStageHandle {
  resetCamera: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  rotateStep: (direction: "left" | "right") => void;
}

interface WeaponMeshProps {
  textureUrl: string;
  prefersReducedMotion?: boolean;
  onTextureLoaded?: () => void;
}

function WeaponMesh({ textureUrl, prefersReducedMotion = false, onTextureLoaded }: WeaponMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(textureUrl);

  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      onTextureLoaded?.();
    }
  }, [texture, onTextureLoaded]);

  // Compute proportional aspect ratio
  const { geometry, material } = useMemo(() => {
    const img = texture.image as { width?: number; height?: number } | undefined;
    const aspect = img && img.width && img.height ? img.height / img.width : 0.32;
    const width = 4.2;
    const height = width * aspect;

    const geom = new THREE.PlaneGeometry(width, height);
    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.05,
      side: THREE.DoubleSide,
      roughness: 0.35,
      metalness: 0.25,
      depthWrite: false,
    });

    return { geometry: geom, material: mat };
  }, [texture]);

  // Clean up geometry & material when texture or component unmounts
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // Subtle floating micro-motion (idle breathing), disabled if prefersReducedMotion is active
  useFrame((state) => {
    if (meshRef.current && !prefersReducedMotion) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(t * 1.2) * 0.035;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Dynamic weapon mesh */}
      <mesh ref={meshRef} geometry={geometry} material={material} />

      {/* Soft ground shadow */}
      <mesh position={[0, -1.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 1.8, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.28} depthWrite={false} />
      </mesh>
    </group>
  );
}

interface TacticalSceneStageProps {
  imageUrl: string;
  autoRotate?: boolean;
  prefersReducedMotion?: boolean;
  onUserInteract?: () => void;
  onLoaded?: () => void;
}

export const TacticalSceneStage = forwardRef<TacticalStageHandle, TacticalSceneStageProps>(
  function TacticalSceneStage(
    { imageUrl, autoRotate = false, prefersReducedMotion = false, onUserInteract, onLoaded },
    ref
  ) {
    const controlsRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      resetCamera: () => {
        if (controlsRef.current) {
          controlsRef.current.reset();
        }
      },
      zoomIn: () => {
        if (controlsRef.current) {
          const camera = controlsRef.current.object;
          if (camera && camera.position.z > 2.8) {
            camera.position.z = Math.max(2.8, camera.position.z - 0.6);
            controlsRef.current.update();
          }
        }
      },
      zoomOut: () => {
        if (controlsRef.current) {
          const camera = controlsRef.current.object;
          if (camera && camera.position.z < 6.8) {
            camera.position.z = Math.min(6.8, camera.position.z + 0.6);
            controlsRef.current.update();
          }
        }
      },
      rotateStep: (direction: "left" | "right") => {
        if (controlsRef.current) {
          const delta = direction === "left" ? 0.2 : -0.2;
          const currentAzimuth = controlsRef.current.getAzimuthalAngle();
          const target = currentAzimuth + delta;
          const clamped = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, target));
          controlsRef.current.setAzimuthalAngle(clamped);
          controlsRef.current.update();
        }
      },
    }));

    return (
      <div className="relative w-full h-full select-none" style={{ touchAction: "pan-y" }}>
        <Canvas
          camera={{ position: [0, 0, 4.8], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          onPointerDown={() => onUserInteract?.()}
          onWheel={() => onUserInteract?.()}
          onTouchStart={() => onUserInteract?.()}
          style={{ width: "100%", height: "100%", background: "transparent" }}
        >
          {/* Cinematic 3-point studio lighting */}
          <ambientLight intensity={1.2} color="#e8edf2" />
          {/* Key light — warm from upper-right */}
          <directionalLight position={[4, 5, 4]} intensity={2.0} color="#fff8f0" />
          {/* Fill light — cool from left */}
          <directionalLight position={[-4, 0, 2]} intensity={0.55} color="#d0dce8" />
          {/* Rim light — red accent from behind */}
          <pointLight position={[-2, 3, -3]} intensity={0.9} color="#ff4655" distance={10} />

          <Suspense fallback={null}>
            <WeaponMesh
              textureUrl={imageUrl}
              prefersReducedMotion={prefersReducedMotion}
              onTextureLoaded={onLoaded}
            />
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate && !prefersReducedMotion}
            autoRotateSpeed={0.8}
            enableDamping={true}
            dampingFactor={0.08}
            minDistance={2.6}
            maxDistance={7.0}
            /* Pitch clamping: Prevents seeing through razor-thin edge */
            minPolarAngle={Math.PI / 2 - 0.28}
            maxPolarAngle={Math.PI / 2 + 0.28}
            /* Yaw clamping: Ensures weapon stays face-accessible */
            minAzimuthAngle={-Math.PI / 2.2}
            maxAzimuthAngle={Math.PI / 2.2}
          />
        </Canvas>
      </div>
    );
  }
);
export default TacticalSceneStage;
