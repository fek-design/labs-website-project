## Context

See `proposal.md` for background and motivation. The Point of Sale console (`components/pos/`) currently models return check-ins through a blunt binary choice in `ActiveSessionPanel.tsx`: either return all ongoing loans at once, or expand a single target loan drawer and return one item at a time. Concurrently, `AdminSettingsView.tsx` displays outdated static text ("Roskilde Campus") disconnected from the live session state and lacks a multi-facility switcher for operators.

## Goals / Non-Goals

**Goals:**
- Provide a responsive, multi-select return manifest where administrators can check off 1, several, or all items for batch return.
- Enable physical barcode scanner check-offs directly into the return manifest when scanning equipment on active loan.
- Render explicit partial return warnings/summaries (e.g. "2 af 3 enheder returneres, 1 enhed forbliver aktiv").
- Remove all obsolete campus references from `AdminSettingsView.tsx` and dynamically render active campus and facility metadata.
- Connect `AdminSettingsView.tsx` to global session location state (`activeLab`: `makerspace` vs `medialab`) allowing operators to switch workspaces directly from Settings.
- Elevate `AdminSettingsView.tsx` to the project's canonical typography (Stack Sans Notch, Headline, Text) and dark surface tokens (`#151517`, `#202021`, `#333333`).

**Non-Goals:**
- Schema changes to the MySQL database: `returnMultipleLoans` in `app/actions/pos.ts` already supports arbitrary arrays of `loanIds`.
- Cross-campus database replication: All operations remain local to the Køge campus node.

## Decisions

### 1. Return Manifest State & Selection Architecture
- **Decision**: In `ActiveSessionPanel.tsx`, maintain `selectedReturnLoanIds: Set<string>` initialized with all active loan IDs when entering return mode, but easily toggled via individual row checkboxes or the master "Vælg alle / Fravælg alle" toggle.
- **Rationale**: Initializing all as selected matches the common case (returning everything) in one click, while enabling technicians to uncheck items or check individual items for partial returns without leaving the view.
- **Alternative considered**: Forcing operators to manually click each checkbox from an empty set. Rejected because it slows down the standard "return everything" scenario.

### 2. Barcode Scanner Check-Off Integration
- **Decision**: In `EquipmentPOS.tsx`, when an asset tag is scanned and matches an active loan of the currently attached patron, trigger a check-in toggle in the return manifest (or select that item for return) rather than showing a generic error alert ("Udstyr har allerede et aktivt lån").
- **Rationale**: Desk operators instinctively scan returned physical items with a handheld barcode scanner. Intercepting this event turns physical scanning into an instant verification action.

### 3. Session-State Location Management in Settings
- **Decision**: Pass `activeLab` and `onSelectLab` from `AdminConsoleClient.tsx` into `AdminSettingsView.tsx`. Inside Settings, render an interactive facility switcher pill group (`Makerspace (Køge)` and `MediaLab (Køge)`) and verify active campus as `Køge Campus`.
- **Rationale**: Operators manage both labs within the same session. Allowing facility toggling in Settings provides full configuration parity with the navigation dock.

### 4. Canonical Header and Surface Styling
- **Decision**: Update `AdminSettingsView.tsx` to use:
  - Header: `LABS` in white with `Settings` in yellow (`font-notch`), operator greeting in `font-headline`.
  - Surfaces: `#151517` container with `#333333` border, `#202021` card tiles with `#444444` borders.
- **Rationale**: Complies with the Project Design System Rules in `AGENTS.md`.

## Risks / Trade-offs

- **[Risk]** Operator accidentally returns the wrong item when multi-selecting.
  → **Mitigation**: The action button dynamically displays exact counts (`Returnér valgte (2 af 3)`), and a confirmation banner explicitly states which items will remain active.
- **[Risk]** Handheld scanner sends rapid newline characters.
  → **Mitigation**: Scanner input handler debounces inputs and handles toggling optimistically without UI jank.
