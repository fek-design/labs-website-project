## Why

Several search bars, filter inputs, and barcode scanner inputs across both public and administrative interfaces still display yellow (`#FFED00`), cyan (`#009FE3`), or magenta (`#E6007E`) highlighted borders or focus rings when active or focused. The user explicitly requests removing all yellow and accented colored borders from all search bars across the platform, adopting a consistent, clean, and neutral border treatment (e.g. subtle `#333333` / `#444444` / `#555555`).

## What Changes

- **Public Catalogue Filter Bar (`components/catalogue/CatalogueFilterBar.tsx`)**: Remove cyan focus ring/border (`focus-within:border-[#009FE3]/60 focus-within:ring-1 focus-within:ring-[#009FE3]/40`) and replace with clean neutral focus border (`focus-within:border-[#555555]`).
- **POS Scanner & Search Input (`components/pos/ScannerInput.tsx`)**: Remove yellow focus border (`focus-within:border-[#FFED00]`) in default state, replacing with neutral border (`focus-within:border-[#555555]`). Retain functional scanner status feedback only for actual scans.
- **POS Equipment Filter Input (`components/pos/EquipmentPOS.tsx`)**: Remove yellow focus border (`focus:border-[#FFED00]`) and replace with neutral focus border (`focus:border-[#555555]`).
- **Makerspace Machine Hub Search (`components/makerspace/MakerspaceMachineHub.tsx`)**: Remove yellow focus border (`focus:border-[#FFED00]`) on search bar and replace with neutral focus border (`focus:border-[#555555]`).
- **Manuals Manager Search (`components/manuals/ManualsManager.tsx`)**: Remove yellow focus border and ring (`focus:border-[#FFED00] focus:ring-1 focus:ring-[#FFED00]`) and replace with neutral focus styling (`focus:border-[#555555]`).
- **Catalogue Admin Search (`components/catalogue/CatalogueAdminManager.tsx`)**: Remove magenta focus border and ring (`focus:border-[#E6007E] focus:ring-1 focus:ring-[#E6007E]`) and replace with neutral focus styling (`focus:border-[#555555]`).
- **Active Loans Search (`components/pos/ActiveLoansTable.tsx`)**: Remove cyan focus border (`focus:border-[#009FE3]`) on student/loan filter input and replace with neutral border (`focus:border-[#555555]`).
- **Manuals Catalog Modal Search (`components/makerspace/ManualsCatalogModal.tsx`)**: Remove cyan focus border (`focus:border-[#009FE3]`) and replace with neutral border (`focus:border-[#555555]`).
- **Craft Items Admin Search (`components/admin/CraftItemsManager.tsx`)**: Remove cyan focus border (`focus:border-[#009FE3]`) and replace with neutral border (`focus:border-[#555555]`).

## Capabilities

### Modified Capabilities
- `catalogue-index-and-filters`: Standardize search bar focus borders to neutral styling without cyan or colored highlight rings.
- `equipment-pos-dashboard`: Standardize POS scanner and filter inputs to neutral focus borders without yellow or colored accent borders.
- `makerspace-machine-hub`: Standardize machine search bar to neutral focus styling without yellow borders.
- `admin-manuals-management`: Standardize manuals search inputs to neutral focus styling without yellow borders or rings.
- `admin-catalogue-management`: Standardize catalogue management search bar to neutral focus styling without magenta borders or rings.

## Impact

- **UI Components**:
  - `components/catalogue/CatalogueFilterBar.tsx`
  - `components/pos/ScannerInput.tsx`
  - `components/pos/EquipmentPOS.tsx`
  - `components/makerspace/MakerspaceMachineHub.tsx`
  - `components/manuals/ManualsManager.tsx`
  - `components/catalogue/CatalogueAdminManager.tsx`
  - `components/pos/ActiveLoansTable.tsx`
  - `components/makerspace/ManualsCatalogModal.tsx`
  - `components/admin/CraftItemsManager.tsx`
- **Zero Data/DB Impact**: Pure styling/visual clean-up. No schema, action, or logic changes.
