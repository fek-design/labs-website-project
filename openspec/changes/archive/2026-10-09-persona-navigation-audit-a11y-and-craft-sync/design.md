## Context

See `proposal.md` for motivation. The Zealand Labs website is an offline, zero-cloud platform serving two distinct primary personas:
1. **Student Persona**: Wants to discover available gear, check live workshop status, and follow step-by-step prototyping guides.
2. **Teacher / Staff Persona**: Wants to reserve kits for classes, download machine SOP manuals, and access the administrative POS desk.

With dedicated lab pages for `/makerspace` and `/medialab` now established, the navigation structure requires a persona audit to eliminate redundant routes, synchronize all craft guide data in `data/crafts.json`, add UI component fallback test coverage (`SafeImageBox.test.tsx`), and enforce WCAG AA accessibility standards.

## Goals / Non-Goals

**Goals:**
- Align all navigation elements (drawer, footer, campus explorer) strictly with the persona paths in `docs/SITEMAP.md`.
- Ensure all 5 craft prototype guides (`t-shirt`, `kop`, `mulepose`, `3d-print`, `plakat`) are populated in `data/crafts.json` and pre-rendered statically during build.
- Implement an automated unit test suite in `test/SafeImageBox.test.tsx` validating image fallback behavior.
- Ensure 100% keyboard accessibility with a universal "Skip to main content" link and high-contrast cyan (`#009FE3`) focus rings.

**Non-Goals:**
- Creating student login systems (mandate: Zero student accounts, admins only).
- Introducing third-party accessibility toolbars or widgets.

## Decisions

### Decision 1: Persona-Driven Drawer & Footer Organization
- **Choice:** Organize the hamburger navigation drawer and 4-column footer into explicit persona sections:
  - "Studerende & Værksteder": Links to `/katalog`, `/makerspace`, `/medialab`, and craft guides (`#prototypes`).
  - "Underviser & Personale": Links to `/admin`, `/admin/pos`, and SOP manual documentation.
- **Rationale:** Prevents student confusion by cleanly separating public discovery tools from staff administrative desks.

### Decision 2: Complete Static Craft Articles Dataset
- **Choice:** Synchronize `data/crafts.json` with the full dataset defined in `lib/craft-data.ts`.
- **Rationale:** Ensures Next.js App Router `generateStaticParams()` pre-renders `/craft/t-shirt`, `/craft/kop`, `/craft/mulepose`, `/craft/3d-print`, and `/craft/plakat` during static build without missing route fallbacks.

### Decision 3: Root Layout Accessible Skip Link
- **Choice:** Add `<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[999] bg-[#009FE3] text-black font-bold font-headline px-4 py-2 shadow-2xl focus:outline-none focus:ring-2 focus:ring-white">Gå til hovedindhold</a>` in `app/layout.tsx`.
- **Rationale:** Allows screen-reader and keyboard-only users to bypass repeated top navigation headers and immediately access page content.

### Decision 4: Fallback Testing Harness for `SafeImageBox`
- **Choice:** Use `@testing-library/react` and Vitest in `test/SafeImageBox.test.tsx` to simulate:
  1. Valid image source rendering `next/image`.
  2. Missing source rendering tactile placeholder icon and label.
  3. `onError` dispatch triggering instant fallback without throwing React rendering errors.
- **Rationale:** Guarantees regression protection for catalogue cards and lab views when assets are missing on fresh local deployments.

## Risks / Trade-offs

- **[Risk]** Skip link target element `#main-content` missing on certain subpages.  
  → **Mitigation:** Ensure `<main id="main-content">` is present across `/`, `/katalog`, `/makerspace`, `/medialab`, `/craft/[slug]`, and `/admin`.
- **[Risk]** Focus rings clashing with dark mode aesthetic.  
  → **Mitigation:** Use `focus-visible:ring-2 focus-visible:ring-[#009FE3] focus-visible:outline-none`, which matches the brand cyan accent and meets the 4.5:1 WCAG AA contrast ratio against black surfaces.
