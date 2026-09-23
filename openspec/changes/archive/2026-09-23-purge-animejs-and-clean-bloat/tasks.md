## 1. Purge Anime.js and Deprecate Isolated Visualizer

- [x] 1.1 Remove `NodeTelemetryVisualizer` from `components/settings/AdminSettingsView.tsx` and delete `components/settings/NodeTelemetryVisualizer.tsx`
- [x] 1.2 Remove Anime.js re-exports from `lib/motion.ts` and delete `lib/anime.ts`
- [x] 1.3 Update fallback anchor link in `components/landing/HotspotShowcase.tsx` from `#support-pillars` to `#labs`
- [x] 1.4 Update `openspec/config.yaml`, `openspec/core/spec.md`, and `openspec/core/animation-architecture.md` to establish the Dual-Stack Motion Architecture (`motion/react` + `gsap`)

## 2. Remove Unused Packages

- [x] 2.1 Uninstall `animejs`, `@types/animejs`, and `@prisma/adapter-pg` via npm

## 3. Prune Dead Components and Assets

- [x] 3.1 Delete unused components `components/landing/LabSpotlightCard.tsx` and `components/landing/SupportPillars.tsx`
- [x] 3.2 Delete unused Next.js starter template SVGs in `public/` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`)
- [x] 3.3 Delete unreferenced mock and legacy images in `public/images/` (`product_page_figma_144_203.png`, `landing/hero-bg.png`, `landing/showcase-textile.png`, `landing/showcase-poster.png`, `landing/product-tshirt.png`, `landing/checkerboard-divider.png`)

## 4. Verification and Typecheck

- [x] 4.1 Run `npx tsc --noEmit` to ensure clean TypeScript compilation across the entire project
