## 1. Direct Entrypoint & Route Consolidation

- [x] 1.1 Replace `app/admin/page.tsx` with direct rendering of `AdminConsoleClient` preloaded with POS stats, eliminating the intermediate landing prepage.
- [x] 1.2 Reconcile `app/admin/pos/page.tsx` to redirect to `/admin`, avoiding broken links.
- [x] 1.3 Clean up remnants of the standalone prepage across internal navigation links.

## 2. Borderless Icon Highlighting & Visual Cleanup

- [x] 2.1 Remove the bounding square box and side accent colored strip from the active tab in `components/admin/AdminSidebarNav.tsx`.
- [x] 2.2 Implement borderless icon illumination with category accent color, drop-shadow glow, and scale feedback for active tabs.

## 3. Expandable Detailed Sidebar Drawer

- [x] 3.1 Implement expandable drawer toggle state in `components/admin/AdminSidebarNav.tsx` transitioning between compact (`w-20`) and detailed (`w-64`).
- [x] 3.2 Display category titles, operational descriptions, and badge indicators when sidebar is expanded.
- [x] 3.3 Synchronize content padding in `AdminConsoleClient` (`pl-20` to `pl-64`) with smooth transitions.

## 4. Interactive Clickable Lab Switcher

- [x] 4.1 Introduce interactive clickable lab switchers (`medialab`, `makerspace`, `dimselab`) in the administrative console header.
- [x] 4.2 Connect active lab context to `EquipmentPOS` and inventory views for immediate reactive switching.

## 5. Verification & Quality Assurance

- [x] 5.1 Verify direct navigation from login to `/admin` loads the POS console directly.
- [x] 5.2 Verify active navigation icons render cleanly without square boxes or side accent strips.
- [x] 5.3 Verify expanding and collapsing the sidebar operates smoothly with full descriptive text.
- [x] 5.4 Verify clicking lab options switches lab context without page reloads.
