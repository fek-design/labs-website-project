# Proposal: Reusable Bundle Presets, Responsive Scroll Navbar, Extensible Campus Scoping & Strip Glow Effects

## Why

1. **Repeated Bundle Definitions**: Currently, bundle companion items are directly bound to single inventory parents via `BundleItem(parentInventoryId, accessoryInventoryId)`. When a lab maintains multiple units of identical gear (e.g., ten Sony Alpha camera bodies), operators must duplicate the same companion accessory configurations repeatedly. Decoupling bundles into independent presets that exist outside any single machine and supporting a many-to-many relationship allows operators to define a bundle once (e.g., "Cinema Camera Kit: 2x Batteries, 1x Charger, 1x 128GB SD") and link it to multiple equipment assets.
2. **Landing Page Navigation Clutter**: The landing header currently remains statically pinned to the viewport top across all scroll depths, occluding content during downward reading. Implementing a directional smart scroll header that glides off-screen on downward scroll and reveals smoothly on upward scroll maximizes viewport canvas while maintaining instant access to navigation.
3. **Campus Scope & Future Expandability**: Zealand Labs operates actively at the Køge Campus with two physical facilities (`makerspace` and `medialab`). The application has established extensible multi-campus and location infrastructure (e.g. `CampusContext`, campus keys, location prefix mapping). Rather than destructively ripping out this logic, the architecture must be preserved for future campus rollouts, while configuring active availability strictly to Køge and deactivating/cleaning inactive Roskilde and Dimselab content from public copy, footer, and marquee.
4. **Visual Glow Effects**: Lingering neon glows (`drop-shadow(0 0 10px ...)`, `shadow-[0_0_...px]`, colored shadow halos `shadow-[#...]/20`) violate the authentic Zealand Labs Scandinavian design guidelines, creating unnecessary visual noise. Eliminating all glow effects aligns the application with clean, high-contrast surfaces and hairline border aesthetics.

## What Changes

- **Standalone Reusable Bundles (Many-to-Many)**:
  - Introduce an independent bundle model (`Bundle` / `BundlePreset`) containing metadata (name, description, default accessory items with quantities).
  - Model a many-to-many association between equipment/machines and bundles (`EquipmentBundleAssignment` join relation), allowing multiple machines to share a single bundle preset and a machine to have multiple bundle kits.
  - Provide administrative UI to create, edit, and delete bundle presets independently from any specific machine, as well as an intuitive selector within `InventoryItemModal` to assign/unassign bundle presets to equipment.
  - Update POS scan logic to automatically suggest companion items from all assigned bundle presets when scanning primary gear.
- **Smart Scroll-Directional Landing Navbar**:
  - Update `LandingHeader.tsx` to detect window scroll delta and direction.
  - Automatically translate the navbar up (`-translate-y-full`) when scrolling downward past a threshold (e.g. > 60px).
  - Reveal the navbar smoothly (`translate-y-0`) immediately upon scrolling upward or reaching the top of the page.
- **Extensible Campus Scoping (Køge Active, Preserving Architecture)**:
  - Preserve `CampusContext.tsx` multi-campus state and typing abstractions for future expandability, while configuring active available campuses strictly to `["køge"]` (with `makerspace` and `medialab`).
  - Keep location prefix resolution and taxonomy logic intact in `lib/inventory-utils.ts`, while filtering inactive Roskilde locations from active operational pickers.
  - Deactivate multi-campus gating prompt for visitors, smoothly defaulting to Køge.
  - Prune active Dimselab and Roskilde mentions from public copy, `LandingHeader.tsx`, `LandingFooter.tsx`, and `MarqueeRibbon.tsx`.
- **Remove All Glow Effects**:
  - Strip `drop-shadow(0 0 10px ${item.accentColor}80)` from `AdminSidebarNav.tsx`.
  - Strip all `shadow-[0_0_...px]` neon box shadows from indicators (e.g. `FirstTimeCampusGate.tsx`, `CraftProcessSelector.tsx`).
  - Replace saturated colored button/card shadows (`shadow-[#FFED00]/20`, `shadow-[#E6007E]/20`, `shadow-[#009FE3]/20`) with clean, crisp, neutral hairline borders and authentic surfaces.

## Capabilities

### Modified Capabilities

- `bulk-inventory-and-bundles`: Support standalone bundle preset creation independent of parent machines, many-to-many bundle-to-equipment associations, and POS companion suggestion resolution from linked bundle presets.
- `public-landing-portal`: Implement smart scroll-directional hiding/revealing navbar and scope public facility presentation strictly to active Køge Campus (`makerspace` and `medialab`) while preserving multi-campus foundation for future expandability.
- `visual-toolkits`: Mandate zero glow effects across all public and administrative interfaces, eliminating CSS neon drop-shadows, glow filters, and colored box-shadow halos in favor of crisp hairline borders and solid fills.

## Impact

- **Database (`prisma/schema.prisma`)**:
  - Add `Bundle` model (`id`, `name`, `description`, `createdAt`, `updatedAt`).
  - Add `BundleItem` model linking `bundleId` to `accessoryInventoryId` with `defaultQuantity`.
  - Add join model `EquipmentBundleAssignment` linking `inventoryId` (parent machine/gear) to `bundleId`.
- **Server Actions (`app/actions/inventory.ts`, `app/actions/pos.ts`)**:
  - Add CRUD actions for independent bundle presets (`getBundlePresets`, `saveBundlePreset`, `deleteBundlePreset`).
  - Add actions to assign/unassign bundle presets to inventory items (`setEquipmentBundles`).
  - Update `searchPatronOrAsset` and scan resolution to return companion accessories aggregated from assigned bundle presets.
- **Admin UI Components**:
  - `components/inventory/InventoryItemModal.tsx`: Replace one-off accessory list with a reusable bundle preset picker and quick assignment manager.
  - Provide a bundle management interface (`BundlePresetsModal.tsx`) to manage standalone bundle presets.
  - `components/admin/AdminSidebarNav.tsx`: Remove drop-shadow glows from active navigation tab icons.
- **Public Landing UI Components**:
  - `components/landing/LandingHeader.tsx`: Scroll-direction observer for hide-on-scroll-down / show-on-scroll-up; update header brand text.
  - `components/landing/CampusContext.tsx`: Configure active available campus to Køge, preserving types and structure for future campuses.
  - `components/landing/MachineTelemetrySection.tsx`: Present active Makerspace & Medialab telemetry.
  - `components/landing/LandingFooter.tsx`, `components/landing/MarqueeRibbon.tsx`: Scope running sequence to active facilities.
