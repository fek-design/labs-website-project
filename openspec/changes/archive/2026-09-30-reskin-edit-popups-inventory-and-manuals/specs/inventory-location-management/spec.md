## MODIFIED Requirements

### Requirement: Streamlined Inventory Item Creation and Editing
The system SHALL auto-generate deterministic, unique asset tags following the taxonomy schema `[LAB-PREFIX]-[CATEGORY]-[4-DIGIT-SEQUENCE]` upon item creation using the 2-tier taxonomy (`DISCIPLINE` and `PROCESS`), mapping lab prefixes strictly to authentic Køge facilities (`MK` for Makerspace and `ML` for MediaLab, with no Roskilde prefix mapping), disabling manual asset tag text entry, and presenting the item creation and editing interfaces as centered modal cards (`Card - Create` node `87:5143` and `Card - Edit` node `87:5050`) styled in `#202021` card surface with 1px `#444444` border, containing equipment name, serial number, acquisition date (`purchaseDate`), lab facility, type, linked manual attachments with cyan `#1da9e4` "Se" pill buttons, description, and standardized action footers with `#e51d87` (Pink) "Slet" button, `#151517` / `#333333` "Afbryd" cancel button, and `#1da9e4` (Cyan) "Gem" / "Opret" primary action button, persisting the acquisition date in the `Inventory` database record and displaying it in list and grid views.

#### Scenario: Creating a new inventory item with centered modal card
- **WHEN** an administrator clicks "Tilføj" / "+ Opret genstand" in the inventory toolbar
- **THEN** the system presents `Card - Create` (node `87:5143`) displaying the computed asset tag showcase, equipment name input, lab and type dropdown selectors, optional acquisition date, attached manuals summary, description textarea, and "Afbryd" / "Opret" buttons.

#### Scenario: Editing an existing inventory asset with modal card interface
- **WHEN** an administrator clicks to edit an item from list view or grid card view
- **THEN** the system opens `Card - Edit` (node `87:5050`) populated with the item's asset tag title, equipment name, status dropdown, lab dropdown, linked manuals list with cyan "Se" badges, description, and footer action buttons featuring pink "Slet", "Afbryd", and cyan "Gem".

#### Scenario: Toggling documentation manuals library from item card
- **WHEN** an administrator clicks "Tilføj Manualer +" from either create or edit modal card
- **THEN** the system opens or pairs the slide-out `MANUALER Many-to-Many documentation library` (node `87:6081`) allowing interactive search and checkmark selection of documentation guides.

#### Scenario: Creating a new inventory item
- **WHEN** an administrator selects a macro lab, discipline/process tag, and inputs item name in the creation drawer
- **THEN** the system automatically generates a unique deterministic asset tag (e.g. `MK-3DP-0001` or `ML-CAM-0001`), creates the `Inventory` record, and logs a `CREATE_INVENTORY` audit entry.

#### Scenario: Updating an existing inventory asset
- **WHEN** an administrator edits an item's name, operational status, or macro lab facility
- **THEN** the system persists changes to MySQL, updates dependent queries, and writes an `UPDATE_INVENTORY` audit log.

#### Scenario: Creating a new inventory item with extended metadata
- **WHEN** an administrator submits the item creation modal with name, macro lab, hardware type, optional serial number, and optional acquisition date
- **THEN** the system computes the next sequential deterministic asset tag, creates the `Inventory` record with the parsed acquisition timestamp, associates any selected documentation manuals, and logs a `CREATE_INVENTORY` audit entry.

#### Scenario: Displaying acquisition date in inventory views
- **WHEN** an administrator inspects inventory in list view or grid card view
- **THEN** items with an acquisition date display the formatted date label (e.g. `Anskaffet: 15. jan. 2024`), while items without an acquisition date display a dash or neutral indicator.

### Requirement: Equipment Manuals Documentation Library Integration
The system SHALL provide a dedicated slide-out documentation browser (`Card - Manual side to edit/create` / `MANUALER` library node `87:6081`) accessible from item creation and edit cards, featuring header title `MANUALER Many-to-Many documentation library`, live `Valgt N` counter, high-contrast search input, and a 2-column card grid allowing administrators to inspect, search, and link many-to-many PDF manuals and standard operating procedures (SOPs) to equipment assets.

#### Scenario: Attaching manuals to an equipment item from library drawer
- **WHEN** an administrator selects one or more manuals in the documentation library drawer
- **THEN** the selected manuals display an active checkmark, update the `Valgt N` counter, and appear in the parent item card's manual list with cyan "Se" triggers upon confirmation.

#### Scenario: Removing an attached manual from the item card
- **WHEN** an administrator clicks the remove icon ("x") next to a linked manual in the item card
- **THEN** the manual is unlinked from the item without deleting the underlying PDF file from the documentation repository.
