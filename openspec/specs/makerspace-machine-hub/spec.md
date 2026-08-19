# makerspace-machine-hub Specification

## Purpose
Provides a dedicated non-rental dashboard for Zealand Makerspace static machines, operational status, safety manuals, technical specifications, and maintenance repair logs.

## Requirements

### Requirement: Makerspace Machine Catalog and Manuals
The system SHALL present static machine workstations (3D printers, laser cutters, electronics stations) with a dedicated machine search bar, direct access to authentic user manuals (including uploaded PDF documents), verified technical specifications without fake placeholder data, and operational readiness, without student loan or rental workflows.

#### Scenario: Viewing machine details and documentation
- **WHEN** an administrator or technician opens the Makerspace hub and searches for a machine name or category
- **THEN** the system displays matching static machines with operational status badges, verified specifications, and links or view buttons for attached PDF user manuals

#### Scenario: Uploading and linking a PDF manual to a machine
- **WHEN** a technician uploads a PDF manual file and associates it with a machine
- **THEN** the system stores the PDF locally under `/public/uploads/manuals/`, links the manual URL to the machine record, and provides an immediate preview/download action

### Requirement: Machine Maintenance and Repair Logging
The system SHALL allow technicians to update machine operational status (`AVAILABLE`, `MAINTENANCE`, `BROKEN`) and create structured `RepairLog` entries.

#### Scenario: Logging machine maintenance
- **WHEN** a technician flags a 3D printer for nozzle replacement
- **THEN** the system updates its operational status to `MAINTENANCE`, writes a `RepairLog` record, and logs an audit trail
