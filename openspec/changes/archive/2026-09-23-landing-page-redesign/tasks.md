## 1. Route Migration & Asset Preparation

- [x] 1.1 Move the current admin launchpad from `app/page.tsx` to `app/admin/page.tsx` so staff access is preserved at `/admin`
- [x] 1.2 Download and optimize photography, product graphics, and vector icons from Figma frame `144:78` to `public/images/landing/`
- [x] 1.3 Verify typography tokens and font-family declarations for `Stack Sans Notch` and `Stack Sans Text` in Tailwind config

## 2. Navigation & Hero Components

- [x] 2.1 Build `LandingHeader` with brand `LABS`, active campus indicator (`køge`), and navigation menu trigger
- [x] 2.2 Build `HeroSection` with photography background, `Zealands Kreative hjørne` typography, and `UDFORSK` CTA
- [x] 2.3 Build `MarqueeRibbon` infinite CSS ticker with `DIMSELAB • MAKERSPACE • MEDIALAB •`

## 3. Interactive Showcases & Carousels

- [x] 3.1 Build `PrototypeCarousel` ("Din næste prototype starter her") with horizontal scrollable prototype cards
- [x] 3.2 Build `HotspotShowcase` with pulsing beacon markers and interactive tooltip overlays (`Print på T-Shirt ↳`)
- [x] 3.3 Build `SupportPillars` ("Prototyping & Understøttelse") with step indicators and value points

## 4. Hardware Telemetry & Branded Footer

- [x] 4.1 Build `LabSpotlightCard` in high-contrast Cyan (`#009FE3`) showcasing Makerspace capabilities
- [x] 4.2 Build `MachineTelemetrySection` displaying verified `10+ Maskiner` count and live hardware status cards queried via Prisma
- [x] 4.3 Build `LandingFooter` with mission statement and directory links (`MAKERSPACE`, `MEDIALAB`, `DIMSELAB`)

## 5. Page Assembly & Verification

- [x] 5.1 Assemble all modular components into `app/page.tsx` as a Server Component root with interactive Client Islands
- [x] 5.2 Validate both routes (`/` for public landing and `/admin` for staff dashboard), test responsiveness matching Figma mobile (402px) up through desktop, and run `npm run lint` / `npm run build`
