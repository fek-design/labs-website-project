## MODIFIED Requirements

### Requirement: Inline Equipment and Machine Linking
Each manual card and manual edit popup SHALL display a "Links (N)" cluster listing linked hardware items with quick "Se" detail triggers and unlinking "x" buttons, plus a "Tilføj +" control to open the equipment linking side drawer (`Card - Links side to edit/create` node `87:6513`).

#### Scenario: Linking manual to physical equipment via side drawer
- **WHEN** an administrator selects "Tilføj +" on a manual card or within `MANUALS - Card Edit`
- **THEN** the system displays the `LINKS Many-to-Many documentation library` drawer (node `87:6513`) with live search and 2-column machine selection cards to link equipment.

#### Scenario: Unlinking manual from equipment
- **WHEN** an administrator clicks the unlinking "x" button on a linked hardware pill
- **THEN** the system disassociates the hardware while keeping the manual document intact in the central repository.

## ADDED Requirements

### Requirement: Dedicated Manual Edit Card Popup
The system SHALL provide a dedicated `MANUALS - Card Edit` modal popup (Figma node `89:7194` / `209:2`) matching `#202021` card surface with 1px `#444444` border, document thumbnail preview frame, manual title, filename & size subtitle, white `#ffffff` "Læs Online" action button, editable "Beskrivelse" textarea in `#151517` / `#333333`, "Links (N)" list with yellow `#ffd900` "Se" pill buttons, and pink `#e51d87` "Slet" action button.

#### Scenario: Opening manual edit card from manuals manager
- **WHEN** an administrator clicks on a manual card or its edit action in the manuals manager
- **THEN** the system opens the `MANUALS - Card Edit` popup presenting manual metadata, "Læs Online" link, editable description, linked hardware list, and delete action.

#### Scenario: Reading manual online
- **WHEN** an administrator clicks the white "Læs Online" button in `MANUALS - Card Edit`
- **THEN** the system opens the target PDF document in a new browser tab or inline viewer.
