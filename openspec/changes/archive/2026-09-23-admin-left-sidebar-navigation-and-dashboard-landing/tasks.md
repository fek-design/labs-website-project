## 1. Icon Assets & Navigation Registry

- [x] 1.1 Install `@phosphor-icons/react` or configure Phosphor icon components.
- [x] 1.2 Create `lib/admin-nav.ts` with the declarative `ADMIN_NAV_ITEMS` registry, typed IDs, icons, titles, CMYK accent tokens, and clear documentation on extending the list for UX.

## 2. Left-Hand Docked Sidebar Component

- [x] 2.1 Build `components/admin/AdminSidebarNav.tsx` matching Figma frame `#79:835` (80px fixed width, `#151517` background, 40x40px icon buttons, hover tooltips, and active state highlights).
- [x] 2.2 Implement bottom dock actions in `AdminSidebarNav`: local node status telemetry, public portal link, and logout trigger.

## 3. Admin Console Client Layout Integration

- [x] 3.1 Refactor `app/admin/pos/AdminConsoleClient.tsx` to integrate `AdminSidebarNav` with appropriate content offset (`pl-20`).
- [x] 3.2 Remove the legacy top horizontal tab bar while preserving active sub-view state mechanics (`FRONT_DESK`, `INVENTORY`, `MAKERSPACE`, `CRAFTS`, `HISTORY`, `SETTINGS`).

## 4. Admin Dashboard Landing Page Refresh

- [x] 4.1 Update `app/admin/page.tsx` with high-contrast surfaces, refined typography, and layout structure matching Figma frames `#79:827` and `#79:2063`.
- [x] 4.2 Verify that all Prisma server-side count queries and offline fallback handling remain strictly intact.

## 5. Verification & Quality Assurance

- [x] 5.1 Verify seamless tab switching across all admin operational workspaces via the left sidebar icons.
- [x] 5.2 Verify hover tooltip labels, active indicators, and responsive constraints.
- [x] 5.3 Verify the updated `/admin` landing page displays accurate telemetry and links to POS desk.
