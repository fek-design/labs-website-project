# Proposal: Admin Sidebar Overlay, Hotspot Click Interaction, and Catalogue CTA Refinements

## Why
The administrative sidebar expansion currently pushes workspace content and forces layout repaints on the same Z-level, causing visual disruption when operators expand the navigation drawer. In addition, the sidebar header carries an unnecessary "ZL" badge and a basic caret toggle rather than a streamlined, Spotify-desktop-like expand control, and its lab accent colors are mismatched with the front page. On the public landing portal, hover-activated hotspot beacons trigger inadvertent popovers during casual pointer movement, and the catalogue teaser card in the prototype carousel suffers from redundant subtext copy and inverted hierarchy.

## What Changes
- **Admin Sidebar Overlay Behavior**: Configure the extended admin navigation sidebar (`AdminSidebarNav.tsx`) to behave strictly as an elevated overlay (`z-50`) rather than expanding the layout margin/padding (`pl-64` to `pl-20`) of the admin console page, preserving stable workspace dimensions.
- **Spotify-Style Expand Trigger**: Remove the standalone yellow "ZL" badge logo in the sidebar header; replace the expand arrow with a Spotify-desktop-style menu/sidebar toggle icon that smoothly morphs/transitions into an expand arrow upon hover.
- **Brand & Labs Alignment**: When expanded, render "ZEALAND LABS" using the front page's distinctive typography (`font-notch font-bold tracking-tight text-white`) and align the lab options and colors with the front page tokens (Makerspace Cyan `#009FE3`, Medialab Magenta `#E6007E`, Dimselab Yellow `#FFED00`).
- **Click-Only Hotspot Interaction**: Remove the `onMouseEnter` trigger from `HotspotBeacon` in `HotspotShowcase.tsx` so that inspection cards only open upon intentional click or touch, eliminating accidental hover popups.
- **Catalogue CTA Streamlining**: Declutter the terminal catalogue card in `PrototypeCarousel.tsx` by removing the secondary subtext ("Se alle prototyper, maskiner og udstyr") and moving "Udforsk hele kataloget" to the top position to replace "KATALOG".

## Capabilities

### New Capabilities
*(None)*

### Modified Capabilities
- `admin-direct-pos-and-expandable-navigation`: Update the navigation drawer specification from layout-pushing width adjustments to an elevated overlay interaction, introduce the Spotify-inspired header toggle interaction, and align expanded branding and lab tokens with the landing page design system.
- `public-landing-portal`: Update hotspot activation requirements to be click/tap-only, and refine the prototype carousel catalogue card hierarchy by elevating "Udforsk hele kataloget" to the primary header and stripping subtext copy.

## Impact
- **Affected Components**:
  - `components/admin/AdminSidebarNav.tsx`: Header structure, icon state morphing, and lab token synchronization.
  - `app/admin/pos/AdminConsoleClient.tsx`: Fixed base padding (`pl-20`), overlay backdrop/scrim handling when expanded.
  - `components/landing/HotspotShowcase.tsx`: Beacon interaction handler update to click-only.
  - `components/landing/PrototypeCarousel.tsx`: Catalogue navigation card layout and typography.
- **APIs & State**: No database schema or server-side API changes; purely UI/UX interaction and visual hierarchy refinements.
