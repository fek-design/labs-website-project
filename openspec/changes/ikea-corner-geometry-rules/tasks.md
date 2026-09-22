## 1. Hero CTA & Media Showcase Geometry (Tier 1: 0px / `rounded-none`)

- [x] 1.1 Update `HeroSection.tsx` CTA button to use sharp square corners (`rounded-none`) with crisp 1px border
- [x] 1.2 Update `HotspotShowcase.tsx` image frames to use square corners (`rounded-none`) with 1px hairline border (`border border-[#DFDFDF]`)

## 2. Product Cards & Popovers Geometry (Tier 2: 6px–8px / `rounded-md`–`rounded-lg`)

- [x] 2.1 Update `PrototypeCarousel.tsx` card corners to subtle `rounded-md` (6px) with 1px hairline border
- [x] 2.2 Align `LandingHeader.tsx` location dropdown to `rounded-lg` (8px) with 1px hairline border
- [x] 2.3 Align `CampusLabExplorer.tsx` spotlight card to `rounded-lg` (8px) with clean hairline styling

## 3. Badges & Chips Geometry (Tier 3: 9999px / `rounded-full`)

- [x] 3.1 Verify location pills, beacon buttons, and status tags retain full pill geometry (`rounded-full`)

## 4. Verification & Validation

- [x] 4.1 Run `npx tsc --noEmit` and `npx eslint components/landing` to ensure clean type checks and linting
- [x] 4.2 Visually verify the corner hierarchy across desktop and mobile screens
