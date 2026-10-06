# makerspace-machine-hub Specification

## Purpose
Provides a dedicated non-rental dashboard for Zealand Makerspace static machines, operational status, safety manuals, technical specifications, and maintenance repair logs.

## Requirements

### Requirement: Makerspace Machine Catalog and Manuals
The system SHALL present static machine workstations with a dedicated machine search bar using neutral focus border styling (`#555555`) without yellow borders, direct access to a centralized catalog of authentic PDF user manuals supporting Many-to-Many associations across machines, verified technical specifications without fake placeholder data, and operational readiness, without student loan or rental workflows.

#### Scenario: Viewing machine details and documentation
- **WHEN** an administrator or technician opens the Makerspace hub and searches for a machine name or category
- **THEN** the system displays matching static machines with operational status badges, verified specifications, and list of attached PDF user manuals from the central catalog, with the search bar maintaining neutral border styling.

#### Scenario: Uploading and linking a PDF manual to a machine
- **WHEN** a technician uploads a PDF manual file and associates it with a machine
- **THEN** the system stores the PDF locally under `/public/uploads/manuals/`, records the document in the centralized `Manual` catalog, links it to the machine, and provides an immediate preview/download action

#### Scenario: Attaching existing catalog manual to multiple machines
- **WHEN** a technician opens the manual picker for a workstation and selects a manual already in the catalog
- **THEN** the system creates a Many-to-Many link between the machine and the manual, making the document accessible from both machines without duplicate file storage

#### Scenario: Unlinking a manual from a machine
- **WHEN** a technician unlinks a manual from a machine
- **THEN** the system removes the association while preserving the manual in the central catalog for other machines

### Requirement: Machine Maintenance and Repair Logging
The system SHALL allow technicians to update machine operational status (`AVAILABLE`, `MAINTENANCE`, `BROKEN`) and create structured `RepairLog` entries.

#### Scenario: Logging machine maintenance
- **WHEN** a technician flags a 3D printer for nozzle replacement
- **THEN** the system updates its operational status to `MAINTENANCE`, writes a `RepairLog` record, and logs an audit trail

### Requirement: Active Lab Synchronization for Machine Hub
The Makerspace Machine Hub (`/admin` under Makerspace) SHALL accept the active lab context passed from the parent console and query static machines accordingly, allowing technicians to inspect and manage machines across facilities without hardcoded lab bindings.

#### Scenario: Switching active lab updates displayed machines
- **WHEN** an administrator switches the active lab in the navigation dock or passes a different `activeLab` context
- **THEN** the Machine Hub queries static machines matching that lab slug and updates the machine catalog view.
