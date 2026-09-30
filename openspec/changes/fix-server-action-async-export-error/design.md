## Context

See `proposal.md` for motivation. Next.js App Router (Turbopack) compiles any file with `"use server"` into Server Action entry points. Under Next.js conventions, all exported members from a `"use server"` file MUST be asynchronous functions (`async function`).

In `app/actions/inventory.ts`, `resolveLocationPrefix` was written and exported as a synchronous pure helper function:
```typescript
export function resolveLocationPrefix(location?: string | null): string { ... }
```
When imported by client components (e.g., `InventoryItemModal.tsx`), Next.js attempts to register it as an RPC action and fails build validation with:
`Error: Server Actions must be async functions.`

## Goals / Non-Goals

**Goals:**
- Eliminate the Next.js Turbopack startup and build error immediately.
- Extract synchronous taxonomy and location helpers (`resolveLocationPrefix`, `LOCATION_PREFIX_MAP`, `CATEGORY_CODE_MAP`, `LAB_PREFIX_MAP`) to a pure client/server-safe utility module `lib/inventory-utils.ts`.
- Update imports in both `app/actions/inventory.ts` and `components/inventory/InventoryItemModal.tsx`.
- Maintain 100% backward compatibility and behavioral correctness for 4-tier asset tags and location prefix resolution.

**Non-Goals:**
- Altering the asset tag taxonomy schema or database models.
- Changing Server Action signatures or return types.

## Decisions

### 1. Extract Pure Helpers to `lib/inventory-utils.ts`
- **Decision**: Create `lib/inventory-utils.ts` without `"use server"` directive, hosting pure string and mapping utilities:
  - `resolveLocationPrefix(location?: string | null): string`
  - `LOCATION_PREFIX_MAP`
  - `CATEGORY_CODE_MAP`
  - `LAB_PREFIX_MAP`
- **Rationale**: Next.js App Router strictly isolates Server Actions from pure client/server shared logic. Placing helpers in `lib/` allows both Server Components, Client Components, and Server Actions to import them synchronously with zero RPC runtime overhead or Turbopack compilation errors.
- **Alternatives Considered**: Making `resolveLocationPrefix` `async`. Rejected because client components calling a simple string prefix mapper should not incur network hops or asynchronous promise overhead.

### 2. Retain Pure Server Actions in `app/actions/inventory.ts`
- **Decision**: All exports in `app/actions/inventory.ts` (`generateAssetTag`, `getInventoryWithFilters`, `createInventoryItem`, `updateInventoryItem`, etc.) remain `async` Server Actions.

## Risks / Trade-offs

- **[Risk: Stale Import Paths]** Other components might attempt to import `resolveLocationPrefix` from `app/actions/inventory`.
  $\rightarrow$ *Mitigation*: Run `npx tsc --noEmit` and grep search across the codebase to ensure all import references point to `lib/inventory-utils`.
