## 1. Top Header & KPI Metric Ribbon

- [x] 1.1 Create or update the top header in `EquipmentPOS.tsx` featuring `LABS Dashboard` ("LABS" in font-notch, "Dashboard" in `#FFED00` brand yellow) and dynamic welcome greeting ("Velkommen, [Admin Name]").
- [x] 1.2 Implement the three top KPI metric counters (`Aktive lån`, `Overskredet Returneringer`, `Ledigt udstyr`) with large `font-notch` numbers, subtle status pips, and responsive positioning.
- [x] 1.3 Wire live count values into the KPI metrics using data from `getPosStats` and real-time loan/equipment records.

## 2. Calendar & Contextual Date Activity Panel

- [x] 2.1 Refactor `components/pos/LoanCalendar.tsx` to support the two-column layout (~60% calendar grid, ~40% activity feed) matching Figma frame `79:827`.
- [x] 2.2 Implement the month navigation header (`< MÅNED ÅR >`) and category filter tabs (`ALLE`, `UDLÅNT`, `RETURNERINGER`, `AFLEVERET`).
- [x] 2.3 Build the 7-column calendar grid (Man-Søn) with day cells displaying date numbers, today indicator, active loan pips, and selection state.
- [x] 2.4 Build the adjacent `Aktivitet [Valgt Dato]` feed panel listing loans for the selected day with equipment title, asset tag (`[ML-CAM-045]`), status badge (`UDLÅNT`), borrower tag (`[studentId]`), and return date.
- [x] 2.5 Add the `Forlæng leje periode +` quick renewal action trigger on loan items within the activity feed.

## 3. Unified Barcode & Search Input Hub

- [x] 3.1 Refactor `components/pos/ScannerInput.tsx` into the full-width dark input container with barcode icon and `Scan eller søg...` placeholder.
- [x] 3.2 Implement the mode switcher pills (`AUTO`, `STUDENT`, `UDSTYR`) on the right side of the search bar, with yellow active highlight for the selected mode.
- [x] 3.3 Connect barcode scanner hardware events and manual enter submission to `searchPatronOrAsset`, respecting the active mode override.

## 4. Split "Aktiv Session" Panel

- [x] 4.1 Create the two-column `Aktiv Session` card layout with section header and right-aligned `RYD SESSION` action.
- [x] 4.2 Build the left student column: yellow circular initial avatar (`M`), student ID tag (`MFE394`), email label, and 4-row stats list (*Aktive lån*, *Overskredet*, *Tidligere lån*, *Oprettet*).
- [x] 4.3 Add the two large action mode toggle buttons (`UDLEJNING` in solid yellow, `RETUNÉRING` in dark/bordered) in the student column.
- [x] 4.4 Build the right equipment column: scanned gear item list with thumbnail/icon, title, asset tag, and remove `[x]` button.
- [x] 4.5 Implement the rental period selector defaulting to 30 days, alongside quick preset chips (`1+ Uge`, `2+ Uger`, `+1 Måned`).
- [x] 4.6 Implement the optional comment/note input field (`Tilføj kommentar eller note (Valgfri)...`).
- [x] 4.7 Implement the primary full-width `GODKEND` checkout button with loading state and disabled validation when student or equipment is missing.

## 5. Master POS Shell Integration & Logic Continuity

- [x] 5.1 Update `components/pos/EquipmentPOS.tsx` to mount the new unified header, upper calendar/activity grid, scanner hub, and lower `Aktiv Session` panels on the default Front Desk tab.
- [x] 5.2 Ensure checkout and return mutations (`checkoutItem`, `returnItem`) preserve optimistic updates, toast notifications, and automatic session cleanup.
- [x] 5.3 Ensure patron registration dialog seamlessly prompts when an unknown student barcode is entered in `AUTO` or `STUDENT` mode.

## 6. Verification & Aesthetics Polish

- [x] 6.1 Verify responsive behavior on desktop and laptop viewports (1280px+ and 1512px).
- [x] 6.2 Run TypeScript verification (`npx tsc --noEmit`) to ensure zero typing regressions.
- [x] 6.3 Compare live rendered POS against Figma frame `79:827` screenshot to confirm visual token alignment (colors, spacing, typography, and borders).
