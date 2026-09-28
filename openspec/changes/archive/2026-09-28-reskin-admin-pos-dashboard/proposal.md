# Proposal: Reskin Admin POS Dashboard (Figma 79:827)

## Why
The current administrative POS interface lacks visual clarity and intuitive ergonomic grouping, forcing operators to switch across detached tabs and browse disjointed tables during checkout. The new design from Figma frame `Dashboard - Frontpanel` (`node-id=79-827`) provides an all-in-one command center that pairs real-time loan calendar telemetry with a unified barcode search bar and a split-column active session card (student profile & stats on the left, scanned equipment, duration presets, and checkout confirmation on the right), dramatically improving operational velocity.

## What Changes
- **Header & Metric KPIs**: Implement the high-impact header featuring `LABS Dashboard` branding, operator greeting (`Velkommen, [Name]`), and three prominent live metric counters: *Aktive lån*, *Overskredet Returneringer*, and *Ledigt udstyr*.
- **Unified Two-Column Calendar & Activity Section**:
  - Left panel: A clean multi-week calendar schedule with month navigation (`< AUG 2026 >`), category filter tabs (`ALLE`, `UDLÅNT`, `RETURNERINGER`, `AFLEVERET`), and day-by-day loan cell indicators.
  - Right panel: A contextual activity feed showing scheduled returns/loans for the selected date with student tags, status badges, and quick-action loan extension (`Forlæng leje periode +`).
- **Streamlined Barcode / Search Hub**:
  - Full-width dark search container featuring a barcode scanner icon and mode filter pills (`AUTO`, `STUDENT`, `UDSTYR`).
- **Aktiv Session Command Console (Split 2-Column)**:
  - Header: Session title with a quick `RYD SESSION` dismiss action.
  - Left Column: Prominent student badge with circular avatar initial, large ID display (`MFE394`), email label, 4-row loan history stats (*Aktive lån*, *Overskredet*, *Tidligere lån*, *Oprettet*), and large tactile mode buttons (`UDLEJNING`, `RETUNÉRING`).
  - Right Column: Scanned equipment card list with item tag and remove action, rental period selector with date picker and quick duration chips (`1+ Uge`, `2+ Uger`, `+1 Måned`), optional comment/note field, and full-width `GODKEND` checkout action button.
- **Preserved Business Logic**: Keep existing Prisma operations, server actions (`searchPatronOrAsset`, `createOrUpdatePatron`, `checkoutItem`, `returnItem`), and optimistic state management completely intact.

## Capabilities

### New Capabilities
*(None)*

### Modified Capabilities
- `equipment-pos-dashboard`: Replaces the fragmented tabbed POS interface with the unified two-column layout from Figma `79:827`, modernizing the calendar schedule with a side-by-side date activity drawer, integrating the multi-mode scanner input, and consolidating patron details and checkout controls into the split `Aktiv Session` card.

## Impact
- **Affected Components**:
  - `components/pos/EquipmentPOS.tsx`: Master coordinator and layout shell.
  - `components/pos/LoanCalendar.tsx`: Reskinned to match Figma calendar grid and month navigation.
  - `components/pos/ScannerInput.tsx`: Updated to the unified full-width bar with `AUTO / STUDENT / UDSTYR` mode pills.
  - `components/pos/PatronCard.tsx` & `components/pos/CheckoutCart.tsx`: Merged/restyled into the Figma split `Aktiv Session` console.
  - `components/pos/ActivityFeed.tsx` (or integrated calendar activity panel): Dedicated list for selected day's loans.
- **APIs & Backend**: No breaking changes to database schemas or server actions; pure frontend layout, ergonomics, and token reskin.
