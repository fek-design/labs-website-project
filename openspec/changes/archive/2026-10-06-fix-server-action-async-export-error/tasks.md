## 1. Extract Pure Taxonomy & Location Utilities

- [x] 1.1 Create `lib/inventory-utils.ts` exporting `resolveLocationPrefix`, `LOCATION_PREFIX_MAP`, `CATEGORY_CODE_MAP`, and `LAB_PREFIX_MAP`.
- [x] 1.2 Remove the synchronous `export function resolveLocationPrefix` from `app/actions/inventory.ts`, importing it from `@/lib/inventory-utils`.
- [x] 1.3 Update `components/inventory/InventoryItemModal.tsx` to import `resolveLocationPrefix` from `@/lib/inventory-utils`.

## 2. Validation & Dev Server Verification

- [x] 2.1 Run `npx tsc --noEmit` to verify type safety and clean import resolution.
- [x] 2.2 Verify that the Next.js dev server starts and compiles without the `Server Actions must be async functions` error.
