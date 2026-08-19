## Context

See `proposal.md` for motivation. The Medialab checkout workflow handles loan transactions for borrowable gear (`BORROWABLE_GEAR`) and requires calendar schedule visibility for planning, returns, and inventory availability. The system enforces Zero Cloud Dependency, meaning all data is strictly stored in local MySQL via Prisma ORM, and no automated external cloud cron or third-party calendar sync services exist.

## Goals / Non-Goals

**Goals:**
- Design a high-speed, keyboard/barcode-scanner optimized POS interface (`EquipmentPOS`).
- Build an interactive offline-first loan schedule calendar (`LoanCalendar`) displaying month and week timelines with color-coded status badges.
- Implement Server Actions in `app/actions/pos.ts` for patron lookup/creation, checkout, return/checkin, damage logging, overdue queries, and date-range calendar queries (`getCalendarLoans`).
- Build live telemetry panels with CMYK accent states (#FFED00, #E6007E, #009FE3), card base `#141414`, and pill geometry.
- Enforce AuditLog tracking on every mutation.
- Implement manual overdue calculation natively via Prisma queries.

**Non-Goals:**
- External calendar syncing (e.g. Google Calendar / Outlook integration - violates zero-cloud mandate).
- Automated email/SMS reminders (violates zero-cloud policy).
- Payment gateways (free educational lab loan system).
- Student logins (patrons only provide Student IDs).

## Decisions

### 1. Unified POS Scanner Architecture
- **Decision**: Provide a single universal search/barcode input in `EquipmentPOS` that can detect whether an input is a Patron Student ID (`PAT-...` / student email / number) or an Asset Tag (`ML-...` / `MS-...`).
- **Rationale**: Reduces friction at the checkout desk; the technician can scan a badge or an equipment barcode into the same active field.

### 2. Server Action Transactions for Checkout/Checkin
- **Decision**: Wrap loan checkout/checkin logic inside `prisma.$transaction` blocks to ensure the `Loan` status, `AuditLog`, and `Inventory` state changes occur atomically.
- **Rationale**: Prevents orphaned checkout records or desynced inventory availability states.

### 3. Native Date-Range Calendar Architecture
- **Decision**: Build `LoanCalendar` as a client component fetching loan schedules via Server Action `getCalendarLoans({ startDate, endDate, statusFilter })` spanning the rendered month window (including trailing/leading days). Include direct check-in modal triggers on event items.
- **Rationale**: Keeps rendering instantaneous without heavy external full-calendar dependencies, maintaining complete styling alignment with the Open Spec dark theme and CMYK badges.

### 4. Visual System & Micro-Interactions
- **Decision**: Use `motion/react` for smooth tab switches (Scanner, Active Loans, Calendar, Overdue), loan status badge transitions, and scan confirmation glows. Use Tailwind `@theme` CMYK tokens for telemetry states (Cyan `#009FE3` for active loans, Yellow `#FFED00` for returns expected today, Pink `#E6007E` for overdue/damaged).

## Risks / Trade-offs

- **[Concurrent Admin Actions on Same Asset]** → Mitigation: `prisma.$transaction` with conflict checking before creating a new active loan.
- **[High Density of Calendar Events on a Single Day]** → Mitigation: Show up to 3 loan pill badges per calendar cell with a "+N more" badge that opens the day's drawer view.
