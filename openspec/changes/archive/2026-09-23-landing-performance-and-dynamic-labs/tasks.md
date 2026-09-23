## 1. Production Guidelines & Asset Optimization

- [x] 1.1 Author `docs/dev-guidelines.md` specifying production engineering standards for Core Web Vitals, asset compression (<200KB), WebP encoding, and non-blocking database queries
- [x] 1.2 Convert and optimize landing page photography (`hero-bg.png` → `hero-bg.webp`) and configure responsive `sizes` and priority loading

## 2. Motion & Visual Fidelity Refinements

- [x] 2.1 Refactor `MarqueeRibbon` into a dual-track seamless loop architecture so the ticker never runs out of text on wide viewports
- [x] 2.2 Replace the synthetic CSS checkerboard in `HotspotShowcase` with the authentic `pixel-transition.svg` vector from Figma node `144:79`

## 3. Full Hardware Telemetry Querying

- [x] 3.1 Update the Prisma query in `app/page.tsx` to fetch all static machines without truncation
- [x] 3.2 Update `MachineTelemetrySection` to display all retrieved machines with operational status badges and a responsive layout

## 4. Dynamic Location-Aware Lab Exploration

- [x] 4.1 Define location and lab configurations (Køge: Makerspace & Medialab; Roskilde: Makerspace, Medialab, Dimselab) with location toggle in `LandingHeader`
- [x] 4.2 Connect "Prototyping & Understøttelse" step indicators to the active campus lab list and synchronize the Spotlight showcase card below to match the selected lab

## 5. Verification & Performance Validation

- [x] 5.1 Run `npx tsc --noEmit` and `npx eslint` to verify complete type safety and code cleanliness
- [x] 5.2 Test mobile and desktop viewport performance, seamless marquee continuity, and dynamic lab tab switching
