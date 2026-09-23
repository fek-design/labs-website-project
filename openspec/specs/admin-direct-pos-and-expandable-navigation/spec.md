# admin-direct-pos-and-expandable-navigation Specification

## Purpose
Streamlines the administrative entry workflow directly to the operational POS console (eliminating intermediate prepages), removes visual clutter from active tab icons, introduces an expandable detailed navigation drawer, and enables interactive lab switching.

## Requirements

### Requirement: Direct Authentication to POS Console Journey
The system SHALL route authenticated administrators directly to the administrative POS console (`/admin`), eliminating the intermediate landing prepage.

#### Scenario: Navigating to /admin renders the POS console directly
- **WHEN** an authenticated administrator accesses `/admin`
- **THEN** the system SHALL immediately render the active operational console (`AdminConsoleClient`) without displaying an intermediate bento card landing page.

#### Scenario: Handling legacy /admin/pos references
- **WHEN** a user or internal link navigates to `/admin/pos`
- **THEN** the system SHALL seamlessly route to or display the `/admin` operational console without 404 errors or layout breaks.

### Requirement: Clean Borderless Active Tab Highlighting
The left navigation bar (`AdminSidebarNav.tsx`) SHALL present active navigation tabs with minimalist icon illumination, without enclosing square borders or adjacent accent color strips.

#### Scenario: Active tab visual rendering
- **WHEN** a category tab is active in the navigation bar
- **THEN** the system SHALL highlight the icon using its designated category color without rendering an enclosing bounding square box or a vertical accent side strip.

#### Scenario: Inactive tab hover feedback
- **WHEN** an administrator hovers over an inactive tab
- **THEN** the icon SHALL illuminate subtly without box borders, preserving a light, uncluttered visual rhythm.

### Requirement: Expandable Detailed Navigation Drawer
The navigation sidebar SHALL support expanding from a compact icon-only dock (`80px`) to a detailed drawer (`240px` / `256px`) revealing full titles, descriptions, and section metadata.

#### Scenario: Toggling sidebar expansion
- **WHEN** an administrator clicks the expand/collapse trigger on the sidebar
- **THEN** the sidebar width SHALL animate between compact (80px) and expanded (256px) states, smoothly adjusting main content padding.

#### Scenario: Displaying category details in expanded mode
- **WHEN** the sidebar is in expanded mode
- **THEN** the system SHALL display each category's full label, Danish subtitle, and operational description alongside its icon.

### Requirement: Interactive Clickable Lab Switcher
The administrative console SHALL provide interactive lab buttons enabling staff to toggle between operational lab contexts (`makerspace`, `medialab`, `dimselab`) with immediate UI reactivity.

#### Scenario: Switching active lab context
- **WHEN** an administrator clicks a lab selector option (e.g. "Makerspace" or "Medialab")
- **THEN** the active lab state SHALL update immediately and propagate to the active POS view and inventory filtering.
