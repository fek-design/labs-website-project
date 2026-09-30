## Why

Inspection of the selected Figma nodes (`87:6146` for Inventory and `209:2` for Manuals) reveals a cohesive, unified visual standard for administrative edit cards and their paired side drawers. Currently, the inventory item modal (`InventoryItemModal.tsx`), manuals drawer (`InventoryManualsDrawer.tsx`), and the manuals manager edit experience (`ManualsManager.tsx`) have discrepancies in card geometry, typography hierarchy, button accents (cyan `#1da9e4`, yellow `#ffd900`, pink `#e51d87`), search input styling, and many-to-many linking interactions. Implementing this unified modal card architecture brings full pixel-accurate alignment across equipment editing, documentation management, and related popups.

## What Changes

- **Inventory Item Modal (`Card - Edit` node `87:5050` / `Card - Create` node `87:5143`)**:
  - Reskin the container to authentic `#202021` card surface with 1px `#444444` border and crisp inner padding matching Figma specifications.
  - Implement deterministic asset tag showcase display with subtitle `Computeret via [LAB-PREFIX]-[KATEGORI]-[4-DIGIT-SEQUENCE]`.
  - Standardize input containers to `#151517` with `#333333` borders, high-contrast `#d1d5db` typography, and smooth `#1da9e4` focus states.
  - Symmetrically align dropdown selectors for Lab, Type, and Status with custom caret triggers (`▼`).
  - Style the "Manualer" linked guides section with cyan `#1da9e4` "Se" pill buttons, item descriptions, and clean delete triggers.
  - Standardize action footer: `#e51d87` (Pink) "Slet" button in edit mode, `#151517` / `#333333` "Afbryd" cancel button, and `#1da9e4` (Cyan) "Gem" / "Opret" primary action button.

- **Manual Edit Popup (`MANUALS - Card Edit` node `89:7194`)**:
  - Implement a dedicated Manual Edit Card popup in `ManualsManager.tsx` with document thumbnail frame (`#444444`), title in `Stack Sans Notch`, filename & size subtitle (`#888888`), and prominent `#ffffff` "Læs Online" button with document icon.
  - Provide a structured "Beskrivelse" textarea container matching `#151517` / `#333333`.
  - Provide a "Links (N)" section with "Tilføj +" toggle that opens the equipment linking drawer, showing linked machines with yellow `#ffd900` "Se" pill buttons and unlink actions.
  - Feature `#e51d87` (Pink) "Slet" action button in the card footer.

- **Dual-Pane / Side-Drawer Pairing (`Card - Edit` node `87:6081` & `Card - Links side to edit/create` node `87:6513`)**:
  - On wide viewports (or side-drawer toggle), seamlessly pair the main edit card with the many-to-many documentation/equipment library.
  - Feature canonical header: `MANUALER` / `LINKS` `Many-to-Many documentation library • Link shared safety SOPs & guides across all machines` with live `Valgt N` counter.
  - Provide unified search bar and responsive 2-column selection grid with checkmark toggle states.

## Capabilities

### Modified Capabilities
- `inventory-location-management`: Updates the inventory item creation and edit modal interfaces (`Card - Create` and `Card - Edit`) to match Figma node `87:6146`, integrating paired manuals documentation library drawer styling and standardized button hierarchies.
- `admin-manuals-management`: Introduces the dedicated `MANUALS - Card Edit` popup (Figma node `209:2`) with "Læs Online" action, linked equipment list with yellow "Se" buttons, and the paired `LINKS` documentation library drawer (`87:6513`).

## Impact

- **Components Modified / Created**:
  - `components/inventory/InventoryItemModal.tsx`
  - `components/inventory/InventoryManualsDrawer.tsx`
  - `components/manuals/ManualsManager.tsx`
  - `components/manuals/ManualEditModal.tsx` (or dedicated subcomponent for Node `89:7194`)
- **APIs & State**: Connects existing server actions (`updateManual`, `deleteManual`, `assignManualToMachine`, `unassignManualFromMachine`, `createInventoryItem`, `updateInventoryItem`). No database schema changes needed.
