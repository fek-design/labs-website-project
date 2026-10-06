## 1. Public Catalogue Searchbar Neutral Focus Styling

- [x] 1.1 Remove cyan focus border and ring (`focus-within:border-[#009FE3]/60 focus-within:ring-1 focus-within:ring-[#009FE3]/40`) and apply neutral border (`focus-within:border-[#555555]`) in `components/catalogue/CatalogueFilterBar.tsx`

## 2. POS Scanner & Equipment Filter Neutral Focus Styling

- [x] 2.1 Update scanner container fallback border from `"border-[#333333] focus-within:border-[#FFED00]"` to `"border-[#333333] focus-within:border-[#555555]"` in `components/pos/ScannerInput.tsx`
- [x] 2.2 Replace yellow focus border (`focus:border-[#FFED00]`) with neutral border (`focus:border-[#555555]`) on equipment filter input in `components/pos/EquipmentPOS.tsx`
- [x] 2.3 Replace cyan focus border (`focus:border-[#009FE3]`) with neutral border (`focus:border-[#555555]`) on active loans filter input in `components/pos/ActiveLoansTable.tsx`

## 3. Makerspace & Manuals Searchbars Neutral Focus Styling

- [x] 3.1 Replace yellow focus border (`focus:border-[#FFED00]`) with neutral border (`focus:border-[#555555]`) on machine search bar in `components/makerspace/MakerspaceMachineHub.tsx`
- [x] 3.2 Replace yellow focus border and ring (`focus:border-[#FFED00] focus:ring-1 focus:ring-[#FFED00]`) with neutral border (`focus:border-[#555555]`) in `components/manuals/ManualsManager.tsx`
- [x] 3.3 Replace cyan focus border (`focus:border-[#009FE3]`) with neutral border (`focus:border-[#555555]`) in `components/makerspace/ManualsCatalogModal.tsx`

## 4. Admin Catalogue & Craft Searchbars Neutral Focus Styling

- [x] 4.1 Replace magenta focus border and ring (`focus:border-[#E6007E] focus:ring-1 focus:ring-[#E6007E]`) with neutral border (`focus:border-[#555555]`) in `components/catalogue/CatalogueAdminManager.tsx`
- [x] 4.2 Replace cyan focus border (`focus:border-[#009FE3]`) with neutral border (`focus:border-[#555555]`) in `components/admin/CraftItemsManager.tsx`

## 5. Verification & Clean Compilation

- [x] 5.1 Run `npx tsc --noEmit` and confirm zero compilation errors
- [x] 5.2 Test search bar focus states interactively across public and admin interfaces
