## MODIFIED Requirements

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
