## ADDED Requirements

### Requirement: Elimination of Glow Effects
The system SHALL strictly prohibit fuzzy neon drop-shadow filters, colored box-shadow halos (`shadow-[#...]/20`), and glowing indicator blurs across all administrative, inventory, POS, and public landing components. Elements SHALL rely exclusively on crisp, authentic Scandinavian hairline borders (1px solid borders in `#262626`, `#333333`, `#444444`, or theme accent strokes) and solid high-contrast fills for active and hover states.

#### Scenario: Active navigation dock icon illumination
- **WHEN** an administrator views the active tab in `AdminSidebarNav`
- **THEN** the active tab icon renders with crisp category accent illumination (`item.accentColor`) without any drop-shadow glow filter (`drop-shadow(...)`).

#### Scenario: Active buttons, indicators, and selectors
- **WHEN** interactive buttons, indicator lines, or selection tags render in the POS, inventory, or public interfaces
- **THEN** they display solid background fills and crisp hairline borders without colored shadow halos or glowing blur rings.
