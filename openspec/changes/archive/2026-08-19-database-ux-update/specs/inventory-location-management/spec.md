## Purpose

Provides inventory asset registration, editing, taxonomy tag filtering, and specific physical location tracking (room, shelf, locker, cabinet) across Zealand Labs facilities.

## ADDED Requirements

### Requirement: Physical Location Metadata and Filtering
The system SHALL store physical location metadata for each inventory asset and allow administrators to filter items by facility, category tag, operational status, and specific physical storage location.

#### Scenario: Filtering inventory by physical location
- **WHEN** an administrator selects a specific location filter (e.g. "Cabinet A2" or "Shelf 3")
- **THEN** the system returns only inventory assets assigned to that physical location

#### Scenario: Filtering inventory by taxonomy tag and status
- **WHEN** an administrator selects tags (e.g. "Camera Gear") and status "AVAILABLE"
- **THEN** the system displays matching items with their operational badges and physical locations

### Requirement: Streamlined Inventory Item Creation and Editing
The system SHALL provide a modal interface to create new gear/machine items or edit existing items with asset tag validation, hardware type, location, image URL, and custom specifications.

#### Scenario: Creating a new inventory item
- **WHEN** an administrator inputs asset tag, name, lab, hardware type, and location in the creation drawer
- **THEN** the system creates the `Inventory` record, associates selected taxonomy tags, and logs a `CREATE_INVENTORY` audit entry

#### Scenario: Updating an existing inventory asset
- **WHEN** an administrator edits an item's name, operational status, or location
- **THEN** the system persists changes to MySQL, updates dependent queries, and writes an `UPDATE_INVENTORY` audit log
