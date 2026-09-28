## 1. Impeccable Skill Setup & Craft Foundation

- [x] 1.1 Install the `impeccable` skill files at `.agent/skills/impeccable/SKILL.md` and `.agents/skills/impeccable/SKILL.md`.
- [x] 1.2 Define and enforce Impeccable frontend craft rules (contrast floors >= 4.5:1, typography hierarchy, rhythm spacing, and elimination of AI visual cliches).

## 2. Sidebar Accent Colors Synchronization

- [x] 2.1 In `lib/admin-nav.ts`, update `ADMIN_NAV_ITEMS` accent colors to match target page canonical headers (`FRONT_DESK`: `#FFED00`, `INVENTORY`: `#009FE3`, `MAKERSPACE`: `#FFED00`, `CRAFTS`: `#E6007E`, `HISTORY`: `#009FE3`, `SETTINGS`: `#FFED00`).
- [x] 2.2 In `components/admin/AdminSidebarNav.tsx`, ensure active state icon fills, hover glow dropshadows, and active text badges reflect the synced page accent tokens.

## 3. Hierarchical Location-First Lab Category Selector

- [x] 3.1 In `components/admin/AdminSidebarNav.tsx`, declare hierarchical `CAMPUS_LOCATIONS` data structure grouping facilities by Campus (`Køge Campus` → `MediaLab`, `Makerspace`).
- [x] 3.2 In `components/admin/AdminSidebarNav.tsx`, render the expanded facility selector as a nested tree with location header and indented facility category items, maintaining clean 1-click toggling in collapsed mode.
- [x] 3.3 Align the nested location-facility selection across `components/settings/AdminSettingsView.tsx` and `components/inventory/InventoryManager.tsx`.

## 4. User Location & Facility Assignment (Database & Session)

- [x] 4.1 In `prisma/schema.prisma`, update the `Admin` model with `assignedCampus String? @default("Køge Campus")` and `assignedLabId Int?`, and run `npx prisma db push` and `npx prisma generate`.
- [x] 4.2 In `app/actions/settings.ts`, update `getAdminProfile` and `updateAdminCredentials` to fetch and persist `assignedCampus` and `assignedLabId`.
- [x] 4.3 In `components/settings/AdminSettingsView.tsx`, implement administrative UI controls to view, assign, and save an administrator's assigned campus and default facility.
- [x] 4.4 In `app/admin/pos/AdminConsoleClient.tsx`, hydrate session state on login so `activeLab` defaults to the authenticated user's assigned facility.

## 5. Project-Wide Impeccable UI/UX Polish Pass

- [x] 5.1 Audit and refine form inputs, button focus rings, and contrast across `AdminSettingsView`, `InventoryManager`, and `CraftItemsManager`.
- [x] 5.2 Refine typography, padding rhythm, and micro-interactions in public landing pages (`PrototypeCarousel.tsx`, `LandingHeader.tsx`, `FirstTimeCampusGate.tsx`).

## 6. Validation & Verification

- [x] 6.1 Run TypeScript compiler validation (`npx tsc --noEmit`).
- [x] 6.2 Run OpenSpec change validation (`openspec validate impeccable-nested-locations-sidebar-accents`).
