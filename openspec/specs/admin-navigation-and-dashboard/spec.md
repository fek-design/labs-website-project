# admin-navigation-and-dashboard Specification

## Purpose
Provides a docked, vertical left-hand icon navigation architecture for the admin operational workspace and delivers a refreshed, high-contrast dashboard landing page adhering to Zealand Labs visual design tokens.

## Requirements

### Requirement: Docked Left-Hand Vertical Icon Navigation
The admin console interface (`/admin/pos`) SHALL feature a fixed, vertical left-hand navigation dock (`width: 80px` collapsed, `width: 256px` expanded) built with the design system dock surface (`#09090b`), right border (`#262626`), a hierarchical location-first lab category selector grouping facilities under their physical campus (`Køge Campus` → `MediaLab`, `Makerspace`), and category icon triggers whose active accent color tokens strictly cycle through the 3 canonical brand CMYK accents in order (`FRONT_DESK` `#FFED00` Yellow, `INVENTORY` `#009FE3` Cyan, `CATALOGUE` `#E6007E` Magenta, `MANUALS` `#FFED00` Yellow, `HISTORY` `#009FE3` Cyan, `SETTINGS` `#E6007E` Magenta) with exactly one distinct accent color assigned per tab.

#### Scenario: Rendering docked vertical navigation bar
- **WHEN** an authenticated administrator opens the admin console (`/admin/pos`)
- **THEN** the system SHALL render a fixed vertical left sidebar with the official dock surface (`#09090b`), right border (`#262626`), global lab switcher, and vertically centered icon triggers (40x40px).

#### Scenario: Switching operational views via icon click
- **WHEN** an administrator clicks any category icon in the left navigation dock
- **THEN** the system SHALL switch the active workspace view immediately across the 6 canonical sections (Front Desk, Inventory, Catalogue, Manuals, History, Settings) without full page reloads or losing local session state.

#### Scenario: Active state visual feedback and tooltips
- **WHEN** an administrator hovers or activates a navigation icon
- **THEN** the system SHALL display an unambiguous active accent indicator (border/fill glow) and a crisp floating tooltip identifying the section name.

#### Scenario: Lab switching within navigation drawer and dock
- **WHEN** an administrator selects a lab facility from the global switcher in the navigation dock
- **THEN** the system SHALL update the active lab context across operational modules (POS, Inventory, Manuals) without requiring page reload.

#### Scenario: Page-synchronized accent color highlighting
- **WHEN** an administrator activates a navigation tab
- **THEN** the sidebar icon and active glow SHALL display the exact cycled accent color token matching the target page: `#FFED00` for Front Desk, `#009FE3` for Inventory, `#E6007E` for Catalogue, `#FFED00` for Manuals, `#009FE3` for History, and `#E6007E` for Settings.

#### Scenario: Hierarchical location-nested lab selection
- **WHEN** an administrator expands the sidebar navigation panel
- **THEN** the facility switcher presents an explicit location hierarchy header ("Køge Campus") containing indented/nested facility category options ("MediaLab (Køge)" and "Makerspace (Køge)") indicating the active selection with real-time synchronized status.

### Requirement: Extendable Administrative Navigation Registry
The navigation dock SHALL be driven by a centralized, typed declarative registry (`ADMIN_NAV_ITEMS`) that defines operational category items for the navigation structure, strictly enforcing cyclic 3-accent cadence in tab order: Front Desk (`#FFED00` Yellow), Inventory (`#009FE3` Cyan), Catalogue (`#E6007E` Magenta), Manuals (`#FFED00` Yellow), History (`#009FE3` Cyan), and Settings / User Management (`#E6007E` Magenta), housing the User & Role Management workspace with canonical design styling.

#### Scenario: Rendering navigation items from configuration
- **WHEN** the navigation bar mounts
- **THEN** the system SHALL iterate through the declarative registry to generate each icon button, tooltip, active styling, and route/view mapping for the core operational views including Settings / User Management.

#### Scenario: Extending the navigation system with a new tool
- **WHEN** a developer adds a new item configuration to the navigation registry
- **THEN** the navigation bar SHALL automatically render the new icon, tooltip, and view switcher in the correct position without layout regressions.

#### Scenario: Accessing User & Role Management via Settings
- **WHEN** an authenticated administrator opens the Settings tab
- **THEN** the system renders the canonical header with `LABS` brand, operator greeting, KPI metrics cluster, and provides access to the User & Role Management workspace.

### Requirement: Refreshed Admin Dashboard Landing Page
The administrative root landing portal (`/admin`) SHALL display a modernized, high-contrast visual interface matching Figma design specifications while strictly preserving database statistics logic and zero-cloud execution.

#### Scenario: Viewing dashboard statistics cards
- **WHEN** an administrator visits `/admin`
- **THEN** the system SHALL execute server-side count queries for borrowable gear, machines, and active loans, rendering the metrics inside high-contrast feature cards.

#### Scenario: Graceful fallback when database is disconnected
- **WHEN** the local database is offline or encountering connectivity issues
- **THEN** the `/admin` landing page SHALL render safely with zero-count fallbacks without crashing or displaying raw database errors.

#### Scenario: One-click launching into POS desk
- **WHEN** an administrator clicks "Launch POS Desk" or any feature module card on `/admin`
- **THEN** the system SHALL route the user directly to the corresponding admin console view.

### Requirement: Canonical Operational Page Header Standard
All administrative pages (POS, Inventory, Machines) SHALL adhere to the canonical page header structure established by the POS dashboard: `LABS` in white with the section name styled in `Stack Sans Notch` with brand accent color, administrator welcome greeting, and top live KPI metric counters.

#### Scenario: Rendering canonical page header in admin views
- **WHEN** an administrator navigates to any admin operational module
- **THEN** the page displays the unified `LABS [Section]` brand header with admin greeting and top KPI summary ribbon.
