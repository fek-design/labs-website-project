## Why

Zealand Labs requires top-tier digital agency standards across motion design, layout aesthetics, and visual tooling. This change injects agency-grade visual toolkits and standards for `motion.dev` (`motion/react`), `gsap` (`@gsap/react`), and `tailwindcss` (v4 with CMYK color tokens), alongside a dedicated reference repository at `openspec/mockups/` for PDF and PNG design assets.

## What Changes

- **Agency Visual Toolkits & Presets**:
  - Provide a standardized motion architecture module (`lib/motion.ts`) with deliberate physics-based spring presets, staggered entrance animations, diagonal coordinate wave calculations, and layout morph configurations.
  - Establish GSAP macro-orchestration patterns and ScrollTrigger hooks.
  - Enhance Tailwind CSS design system tokens in `app/globals.css` with CMYK telemetry variables and typography tokens (`Stack Sans Notch`, `Headline`, `Text`).
- **OpenSpec Mockups Reference Library**:
  - Establish `openspec/mockups/` folder supporting `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`, and `.pdf` files.
  - Register `openspec/mockups/` across `openspec/config.yaml` and `openspec/core/spec.md` to ensure all proposals, delta specs, and implementations reference active design mockups.

## Capabilities

### New Capabilities
- `visual-toolkits`: Unified motion and visual design system providing deliberate agency-quality animation tokens, GSAP macro orchestration, and Tailwind CMYK palette utilities.

### Modified Capabilities
<!-- None -->

## Impact

- **Codebase**:
  - `lib/motion.ts` (new shared agency motion toolkit)
  - `app/globals.css` (enhanced Tailwind CSS v4 design tokens)
  - `openspec/mockups/README.md` (mockups reference folder)
  - `openspec/config.yaml` (updated OpenSpec visual contract & mockups pointer)
  - `openspec/core/spec.md` (core architecture visual specification)
