## MODIFIED Requirements

### Requirement: Physical Location Metadata and Filtering
The system SHALL organize inventory metadata using a 3-Tier Namespaced Faceted Taxonomy (`DISCIPLINE`, `PROCESS`, `MATERIAL`), alongside Macro-Lab assignments (`Makerspace (Køge)` default, `MediaLab (Køge)`, `Roskilde`), allowing administrators to perform multi-dimensional faceted filtering across disciplines, processes, materials, and operational readiness without global taxonomy collision.

#### Scenario: Filtering inventory by physical location
- **WHEN** an administrator selects a macro facility filter (`Makerspace (Køge)`, `MediaLab (Køge)`, or `Roskilde`)
- **THEN** the system returns only inventory assets assigned to that macro lab facility

#### Scenario: Filtering inventory by taxonomy tag and status
- **WHEN** an administrator filters by Discipline (`3D Fabrication`), Process (`FDM 3D Printing`), and Material (`PLA/PETG`)
- **THEN** the system returns matching machines and gear tagged with those specific faceted dimensions

### Requirement: Streamlined Inventory Item Creation and Editing
The system SHALL allow administrators to dynamically create new tags assigned to a specific facet (`DISCIPLINE`, `PROCESS`, `MATERIAL`) during item creation, and auto-generate deterministic asset tags based on lab and category.

#### Scenario: Creating a new inventory item
- **WHEN** an administrator selects a macro lab, selects or creates faceted tags (Discipline, Process, Material), and inputs item name
- **THEN** the system creates the `Inventory` record, binds the faceted tag associations, and logs a `CREATE_INVENTORY` audit entry

#### Scenario: Updating an existing inventory asset
- **WHEN** an administrator edits an item's name, operational status, or macro lab facility
- **THEN** the system persists changes to MySQL, updates dependent queries, and writes an `UPDATE_INVENTORY` audit log
