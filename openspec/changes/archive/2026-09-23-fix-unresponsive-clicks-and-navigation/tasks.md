## 1. Network & Dev Server Environment

- [x] 1.1 Update `package.json` dev script to `"next dev -H 0.0.0.0"` to ensure full LAN accessibility for iOS and Android devices

## 2. Touch & Click Interaction Normalization

- [x] 2.1 Add global `touch-action: manipulation` rule to `app/globals.css` for `button`, `a`, and clickable role targets to eliminate 300ms tap delay
- [x] 2.2 Add passive `touchstart` listener initialization in root/client layout to enable instant `:active` states on iOS Safari
- [x] 2.3 Remove `select-none` and apply `touch-manipulation` on hamburger toggle and campus switcher button in `LandingHeader.tsx`
- [x] 2.4 Remove `select-none` and apply `touch-manipulation` on CTA button in `HeroSection.tsx`
- [x] 2.5 Apply `touch-manipulation` to lab indicator buttons in `CampusLabExplorer.tsx` and beacon buttons in `HotspotShowcase.tsx`

## 3. IKEA-Inspired Hairline Border System

- [x] 3.1 Refine `PrototypeCarousel.tsx` card styling with crisp 1px hairline borders (`border border-[#DFDFDF]`), clean light background, and minimal elevation
- [x] 3.2 Refine `HotspotShowcase.tsx` showcase frames and tooltip cards with clean 1px hairline borders (`border border-zinc-200`) and reduced drop shadows
- [x] 3.3 Ensure `LandingHeader.tsx` campus dropdown uses clean 1px hairline border (`border border-white/12`)

## 4. Verification & Validation

- [x] 4.1 Run `npx tsc --noEmit` and `npx eslint components/landing` to verify type safety and clean syntax
- [x] 4.2 Verify touch responsiveness, instant drawer opening, campus selection, and IKEA border appearance across mobile and desktop
