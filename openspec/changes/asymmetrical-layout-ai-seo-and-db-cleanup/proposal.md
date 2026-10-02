## Why

As Zealand Labs transitions out of the MVP and testing phase, public and administrative interfaces need to be optimized for human cognitive ergonomics, modern AI indexability, and clean production data. Reading wide 1200px+ lines of text causes visual fatigue; layouts must shift to asymmetrical span allocations where tight text blocks guide the eye while rich graphical and interactive elements do the heavy lifting. Simultaneously, the platform must be machine-discoverable through AI-first structured data (JSON-LD) while strictly adhering to WCAG 2.2 AA accessibility standards for operators and students with disabilities. Lastly, the local database accumulated test records during development that must be purged to establish a clean production baseline.

## What Changes

- **Asymmetrical Span Allocations**: Redesign wide text grids across the landing portal and catalogue into 35/65 and 40/60 asymmetrical allocations. Reading measures are restricted to comfortable 45–65 character widths (`max-w-prose`), allowing rich interactive equipment canvases, dynamic metric telemetry, and visual showcase cards to dominate the remaining visual space.
- **AI-First Structured Data (JSON-LD)**: Inject Schema.org graph definitions (`EducationalOrganization`, `Equipment`, `Course`, `CreativeWork`) into public layouts (`/` and `/katalog`) so AI agents, local crawlers, and LLM search agents can parse lab capabilities, available fabrication machinery, and guidelines directly.
- **Accessibility & Disability Support (WCAG 2.2 AA)**:
  - Implement high-visibility focus indicators (`focus-visible:ring-2 focus-visible:ring-[#FFED00]`) on all interactive buttons, inputs, and cards.
  - Add `aria-live="polite"` regions for dynamic barcode scans, search counts, and filter updates.
  - Guarantee 4.5:1 minimum text-to-background contrast across dark surface tokens (`#141416`, `#202021`).
  - Honor `prefers-reduced-motion` in all Framer Motion and GSAP animations.
- **Page Payload & Performance Optimization**:
  - Dynamically load heavy client modules (`jsbarcode`, complex modal trees) via `next/dynamic`.
  - Enforce explicit width/height ratios and responsive `sizes` on local images to eliminate Cumulative Layout Shift (CLS < 0.1).
- **Database Test Content Purge & Clean Seeding**:
  - Add a dedicated database cleanup script (`prisma/clean-test-data.ts`) and refresh `prisma/seed.ts` to purge all temporary/test loans, orphan repairs, mock patrons, and placeholder inventory records.
  - Re-seed a pristine operational baseline scoped strictly to active Køge campus facilities (Makerspace & Medialab), authentic taxonomy tags, and real equipment records.

## Capabilities

### Modified Capabilities
- `public-landing-portal`: Integrate asymmetrical editorial span allocations, tighten human reading measures, and embed AI-first JSON-LD metadata.
- `catalogue-index-and-filters`: Redesign catalogue grid for accessible keyboard navigation, reduced payload size, and machine-intelligible schema markup.
- `database-setup`: Purge accumulated test/mock database entities and provide a sanitized, production-ready seeding routine.

## Impact

- **Frontend Layouts**: Rebalanced hero, telemetry, and catalogue sections to use tight text columns paired with larger visual modules.
- **SEO & AI**: Enriched `<head>` metadata with Schema.org graph objects and semantic HTML structure.
- **Accessibility**: Full keyboard and screen-reader usability across public and admin interfaces.
- **Database**: Cleans out legacy test records without breaking relational foreign keys or active admin credentials.
