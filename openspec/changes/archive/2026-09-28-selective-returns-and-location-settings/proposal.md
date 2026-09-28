## Why

The current item return experience in the admin Point of Sale console is rigid and error-prone for high-volume desk operations: administrators can only choose between returning every single loan at once or clicking through individual loan drawers one by one. Desk staff routinely encounter patrons returning only a subset of their borrowed equipment while keeping other items active. Furthermore, while the public frontpage and admin navigation have been standardized to Køge campus facilities, the admin Settings page still displays hardcoded, inaccurate location text ("Roskilde Campus") and lacks multi-location session switching for technicians managing multiple lab spaces.

## What Changes

- **Selective Return Manifest**: Replace the rigid "Return all" single-choice flow with an interactive, multi-select return checklist inside `ActiveSessionPanel.tsx`, allowing administrators to select arbitrary subsets of loans for batch return.
- **Barcode-Driven Return Check-Off**: Allow barcode scans of physical equipment asset tags while a patron's return session is open to immediately check off matching items in the return manifest with responsive audio/visual feedback.
- **Partial Return Preservation**: When returning a subset of loans, explicitly confirm that unreturned items remain active with their original expected return timestamps intact.
- **Location Context in Settings**: Remove stale hardcoded location strings ("Roskilde Campus") in `AdminSettingsView.tsx` and dynamically display the authenticated session's active campus (`Køge Campus`) and facility context.
- **Session-State Multi-Location Switcher**: Provide an active facility switcher inside `AdminSettingsView.tsx` wired to the global session state (`activeLab`: `makerspace` vs `medialab`), enabling technicians who manage multiple spaces to seamlessly switch their operational environment.
- **Settings Visual Standardization**: Align `AdminSettingsView.tsx` with the project design system tokens (`#09090b` dock, `#151517` container, `#202021` card, Stack Sans typography tokens).

## Capabilities

### Modified Capabilities
- `equipment-pos-dashboard`: Update `Equipment Return and Check-in Flow` requirement to mandate selective multi-item return checklists, barcode-driven item check-off, partial return summaries, and batch execution.
- `admin-history-settings`: Update `Admin Credential Settings` and add `Location Context and Multi-Facility Management` requirements to govern dynamic location rendering, session-state facility switching, and design system surface alignment.

## Impact

- **Affected UI Components**:
  - `components/pos/ActiveSessionPanel.tsx` (selective return manifest, barcode check-off listener, partial return counters)
  - `components/pos/EquipmentPOS.tsx` (forwarding barcode scans of active loans to patron return check-off)
  - `components/settings/AdminSettingsView.tsx` (dynamic location indicator, session facility switcher, design system reskin)
  - `app/admin/pos/AdminConsoleClient.tsx` (passing `activeLab` and `onSelectLab` to `AdminSettingsView`)
- **APIs & Actions**:
  - `app/actions/pos.ts`: Reusing existing `returnMultipleLoans` which already accepts arbitrary `loanIds: string[]`.
  - `app/actions/settings.ts`: Supplying facility/campus metadata alongside profile info.
- **Database**: No schema migrations needed; leverages existing `Lab` records and `Loan` transaction models.
