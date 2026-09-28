## 1. Selective Return Manifest in ActiveSessionPanel

- [x] 1.1 In `components/pos/ActiveSessionPanel.tsx`, implement `selectedReturnLoanIds: Set<string>` state with "Vælg alle" / "Fravælg alle" toggle controls.
- [x] 1.2 In `components/pos/ActiveSessionPanel.tsx`, render an interactive return manifest checklist row for each active loan with checkbox, asset tag, item title, return status, and single-click return / damage report triggers.
- [x] 1.3 In `components/pos/ActiveSessionPanel.tsx`, update batch return handler to execute `returnMultipleLoans` with only the selected loan IDs, providing dynamic count labels and clear summary feedback for unreturned loans.

## 2. Barcode Scanner Check-Off Integration

- [x] 2.1 In `components/pos/EquipmentPOS.tsx`, intercept scanned asset tags that match an active loan of the currently attached patron and forward the event to check/toggle that item in the return manifest.
- [x] 2.2 In `components/pos/ActiveSessionPanel.tsx`, handle scanned item events with positive visual checkmark animations and feedback cues.

## 3. Dynamic Location & Multi-Facility Management in Settings

- [x] 3.1 In `components/settings/AdminSettingsView.tsx`, remove hardcoded `"Roskilde Campus"` and render active campus (`Køge Campus`) and active facility context.
- [x] 3.2 In `components/settings/AdminSettingsView.tsx`, implement session facility switcher pills (`Makerspace (Køge)`, `MediaLab (Køge)`) allowing administrators to switch workspaces.
- [x] 3.3 In `app/admin/pos/AdminConsoleClient.tsx`, pass `activeLab` and `onSelectLab` props to `AdminSettingsView`.
- [x] 3.4 In `components/settings/AdminSettingsView.tsx`, reskin header and cards according to canonical design system tokens (`#151517` container, `#202021` card, Stack Sans typography).

## 4. Verification & Validation

- [x] 4.1 Run TypeScript compilation check (`npx tsc --noEmit`).
- [x] 4.2 Run OpenSpec change validation (`openspec validate selective-returns-and-location-settings`).
