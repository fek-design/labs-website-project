## Context

See `proposal.md` for motivation. Currently, administrative server actions accept untyped payloads and lack transaction concurrency protection. Furthermore, the application lacks `error.tsx`, `not-found.tsx`, and `loading.tsx` route boundaries, leaving clients vulnerable to unhandled Next.js error overlays if a local database hiccup occurs.

## Goals / Non-Goals

**Goals:**
- Provide strict runtime validation for all patron, inventory, and POS checkout mutations using Zod.
- Prevent duplicate checkouts, double barcode scans, and duplicate equipment registrations via atomic transactions and pre-flight validation.
- Standardize server action response contracts with safe error mapping that prevents schema/stack leakage.
- Prevent denial-of-service/flooding through a lightweight zero-cloud in-memory rate limiter.
- Deliver branded, dark-surface error boundaries and loading skeletons adhering to Zealand Labs design tokens (`#09090b` canvas, `#FFED00` focus ring, `font-notch` headers).

**Non-Goals:**
- Admin authentication refactoring, session HMAC signatures, and RBAC permission tables (strictly scoped to Phase A).
- Modifying Prisma database schemas or altering migrations.

## Decisions

### 1. Zod Validation & Standardized Action Responses
- **Choice**: Place reusable schemas in `lib/validations/pos.ts` and `lib/validations/inventory.ts`.
- **Response Shape**:
  ```ts
  export type ActionResponse<T> =
    | { success: true; data: T }
    | { success: false; error: string; code?: "VALIDATION_ERROR" | "DUPLICATE" | "RATE_LIMITED" | "SERVER_ERROR" };
  ```
- **Rationale**: Decouples UI error presentation from database internals. Prevents raw exceptions from crashing React Server Component tree.

### 2. Transactional Checkout Concurrency
- **Choice**: Wrap multi-item checkouts in `prisma.$transaction`.
- **Mechanism**: Before creating `Loan` records, verify that all target assets have `operationalStatus === "AVAILABLE"` and no concurrent `Loan` with `status === "ACTIVE"`.
- **Rationale**: Protects against double-scans and concurrent checkout requests from multiple technicians on the local network.

### 3. Inventory Creation Deduplication
- **Choice**: Pre-flight duplicate check on `name` (normalized lowercase/trim) within the same `labId` and `location`.
- **Rationale**: Prevents accidental double-clicks in `InventoryManager` creating duplicate entries with consecutive asset tags.

### 4. Zero-Cloud In-Memory Rate Limiter
- **Choice**: Sliding-window Token Bucket in `lib/rate-limit.ts` using a native `Map<string, { tokens: number; lastRefill: number }>`.
- **Rationale**: Complies with the "Zero Cloud Dependency" mandate. An automated `setInterval` runs every 10 minutes to evict stale entries and prevent memory leaks.

### 5. Granular Error Boundaries
- **Choice**:
  - `app/error.tsx`: Root error boundary catching unexpected client-side rendering exceptions.
  - `app/admin/error.tsx`: Dedicated boundary with local network/database troubleshooting diagnostics for technicians.
  - `app/not-found.tsx`: Styled 404 page preserving brand aesthetics.
  - `app/admin/pos/loading.tsx`: Dark skeletal placeholder preventing layout shifts during POS hydration.

## Risks / Trade-offs

- **[Risk]** Rate limiting based on IP might throttle multiple technicians behind the same NAT/proxy in campus labs.
  → *Mitigation*: Set generous limits for trusted local subnets (60 search req/min, 30 checkout mutations/min) and key by `adminId` when authenticated.
- **[Risk]** In-memory rate limiter resets on server restart.
  → *Mitigation*: Fully acceptable for local campus operations; prevents persistent locks and requires no external Redis instance.
