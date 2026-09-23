## Why

The initial landing page implementation demonstrated layout feasibility but surfaced critical production readiness and UX engineering issues:
1. **Performance & Assets**: Unoptimized high-resolution imagery (such as a 1.5MB hero background PNG) causes noticeable initial load latency. Production development guidelines are required to ensure the application is built for actual end-user deployment rather than a temporary prototype.
2. **Marquee Gap**: The ticker runs out of text and leaves an empty void before resetting.
3. **Transition Artifact**: The section divider was temporarily implemented as a CSS checkerboard instead of the authentic SVG pixel dither raster transition from Figma (`node 144:79`).
4. **Machine Hardware Telemetry**: The machine list capped items at 4 rather than fetching and displaying all static equipment registered in the database.
5. **Static Lab Pillars**: The "Prototyping & Understøttelse" and Spotlight sections rendered static 3-step text instead of dynamically reflecting the specific labs present at the selected campus (e.g., Køge having Makerspace and Medialab), updating content in tandem when toggled.

## What Changes

- **Production Dev Guidelines**: Add explicit production development standards (`docs/dev-guidelines.md`) covering Core Web Vitals, local asset compression, WebP encoding, and non-blocking database queries.
- **Image & Loading Optimization**: Compress and optimize all local photography into high-efficiency WebP/SVG formats with responsive `sizes` and eager LCP preloading for the hero image.
- **True Infinite Marquee**: Refactor `MarqueeRibbon` to use a dual-track seamless looping architecture so text never runs out or displays a gap.
- **Figma Pixel Raster Transition**: Replace the CSS checkerboard with the authentic `pixel-transition.svg` vector from Figma node `144:79`.
- **Complete Machine Hardware Inventory**: Update `app/page.tsx` and `MachineTelemetrySection` to fetch and render all static machines from Prisma with responsive layout and live operational status badges.
- **Dynamic Campus & Lab State Management**:
  - Implement dynamic campus awareness (e.g., Køge with 2 labs: Makerspace & Medialab; Roskilde with 3 labs: Makerspace, Medialab, Dimselab).
  - Make "Prototyping & Understøttelse" tab indicators match the active campus's labs.
  - Dynamically switch both the guidance points and the Spotlight card below when a user selects a lab.

## Capabilities

### New Capabilities
- `landing-performance-and-dynamic-labs`: High-performance landing page optimizations, seamless infinite ticker, authentic SVG pixel raster transition, full database hardware inventory display, and dynamic campus-aware lab exploration.

### Modified Capabilities

## Impact

- **UI Components**:
  - `components/landing/MarqueeRibbon.tsx`: Seamless dual-track continuous loop.
  - `components/landing/HotspotShowcase.tsx`: Replaces CSS checkerboard with `pixel-transition.svg`.
  - `components/landing/SupportPillars.tsx` & `LabSpotlightCard.tsx`: Unified or coordinated via campus/lab interactive state.
  - `components/landing/MachineTelemetrySection.tsx`: Displays all database machines.
  - `components/landing/LandingHeader.tsx`: Provides campus selection trigger.
- **Assets**: `public/images/landing/hero-bg.webp` (optimized from 1.5MB to <180KB), `pixel-transition.svg`.
- **Guidelines**: `docs/dev-guidelines.md` documenting production engineering standards.
