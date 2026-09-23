# public-lab-telemetry Specification

## Purpose
Provides reactive public telemetry on the landing page connected directly to backend database inventory, supporting localized campus filtering, lab-specific semantics, and rounded metric formatting.

## Requirements

### Requirement: Dynamic Lab and Campus Telemetry Binding
The landing page telemetry section SHALL dynamically consume the active campus preference (`køge` or `roskilde`) and active lab selection (`makerspace`, `medialab`, `dimselab`) from `CampusContext`, displaying only the inventory items and telemetry statistics corresponding to that specific facility.

#### Scenario: User views telemetry for Køge Makerspace
- **WHEN** the user selects Køge campus and the Makerspace lab
- **THEN** the telemetry section displays static machines located at Køge Makerspace

#### Scenario: User switches active lab to Medialab
- **WHEN** the user clicks the Medialab tab in the lab explorer
- **THEN** the telemetry section immediately updates its inventory cards, count, and headline to reflect Medialab equipment without a page reload

#### Scenario: User switches active campus to Roskilde
- **WHEN** the user switches the campus to Roskilde via the header or gate
- **THEN** the telemetry section updates to display Roskilde's authentic localized hardware and stats

### Requirement: Even-Out Rounding for Milestone Counters
The system SHALL format the primary telemetry counter by rounding down to the nearest multiple of 5 (`Math.floor(count / 5) * 5`) when the count is 5 or greater, rendering clean milestone labels (e.g., `5+`, `10+`, `15+`, `20+`). When the total count is less than 5, the system SHALL display the exact count.

#### Scenario: Displaying count rounded down to multiple of 5 or 10
- **WHEN** a lab has 12, 14, or 18 registered items
- **THEN** the counter displays `10+` (for 12–14) or `15+` (for 18), rounding down cleanly to even 5s or 10s

#### Scenario: Displaying count below 5
- **WHEN** a newly initialized lab has 3 registered items
- **THEN** the counter displays `3` without uneven milestone rounding

### Requirement: Lab-Specific Semantics and Hardware Categorization
The telemetry section SHALL adapt its visual framing, labels, and headlines based on the active lab:
1. **Makerspace**: Filters for `hardwareType: STATIC_MACHINE`, displays counter label *"Maskiner"*, and headline *"Vi har sikkert en maskine til dit formål"*.
2. **Medialab**: Filters for `hardwareType: BORROWABLE_GEAR`, displays counter label *"Udstyrsenheder"*, and headline *"Vi har sikkert udstyret til dit formål"*.
3. **Dimselab**: Filters for electronics/IoT workstations and toolkits, displays counter label *"Hardware & Værktøj"*, and headline *"Vi har grejet til dit projekt"*.

#### Scenario: Viewing Makerspace semantics
- **WHEN** the active lab is Makerspace
- **THEN** the headline reads *"Vi har sikkert en maskine til dit formål"* and the stat counter is titled *"Maskiner"*

#### Scenario: Viewing Medialab semantics
- **WHEN** the active lab is Medialab
- **THEN** the headline reads *"Vi har sikkert udstyret til dit formål"* and the stat counter is titled *"Udstyrsenheder"*

### Requirement: Authentic Roskilde Database Inventory
The system SHALL maintain authentic, separate database inventory records for Roskilde Campus in `prisma/seed.ts` and runtime queries, ensuring Roskilde displays its own physical hardware and distinct telemetry numbers rather than inheriting Køge's machines.

#### Scenario: Viewing Roskilde inventory
- **WHEN** a user selects Roskilde campus
- **THEN** the autoscrolling cards display actual Roskilde workstations and gear registered under Roskilde in the database
