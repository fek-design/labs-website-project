## 1. State Purity & React Render Lifecycle Fixes

- [x] 1.1 Refactor `EquipmentPOS.tsx` `refreshData` to eliminate async `.then()` calls inside `setActivePatron` and use pure synchronous state setters

## 2. Calendar & Status Logic Refinements

- [x] 2.1 Fix calendar date offset bug using local date string keys in `components/pos/LoanCalendar.tsx` and `CalendarDayCell.tsx`
- [x] 2.2 Update loan status display to explicitly read "checked out" and render expected vs. actual check-in comparison in `components/pos/LoanDetailModal.tsx`

## 3. Makerspace Search & PDF Manual Document Management

- [x] 3.1 Implement dedicated search bar and category filters in `components/makerspace/MakerspaceMachineHub.tsx` and audit/clean machine specification displays
- [x] 3.2 Create `app/actions/upload.ts` for PDF manual uploads and enable uploading/linking manuals directly in `MakerspaceMachineHub.tsx`

## 4. Base Authentication & Database Mock Data Reset

- [x] 4.1 Create `app/actions/auth.ts` and `components/auth/AuthGate.tsx` implementing login wrapper with temporary credentials (`admin` / `pass`)
- [x] 4.2 Update `prisma/seed.ts` with clean mock test data and execute database reset
- [x] 4.3 End-to-end verification of search, date accuracy, PDF manuals, auth login, and clean test data
