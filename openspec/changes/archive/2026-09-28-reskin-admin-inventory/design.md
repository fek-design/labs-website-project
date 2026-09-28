# Design Document: Reskin Admin Inventory Dashboard to Figma Specification

## Context
See `proposal.md` for motivation and background. The Admin Inventory console currently lives in `components/inventory/InventoryManager.tsx`. While functionally operational with Prisma and MySQL server actions, its presentation diverges from the latest high-contrast dark aesthetic captured in Figma nodes `84:3286`, `86:4522`, `87:5050`, `87:6146`, `87:6414`, and `87:6577`.

## Goals / Non-Goals

**Goals:**
- Implement exact visual styling and geometry matching Figma: `#0e0d0f` background, `#202021` card surfaces, `#151517` input/filter elements, and `#333333` / `#444444` borders.
- Provide fluid switching between List view (`Dashboard - Inventar - List`) and Grid view (`Dashboard - Inventar - Grid`) with local storage persistence.
- Refactor the item creation and edit experience into high-fidelity Figma cards (`Card - Create` and `Card - Edit`), preserving deterministic tag computation (`[LAB-PREFIX]-[KATEGORI]-[4-DIGIT-SEQUENCE]`).
- Implement the documentation attachment browser (`Card - Manual side to edit/create`) allowing many-to-many PDF guides to be associated with items.
- Modularize `components/inventory/` into decoupled subcomponents for maintainability.

**Non-Goals:**
- Modifying core database schema or breaking existing Prisma models.
- Changing authentication gates or student-facing catalog APIs.

## Decisions

### 1. Component Architecture & Modular Breakdown
- **Decision**: Refactor `components/inventory/InventoryManager.tsx` from a monolith into clean, single-responsibility subcomponents:
  - `InventoryManager.tsx`: Main coordinator maintaining inventory list state, active filters, view mode, and modal triggers.
  - `InventoryToolbar.tsx`: Search input with embedded List/Grid view toggle pills, and the Cyan `#1da9e4` "Tilføj" button.
  - `InventoryFilterBar.tsx`: Equipment counter (`Tilgængeligt Udstyr & maskiner X`) and inline dropdowns (`LAB`, `TYPE`, `STATUS`) with vertical separator lines.
  - `InventoryListView.tsx`: High-density horizontal row cards with icon block, title, asset tag subtitle, facility badge, status dropdown, activity pill, and quick actions.
  - `InventoryGridView.tsx`: 3-column responsive grid card layout matching Figma frame `86:4522`.
  - `InventoryItemModal.tsx`: Centered modal supporting both `Card - Create` and `Card - Edit` modes, serial number, purchase date, and manual attachments.
  - `InventoryManualsDrawer.tsx`: Slide-over documentation picker (`Card - Manual side to edit/create`) with live search and multi-select.
- **Alternatives Considered**: Keeping all code inside `InventoryManager.tsx`. Rejected because the file would exceed 1,500 lines and make maintenance difficult.

### 2. View Mode State & Persistence
- **Decision**: Store `viewMode` (`"list" | "grid"`) in React state with default `"list"` and sync to `localStorage.getItem("zealand_inventory_view_mode")`.
- **Alternatives Considered**: URL query parameter (`?view=grid`). Local storage was chosen because administrators prefer their layout density preference to persist across all sessions without dirtying the URL.

### 3. Visual Tokens & Color Palette
- **Decision**: Adhere strictly to the inspected Figma node styles:
  - Base Floor: `#0e0d0f`
  - Elevated Container: `#151517` with border `#333333` (Search bar, filter dropdowns, input fields)
  - Card Surfaces: `#202021` with border `#444444` (List rows, Grid cards, Edit/Create modals)
  - Accent Cyan: `#1da9e4` (Add button, Save button, "Se" manual action)
  - Accent Magenta: `#e51d87` (Delete button)
  - Neutral / Inactive: `#151517` background, text `#888888`, border `#333333`
  - Typography: Stack Sans Notch / Sans Headline / Sans Text.
- **Alternatives Considered**: Using generic Tailwind slate/zinc shades. Rejected in favor of exact Figma hex tokens for visual fidelity.

### 4. Deterministic Asset Tag Computation Preview
- **Decision**: In `Card - Create`, display the dynamic computed tag banner:
  `ML-CAM-046` with subtext `Computeret via [LAB-PREFIX]-[KATEGORI]-[4-DIGIT-SEQUENCE]`, recalculating when Lab or Type changes.
- **Rationale**: Reflects Figma node `87:6424` while ensuring zero manual tagging errors in the database.

## Risks / Trade-offs

- [Dense list pill layout on smaller tablet screens] → Enable responsive horizontal wrapping or collapse secondary activity pills on viewports below 1024px.
- [Modal overlay scroll on small heights] → Ensure `Card - Create` and `Card - Edit` have `max-h-[90vh]` with custom smooth dark scrollbars.
- [Prisma schema optional fields] → Serial number and purchase date should map to existing fields or `notes`/metadata JSON without breaking migrations.
