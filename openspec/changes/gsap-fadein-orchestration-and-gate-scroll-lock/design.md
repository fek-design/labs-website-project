## Context

See `proposal.md` for motivation. The landing page is assembled from modular components (`HeroSection`, `MarqueeRibbon`, `PrototypeCarousel`, `HotspotShowcase`, `CampusLabExplorer`, and `MachineTelemetrySection`). The project already has `gsap` (`^3.15.0`) and `@gsap/react` (`^2.1.2`) installed in accordance with `openspec/core/animation-architecture.md`, which designates GSAP + ScrollTrigger for macro viewport transitions and coordinated scroll timelines.

## Goals / Non-Goals

**Goals:**
- Implement cohesive, human-paced, deliberate GSAP ScrollTrigger fade-in entrance animations across the landing page sections (`HeroSection`, `PrototypeCarousel`, `HotspotShowcase`, `CampusLabExplorer`, `MachineTelemetrySection`).
- Configure entrance physics: gentle vertical rise (`y: 20 -> 0`), hardware-accelerated opacity (`opacity: 0 -> 1`), smooth cubic easing (`power2.out`), and subtle element staggering (`0.08s - 0.12s`).
- Remove forced gate display (`forceShow={true}`) from `app/page.tsx` so `FirstTimeCampusGate` only appears on first visit when `localStorage` has no stored choice.
- Lock body and html scrolling (`overflow: hidden`) whenever `FirstTimeCampusGate` is open, and cleanly restore scroll behavior when dismissed.

**Non-Goals:**
- Flashy or abrupt keyframes that conflict with the clean Scandinavian/IKEA geometry.
- Forcing full-page scroll scrubbing that hijacks native browser scrolling physics.

## Decisions

### 1. GSAP Scoped Integration via `@gsap/react`
- **Choice**: Use `useGSAP()` scoped to each section's root container reference:
  ```tsx
  import { useRef } from "react";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { useGSAP } from "@gsap/react";

  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
  ```
- **Timeline Configuration**:
  ```ts
  gsap.from(container.current.querySelectorAll(".gsap-reveal"), {
    scrollTrigger: {
      trigger: container.current,
      start: "top 85%",
      toggleActions: "play none none none",
    },
    y: 20,
    opacity: 0,
    duration: 0.85,
    stagger: 0.08,
    ease: "power2.out",
  });
  ```
- **Rationale**: `useGSAP` automatically handles context scoping, selector cleanup, and ScrollTrigger lifecycle management on component unmount and page navigation, preventing memory leaks or detached listeners.

### 2. First-Time Gate Persistence Resolution
- **Choice**: In `FirstTimeCampusGate.tsx`:
  - When `forceShow` is `false` (the new default):
    - Check `localStorage.getItem(STORAGE_KEY_CAMPUS)`.
    - If a valid key exists, initialize `isOpen = false`.
    - If no key exists, initialize `isOpen = true`.
  - In `app/page.tsx`: render `<FirstTimeCampusGate />` without `forceShow={true}`.
- **Rationale**: Ensures the gate acts as an authentic one-time welcome gate, respecting the student's saved choice across subsequent sessions while preserving manual campus switching via the header dropdown.

### 3. Background Scroll Locking Protocol
- **Choice**: In `FirstTimeCampusGate.tsx`:
  ```tsx
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [isOpen]);
  ```
- **Rationale**: Completely prevents scroll pass-through on desktop trackpads, mouse wheels, and iOS touch momentum while the modal is displayed.

## Risks / Trade-offs

- **[Server-Side Rendering & Hydration]** GSAP and ScrollTrigger require the `window` DOM object.
  → *Mitigation*: Ensure `useGSAP` executes exclusively in `"use client"` components with `typeof window !== "undefined"` safety guards.
- **[Scroll lock residual state]** If the user navigates away abruptly while the modal is open.
  → *Mitigation*: The `useEffect` cleanup hook guarantees restoration of `originalOverflow` and `touchAction`.
