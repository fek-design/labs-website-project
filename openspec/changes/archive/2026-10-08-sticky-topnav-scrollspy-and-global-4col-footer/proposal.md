## Why

The current public header is a minimal top-bar with a mobile hamburger drawer, but lacks a persistent desktop navigation bar with active section spy indicators and direct cross-route anchor handling. In addition, the footer currently uses a 2-column layout that only renders on the frontpage rather than functioning as a comprehensive, persistent 4-column utility belt across all public pages (`/`, `/katalog`, `/craft/[slug]`).

Implementing a sticky top navigation bar with GSAP-driven scroll spy and cross-page anchor routing, paired with a global 4-column utility footer displaying opening hours, live lab availability status, exploration links, support pillars, and staff portal triggers, will provide clear guidance for students while maintaining direct utility for educators and staff.

## What Changes

1. **Primary Sticky Navigation Bar (Student & Public)**:
   - **Framework**: Sticky Top-Nav with GSAP/IntersectionObserver scroll spy indicating active section states.
   - **Cross-Route Anchor Handling**: Clicking `#` anchors (`/#showcase`, `/#machines`) on the frontpage initiates smooth scrolling; clicking from `/katalog` or `/craft/*` triggers a Next.js router push directly to `/#<anchor>`.
   - **Layout & Elements**:
     - **Left**: `LABS` brand logo (returns to top or `/`).
     - **Center**: Navigation links (`Showcase` ➔ `/#showcase`, `Maskiner` ➔ `/#machines`, `Guides` ➔ `/craft` or craft prototypes).
     - **Right**: Prominent CTA button for `Katalog` (`/katalog`, styled with high visual priority).
2. **Global 4-Column Utility Belt Footer**:
   - **Framework**: 4-column responsive grid styled in brand aesthetic, mounted across all public routes (`/`, `/katalog`, `/craft/*`).
   - **Column 1 (Zealand Labs)**: Physical campus location, opening hours, and real-time operational status badge (e.g. "Makerspace: Åben").
   - **Column 2 (Udforsk)**: Direct links to Udstyrskatalog (`/katalog`), Craft Guides (`/craft`), and Prototype Galleri (`/#prototypes`).
   - **Column 3 (Support & Pillars)**: Makerspace Retningslinjer (`/#support-pillars`), Medialab Retningslinjer (`/#support-pillars`), and Kontakt / Hjælp.
   - **Column 4 (Personale & Gateway)**: Underviser Login trigger and direct link to Admin Dashboard (`/admin`).

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `public-landing-portal`: Update navigation requirements to include desktop sticky top-nav with scroll spy, cross-route hash navigation, and the 4-column global utility footer with live status indicators and staff gateway.

## Impact

- **Affected Components**:
  - `components/landing/LandingHeader.tsx` (desktop sticky links, scroll spy, cross-page hash push)
  - `components/landing/LandingFooter.tsx` (overhauled into 4-column utility belt grid with hours & live status)
  - `app/katalog/page.tsx` (incorporate global header/footer consistency)
  - `app/craft/[slug]/page.tsx` (incorporate global footer)
- **Dependencies**: Uses Next.js App Router (`useRouter`, `usePathname`), GSAP / IntersectionObserver for scroll spy, and Phosphor icons.
