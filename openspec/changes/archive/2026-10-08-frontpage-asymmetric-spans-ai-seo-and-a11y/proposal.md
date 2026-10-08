## Why

The Zealand Labs public portal requires structural polish to align with human attention spans, universal burger navigation across all viewports, clean hyperlink hygiene without dead links, AI-first semantic search engine discoverability, and accessibility (WCAG AA). 

Currently, desktop users have differing topnav layouts, some footer links lack corresponding targets, and reading spans on the frontpage stretch across wide lines rather than utilizing asymmetrical grid allocations where visual cards carry the cognitive weight. Additionally, AI crawlers and assistive technologies lack rich JSON-LD HowTo schemas and skip navigation links.

## What Changes

1. **Top Navigation Overhaul (`LandingHeader.tsx`)**:
   - Remove the desktop quicklaunch "Katalog" CTA button.
   - Unify navigation across **all viewports** so that both desktop and mobile use the brand logo, campus location badge (`KØGE CAMPUS`), and the sleek hamburger menu drawer.
2. **Navigation & Footer Link Hygiene (`LandingFooter.tsx` & `LandingHeader.tsx`)**:
   - Audit and remove all hyperlinks that lead to blank pages or unrouted placeholders.
   - Remove the "is currently open" status pill from the footer.
   - Remove the copyright notice from the bottom of the footer.
   - Retain only verified, functional routes (`/katalog`, `/craft/t-shirt`, `#showcase`, `#machines`, `#support-pillars`, `/admin`).
3. **Asymmetrical Span Allocations (`CampusLabExplorer.tsx`)**:
   - Refactor the Prototyping & Understøttelse lab explorer into an asymmetrical 12-column layout (8-12-16 responsive grid structure, divisible by 8).
   - Allocate 5 columns to tight, high-retention text narrative & step tabs, and 7 columns to the high-impact CMYK graphical spotlight card.
   - Respect scaled vs. stacked behavior: single-column vertical stack on mobile (`grid-cols-1`), scaled 5-col / 7-col asymmetric pairing on desktop (`lg:grid-cols-12`).
4. **AI-First Semantic SEO & Crawler Guardrails**:
   - Implement `HowTo` / `TechArticle` structured JSON-LD schemas in `lib/schema.ts` and inject into `app/craft/[slug]/page.tsx`.
   - Create `app/robots.ts` to allow public crawling (`/`, `/katalog`, `/craft/*`) while explicitly disallowing private administrative panels (`/admin/*`, `/api/*`).
   - Sanitize `app/sitemap.ts` to exclude private administrative routes (`/admin`, `/admin/pos`).
5. **Accessibility (Respect Disabilities) & Payload Optimization**:
   - Implement a visible "Skip to main content" keyboard link pointing to `<main id="main-content">`.
   - Enable AVIF and WebP image generation and gzip/brotli compression in `next.config.ts`.

## Capabilities

### New Capabilities
- `seo-and-accessibility`: Structured JSON-LD HowTo schemas, robots.txt crawler boundaries, skip-to-content links, and next.config.ts image payload compression.

### Modified Capabilities
- `public-landing-portal`: Universal hamburger topnav, clean footer links without dead ends or status pills, and 5-col/7-col asymmetrical span allocation on the frontpage.

## Impact

- **Affected Components**:
  - `components/landing/LandingHeader.tsx` (universal hamburger menu, location badge)
  - `components/landing/LandingFooter.tsx` (remove status pill, remove copyright, prune blank links)
  - `components/landing/CampusLabExplorer.tsx` (5-col text / 7-col visual spotlight asymmetrical grid)
  - `app/layout.tsx` (skip-to-content accessibility link)
  - `app/page.tsx`, `app/katalog/page.tsx`, `app/craft/[slug]/page.tsx` (`id="main-content"`)
  - `lib/schema.ts` & `app/craft/[slug]/page.tsx` (`HowTo` JSON-LD schema)
  - `app/robots.ts` (new crawler directives)
  - `app/sitemap.ts` (exclude `/admin`)
  - `next.config.ts` (AVIF/WebP image formats & compression)
