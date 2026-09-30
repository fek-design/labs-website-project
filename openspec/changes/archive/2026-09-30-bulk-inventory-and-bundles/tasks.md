## 1. Database Schema & Migration

- [x] 1.1 Add `TrackingType` enum (`SERIALIZED`, `BULK`), `trackingType` and `totalQuantity` fields to `Inventory` in `prisma/schema.prisma`
- [x] 1.2 Add `BundleItem` relation table (`parentInventoryId`, `accessoryInventoryId`, `defaultQuantity`) in `prisma/schema.prisma`
- [x] 1.3 Add `quantity` and `returnedQty` fields to `Loan` in `prisma/schema.prisma`
- [x] 1.4 Run Prisma migration / push and generate Prisma Client

## 2. Server Actions for Bulk Inventory & Bundles

- [x] 2.1 Update `createInventoryItem` and `updateInventoryItem` in `app/actions/inventory.ts` to support `trackingType`, `totalQuantity`, and automated shared barcode generation
- [x] 2.2 Add server actions to manage bundle item relationships (`assignBundleItem`, `removeBundleItem`, `getBundleItems`)
- [x] 2.3 Update `getInventoryWithFilters` to dynamically compute `availableQuantity` for bulk inventory pools

## 3. Server Actions for Multi-Quantity POS Loaning & Returns

- [x] 3.1 Update `checkoutEquipment` in `app/actions/pos.ts` to support item checkout quantities and non-blocking soft stock checks
- [x] 3.2 Update `returnEquipment` and `returnMultipleLoans` in `app/actions/pos.ts` to support partial quantity returns on multi-quantity loans
- [x] 3.3 Update `searchPatronOrAsset` and `getLabInventory` to include tracking mode and bundle companion accessories

## 4. Admin Inventory Management UI

- [x] 4.1 Update `InventoryItemModal.tsx` to include tracking mode toggle (`SERIALIZED` vs `BULK`), pool stock inputs, and shared barcode info
- [x] 4.2 Add bundle accessories editor into `InventoryItemModal.tsx` for configuring linked accessories and default quantities
- [x] 4.3 Update `InventoryListView.tsx` and `InventoryGridView.tsx` with bulk stock indicators and tracking type badges

## 5. POS Front Desk Checkout & Return Experience

- [x] 5.1 Update scanning heuristic in `EquipmentPOS.tsx` to increment quantity when scanning an already-carted bulk asset tag
- [x] 5.2 Build companion bundle recommendation drawer/toast in `EquipmentPOS.tsx` triggered upon scanning serialized gear
- [x] 5.3 Update `CheckoutCart.tsx` with quantity steppers (`[-] [Qty] [+]`) and soft stock warnings for bulk items
- [x] 5.4 Update `ActiveSessionPanel.tsx` and `ActiveLoansTable.tsx` to display loan quantities and support partial quantity check-ins

## 6. Verification & End-to-End Testing

- [x] 6.1 Verify bulk item creation, shared barcode generation, and bundle preset configuration in the inventory tab
- [x] 6.2 Test POS bundle auto-suggestion checkout, standalone bulk checkout, and partial quantity returns
