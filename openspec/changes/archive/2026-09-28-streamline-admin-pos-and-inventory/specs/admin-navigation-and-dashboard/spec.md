## MODIFIED Requirements

### Requirement: Docked Left-Hand Vertical Icon Navigation
The admin console interface (`/admin/pos`) SHALL feature a fixed, vertical left-hand navigation dock (`width: 80px` collapsed, `width: 256px` expanded) built with the design system dock surface (`#09090b`), right border (`#262626`), a prominent global lab switcher (`Makerspace (Køge)`, `MediaLab (Køge)`), and category icon triggers for all administrative operational workspaces.

#### Scenario: Rendering docked vertical navigation bar
- **WHEN** an authenticated administrator opens the admin console (`/admin/pos`)
- **THEN** the system SHALL render a fixed vertical left sidebar with the official dock surface (`#09090b`), right border (`#262626`), global lab switcher, and vertically centered icon triggers (40x40px).

#### Scenario: Switching operational views via icon click
- **WHEN** an administrator clicks any category icon in the left navigation dock
- **THEN** the system SHALL switch the active workspace view immediately (e.g. Front Desk, Inventory, Makerspace, Crafts, Audit History, Settings) without full page reloads or losing local session state.

#### Scenario: Active state visual feedback and tooltips
- **WHEN** an administrator hovers or activates a navigation icon
- **THEN** the system SHALL display an unambiguous active accent indicator (border/fill glow) and a crisp floating tooltip identifying the section name.

#### Scenario: Lab switching within navigation drawer and dock
- **WHEN** an administrator selects a lab facility from the global switcher in the navigation dock
- **THEN** the system SHALL update the active lab context across all operational modules (POS, Inventory, Makerspace) without requiring page reload.

## ADDED Requirements

### Requirement: Canonical Operational Page Header Standard
All administrative pages (POS, Inventory, Machines) SHALL adhere to the canonical page header structure established by the POS dashboard: `LABS` in white with the section name styled in `Stack Sans Notch` with brand accent color, administrator welcome greeting, and top live KPI metric counters.

#### Scenario: Rendering canonical page header in admin views
- **WHEN** an administrator navigates to any admin operational module
- **THEN** the page displays the unified `LABS [Section]` brand header with admin greeting and top KPI summary ribbon.
