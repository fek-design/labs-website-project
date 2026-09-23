# Zealand Labs - Animation Architecture & Motion Engineering Guide

This document establishes the authoritative standards, performance protocols, and decision criteria for UI animations and motion design across the Zealand Labs web application.

---

## I. The Dual-Stack Motion Architecture

Zealand Labs employs a deliberate **Dual-Stack Motion Architecture**, allocating distinct operational domains to two complementary animation libraries to maximize visual fidelity and maintain strict 60fps performance without framework lock-in or library bloat.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      DUAL-STACK MOTION ARCHITECTURE                     │
├──────────────────────────────────────────┬──────────────────────────────┤
│               motion/react               │      gsap + @gsap/react      │
├──────────────────────────────────────────┼──────────────────────────────┤
│ • Component Mount / Enter / Exit         │ • Viewport ScrollTrigger     │
│ • LayoutId Shared Element Morphs         │ • Scrubbed Pinned Scenes     │
│ • Micro-interactions & Hover Physics     │ • Macro Multi-Scene Flow     │
│ • Modal / Drawer Spring Physics          │ • Infinite Marquee Ribbons   │
│ • Accessible Reduced-Motion Handling     │ • Narrative Scroll Telemetry │
└──────────────────────────────────────────┴──────────────────────────────┘
```

---

## II. 2-Way Animation Decision Matrix

When implementing any animated element, developers and AI agents must adhere to this decision matrix:

| Scenario / Requirement | Recommended Engine | Primary Primitives / Helpers | Rationale |
| :--- | :--- | :--- | :--- |
| **Component Mount / Unmount / Exit** | `motion/react` | `<AnimatePresence>`, `fadeInUp`, `scaleIn` | Declaratively integrated with React DOM lifecycle and conditional rendering. |
| **Bento & Modal Springs** | `motion/react` | `springSnappy`, `springGentle`, `springBouncy` | Natural physical damping without timing calculation headaches. |
| **Shared Element Morphs** | `motion/react` | `layoutId="card-${id}"` | Seamless cross-route / cross-slot layout morphing. |
| **Micro-Interactions & Buttons** | `motion/react` | `whileHover`, `whileTap` | High-fidelity interactive button physics and tactile tactile feedback. |
| **Scroll-Driven Viewport Timelines** | `gsap` + `@gsap/react` | `useGSAP()`, `ScrollTrigger.create()` | Industry-standard scrubbed macro timelines across long page journeys. |
| **Pinned Interactive Telemetry** | `gsap` + `@gsap/react` | `timeline({ scrollTrigger: { pin: true } })` | Pinned multi-phase interactive sections with precise scrub control. |
| **Continuous Infinite Marquees** | `gsap` | `gsap.to(el, { xPercent: -50, repeat: -1 })` | GPU-accelerated seamless loops without stutter or layout shifts. |

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
          transition={springSnappy}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
        >
          {/* Modal content */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### 2. `gsap` + `@gsap/react` (Macro Viewport Orchestration)
Always use the official React hook `useGSAP()` to ensure proper lifecycle scoping and SSR safety:

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function PinnedTelemetrySection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=1200",
          scrub: 1,
          pin: true,
        },
      });

      tl.to(".telemetry-metric", {
        opacity: 1,
        y: 0,
        stagger: 0.1,
      });
    },
    { scope: containerRef }
  );

  return <div ref={containerRef}>{/* Pinned scene content */}</div>;
}
```

---

## IV. Core Motion Engineering Principles

1. **Hardware Acceleration**: Animate strictly composited properties: `transform` (`x`, `y`, `scale`, `rotate`) and `opacity`. Avoid animating `width`, `height`, `top`, `left`, `margin`, or `padding` directly.
2. **Cleanup on Unmount**: Every timer, timeline, listener, or GSAP instance must be cleanly cancelled/reverted on component unmount (enforced by `useGSAP` and `AnimatePresence`).
3. **Reduced Motion Compliance**: Always respect system accessibility preferences:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```
4. **Zero Cloud Dependency**: Animation engines must never load external assets, CDNs, or telemetry reporting scripts over the network. All dependencies remain strictly local.
