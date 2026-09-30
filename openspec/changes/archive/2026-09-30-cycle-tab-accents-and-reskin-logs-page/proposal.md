# Proposal: Cycle Tab Accents (Yellow, Cyan, Magenta) and Reskin Logs Page

## Why

The administrative workspace currently uses arbitrary accent colors across its 6 tabs, lacking a predictable rhythmic cadence. Standardizing the navigation dock to strictly cycle through the brand CMYK accents in order — **Yellow**, **Cyan**, **Magenta**, and loop (one distinct accent per tab) — reinforces visual consistency across the console.

Additionally, the Audit History / Logs page (`/admin/pos` -> `HISTORY`) is currently using a legacy placeholder layout rather than the approved Figma design (Node `86:4299` "Dashboard - Logs"). Reskinning the logs page to match Figma delivers high-contrast structured log cards, segmented horizontal metadata pipelines (Tidspunkt, Type, Aktør, Target), search and refresh controls, and expandable JSON delta inspectors.

## What Changes

- **Strict Tab Accent Cycling (Yellow → Cyan → Magenta → Loop)**:
  - **Tab 1 `FRONT_DESK` (POS)**: Yellow (`#FFED00`)
  - **Tab 2 `INVENTORY` (Inventar)**: Cyan (`#009FE3`)
  - **Tab 3 `CATALOGUE` (Katalog)**: Magenta (`#E6007E`)
  - **Tab 4 `MANUALS` (Manualer)**: Yellow (`#FFED00`)
  - **Tab 5 `HISTORY` (Logs)**: Cyan (`#009FE3`)
  - **Tab 6 `SETTINGS` (Indstillinger)**: Magenta (`#E6007E`)
- **Page Component Synchronizations**:
  - Update `CatalogueAdminManager.tsx` header and controls to use Magenta (`#E6007E`).
  - Update `ManualsManager.tsx` header and controls to use Yellow (`#FFED00`).
  - Update `AdminSettingsView.tsx` header and controls to use Magenta (`#E6007E`).
  - Update `lib/admin-nav.ts` to assign the exact cycled accent tokens to `ADMIN_NAV_ITEMS`.
- **Figma Reskin of Logs Page (Node `86:4299`)**:
  - Reskin `components/history/AuditHistoryView.tsx` with canonical header: `LABS Logs` in `Stack Sans Notch` with Cyan (`#009FE3`) accent and admin greeting (`Velkommen, {adminName}`).
  - Add search and refresh toolbar (`#151517` input, border `#333333`, rounded-lg) with "Søg logs..." placeholder and refresh trigger.
  - Implement main log card container (`#151517` surface, border `#333333`, rounded-xl) with subheader row (`Revisionslog & Transaktion Historik [Count]` and `TYPE` dropdown filter).
  - Construct structured log cards (`#202021` card, border `#444444`, rounded-lg) featuring segmented horizontal metadata divided by vertical `#333333` dividers: `TIDSPUNKT`, `TYPE`, `AKTØR`, and `TARGET`.
  - Add `Se Ændring ▼` action pill toggling smooth expandable JSON delta drawers for inspectable transaction payloads.

## Capabilities

### Modified Capabilities
- `admin-navigation-and-dashboard`: Enforce the strict 3-color cyclic accent cadence (Yellow → Cyan → Magenta) across the 6 sidebar navigation tabs.
- `admin-history-settings`: Reskin the audit history and logs view to match Figma node `86:4299`, providing structured pipeline log cards and delta inspection.
- `admin-catalogue-management`: Align catalogue admin styling with Magenta (`#E6007E`) accent.
- `admin-manuals-management`: Align manuals admin styling with Yellow (`#FFED00`) accent.

## Impact

- `lib/admin-nav.ts`: Update `accentColor` for all 6 items in `ADMIN_NAV_ITEMS`.
- `components/history/AuditHistoryView.tsx`: Full reskin implementing Figma node `86:4299`.
- `components/catalogue/CatalogueAdminManager.tsx`: Update accent tokens from amber to magenta (`#E6007E`).
- `components/manuals/ManualsManager.tsx`: Update accent tokens from pink to yellow (`#FFED00`).
- `components/settings/AdminSettingsView.tsx`: Update accent tokens from yellow to magenta (`#E6007E`).
