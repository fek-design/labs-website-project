## Why

The POS and Makerspace modules require targeted refinement:
1. **Search & Spec Audit**: Makerspace machines need a dedicated search filter and removal of fake placeholder specifications.
2. **Date Offset & Status Refinement**: Fix the one-day-behind calendar date calculation bug caused by UTC date parsing, update equipment status to read "checked out", and show expected vs. actual check-in date comparisons.
3. **Manual Document Management**: Enable uploading of PDF manuals stored locally and linked directly to machine profiles.
4. **State Impurity & Auth**: Fix React state updater impurity in `EquipmentPOS` (asynchronous side-effects inside `setActivePatron`), implement a base authentication login gate (`admin` / `pass`), and refresh mock database test data.

## What Changes

- **Makerspace Machine Search & Audit**: Add machine search bar, filter by category/status, and remove fake specs from machines.
- **Calendar Timezone / Day Offset Fix**: Fix UTC ISO slicing so expected return dates and checkout days match the patron's local calendar day without off-by-one errors.
- **Check-in Comparison & "Checked Out" Status**: Display "checked out" explicitly on active gear, and render comparative tracking info (e.g. Returned on time / X days early / X days late) between `actualReturn` and `expectedReturn`.
- **Manuals PDF Upload & Linking**: Add local multipart PDF file upload server action and link uploaded manuals to machine custom fields.
- **Base Authentication & Clean Seed Reset**: Implement basic login screen with temporary credentials (`admin` / `pass`), secure session cookie, and provide a clean test dataset in `prisma/seed.ts`.
- **React State Purity Fix**: Remove async `.then()` calls from React state updaters to prevent cascading render-phase mutations and router loops.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `makerspace-machine-hub`: Dedicated machine search filter, removal of placeholder specs, PDF manual document upload and association.
- `equipment-pos-dashboard`: Timezone-safe calendar return date calculations, "checked out" status labeling, check-in comparison metadata, and pure synchronous state setters.
- `admin-history-settings`: Basic authentication gate with temporary credentials (`admin` / `pass`) and session validation.

## Impact

- **Database**: Clean database seed with realistic equipment and machines.
- **Server Actions**: `app/actions/upload.ts` (local PDF manual upload), `app/actions/auth.ts` (basic login/logout), and updated `app/actions/pos.ts` / `app/actions/inventory.ts`.
- **UI Components**: `components/makerspace/MakerspaceMachineHub.tsx`, `components/pos/LoanCalendar.tsx`, `components/pos/CalendarDayCell.tsx`, `components/pos/LoanDetailModal.tsx`, `components/pos/EquipmentPOS.tsx`, and `components/auth/LoginModal.tsx`.
