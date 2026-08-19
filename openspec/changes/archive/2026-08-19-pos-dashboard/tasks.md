## 1. Backend Server Actions & Data Layer

- [x] 1.1 Create `app/actions/pos.ts` with Server Actions: `searchPatronOrAsset`, `getPatronDetails`, `createOrUpdatePatron`, `checkoutEquipment`, `returnEquipment`, `getOverdueLoans`, `getCalendarLoans`, and `getLabInventory`
- [x] 1.2 Implement atomic transaction handling and `AuditLog` generation in `app/actions/pos.ts`

## 2. POS UI & Telemetry Components

- [x] 2.1 Build `components/pos/ScannerInput.tsx` with barcode scanning support, auto-focus, and quick mode switching
- [x] 2.2 Build `components/pos/PatronCard.tsx` with student trust status indicator, active loans list, and status toggle
- [x] 2.3 Build `components/pos/CheckoutCart.tsx` with item list, expected return date picker, and confirmation
- [x] 2.4 Build `components/pos/ActiveLoansTable.tsx` with search, filter, fast check-in action, and damage/repair prompt
- [x] 2.5 Build `components/pos/OverdueInspector.tsx` for real-time overdue loan monitoring and overdue age display
- [x] 2.6 Build `components/pos/LoanCalendar.tsx` with monthly/weekly grid views, CMYK status badge rendering, month navigation, and day selection
- [x] 2.7 Build `components/pos/LoanDetailModal.tsx` for inspecting calendar loan details and initiating quick check-in
- [x] 2.8 Assemble the master `components/pos/EquipmentPOS.tsx` combining Scanner, Active Loans, Calendar Schedule, and Overdue Inspector views

## 3. Pages & Dynamic Shell Integration

- [x] 3.1 Create `/admin/pos` page with full POS dashboard and calendar schedule capabilities
- [x] 3.2 Update `/app/labs/[slug]/page.tsx` dynamic lab shell to inject `EquipmentPOS` for `medialab`
- [x] 3.3 Verify checkout, return checkin, calendar event visualization, overdue filtering, and audit log generation end-to-end
