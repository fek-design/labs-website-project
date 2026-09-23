## Context

See `proposal.md` for background. `MarqueeRibbon.tsx` generates dual identical tracks (`Track A` and `Track B`) with CSS animation `.animate-marquee-track` translating from `0%` to `-100%`. In `app/globals.css`, `.animate-marquee-track:hover { animation-play-state: paused; }` was applied directly to the track classes instead of the parent container, which broke the marquee in multiple distinct ways during mouse interactions.

## Goals / Non-Goals

**Goals:**
- Eliminate dual-track desynchronization and text collisions during hover by binding hover pause to the parent wrapper container.
- Stop sub-element hover hit-testing flicker by isolating pointer events from moving text and bullet spans.
- Ensure butter-smooth GPU rendering on pause/resume via `will-change: transform`.
- Prevent browser text dragging and selection artifacts across the marquee ribbon.

**Non-Goals:**
- Altering the visual design tokens, typography, or content strings of the marquee ribbon.

## Decisions

### 1. Unified Container Hover Pause in CSS
- **Choice**: In `app/globals.css`, delete `.animate-marquee-track:hover { animation-play-state: paused; }` and replace with container-level targeting:
  ```css
  .group:hover .animate-marquee-track,
  .marquee-container:hover .animate-marquee-track {
    animation-play-state: paused;
  }
  ```
- **Rationale**: When the cursor enters any part of the ribbon container, both Track A and Track B receive the paused state at the identical timestamp, preserving their exact 50% relative phase offset and preventing collisions or voids.

### 2. Pointer Event Shielding on Child Nodes
- **Choice**: In `components/landing/MarqueeRibbon.tsx`, wrap items with `pointer-events-none`:
  ```tsx
  <div className="group marquee-container w-full bg-black border-y border-white/10 py-3.5 overflow-hidden select-none relative flex cursor-default touch-none">
    <div className="animate-marquee-track flex items-center gap-8 whitespace-nowrap text-white font-notch text-xs sm:text-sm tracking-widest font-semibold uppercase pr-8 pointer-events-none">
      ...
    </div>
  </div>
  ```
- **Rationale**: Hit-testing moving text nodes causes continuous mouseenter/mouseleave thrashing when a stationary cursor hovers over text vs empty gaps. By disabling pointer events on the children and handling hover solely on the outer bounding box, jitter is completely eliminated.

### 3. GPU Compositing Optimization
- **Choice**: Add `will-change: transform;` and enforce hardware-accelerated linear motion on `.animate-marquee-track`:
  ```css
  .animate-marquee-track {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    will-change: transform;
    animation: marquee-track 28s linear infinite;
  }
  ```
- **Rationale**: Ensures the browser promotes the track to its own compositor layer, preventing repaints or stutter when pausing and unpausing.

## Risks / Trade-offs

- **[Touch interactions on mobile]** Touching the marquee on mobile devices could trigger sticky hover states in some WebKit browsers.
  → *Mitigation*: Adding `touch-pan-y` and `select-none` prevents touch traps while allowing vertical scrolling to pass through uninterrupted.
