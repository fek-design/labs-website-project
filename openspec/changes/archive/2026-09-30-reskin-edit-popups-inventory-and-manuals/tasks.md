## 1. Inventory Item Modal Reskin (Figma Nodes 87:5143 & 87:5050)

- [x] 1.1 Reskin `InventoryItemModal.tsx` card container to `#202021` with `border-[#444444]`, matching Figma padding, dimensions, and `Stack Sans Notch` header typography.
- [x] 1.2 Implement deterministic asset tag showcase display with subtitle `Computeret via [LAB-PREFIX]-[KATEGORI]-[4-DIGIT-SEQUENCE]` in Create mode and clear asset tag title in Edit mode.
- [x] 1.3 Refine dropdown selectors (Lab, Type, Status) with custom `▼` indicators, high-contrast `#d1d5db` labels, and `#151517` / `#333333` input containers.
- [x] 1.4 Style linked manuals list with cyan `#1da9e4` "Se" pill buttons, file/title typography, and "x" unlink triggers.
- [x] 1.5 Align modal footer buttons: pink `#e51d87` "Slet" button on the left (Edit mode), `#151517` "Afbryd" button, and cyan `#1da9e4` "Gem" / "Opret" button on the right.

## 2. Documentation Library Drawer Alignment (Figma Node 87:6081)

- [x] 2.1 Update `InventoryManualsDrawer.tsx` header to `MANUALER Many-to-Many documentation library • Link shared safety SOPs & guides across all machines` with `Valgt N` pill badge.
- [x] 2.2 Replicate 2-column manual card selection grid matching node `87:6081`, including thumbnail preview frame, title, filename/size metadata, and active checkmark state.
- [x] 2.3 Integrate side-by-side dual-pane pairing on wide viewports (xl+) with `InventoryItemModal.tsx`.

## 3. Manual Edit Card Popup & Equipment Linker (Figma Node 209:2)

- [x] 3.1 Create `components/manuals/ManualEditModal.tsx` implementing `MANUALS - Card Edit` (node `89:7194`) with document thumbnail, title in `Stack Sans Notch`, filename & size subtitle, and white `#ffffff` "Læs Online" button.
- [x] 3.2 Add editable "Beskrivelse" textarea and "Links (N)" section with yellow `#ffd900` "Se" pill buttons and "x" unlink action.
- [x] 3.3 Implement `Card - Links side to edit/create` (node `87:6513`) inside `ManualEditModal.tsx` allowing administrators to search and link equipment to the active manual document.
- [x] 3.4 Wire `ManualEditModal` into `components/manuals/ManualsManager.tsx` so clicking on a manual card opens this edit popup.

## 4. Verification & Polish

- [x] 4.1 Run TypeScript typecheck (`npx tsc --noEmit`) to verify zero type regressions.
- [x] 4.2 Verify interactive states (open, edit, link, unlink, delete, save, read online) across both inventory and manuals views.
