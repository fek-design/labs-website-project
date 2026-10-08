## Why

The current public landing page uses expansive `max-w-7xl` (1280px) containers that stretch editorial content and media across large viewports, causing suboptimal reading measure lengths and visual sprawl. Additionally, missing or failing image URLs in prototype and machine cards can trigger broken image placeholders or console errors, and the header drawer and footer navigation contain repetitive hash links (e.g. repeated `#support-pillars`) without distinct pathways tailored to the primary personas: Students (borrowing, craft inspiration, machine availability) and Teachers (course packs, manuals, and administrative access).

Standardizing the page on an Apple-style narrow container column width, adding graceful fallback image boxes, and restructuring navigation around student/teacher user journeys will establish high visual polish, zero visual breakage, and streamlined discoverability.

## What Changes

- **Apple.com-Style Narrow Column Layout**: Restructure the primary landing page containers from `max-w-7xl` to Apple's focused `max-w-5xl` (~1024px) / `max-w-[980px]` content boundaries, ensuring generous breathing margins and optimal typographic line lengths (45–65 characters).
- **Graceful Image Box Fallback**: Introduce a resilient image container fallback pattern across the frontpage (`PrototypeCarousel`, `HotspotShowcase`, `MachineTelemetrySection`) so that missing, null, or failing image sources render a styled dark glassmorphic box (`bg-[#18181b] border border-[#262626]`) with an elegant glyph/placeholder instead of firing browser console errors or displaying broken image icons.
- **Dual-Persona Navigation & Sitemap Refactor**:
  - Restructure `LandingHeader` drawer and `LandingFooter` to provide clear, dedicated journeys for **Students** (direct link to `/katalog`, craft guides, live machine availability) and **Teachers** (class kits/bundles, equipment safety manuals, direct admin launchpad).
  - Eliminate repetitive anchor links (replacing duplicate `#support-pillars` links with distinct targets and direct routes).
  - Add `/katalog` to the primary navigation drawer and footer index.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `public-landing-portal`: Update requirements to enforce Apple-style narrow column container layouts, resilient image box fallbacks without error states, and dual-persona navigation linking for students and teachers across the header drawer and footer.

## Impact

- **Affected Components**:
  - `components/landing/LandingHeader.tsx` (navigation drawer and top bar layout)
  - `components/landing/LandingFooter.tsx` (footer layout and persona navigation index)
  - `components/landing/HeroSection.tsx` (narrow container alignment)
  - `components/landing/PrototypeCarousel.tsx` (narrow container & resilient image fallback)
  - `components/landing/HotspotShowcase.tsx` (narrow container & image resilience)
  - `components/landing/CampusLabExplorer.tsx` (narrow container layout)
  - `components/landing/MachineTelemetrySection.tsx` (narrow container & machine image fallback)
  - `app/page.tsx` (page container alignment)
- **Dependencies**: No external npm packages required; utilizes existing Tailwind CSS v4, Motion, and Phosphor icons.
