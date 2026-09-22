## 1. Prototype Section High-Contrast White Background

- [x] 1.1 Update `PrototypeCarousel.tsx` with pure white background (`bg-white`), dark notch typography (`text-zinc-950`), and high-contrast card styling (`bg-[#EFEFF1]`, `border-zinc-300`, `text-zinc-900`)
- [x] 1.2 Update section wrappers in `app/page.tsx` to position `PrototypeCarousel` as the deliberate white accent section

## 2. Restore Dark Floor for Lower Sections

- [x] 2.1 Revert `CampusLabExplorer.tsx` to dark floor (`bg-black text-white`), restoring white typography and high-contrast CMYK accents
- [x] 2.2 Style `MachineTelemetrySection.tsx` cards for the dark floor (`bg-[#121214]`, `border-[#262626]`, `text-white`), keeping the 3-card autoscrolling ticker

## 3. Sticky Navigation Bar with Transitionable Background

- [x] 3.1 Refactor `LandingHeader.tsx` to `sticky top-0 z-50` with a scroll-detection state hook
- [x] 3.2 Add smooth backdrop blur transition (`bg-black/85 backdrop-blur-md border-b border-white/10 shadow-2xl`) when scrolled beyond 60px

## 4. Verification & Testing

- [x] 4.1 Run `npx tsc --noEmit` and `npx eslint` to verify complete type safety and code cleanliness
- [x] 4.2 Verify navbar scroll transition, prototype section contrast, and dark floor legibility
