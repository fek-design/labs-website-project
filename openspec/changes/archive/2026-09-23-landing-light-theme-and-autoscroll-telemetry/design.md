## Context

The Zealand Labs landing page currently renders entirely on dark floor (`#000000`). The user requested to transition the visual hierarchy starting from *Prototyping & Understøttelse* downward into a crisp white background (`#FFFFFF`), while retaining the dark branding for the upper Hero and Header. Additionally, the machine list must be constrained to ~3 cards in height and auto-scrolled vertically with content clipping (not a scrollable element), the vector pixel transition must be paused, and each lab must be assigned a distinct CMYK color.

## Goals / Non-Goals

**Goals:**
- Provide clear visual contrast between the dark Hero section and the white lower sections (*Prototyping & Understøttelse*, *Hotspot Showcase*, *Machine Telemetry*, and *Footer*).
- Define reusable semantic color tokens for both dark and light section contexts.
- Constrain the machine telemetry list to a fixed viewport of ~3 cards with `overflow-hidden` (zero browser scrollbars) and continuous, smooth CSS vertical translation that pauses on hover.
- Bind authentic CMYK accent colors to laboratories (Makerspace = Cyan `#009FE3`, Medialab = Magenta/Pink `#E6007E`, Dimselab = Yellow `#FFED00`).
- Remove the temporary SVG pixel transition to ensure a clean visual boundary.

**Non-Goals:**
- Alter the staff admin dashboard (`/admin`) or POS register (`/admin/pos`).
- Remove any database machine telemetry data.
- Modify the global NextAuth security posture.

## Decisions

### 1. Vertical Dual-Track Ticker for Machine Telemetry
- **Choice**: Implement a continuous CSS keyframe translation (`@keyframes telemetry-autoscroll`) with two identical lists of machines rendered vertically in a container fixed to `h-[270px]` with `overflow: hidden`.
- **Rationale**: Keeps the layout stable on both mobile and desktop without pushing the footer down. Eliminates native browser and mobile scrollbars, satisfying the user's explicit mandate: "autoscrolling with content clipping so not a scrollable element".
- **Interaction**: Add `hover:[animation-play-state:paused]` so technicians or visitors can inspect machine cards without feeling rushed.
- **Alternative Considered**: JavaScript `setInterval` or physics ticker. Rejected in favor of GPU-accelerated CSS translation with `will-change: transform` to maximize battery and frame-rate performance.

### 2. Semantic Theme Inversion Architecture
- **Choice**: Structure the landing page into explicit thematic wrappers:
  - Upper Zone (Header, Hero): `theme-dark` (`bg-black`, `text-white`).
  - Lower Zone (Prototyping, Hotspot, Machines, Footer): `theme-light` (`bg-white`, `text-zinc-900`, `bg-zinc-50` cards, `border-zinc-200`).
- **Rationale**: Prevents inline ad-hoc color overrides by defining clean contrast pairs for cards, pills, typography, and badges.

### 3. CMYK Lab Identity Map
- **Choice**: Define a centralized `LAB_CMYK_TOKENS` dictionary in `CampusContext.tsx`:
  - `makerspace`: `#009FE3` (Cyan)
  - `medialab`: `#E6007E` (Magenta / Brand Pink)
  - `dimselab`: `#FFED00` (Yellow)
- **Rationale**: Guarantees consistency across campus switches: Roskilde displays all three CMYK accents, whereas Køge displays Cyan and Magenta.

### 4. Halting Pixel Transition
- **Choice**: Remove the SVG pixel transition node from `HotspotShowcase.tsx` and allow a clean boundary.
- **Rationale**: The vector dithering transition was requested to be halted while the white background transition is established.

## Risks / Trade-offs

- **[Risk] Contrast readability on light backgrounds** → Ensure text colors use high-contrast `#09090b` and `#18181b` for headlines, and `#71717a` for subtext with a minimum 4.5:1 contrast ratio.
- **[Risk] Machine list with fewer than 3 items** → If fewer than 3 items exist, pad or duplicate tracks gracefully so the auto-scroll remains continuous without visual snapping.
