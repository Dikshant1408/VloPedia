"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 2px progress bar fixed at the top of the viewport.
 * Shows briefly on every Next.js route transition.
 * z-[9999] — renders above all other UI.
 */
export function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Trigger on any route change (pathname or search params)
  useEffect(() => {
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 600);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="progress-bar"
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[9999] h-[2px] bg-primary"
          initial={{ scaleX: 0, transformOrigin: "left" }}
          animate={{ scaleX: 1, transformOrigin: "left" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: "100%" }}
        />
      )}
    </AnimatePresence>
  );
}
