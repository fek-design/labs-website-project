## 1. Global Topbar Removal & Controls Relocation

- [x] 1.1 Remove the persistent `<header>` from [AdminConsoleClient.tsx](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/app/admin/pos/AdminConsoleClient.tsx) across all admin views.
- [x] 1.2 Verify and refine [AdminSidebarNav.tsx](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/components/admin/AdminSidebarNav.tsx) so the active lab switcher, public site jump ("Offentligt Site"), and logout button are cleanly accessible in both collapsed and expanded states.
- [x] 1.3 Adjust main viewport container padding in [AdminConsoleClient.tsx](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/app/admin/pos/AdminConsoleClient.tsx) to provide balanced vertical spacing now that the topbar header is removed.

## 2. Clickable Date Activity Cards in Loan Calendar

- [x] 2.1 Update [LoanCalendar.tsx](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/components/pos/LoanCalendar.tsx) to accept an `onSelectLoan: (loan: any) => void` prop and eliminate the separate `LoanDetailModal` popup.
- [x] 2.2 Make each individual loan card in the date activity feed of [LoanCalendar.tsx](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/components/pos/LoanCalendar.tsx) interactive and clickable (`cursor-pointer`, hover border highlight, click triggers `onSelectLoan(loan)`).
- [x] 2.3 Connect `onSelectLoan` in [EquipmentPOS.tsx](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/components/pos/EquipmentPOS.tsx) to set `inspectedLoan` state and sync `activePatron`.

## 3. Embedded Loan Status & Verification in Active Session Panel

- [x] 3.1 Update [ActiveSessionPanel.tsx](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/components/pos/ActiveSessionPanel.tsx) to accept `inspectedLoan` and `onClearInspectedLoan` props.
- [x] 3.2 Implement the "LOAN STATUS & VERIFICATION" UI layout inside [ActiveSessionPanel.tsx](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/components/pos/ActiveSessionPanel.tsx) per the Figma design:
  - Header: "LOAN STATUS & VERIFICATION" with status pill (`CHECKED OUT`, `OVERDUE`, `RETURNED`, `DAMAGED`) and Close (X) button.
  - Card 1: Equipment Asset (item name, tag `[ML-CAM-0001]`, lab name).
  - Card 2: Borrower Patron (Student ID, email).
  - Card 3: 2-column "Checked Out" vs "Expected Return" (yellow `#FFED00`).
  - Card 4: Notes (with placeholder or existing note).
- [x] 3.3 Add inline action handlers within [ActiveSessionPanel.tsx](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/components/pos/ActiveSessionPanel.tsx) for:
  - "Check In Equipment" (executes return mutation, toasts confirmation, refreshes data).
  - "Extend / Edit" (inline date picker & notes update).
  - "Flag Damage" (inline damage note input & maintenance status update).
  - "Close" (clears `inspectedLoan`, reverting to standard session workspace).
- [x] 3.4 Wire [EquipmentPOS.tsx](file:///Users/felix/Library/CloudStorage/CloudMounter-FelixK/Macbook/GIT/labs-website-project/components/pos/EquipmentPOS.tsx) so that selecting an activity card automatically focuses the active session workspace.

## 4. End-to-End Verification & Validation

- [x] 4.1 Run TypeScript type check (`npx tsc --noEmit`) to verify zero errors across all components.
- [x] 4.2 Verify in browser: clicking an activity card loads the loan into Active Session, all inline actions work without modal dialogs, and admin views render cleanly without the persistent topbar.
