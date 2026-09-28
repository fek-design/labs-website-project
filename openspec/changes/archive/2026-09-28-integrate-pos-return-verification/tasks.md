## 1. Patron Data Hydration & Session Mode Synchronization

- [x] 1.1 In [EquipmentPOS.tsx](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/components/pos/EquipmentPOS.tsx), update `handleSelectLoan` to fetch complete patron details via `getPatronDetails(loan.patronId)` so the student's active loan counters populate accurately instead of showing 0.
- [x] 1.2 In [EquipmentPOS.tsx](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/components/pos/EquipmentPOS.tsx) and [ActiveSessionPanel.tsx](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/components/pos/ActiveSessionPanel.tsx), ensure selecting an activity card automatically activates the `RETUNERING` mode button (highlighted in yellow `#ffd900`).

## 2. Integrated RETUNÉRING Tab with Option B (List + Detail Drawer)

- [x] 2.1 In [ActiveSessionPanel.tsx](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/components/pos/ActiveSessionPanel.tsx), remove the full-panel early return, preserving the left column (student avatar, identity, counters, and mode switcher).
- [x] 2.2 In [ActiveSessionPanel.tsx](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/components/pos/ActiveSessionPanel.tsx), implement Option B within the right-column `RETUNERING` tab:
  - If the student has multiple active loans, display a compact loan selector list with the selected loan highlighted.
  - Expand the selected loan with the rich verification cards: Equipment Asset (name, tag, lab), Checked Out and Expected Return dates, and Notes.
  - Provide inline action controls: "Forlæng / Rediger" (inline datetime & note editor), "Rapporter Skade" (inline damage note input & repair flag), and "Check In Equipment" (prominent cyan action button).
- [x] 2.3 Allow clicking any other active loan in the list to switch the expanded verification drawer to that loan.

## 3. Type Validation & End-to-End Verification

- [x] 3.1 Run TypeScript type check (`npx tsc --noEmit`) to verify zero compile or type errors.
- [x] 3.2 Verify Next.js compilation on `/admin` and confirm clicking an activity card keeps the 2-column layout, accurately shows active loan counts, and embeds the verification drawer in `RETUNERING` mode.
