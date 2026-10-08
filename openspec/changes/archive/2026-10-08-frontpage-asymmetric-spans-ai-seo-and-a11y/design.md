## Context

See `proposal.md` for motivation. The Zealand Labs web application requires responsive layout uniformity (universal hamburger topnav, clean footer without blank links or status pill/copyright, 8-12-16 asymmetrical grid layout), complete cross-device reliability (preventing broken click events and database mutations when accessed over local network IPs), dedicated laboratory portal routes (`/makerspace` and `/medialab`), and resolution of local Playwright test runner issues.

## Goals / Non-Goals

**Goals:**
- Provide uniform top navigation across mobile, tablet, and desktop: `LABS` brand on left, `KØGE CAMPUS` badge + universal hamburger trigger on right.
- Prune all dead/blank links in `LandingFooter.tsx` and eliminate the open status pill and copyright notice.
- Implement 8-12-16 asymmetrical grid spans (5-col text narrative / 7-col spotlight card) in `CampusLabExplorer.tsx`.
- Fix cross-device click events by removing client-side hydration mismatches in `FirstTimeCampusGate.tsx` and `CampusContext.tsx`.
- Enable cross-device database actions over local network IP by configuring Server Action allowed origins in `next.config.ts`.
- Reintroduce dedicated laboratory portal routes: `app/makerspace/page.tsx` and `app/medialab/page.tsx`.
- Configure Playwright browser automation to use local Chromium binaries without external CDN download crashes.

**Non-Goals:**
- Changing database schema or admin authentication logic.
- Adding third-party cloud dependencies (strict Zero-Cloud mandate maintained).

## Decisions

### Decision 1: Hydration Mismatch Defense for Cross-Device Interactivity
- **Rationale**: When React hydrates on a mobile device or secondary browser, any discrepancy between server-rendered HTML and client state (e.g. synchronously reading `localStorage` in `useState` initializers) causes React to cancel event delegation or throw hydration warnings, resulting in non-responsive click events.
- **Solution**: All client state relying on browser-specific storage or viewport measurement starts with static canonical values and updates strictly within `useEffect` after mount.

### Decision 2: Next.js Server Action Allowed Origins for Local Area Network
- **Rationale**: Next.js App Router enforces strict Host-Origin matching for Server Actions. When a student or educator accesses `http://192.168.1.50:3000` from their phone, Server Action requests (such as catalogue filters or inventory queries) are rejected with 403 unless the LAN origin is explicitly permitted.
- **Solution**: Configure `experimental: { serverActions: { allowedOrigins: ['localhost:3000', '127.0.0.1:3000', '192.168.*', '10.*'] } }` in `next.config.ts`.

### Decision 3: Dedicated Lab Portal Routes (`/makerspace` & `/medialab`)
- **Rationale**: Users frequently want to explore specific lab capabilities, safety requirements, and available machinery without opening the admin console or generic catalogue.
- **Solution**: Implement dedicated pages under `app/makerspace/page.tsx` and `app/medialab/page.tsx` displaying lab-specific equipment lists, opening hours, safety SOPs, and craft links.

### Decision 4: Playwright Driver Fix
- **Rationale**: Automated browser testing subagents and scripts failed due to Azure CDN 404 errors when downloading Mac ARM64 driver binaries.
- **Solution**: Configure Playwright to use system-installed Chromium (`/Applications/Google Chrome.app` or local browser channel) and supply fallback execution scripts.

## Risks / Trade-offs

- [Permitting LAN origins in Server Actions] → Mitigated by restricting wildcards to RFC 1918 private IPv4 subnets (`192.168.*`, `10.*`).
- [New lab routes increase route count] → Mitigated by leveraging existing components and static generation (`generateStaticParams`).
