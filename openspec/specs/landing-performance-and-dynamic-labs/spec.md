# landing-performance-and-dynamic-labs Specification

## Purpose
Establishes production development performance standards, an authentic SVG pixel dither transition, a gapless infinite marquee ticker, full hardware telemetry querying, and dynamic campus-aware lab navigation.

## Requirements

### Requirement: Production Development and Performance Standards
The system SHALL adhere to documented production engineering standards ensuring asset compression, sub-second LCP, non-blocking database queries, and resilient fallback states.

#### Scenario: Developer or agent consults production guidelines
- **WHEN** engineering landing page components or backend queries
- **THEN** assets are compressed to high-efficiency WebP/SVG formats with responsive sizing attributes, and network queries implement non-blocking fallbacks.

### Requirement: Gapless Infinite Marquee Loop
The system SHALL render an uninterrupted, seamless running marquee ribbon that loops continuously without running out of text or showing blank voids on any viewport size.

#### Scenario: Visitor views the continuous marquee ribbon
- **WHEN** the visitor observes the marquee banner at any viewport width or for an extended duration
- **THEN** the text sequence `DIMSELAB • MAKERSPACE • MEDIALAB •` translates smoothly and infinitely with dual-track duplication without gaps.

### Requirement: Authentic SVG Pixel Raster Transition
The system SHALL display the authentic stepped pixel dither transition vector between dark and light sections as specified in Figma node `144:79`.

#### Scenario: Rendering the section divider
- **WHEN** the user scrolls past the interactive project showcase
- **THEN** the system renders the `pixel-transition.svg` graphic depicting large stepped pixel dithering rather than an artificial CSS grid pattern.

### Requirement: Complete Machine Hardware Telemetry
The system SHALL query and display all active static machines from the database without artificial pagination or truncation limits.

#### Scenario: Visitor inspects hardware workstations
- **WHEN** the hardware availability section loads
- **THEN** all registered static machines are rendered with real-time operational status indicators, location tags, and responsive container layout.

### Requirement: Dynamic Location-Aware Lab Exploration and Spotlight Sync
The system SHALL dynamically render prototyping indicator tabs corresponding to the labs operating at the selected campus, and synchronize the spotlight showcase card when a lab is selected.

#### Scenario: User toggles labs under Køge campus
- **WHEN** the active campus is Køge and the visitor selects between "Makerspace" and "Medialab"
- **THEN** the "Prototyping & Understøttelse" step indicators reflect exactly the 2 labs available in Køge, and the spotlight showcase card immediately updates its copy, capabilities, and imagery to match the selected lab.
