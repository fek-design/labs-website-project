## Context

The landing page features an editorial showcase in `HotspotShowcase.tsx` formatted in a 1x1 → 1x2 → 1x1 grid. Currently, the outer card elements have `overflow-hidden` applied directly to their root boundaries, which clips the beacon inspection popover cards whenever they extend past the card's top or side edges. Furthermore, the section vertical padding (`pt-2 pb-12`) is too cramped against the adjacent prototype carousel and dark campus explorer, and the beacon popovers lack the springy motion characteristics expected from the project's motion system.

## Goals / Non-Goals

**Goals:**
- Provide generous, breathable vertical padding across the showcase section (`pt-10 sm:pt-16 md:pt-20 pb-16 sm:pb-24`).
- Remove `overflow-hidden` from the outer showcase card containers so popovers can render at their exact coordinates without clipping.
- Isolate image framing by wrapping `<Image>` elements and gradient masks in an inner `absolute inset-0 overflow-hidden pointer-events-none` container.
- Upgrade the beacon popover entrance animation to tactile spring physics using `motion/react` spring transitions (`springBouncy` or equivalent stiffness/damping curve).

**Non-Goals:**
- Altering the 1x1 → 1x2 → 1x1 grid structure or card aspect ratios.
- Modifying the hero section, prototype carousel, or telemetry ticker.

## Decisions

### 1. Two-Layer Card Layout (Media Clipping vs Overlay Freedom)
- **Choice**: Separate the clipping context:
  - **Outer container**: `relative w-full rounded-none group border border-[#DFDFDF] shadow-none` (no `overflow-hidden`).
  - **Inner media container**: `<div className="absolute inset-0 overflow-hidden pointer-events-none">` containing the Next.js `<Image>` and vignette gradient.
- **Rationale**: This guarantees that photographic assets never bleed past their 1px hairline border while allowing sibling `<HotspotBeacon>` popover cards to extend freely beyond container bounds without being clipped.
- **Alternative considered**: Changing beacon coordinates to keep tooltips artificially inside. Rejected because it limits editorial framing and forces tooltips to cover the subject matter.

### 2. Spring Physics for Popover Entrance
- **Choice**: Configure `motion.div` in `HotspotBeacon` with an agency spring transition:
  ```tsx
  initial={{ opacity: 0, scale: 0.88, y: 12 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.92, y: 8, transition: { duration: 0.15 } }}
  transition={{
    type: "spring",
    stiffness: 380,
    damping: 18,
    mass: 0.7,
  }}
  ```
- **Rationale**: Replaces the muted linear fade with a lively, responsive pop that aligns with the Scandinavian functionalist interaction design and `lib/motion.ts` standards.

## Risks / Trade-offs

- **Risk**: Popups overlapping adjacent columns in the 1x2 row.
  - **Mitigation**: Beacon popovers are assigned `z-30 pointer-events-auto shadow-2xl` so they render sharply above sibling card boundaries without causing layout shifts.
- **Risk**: Top-most beacons (e.g. textile cap at `y=15%`) overflowing into the section margin.
  - **Mitigation**: Increasing section top padding to `pt-10 sm:pt-16 md:pt-20` ensures there is ample headroom for upward-oriented tooltips.
