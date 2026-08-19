## Why

The Zealand Medialab and Makerspace facilities require a fast, offline-first Point of Sale (POS) checkout scanner, inventory management dashboard, and loan schedule calendar for administrators and lab technicians. This provides barcode-driven checkout/return workflows, a real-time calendar schedule of active and upcoming returns, manual overdue tracking without cloud cron jobs, patron lookup, and real-time operational status monitoring under the Zealand Labs Open Spec visual contract.

## What Changes

- Create POS checkout scanning and equipment return interface (`EquipmentPOS`) for Medialab.
- Implement an interactive equipment loan calendar (`LoanCalendar`) supporting month and week views of active loans, scheduled return deadlines, and overdue items.
- Implement server actions for scanning patron student IDs, loan checkout transactions, equipment check-in/return, calendar range queries, and audit logging.
- Build loan telemetry, manual overdue inspector queries, and calendar event filters (conforming to the Zero Cloud Dependency Overdue Protocol).
- Create patron management and trust status toggling (`GOOD_STANDING`, `FLAGGED`, `BLOCKED`).
- Implement real-time inventory telemetry status switcher (`AVAILABLE`, `MAINTENANCE`, `BROKEN`) and repair log recording.
- Integrate the POS dashboard and calendar view into the admin route `/admin/pos` and dynamic lab shell `/labs/[slug]`.

## Capabilities

### New Capabilities
- `equipment-pos-dashboard`: POS interface for Medialab checkout/checkin, patron scanning, active loans management, loan schedule calendar view, overdue calculation, and audit trail.

### Modified Capabilities
<!-- None -->

## Impact

- Affected Code: `app/admin/pos/page.tsx`, `app/actions/pos.ts`, `components/pos/EquipmentPOS.tsx`, `components/pos/LoanCalendar.tsx`, `components/pos/CalendarDayCell.tsx`, `components/pos/LoanDetailModal.tsx`, `components/pos/OverdueTracker.tsx`, `components/pos/PatronDrawer.tsx`, `components/pos/ScannerInput.tsx`.
- Dependencies: `motion/react`, `@gsap/react`, `gsap`, `@prisma/client`, `lib/prisma.ts`, `lucide-react`.
- Security: Admin-gated Server Actions with AuditLog appending for every loan/return mutation.
