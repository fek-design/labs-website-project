# admin-navigation-and-dashboard Specification (Delta)

## MODIFIED Requirements

### Requirement: Docked Left-Hand Vertical Icon Navigation
The admin console interface (`/admin/pos`) SHALL feature a fixed, vertical left-hand navigation dock (`width: 80px` collapsed, `width: 256px` expanded) built with the design system dock surface (`#09090b`), right border (`#262626`), a hierarchical location-first lab category selector grouping facilities under their physical campus (`Køge Campus` → `MediaLab`, `Makerspace`), and category icon triggers whose active accent color tokens exactly match the primary header colors of the respective destination views (`FRONT_DESK` `#FFED00`, `INVENTORY` `#009FE3`, `CATALOGUE` `#FF9900`, `MANUALS` `#E6007E`, `HISTORY` `#009FE3`, `SETTINGS` `#FFED00`).

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
- **THEN** the sidebar icon and active glow SHALL display the exact accent color token matching the target page: `#FFED00` for Front Desk, `#009FE3` for Inventory, `#FF9900` for Catalogue, `#E6007E` for Manuals, `#009FE3` for History, and `#FFED00` for Settings.

#### Scenario: Hierarchical location-nested lab selection
- **WHEN** an administrator expands the sidebar navigation panel
- **THEN** the facility switcher presents an explicit location hierarchy header ("Køge Campus") containing indented/nested facility category options ("MediaLab (Køge)" and "Makerspace (Køge)") indicating the active selection with real-time synchronized status.

### Requirement: Extendable Administrative Navigation Registry
The navigation dock SHALL be driven by a centralized, typed declarative registry (`ADMIN_NAV_ITEMS`) that defines operational category items for the streamlined 6-tab navigation structure: Front Desk (`#FFED00`), Inventory (`#009FE3`), Catalogue (`#FF9900`), Manuals (`#E6007E`), History (`#009FE3`), and Settings (`#FFED00`), excluding deprecated standalone tabs for Makerspace machines and standalone crafts.

#### Scenario: Rendering navigation items from configuration
- **WHEN** the navigation bar mounts
- **THEN** the system SHALL iterate through the declarative registry to generate each icon button, tooltip, active styling, and route/view mapping for the 6 core operational views.

#### Scenario: Extending the navigation system with a new tool
- **WHEN** a developer adds a new item configuration to the navigation registry
- **THEN** the navigation bar SHALL automatically render the new icon, tooltip, and view switcher in the correct position without layout regressions.
