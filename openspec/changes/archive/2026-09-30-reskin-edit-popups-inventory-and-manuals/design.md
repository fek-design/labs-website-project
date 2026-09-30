## Context

See [proposal.md](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/openspec/changes/reskin-edit-popups-inventory-and-manuals/proposal.md) for background and motivation.

Inspection of Figma selected nodes:
- **Node `87:6146` ("Dashboard - Inventar - Edit card")**:
  - `Card - Create` (`87:5143`, 576px) & `Card - Edit` (`87:5050`, 576px): Centered modal card for inventory equipment. Includes deterministic asset tag header/showcase, thumbnail frame (#444444 with tool/camera vector), inputs styled in `#151517` with `#333333` border, dropdowns for Status/Lab/Type with `▼` markers, attached manuals section with cyan `#1da9e4` "Se" pill buttons, description textarea, and action footers (pink `#e51d87` "Slet", `#151517` "Afbryd", and cyan `#1da9e4` "Gem" / "Opret").
  - `Card - Edit` (`87:6081`, 700px): `MANUALER Many-to-Many documentation library` paired side-drawer for linking safety SOPs and guides across machines.
- **Node `209:2` ("Manuals Edit Card")**:
  - `MANUALS - Card Edit` (`89:7194`, 357px): Document thumbnail frame, manual title, filename & size subtitle, white `#ffffff` "Læs Online" button, `#151517` description container, "Links (N)" section with yellow `#ffd900` "Se" pill buttons and unlink buttons, and pink `#e51d87` "Slet" action button.
  - `Card - Links side to edit/create` (`87:6513`, 700px): `LINKS Many-to-Many documentation library` paired side-drawer for linking equipment to the active manual document.

## Goals / Non-Goals

**Goals:**
- Perfectly replicate the visual aesthetics, geometry, typography hierarchy, and color tokens from Figma nodes `87:6146` and `209:2`.
- Update `InventoryItemModal.tsx` and `InventoryManualsDrawer.tsx` to match the `#202021` card surface, `#444444` borders, `#151517` inputs, and `#1da9e4` / `#e51d87` button styling.
- Create `ManualEditModal.tsx` in `components/manuals/` implementing `MANUALS - Card Edit` (`89:7194`) and its paired equipment linking drawer (`87:6513`), and connect it to `ManualsManager.tsx`.
- Support responsive dual-pane layout: on large screens (xl+), show the edit card and the library drawer side-by-side; on smaller screens, smoothly overlay or slide over with high usability.

**Non-Goals:**
- Changing database schema or Prisma relations (all necessary tables and columns already exist).
- Rewriting server actions (existing actions `updateManual`, `deleteManual`, `assignManualToMachine`, `createInventoryItem`, `updateInventoryItem` are already in place).

## Decisions

### Decision 1: Dedicated `ManualEditModal.tsx` Component vs Inlined Manager Popover

- **Chosen Approach**: Create a reusable, focused client component `components/manuals/ManualEditModal.tsx` that coordinates the `MANUALS - Card Edit` card (`89:7194`) and the `Card - Links side to edit/create` drawer (`87:6513`).
- **Rationale**: Keeps `ManualsManager.tsx` clean and maintainable while mirroring the architecture established by `InventoryItemModal.tsx` and `InventoryManualsDrawer.tsx`.
- **Alternatives Considered**: Inlining the modal code inside `ManualsManager.tsx`. This would bloat `ManualsManager.tsx` to over 1000 lines.

### Decision 2: Dual-Pane Side-by-Side Pairing on Wide Viewports

- **Chosen Approach**: Wrap the modal in a flex container `flex flex-col xl:flex-row items-center justify-center gap-4 max-h-[92vh] overflow-y-auto`. When the drawer is toggled ("Tilføj Manualer +" in inventory or "Tilføj +" in manuals), it renders side-by-side on wide viewports (1280px+) matching Figma's exact framing (`Group 6`), while collapsing gracefully to single-pane or stacked view on smaller viewports.
- **Rationale**: Exactly reproduces the Figma mockup layout without breaking mobile accessibility.

### Decision 3: Color Tokens & Typography Alignment

- **Card Shell**: `bg-[#202021] border border-[#444444] rounded-xl shadow-2xl`
- **Inner Containers**: `bg-[#151517] border border-[#333333] rounded-lg`
- **Primary Buttons**:
  - Inventory: `bg-[#1da9e4] hover:bg-[#1598ce] text-white font-bold`
  - Manuals "Læs Online": `bg-white hover:bg-zinc-200 text-[#0d0e0e] font-bold`
  - Manuals "Se" link pill: `bg-[#ffd900] hover:bg-[#e6c400] text-[#0d0e0e] font-bold`
  - Destructive "Slet": `bg-[#e51d87] hover:bg-[#d01577] text-white font-bold`
  - Cancel "Afbryd": `bg-[#151517] hover:bg-[#202021] border border-[#333333] text-[#888888] hover:text-white`
- **Typography**: Headers use `font-notch` / `Stack Sans Notch`, labels and badges use `font-headline` / `Stack Sans Headline`, data and body use `font-text` / `Stack Sans Text` or `font-mono`.

## Risks / Trade-offs

- **Risk**: Dual-pane layout exceeding screen height or width on smaller laptop screens (e.g. 1366x768).
  - *Mitigation*: Set `max-h-[92vh] overflow-y-auto` on individual cards and use `xl:flex-row flex-col` so cards stack vertically with scrolling if viewport width is below 1280px.

## Migration Plan

1. **Step 1**: Polish `InventoryItemModal.tsx` and `InventoryManualsDrawer.tsx` to match nodes `87:5143`, `87:5050`, and `87:6081`.
2. **Step 2**: Implement `ManualEditModal.tsx` for nodes `89:7194` and `87:6513`.
3. **Step 3**: Integrate `ManualEditModal` into `ManualsManager.tsx` when clicking manual cards or edit triggers.
4. **Step 4**: Verify TypeScript types, responsive breakpoints, and visual styling.
