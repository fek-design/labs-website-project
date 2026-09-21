# Zealand Labs - Animation Architecture & Motion Engineering Guide

This document establishes the authoritative standards, performance protocols, and decision criteria for UI animations and motion design across the Zealand Labs web application.

---

## I. The Tri-Stack Motion Architecture

Zealand Labs employs a deliberate **Tri-Stack Motion Architecture**, allocating distinct operational domains to three complementary animation libraries to maximize visual fidelity and maintain strict 60fps performance without framework lock-in.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      TRI-STACK MOTION ARCHITECTURE                      │
├──────────────────────┬──────────────────────────┬───────────────────────┤
│    motion/react      │   gsap + @gsap/react     │       anime.js        │
├──────────────────────┼──────────────────────────┼───────────────────────┤
│ • Component Enter/Exit│ • Viewport ScrollTrigger │ • SVG Path Drawing    │
│ • LayoutId Morphs    │ • Scrubbed Pinned Scenes │ • Numeric Tickers     │
│ • Micro-interactions │ • Macro Multi-Scene Flow │ • SVG Shape Morphing  │
│ • Modal / Drawer     │ • Pinned Bento Scrubbing │ • Character Staggers  │
│   Spring Physics     │                          │ • DOM/Canvas Tweens   │
└──────────────────────┴──────────────────────────┴───────────────────────┘
```

---

## II. 3-Way Animation Decision Matrix

When implementing any animated element, developers and AI agents must adhere to this decision matrix:

| Scenario / Requirement | Recommended Engine | Primary Primitives / Helpers | Rationale |
| :--- | :--- | :--- | :--- |
| **Component Mount / Unmount / Exit** | `motion/react` | `<AnimatePresence>`, `fadeInUp`, `scaleIn` | Declaratively integrated with React DOM lifecycle and conditional rendering. |
| **Bento & Modal Springs** | `motion/react` | `springSnappy`, `springGentle`, `springBouncy` | Natural physical damping without timing calculation headaches. |
| **Shared Element Morphs** | `motion/react` | `layoutId="card-${id}"` | Seamless cross-route / cross-slot layout morphing. |
| **Scroll-Driven Viewport Timelines** | `gsap` + `@gsap/react` | `useGSAP()`, `ScrollTrigger.create()` | Industry-standard scrubbed macro timelines across long page journeys. |
| **Pinned Interactive Telemetry** | `gsap` + `@gsap/react` | `timeline({ scrollTrigger: { pin: true } })` | Pinned multi-phase interactive sections with precise scrub control. |
| **SVG Stroke Line / Blueprint Drawing** | `anime.js` | `drawSvgPath(target, options)` | Lightweight hardware-accelerated SVG dashoffset calculation and animation. |
| **Live Numeric Counters & Tickers** | `anime.js` | `animateCounter(target, from, to, options)` | Smooth numerical interpolation updating DOM values directly without React re-renders. |
| **Granular Split-Text Typography** | `anime.js` | `staggerElements(spans, options)` | Sub-millisecond staggered wave delays across characters or word spans. |
| **Complex SVG Path Morphing** | `anime.js` | `svg.morphTo()` | Smooth polygon and path vector shape transitions for machine schematics. |

---

## III. Implementation Patterns & Best Practices

### 1. `motion/react` (Declarative Component Micro-Physics)
Always import from `"motion/react"` (the current official package) rather than outdated `"framer-motion"`.

```tsx
import { motion, AnimatePresence } from "motion/react";
import { fadeInUp, springSnappy } from "@/lib/motion";

