## Context

The administrative operational workspace (`/admin/pos`) features a 6-module navigation dock (`FRONT_DESK`, `INVENTORY`, `CATALOGUE`, `MANUALS`, `HISTORY`, `SETTINGS`). Previously, tab accent colors were assigned ad-hoc (Yellow, Cyan, Amber, Pink, Cyan, Yellow), creating visual dissonance and lacking rhythmic order. The user requested enforcing a strict 3-color cyclic accent cadence in tab order: **Yellow**, **Cyan**, **Magenta**, and loop (one distinct accent per tab).

Furthermore, the existing Audit History / Logs view (`components/history/AuditHistoryView.tsx`) used a generic placeholder card layout rather than the approved Figma mockup (Node `86:4299` "Dashboard - Logs"). Reskinning this view aligns it with the project's typography (`Stack Sans Notch`, `Headline`, `Text`), surface palette (`#151517` container, `#202021` card, `#333333`/`#444444` borders), and segmented metadata pipeline geometry.

See `proposal.md` for motivation and background.

## Goals / Non-Goals

**Goals:**
- Enforce the 3-color cyclic accent order across the 6 navigation tabs:
  1. `FRONT_DESK` (POS) → Yellow (`#FFED00`)
  2. `INVENTORY` (Inventar) → Cyan (`#009FE3`)
  3. `CATALOGUE` (Katalog) → Magenta (`#E6007E`)
  4. `MANUALS` (Manualer) → Yellow (`#FFED00`)
  5. `HISTORY` (Logs) → Cyan (`#009FE3`)
  6. `SETTINGS` (Opsætning) → Magenta (`#E6007E`)
- Ensure each page view component uses its designated tab accent for primary headings, action triggers, and active highlights.
- Reskin `components/history/AuditHistoryView.tsx` to match Figma node `86:4299`:
  - Canonical `LABS Logs` header with Cyan accent and admin welcome greeting.
  - Search input toolbar (`#151517` fill, `#333333` border) with "Søg logs..." placeholder and "Refresh" action button.
  - Main surface container (`#151517` fill, `#333333` border, rounded-lg) with "Revisionslog & Transaktion Historik [count]" header and `TYPE` dropdown filter.
  - High-contrast log cards (`#202021` fill, `#444444` border) with 4 horizontal data segments (`TIDSPUNKT`, `TYPE`, `AKTØR`, `TARGET`) divided by vertical `#333333` borders.
  - Interactive "Se Ændring ▼" toggle button revealing smooth expandable JSON payload inspection drawers.

**Non-Goals:**
- Altering the Prisma schema, audit log database structure, or server action signatures (`getAuditLogs`, `getDistinctActionTypes`).
- Adding external cloud logging services or telemetry collectors (strictly preserving zero-cloud protocol).
- Changing navigation items outside the 6 canonical modules.

## Decisions

### 1. Centralized Navigation Accent Registry (`lib/admin-nav.ts`)
- **Decision**: Update `ADMIN_NAV_ITEMS` in `lib/admin-nav.ts` as the single source of truth for tab order and accent colors.
- **Rationale**: Keeps dock rendering, active glows, tooltips, and page styling synchronized through a typed configuration array.
- **Alternatives considered**: Hardcoding colors in individual tab components, which causes drift and breaks consistency when switching tabs.

### 2. Tab-to-Page Accent Synchronization
- **Decision**: Update the corresponding page components (`CatalogueAdminManager.tsx`, `ManualsManager.tsx`, `AdminSettingsView.tsx`, and `AuditHistoryView.tsx`) to match their tab's accent token:
  - Tab 3 `CATALOGUE` uses Magenta (`#E6007E`) instead of Amber (`#FF9900`).
  - Tab 4 `MANUALS` uses Yellow (`#FFED00`) instead of Pink (`#E6007E`).
  - Tab 5 `HISTORY` uses Cyan (`#009FE3`).
  - Tab 6 `SETTINGS` uses Magenta (`#E6007E`) instead of Yellow (`#FFED00`).
- **Rationale**: Satisfies the constraint that each tab has exactly one accent, creating an immediate visual connection between the sidebar icon and the active page canvas.

### 3. Faithful Reskin of Figma Node `86:4299`
- **Decision**: Replicate the geometry, colors, typography, and card divisions from Figma node `86:4299`:
  - Container: `#151517`, border `#333333`, rounded-lg (8px), padding 20px.
  - Card: `#202021`, border `#444444`, rounded-lg (8px), min-height 80px.
  - Card segments: Stacked uppercase metadata labels (`Stack Sans Text` bold, 10px, text-zinc-400) above strong values (`Stack Sans Text` bold, 12px, text-white), separated by vertical `#333333` divider lines.
  - Action trigger: "Se Ændring ▼" styled in Cyan (`#009FE3`) or Tab accent, toggling an expandable JSON delta drawer with syntax-highlighted monospace view.
- **Rationale**: Replaces legacy unstructured cards with high-density, scannable data pipelines matching the Zealand Labs design system.

### 4. Interactive UX Enhancements for Logs View
- **Decision**: Build missing UX states into `AuditHistoryView.tsx` including loading skeleton indicators, smooth drawer expansion with `motion/react`, empty search state feedback, and responsive layout collapse on smaller screens.
- **Rationale**: Adheres to the Mockup UI vs. UX Engineering rule: Figma provides the visual geometry, while code provides reactive feedback and resilient state handling.

## Risks / Trade-offs

- **[Risk] Long entity names or JSON payloads breaking card horizontal layout** → Mitigation: Use CSS truncation (`truncate`, `max-w-[...]`) with tooltips for overflowing strings in the collapsed card view, and full wrapping in the expanded JSON inspector.
- **[Risk] Responsive mobile/tablet viewport constraints** → Mitigation: On smaller viewports (`< lg`), allow the 4 horizontal segments to wrap or stack gracefully while preserving desktop layout on `lg` and above (`1272px` Figma frame width).
