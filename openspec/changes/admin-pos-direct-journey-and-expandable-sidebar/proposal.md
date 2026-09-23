## Why

The intermediate `/admin` dashboard landing page acts as an unnecessary stop in the lab staff workflow. When administrators log in, their immediate operational destination is the Point of Sale and inventory console (`Login -> Admin POS`). Additionally, the sidebar navigation has visual clutter (an unnecessary square border and a vertical side accent pill around the active tab icon) and needs an expandable detailed view that reveals category labels and descriptions. Finally, lab staff require direct, clickable switching between labs (Makerspace, Medialab, Dimselab) directly from the console navigation.

## What Changes

- **Direct Login -> Admin POS Journey**:
  - Remove the standalone intermediate prepage in `app/admin/page.tsx`.
  - Mount `AdminConsoleClient` directly at `/admin` as the default administrative root, with automated stats fetching so logging in lands directly on the operational POS console.
  - Redirect or reconcile `/admin/pos` to `/admin`, removing orphaned references.
- **Minimalist Icon Highlighting**:
  - Remove the bounding square box (`border border-zinc-700 bg-zinc-800/90`) around the active icon in `components/admin/AdminSidebarNav.tsx`.
  - Remove the small left accent colored vertical pill (`-left-3.5 top-1/2 w-1.5 h-6 rounded-r-full`) next to the active icon.
  - Highlight the active tab cleanly with pure icon color illumination (`item.accentColor`) and subtle scale/glow without enclosing boxes.
- **Expandable Detailed Sidebar**:
  - Enable the left navigation dock to extend from compact icon-only mode (`w-20` / 80px) to an expanded detailed panel (`w-64` / 256px) displaying tab titles, category descriptions, and badges.
  - Provide a toggle button at the top/bottom of the sidebar as well as smooth animated transitions.
- **Clickable Lab Switcher**:
  - Introduce interactive lab selection buttons (Makerspace, Medialab, Dimselab) in the navigation header, allowing staff to switch active lab context dynamically with immediate feedback in `EquipmentPOS` and inventory views.

## Capabilities

### New Capabilities
- `admin-direct-pos-and-expandable-navigation`: Direct login-to-POS routing, removal of admin prepage, clean borderless icon highlighting, expandable navigation drawer with detailed descriptions, and interactive lab switcher.

### Modified Capabilities
<!-- None: Backend loan and inventory mutation schemas remain identical -->

## Impact

- **UI Routing & Entrypoint**:
  - `app/admin/page.tsx`: Replaced with direct `AdminConsoleClient` entry point with initial POS stats.
  - `app/admin/pos/page.tsx`: Redirected or reconciled to `/admin`.
- **Components**:
  - `components/admin/AdminSidebarNav.tsx`: Clean active icon styling (no squares, no side accent strips), expandable state toggle (`w-20` to `w-64`), full labels and category details.
  - `app/admin/pos/AdminConsoleClient.tsx`: Dynamic padding offset (`pl-20` vs `pl-64`), interactive lab switcher state.