export function AdminModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
        >
          {/* Modal content */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### 2. `anime.js` (SVG Path Drawing & Numeric Tickers)
Always use client components (`"use client"`) and the `useAnime` lifecycle hook or helper functions from `lib/motion`:

```tsx
"use client";

import { useRef } from "react";
import { useAnime, drawSvgPath, animateCounter } from "@/lib/motion";

export function BlueprintMetricCard({ totalItems }: { totalItems: number }) {
  const numberRef = useRef<HTMLSpanElement>(null);

  const cardRef = useAnime<HTMLDivElement>((el) => {
    // 1. Draw blueprint vector outline
    const path = el.querySelector<SVGPathElement>(".blueprint-path");
    if (path) {
      drawSvgPath(path, { duration: 1800, ease: "outCubic" });
    }

    // 2. Animate counter ticker directly in DOM
    if (numberRef.current) {
      animateCounter(numberRef.current, 0, totalItems, {
        duration: 1400,
        prefix: "#",
        ease: "outExpo"
      });
    }
  }, [totalItems]);

  return (
    <div ref={cardRef} className="relative p-6 bg-[#0e0e11] border border-[#262626] rounded-2xl">
      <svg className="w-full h-24 mb-4">
        <path className="blueprint-path" d="M10 80 Q 95 10 180 80 T 290 80" fill="none" stroke="#009FE3" strokeWidth="2" />
      </svg>
      <span ref={numberRef} className="text-3xl font-mono text-[#FFED00]">0</span>
    </div>
  );
}
```

### 3. `gsap` + `@gsap/react` (Macro Scroll Telemetry)
Always wrap GSAP calls in `useGSAP` to guarantee automatic context scoping and cleanup on route change:

```tsx
"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function PinnedTelemetrySection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "+=1200",
        pin: true,
        scrub: 1,
      },
    })
    .to(".telemetry-step-1", { opacity: 0, y: -20 })
    .from(".telemetry-step-2", { opacity: 0, y: 20 }, "<0.2");
  }, { scope: container });

  return <div ref={container}>{/* Telemetry content */}</div>;
}
```

---

## IV. The "Figma Mockup UI vs. Speckit UX Engineering" Principle

A critical foundational rule of the Zealand Labs development workflow:

> **The Figma file is a visual mockup, NOT an interactive UX prototype.**

### Responsibilities:
1. **Figma Canvas (Authoritative Visual UI)**:
   - Provides exact color tokens (Base floor `#000000`, surfaces `#09090b`/`#0e0e11`, CMYK accents `#FFED00`/`#E6007E`/`#009FE3`).
   - Provides typography hierarchy (`Stack Sans Notch`, `Stack Sans Headline`, `Stack Sans Text`).
   - Provides card geometry, bento column ratios, paddings, and borders.
   - Extracted via the **Figma MCP Server** (`get_figma_data`, `download_figma_images`).

2. **Speckit & Codebase (Authoritative Interactive UX)**:
   - **All UX is missing from the Figma canvas.** Developers and AI agents must actively engineer the interaction layer:
     - **Micro-interactions**: CMYK color inversion on hover/tap, spring physics on active buttons.
     - **Asynchronous Feedback**: Skeleton screens matching dark surfaces, optimistic updates, action spinners.
     - **Validation & Errors**: Inline field error toasts, red accent `#FF0000` alerts, keyboard accessibility (`Tab`, `Escape`, `Enter`).
     - **Transitions**: Smooth modal opening, drawer slide-overs, and bento item mounts.

---

## V. Performance Rules for 60fps Animation

1. **Hardware Acceleration Only**: Animate `transform` (`x`, `y`, `scale`, `rotate`) and `opacity`. Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`.
2. **Cleanup on Unmount**: Every timer, timeline, listener, or Anime.js instance must be cleanly cancelled/reverted on component unmount (enforced by `useAnime`, `useGSAP`, and `AnimatePresence`).
3. **Avoid React Re-render Loops**: For rapid numeric counters or telemetry streams, mutate DOM element properties or `textContent` directly with Anime.js rather than pushing high-frequency updates into React state.
4. **Reduced Motion**: Respect user preferences by disabling or dampening animations when `prefers-reduced-motion: reduce` is detected.
