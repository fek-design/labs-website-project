"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  createTimeline,
  stagger,
  svg,
  type JSAnimation,
} from "animejs";

// Re-export core anime functions & types
export { animate, createTimeline, stagger, svg };

/**
 * Options for drawing SVG paths using Anime.js stroke-dashoffset interpolation.
 */
export interface DrawSvgPathOptions {
  /** Duration in milliseconds (default: 1600ms) */
  duration?: number;
  /** Delay before animation starts in milliseconds (default: 0ms) */
  delay?: number;
  /** Easing equation or cubic-bezier curve (default: 'outCubic') */
  ease?: string;
  /** Whether the animation should repeat indefinitely */
  loop?: boolean;
  /** Whether to alternate playback direction on loop */
  alternate?: boolean;
  /** Callback fired when the path drawing completes */
  onComplete?: () => void;
}

/**
 * High-performance SVG stroke line drawing (e.g. blueprint schematics, CNC toolpaths, vector logos).
 * Automatically calculates stroke dashoffset and executes hardware-accelerated SVG drawing.
 *
 * @param target SVGPathElement, SVGGeometryElement, or valid CSS selector
 * @param options Timing and easing configuration
 * @returns Anime.js JSAnimation instance
 */
export function drawSvgPath(
  target: SVGGeometryElement | SVGGeometryElement[] | string,
  options: DrawSvgPathOptions = {}
) {
  const {
    duration = 1600,
    delay = 0,
    ease = "outCubic",
    loop = false,
    alternate = false,
    onComplete,
  } = options;

  return animate(target, {
    draw: "0 1",
    duration,
    delay,
    ease,
    loop,
    alternate,
    ...(onComplete ? { onComplete } : {}),
  });
}

/**
 * Options for numeric counter ticker animation.
 */
export interface AnimateCounterOptions {
  /** Duration in milliseconds (default: 1200ms) */
  duration?: number;
  /** Delay before animation starts in milliseconds (default: 0ms) */
  delay?: number;
  /** Easing equation (default: 'outExpo') */
  ease?: string;
  /** Number of decimal places to format to (default: 0) */
  decimals?: number;
  /** Text prefix prepended to the number (e.g. 'DKK ' or '#') */
  prefix?: string;
  /** Text suffix appended to the number (e.g. ' units' or '%') */
  suffix?: string;
  /** Custom number formatter function */
  formatNumber?: (val: number) => string;
  /** Callback fired when the counter completes */
  onComplete?: () => void;
}

/**
 * Smoothly interpolates numeric values on a DOM element (metrics ticker).
 * Ideal for inventory stats, sensor telemetry, and live front desk counts.
 *
 * @param element HTMLElement to render counter value into
 * @param from Starting numeric value
 * @param to Ending target numeric value
 * @param options Formatting and timing configuration
 * @returns Anime.js JSAnimation instance
 */
export function animateCounter(
  element: HTMLElement,
  from: number,
  to: number,
  options: AnimateCounterOptions = {}
) {
  const {
    duration = 1200,
    delay = 0,
    ease = "outExpo",
    decimals = 0,
    prefix = "",
    suffix = "",
    formatNumber,
    onComplete,
  } = options;

  const state = { value: from };

  return animate(state, {
    value: to,
    duration,
    delay,
    ease,
    onUpdate: () => {
      if (!element) return;
      const formatted = formatNumber
        ? formatNumber(state.value)
        : decimals > 0
        ? state.value.toFixed(decimals)
        : Math.round(state.value).toLocaleString();
      element.textContent = `${prefix}${formatted}${suffix}`;
    },
    ...(onComplete ? { onComplete } : {}),
  });
}

/**
 * Options for staggered character / word text animation.
 */
export interface StaggerElementsOptions {
  /** Duration per element in milliseconds (default: 800ms) */
  duration?: number;
  /** Initial delay before sequence starts in milliseconds (default: 0ms) */
  delay?: number;
  /** Step delay between consecutive elements (default: 35ms) */
  staggerDelay?: number;
  /** Origin point of the stagger sequence ('first', 'last', 'center') */
  from?: "first" | "last" | "center";
  /** Easing equation (default: 'outQuad') */
  ease?: string;
}

/**
 * Staggers child spans, characters, or cards with agency wave physics.
 *
 * @param targets Array of HTMLElements or selector
 * @param options Timing and stagger configuration
 * @returns Anime.js JSAnimation instance
 */
export function staggerElements(
  targets: HTMLElement[] | string,
  options: StaggerElementsOptions = {}
) {
  const {
    duration = 800,
    delay = 0,
    staggerDelay = 35,
    from = "first",
    ease = "outQuad",
  } = options;

  return animate(targets, {
    opacity: [0, 1],
    translateY: [12, 0],
    duration,
    delay: stagger(staggerDelay, { start: delay, from }),
    ease,
  });
}

/**
 * SSR-safe React hook for managing Anime.js animation lifecycles.
 * Handles automatic pause, cancel, and reversion on component unmount to prevent memory leaks.
 *
 * @param animationFactory Callback returning an Anime.js animation instance or cleanable handle
 * @param deps Dependency list for re-triggering the animation
 * @returns React ref object to attach to the animated target element
 */
export function useAnime<T extends HTMLElement | SVGElement = HTMLElement>(
  animationFactory: (element: T) => JSAnimation | { revert?: () => void; pause?: () => void } | void,
  deps: React.DependencyList = []
) {
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const anim = animationFactory(elementRef.current);

    return () => {
      if (anim && typeof anim === "object") {
        if ("revert" in anim && typeof anim.revert === "function") {
          anim.revert();
        } else if ("pause" in anim && typeof anim.pause === "function") {
          anim.pause();
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return elementRef;
}
