## Why

Zealand Labs requires top navigation uniformity across all viewports (removing the desktop-only Katalog button and using the universal hamburger drawer alongside the campus location badge), footer hyperlink hygiene (removing dead links, the "is currently open" status pill, and copyright notices), and an 8-12-16 asymmetrical grid rhythm on the frontpage. Crucially, the platform must guarantee cross-device reliability (fixing broken click events and database fetching when accessed from external phones or secondary PCs across local network IPs), re-establish dedicated laboratory portal routes (`/makerspace` and `/medialab`), and resolve local Playwright automated testing driver failures.

## What Changes

1. **Universal Top Navigation (`LandingHeader.tsx`)**:
   - Retain brand logo (`LABS`) on the left and location badge (`KØGE CAMPUS`) + universal hamburger button on the right across all viewports (mobile, tablet, desktop).
   - Omit the quicklaunch "Katalog" CTA button and top-level horizontal center links; house all site navigation neatly in the drawer.
2. **Footer Hygiene (`LandingFooter.tsx`)**:
   - Prune all hyperlinks leading to non-existent or blank files (`USER_MANUAL.md`, SOP PDFs).
   - Remove the "is currently open" status pill and the copyright notice from the footer.
3. **8-12-16 Asymmetrical Grid Spans (`CampusLabExplorer.tsx`)**:
   - Structure the Prototyping & Understøttelse lab explorer using an 8-12-16 responsive grid divisible by 8.
   - 5 columns for narrative text and step tabs (`lg:col-span-5`), 7 columns for the high-impact CMYK visual card (`lg:col-span-7`) on desktop; vertically stacked on mobile (`grid-cols-1 gap-8`).
4. **Cross-Device Reliability & Server Action Origin Unblocking**:
   - Resolve client-side hydration issues (such as direct `localStorage` access during initial render) that prevent React event listeners from attaching on external mobile devices and secondary PCs.
   - Configure Next.js Server Action allowed origins in `next.config.ts` to permit local area network IP requests (e.g. `192.168.x.x`, `10.x.x.x`), enabling reliable database mutations and fetching from any LAN device.
5. **Reintroduction of Dedicated Lab Specific Pages**:
   - Bring back dedicated laboratory portal pages (`/makerspace` and `/medialab`) detailing equipment parks, workstation safety SOPs, lab manager schedules, and quick links to the POS and catalogue.
6. **Playwright Driver Configuration & Testing Hygiene**:
   - Resolve the Playwright browser runner driver download error (`404 Not Found` mac-arm64 driver) by providing local browser execution scripts or compatible test configurations.

## Capabilities

### New Capabilities
- `cross-device-and-lab-portals`: Cross-device event listener hydration, LAN IP server action origin configuration, dedicated lab portal routes (`/makerspace`, `/medialab`), and Playwright test driver resolution.

### Modified Capabilities
- `public-landing-portal`: Universal top navigation with hamburger menu, clean footer link hygiene without status pill or copyright, and 5-col/7-col asymmetric 8-12-16 grid layout.

## Impact

- **Affected Components & Routes**:
  - `components/landing/LandingHeader.tsx` (universal hamburger topnav)
  - `components/landing/LandingFooter.tsx` (pruned dead links, no status pill or copyright)
  - `components/landing/CampusLabExplorer.tsx` (5-col / 7-col asymmetric grid layout)
  - `app/makerspace/page.tsx` & `app/medialab/page.tsx` (restored dedicated lab portal pages)
  - `next.config.ts` (allowed origins for cross-device LAN IP access)
  - `components/landing/FirstTimeCampusGate.tsx` & `components/landing/CampusContext.tsx` (guaranteed hydration safety for mobile/external devices)
  - `package.json` & test configuration (Playwright driver resolution)
