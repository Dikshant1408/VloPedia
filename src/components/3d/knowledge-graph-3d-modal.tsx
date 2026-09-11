"use client";

import React, { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { X, RotateCcw, RotateCw, ZoomIn, ZoomOut, ArrowRight, Network, ShieldAlert, Users, MapPin, Crosshair } from "lucide-react";
import { SceneLoader } from "./scene-loader";
import { TheaterModal } from "./theater-modal";
import type { AgentKnowledgeNode } from "@/lib/knowledge-graph";
import type { GraphStageHandle, GraphNodeItem } from "./knowledge-graph-stage";

const KnowledgeGraphStage = dynamic(
  () => import("./knowledge-graph-stage").then((mod) => mod.KnowledgeGraphStage),
  {
    ssr: false,
    loading: () => <SceneLoader label="INITIALIZING SPATIAL KNOWLEDGE WEB..." />,
  }
);

interface KnowledgeGraph3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: AgentKnowledgeNode;
}

export function KnowledgeGraph3DModal({
  isOpen,
  onClose,
  node,
}: KnowledgeGraph3DModalProps) {
  const stageRef = useRef<GraphStageHandle>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "synergy" | "counter" | "map" | "weapon">("all");
  const [selectedItem, setSelectedItem] = useState<GraphNodeItem | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  const handleReset = useCallback(() => {
    stageRef.current?.resetCamera();
    setSelectedItem(null);
  }, []);

  const handleZoomIn = useCallback(() => {
    stageRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    stageRef.current?.zoomOut();
  }, []);

  if (!isOpen) return null;

  return (
    <TheaterModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${node.name.toUpperCase()} // SPATIAL INTELLIGENCE WEB`}
      subtitle="CANONICAL ENTITY RELATIONSHIP RADAR // OPERATIVE STRATEGY PROTOCOL"
    >
      <div className="relative w-full h-full flex flex-col justify-between overflow-hidden" onDoubleClick={handleReset}>
        {/* Top Control Bar: Category Filters */}
        <div className="absolute top-4 inset-x-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-card/90 border border-border text-[9px] font-mono-tactical uppercase tracking-wider text-muted backdrop-blur-xs">
            <Network className="h-3.5 w-3.5 text-primary" />
            <span className="text-white font-bold">{node.name}</span>
            <span className="text-muted-dark">{"// 3D RELATIONAL MESH"}</span>
          </div>

          <div className="flex items-center gap-1 bg-surface-card/90 border border-border p-1 backdrop-blur-xs pointer-events-auto">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-2 py-1 text-[8px] font-mono-tactical font-bold uppercase tracking-wider border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                activeFilter === "all"
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              ALL
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("synergy")}
              className={`px-2 py-1 text-[8px] font-mono-tactical font-bold uppercase tracking-wider border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                activeFilter === "synergy"
                  ? "border-[#0DF2F2] bg-[#0DF2F2]/15 text-[#0DF2F2]"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              SYNERGIES
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("counter")}
              className={`px-2 py-1 text-[8px] font-mono-tactical font-bold uppercase tracking-wider border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                activeFilter === "counter"
                  ? "border-[#FA4454] bg-[#FA4454]/15 text-[#FA4454]"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              COUNTERS
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("map")}
              className={`px-2 py-1 text-[8px] font-mono-tactical font-bold uppercase tracking-wider border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                activeFilter === "map"
                  ? "border-[#10B981] bg-[#10B981]/15 text-[#10B981]"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              MAP FITS
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("weapon")}
              className={`px-2 py-1 text-[8px] font-mono-tactical font-bold uppercase tracking-wider border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                activeFilter === "weapon"
                  ? "border-[#F59E0B] bg-[#F59E0B]/15 text-[#F59E0B]"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              WEAPONS
            </button>
          </div>
        </div>

        {/* 3D Scene Viewport */}
        <div className="w-full h-full">
          <KnowledgeGraphStage
            ref={stageRef}
            node={node}
            activeFilter={activeFilter}
            autoRotate={isAutoRotating}
            onSelectNode={(item) => setSelectedItem(item)}
          />
        </div>

        {/* Bottom HUD Bar: Selected Intelligence Dossier & Controls */}
        <div className="absolute bottom-4 inset-x-4 z-20 flex items-end justify-between gap-4 pointer-events-none">
          {/* Selected Node Intelligence Callout Card */}
          <div className="pointer-events-auto max-w-md w-full">
            {selectedItem ? (
              <div className="bg-surface-card/95 border border-border p-4 shadow-2xl space-y-2 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: selectedItem.color }} />
                    <span className="font-display font-black text-sm uppercase tracking-wider text-white">
                      {selectedItem.label}
                    </span>
                    <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 border border-border bg-surface text-muted">
                      {selectedItem.type}
                    </span>
                  </div>

                  <Link
                    href={selectedItem.url}
                    onClick={onClose}
                    className="font-mono text-[9px] uppercase tracking-wider text-primary hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>View Dossier</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <p className="text-xs text-muted font-sans leading-relaxed">
                  {selectedItem.reason}
                </p>

                {selectedItem.sublabel && (
                  <div className="text-[9px] font-mono uppercase text-[#0DF2F2] pt-1">
                    {selectedItem.sublabel}
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-surface-card/80 border border-border text-[9px] font-mono-tactical text-muted backdrop-blur-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span>CLICK ANY SATELLITE NODE TO INSPECT TACTICAL DOSSIER</span>
              </div>
            )}
          </div>

          {/* Action HUD Buttons */}
          <div className="flex items-center gap-1 bg-surface-card/90 border border-border p-1 backdrop-blur-xs pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsAutoRotating((prev) => !prev)}
              aria-pressed={isAutoRotating}
              title={isAutoRotating ? "Pause Orbit" : "Auto Orbit"}
              className={`p-1.5 text-[9px] font-mono-tactical font-bold border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${
                isAutoRotating
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              <RotateCw className={`h-3.5 w-3.5 ${isAutoRotating ? "animate-spin duration-3000" : ""}`} />
            </button>

            <button
              type="button"
              onClick={handleReset}
              title="Reset View Orientation"
              className="p-1.5 border border-transparent text-muted hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            <div className="w-[1px] h-3.5 bg-border mx-0.5" aria-hidden="true" />

            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoom In"
              aria-label="Zoom In"
              className="p-1.5 text-muted hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={handleZoomOut}
              title="Zoom Out"
              aria-label="Zoom Out"
              className="p-1.5 text-muted hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </TheaterModal>
  );
}

export default KnowledgeGraph3DModal;
