## Context

See `proposal.md` for motivation. On desktop Mac browsers, interactive controls function smoothly even when the viewport is resized to mobile dimensions because requests originate on `localhost`, mouse events fire directly, and hydration assets load without network interface barriers. On physical iOS and Android mobile devices, interactions fail due to:
1. Next.js dev server binding to `localhost` by default, which stalls client chunk loading and Fast Refresh WebSockets over LAN.
2. Mobile WebKit and Chromium touch event synthesis quirks where `user-select: none` (`select-none`) cancels synthetic click dispatch after `touchend`.
3. Default 300ms tap latency and lack of `:active` state touch initialization.

Additionally, borders across the white prototyping zone and dark sections are being refined to adopt IKEA's signature Scandinavian web design language: crisp, minimalist 1px hairline borders (`border-zinc-200` / `#dfdfdf` on white surfaces, `border-white/10` on dark surfaces) with minimal elevation and zero murky drop shadows.

## Goals / Non-Goals

**Goals:**
- Guarantee immediate, responsive touch and click handling across all buttons, dropdowns, drawer toggles, and lab tabs on iOS Safari, iOS Chrome, and Android Chromium.
- Ensure the dev server binds to `0.0.0.0` so physical phones connecting over LAN load all JavaScript chunks and hydration listeners without timeout.
- Remove `select-none` from touch targets to eliminate WebKit/Chromium synthetic click cancellation.
- Add `touch-action: manipulation` across interactive controls to remove the 300ms mobile tap delay.
- Implement IKEA-inspired clean hairline borders on carousel product cards, showcase images, and navigation dropdowns.

**Non-Goals:**
- Redesigning the desktop POS interface (`/admin/pos`).
- Modifying backend database schemas.

## Decisions

### Decision 1: Next.js dev server network interface binding (`0.0.0.0`)
- **Choice**: Update `package.json` to `"dev": "next dev -H 0.0.0.0"`.
- **Rationale**: Next.js binds to `localhost` (127.0.0.1) unless specified. When connecting from iOS or Android phones over Wi-Fi, binding to `0.0.0.0` enables the phone to fetch all JS bundles, WebSockets, and hot-reload assets reliably, ensuring React hydration completes.
- **Alternatives**: Requiring developers to pass CLI flags manually each time, which easily leads to silent LAN connection failures.

### Decision 2: Remove `select-none` from interactive controls
- **Choice**: Remove `select-none` from buttons and links in `LandingHeader.tsx`, `HeroSection.tsx`, `CampusLabExplorer.tsx`, and `HotspotShowcase.tsx`.
- **Rationale**: WebKit (iOS Safari) and Chromium mobile have a documented behavior where `-webkit-user-select: none` on clickable elements can abort synthetic click dispatch following a touch release.
- **Alternatives**: Retaining `select-none` and adding custom touchstart/touchend listener handlers. This introduces unnecessary complexity and potential ghost-click issues.

### Decision 3: Enforce `touch-action: manipulation` and active state listener
- **Choice**: Apply `touch-action: manipulation` in `app/globals.css` base layer for `button`, `a`, and interactive controls, plus `touch-manipulation` Tailwind utility on header and lab tab buttons. Add an empty passive `touchstart` listener on `document` to activate `:active` pseudo-classes on iOS.
- **Rationale**: Disables double-tap-to-zoom on interactive controls, eliminating the default 300ms touch delay and ensuring taps feel instantaneous.
- **Alternatives**: Third-party fast-click libraries, which are deprecated and unnecessary in modern browser engines.

### Decision 4: IKEA-Inspired Scandinavian Hairline Border Architecture
- **Choice**:
  - Replace thick/shadowed borders in `PrototypeCarousel.tsx` with crisp `border border-[#DFDFDF] bg-white` or `bg-[#F8F8F9]` subtle card surfaces.
  - In `HotspotShowcase.tsx`, apply clean 1px hairline borders `border border-zinc-200` with crisp corners and clean contrast.
  - In `LandingHeader.tsx`, ensure the campus dropdown uses crisp 1px borders (`border border-white/12`).
- **Rationale**: IKEA's design system relies on modular grid discipline with clean 1px hairline borders that structure content without visual clutter or heavy drop shadows.
- **Alternatives**: Floating borderless cards with heavy drop shadows, which look dated and lack structural clarity.

## Risks / Trade-offs

- **[Risk] Multiple rapid taps on lab indicator tabs** → Mitigated by fast 200ms `AnimatePresence` transitions with `initial={false}` and stable keys.
- **[Risk] Accidental selection of button label text on long press** → Mitigated by standard mobile button behavior where short taps trigger actions without triggering text selection menus.
