## Context

The user clarified the authentic visual structure of the landing page:
1. The section intended to have a pure white background is *"Din næste prototype starter her"* (`PrototypeCarousel.tsx`), corresponding to Frame 25 in Figma.
2. The section *"Prototyping & Understøttelse"* (`CampusLabExplorer.tsx`) and the lower sections belong on the dark brand floor (`#000000` / `#09090b`), preserving high-contrast readability and preventing any white-on-white text issues.
3. The navigation header (`LandingHeader.tsx`) must be sticky with a smooth background and border transition when scrolled out of the initial hero area.

## Goals / Non-Goals

**Goals:**
- Render `"Din næste prototype starter her"` on pure white with pitch-black notch typography (`text-zinc-950`), well-defined card surfaces (`bg-zinc-100/90`, `border-zinc-300`), and dark text labels.
- Revert `"Prototyping & Understøttelse"` and the machine telemetry section to the dark floor (`bg-black text-white`), retaining the authentic CMYK lab accent mapping (Cyan, Magenta, Yellow) and the autoscrolling 3-card clipped telemetry list.
- Transform `LandingHeader.tsx` into a sticky header (`sticky top-0 z-50`) with an animated backdrop blur transition from transparent to `bg-black/85 backdrop-blur-md border-b border-white/10` once scrolled past the hero (`scrollY > 60px`).

**Non-Goals:**
- Modify admin POS routes or checkout operations.
- Alter database schema or offline network mandates.

## Decisions

### 1. Prototype Section High-Contrast White Surface
- **Choice**: Apply `bg-white text-zinc-950` exclusively to `PrototypeCarousel.tsx` as a deliberate, striking pattern-break section between the Marquee Ribbon and the Hotspot Showcase.
- **Card Aesthetics**: Cards receive `bg-[#EFEFF1]`, `border-zinc-300/80`, and `text-zinc-900` labels to guarantee crisp readability against the white background.

### 2. Restoration of Dark Floor for Prototyping & Hardware Telemetry
- **Choice**: Restore `CampusLabExplorer.tsx` to `bg-black text-white`.
- **Rationale**: Re-establishes high-contrast readability (`text-white`, `text-zinc-300`) and highlights the vibrant CMYK laboratory colors on step indicators and spotlight cards.

### 3. Scroll-Aware Sticky Navigation Architecture
- **Choice**: Add passive scroll detection in `LandingHeader.tsx`:
  - `isScrolled` threshold: `60px`.
  - At top: `bg-transparent border-transparent py-5`.
  - When scrolled: `bg-black/85 backdrop-blur-md border-b border-white/10 shadow-2xl py-3`.
- **Rationale**: Keeps campus switching and POS access permanently accessible on mobile and desktop without obstructing content.

## Risks / Trade-offs

- **[Risk] Rapid scroll performance** → Use passive event listener (`{ passive: true }`) to ensure zero scroll jank or main-thread blocking.
- **[Risk] Header layout shift** → Use padding transition rather than height alteration to maintain buttery-smooth layout stability.
