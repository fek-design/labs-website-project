# Change Proposal: Persona Navigation Audit, Accessibility & Craft Dataset Sync

## Why

Following the deployment of universal top navigation and dedicated lab portals, the project is entering its final pre-delivery stabilization phase. The remaining items on the master checklist require: (1) auditing navigation flows against the Student and Teacher personas to eliminate redundant routes and optimize availability, (2) synchronizing all craft prototype guides in `data/crafts.json` so all dynamic routes build statically, (3) completing the UI fallback automated test sheet for `SafeImageBox`, and (4) hardening accessibility with WCAG AA visible focus rings and skip-to-content links across all views.

## What Changes

- **Persona Navigation Audit & Route Hygiene**:
  - Audit navigation drawer, footer, and campus explorer links against the persona journeys mapped in `docs/SITEMAP.md` (Student: equipment borrowing, machine telemetry, prototyping guides; Teacher: class bundles, machine SOPs, POS loan counter).
  - Ensure all internal hash anchors (`#prototypes`, `#showcase`, `#machines`, `#support-pillars`) seamlessly scroll to active DOM targets without dead jumps or repetitive clutter.
  - Optimize route discoverability so students and teachers find their primary destinations in 2 clicks or fewer.

- **Full Craft Prototype Dataset Synchronization**:
  - Synchronize `data/crafts.json` with all prototype articles from `lib/craft-data.ts` (`t-shirt`, `kop`, `mulepose`, `3d-print`, `plakat`).
  - Guarantee that `generateStaticParams()` in `app/craft/[slug]/page.tsx` pre-renders all 5 craft guides during static build.

- **Automated Fallback UI Testing**:
  - Add unit test suite `test/SafeImageBox.test.tsx` verifying:
    - Normal image rendering when URL is provided.
    - Fallback icon and label rendering when image URL is null, empty, or triggers `onError`.
    - Preservation of custom aspect ratio containers and accessibility labels.

- **Accessibility (a11y) & WCAG AA Hardening**:
  - Implement a universal "Gå til hovedindhold" (Skip to main content) link on all pages (`/`, `/makerspace`, `/medialab`, `/katalog`).
  - Add high-contrast keyboard focus indicators (`focus-visible:ring-2 focus-visible:ring-[#009FE3] focus-visible:outline-none`) across all interactive buttons, barcode scanner inputs, and navigation drawers.
  - Audit subheaders, badges, and metadata pills to maintain a minimum 4.5:1 contrast floor against dark backgrounds (`#000000`, `#09090b`, `#151517`).

## Capabilities

### Modified Capabilities
- `seo-and-accessibility`: Adds accessible skip links, semantic landmarks, and high-contrast keyboard focus rings across all public and admin views.
- `craft-item-detail`: Synchronizes local prototype guides dataset in `data/crafts.json` for complete static generation.
- `testing-and-quality-assurance`: Introduces component fallback unit test coverage for `SafeImageBox`.

## Impact

- **Frontend & Navigation**: Zero dead anchors; streamlined persona-specific drawer links; keyboard navigation fully supported with visible focus rings.
- **Data & Static Generation**: All 5 craft prototype pages compile statically during build.
- **Testing**: Automated Vitest suite covers UI fallback components in addition to auth, POS, and validations.
