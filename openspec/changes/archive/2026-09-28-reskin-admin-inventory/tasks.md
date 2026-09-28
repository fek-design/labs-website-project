## 1. Modular Component Setup & Toolbar

- [x] 1.1 Create `components/inventory/InventoryToolbar.tsx` featuring the dark `#151517` search input, interactive List/Grid view toggle pills, and the Cyan `#1da9e4` "Tilføj" action button matching Figma nodes `84:3790` and `84:3807`.
- [x] 1.2 Create `components/inventory/InventoryFilterBar.tsx` featuring equipment counter (`Tilgængeligt Udstyr & maskiner X`) and inline dropdowns (`LAB`, `TYPE`, `STATUS`) separated by `#333333` vertical lines matching Figma nodes `84:3835`.

## 2. List & Grid View Implementations

- [x] 2.1 Implement `components/inventory/InventoryListView.tsx` displaying high-density row cards (`#202021`, border `#444444`) with 50x50 icon thumbnail, title, asset tag subtitle, facility badge, status dropdown, activity pill, and quick action trigger matching Figma frame `84:3286`.
- [x] 2.2 Implement `components/inventory/InventoryGridView.tsx` displaying responsive multi-column cards matching Figma frame `86:4522`, including description preview, status badges, and bottom pill cluster.

## 3. Item Modals (Create & Edit)

- [x] 3.1 Implement `components/inventory/InventoryItemModal.tsx` supporting both `Card - Create` (Figma node `87:6414`) and `Card - Edit` (Figma node `87:5050`) with dark `#202021` card styling, computed deterministic asset tag preview, serial number, purchase date, and styled footer action buttons.
- [x] 3.2 Wire form validation and submit handlers to server actions (`createInventoryItem`, `updateInventoryItem`, `deleteInventoryItem`) with optimistic feedback.

## 4. Manuals Documentation Library Integration

- [x] 4.1 Implement `components/inventory/InventoryManualsDrawer.tsx` (`Card - Manual side to edit/create`, Figma node `87:6577`) supporting live manual search, multi-selection, file size badge, and guide detachment.
- [x] 4.2 Connect manual selection state to `InventoryItemModal` so selected guides appear in the "Manualer" list with "Se" and remove actions.

## 5. Main Coordinator Integration & Verification

- [x] 5.1 Refactor `components/inventory/InventoryManager.tsx` to coordinate `InventoryToolbar`, `InventoryFilterBar`, view mode switching with `localStorage` persistence, `InventoryItemModal`, and `InventoryManualsDrawer`.
- [x] 5.2 Validate end-to-end functionality: search queries, lab/type/status filtering, List vs. Grid rendering, creation, editing, manual association, and responsive layout.
