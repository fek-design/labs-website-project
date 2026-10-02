## 1. Dependencies & Foundation

- [x] 1.1 Install `zod` dependency in `package.json`
- [x] 1.2 Implement `lib/rate-limit.ts` in-memory token bucket sliding window rate limiter with auto-eviction
- [x] 1.3 Implement `lib/errors.ts` database error interceptor mapping Prisma errors (`P2002`, `P2025`) to clean Danish user feedback

## 2. Validation Schemas & Action Wrappers

- [x] 2.1 Create `lib/validations/pos.ts` with Zod schemas for patron creation/updates, search queries, and checkout payloads
- [x] 2.2 Create `lib/validations/inventory.ts` with Zod schemas for equipment creation, updates, and maintenance status
- [x] 2.3 Refactor `app/actions/pos.ts` to validate inputs with Zod schemas and enforce rate limits on sensitive actions

## 3. Transactional Concurrency & Duplication Guardrails

- [x] 3.1 Implement atomic `prisma.$transaction` in `checkoutEquipment` in `app/actions/pos.ts` with operational status verification
- [x] 3.2 Implement duplicate detection in `createInventoryItem` in `app/actions/inventory.ts` preventing double-click creations
- [x] 3.3 Normalize patron inputs (trimming, lowercase email/studentId) in `createOrUpdatePatron` and handle unique conflicts gracefully

## 4. Error Boundaries & Fallback UI

- [x] 4.1 Create root `app/error.tsx` branded error fallback boundary with retry action
- [x] 4.2 Create administrative `app/admin/error.tsx` specialized for POS and inventory connection recovery
- [x] 4.3 Create custom `app/not-found.tsx` matching the Zealand Labs design system
- [x] 4.4 Create `app/admin/pos/loading.tsx` skeleton placeholder

## 5. Verification & Quality Assurance

- [x] 5.1 Test double-checkout prevention and rapid scan simulation
- [x] 5.2 Test rate limiter throttling under burst requests
- [x] 5.3 Run `npx tsc --noEmit` and verify clean compilation
