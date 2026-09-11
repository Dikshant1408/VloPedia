"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { isWebGLAvailable } from "./webgl-detector";

interface UseSceneLifecycleOptions {
  threshold?: number;
  initialAutoRotate?: boolean;
}

export function useSceneLifecycle(options: UseSceneLifecycleOptions = {}) {
  const { threshold = 0.1, initialAutoRotate = true } = options;
  const containerRef = useRef<HTMLDivElement>(null);

  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // 1. Initial WebGL & Reduced Motion detection
  useEffect(() => {
    const supported = isWebGLAvailable();
    setHasWebGL(supported);

    if (typeof window !== "undefined") {
      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(motionQuery.matches);
      setIsAutoRotating(initialAutoRotate && !motionQuery.matches);

      const handleMotionChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
        if (e.matches) {
          setIsAutoRotating(false);
        }
      };

      motionQuery.addEventListener("change", handleMotionChange);
      return () => motionQuery.removeEventListener("change", handleMotionChange);
    }
  }, [initialAutoRotate]);

  // 2. IntersectionObserver to pause rendering when scrolled out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  // 3. User interaction handler (smoothly halts auto-rotation upon manual gesture)
  const handleUserInteract = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    setIsAutoRotating(false);
  }, [hasInteracted]);

  const toggleAutoRotate = useCallback(() => {
    if (prefersReducedMotion) return;
    setIsAutoRotating((prev) => !prev);
    handleUserInteract();
  }, [prefersReducedMotion, handleUserInteract]);

  return {
    containerRef,
    hasWebGL,
    isVisible,
    prefersReducedMotion,
    isAutoRotating,
    hasInteracted,
    handleUserInteract,
    toggleAutoRotate,
    setIsAutoRotating,
  };
}
