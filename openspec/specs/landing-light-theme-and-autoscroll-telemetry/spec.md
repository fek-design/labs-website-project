# landing-light-theme-and-autoscroll-telemetry Specification

## Purpose
Defines landing page dual-theme section transitions, authentic CMYK accent color mapping for campus laboratories, and an autoscrolling clipped 3-card machine telemetry display.

## Requirements

### Requirement: Section Theme System and Light Background Transition
The system SHALL present a dual-mode visual transition where the top Hero section and Header render on dark surfaces (`#000000`), and starting from *Prototyping & Understøttelse* through the footer, the background renders on pure white (`#FFFFFF`) with semantic light tokens for typography, card surfaces, and borders.

#### Scenario: Navigating into the Prototyping & Understøttelse section
- **WHEN** a visitor scrolls down from the dark Hero section into *Prototyping & Understøttelse*
- **THEN** the system displays a white background (`#FFFFFF`) with dark readable typography (`#09090b` / `#18181b`), inverted surface cards, and crisp borders (`#e4e4e7` / `#d4d4d8`) without the legacy SVG pixel transition

#### Scenario: Viewing cards in the light section context
- **WHEN** a visitor inspects lab capability cards, machine cards, or spotlight details
- **THEN** the cards render on light surface backgrounds (`#F4F4F5` / `#FFFFFF`) with dark text and high-contrast borders rather than dark zinc surfaces

### Requirement: Lab CMYK Accent Color Mapping
The system SHALL assign a distinct CMYK accent color to each laboratory: Makerspace (`#009FE3` Cyan), Medialab (`#E6007E` Magenta/Pink), and Dimselab (`#FFED00` Yellow). These colors MUST dynamically drive the lab step indicators, spotlight tags, active tab states, and telemetry badges.

#### Scenario: Selecting Makerspace
- **WHEN** the user selects or switches to the Makerspace lab
- **THEN** the indicator line, spotlight badge, and accent highlights render using CMYK Cyan (`#009FE3`)

#### Scenario: Selecting Medialab
- **WHEN** the user selects or switches to the Medialab lab
- **THEN** the indicator line, spotlight badge, and accent highlights render using CMYK Magenta/Pink (`#E6007E`)

#### Scenario: Selecting Dimselab in Roskilde
- **WHEN** the user switches campus to Roskilde and selects Dimselab
- **THEN** the third indicator line and spotlight badge render using CMYK Yellow (`#FFED00`)

### Requirement: Autoscrolling Clipped 3-Card Machine Telemetry
The machine telemetry component SHALL render a container constrained to approximately 3 visible cards in height with content clipping (`overflow: hidden`). The container SHALL NOT be a user-scrollable element with scrollbars, and SHALL automatically scroll vertically in a continuous, smooth loop displaying all static machines.

#### Scenario: Viewing machine telemetry section on desktop or mobile
- **WHEN** the visitor views the machine telemetry section
- **THEN** the container displays exactly ~3 cards in height, clips overflow without native scrollbars, and continuously auto-scrolls vertically through the full machine catalog

#### Scenario: Hovering over the autoscrolling machine cards
- **WHEN** the user hovers over an auto-scrolling machine card
- **THEN** the vertical scrolling pauses or slows, allowing the user to inspect machine status and details without layout disruption
