## Context

See `proposal.md` for motivation. Zealand Labs requires top navigation consistency across all viewports (removing the desktop-only Katalog CTA button and employing the universal burger menu trigger alongside the campus badge), strict hyperlink integrity in the footer (no links to unrouted files, no open status pill, no copyright notice), an 8-12-16 asymmetrical grid layout in `CampusLabExplorer.tsx` (5 columns text / 7 columns graphical card), AI-first schema and crawler guardrails, and WCAG AA accessibility skip navigation.

## Goals / Non-Goals

**Goals:**
- Unify `LandingHeader.tsx` so that all viewports (desktop, tablet, mobile) render the `LABS` brand, location badge (`KØGE CAMPUS`), and the hamburger trigger. Remove the desktop quicklaunch CTA button and redundant topnav center anchor links.
- Prune `LandingFooter.tsx`: remove the "is currently open" status pill, remove the copyright notice, and remove links to non-existent files (`/uploads/manuals/...`, `/docs/USER_MANUAL.md`).
- Refactor `CampusLabExplorer.tsx` to follow an 8-12-16 grid structure divisible by 8: stacked on mobile (`grid-cols-1 gap-8`), scaled on desktop (`lg:grid-cols-12 gap-8`) with 5-column left narrative and 7-column right spotlight card.
- Inject Schema.org `HowTo` structured data into `app/craft/[slug]/page.tsx` via `lib/schema.ts`.
- Implement `app/robots.ts` to allow public discovery routes while disallowing private `/admin/` and `/api/` paths.
- Sanitize `app/sitemap.ts` to exclude private administrative paths (`/admin`, `/admin/pos`).
- Provide keyboard skip link in `app/layout.tsx` targeting `<main id="main-content">` and ensure all landing/content pages contain `id="main-content"`.
- Configure `next.config.ts` for AVIF/WebP image generation and gzip/brotli compression.

**Non-Goals:**
- Modifying POS backend business logic or database schema.
- Changing admin dashboard layout or authentication authorization gates.

## Decisions

### Decision 1: Universal Hamburger Navigation Trigger
- **Rationale**: The user explicitly requested removing the quicklaunch Katalog button from the top navigation and using a hamburger menu regardless of viewport. Having a uniform header (`LABS` + `KØGE CAMPUS` + Hamburger button) across mobile, tablet, and desktop creates a minimalist, consistent aesthetic, leaving editorial space uncluttered while offering rich navigation inside the slide-down drawer.
- **Alternatives Considered**: Retaining desktop horizontal center links and only removing the Katalog button. Rejected because the requirement explicitly specifies: "no matter the viewport have a burger menu".

### Decision 2: Elimination of Phantom Footer Links & Visual Clutter
- **Rationale**: Linking to markdown documentation (`USER_MANUAL.md`) or non-existent static SOP files directly from public navigation leads to 404s and broken user journeys. Pruning these dead links maintains a 100% functional link tree. Furthermore, removing the "is currently open" status pill and copyright notice satisfies direct user aesthetic and operational requirements.
- **Alternatives Considered**: Keeping empty anchor tags (`#`). Rejected because dead `#` links confuse screen readers and visitors.

### Decision 3: 8-12-16 Asymmetrical Span Layout (5-col / 7-col)
- **Rationale**: An asymmetrical 12-column grid (`lg:grid-cols-12`) with 5 columns for text copy and 7 columns for the graphical spotlight card optimizes human eye span (avoiding lines longer than 65 characters) while providing prominent visual weight to the CMYK color-coded lab spotlight. The mobile layout stacks vertically (`grid-cols-1`) with 32px (`gap-8`) rhythm.
- **Alternatives Considered**: 6-col / 6-col symmetrical split. Rejected because symmetrical text stretches too wide or leaves visual cards under-emphasized.

### Decision 4: AI-First JSON-LD and Crawler Control
- **Rationale**: Generating `HowTo` structured schema in `lib/schema.ts` allows search engines and generative AI agents to parse equipment, materials, and step-by-step instructions. Creating `app/robots.ts` and removing `/admin` routes from `app/sitemap.ts` prevents AI crawlers from wasting crawl budget on private staff portals.
- **Alternatives Considered**: Static robots.txt in `public/`. Rejected because Next.js App Router dynamic `robots.ts` ensures environment-aware base URLs.

## Risks / Trade-offs

- [Desktop users must click hamburger button to access section anchors] → Mitigated by smooth opening animations and direct links inside the drawer, plus prominent in-page CTAs throughout the editorial scroll.
- [External links to sitemap could cache old admin routes] → Mitigated by Next.js revalidating dynamic sitemap routes immediately on deployment.
