# Technical Design: Sidebar Overlay, Hotspot Click Interaction, and Catalogue CTA Refinements

## Context
See `proposal.md` for motivation. Currently, the admin console layout dynamically shifts page margin and padding when the operator toggles the expandable sidebar (`pl-64` vs `pl-20`), disrupting visual focus on operational data grids. The sidebar header contains a redundant yellow "ZL" badge and a basic chevron rather than an integrated Spotify-style toggle control. On the public landing portal, hover-triggered hotspot beacons fire unexpectedly, and the prototype carousel's catalogue card features redundant subtext copy.

## Goals / Non-Goals

**Goals:**
- **Overlay Sidebar**: Render the expanded sidebar drawer as an elevated floating overlay (`z-50`, `w-64`) without modifying base page layout padding (`pl-20`), eliminating horizontal reflow in the admin console.
- **Spotify-Style Expand Trigger**: Provide an integrated header button that displays a sidebar/menu icon in rest state and reveals an expand chevron on hover; expand state reveals high-contrast "ZEALAND LABS" branding using `font-notch`.
- **Synchronized Lab Color Tokens**: Realign `LAB_OPTIONS` in `AdminSidebarNav.tsx` with front page tokens: Makerspace (Cyan `#009FE3`), Medialab (Magenta `#E6007E`), and Dimselab (Yellow `#FFED00`).
- **Click-Only Hotspot Beacons**: Require explicit click/tap activation for hotspot beacons in `HotspotShowcase.tsx` and provide intuitive dismiss behavior.
- **Decluttered Catalogue Navigation Card**: Reorganize the terminal card in `PrototypeCarousel.tsx` to feature "Udforsk hele kataloget" as the top headline and eliminate repetitive subtext.

**Non-Goals:**
- Modifying backend POS APIs, Prisma schemas, or transaction handlers.
- Altering the routing logic of `/admin` or `/katalog`.
- Rewriting the carousel track animations or GSAP scroll triggers.

## Decisions

### Decision 1: Fixed Layout Padding with Floating Elevated Drawer
- **Choice**: Keep `AdminConsoleClient.tsx` root container padding fixed at `pl-20`. Render `<aside>` in `AdminSidebarNav.tsx` with `fixed top-0 left-0 bottom-0 z-50`, animating width between `w-20` and `w-64` with an elevated drop-shadow (`shadow-2xl shadow-black/80`). When expanded, render a lightweight backdrop scrim (`bg-black/40 backdrop-blur-xs`) that dismisses the drawer when clicked outside.
- **Rationale**: Prevents table layout recalculations, column squishing, and scroll position shifts in high-density POS views while providing quick access to deep navigation.
- **Alternatives Considered**: Retaining `transition-[padding]` was rejected because changing the width of large tables during busy lab checkouts degrades UX.

### Decision 2: Spotify-Desktop Expand Control & Brand Notch Header
- **Choice**: Remove the yellow "ZL" badge link. In compact state (`w-20`), render a centered button featuring a dual-icon hover state: a menu/sidebar icon (`SidebarSimple` or `List`) visible by default, which transitions via CSS group-hover to `CaretRight`. In expanded state (`w-64`), display "ZEALAND LABS" in `font-notch` font styling alongside a dedicated collapse button (`CaretLeft`).
- **Rationale**: Replicates the intuitive, industry-standard desktop sidebar behavior made popular by Spotify and modern developer IDEs.
- **Alternatives Considered**: Keeping the "ZL" badge and putting the arrow below it was rejected because it consumes vertical space and clutters the compact dock.

### Decision 3: Lab Color Token Unification
- **Choice**: Update `LAB_OPTIONS` in `AdminSidebarNav.tsx` to match `CampusContext.tsx`:
  - `makerspace`: `#009FE3` (Cyan)
  - `medialab`: `#E6007E` (Magenta)
  - `dimselab`: `#FFED00` (Yellow)
- **Rationale**: Fixes the prior inversion where Makerspace was yellow and Medialab was cyan in the admin sidebar, aligning the system with the CMYK design system.

### Decision 4: Hotspot Explicit Click-to-Inspect
- **Choice**: Remove `onMouseEnter` from `HotspotBeacon`. Interaction is triggered exclusively via `onClick`. Add click-outside dismiss handling so clicking anywhere outside an open beacon cleanly closes the card.
- **Rationale**: Eliminates intrusive popovers when users simply scroll past or move their cursor across photography.

### Decision 5: Catalogue Terminal Card Hierarchy
- **Choice**: In `PrototypeCarousel.tsx`, replace the small "KATALOG" badge with "Udforsk hele kataloget" in `font-notch text-lg sm:text-xl font-bold text-white`, and remove the subtext `<p>Se alle prototyper, maskiner og udstyr</p>`. Retain the bottom link trigger ("Gå til oversigt →") with hover arrow translation.
- **Rationale**: Eliminates redundant nested headers and provides a punchy, clean card that matches the minimalist editorial tone of the rest of the carousel.

## Risks / Trade-offs

- **Risk**: Drawer overlay might obscure top table filters if left open by an operator.
  - **Mitigation**: Add an overlay backdrop scrim that dismisses the drawer on any outside click or Esc keypress.
- **Risk**: Existing users accustomed to hover beacons on desktop might not realize beacons are clickable.
  - **Mitigation**: Ensure the beacon has an active pulsing animation (`animate-ping`) and pointer cursor with clear hover scale feedback (`hover:scale-110`).
