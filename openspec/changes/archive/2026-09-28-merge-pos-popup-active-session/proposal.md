## Why

The current admin interface suffers from two UX friction points:
1. When viewing scheduled or overdue loans in the date activity feed, inspecting a loan launches a floating modal popup (`LoanDetailModal`). This disconnects the administrator from the primary checkout and return workspace (`ActiveSessionPanel`), creating unnecessary modal clicks, backdrop obstruction, and duplicated return actions.
2. The global admin console topbar (`<header>` in `AdminConsoleClient`) occupies vertical viewport space across every view while redundantly repeating navigation controls (brand link, lab switcher, public site jump, and logout) that already exist within the docked/expandable left sidebar navigation (`AdminSidebarNav`).

Merging the loan verification details directly into the active session panel, making activity cards directly clickable to load sessions, and eliminating the redundant topbar across all admin views streamlines operator workflow into a unified, high-efficiency single-screen console.

## What Changes

- **Clickable Activity Feed Cards**: In the Date Activity feed (`LoanCalendar.tsx`), clicking on any individual loan card automatically inserts that loan and its associated patron into the Active Session panel for immediate inspection or action.
- **Embedded Loan Verification in Active Session**: The Loan Status & Verification popup (`LoanDetailModal.tsx`) is merged directly into the `ActiveSessionPanel.tsx`:
  - When a loan is loaded (via activity card click or scanner match), the Active Session panel displays the full verification interface: Equipment Asset details (with name, asset tag, lab), Borrower Patron details (student ID, email), checkout and expected return dates with overdue tracking, and notes.
  - Contextual actions are directly actionable inline: "Check In Equipment", "Extend / Edit", "Flag Damage" (with repair log & maintenance notes), and "Close / Deselect".
  - Preserves standard scan-and-checkout mode when no specific existing loan is selected for verification.
- **Removal of Global Topbar Header**: The persistent top navigation header (`<header>`) in `AdminConsoleClient.tsx` is removed from all admin views.
- **Relocation of Essential Topbar Controls**:
  - The Lab Switcher (Makerspace, Medialab, Dimselab), Public Site link ("Offentligt Site"), and Logout action are verified and made prominently accessible in `AdminSidebarNav` in both compact and expanded states.
  - Active view titles and breadcrumbs are cleanly integrated into the view layouts or sidebar indicators without dedicated topbar chrome.

## Capabilities

### New Capabilities
*(None)*

### Modified Capabilities
- `equipment-pos-dashboard`: Activity schedule cards become clickable to auto-insert loans into the active session workspace, and loan verification, extension, damage flagging, and check-in actions are rendered directly within the active session panel instead of an external popup modal.
- `admin-navigation-and-dashboard`: The global persistent topbar header across all operational views is removed, and its controls (lab switcher, public portal jump, session actions) are streamlined into the sidebar and view contexts.

## Impact

- **Affected Files**:
  - `components/pos/EquipmentPOS.tsx` (state wiring for selected loan inspection, auto-inserting clicked loans into active session)
  - `components/pos/ActiveSessionPanel.tsx` (merging loan verification layout, edit/extend form, damage reporting, and inline check-in)
  - `components/pos/LoanCalendar.tsx` (making individual activity cards interactive and clickable, emitting loan selection)
  - `components/pos/LoanDetailModal.tsx` (phased out / superseded by embedded active session panel verification)
  - `app/admin/pos/AdminConsoleClient.tsx` (removal of global `<header>` across all views)
  - `components/admin/AdminSidebarNav.tsx` (ensuring prominent lab switching and portal controls in compact & expanded states)
- **APIs/Actions**: Uses existing local Server Actions (`returnEquipment`, `modifyLoan`, `checkoutEquipment`). Zero cloud dependencies or schema migrations required.
