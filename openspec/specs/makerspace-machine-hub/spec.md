# makerspace-machine-hub Specification

## Purpose
Provides a dedicated non-rental dashboard for Zealand Makerspace static machines, operational status, safety manuals, technical specifications, and maintenance repair logs.

## Requirements

### Requirement: Makerspace Machine Catalog and Manuals
The system SHALL present static machine workstations (3D printers, laser cutters, electronics stations) with direct access to user manuals, safety documentation, build volume specifications, and operational readiness, without student loan or rental workflows.

#### Scenario: Viewing machine details and documentation
- **WHEN** an administrator or technician opens the Makerspace hub
- **THEN** the system displays all static machines with operational status badges, custom technical specifications, and links to official user guides/manuals

### Requirement: Machine Maintenance and Repair Logging
The system SHALL allow technicians to update machine operational status (`AVAILABLE`, `MAINTENANCE`, `BROKEN`) and create structured `RepairLog` entries.

#### Scenario: Logging machine maintenance
- **WHEN** a technician flags a 3D printer for nozzle replacement
- **THEN** the system updates its operational status to `MAINTENANCE`, writes a `RepairLog` record, and logs an audit trail
