## Context

The Zealand Labs web portal currently features several full-width text layouts on the landing page and catalogue index that span up to 1200px across large desktop viewports. Reading long lines of text across wide monitors exceeds the optimal human line length (45–65 characters), causing visual fatigue. Furthermore, while the visual aesthetics are modern and dark, public pages lack machine-readable Schema.org metadata for AI search crawlers, key accessibility enhancements (WCAG AA focus rings, reduced-motion fallbacks, live regions for screen readers) need formalization, and client bundle payloads can be optimized via dynamic code-splitting. Lastly, the database contains testing artifacts (mock loans, dummy patrons, test repairs) that clutter counts.

## Goals / Non-Goals

**Goals:**
- Implement asymmetrical 35/65 and 40/60 grid proportions across editorial landing blocks and catalogue cards, bounding text copy to 45–65 characters (`max-w-prose`) while expanding interactive visual elements.
- Inject valid Schema.org JSON-LD (`EducationalOrganization`, `CreativeWork`, `Hardware`, `Course`) for AI-first discoverability.
- Enforce WCAG 2.2 AA compliance: visible keyboard focus rings (`focus-visible:ring-2 focus-visible:ring-[#FFED00]`), screen reader announcements via `aria-live="polite"`, and `prefers-reduced-motion` compliance.
- Optimize client bundle size through dynamic imports (`next/dynamic`) for heavy interactive modals.
- Create an automated database test data purge script (`prisma/clean-test-data.ts`) and clean up `prisma/seed.ts` to leave only pristine production baseline records.

**Non-Goals:**
- Rebuilding the core database ORM architecture (MariaDB remains the primary engine).
- Changing administrative authentication routes (covered in a separate security phase).
- Removing existing craft articles or core fabrication equipment documentation.

## Decisions

### 1. Asymmetrical Editorial Layouts (40/60 & 35/65 Spans)
- **Decision**: On viewports `>= 1024px` (`lg` and `xl`), restructure landing blocks (`HeroSection`, `MachineTelemetrySection`, prototyping blocks) so that textual copy is constrained to a compact left column (`w-full lg:w-5/12 max-w-prose`) while interactive media, telemetry gauges, and visual cards take the wider column (`w-full lg:w-7/12`).
- **Rationale**: Humans scan headings and bulleted summaries quickly; wide paragraphs slow down reading speed. Giving the visual canvas the lion's share of screen space allows equipment cards, live status tickers, and project imagery to perform the heavy visual lifting.
- **Alternatives Considered**: 50/50 symmetrical split (feels generic and doesn't provide enough breathing room for large equipment telemetry).

### 2. Schema.org JSON-LD for AI Search & Agent Indexing
- **Decision**: Render static JSON-LD script tags inside Next.js layout/page components (`app/layout.tsx`, `app/page.tsx`, `app/katalog/page.tsx`).
  - Organization schema: `EducationalOrganization` with Zealand Labs branding, Køge address, and lab divisions.
  - Catalogue schema: `@graph` listing available equipment categories and prototype projects.
- **Rationale**: AI search agents (ChatGPT, Perplexity, Gemini, local agents) and semantic web crawlers rely heavily on structured microdata to extract concrete lab capabilities without parsing unpredictable DOM structures.
- **Alternatives Considered**: Microdata HTML attributes on elements (harder to maintain and clutters JSX templates).

### 3. Accessibility & Motion Ergonomics (WCAG 2.2 AA)
- **Decision**:
  - Global focus style: Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFED00] focus-visible:ring-offset-2 focus-visible:ring-offset-black` to all interactive components.
  - Screen reader region: Add `<div aria-live="polite" className="sr-only">` to announce search query match counts and filter updates on `/katalog`.
  - Motion tokens: Use CSS `@media (prefers-reduced-motion: reduce)` and Framer Motion's `useReducedMotion()` hook to disable infinite marquee translations and high-frequency layout spring physics when reduced motion is preferred.

### 4. Database Test Content Purge Strategy
- **Decision**:
  - Implement `prisma/clean-test-data.ts` runnable via `npm run db:clean`.
  - The script executes in a transaction: deletes all `Loan` records where patron is a mock/test user, deletes dummy `RepairLog` entries, removes mock patrons, and removes orphan inventory items created during testing.
  - Update `prisma/seed.ts` to exclusively seed authentic Køge campus facilities ("makerspace", "medialab"), authentic taxonomy tags, baseline admin credentials, and real physical equipment items.
- **Rationale**: Testing records accumulate quickly in local development. A dedicated, repeatable cleanup script allows operators to reset the database to a verified baseline at any point without manually writing SQL queries.

## Risks / Trade-offs

- **[Risk]** Visual resizing could compress cards too tightly on medium tablets (768px–1024px).  
  **Mitigation**: Use mobile-first responsive breakpoints (`grid-cols-1 lg:grid-cols-12`) so tablets stack cleanly before adopting the asymmetrical 5/7 desktop column split.
- **[Risk]** Dynamic imports with `next/dynamic` can cause layout shift if skeletons are not provided.  
  **Mitigation**: Provide lightweight fallback skeletons matching exact component dimensions.
- **[Risk]** Database cleanup script might accidentally delete real equipment if criteria are too broad.  
  **Mitigation**: The cleanup script strictly filters by known test patron student IDs (`TEST-*`, `DEMO-*`) and mock equipment prefixes, leaving verified assets untouched.
