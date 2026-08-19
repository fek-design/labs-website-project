# inventory-location-management Specification

## Purpose
Provides inventory asset registration, editing, taxonomy tag filtering, and specific physical location tracking (room, shelf, locker, cabinet) across Zealand Labs facilities.

## Requirements

### Requirement: Physical Location Metadata and Filtering
The system SHALL track item locations strictly at the Macro-Lab level (`Makerspace (Køge)` as default, `MediaLab (Køge)`, and `Roskilde` architectural placeholder), deprecating individual micro-location tracking (lockers/cabinets), and allow administrators to filter items by macro lab facility, category tag, and operational status.

#### Scenario: Filtering inventory by physical location
- **WHEN** an administrator selects a macro facility filter (`Makerspace (Køge)`, `MediaLab (Køge)`, or `Roskilde`)
- **THEN** the system returns only inventory assets assigned to that macro lab facility

#### Scenario: Filtering inventory by taxonomy tag and status
- **WHEN** an administrator selects tags (e.g. "Camera Gear") and status "AVAILABLE"
- **THEN** the system displays matching items with their operational badges and macro lab assignments

### Requirement: Streamlined Inventory Item Creation and Editing
The system SHALL auto-generate deterministic, unique asset tags following the taxonomy schema `[LAB-PREFIX]-[CATEGORY]-[4-DIGIT-SEQUENCE]` upon item creation, disabling manual asset tag text entry.

#### Scenario: Creating a new inventory item
- **WHEN** an administrator selects a macro lab, category tag, and inputs item name in the creation drawer
- **THEN** the system automatically generates a unique deterministic asset tag (e.g. `MK-3DP-0001` or `ML-CAM-0001`), creates the `Inventory` record, and logs a `CREATE_INVENTORY` audit entry

#### Scenario: Updating an existing inventory asset
- **WHEN** an administrator edits an item's name, operational status, or macro lab facility
- **THEN** the system persists changes to MySQL, updates dependent queries, and writes an `UPDATE_INVENTORY` audit log
