/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, MouseEvent, ReactNode } from "react";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  maxTilt?: number; // Maximum rotation in degrees
  perspective?: number; // Depth perception in pixels
  scale?: number; // Scale on hover
  enableGlare?: boolean; // Glare overlay
}

export default function TiltCard({
  children,
  className = "",
  onClick,
  onMouseEnter,
  maxTilt = 10,
  perspective = 1000,
  scale = 1.02,
  enableGlare = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>("");
  const [glareStyle, setGlareStyle] = useState<{
    opacity: number;
    transform: string;
  }>({
    opacity: 0,
    transform: "translate(-50%, -50%)",
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse position inside card X
    const y = e.clientY - rect.top;  // Mouse position inside card Y

    // Normalize coordinates (-0.5 to 0.5)
    const normalizedX = x / rect.width - 0.5;
    const normalizedY = y / rect.height - 0.5;

    // Calculate rotation angles
    const rotateX = (-normalizedY * maxTilt).toFixed(2);
    const rotateY = (normalizedX * maxTilt).toFixed(2);

    setTransformStyle(
      `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
    );

    if (enableGlare) {
      // Position glare element at cursor
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      setGlareStyle({
        opacity: 0.25,
        transform: `translate(-50%, -50%)`,
        // Custom variables to pass to absolute glare div
        ...({
          "--glare-x": `${glareX}%`,
          "--glare-y": `${glareY}%`,
        } as any),
      });
    }
  };

  const handleMouseEnterCard = () => {
    if (onMouseEnter) onMouseEnter();
  };

  const handleMouseLeave = () => {
    // Reset to default
    setTransformStyle(
      `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    );
    setGlareStyle({
      opacity: 0,
      transform: "translate(-50%, -50%)",
    });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnterCard}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: "transform 0.15s ease-out, box-shadow 0.15s ease-out",
        transformStyle: "preserve-3d",
      }}
      className={`relative overflow-hidden cursor-none ${className}`}
    >
      {/* Glare effect overlay */}
      {enableGlare && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 30,
            pointerEvents: "none",
            opacity: glareStyle.opacity,
            background: `radial-gradient(circle 180px at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255, 255, 255, 0.15), transparent 70%)`,
            transition: "opacity 0.2s ease",
          }}
        />
      )}
      
      {/* Content wrapper with 3D transform style */}
      <div style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </div>
  );
}
