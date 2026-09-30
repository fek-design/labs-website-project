## MODIFIED Requirements

### Requirement: Streamlined Inventory Item Creation and Editing
The system SHALL auto-generate deterministic, unique asset tags following the 4-tier taxonomy schema `[LOCATION]-[LAB-PREFIX]-[CATEGORY]-[4-DIGIT-SEQUENCE]` upon item creation using the physical location/campus prefix (`KG` for Køge, `RO` for Roskilde) and 2-tier category taxonomy (`DISCIPLINE` and `PROCESS`), mapping lab prefixes strictly to authentic Køge facilities (`MK` for Makerspace and `ML` for MediaLab), disabling manual asset tag text entry, presenting the item creation and editing interfaces as centered modal cards (`Card - Create` node `87:5143` and `Card - Edit` node `87:5050`) styled in `#202021` card surface with 1px `#444444` border, containing equipment name, serial number, acquisition date (`purchaseDate`), physical location placement (`location`), lab facility, hardware/tracking type, linked manual attachments with cyan `#1da9e4` "Se" pill buttons, description, an integrated zero-cloud Code 128 barcode preview with copyable tag ID and direct PNG/SVG vector download actions, and standardized action footers with `#e51d87` (Pink) "Slet" button, `#151517` / `#333333` "Afbryd" cancel button, and `#1da9e4` (Cyan) "Gem" / "Opret" primary action button, persisting the acquisition date and physical location in the `Inventory` database record.

#### Scenario: Creating a new inventory item with centered modal card
- **WHEN** an administrator clicks "Tilføj" / "+ Opret genstand" in the inventory toolbar
- **THEN** the system presents `Card - Create` (node `87:5143`) displaying the computed 4-tier asset tag showcase (e.g., `KG-MK-3DP-0001`), equipment name input, lab, location, and type dropdown selectors, optional acquisition date, live barcode preview, attached manuals summary, description textarea, and "Afbryd" / "Opret" buttons.

#### Scenario: Editing an existing inventory asset with modal card interface
- **WHEN** an administrator clicks to edit an item from list view or grid card view
- **THEN** the system opens `Card - Edit` (node `87:5050`) populated with the item's asset tag title, equipment name, status dropdown, physical location selector, lab dropdown, linked manuals list with cyan "Se" badges, live Code 128 barcode label with vector download controls, description, and footer action buttons featuring pink "Slet", "Afbryd", and cyan "Gem".

#### Scenario: Toggling documentation manuals library from item card
- **WHEN** an administrator clicks "Tilføj Manualer +" from either create or edit modal card
- **THEN** the system opens or pairs the slide-out `MANUALER Many-to-Many documentation library` (node `87:6081`) allowing interactive search and checkmark selection of documentation guides.

#### Scenario: Creating a new inventory item
- **WHEN** an administrator selects a macro lab, discipline/process tag, and inputs item name in the creation drawer
- **THEN** the system automatically generates a unique deterministic 4-tier asset tag (e.g. `KG-MK-3DP-0001` or `KG-ML-CAM-0001`), creates the `Inventory` record, and logs a `CREATE_INVENTORY` audit entry.

#### Scenario: Updating an existing inventory asset
- **WHEN** an administrator edits an item's name, operational status, physical location, or macro lab facility
- **THEN** the system persists changes to MySQL, updates dependent queries, and writes an `UPDATE_INVENTORY` audit log.

#### Scenario: Creating a new inventory item with extended metadata
- **WHEN** an administrator submits the item creation modal with name, macro lab, physical location zone, hardware type, optional serial number, and optional acquisition date
- **THEN** the system computes the next sequential deterministic asset tag with location prefix, creates the `Inventory` record with the parsed acquisition timestamp and physical location string, associates any selected documentation manuals, and logs a `CREATE_INVENTORY` audit entry.

#### Scenario: Displaying acquisition date in inventory views
- **WHEN** an administrator inspects inventory in list view or grid card view
- **THEN** items with an acquisition date display the formatted date label (e.g. `Anskaffet: 15. jan. 2024`), while items without an acquisition date display a dash or neutral indicator.

#### Scenario: Generating Code 128 barcode in item card
- **WHEN** an administrator views the item creation or edit modal card
- **THEN** the system generates a local, zero-cloud Code 128 barcode representation matching the current deterministic asset tag alongside human-readable text and placement metadata without size roll toggling controls.

#### Scenario: Downloading barcode asset files
- **WHEN** an administrator clicks "Hent SVG" or "Hent PNG"
- **THEN** the system directly downloads the high-resolution vector SVG or 300 DPI PNG image file of the standardized label asset tag barcode without invoking external web services or browser print dialogs.
