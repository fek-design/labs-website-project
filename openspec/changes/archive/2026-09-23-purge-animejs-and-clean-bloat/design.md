## Context

See `proposal.md` - Why. The repository has accumulated extraneous runtime packages (`animejs`, `@types/animejs`, `@prisma/adapter-pg`), an isolated test visualizer, dead landing components, starter template SVGs, and legacy high-resolution Figma mockup screenshots in `public/images/`.

## Goals / Non-Goals

**Goals:**
- Completely eradicate all traces of `anime.js` from runtime code, wrapper modules, package dependencies, and architecture documentation.
- Remove `@prisma/adapter-pg` without impacting active MariaDB/MySQL database connections.
- Delete unused components (`LabSpotlightCard.tsx`, `SupportPillars.tsx`) and obsolete mock assets (~4.8MB).
- Maintain 100% clean TypeScript compilation and build passes.

**Non-Goals:**
- Rewriting or altering existing `motion/react` spring curves or `gsap` scroll animations.
- Modifying Prisma schema, migrations, or database queries.
- Altering active production routes or user flows.

## Decisions

### 1. Delete `NodeTelemetryVisualizer.tsx` Rather Than Refactoring
- **Choice**: Completely delete `components/settings/NodeTelemetryVisualizer.tsx` and remove its invocation from `components/settings/AdminSettingsView.tsx`.
- **Rationale**: This component was explicitly introduced during the `animejs-figma-mcp-integration` change to demonstrate Anime.js path drawing (`drawSvgPath`) and DOM numeric interpolation (`animateCounter`). It displays hardcoded mock metrics (`1420 ops`, `14 ms`, `99.9%`) and a test pulse button. Real equipment and machine telemetry is handled live in `components/landing/MachineTelemetrySection.tsx`. Removing it cleans up Admin Settings.
- **Alternative considered**: Converting the counters to `setInterval` or `requestAnimationFrame`. Rejected because keeping artificial test mocks in production settings adds maintenance baggage.

### 2. Dual-Stack Motion Architecture
- **Choice**: Streamline the animation stack to two complementary tools:
  - `motion/react`: Component enters/exits, layout morphing (`layoutId`), and agency spring physics (`springGentle`, `springSnappy`, `springBouncy`).
  - `gsap` + `@gsap/react`: Scroll-driven macro choreography, pinned sections, and infinite marquee loops.
- **Rationale**: Eliminates the third overlapping library (`anime.js`), reducing bundle size and developer cognitive load.

### 3. Update Anchor Fallback in `HotspotShowcase.tsx`
- **Choice**: In `HotspotShowcase.tsx`, change the fallback anchor href from `#support-pillars` to `#labs`.
- **Rationale**: Since `SupportPillars.tsx` (which held `#support-pillars`) is removed, pointing the fallback to `#labs` (handled by `CampusLabExplorer.tsx`) ensures clicking unconfigured hotspot cards smoothly navigates to an existing on-page section.

### 4. Prune Unreferenced Images and Boilerplate SVGs
- **Choice**: Delete `product_page_figma_144_203.png` (~2.3MB screenshot), `landing/hero-bg.png` (~1.5MB), `landing/showcase-textile.png` (~863KB), `landing/showcase-poster.png` (~158KB), `landing/product-tshirt.png` (~6.8KB), `landing/checkerboard-divider.png` (~581B), and `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`.
- **Rationale**: None of these assets are imported or referenced anywhere in source files, CSS, or JSON data. Reclaims ~4.8MB of repository storage.

## Risks / Trade-offs

- **[Risk: Stale imports break build]** → **Mitigation**: All references to `anime.ts`, `useAnime`, and `NodeTelemetryVisualizer` are mapped. Run `npx tsc --noEmit` to confirm zero dangling references.
- **[Risk: npm uninstall modifies lockfile unexpectedly]** → **Mitigation**: Run explicit `npm uninstall animejs @types/animejs @prisma/adapter-pg` and verify `package.json` clean state.
