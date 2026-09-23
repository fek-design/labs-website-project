/**
 * Zealand Labs - Agency Motion & Visual Toolkit
 * Dedicated agency-grade physics presets, diagonal coordinate matrix animators, and layout morphs.
 * Built for motion/react and GSAP macro-telemetry.
 */

import { Transition, Variants } from "motion/react";

// ==========================================
// 1. AGENCY SPRING PHYSICS (Deliberate Easing)
// ==========================================

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 28,
  mass: 0.8,
};

export const springGentle: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 24,
  mass: 1,
};

export const springBouncy: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 18,
  mass: 0.7,
};

export const springSlow: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 1.2,
};

// ==========================================
// 2. DIAGONAL WAVE & GRID STAGGER HELPERS
// ==========================================

/**
 * Calculates a diagonal wave stagger delay from top-left (0,0) to bottom-right (r,c).
 * @param row Row index (0-indexed)
 * @param col Column index (0-indexed)
 * @param factor Stagger factor in seconds (default 0.015s)
 */
export function getDiagonalWaveDelay(row: number, col: number, factor = 0.015): number {
  return (row + col) * factor;
}

/**
 * Calculates a radial wave stagger delay originating from a center anchor point.
 */
export function getRadialWaveDelay(
  row: number,
  col: number,
  centerRow = 0,
  centerCol = 0,
  factor = 0.02
): number {
  const dist = Math.sqrt(Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2));
  return dist * factor;
}

// ==========================================
// 3. EXPONENTIAL ACCELERATION EASING (Counters)
// ==========================================

/**
 * Calculates exponential acceleration curve value (starts slow, ramps up exponentially).
 * @param progress Normalized time between 0 and 1
 * @param power Exponent power (default 2.8)
 */
export function easeInExponential(progress: number, power = 2.8): number {
  return Math.pow(Math.min(Math.max(progress, 0), 1), power);
}

// ==========================================
// 4. PRESET AGENCY COMPONENT VARIANTS
// ==========================================

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: springSnappy },
  exit: { opacity: 0, y: -12, transition: { duration: 0.15 } },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1, transition: springSnappy },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
};

export const drawerSlideRight: Variants = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1, transition: springSnappy },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

export const bentoItemVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.97 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springGentle,
  },
};
