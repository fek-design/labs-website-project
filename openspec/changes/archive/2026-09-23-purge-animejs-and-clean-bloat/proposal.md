## Why

The repository contains unused dependencies, legacy dead components, obsolete starter template assets, and unreferenced design screenshots totaling ~5MB of bloat. Specifically, `anime.js` was introduced as part of an experimental "tri-stack" animation architecture but is only used in a single mock test component (`NodeTelemetryVisualizer.tsx`) in Admin Settings. Purging `anime.js` unifies the animation architecture on `motion/react` and `gsap`, reduces bundle overhead, eliminates dependency maintenance, and cleans dead code.

## What Changes

- **Purge Anime.js**:
  - Remove `animejs` and `@types/animejs` from `package.json`.
  - Delete `lib/anime.ts` (~190 LOC).
  - Clean `lib/motion.ts` by removing all anime.js re-exports and references.
  - Delete `components/settings/NodeTelemetryVisualizer.tsx` and remove its invocation from `components/settings/AdminSettingsView.tsx`.
  - Update `openspec/config.yaml`, `openspec/core/spec.md`, and `openspec/core/animation-architecture.md` to reflect the clean Dual-Stack Motion Architecture (`motion/react` + `gsap`).
- **Remove Unused Database Adapter**:
  - Remove `@prisma/adapter-pg` from `package.json` (the application runs strictly on MariaDB/MySQL via `@prisma/adapter-mariadb`).
- **Remove Dead Landing Components**:
  - Delete `components/landing/LabSpotlightCard.tsx` (0 imports).
  - Delete `components/landing/SupportPillars.tsx` (0 imports).
- **Prune Boilerplate & Unreferenced Assets**:
  - Delete unused Next.js starter SVGs in `public/`: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`.
  - Delete unreferenced images in `public/images/`: `product_page_figma_144_203.png` (~2.3MB Figma mockup screenshot), `landing/hero-bg.png` (~1.5MB), `landing/showcase-textile.png` (~863KB), `landing/showcase-poster.png` (~158KB), `landing/product-tshirt.png` (~6.8KB), and `landing/checkerboard-divider.png` (~581B).

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `visual-toolkits`: Solidifies the Dual-Stack Motion Architecture (`motion/react` for component micro-interactions and spring physics; `gsap` for macro scroll telemetry and infinite marquees) and formally purges Anime.js.

## Impact

- **Dependencies**: Eliminates `animejs`, `@types/animejs`, and `@prisma/adapter-pg` from `package.json`.
- **Bundle & Storage**: Reduces client JavaScript bundle size and reclaims ~4.8MB of dead assets from `public/`.
- **APIs**: Removes Anime.js helpers (`useAnime`, `drawSvgPath`, `animateCounter`, `staggerElements`) from `@/lib/motion`.
- **Admin Settings**: Removes mock `NodeTelemetryVisualizer` from `AdminSettingsView`.
