# Tasks: Sidebar Overlay, Hotspots Click Interaction, and Catalogue CTA Refinements

## 1. Admin Sidebar Overlay Architecture

- [x] 1.1 In `app/admin/pos/AdminConsoleClient.tsx`, lock the root container padding to `pl-20` regardless of `isExpanded` state to prevent console layout reflow.
- [x] 1.2 In `components/admin/AdminSidebarNav.tsx` (or `AdminConsoleClient.tsx`), render an overlay backdrop scrim at `z-40` when expanded that dismisses the drawer on click.
- [x] 1.3 Ensure `<aside>` in `components/admin/AdminSidebarNav.tsx` floats as an elevated overlay (`z-50`) with `shadow-2xl shadow-black/80` and `w-64` when expanded.

## 2. Spotify-Style Header & Brand Alignment

- [x] 2.1 Remove the yellow "ZL" badge button from the sidebar header in `components/admin/AdminSidebarNav.tsx`.
- [x] 2.2 Implement a Spotify-desktop-style expand trigger button in compact mode that displays a menu/sidebar icon in rest state and reveals an expand chevron on hover.
- [x] 2.3 Style the expanded header with "ZEALAND LABS" in `font-notch font-bold tracking-tight text-white` matching the front page header, with a collapse button (`CaretLeft`).
- [x] 2.4 Synchronize `LAB_OPTIONS` in `components/admin/AdminSidebarNav.tsx` with front page tokens: Makerspace (Cyan `#009FE3`), Medialab (Magenta `#E6007E`), and Dimselab (Yellow `#FFED00`).

## 3. Hotspot Showcase Click-Only Interaction

- [x] 3.1 In `components/landing/HotspotShowcase.tsx`, remove the `onMouseEnter` event listener from `HotspotBeacon` so beacons only activate via explicit `onClick` / touch.
- [x] 3.2 Add outside-click or backdrop dismiss handling to allow users to easily close open hotspot popover cards.

## 4. Front Page Catalogue CTA Card Refinements

- [x] 4.1 In `components/landing/PrototypeCarousel.tsx`, update the terminal card header to display "Udforsk hele kataloget" prominently at the top, swapping out "KATALOG".
- [x] 4.2 Remove the redundant subtext paragraph (`Se alle prototyper, maskiner og udstyr`) from the catalogue card.
- [x] 4.3 Verify the streamlined card layout, high-contrast terminal styling, and hover arrow transitions.

## 5. Verification & Visual QA

- [x] 5.1 Test `/admin` sidebar toggle: ensure the expanded drawer overlays without pushing the POS table, stats, or header.
- [x] 5.2 Test the Spotify-style menu/expand icon hover transition and verify the expanded "ZEALAND LABS" branding and lab color dots.
- [x] 5.3 Test `/` landing page: confirm hotspots do not open on hover and require clicking, and confirm the streamlined catalogue card displays cleanly without subtext bloat.
