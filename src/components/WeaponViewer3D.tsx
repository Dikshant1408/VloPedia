"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

interface WeaponViewer3DProps {
  weaponImageUrl: string;
  weaponName: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  autoRotate?: boolean;
  enableDamping?: boolean;
}

function WeaponModel({ weaponImageUrl, weaponName }: { 
  weaponImageUrl: string; 
  weaponName: string 
}) {
  const texture = useTexture(weaponImageUrl);
  const [textureReady, setTextureReady] = useState(false);
  const planeRef = useRef<THREE.Mesh>(null!);
  const gridRef = useRef<THREE.GridHelper>(null!);

  useEffect(() => {
    if (texture) {
      setTextureReady(true);
    }
  }, [texture]);

  useEffect(() => {
    if (textureReady && planeRef.current) {
      const animation = () => {
        if (planeRef.current) {
          planeRef.current.rotation.y += 0.0015;
        }
        requestAnimationFrame(animation);
      };
      animation();
    }
  }, [textureReady]);

  if (!textureReady || !texture) {
    return (
      <Html center>
        <div className="text-muted text-xs">LOADING MODEL</div>
      </Html>
    );
  }

  const image = texture.image as { width: number; height: number };
  const aspectRatio = image.height / image.width;
  const geometry = new THREE.PlaneGeometry(4, 4 * aspectRatio);
  const material = new THREE.MeshBasicMaterial({ 
    map: texture, 
    transparent: true, 
    side: THREE.DoubleSide,
    alphaTest: 0.1
  });

  return (
    <group>
      <gridHelper 
        ref={gridRef}
        args={[10, 10, 0xFF4655, 0x0F1115]} 
        position={[0, -3.5, 0]}
        visible={false}
      />
      <mesh 
        ref={planeRef}
        geometry={geometry} 
        material={material}
        rotation-y={Math.PI}
      />
    </group>
  );
}

export default function WeaponViewer3D({ 
  weaponImageUrl, 
  weaponName, 
  containerRef,
  autoRotate = true,
  enableDamping = true
}: WeaponViewer3DProps) {
  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const container = containerRef?.current;

  useEffect(() => {
    if (container) {
      setInitialized(true);
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [container]);

  if (!initialized) {
    return (
      <motion.div
        ref={containerRef}
        className="w-full h-96 flex items-center justify-center text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <div className="text-xs">LOADING 3D VIEW</div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className="w-full h-96"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          preserveDrawingBuffer: false
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          background: 'transparent'
        }}
      >
        <color attach="background" args={["0x08090c"]} />
        <ambientLight intensity={1.0} />
        <pointLight position={[5, 5, 5]} intensity={0.5} />
        <WeaponModel weaponImageUrl={weaponImageUrl} weaponName={weaponName} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
          enableDamping={enableDamping}
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={10}
        />
      </Canvas>
    </motion.div>
  );
}