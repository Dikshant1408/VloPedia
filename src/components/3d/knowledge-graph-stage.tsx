"use client";

import React, { useRef, useMemo, useEffect, Suspense, forwardRef, useImperativeHandle, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import type { AgentKnowledgeNode } from "@/lib/knowledge-graph";

export interface GraphStageHandle {
  resetCamera: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

export interface GraphNodeItem {
  id: string;
  label: string;
  slug: string;
  type: "synergy" | "counter" | "map" | "weapon" | "agent";
  reason: string;
  sublabel?: string;
  position: [number, number, number];
  color: string;
  url: string;
}

interface KnowledgeMeshProps {
  node: AgentKnowledgeNode;
  activeFilter: "all" | "synergy" | "counter" | "map" | "weapon";
  selectedNode: GraphNodeItem | null;
  onSelectNode: (item: GraphNodeItem) => void;
  prefersReducedMotion?: boolean;
}

function KnowledgeMesh({
  node,
  activeFilter,
  selectedNode,
  onSelectNode,
  prefersReducedMotion = false,
}: KnowledgeMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Compute 3D node positions across orbital planes
  const graphItems = useMemo<GraphNodeItem[]>(() => {
    const items: GraphNodeItem[] = [];

    // Center Node (Current Agent)
    const roleColor =
      node.role.toLowerCase() === "duelist"
        ? "#F87171"
        : node.role.toLowerCase() === "controller"
        ? "#A78BFA"
        : node.role.toLowerCase() === "initiator"
        ? "#FBBF24"
        : "#34D399";

    items.push({
      id: `center-${node.slug}`,
      label: node.name,
      slug: node.slug,
      type: "agent",
      reason: `${node.role} Operative // Tier: ${node.meta.tier || "Active"}`,
      sublabel: node.role,
      position: [0, 0, 0],
      color: roleColor,
      url: `/agents/${node.slug}`,
    });

    // Orbit 1: Synergies (Radius 2.6, height variation)
    const synergies = node.tactical.synergies || [];
    synergies.forEach((syn, i) => {
      const angle = (i / Math.max(1, synergies.length)) * Math.PI * 2 + 0.2;
      const r = 2.6;
      items.push({
        id: `syn-${syn.agentSlug}`,
        label: syn.agentName,
        slug: syn.agentSlug,
        type: "synergy",
        reason: syn.synergyReason,
        sublabel: syn.comboAbility ? `Combo: ${syn.comboAbility}` : "Tactical Synergy",
        position: [Math.cos(angle) * r, Math.sin(angle * 2) * 0.4, Math.sin(angle) * r],
        color: "#0DF2F2",
        url: `/agents/${syn.agentSlug}`,
      });
    });

    // Orbit 2: Hard Counters (Radius 3.6)
    const counters = node.tactical.counters || [];
    counters.forEach((cnt, i) => {
      const angle = (i / Math.max(1, counters.length)) * Math.PI * 2 + 1.2;
      const r = 3.6;
      items.push({
        id: `cnt-${cnt.agentSlug}`,
        label: cnt.agentName,
        slug: cnt.agentSlug,
        type: "counter",
        reason: cnt.counterReason,
        sublabel: `Danger: ${cnt.dangerLevel}`,
        position: [Math.cos(angle) * r, -0.3 + (i % 2) * 0.6, Math.sin(angle) * r],
        color: "#FA4454",
        url: `/agents/${cnt.agentSlug}`,
      });
    });

    // Orbit 3: Best Maps (Radius 4.6)
    const maps = node.tactical.bestMaps || [];
    maps.forEach((m, i) => {
      const angle = (i / Math.max(1, maps.length)) * Math.PI * 2 + 2.4;
      const r = 4.6;
      items.push({
        id: `map-${m.slug}`,
        label: m.name,
        slug: m.slug,
        type: "map",
        reason: m.reason,
        sublabel: "Optimal Map Fit",
        position: [Math.cos(angle) * r, 0.4 - (i % 2) * 0.8, Math.sin(angle) * r],
        color: "#10B981",
        url: `/maps/${m.slug}`,
      });
    });

    // Orbit 4: Signature Weapons (Radius 5.5)
    const weapons = node.tactical.signatureWeapons || [];
    weapons.forEach((w, i) => {
      const angle = (i / Math.max(1, weapons.length)) * Math.PI * 2 + 3.4;
      const r = 5.4;
      items.push({
        id: `wpn-${w.slug}`,
        label: w.name,
        slug: w.slug,
        type: "weapon",
        reason: w.why,
        sublabel: "Signature Loadout",
        position: [Math.cos(angle) * r, (i % 2) * 0.5 - 0.25, Math.sin(angle) * r],
        color: "#F59E0B",
        url: `/weapons/${w.slug}`,
      });
    });

    return items;
  }, [node]);

  // Filter items
  const visibleItems = useMemo(() => {
    if (activeFilter === "all") return graphItems;
    return graphItems.filter((it) => it.type === "agent" || it.type === activeFilter);
  }, [graphItems, activeFilter]);

  // Gentle idle rotation of outer orbit if motion is not reduced
  useFrame((state) => {
    if (groupRef.current && !prefersReducedMotion) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Tactical Orbital Rings in X-Z Plane */}
      {[2.6, 3.6, 4.6, 5.4].map((radius, idx) => (
        <mesh key={`orbit-${idx}`} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.015, radius + 0.015, 64]} />
          <meshBasicMaterial
            color="#1E293B"
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Connection lines from center node to active items */}
      {visibleItems
        .filter((it) => it.type !== "agent")
        .map((it) => {
          const isSelected = selectedNode?.id === it.id;
          const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...it.position)];
          const lineGeom = new THREE.BufferGeometry().setFromPoints(points);

          return (
            <primitive
              key={`line-${it.id}`}
              object={
                new THREE.Line(
                  lineGeom,
                  new THREE.LineBasicMaterial({
                    color: it.color,
                    transparent: true,
                    opacity: isSelected ? 0.9 : 0.25,
                  })
                )
              }
            />
          );
        })}

      {/* 3D Entity Nodes */}
      {visibleItems.map((item) => {
        const isCenter = item.type === "agent";
        const isSelected = selectedNode?.id === item.id;
        const radius = isCenter ? 0.22 : isSelected ? 0.16 : 0.11;

        return (
          <group key={item.id} position={item.position}>
            {/* Glowing outer disc */}
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(item);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "auto";
              }}
            >
              <sphereGeometry args={[radius, 16, 16]} />
              <meshStandardMaterial
                color={item.color}
                emissive={item.color}
                emissiveIntensity={isSelected ? 1.0 : isCenter ? 0.8 : 0.4}
                roughness={0.3}
                metalness={0.2}
              />
            </mesh>

            {/* Tactical 3D Billboard Label */}
            <Html
              position={[0, radius + 0.18, 0]}
              center
              distanceFactor={9}
              zIndexRange={[100, 0]}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              <div
                className={`px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider border whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-primary text-black border-primary font-black scale-110 shadow-lg"
                    : isCenter
                    ? "bg-[#0B141A]/95 text-primary border-primary/50"
                    : "bg-[#0B141A]/90 text-white/90 border-border"
                }`}
              >
                {item.label}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

interface KnowledgeGraphStageProps {
  node: AgentKnowledgeNode;
  activeFilter: "all" | "synergy" | "counter" | "map" | "weapon";
  autoRotate?: boolean;
  prefersReducedMotion?: boolean;
  onSelectNode: (item: GraphNodeItem) => void;
  onUserInteract?: () => void;
}

export const KnowledgeGraphStage = forwardRef<GraphStageHandle, KnowledgeGraphStageProps>(
  function KnowledgeGraphStage(
    {
      node,
      activeFilter,
      autoRotate = false,
      prefersReducedMotion = false,
      onSelectNode,
      onUserInteract,
    },
    ref
  ) {
    const controlsRef = useRef<any>(null);
    const [selectedNode, setSelectedNode] = useState<GraphNodeItem | null>(null);

    const handleNodeClick = (item: GraphNodeItem) => {
      setSelectedNode(item);
      onSelectNode(item);
      onUserInteract?.();
    };

    useImperativeHandle(ref, () => ({
      resetCamera: () => {
        if (controlsRef.current) {
          controlsRef.current.reset();
        }
        setSelectedNode(null);
      },
      zoomIn: () => {
        if (controlsRef.current) {
          const camera = controlsRef.current.object;
          if (camera && camera.position.length() > 3.0) {
            camera.position.multiplyScalar(0.85);
            controlsRef.current.update();
          }
        }
      },
      zoomOut: () => {
        if (controlsRef.current) {
          const camera = controlsRef.current.object;
          if (camera && camera.position.length() < 12.0) {
            camera.position.multiplyScalar(1.15);
            controlsRef.current.update();
          }
        }
      },
    }));

    return (
      <div className="relative w-full h-full select-none" style={{ touchAction: "pan-y" }}>
        <Canvas
          camera={{ position: [0, 5.5, 6.5], fov: 48 }}
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
          <ambientLight intensity={1.4} />
          <directionalLight position={[6, 8, 6]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-6, -4, -4]} intensity={0.9} color="#0DF2F2" />
          <pointLight position={[0, 0, 0]} intensity={1.5} color="#FA4454" distance={8} />

          <Suspense fallback={null}>
            <KnowledgeMesh
              node={node}
              activeFilter={activeFilter}
              selectedNode={selectedNode}
              onSelectNode={handleNodeClick}
              prefersReducedMotion={prefersReducedMotion}
            />
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={autoRotate && !prefersReducedMotion}
            autoRotateSpeed={0.5}
            enableDamping={true}
            dampingFactor={0.08}
            minDistance={3.0}
            maxDistance={12.0}
          />
        </Canvas>
      </div>
    );
  }
);
export default KnowledgeGraphStage;
