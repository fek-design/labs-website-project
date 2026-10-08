## Context

The current public interface features a top bar with a hamburger drawer on the homepage, while `/katalog` and `/craft/[slug]` use bespoke or minimal header/footer treatments. Users need a persistent, intuitive desktop navigation bar with active section indicator states, along with cross-page anchor routing so that clicking "Showcase" or "Maskiner" from the catalogue cleanly navigates back to the relevant section on `/`. Furthermore, the footer must evolve from a simple 2-column strip into a standard 4-column utility belt across all public pages.

## Goals / Non-Goals

**Goals:**
- Implement a sticky top navigation bar on desktop with:
  - Left: `LABS` brand logo (scrolls to top / routes to `/`).
  - Center: `Showcase` (`/#showcase`), `Maskiner` (`/#machines`), `Guides` (`/craft` / craft guides) with real-time scroll spy.
  - Right: Prominent `Katalog` CTA button (`/katalog`, styled with high-priority accent).
- Provide seamless cross-page anchor routing: smooth-scroll on `/`, and Next.js `router.push('/#' + target)` when clicked from `/katalog` or `/craft/*`.
- Transform `LandingFooter` into a 4-column responsive utility belt grid mounted across all public pages (`/`, `/katalog`, `/craft/[slug]`):
  - Col 1: Zealand Labs location, opening hours, live lab status indicator.
  - Col 2: Udforsk (Udstyrskatalog, Craft Guides, Prototype Galleri).
  - Col 3: Support & Pillars (Makerspace Retningslinjer, Medialab Retningslinjer, Kontakt / Hjælp).
  - Col 4: Personale Gateway (Underviser Login trigger, Admin Dashboard link requiring auth).

**Non-Goals:**
- Modifying administrative dashboard navigation (`/admin/*`).
- Overhauling database schemas or authentication backend.

## Decisions

### Decision 1: Scroll Spy Implementation (GSAP / IntersectionObserver)
- **Choice:** Use a lightweight `IntersectionObserver` or scroll-position listener in `LandingHeader` tracking IDs `prototypes`, `showcase`, `support-pillars`, and `machines`.
- **Rationale:** High-performance, zero jank, updates the active link styling with subtle accent indicators and smooth micro-transitions.
- **Alternatives Considered:** Heavy window scroll polling (higher CPU overhead on mobile).

### Decision 2: Cross-Page Anchor Routing
- **Choice:** Create a navigation helper in `LandingHeader`:
  - When `pathname === "/"`: intercept click, `e.preventDefault()`, and call `document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })`.
  - When `pathname !== "/"`: route via `router.push('/' + target)`.
- **Rationale:** Guarantees standard Next.js client-side navigation without full-page reloads, landing directly on the desired section.

### Decision 3: 4-Column Utility Belt Footer Architecture
- **Choice:** Restructure `components/landing/LandingFooter.tsx` into a 4-column responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto`):
  - **Col 1:** Physical campus location ("Lyngvej 21, 4600 Køge"), Opening hours ("Hverdage 08:30 – 16:00"), and live status pill (`Makerspace: Åben` with glowing emerald dot).
  - **Col 2:** Udforsk (`/katalog`, `/craft/t-shirt`, `/#prototypes`).
  - **Col 3:** Support & Pillars (`/#support-pillars`, Medialab retningslinjer, Kontakt link).
  - **Col 4:** Personale Gateway (Staff login trigger `/admin/login` or AuthGate trigger, Admin Dashboard `/admin`).
- **Mounting:** Ensure the footer is rendered globally on `/`, `/katalog`, and `/craft/[slug]`.

## Risks / Trade-offs

- **[Hash target timing on cross-page push]** → Next.js router push to `/#[hash]` might render before the target DOM node mounts. *Mitigation:* Next.js App Router handles hash scrolling on page load; add an effect in `page.tsx` that checks `window.location.hash` and smoothly scrolls once components are mounted.
- **[Mobile viewport density with 4 columns]** → 4 columns can crowd narrow screens. *Mitigation:* Stack into `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` with accordion or clean spacing rhythm.
