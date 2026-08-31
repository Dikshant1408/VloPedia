/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      // Instantly position the central tactical dot
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate3d(-50%, -50%, 0)`;

      // Detect if hover target is interactive
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive =
          target.closest("button") ||
          target.closest("a") ||
          target.closest("[role='button']") ||
          target.closest(".interactive-tactical") ||
          window.getComputedStyle(target).cursor === "pointer";

        setIsHovered(!!isInteractive);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Dynamic easing ring movement loop
    let animationFrameId: number;
    const updateRing = () => {
      // Lerp (Linear Interpolation) for a gorgeous high-inertia dragging feel
      const ease = 0.15;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate3d(-50%, -50%, 0)`;
      animationFrameId = requestAnimationFrame(updateRing);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    updateRing();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Central Sharp Crosshair Dot */}
      <div
        ref={cursorDotRef}
        id="custom-cursor-dot"
        className={`fixed top-0 left-0 w-2.5 h-2.5 rounded-full pointer-events-none z-50 transition-colors duration-150 mix-blend-difference ${
          isHovered ? "bg-[#0DF2F2]" : "bg-[#FA4454]"
        }`}
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      />

      {/* Trailing Tactical Reticle Bracket */}
      <div
        ref={cursorRingRef}
        id="custom-cursor-ring"
        className={`fixed top-0 left-0 pointer-events-none z-50 transition-all duration-300 ease-out flex items-center justify-center ${
          isHovered
            ? "w-10 h-10 border border-[#0DF2F2] rotate-45 opacity-100"
            : isClicking
            ? "w-6 h-6 border-2 border-[#FA4454] opacity-80"
            : "w-8 h-8 border border-white/20 opacity-60"
        }`}
        style={{
          transform: "translate3d(-100px, -100px, 0)",
          clipPath: isHovered
            ? "polygon(0 0, 30% 0, 30% 10%, 10% 10%, 10% 30%, 0 30%, 0 100%, 30% 100%, 30% 90%, 10% 90%, 10% 70%, 0 70%, 100% 100%, 100% 70%, 90% 70%, 90% 90%, 70% 90%, 70% 100%, 100% 0, 70% 0, 70% 10%, 90% 10%, 90% 30%, 100% 30%)"
            : "none",
        }}
      >
        {/* Micro-rotator inner brackets when hovering */}
        {isHovered && (
          <div className="w-1.5 h-1.5 bg-[#0DF2F2] rounded-full animate-ping" />
        )}
      </div>
    </>
  );
}
