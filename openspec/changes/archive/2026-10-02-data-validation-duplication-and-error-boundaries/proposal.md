## Why

Moving Zealand Labs from MVP to production requires strict data integrity, protection against user input mistakes and double-submissions, and resilience against network/database glitches. Currently, server actions lack runtime validation, barcode scanners or rapid double-clicks can generate duplicate asset or loan entries, and uncaught exceptions produce generic Next.js error crashes instead of graceful recovery interfaces.

## What Changes

- **Runtime Schema Validation with Zod**: Introduce domain-specific Zod schemas in `lib/validations/` for patrons, inventory items, and checkout/return transactions, rejecting invalid or oversized inputs before hitting Prisma.
- **Transactional Duplication & Concurrency Guardrails**: Implement `prisma.$transaction` locks in POS checkouts to ensure assets in `ACTIVE` loan status or non-`AVAILABLE` states cannot be checked out simultaneously or double-scanned.
- **Inventory Creation Deduplication**: Add pre-flight deduplication heuristics in `createInventoryItem` to prevent accidental duplicate equipment registrations caused by double-clicking or duplicate barcode labeling.
- **Database Error Interceptor**: Sanitize Prisma unique constraint violations (`P2002`) and database errors into human-friendly Danish feedback without exposing table schemas, stack traces, or SQL identifiers.
- **In-Memory Zero-Cloud Rate Limiter**: Deploy a token-bucket rate limiter in `lib/rate-limit.ts` to protect search endpoints and mutation actions from flooding and scanner loops.
- **Granular Error Boundaries & Skeletons**: Create `app/error.tsx`, `app/admin/error.tsx`, `app/not-found.tsx`, and `app/admin/pos/loading.tsx` adhering to the dark design system (`#151517` surfaces, `#FFED00` focus indicators, `font-notch` headers).

## Capabilities

### New Capabilities
- `resilience-and-error-boundaries`: Brand-aligned root and administrative error boundaries, 404 handler, and zero-cloud in-memory rate limiting for API/action flood protection.

### Modified Capabilities
- `equipment-pos-dashboard`: Strict Zod input validation, transactional concurrency locks for checkouts, and barcode double-scan idempotency.
- `database-setup`: Input normalization, duplicate asset prevention, and sanitized Prisma `P2002` error handling.

## Impact

- **Dependencies**: Adds `zod` to `package.json`.
- **Server Actions**: `app/actions/pos.ts` and `app/actions/inventory.ts` will parse inputs through Zod schemas and wrap mutations in safe response wrappers.
- **Routing & UX**: New `app/error.tsx`, `app/admin/error.tsx`, `app/not-found.tsx`, and `app/admin/pos/loading.tsx`.
