## Context

The existing root page (`app/page.tsx`) serves as an internal admin launchpad. Figma frame `144:78` defines a dedicated public-facing landing page design for Zealand Labs. Staff require continued access to the administrative dashboard, so it will be relocated to `app/admin/page.tsx` (`/admin`), while the new public experience is mounted on `/`.

Architectural and design constraints:
- Framework: Next.js 15 (App Router), React 19, Tailwind CSS v4.
- Persistence: Local Prisma ORM (`STATIC_MACHINE` inventory status).
- Motion: `motion/react` for micro-interactions, CSS keyframes for continuous tickers.
- Mandate: Strict "Zero Cloud Dependency" (all assets, fonts, and logic self-hosted locally).
- Mockup vs. UX Engineering Rule: Replicate Figma's visual tokens and spatial hierarchy accurately while engineering interactive states (hotspot tooltips, carousel drag/scroll, hover feedback).

## Goals / Non-Goals

**Goals:**
- Migrate the current admin launchpad code from `app/page.tsx` to `app/admin/page.tsx` so staff access is fully preserved at `/admin`.
- Construct modular landing page components under `components/landing/` adhering to Figma frame `144:78`.
- Ensure responsive visual fidelity from mobile viewport (402px base from Figma) scaling smoothly up to desktop.
- Implement interactive project cards with animated pulse hotspot beacons and popover equipment tags.
- Connect the machine hardware section to active database records via Prisma Server Component queries.
- Store all visual photography and icons locally in `public/images/landing/`.

**Non-Goals:**
- Altering the admin POS `/admin/pos` checkout workflows, user authentication, or loan transactions.
- Modifying the underlying Prisma database schema.

## Decisions

### Decision 1: Relocating Admin Dashboard to `app/admin/page.tsx`
- **Choice**: Move the current `app/page.tsx` implementation directly into `app/admin/page.tsx`, preserving all server data queries (`prisma.inventory.count`, `prisma.loan.count`), bento grid cards, and navigation links.
- **Alternatives Considered**: Discarding the admin launchpad or redirecting `/admin` directly to `/admin/pos`. Rejected because staff rely on the top-level launchpad metrics and navigation.

### Decision 2: Server Root with Modular Client Islands
- **Choice**: Keep `app/page.tsx` as an asynchronous Server Component that queries live machine telemetry (`prisma.inventory.findMany({ where: { hardwareType: "STATIC_MACHINE" } })`), while delegating interactive UI to Client Islands in `components/landing/`.
- **Alternatives Considered**: Making the entire page a Client Component. Rejected because Server Component fetching avoids client-side waterfall fetching and maintains fast initial load.

### Decision 3: Interactive Hotspots via `motion/react`
- **Choice**: Implement `HotspotBeacon` components with an accessible button, relative positioning percentage coordinates, and an animated tooltip pill revealing equipment metadata (e.g. `Print på T-Shirt ↳`).
- **Alternatives Considered**: Static text overlays without interaction. Rejected because the design specifies an interactive hotspot exploration experience.

### Decision 4: Localized Static Assets & Typography
- **Choice**: Save extracted photography and vector icons directly into `public/images/landing/` to honor the Zero Cloud Dependency mandate.
- **Alternatives Considered**: Referencing external S3 or Figma CDN URLs. Rejected due to security and offline campus network constraints.

### Decision 5: CSS Infinite Marquee Ticker
- **Choice**: Use a pure CSS infinite linear translateX marquee ribbon for `DIMSELAB • MAKERSPACE • MEDIALAB •`.
- **Alternatives Considered**: JavaScript scroll-driven ticker. CSS keyframes provide smoother GPU acceleration and lower CPU overhead on mobile devices.

## Risks / Trade-offs

- **[Figma asset resolution vs. file size]** → Extract images at 2x scale and convert to optimized WebP/PNG under `public/images/landing/` to keep page weight fast on local networks.
- **[Font availability for Stack Sans Notch]** → Provide robust font fallback chain (`"Stack Sans Notch", "Inter", sans-serif`) with matching weights and tracking so layout does not shift if local font assets are still resolving.
