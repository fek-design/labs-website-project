## MODIFIED Requirements

### Requirement: Streamlined Inventory Item Creation and Editing
The system SHALL auto-generate deterministic, unique asset tags following the taxonomy schema `[LAB-PREFIX]-[CATEGORY]-[4-DIGIT-SEQUENCE]` upon item creation using the 2-tier taxonomy (`DISCIPLINE` and `PROCESS`), mapping lab prefixes strictly to authentic Køge facilities (`MK` for Makerspace and `ML` for MediaLab, with no Roskilde prefix mapping), disabling manual asset tag text entry, and presenting the item creation and editing interfaces as centered modal cards (`Card - Create` and `Card - Edit`) containing equipment name, serial number, acquisition date (`purchaseDate`), lab facility, type, manual attachments, and description, persisting the acquisition date in the `Inventory` database record and displaying it in list and grid views.

#### Scenario: Creating a new inventory item
- **WHEN** an administrator selects a macro lab, discipline/process tag, and inputs item name in the creation drawer
- **THEN** the system automatically generates a unique deterministic asset tag (e.g. `MK-3DP-0001` or `ML-CAM-0001`), creates the `Inventory` record, and logs a `CREATE_INVENTORY` audit entry.

#### Scenario: Updating an existing inventory asset
- **WHEN** an administrator edits an item's name, operational status, or macro lab facility
- **THEN** the system persists changes to MySQL, updates dependent queries, and writes an `UPDATE_INVENTORY` audit log.

#### Scenario: Creating a new inventory item with extended metadata
- **WHEN** an administrator submits the item creation modal with name, macro lab, hardware type, optional serial number, and optional acquisition date
- **THEN** the system computes the next sequential deterministic asset tag, creates the `Inventory` record with the parsed acquisition timestamp, associates any selected documentation manuals, and logs a `CREATE_INVENTORY` audit entry.

#### Scenario: Editing an existing inventory asset with modal card interface
- **WHEN** an administrator updates an item's status, serial number, acquisition date, or description from `Card - Edit`
- **THEN** the system persists changes to MySQL including the updated acquisition timestamp, updates local reactive state, and writes an `UPDATE_INVENTORY` audit log.

#### Scenario: Displaying acquisition date in inventory views
- **WHEN** an administrator inspects inventory in list view or grid card view
- **THEN** items with an acquisition date display the formatted date label (e.g. `Anskaffet: 15. jan. 2024`), while items without an acquisition date display a dash or neutral indicator.
