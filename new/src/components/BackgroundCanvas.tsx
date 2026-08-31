/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BackgroundCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // Dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b141a, 0.015);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 25;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Shards (Radianite crystals)
    const shardGroup = new THREE.Group();
    scene.add(shardGroup);

    const shards: {
      mesh: THREE.Mesh;
      speedX: number;
      speedY: number;
      speedZ: number;
      rotSpeedX: number;
      rotSpeedY: number;
      basePosition: THREE.Vector3;
    }[] = [];

    // Geometries
    const geometries = [
      new THREE.OctahedronGeometry(Math.random() * 0.4 + 0.2, 0),
      new THREE.TetrahedronGeometry(Math.random() * 0.3 + 0.1, 0),
      new THREE.IcosahedronGeometry(Math.random() * 0.5 + 0.3, 0),
    ];

    // Colors (Radianite Red #FA4454 and Radianite Cyan #0DF2F2)
    const materials = [
      new THREE.MeshPhongMaterial({
        color: 0xfa4454,
        emissive: 0x220508,
        flatShading: true,
        transparent: true,
        opacity: 0.85,
        shininess: 80,
      }),
      new THREE.MeshPhongMaterial({
        color: 0x0df2f2,
        emissive: 0x032b2b,
        flatShading: true,
        transparent: true,
        opacity: 0.75,
        shininess: 90,
      }),
      new THREE.MeshPhongMaterial({
        color: 0xece8e1,
        emissive: 0x111111,
        flatShading: true,
        transparent: true,
        opacity: 0.5,
        shininess: 50,
      }),
    ];

    // Populate shards
    for (let i = 0; i < 35; i++) {
      const geom = geometries[Math.floor(Math.random() * geometries.length)];
      const mat = materials[Math.floor(Math.random() * materials.length)];
      const mesh = new THREE.Mesh(geom, mat);

      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 20 - 5;

      mesh.position.set(x, y, z);
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      shardGroup.add(mesh);

      shards.push({
        mesh,
        speedX: (Math.random() - 0.5) * 0.008,
        speedY: (Math.random() - 0.5) * 0.008,
        speedZ: (Math.random() - 0.5) * 0.005,
        rotSpeedX: (Math.random() - 0.5) * 0.01,
        rotSpeedY: (Math.random() - 0.5) * 0.01,
        basePosition: new THREE.Vector3(x, y, z),
      });
    }

    // Starfield / Particle embers
    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 50;
      particlePositions[i + 1] = (Math.random() - 0.5) * 40;
      particlePositions[i + 2] = (Math.random() - 0.5) * 30;
      particleSizes[i / 3] = Math.random() * 3 + 1;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const pMaterial = new THREE.PointsMaterial({
      color: 0x0df2f2,
      size: 0.15,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const starParticles = new THREE.Points(particleGeometry, pMaterial);
    scene.add(starParticles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0b141a, 1.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfa4454, 2.0);
    dirLight1.position.set(10, 10, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0df2f2, 1.5);
    dirLight2.position.set(-10, -10, 5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xfa4454, 2, 30);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates (-1 to 1)
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handling via ResizeObserver
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

      const elapsedTime = clock.getElapsedTime();

      // Lerp mouse
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Rotate whole group based on mouse
      shardGroup.rotation.y = mouseX * 0.15;
      shardGroup.rotation.x = -mouseY * 0.15;

      // Animate individual shards
      shards.forEach((shard) => {
        // Floating drift
        shard.mesh.position.x = shard.basePosition.x + Math.sin(elapsedTime * 0.5 + shard.basePosition.y) * 0.5;
        shard.mesh.position.y = shard.basePosition.y + Math.cos(elapsedTime * 0.4 + shard.basePosition.x) * 0.5;
        
        // Custom rotations
        shard.mesh.rotation.x += shard.rotSpeedX;
        shard.mesh.rotation.y += shard.rotSpeedY;
      });

      // Gently rotate starfield
      starParticles.rotation.y = elapsedTime * 0.015;
      starParticles.rotation.x = mouseX * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();

      // Dispose resources
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      particleGeometry.dispose();
      pMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none -z-10 overflow-hidden bg-[#0B141A]"
      id="bg-canvas-container"
    >
      <canvas ref={canvasRef} className="w-full h-full block opacity-75" />
      {/* Dynamic scanline overlay for aesthetic tactical feel */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] select-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,255,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"
        id="bg-scanline-fx"
      />
      {/* Radial grid background */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,20,26,0.2)_0%,rgba(11,20,26,0.95)_90%)] pointer-events-none"
        id="bg-vignette"
      />
    </div>
  );
}
