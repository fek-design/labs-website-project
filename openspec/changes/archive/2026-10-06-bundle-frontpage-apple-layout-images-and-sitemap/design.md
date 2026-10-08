## Context

The landing portal currently uses `max-w-7xl` (1280px) across sections, resulting in stretched layouts on large screens. Media cards in `PrototypeCarousel`, `HotspotShowcase`, and `MachineTelemetrySection` directly mount Next.js `<Image />` without comprehensive fallback wrapping, making them vulnerable to missing or broken image assets. The navigation drawer and footer repeat `#support-pillars` anchors and lack explicit routes for Student and Teacher journeys.

## Goals / Non-Goals

**Goals:**
- Transition all landing page container wrappers to Apple.com standard `max-w-5xl` (1024px) with centered layout and generous breathing room.
- Create a reusable, zero-dependency `SafeImageBox` component that renders a stylized placeholder container when `src` is missing or fails to decode.
- Restructure `LandingHeader` and `LandingFooter` to provide clear, dedicated navigation for Student and Teacher personas while removing redundant anchors.

**Non-Goals:**
- Modifying administrative dashboard layouts (`/admin/*`) or inventory schemas.
- Changing GSAP scroll animation triggers or timeline logic.
- Adding third-party image CDN dependencies (maintaining strict local asset offline operation).

## Decisions

### Decision 1: Apple-Style `max-w-5xl` (1024px) Container Architecture
- **Choice:** Standardize all content section containers on `max-w-5xl mx-auto px-4 sm:px-6`. Keep section backgrounds full-width (`w-full`) for contiguous contrast blocks (e.g. black floor, white showcase band, cyan footer).
- **Rationale:** 1024px matches Apple's classic desktop presentation width, preventing long text wrapping (>65 chars) and creating deliberate, high-end editorial focus.
- **Alternatives Considered:** `max-w-6xl` (still slightly too wide on 1440p+ displays); `max-w-4xl` (too cramped for 3-card telemetry and carousel edge bleed).

### Decision 2: Resilient `SafeImageBox` Component
- **Choice:** Implement `components/landing/SafeImageBox.tsx` using React state (`error`, `loaded`) with `onError` interceptor. If `src` is empty, falsy, or fails to load, render a dark tactile placeholder box (`bg-[#18181b] border border-[#262626] flex items-center justify-center`) with a muted Phosphor icon (`Cube` or `Image`) and subtle label.
- **Rationale:** Prevents broken image badges and browser console network 404 warnings while preserving the card's physical dimensions, preventing cumulative layout shift (CLS).
- **Alternatives Considered:** Generic 1x1 transparent SVG (invisible blank hole, feels broken); external placeholder generator (violates zero-cloud mandate).

### Decision 3: Dual-Persona Navigation & Footer Sitemap
- **Choice:**
  - **Landing Drawer:**
    1. *Student Journeys:* Prototypes (`#prototypes`), Projekter & Hotspots (`#showcase`), Udstyr & Maskiner (`/katalog`), Live Maskinstatus (`#machines`), Laboratorier & Guider (`#support-pillars`).
    2. *Staff & Teacher Gateway:* Admin Portal (`/admin`).
  - **Landing Footer:**
    - Reorganize footer links into distinct destinations:
      - `MAKERSPACE` (`#support-pillars`)
      - `MEDIALAB` (`#support-pillars`)
      - `UDSTYRSKATALOG` (`/katalog`)
      - `ADMIN CONSOLE ↗` (`/admin`)
- **Rationale:** Eliminates repeated `#support-pillars` without destination differentiation, surfaces the crucial `/katalog` route, and provides direct paths for both personas.

## Risks / Trade-offs

- **[Narrower Horizontal Space in Telemetry Section]** → The 1024px container narrows the 12-column grid. *Mitigation:* The stat block (`col-span-4`) and clipped vertical telemetry ticker (`col-span-8`) fit comfortably in 1024px; telemetry cards already use compact vertical heights (270px container).
- **[Carousel Mobile Edge Bleed]** → Narrowing container might clip carousel bleed on small screens. *Mitigation:* Preserve negative margin edge bleed (`-mx-4 sm:-mx-6`) on the track wrapper for seamless horizontal touch scrolling on mobile.
