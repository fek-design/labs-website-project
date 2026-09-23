## 1. Typography & Font Fallbacks Integration

- [x] 1.1 In `app/layout.tsx`, import `Space_Grotesk` and `Inter` via `next/font/google` and assign CSS variables to `<html>`
- [x] 1.2 In `app/globals.css`, update `@theme` font tokens to map `--font-notch` and `--font-sans` with `Stack Sans Notch`, `Space Grotesk`, `Stack Sans Text`, and `Inter`

## 2. Hero CTA Geometry & Padding

- [x] 2.1 Verify and lock `HeroSection.tsx` CTA button to sharp rectangular `rounded-none` geometry with 1px border

## 3. Interactive Hotspot Popovers

- [x] 3.1 Refactor `HotspotShowcase.tsx` hotspot popover to a spacious clickable card (`p-4 sm:p-5`) with `pointer-events-auto`
- [x] 3.2 Link hotspot popovers to `#support-pillars` with clear title, lab indicator, and action chevron (`→`)

## 4. Full-Bleed Carousel Cards

- [x] 4.1 Refactor `PrototypeCarousel.tsx` to display full-bleed photo cards with embedded bottom button containing the product title and arrow
- [x] 4.2 Ensure horizontal carousel scrolling remains smooth with edge-bleed padding on mobile

## 5. Verification & Validation

- [x] 5.1 Run `npx tsc --noEmit` and `npx eslint components/landing` to ensure clean type checks and linting
- [x] 5.2 Verify font rendering, hotspot click navigation, and carousel full-bleed card appearance
