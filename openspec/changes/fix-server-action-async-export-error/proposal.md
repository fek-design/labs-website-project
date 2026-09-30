## Why

Next.js App Router with Turbopack throws a build/startup error (`Error: Server Actions must be async functions`) because `resolveLocationPrefix` was exported as a synchronous function from `app/actions/inventory.ts`, which is marked with `"use server"`. In Next.js, all functions exported from `"use server"` files are compiled into Server Action RPC endpoints and must be async.

Exporting synchronous pure helper functions from server action files also causes client components (`InventoryItemModal.tsx`) to pull server action compilation stubs into client bundles. Moving `resolveLocationPrefix` and related taxonomy utility functions into a dedicated pure utility module (`lib/inventory-utils.ts`) resolves the startup error and cleanly separates client/server utility code.

## What Changes

- Create `lib/inventory-utils.ts` containing pure, synchronous inventory utilities (`resolveLocationPrefix`, `LOCATION_PREFIX_MAP`, `CATEGORY_CODE_MAP`, `LAB_PREFIX_MAP`).
- Update `app/actions/inventory.ts` to import `resolveLocationPrefix` from `lib/inventory-utils.ts` and remove synchronous exports from `"use server"`.
- Update `components/inventory/InventoryItemModal.tsx` to import `resolveLocationPrefix` from `lib/inventory-utils.ts` instead of `app/actions/inventory.ts`.
- Ensure all exported functions in `app/actions/inventory.ts` are strictly `async` functions complying with Next.js Server Action constraints.

## Capabilities

### New Capabilities
<!-- None: Pure architecture/bug fix -->

### Modified Capabilities
<!-- None: No spec-level requirement changes; functionality and requirements are preserved with skip_specs: true -->

## Impact

- **Affected Files**:
  - `lib/inventory-utils.ts` (new pure utility module)
  - `app/actions/inventory.ts` (removes sync export, imports utility)
  - `components/inventory/InventoryItemModal.tsx` (updates import source)
- **APIs/Dependencies**: Zero external dependencies; resolves Next.js Turbopack build failure on startup.
