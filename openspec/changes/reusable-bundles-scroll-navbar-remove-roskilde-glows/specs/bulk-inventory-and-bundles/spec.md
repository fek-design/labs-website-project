## MODIFIED Requirements

### Requirement: Companion Bundle Presets
The system SHALL support creating standalone Bundle Presets independently of any single inventory item, containing reusable configurations of companion bulk or serialized accessories with default checkout quantities. The system SHALL allow associating one or more Bundle Presets with multiple parent equipment/machines via a many-to-many relationship, removing repeated bundle configurations across identical or similar machines.

#### Scenario: Defining bundle presets in inventory editor
- **WHEN** an administrator accesses the bundle presets manager
- **THEN** the system allows creating or editing a named bundle preset (e.g. "Sony A7 Video Kit" with 2x NP-FZ100 batteries and 1x Dual Charger) independent of any specific machine

#### Scenario: Assigning a bundle preset to multiple machines
- **WHEN** an administrator edits an equipment item (e.g. Sony A7 IV #1 or Sony A7 IV #2)
- **THEN** the system allows selecting and associating the existing "Sony A7 Video Kit" bundle preset to the machine without re-specifying individual accessory items

#### Scenario: Scanning gear with assigned bundle preset in POS
- **WHEN** an administrator scans an equipment item associated with one or more bundle presets
- **THEN** the system displays the companion bundle recommendation prompt containing the aggregated accessories and quantities from all assigned presets

#### Scenario: Standalone borrowing of bundle items
- **WHEN** a patron requests to borrow only an accessory that is configured in a bundle preset without borrowing the parent item
- **THEN** the system permits checking out the accessory as an independent loan without requiring the parent item to be present in the cart
