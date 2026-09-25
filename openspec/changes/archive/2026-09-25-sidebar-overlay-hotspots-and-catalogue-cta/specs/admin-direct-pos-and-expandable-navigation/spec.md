## MODIFIED Requirements

### Requirement: Expandable Detailed Navigation Drawer
The navigation sidebar SHALL support expanding from a compact icon-only dock (`80px` / `w-20`) to an elevated detailed overlay drawer (`256px` / `w-64`) rendered at `z-50`, floating over the operational console without shifting or altering the base page layout padding (`pl-20`).

#### Scenario: Toggling sidebar expansion
- **WHEN** an administrator clicks the expand trigger on the compact sidebar
- **THEN** the sidebar width SHALL expand from 80px to 256px with smooth CSS transitions while the main page container padding remains fixed at `pl-20`, preventing content reflow.

#### Scenario: Displaying category details in expanded mode
- **WHEN** the sidebar is in expanded mode
- **THEN** the system SHALL display each category's full label, Danish subtitle, and operational description alongside its icon.

#### Scenario: Dismissing or collapsing sidebar overlay
- **WHEN** an administrator clicks the collapse trigger or an overlay backdrop
- **THEN** the sidebar SHALL retract to its compact 80px dock width, maintaining uninterrupted console state.

### Requirement: Interactive Clickable Lab Switcher
The administrative console and expanded drawer SHALL provide interactive lab buttons enabling staff to toggle between operational lab contexts (`makerspace`, `medialab`, `dimselab`) with tokens and colors strictly synchronized with the public landing portal (`makerspace`: Cyan `#009FE3`, `medialab`: Magenta `#E6007E`, `dimselab`: Yellow `#FFED00`).

#### Scenario: Switching active lab context
- **WHEN** an administrator clicks a lab selector option (e.g. "Makerspace", "Medialab", or "Dimselab")
- **THEN** the active lab state SHALL update immediately and reflect its corresponding CMYK color accent across both the sidebar and console context header.

## ADDED Requirements

### Requirement: Spotify-Style Expand Trigger and Zealand Labs Branding
The navigation sidebar header SHALL eliminate the standalone yellow "ZL" badge logo, replacing the expand trigger with a Spotify-desktop-inspired control that displays a menu/sidebar icon in rest state and reveals an expand chevron on pointer hover; upon expanding, the header SHALL present "ZEALAND LABS" using the front page brand typography.

#### Scenario: Hovering over compact sidebar expand trigger
- **WHEN** the sidebar is in compact collapsed state and the cursor hovers over the top navigation trigger
- **THEN** the icon SHALL transition from a menu/sidebar icon to an expand arrow/chevron, indicating expansion capability.

#### Scenario: Viewing expanded sidebar branding
- **WHEN** the sidebar is expanded into overlay mode
- **THEN** the header SHALL display "ZEALAND LABS" in high-contrast `font-notch` styling matching the public landing page, accompanied by a collapse toggle button.
