## Context

See `proposal.md` for motivation. Administrators logging into Zealand Labs need immediate, frictionless access to the POS and inventory operational console rather than being interrupted by an intermediate landing prepage. Furthermore, the sidebar navigation has excessive bounding box geometry around the active icon that clutters the interface, and staff require an expandable drawer to read full tab descriptions as well as interactive lab switching (Makerspace, Medialab, Dimselab).

## Goals / Non-Goals

**Goals:**
- Replace the intermediate `/admin` prepage with direct rendering of `AdminConsoleClient`, establishing a direct `Login -> Admin POS` workflow.
- Eliminate the active tab square border box and side accent strip in `AdminSidebarNav.tsx`, replacing them with borderless icon illumination and drop-shadow glow.
- Implement an expandable sidebar navigation that toggles between compact (`w-20` / 80px) and detailed mode (`w-64` / 256px), exposing category labels, descriptions, and metadata.
- Introduce interactive clickable lab switchers (Medialab, Makerspace, Dimselab) directly in the console header, dynamically updating the active operational lab context in `EquipmentPOS`.

**Non-Goals:**
- Removing underlying database stats queries (they will be accessible within the console views or settings).
- Modifying student-facing public portal pages (`/`, `/katalog`).

## Decisions

### 1. Direct Entrypoint Architecture
- **Choice**: Convert `app/admin/page.tsx` into a server component that fetches initial POS statistics and directly returns `<AdminConsoleClient initialStats={initialStats} />`. In `app/admin/pos/page.tsx`, redirect to `/admin` via `next/navigation` `redirect("/admin")`.
- **Rationale**: Removes intermediate latency and user clicks. When staff authenticate, they land directly where daily loans and checkouts happen.

### 2. Borderless Icon Highlighting Design System
- **Choice**:
  - Delete the bounding box classes (`bg-zinc-800/90 text-white shadow-lg border border-zinc-700`).
  - Delete the side accent pill (`w-1.5 h-6 rounded-r-full`).
  - Render active icons with:
    ```tsx
    <IconComponent
      size={24}
      weight={isActive ? "fill" : "regular"}
      style={{
        color: isActive ? item.accentColor : undefined,
        filter: isActive ? `drop-shadow(0 0 8px ${item.accentColor}60)` : undefined,
      }}
      className={`transition-all ${isActive ? "scale-110" : "text-zinc-500 hover:text-zinc-200 hover:scale-105"}`}
    />
    ```
- **Rationale**: Eliminates visual noise and gives the sidebar a sleek, modern, borderless look.

### 3. Expandable Sidebar Drawer & Layout Transition
- **Choice**:
  - `AdminSidebarNav` manages an `isExpanded: boolean` toggle state (persisted or toggled via a header button).
  - Width smoothly transitions: `transition-all duration-300 ease-in-out` (`w-20` to `w-64`).
  - In expanded mode, each button displays a two-column row with the icon on the left and title + description text on the right.
  - `AdminConsoleClient` coordinates content offset with `isExpanded ? "pl-64" : "pl-20"`.

### 4. Clickable Lab Switcher
- **Choice**:
  - In `AdminConsoleClient.tsx`, state `activeLab: LabSlug` is introduced with options `medialab`, `makerspace`, `dimselab`.
  - Displayed as a segmented control in the top bar. Clicking a lab updates the state and passes `labSlug={activeLab}` to `EquipmentPOS`.

## Risks / Trade-offs

- **[Risk] Main content shift during sidebar animation**:
  - **Mitigation**: Apply synchronized CSS transitions (`transition-[padding] duration-300 ease-in-out`) on the main container to prevent jitter.
