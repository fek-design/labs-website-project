## 1. Data Model & Server Actions

- [x] 1.1 Update `prisma/schema.prisma` to add `location` field to `Inventory`, push database changes, and update `prisma/seed.ts` with physical locations
- [x] 1.2 Update `app/actions/pos.ts` to remove patron trust status restrictions, support loan modification/extensions, and refine search heuristics
- [x] 1.3 Create `app/actions/inventory.ts` with Server Actions: `createInventoryItem`, `updateInventoryItem`, `deleteInventoryItem`, `getInventoryWithFilters`, and `getLocationList`
- [x] 1.4 Create `app/actions/history.ts` and `app/actions/settings.ts` with Server Actions: `getAuditLogs`, `updateAdminCredentials`, and `getSystemTelemetry`

## 2. Front Desk & POS UI Refinements

- [x] 2.1 Update `components/pos/CheckoutCart.tsx` with 1-month default return date and quick preset buttons (`+1w`, `+2w`, `+1mo`, `+2mo`)
- [x] 2.2 Update `components/pos/PatronCard.tsx` to remove trust status badges, add visual Student ID indicators, and fix patron clearing state persistence
- [x] 2.3 Update `components/pos/LoanDetailModal.tsx` with loan extension controls and notes editing
- [x] 2.4 Unify the Front Desk view in `components/pos/EquipmentPOS.tsx` to integrate the interactive calendar schedule and rapid check-in directly on the front landing view

## 3. Inventory, Makerspace, History & Settings Modules

- [x] 3.1 Build `components/inventory/InventoryManager.tsx` with physical location filtering (room/cabinet/shelf), category tags, status filters, and Add/Edit Item modal drawer
- [x] 3.2 Build `components/makerspace/MakerspaceMachineHub.tsx` displaying static machines, technical specifications, safety manuals, and maintenance logs without rentals
- [x] 3.3 Build `components/history/AuditHistoryView.tsx` with filterable audit log streams, action types, actor admins, and JSON delta viewers
- [x] 3.4 Build `components/settings/AdminSettingsView.tsx` for updating admin credentials and system configuration

## 4. Navigation Consolidation & Verification

- [x] 4.1 Update `app/admin/pos/page.tsx` and `app/page.tsx` with unified admin tabs and remove public lab shell routes
- [x] 4.2 Verify checkout flow, 1-month defaults, location filtering, Makerspace manual viewer, audit logs, and settings end-to-end
