## Why

The user requested a precise architectural specification for corner geometry mimicking IKEA's web design system: specifically codifying when to use sharp square corners (`0px` / `rounded-none`), when to use subtle rounded corners (and to what exact degree: `6px–8px` / `rounded-md`–`rounded-lg`), and when to use full pill geometry (`rounded-full`). Establishing this rule removes ad-hoc styling and creates visual consistency across landing page components.

## What Changes

- **Codify IKEA Corner Geometry Hierarchy**:
  - **Sharp / Square (`0px` / `rounded-none`)**: Applied to primary action CTAs (e.g., the "UDFORSK" button), full-bleed image showcase frames, and structural editorial containers.
  - **Subtle Rounded (`6px`–`8px` / `rounded-md` to `rounded-lg`)**: Applied to modular product cards (carousel items in `PrototypeCarousel.tsx`), floating dropdown menus (campus selector in `LandingHeader.tsx`), tooltip banners, and spotlight containers (`CampusLabExplorer.tsx`).
  - **Full Pill (`9999px` / `rounded-full`)**: Exclusively reserved for status badges, campus location pills, beacon circular triggers, and small indicator chips.
- **Master Spec Synchronization**:
  - Formalize these rules in the master specification at `openspec/specs/visual-toolkits/spec.md`.
- **Component Alignment**:
  - Update `HeroSection.tsx` CTA button to use sharp square corners (`rounded-none`) with 1px hairline border.
  - Update `PrototypeCarousel.tsx` cards to use refined subtle radius (`rounded-md` / 6px) with 1px hairline border (`#DFDFDF`).
  - Update `HotspotShowcase.tsx` image frames to use sharp architectural corners (`rounded-none` or `rounded-sm`) with 1px hairline border (`#DFDFDF`).
  - Update `LandingHeader.tsx` dropdown to use `rounded-lg` (8px).

## Capabilities

### Modified Capabilities
- `visual-toolkits`: Updating the master visual toolkits specification with normative requirements and testable scenarios for IKEA-inspired corner geometry (square vs rounded rules and degrees).

## Impact

- `openspec/specs/visual-toolkits/spec.md`: Master specification updated with corner geometry rules.
- `components/landing/HeroSection.tsx`: CTA button styled with sharp square corners (`rounded-none`).
- `components/landing/PrototypeCarousel.tsx`: Product cards updated to subtle `rounded-md`.
- `components/landing/HotspotShowcase.tsx`: Showcase frames updated to architectural `rounded-none` / `rounded-sm`.
- `components/landing/LandingHeader.tsx`: Location dropdown aligned to `rounded-lg`.
- `components/landing/CampusLabExplorer.tsx`: Lab spotlight card aligned to `rounded-lg`.
