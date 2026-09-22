## 1. Hero-Integrated Navbar with Scroll Transition

- [x] 1.1 Refactor `LandingHeader.tsx` to `fixed top-0 inset-x-0 z-50` with initial transparent styling over the Hero
- [x] 1.2 Implement the unsticking scroll transition in `LandingHeader.tsx` (`bg-black/85 backdrop-blur-md border-b border-white/10 shadow-2xl`) triggered past Hero threshold (`scrollY > 100px`)
- [x] 1.3 Ensure `HeroSection.tsx` has comfortable top padding (`pt-28`) so header content overlays cleanly without clipping hero text

## 2. White Background for Images Showcase Section

- [x] 2.1 Update `HotspotShowcase.tsx` to render on pure white background (`bg-white text-zinc-950`) with framed image cards and high-contrast styling
- [x] 2.2 Group `PrototypeCarousel` and `HotspotShowcase` inside the contiguous white showcase zone in `app/page.tsx`

## 3. Verification & Validation

- [x] 3.1 Run `npx tsc --noEmit` and `npx eslint` to verify complete type safety and code cleanliness
- [x] 3.2 Verify initial hero load transparency, smooth navbar unsticking on scroll, and white showcase zone visual continuity
