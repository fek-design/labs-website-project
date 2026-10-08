## 1. Resilient Image Box Fallback

- [x] 1.1 Create `components/landing/SafeImageBox.tsx` with local load/error state, dark tactile glassmorphic styling, and fallback Phosphor icon
- [x] 1.2 Integrate `SafeImageBox` in `components/landing/PrototypeCarousel.tsx` to handle missing/broken craft images gracefully
- [x] 1.3 Integrate `SafeImageBox` in `components/landing/HotspotShowcase.tsx` for project cards
- [x] 1.4 Integrate `SafeImageBox` in `components/landing/MachineTelemetrySection.tsx` for machine item thumbnails

## 2. Apple-Style Narrow Column Layout Standard

- [x] 2.1 Update `components/landing/LandingHeader.tsx` header container constraint to `max-w-5xl`
- [x] 2.2 Update `components/landing/HeroSection.tsx` content container to `max-w-5xl` with centered alignment
- [x] 2.3 Update `components/landing/PrototypeCarousel.tsx` container to `max-w-5xl` while preserving mobile track edge bleed
- [x] 2.4 Update `components/landing/HotspotShowcase.tsx` container to `max-w-5xl`
- [x] 2.5 Update `components/landing/CampusLabExplorer.tsx` container and spotlight card to `max-w-5xl`
- [x] 2.6 Update `components/landing/MachineTelemetrySection.tsx` container to `max-w-5xl`
- [x] 2.7 Update `components/landing/LandingFooter.tsx` container to `max-w-5xl`

## 3. Dual-Persona Sitemap & Navigation Overhaul

- [x] 3.1 Restructure `components/landing/LandingHeader.tsx` drawer navigation with clear student pathways (`/katalog`, `#prototypes`, `#showcase`, `#support-pillars`, `#machines`) and teacher gateway (`/admin`)
- [x] 3.2 Restructure `components/landing/LandingFooter.tsx` directory with distinct links to `/katalog`, Makerspace, Medialab, and `/admin`, eliminating duplicate anchor tags

## 4. Validation & Verification

- [x] 4.1 Test layout scaling and centered gutters across desktop (>= 1024px), tablet, and mobile screens
- [x] 4.2 Validate fallback rendering with deliberate missing/invalid image sources to ensure zero console errors or broken image icons
- [x] 4.3 Verify all navigation and footer hyperlinks navigate cleanly without repetitive destinations
