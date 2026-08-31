/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { playSFX } from "../utils/sfx";
import { Zap, RefreshCw, Layers, Gauge, ToggleLeft, ToggleRight } from "lucide-react";

type CoreColor = "red" | "cyan" | "gold";
type CoreStyle = "plasma" | "holo" | "dust";

export default function RadianiteCore3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States for HUD control
  const [color, setColor] = useState<CoreColor>("cyan");
  const [style, setStyle] = useState<CoreStyle>("plasma");
  const [spinSpeed, setSpinSpeed] = useState<number>(1.5); // Multiplier
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [pulsesTriggered, setPulsesTriggered] = useState<number>(0);

  // Refs for animation loop updates
  const stateRef = useRef({ color, style, spinSpeed, autoRotate, pulseActive: false, pulseTime: 0 });

  // Update refs when state changes so the Three.js render loop has direct access
  useEffect(() => {
    stateRef.current = { color, style, spinSpeed, autoRotate, pulseActive: stateRef.current.pulseActive, pulseTime: stateRef.current.pulseTime };
  }, [color, style, spinSpeed, autoRotate]);

  // Handle pulse trigger
  const triggerPulse = () => {
    playSFX.selectSurge();
    setPulsesTriggered(prev => prev + 1);
    stateRef.current.pulseActive = true;
    stateRef.current.pulseTime = 0;
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // Dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 10;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Groups
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Geometries
    const innerGeom = new THREE.OctahedronGeometry(1.2, 0);
    const outerGeom = new THREE.OctahedronGeometry(1.6, 0);
    const ringGeom = new THREE.RingGeometry(2.2, 2.25, 64);

    // Color Hex Codes
    const hexMap = {
      red: 0xfa4454,
      cyan: 0x0df2f2,
      gold: 0xfaee0d,
    };

    // Create central core mesh
    const innerMaterial = new THREE.MeshPhongMaterial({
      color: hexMap[color],
      emissive: hexMap[color],
      emissiveIntensity: 0.8,
      flatShading: true,
      transparent: true,
      opacity: 0.9,
      shininess: 100,
    });
    const innerMesh = new THREE.Mesh(innerGeom, innerMaterial);
    coreGroup.add(innerMesh);

    // Create outer shield mesh
    const outerMaterial = new THREE.MeshPhongMaterial({
      color: hexMap[color],
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const outerMesh = new THREE.Mesh(outerGeom, outerMaterial);
    coreGroup.add(outerMesh);

    // Orbital ring
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: hexMap[color],
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const orbitalRing = new THREE.LineLoop(ringGeom, ringMaterial);
    orbitalRing.rotation.x = Math.PI / 3;
    scene.add(orbitalRing);

    // Second diagonal orbital ring
    const orbitalRing2 = new THREE.LineLoop(ringGeom, ringMaterial);
    orbitalRing2.rotation.x = -Math.PI / 4;
    orbitalRing2.rotation.y = Math.PI / 4;
    scene.add(orbitalRing2);

    // Particle embers floating around core
    const particleCount = 150;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleDistances = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Random coordinates in a spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const distance = Math.random() * 1.5 + 1.8; // Radial offset from core

      particlePositions[i * 3] = distance * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = distance * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = distance * Math.cos(phi);

      particleSpeeds[i] = Math.random() * 0.02 + 0.005;
      particleDistances[i] = distance;
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const pMaterial = new THREE.PointsMaterial({
      color: hexMap[color],
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeom, pMaterial);
    scene.add(particles);

    // Shockwave Ring for Pulse discharge effect
    const pulseRingGeom = new THREE.RingGeometry(0.1, 0.15, 32);
    const pulseRingMat = new THREE.MeshBasicMaterial({
      color: hexMap[color],
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const pulseRing = new THREE.Mesh(pulseRingGeom, pulseRingMat);
    pulseRing.rotation.x = Math.PI / 2;
    scene.add(pulseRing);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0a1a24, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const pointLight = new THREE.PointLight(hexMap[color], 3, 10);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Interactive Drag Mechanics
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let dragRotationX = 0;
    let dragRotationY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y,
      };

      // Rotate group directly
      coreGroup.rotation.y += deltaMove.x * 0.005;
      coreGroup.rotation.x += deltaMove.y * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Add drag event listeners to canvas
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Resize Handling
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      const currentStyle = stateRef.current.style;
      const currentColorHex = hexMap[stateRef.current.color];
      const speedMultiplier = stateRef.current.spinSpeed;

      // 1. Dynamic style adjustments
      if (currentStyle === "holo") {
        innerMesh.visible = true;
        innerMaterial.wireframe = true;
        outerMesh.visible = true;
        outerMaterial.wireframe = true;
        outerMaterial.opacity = 0.5;
        particles.visible = false;
      } else if (currentStyle === "dust") {
        innerMesh.visible = false;
        outerMesh.visible = false;
        particles.visible = true;
        pMaterial.size = 0.12;
      } else {
        // plasma / solid
        innerMesh.visible = true;
        innerMaterial.wireframe = false;
        outerMesh.visible = true;
        outerMaterial.wireframe = true;
        outerMaterial.opacity = 0.2;
        particles.visible = true;
        pMaterial.size = 0.08;
      }

      // 2. Color updating dynamically
      innerMaterial.color.setHex(currentColorHex);
      innerMaterial.emissive.setHex(currentColorHex);
      outerMaterial.color.setHex(currentColorHex);
      ringMaterial.color.setHex(currentColorHex);
      pulseRingMat.color.setHex(currentColorHex);
      pMaterial.color.setHex(currentColorHex);
      pointLight.color.setHex(currentColorHex);

      // 3. Spinnings
      if (stateRef.current.autoRotate && !isDragging) {
        const rotationDelta = delta * 0.4 * speedMultiplier;
        coreGroup.rotation.y += rotationDelta;
        coreGroup.rotation.x += rotationDelta * 0.4;
      }

      orbitalRing.rotation.z += delta * 0.2 * speedMultiplier;
      orbitalRing2.rotation.z -= delta * 0.3 * speedMultiplier;

      // 4. Floating bounce effect
      if (!isDragging) {
        const bounce = Math.sin(elapsedTime * 1.5) * 0.12;
        coreGroup.position.y = bounce;
      }

      // 5. Orbiting particles movement
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        // Fetch current coordinates
        let px = positions[i * 3];
        let py = positions[i * 3 + 1];
        let pz = positions[i * 3 + 2];

        // Orbit calculation
        const speed = particleSpeeds[i] * speedMultiplier;
        
        // Spin around Y axis
        const cosY = Math.cos(speed);
        const sinY = Math.sin(speed);

        positions[i * 3] = px * cosY - pz * sinY;
        positions[i * 3 + 2] = px * sinY + pz * cosY;

        // Bouncing drift
        positions[i * 3 + 1] += Math.sin(elapsedTime * 2 + i) * 0.003;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // 6. Pulse effect handling
      if (stateRef.current.pulseActive) {
        stateRef.current.pulseTime += delta;
        const pt = stateRef.current.pulseTime;

        if (pt < 1.0) {
          // Shockwave expansion
          const scaleVal = 1 + pt * 35;
          pulseRing.scale.set(scaleVal, scaleVal, 1);
          pulseRingMat.opacity = Math.max(0, 1 - pt * 1.2);

          // Crystal expansion flash
          const innerScale = 1.0 + Math.sin(pt * Math.PI) * 0.4;
          innerMesh.scale.set(innerScale, innerScale, innerScale);
          innerMaterial.emissiveIntensity = 1.5 + Math.sin(pt * Math.PI) * 1.5;

          // Push particles outwards
          for (let i = 0; i < particleCount; i++) {
            positions[i * 3] *= 1.015;
            positions[i * 3 + 1] *= 1.015;
            positions[i * 3 + 2] *= 1.015;
          }
        } else {
          // Reset pulse state
          stateRef.current.pulseActive = false;
          pulseRingMat.opacity = 0;
          innerMesh.scale.set(1, 1, 1);
          innerMaterial.emissiveIntensity = 0.8;

          // Pull particles back to baseline distances
          for (let i = 0; i < particleCount; i++) {
            const currentDist = Math.sqrt(
              positions[i * 3] ** 2 +
              positions[i * 3 + 1] ** 2 +
              positions[i * 3 + 2] ** 2
            );
            const targetDist = particleDistances[i];
            const ratio = targetDist / currentDist;

            positions[i * 3] *= ratio;
            positions[i * 3 + 1] *= ratio;
            positions[i * 3 + 2] *= ratio;
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      resizeObserver.disconnect();

      innerGeom.dispose();
      outerGeom.dispose();
      ringGeom.dispose();
      pulseRingGeom.dispose();
      innerMaterial.dispose();
      outerMaterial.dispose();
      ringMaterial.dispose();
      pulseRingMat.dispose();
      pMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[360px] md:h-[420px] rounded-sm border border-white/10 bg-[#0B141A]/60 overflow-hidden group clip-diagonal select-none"
    >
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Cybernetic HUD Frame overlay */}
      <div className="absolute inset-0 pointer-events-none border-2 border-white/[0.03] m-2 flex flex-col justify-between p-4">
        {/* HUD Header */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="flex flex-col">
            <span className="font-mono text-[9px] text-[#0DF2F2] tracking-widest font-black uppercase">
              RADIANITE_REACTOR // STATUS_ONLINE
            </span>
            <span className="font-display font-black text-lg text-white mt-0.5 tracking-tight uppercase">
              3D Quantum Core
            </span>
          </div>
          <button
            onClick={triggerPulse}
            className="flex items-center space-x-1.5 border border-[#FA4454]/40 bg-[#FA4454]/5 hover:bg-[#FA4454]/10 text-white font-mono text-[9px] tracking-widest uppercase px-2.5 py-1.5 clip-diagonal-sm cursor-none interactive-tactical hover:border-[#FA4454] transition-all"
            title="Trigger raw Radianite shockwave pulse"
          >
            <Zap className="w-3.5 h-3.5 text-[#FA4454]" />
            <span>DISCHARGE</span>
          </button>
        </div>

        {/* HUD Core Controls Overlaid */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 pointer-events-auto mt-auto">
          {/* Settings board */}
          <div className="flex flex-wrap gap-4 bg-black/75 border border-white/5 p-3 rounded-xs backdrop-blur-md w-full md:w-auto">
            {/* 1. Colors selector */}
            <div className="flex flex-col space-y-1">
              <span className="font-mono text-[8px] text-white/40 tracking-wider">CORE_SPECTRUM</span>
              <div className="flex items-center space-x-2">
                {[
                  { key: "cyan", hex: "#0DF2F2", label: "CYAN" },
                  { key: "red", hex: "#FA4454", label: "RED" },
                  { key: "gold", hex: "#FAEE0D", label: "RADIANT" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => { playSFX.tick(); setColor(item.key as CoreColor); }}
                    style={{ backgroundColor: item.hex }}
                    className={`w-4.5 h-4.5 border rounded-full transition-all cursor-none interactive-tactical ${
                      color === item.key ? "scale-125 border-white shadow-[0_0_10px_currentColor]" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                    title={`Switch to ${item.label}`}
                  />
                ))}
              </div>
            </div>

            <div className="w-px h-8 bg-white/10 hidden sm:block"></div>

            {/* 2. Style configuration */}
            <div className="flex flex-col space-y-1">
              <span className="font-mono text-[8px] text-white/40 tracking-wider">MESH_SYNTAX</span>
              <div className="flex items-center space-x-1 border border-white/10 p-0.5 rounded-sm bg-white/[0.02]">
                {[
                  { key: "plasma", label: "CORE" },
                  { key: "holo", label: "HOLO" },
                  { key: "dust", label: "DUST" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => { playSFX.tick(); setStyle(item.key as CoreStyle); }}
                    className={`px-2 py-1 font-mono text-[8px] tracking-widest cursor-none interactive-tactical transition-all ${
                      style === item.key ? "bg-white/10 text-white font-bold" : "text-white/40 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-px h-8 bg-white/10 hidden sm:block"></div>

            {/* 3. Speed slider */}
            <div className="flex flex-col space-y-1 grow min-w-[100px]">
              <div className="flex justify-between text-[8px] font-mono text-white/40">
                <span>VELOCITY</span>
                <span className="text-[#0DF2F2]">{spinSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                step="0.5"
                value={spinSpeed}
                onChange={(e) => setSpinSpeed(parseFloat(e.target.value))}
                className="w-full accent-[#0DF2F2] bg-white/10 h-1 rounded-sm cursor-none interactive-tactical"
              />
            </div>

            <div className="w-px h-8 bg-white/10 hidden sm:block"></div>

            {/* 4. Auto spin toggle */}
            <button
              onClick={() => { playSFX.tick(); setAutoRotate(!autoRotate); }}
              className="flex items-center space-x-1.5 text-white/50 hover:text-white transition-colors cursor-none interactive-tactical"
              title="Toggle automatic rotational orbit"
            >
              {autoRotate ? (
                <ToggleRight className="w-6 h-6 text-[#0DF2F2]" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-white/20" />
              )}
              <span className="font-mono text-[8px] tracking-wider">ORBIT</span>
            </button>
          </div>

          {/* Core diagnostics logging stats */}
          <div className="hidden lg:flex flex-col items-end text-right font-mono text-[8px] text-white/30 space-y-0.5">
            <span>DYNAMICS_ENGINE // THREE.JS_C185</span>
            <span>SHADERS // EMISSIVE_FLAT_PHONG</span>
            <span>VERTEX_DENSITY // 1,480 PTS</span>
            <span>DISCHARGES_LOGGED // {pulsesTriggered} pulse</span>
          </div>
        </div>
      </div>

      {/* Cybernetic Corner Decors */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#0DF2F2]/30 pointer-events-none group-hover:border-[#0DF2F2] transition-colors" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#0DF2F2]/30 pointer-events-none group-hover:border-[#0DF2F2] transition-colors" />
    </div>
  );
}
