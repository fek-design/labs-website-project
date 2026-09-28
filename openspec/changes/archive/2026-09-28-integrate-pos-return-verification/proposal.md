## Why

When an administrator clicks a loan in the Date Activity calendar feed, replacing the entire Active Session panel with a standalone view disconnected the administrator from the student profile and the familiar `UDLEJNING` / `RETUNERING` mode toggles. Furthermore, calendar queries only returned shallow patron metadata without nested active loans, erroneously displaying "0 active loans" in the session statistics.

Integrating the verification layout directly into the right-hand **RETUNÉRING** tab of the Active Session panel (Option B: list with expanded detail drawer) preserves the 2-column layout, keeps student context anchored on the left, and accurately displays active loan records.

## What Changes

- **Full Patron Data Hydration**: When a loan card in the activity feed is selected, query the complete patron record with their associated loans (`getPatronDetails`) so the session stats on the left accurately show their real active and overdue loan counts.
- **2-Column Layout Preservation**: Eliminate the full-panel replacement. Keep the student profile, avatar, loan counters, and mode buttons on the left column.
- **Embedded Verification in RETUNÉRING Tab (Option B)**:
  - Automatically activate the `RETUNERING` mode button (highlighted yellow `#ffd900`).
  - In the right column, display the student's active loans list, with the selected loan expanded with the full "LOAN STATUS & VERIFICATION" cards:
    - Equipment Asset (Name, Tag, Lab)
    - Checked Out & Expected Return dates
    - Notes
    - Action buttons: "Forlæng / Rediger" (Extend / Edit), "Rapporter Skade" (Flag Damage), and "Check In Equipment".
  - Allow the administrator to toggle or inspect other active loans belonging to the same student seamlessly.

## Capabilities

### New Capabilities
*(None)*

### Modified Capabilities
- `equipment-pos-dashboard`: Clicking an activity calendar card activates the RETUNÉRING tab of the Active Session panel, hydrations full patron loan history, and embeds the interactive verification card stack directly inside the right-hand return column.

## Impact

- **Affected Files**:
  - `components/pos/EquipmentPOS.tsx` (calls `getPatronDetails` upon activity loan selection, sets `sessionMode` to `RETUNERING`)
  - `components/pos/ActiveSessionPanel.tsx` (re-integrates verification cards into the right column under `RETUNERING`, displays list of loans with selected loan expanded)
- **APIs/Actions**: Uses existing local `getPatronDetails`, `returnEquipment`, and `modifyLoan` actions. Zero cloud dependencies.
