## Purpose

Provides AI-first semantic search engine discoverability through structured JSON-LD schemas and crawler boundaries, while ensuring WCAG AA accessibility compliance and optimized asset delivery payloads.

## ADDED Requirements

### Requirement: Structured HowTo JSON-LD Schema for Craft Guides
The system SHALL embed Schema.org `HowTo` structured data into every craft article route (`/craft/[slug]`) describing the prototyping project, required materials, step-by-step instructions, and machinery used.

#### Scenario: AI crawler inspects craft guide page
- **WHEN** a search engine crawler or AI agent inspects `/craft/[slug]`
- **THEN** the DOM contains a `<script type="application/ld+json">` block containing valid `@type: "HowTo"` schema with project steps, supply lists, and tool requirements.

### Requirement: Search Crawler Directives via Robots Configuration
The system SHALL provide a machine-readable `robots.txt` configuration via Next.js metadata route (`app/robots.ts`) that grants public access to public discovery routes while strictly disallowing private administrative and API endpoints.

#### Scenario: Crawler inspects robots.txt
- **WHEN** an automated user-agent requests `/robots.txt`
- **THEN** the system returns directives allowing `/`, `/katalog`, and `/craft/` while explicitly disallowing `/admin/` and `/api/`, alongside a pointer to `/sitemap.xml`.

### Requirement: Private Admin Exclusion in Sitemap
The system SHALL generate an XML sitemap via `app/sitemap.ts` that includes all public routes (`/`, `/katalog`, `/craft/[slug]`) while strictly omitting any private administrative routes (`/admin`, `/admin/pos`).

#### Scenario: Inspecting sitemap entries
- **WHEN** a crawler requests `/sitemap.xml`
- **THEN** the generated sitemap lists the homepage, catalogue, and craft prototype guides, with zero administrative or staff URLs present.

### Requirement: Keyboard Skip to Main Content Link
The system SHALL provide a high-visibility keyboard "Skip to main content" link at the very top of the root layout (`app/layout.tsx`) that becomes visible upon receiving keyboard focus and moves user focus directly to the `<main id="main-content">` element.

#### Scenario: Keyboard user presses Tab on page load
- **WHEN** a user begins navigating any page with the `Tab` key
- **THEN** the skip link becomes immediately visible with high contrast focus styling, and activating it scrolls and shifts DOM focus to `#main-content`.

### Requirement: Optimized Image Formats and Payload Compression
The system SHALL configure Next.js image optimization and server compression in `next.config.ts` to support modern AVIF and WebP formats with gzip/brotli compression enabled.

#### Scenario: Serving image assets to modern browsers
- **WHEN** a browser requesting modern image formats loads media assets
- **THEN** the Next.js image optimization pipeline serves AVIF or WebP variants to reduce wire payload size and accelerate First Contentful Paint.
