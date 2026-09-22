## Context

The initial landing page was assembled with raw unoptimized assets and static approximations. To elevate this from a prototype to a real-world production application, we must enforce rigorous development standards: asset compression, Core Web Vitals optimization, seamless continuous motion, and authentic fidelity to the Figma source vector artwork.

## Goals / Non-Goals

**Goals:**
- Formulate and commit production development guidelines (`docs/dev-guidelines.md`).
- Optimize local images (convert 1.5MB PNGs to WebP ~120KB, configure responsive `sizes` and preload priority).
- Implement a dual-track seamless infinite marquee ticker that never runs out of text.
- Replace the synthetic checkerboard with the authentic `pixel-transition.svg` vector from Figma node `144:79`.
- Fetch all static machines from Prisma without limits and display them with operational status badges.
- Introduce dynamic campus selection (`Køge` default) that computes available labs (Køge: Makerspace & Medialab; Roskilde: Makerspace, Medialab, Dimselab), drives the step indicator count, and updates the Spotlight card in sync.

**Non-Goals:**
- Modifying underlying Prisma database schema or altering the admin POS `/admin/pos` checkout engine.

## Decisions

### Decision 1: Asset Optimization & Production Guidelines
- **Choice**: Compress local photography into WebP format under `public/images/landing/` (reducing `hero-bg` from 1.5MB to <180KB). Enforce this standard via `docs/dev-guidelines.md`.
- **Alternatives Considered**: Retaining original PNGs. Rejected because 1.5MB uncompressed images severely degrade mobile LCP and local network performance.

### Decision 2: Dual-Track Seamless Marquee Ribbon
- **Choice**: Structure `MarqueeRibbon` with two identical tracks in a flex container animated with `@keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }`.
- **Alternatives Considered**: Single static text string with overflow. Rejected because wide monitors and continuous playback run out of text.

### Decision 3: Authentic SVG Pixel Dither Transition
- **Choice**: Directly embed `public/images/landing/pixel-transition.svg` (extracted from Figma node `144:79`) with responsive SVG scaling.
- **Alternatives Considered**: CSS radial/conic gradients. Rejected because the design explicitly calls for large individual pixel step blocks.

### Decision 4: Dynamic Campus & Lab Explorer Island
- **Choice**: Build a unified interactive Client component (`CampusLabExplorer`) linking the "Prototyping & Understøttelse" tab indicators with the "Makerspace / Medialab" spotlight card. Selecting a campus (e.g. Køge) displays its 2 labs; clicking a lab updates both the guidance points and the highlight card with smooth fade/slide transitions.
- **Alternatives Considered**: Separate disconnected client components with prop drilling or hardcoded tabs. Rejected because they would fall out of sync.

### Decision 5: Complete Hardware Retrieval
- **Choice**: Remove the `take: 4` limit from the Server Component Prisma query, passing all static machines to `MachineTelemetrySection`, which will render all units in a responsive layout with active filters.

## Risks / Trade-offs

- **[Tab switching causing content layout shift]** → Use CSS `min-h` containers and `motion/react` cross-fades so toggling between Makerspace and Medialab does not cause page jump.
