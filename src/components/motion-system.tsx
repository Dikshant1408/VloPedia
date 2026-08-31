"use client";
import { motion, useReducedMotion, type Variants } from "framer-motion";

// ---------------------------------------------------------------------------
// Spring presets
// ---------------------------------------------------------------------------

export const SPRING_GENTLE = {
  type: "spring" as const,
  stiffness: 60,
  damping: 20,
  mass: 1,
};

export const SPRING_SNAPPY = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

// Legacy spring (preserved for V1 compatibility)
const spring = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  mass: 0.8,
};

// ---------------------------------------------------------------------------
// Variant definitions
// ---------------------------------------------------------------------------

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: Math.min(i * 0.04, 0.3),
      ...spring,
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: Math.min(i * 0.06, 0.3),
      ...spring,
    },
  }),
};

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeInUp as Variants}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "visible"}
      viewport={{ once: true, amount: 0.08 }}
      variants={staggerContainer as Variants}
    >
      {children}
    </motion.div>
  );
}

export function ScaleReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
      variants={scaleIn as Variants}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

/**
 * PageTransition — wrap the return value of each page.tsx to animate
 * on route arrival. Uses a fade-and-slide entry (400ms).
 * In reduced-motion mode: 150ms opacity fade only.
 */
export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduce
          ? { duration: 0.15, ease: "easeOut" }
          : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  );
}

/**
 * GlitchText — tactical heading with a CSS glitch animation.
 * data-text attribute must match children for the ::before/::after pseudo-elements.
 * Animation is suppressed when prefers-reduced-motion is active.
 */
type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";

export function GlitchText({
  children,
  className,
  as: Tag = "h2",
}: {
  children: string;
  className?: string;
  as?: HeadingTag;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <Tag className={`glitch-text ${className ?? ""}`} data-text={children}>
      {children}
    </Tag>
  );
}

// ---------------------------------------------------------------------------
// Legacy exports (preserved for V1 compatibility)
// ---------------------------------------------------------------------------
export { spring, fadeInUp, staggerContainer, scaleIn };
