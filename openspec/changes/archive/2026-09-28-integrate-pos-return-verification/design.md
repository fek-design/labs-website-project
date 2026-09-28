## Context

See [proposal.md](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/openspec/changes/integrate-pos-return-verification/proposal.md) for motivation.

`ActiveSessionPanel.tsx` features a responsive 2-column split:
- **Left Column** (`lg:col-span-6`): Displays student profile, initial avatar, 4-row metric counters (`Aktive lån`, `Overskredet`, `Tidligere lån`, `Oprettet`), and the primary mode switcher buttons (`UDLEJNING` and `RETUNERING`).
- **Right Column** (`lg:col-span-5`): Swappable workspace rendering either scanned checkout items (`UDLEJNING`) or active borrowed equipment to check in (`RETUNERING`).

The previous implementation used an early return `if (inspectedLoan) { return ... }`, which overtook the entire panel and hid the student profile. Additionally, selecting a calendar activity card loaded only shallow patron data without `patron.loans`, rendering "Aktive lån: 0".

## Goals / Non-Goals

**Goals:**
- Eliminate the full-panel replacement early return in `ActiveSessionPanel.tsx`.
- Automatically switch `sessionMode` to `"RETUNERING"` when an activity loan card is selected.
- Hydrate full patron details and their loans via `getPatronDetails` so that the left-column loan counts (`Aktive lån: 1+`) reflect true database state.
- Implement **Option B (List + Detail Drawer)** within the right column's `RETUNERING` workspace:
  - If a student has active loans, display them as selectable cards.
  - The currently selected/inspected loan is expanded with the complete verification card stack (Equipment Asset, Tag, Lab, Checkout & Expected return dates, Notes, and actions: `Extend / Edit`, `Flag Damage`, `Check In Equipment`).
  - Clicking any other loan card in the list switches the expanded verification drawer to that loan.

**Non-Goals:**
- Altering the checkout behavior of the `UDLEJNING` tab.
- Modifying Prisma models or running database migrations.

## Decisions

### Decision 1: Hydrate Complete Patron Record on Activity Selection
- **Rationale**: The calendar query `getCalendarLoans` intentionally includes shallow patron data for performance. When an administrator clicks an activity card to work with that loan in the Active Session, we must immediately call `getPatronDetails(loan.patronId)`.
- **Implementation**:
  In `EquipmentPOS.tsx`, `handleSelectLoan(loan)` will:
  1. Set `inspectedLoan` to `loan`.
  2. Fetch full patron details: `const fullPatron = await getPatronDetails(loan.patronId); setActivePatron(fullPatron);`.
  3. Ensure `initialSessionMode` on `ActiveSessionPanel` switches to `"RETUNERING"`.
  4. Scroll smoothly to the active session workspace.

### Decision 2: Option B (List + Detail Drawer) inside Right Column
- **Rationale**: Users want to see the student's active loans, with the selected one clearly displayed for verification and action. This keeps the left column anchored with patron identity while the right column handles the return action.
- **Layout in Right Column (`sessionMode === "RETUNERING"`)**:
  - **Header**: "Udlånt udstyr (N)" with status summary.
  - **Compact Loan Selector List**: If `activeLoans.length > 1`, display quick switcher pills/tabs for each loan (e.g. `[ML-CAM-0001] Sony FX30`, `[ML-MIC-0002] Rode Wireless`), highlighting the currently selected loan.
  - **Expanded Verification Stack**:
    - **Header**: `LOAN STATUS & VERIFICATION` with color-coded status badge (`CHECKED OUT`, `OVERDUE`).
    - **Asset Card**: Item name, asset tag, and lab name.
    - **Dates Grid**: 2-column "Udlånt" vs "Forventet retur" (with yellow/pink accent).
    - **Notes**: Loan notes or inline extension form if "Extend / Edit" is triggered.
    - **Damage Form**: Inline damage notes and maintenance flag if "Flag Damage" is triggered.
    - **Action Footer**:
      - `Forlæng / Rediger` (Pencil icon)
      - `Rapporter Skade` (Pink border)
      - `Check In Equipment` (Prominent cyan primary action button)

## Risks / Trade-offs

- **[Risk] Responsive Spacing**: The right column is narrower than full width (`lg:col-span-5`).
  → *Mitigation*: Tailor card padding (`p-3 sm:p-3.5`), reduce redundant whitespace, and keep buttons wrapping cleanly with `flex-wrap` and compact pill sizing.
