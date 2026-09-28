# Technical Design: Admin POS Dashboard Reskin (Figma 79:827)

## Context
See `proposal.md` for motivation. The existing POS implementation (`components/pos/EquipmentPOS.tsx`) functions robustly but suffers from disjointed sub-tabs and fragmented card placements. The new design in Figma frame `Dashboard - Frontpanel` (`node-id=79-827`) provides a cohesive command center with a top header KPI ribbon, an interactive 2-column calendar and date activity panel, a unified full-width barcode search bar, and a dedicated 2-column `Aktiv Session` workspace.

## Goals / Non-Goals

**Goals:**
- **Exact Visual Recreation of Figma 79:827**: Recreate the visual tokens, spacing, typography, and layout from Figma node `79:827`.
- **Top KPI Metric Bar**: Render `LABS Dashboard` with current admin greeting and the three top metrics (*Aktive lån*, *Overskredet Returneringer*, *Ledigt udstyr*).
- **Two-Column Calendar & Activity Feed**: Implement the interactive monthly calendar on the left paired with a dynamic date activity list on the right.
- **Unified Barcode / Search Hub**: Build the full-width search input with barcode icon and mode chips (`AUTO`, `STUDENT`, `UDSTYR`).
- **Split "Aktiv Session" Panel**:
  - Left: Student avatar initial badge, ID (`MFE394`), email, 4-line history counters, and large mode buttons (`UDLEJNING`, `RETUNÉRING`).
  - Right: Scanned gear item list with remove action, rental duration selector with date picker and quick chips (`1+ Uge`, `2+ Uger`, `+1 Måned`), optional comment box, and full-width `GODKEND` checkout button.
- **Zero Logic Breakage**: Preserve existing server actions (`searchPatronOrAsset`, `createOrUpdatePatron`, `checkoutItem`, `returnItem`, `getPosStats`, `getActiveLoans`, `getOverdueLoans`) and local database operations.

**Non-Goals:**
- Altering the Prisma schema or adding cloud services.
- Modifying authentication or non-POS admin tabs (Inventory, Machines, Crafts, Settings).

## Decisions

### Decision 1: Master Dashboard Architecture in `EquipmentPOS.tsx`
- **Choice**: Replace the old fragmented sub-tabs (`FRONT_DESK`, `ACTIVE_LOANS`, `OVERDUE`) with the unified single-page dashboard layout specified in Figma `79:827`.
- **Rationale**: Operators need to see live schedule density, scan incoming gear, and process checkouts simultaneously without context switching across separate tabs.

### Decision 2: Calendar & Contextual Activity Panel
- **Choice**: Structure the upper section as a 12-column or 7/5 flex grid:
  - Left (~60% width): `Kalender` grid with `< MÅNED ÅR >` navigation, filter pills (`ALLE`, `UDLÅNT`, `RETURNERINGER`, `AFLEVERET`), 7-day columns (Man-Søn), and day cells.
  - Right (~40% width): `Aktivitet [Valgt Dato]` showing all active loans or returns for that specific day. Clicking a loan item exposes details and the `Forlæng leje periode +` quick renewal action.
- **Rationale**: Directly reflects the Figma mockup and lets operators review expected returns on any given date with one click.

### Decision 3: Smart Barcode Scanner Bar with Mode Overrides
- **Choice**: Provide a unified input field with barcode iconography. By default, `AUTO` mode uses heuristic regex/prefix matching (e.g. `mfe...` or student email -> Patron; asset tag or barcode -> Equipment). The `STUDENT` and `UDSTYR` pills allow operators to force specific lookup types when needed.
- **Rationale**: Matches the Figma `AUTO / STUDENT / UDSTYR` pill bar while preserving instant barcode gun scanning.

### Decision 4: Split "Aktiv Session" Ergonomics
- **Choice**:
  - Left pane displays the active student's circular initial avatar in brand yellow (`#FFED00`), student code, email, loan counters (*Aktive lån*, *Overskredet*, *Tidligere lån*, *Oprettet*), and large `UDLEJNING` (active yellow) vs `RETUNÉRING` mode toggles.
  - Right pane displays scanned equipment items with thumbnail/camera icon, tag, and remove `[x]` button; rental period selection defaulting to 30 days with quick chips (`1+ Uge`, `2+ Uger`, `+1 Måned`); optional note field; and full-width `GODKEND` confirmation button.
- **Rationale**: Eliminates scrolling during checkout transactions and provides immediate visual feedback for both student and gear.

### Decision 5: Design Tokens & Geometry
- **Colors**: Floor background `#0e0d0f`, surface cards `#141416`, hairlines `#262626` / `border-white/10`, yellow accent `#FFED00` / `#FFD600`.
- **Typography**: `font-notch` for `LABS` headline and large numbers (`text-3xl` / `text-4xl`), monospace font for codes, asset tags, and status chips.

## Risks / Trade-offs

- **Risk**: Screen width constraints on smaller desktop displays (e.g. 13" laptop at 1280px).
  - **Mitigation**: Use responsive grid layouts (`grid grid-cols-1 xl:grid-cols-12`) so the Calendar/Activity and Aktiv Session columns stack cleanly if viewport width drops below 1280px.
- **Risk**: Incomplete Patron loan history data in local development.
  - **Mitigation**: Calculate dynamic loan counts from existing `loans` relations or fallback gracefully to 0 without throwing errors.
