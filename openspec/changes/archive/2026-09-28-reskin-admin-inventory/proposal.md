# Proposal: Reskin Admin Inventory Dashboard to Figma Specification

## Why
The current Admin Inventory manager (`components/inventory/InventoryManager.tsx`) functional baseline works, but diverges significantly from the refined Figma design system established in the "Zealand Labs Projekt" canvas. Administrators need a streamlined, high-contrast operational UI matching the POS and dark aesthetics—featuring interactive List vs. Grid view toggles, direct equipment status indicators, deterministic tag previews, and a dedicated multi-manual documentation attachment workflow.

## What Changes
- **Dual View Modes (List & Grid)**: Introduce a view toggle in the primary search bar (matching Figma nodes `84:3286` and `86:4522`) allowing admins to toggle between a compact high-density List row layout and a responsive multi-column Grid card layout.
- **Figma Design System & Color Tokens Reskin**:
  - Background surface: `#0e0d0f` with dark elevated card surfaces (`#151517` search/filters, `#202021` cards, `#333333` / `#444444` borders).
  - Typography: Integration of Stack Sans typographic hierarchy (`Stack Sans Notch` for equipment titles, `Stack Sans Headline` for tags/labels, and `Stack Sans Text` for UI values).
  - Status & Facility Badging: Pill wrappers with vertical dividers (`|`) displaying facility (`FACILITET LAB`), status (`STATUS LEDIG ▼`), and loan readiness (`AKTIVITET KLAR TIL UDLEJNING`).
  - Brand Cyan Action Button: `#1da9e4` "Tilføj" (Add) button with plus icon and white typography.
- **Figma-Accurate Edit & Create Modals (Cards)**:
  - Reskin the Item Edit (`Card - Edit`, node `87:5050`) and Item Creation (`Card - Create`, node `87:6414`) drawers into centered/overlay cards with dark `#202021` containers.
  - Display deterministic asset tag computation banner `[LAB-PREFIX]-[KATEGORI]-[4-DIGIT-SEQUENCE]`.
  - Add fields for Serial Number (`Serie nummer`) and Purchase Date (`Indkøbsdato`).
  - Action footer styling: Magenta `#e51d87` for "Slet" (Delete), subtle dark `#151517` for "Afbryd" (Cancel), and Cyan `#1da9e4` for "Gem" (Save) / "Opret" (Create).
- **Manuals Documentation Library Overlay (`Card - Manual side to edit/create`, node `87:6577`)**:
  - Implement the slide-over / multi-select documentation browser allowing administrators to search and attach many-to-many PDF manuals and SOP guides to equipment items.

## Capabilities

### Modified Capabilities
- `inventory-location-management`: Update the visual presentation, view modes (List & Grid), filter bar layout, and modal workflows (Create, Edit, and Manuals library attachment) of the inventory management interface while preserving underlying Prisma and server action integrations.

## Impact
- **UI Components**:
  - `components/inventory/InventoryManager.tsx`: Comprehensive visual reskin and layout refactor.
  - Sub-components extracted for modularity if appropriate: `InventoryListView.tsx`, `InventoryGridView.tsx`, `InventoryItemModal.tsx`, `InventoryManualsDrawer.tsx`.
- **Database & Server Actions**:
  - Integrates with existing `getInventoryWithFilters`, `createInventoryItem`, `updateInventoryItem`, `deleteInventoryItem`, and manual linking server actions in `app/actions/inventory.ts`.
- **Dependencies**: Uses existing `@phosphor-icons/react` and `motion/react`. No external cloud dependencies.
