## 1. Database Schema & Server Actions for Reusable Bundles

- [x] 1.1 Update `prisma/schema.prisma` with `Bundle`, `BundleItem`, and `EquipmentBundleAssignment` models to support standalone bundle presets and many-to-many equipment assignments
- [x] 1.2 Run `npx prisma db push` and `npx prisma generate` to apply database schema and regenerate Prisma client
- [x] 1.3 Implement server actions in `app/actions/inventory.ts` (`getBundlePresets`, `saveBundlePreset`, `deleteBundlePreset`, `setEquipmentBundles`)
- [x] 1.4 Update POS lookup actions (`searchPatronOrAsset`) in `app/actions/pos.ts` to aggregate companion accessories from all linked bundle presets

## 2. Inventory UI & POS Bundle Integration

- [x] 2.1 Build Bundle Preset management modal (`components/inventory/BundlePresetsModal.tsx`) allowing admins to create, edit, and delete reusable bundle presets outside of individual machines
- [x] 2.2 Update `InventoryItemModal.tsx` to include bundle assignment selectors, allowing operators to link reusable bundle presets to equipment items
- [x] 2.3 Update POS companion recommendation drawer in `EquipmentPOS.tsx` to display aggregated accessories from linked bundle presets

## 3. Landing Navbar Smart Scroll Direction

- [x] 3.1 Update `components/landing/LandingHeader.tsx` scroll listener to compare `currentScrollY` with previous scroll position
- [x] 3.2 Add conditional translate styles (`-translate-y-full` on scroll down, `translate-y-0` on scroll up / top) with smooth transitions
- [x] 3.3 Ensure mobile drawer remains fully visible and operable when toggled

## 4. Extensible Campus Scoping & Active Presentation Cleanup

- [x] 4.1 Update `components/landing/CampusContext.tsx` to preserve multi-campus typing and infrastructure while configuring `AVAILABLE_CAMPUSES = ["køge"]` with Makerspace & Medialab as active facilities
- [x] 4.2 Clean out Dimselab and inactive Roskilde references from public copy in `LandingHeader.tsx`, `LandingFooter.tsx`, and `MarqueeRibbon.tsx`
- [x] 4.3 Prune `dimselab` telemetry configurations from `MachineTelemetrySection.tsx` and disable multi-campus gate prompt in `FirstTimeCampusGate.tsx`
- [x] 4.4 Filter inactive Roskilde options from active location pickers in `InventoryItemModal.tsx` while preserving location prefix resolution logic

## 5. Elimination of Glow Effects

- [x] 5.1 Remove `drop-shadow(0 0 10px ${item.accentColor}80)` from active navigation icons in `components/admin/AdminSidebarNav.tsx`
- [x] 5.2 Remove `shadow-[0_0_...px]` neon indicators and radial glows from `FirstTimeCampusGate.tsx`, `CraftProcessSelector.tsx`, etc.
- [x] 5.3 Replace colored glow shadows (`shadow-[#...]/20`) across POS, Inventory, and Admin views with crisp neutral hairline borders

## 6. Verification & Quality Assurance

- [x] 6.1 Test bundle creation, assignment to multiple machines, and POS companion recommendation trigger
- [x] 6.2 Test landing page scrolling behavior on mobile and desktop
- [x] 6.3 Run `npm run build` to verify zero type regressions and clean compilation
