## 1. Anime.js Installation & Core Library Integration

- [x] 1.1 Install `animejs` and `@types/animejs` in `package.json`
- [x] 1.2 Verify package resolution and TypeScript definitions in Next.js App Router environment

## 2. Shared Motion & Anime.js React Helpers

- [x] 2.1 Create `lib/anime.ts` with typed helpers:
  - `useAnime` React hook for SSR-safe lifecycle handling and cleanup
  - `drawSvgPath` helper for SVG stroke dashoffset drawing
  - `animateCounter` helper for numeric metrics and tickers
  - Staggered split-text / typography wave animator
- [x] 2.2 Re-export Anime.js utilities and types through `lib/motion.ts` with comprehensive TSDoc annotations

## 3. Speckit Documentation & Architecture Guide

- [x] 3.1 Create `openspec/core/animation-architecture.md` detailing:
  - The 3-way animation decision matrix (`motion/react` vs `gsap` vs `animejs`)
  - Best practices, lifecycle patterns, and anti-patterns for each engine
  - Performance rules (60fps targets, transform/opacity isolation, cleanup protocols)
  - The "Figma Mockup UI vs. Speckit UX Engineering" design principle
- [x] 3.2 Update `README.md` and codebase documentation to reflect the expanded animation stack and documentation standards

## 4. OpenSpec Configuration & Figma MCP Protocol

- [x] 4.1 Update `openspec/config.yaml`:
  - Add `animejs` to the `Animation` section in `context`
  - Add `Figma Integration` protocol in `context` citing `get_figma_data` and `download_figma_images`
  - Add Figma MCP verification and local asset saving rules under `rules.design_system`
  - Add the explicit rule that Figma is a visual mockup (UI source of truth) while UX interactions, error states, and loading fallbacks must be engineered in code
  - Add guidance in `operations.apply.guidance` requiring node ID inspection prior to component generation
- [x] 4.2 Validate `openspec/config.yaml` syntax and ensure zero-cloud compliance

## 5. Component Demonstration & Verification

- [x] 5.1 Implement a demonstration component showcasing Anime.js SVG blueprint path drawing and live numeric counter ticker
- [x] 5.2 Validate Figma MCP tool integration by retrieving target frame node `#87:5314` (`Dashboard - Indstillinger`) and ensuring visual UI fidelity while demonstrating autonomous UX interactive states
- [x] 5.3 Verify clean code structure, imports, and component integration across the codebase
