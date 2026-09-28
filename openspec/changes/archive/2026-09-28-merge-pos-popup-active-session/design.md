## Context

See [proposal.md](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/openspec/changes/merge-pos-popup-active-session/proposal.md) for motivation.

Currently, `LoanCalendar.tsx` opens a modal popup (`LoanDetailModal.tsx`) when an administrator clicks "Forlæng leje periode +". Meanwhile, `ActiveSessionPanel.tsx` sits below the calendar, managing active checkouts and bulk returns, but lacks direct inspection of scheduled loans. Additionally, `AdminConsoleClient.tsx` renders a sticky topbar `<header>` that takes up vertical height across all operational tabs while duplicating controls already present in `AdminSidebarNav.tsx`.

## Goals / Non-Goals

**Goals:**
- Eliminate the separate `LoanDetailModal` popup; merge the "LOAN STATUS & VERIFICATION" design directly into `ActiveSessionPanel.tsx`.
- Make every individual card in the Date Activity feed (`LoanCalendar.tsx`) clickable so clicking immediately loads that loan and patron into `ActiveSessionPanel.tsx`.
- Support full verification, extension/edit, damage flagging with repair logs, and check-in directly within `ActiveSessionPanel.tsx`.
- Remove the persistent sticky `<header>` topbar from `AdminConsoleClient.tsx` across all admin views.
- Ensure all necessary components from the topbar (lab switcher, public portal link, logout, and workspace context) are cleanly accessible in `AdminSidebarNav.tsx`.

**Non-Goals:**
- Modifying the underlying database schema or prisma models.
- Changing authentication mechanisms or student account policies (remains Zero Cloud, admin-only).
- Altering the public portal views (`/`, `/catalogue`, etc.).

## Decisions

### Decision 1: ActiveSessionPanel Embedded Loan Verification View
- **Rationale**: The user provided an exact UI design for "LOAN STATUS & VERIFICATION" with 4 structured card blocks and 4 actions (Close, Extend / Edit, Flag Damage, Check In Equipment). By embedding this directly into `ActiveSessionPanel.tsx` when an `inspectedLoan` is active, administrators get a dedicated, high-contrast, inline workspace without modal dialogs blocking other dashboard elements.
- **State flow**:
  - `inspectedLoan` state is managed at `EquipmentPOS.tsx` level (or inside `ActiveSessionPanel.tsx`).
  - When `inspectedLoan` is present, `ActiveSessionPanel` renders the "LOAN STATUS & VERIFICATION" view.
  - When `Close` or "RYD SESSION" is clicked, or after a successful check-in/extension, `inspectedLoan` is cleared, returning the panel to the standard patron avatar & scan checkout/return view.
- **Alternatives Considered**:
  - *Keep modal but style it better*: Rejected per explicit user directive to merge it into the active session tab.
  - *Show both checkout cart and verification side-by-side*: Too cramped on standard screens; having the verification state occupy the right workspace column or full panel provides clean focus and matches the Figma reference.

### Decision 2: Clickable Date Activity Cards in LoanCalendar
- **Rationale**: The date activity schedule on the right side of the calendar lists all loans and returns for the chosen date. Making each card directly clickable (`cursor-pointer`, hover border highlight `#009FE3` / `#FFED00`) provides an intuitive one-click workflow to inspect or return any scheduled item.
- **Implementation**:
  - Replace the isolated "Forlæng leje periode +" button with card-level click handler `onSelectLoan(loan)`.
  - Pass `onSelectLoan` from `EquipmentPOS.tsx` down to `LoanCalendar.tsx`.
  - In `handleSelectLoan(loan)`:
    - Sets `inspectedLoan` to the selected loan.
    - Sets `activePatron` to `loan.patron` (syncing student details).
    - Sets `sessionMode` to `"RETUNERING"` or verification mode.

### Decision 3: Removal of Global Topbar Header & Relocation of Controls
- **Rationale**: The sticky `<header>` in `AdminConsoleClient.tsx` duplicates what `AdminSidebarNav.tsx` already handles (Brand link, Lab switcher, Public site jump, Logout). Removing it reclaims 64px of vertical space across all tabs (`FRONT_DESK`, `INVENTORY`, `MAKERS`, `AUDIT`, `SETTINGS`, `CRAFT`).
- **Placement**:
  - **Lab Switcher**: Maintained in `AdminSidebarNav.tsx` with clear visual indicator in both collapsed state (click cycles lab or opens quick flyout) and expanded state (3-button grid).
  - **Public Portal Link ("Offentligt Site")**: Preserved in `AdminSidebarNav.tsx` footer with icon and label.
  - **Logout**: Preserved in `AdminSidebarNav.tsx` footer.
  - **Page Padding**: Adjust top padding of the main container in `AdminConsoleClient.tsx` from sticky header offset to a clean `py-6 px-6 sm:px-8` layout.

## Risks / Trade-offs

- **[Risk] Scanned checkout cart collision**: An admin may have items in the checkout cart and then click an activity card.
  → *Mitigation*: Store `scannedItems` separately from `inspectedLoan`. When inspecting a loan, the verification view takes active focus; clicking "Close" restores the checkout cart without data loss.
- **[Risk] Discoverability of clickable cards**: Users might not know cards in the activity feed are clickable.
  → *Mitigation*: Add subtle hover feedback (`hover:border-[#009FE3]`, `cursor-pointer`, and a micro-pill "Klik for at åbne" or chevron).
