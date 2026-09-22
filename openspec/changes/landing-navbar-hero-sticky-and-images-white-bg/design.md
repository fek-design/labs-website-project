## Context

The user specified two targeted layout corrections:
1. The navigation bar must be visually part of the Hero section upon loading the page (not occupying stacked flow height above it) and only "unstick" and become non-transparent (frosted backdrop blur) when the user scrolls down past the hero.
2. The images showcase section (`HotspotShowcase.tsx`) must also be styled with a pure white background, continuing seamlessly from the prototype carousel (`PrototypeCarousel.tsx`).

## Goals / Non-Goals

**Goals:**
- Position `LandingHeader.tsx` as a fixed overlay at the top of the Hero on load (`fixed top-0 inset-x-0 z-50`), perfectly transparent with zero artificial border.
- Trigger the "unstick" transition when scrolling past `80px–100px`, applying a frosted semi-opaque dark surface (`bg-black/85 backdrop-blur-md border-b border-white/10 shadow-2xl`).
- Set the background of `HotspotShowcase.tsx` to pure white (`bg-white text-zinc-950`), creating a unified light showcase band with `PrototypeCarousel.tsx`.
- Keep `CampusLabExplorer.tsx` and `MachineTelemetrySection.tsx` on the dark floor (`bg-black text-white`).

**Non-Goals:**
- Alter the underlying POS or administrative authentication flows.
- Remove any existing hardware telemetry data or interactive hotspot beacons.

## Decisions

### 1. Fixed Overlay Navbar with Scroll Transition
- **Choice**: Change `LandingHeader.tsx` from `sticky` to `fixed top-0 inset-x-0 z-50`.
- **Rationale**: On initial load at `scrollY === 0`, `fixed` over the Hero allows the hero image to span the full top viewport, making the navbar an organic part of the Hero header. When the user scrolls, the fixed element remains at the top, transitioning from `bg-transparent py-6` to `bg-black/85 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5`.
- **Hero Alignment**: Add adequate top padding in `HeroSection.tsx` (`pt-28` to `pt-32`) so the hero typography is never obscured.

### 2. Grouped White Showcase Zone in `app/page.tsx`
- **Choice**: Group `PrototypeCarousel` and `HotspotShowcase` inside a single contiguous white wrapper:
  - `<div className="w-full bg-white text-zinc-950">` containing both components.
- **Rationale**: Prevents awkward alternating single-block stripes. The page flows naturally:
  1. Dark Hero & Marquee ticker
  2. White creative showcase band (Prototypes + Real-world production images)
  3. Dark technical infrastructure band (Campus Labs Prototyping + Machine Telemetry + Footer)

### 3. Image Card Framing in `HotspotShowcase.tsx`
- **Choice**: Add `border border-zinc-200/80 shadow-md rounded-xl` to the showcase image cards.
- **Rationale**: Because the background is white, framing the photographic cards gives them visual definition and prevents edge bleeding.

## Risks / Trade-offs

- **[Risk] Fixed header covering content anchor links** → Use CSS `scroll-margin-top: 5rem` on section IDs (`#prototypes`, `#showcase`, `#support-pillars`, `#machines`) so deep-links land with proper headroom below the fixed navbar.
