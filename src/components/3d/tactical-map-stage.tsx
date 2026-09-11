"use client";

import React, { useRef, useMemo, useEffect, Suspense, forwardRef, useImperativeHandle, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import type { ValorantCallout } from "@/lib/valorant-types";

export interface TacticalMapStageHandle {
  resetCamera: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  focusCallout: (callout: ProcessedCallout) => void;
}

export interface ProcessedCallout {
  regionName: string;
  superRegionName: string;
  x: number; // 3D world space X
  z: number; // 3D world space Z (corresponds to minimap Y)
  normX: number; // 0 to 1
  normY: number; // 0 to 1
  category: "site" | "spawn" | "choke" | "other";
}

interface MapMeshProps {
  textureUrl: string;
  callouts: ProcessedCallout[];
  activeLayer: "all" | "sites" | "choke" | "spawns";
  selectedCallout: ProcessedCallout | null;
  onSelectCallout: (c: ProcessedCallout) => void;
  onLoaded?: () => void;
}

function MapMesh({
  textureUrl,
  callouts,
  activeLayer,
  selectedCallout,
  onSelectCallout,
  onLoaded,
}: MapMeshProps) {
  const texture = useTexture(textureUrl);

  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      onLoaded?.();
    }
  }, [texture, onLoaded]);

  // Plane geometry & material
  const { geometry, material } = useMemo(() => {
    const size = 6.0;
    const geom = new THREE.PlaneGeometry(size, size);
    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.05,
      side: THREE.DoubleSide,
      roughness: 0.4,
      metalness: 0.15,
      depthWrite: false,
    });
    return { geometry: geom, material: mat };
  }, [texture]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // Filter callouts based on activeLayer
  const visibleCallouts = useMemo(() => {
    return callouts.filter((c) => {
      if (activeLayer === "all") return true;
      if (activeLayer === "sites") return c.category === "site";
      if (activeLayer === "spawns") return c.category === "spawn";
      if (activeLayer === "choke") return c.category === "choke";
      return true;
    });
  }, [callouts, activeLayer]);

  return (
    <group position={[0, 0, 0]}>
      {/* 3D Sandtable Holographic Plane (Horizontal X-Z) */}
      <mesh
        geometry={geometry}
        material={material}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      />

      {/* Ground Tactical Grid */}
      <group position={[0, -0.05, 0]}>
        <gridHelper args={[7.2, 12, "#FA4454", "#162836"]} />
      </group>

      {/* 3D Holographic Waypoint Markers */}
      {visibleCallouts.map((c, idx) => {
        const isSelected = selectedCallout?.regionName === c.regionName && selectedCallout?.superRegionName === c.superRegionName;
        const color =
          c.category === "site"
            ? "#FA4454"
            : c.category === "spawn"
            ? "#0DF2F2"
            : c.category === "choke"
            ? "#FBBF24"
            : "#A7B0B7";

        return (
          <group key={`${c.regionName}-${idx}`} position={[c.x, 0, c.z]}>
            {/* Ground beacon disc */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
              <ringGeometry args={[isSelected ? 0.12 : 0.06, isSelected ? 0.22 : 0.12, 16]} />
              <meshBasicMaterial color={color} transparent opacity={isSelected ? 0.9 : 0.6} depthWrite={false} />
            </mesh>

            {/* Vertical waypoint stem */}
            <mesh position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
              <meshBasicMaterial color={color} />
            </mesh>

            {/* Top beacon head */}
            <mesh
              position={[0, 0.38, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectCallout(c);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "auto";
              }}
            >
              <sphereGeometry args={[isSelected ? 0.08 : 0.05, 12, 12]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isSelected ? 0.8 : 0.3}
              />
            </mesh>

            {/* HTML Marker Label on Sites or when selected */}
            {(c.category === "site" || isSelected) && (
              <Html
                position={[0, 0.52, 0]}
                center
                distanceFactor={10}
                zIndexRange={[100, 0]}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                <div
                  className={`px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border whitespace-nowrap shadow-md ${
                    isSelected
                      ? "bg-primary text-black border-primary font-black"
                      : "bg-[#0B141A]/90 text-white border-border"
                  }`}
                >
                  {c.superRegionName ? `${c.superRegionName} ${c.regionName}` : c.regionName}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

interface TacticalMapStageProps {
  minimapUrl: string;
  callouts: ProcessedCallout[];
  activeLayer: "all" | "sites" | "choke" | "spawns";
  autoRotate?: boolean;
  prefersReducedMotion?: boolean;
  onSelectCallout: (c: ProcessedCallout) => void;
  onUserInteract?: () => void;
  onLoaded?: () => void;
}

export const TacticalMapStage = forwardRef<TacticalMapStageHandle, TacticalMapStageProps>(
  function TacticalMapStage(
    {
      minimapUrl,
      callouts,
      activeLayer,
      autoRotate = false,
      prefersReducedMotion = false,
      onSelectCallout,
      onUserInteract,
      onLoaded,
    },
    ref
  ) {
    const controlsRef = useRef<any>(null);
    const [selectedCallout, setSelectedCallout] = useState<ProcessedCallout | null>(null);

    const handleCalloutSelect = (c: ProcessedCallout) => {
      setSelectedCallout(c);
      onSelectCallout(c);
      onUserInteract?.();
    };

    useImperativeHandle(ref, () => ({
      resetCamera: () => {
        if (controlsRef.current) {
          controlsRef.current.reset();
        }
        setSelectedCallout(null);
      },
      zoomIn: () => {
        if (controlsRef.current) {
          const camera = controlsRef.current.object;
          if (camera && camera.position.y > 2.5) {
            camera.position.y = Math.max(2.5, camera.position.y - 0.8);
            controlsRef.current.update();
          }
        }
      },
      zoomOut: () => {
        if (controlsRef.current) {
          const camera = controlsRef.current.object;
          if (camera && camera.position.y < 8.0) {
            camera.position.y = Math.min(8.0, camera.position.y + 0.8);
            controlsRef.current.update();
          }
        }
      },
      focusCallout: (callout: ProcessedCallout) => {
        setSelectedCallout(callout);
        if (controlsRef.current) {
          controlsRef.current.target.set(callout.x, 0, callout.z);
          controlsRef.current.update();
        }
      },
    }));

    return (
      <div className="relative w-full h-full select-none" style={{ touchAction: "pan-y" }}>
        <Canvas
          camera={{ position: [0, 4.6, 4.2], fov: 48 }}
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
          {/* Tactical Studio Lighting */}
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 8, 5]} intensity={1.6} color="#ffffff" />
          <directionalLight position={[-5, 4, -4]} intensity={0.9} color="#0DF2F2" />
          <pointLight position={[0, 4, 0]} intensity={1.0} color="#FA4454" distance={10} />

          <Suspense fallback={null}>
            <MapMesh
              textureUrl={minimapUrl}
              callouts={callouts}
              activeLayer={activeLayer}
              selectedCallout={selectedCallout}
              onSelectCallout={handleCalloutSelect}
              onLoaded={onLoaded}
            />
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            panSpeed={0.8}
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate && !prefersReducedMotion}
            autoRotateSpeed={0.5}
            enableDamping={true}
            dampingFactor={0.08}
            minDistance={2.4}
            maxDistance={8.5}
            /* Pitch clamping: Prevent viewing under the sandtable */
            minPolarAngle={0.2}
            maxPolarAngle={Math.PI / 2 - 0.1}
          />
        </Canvas>
      </div>
    );
  }
);
export default TacticalMapStage;
