## Purpose

Provides high-performance progressive scroll-loading for the public catalogue and establishes disciplined, friction-free curation controls in the PoS—eliminating arbitrary category bloat and replacing raw file path typing with automated uploads and a visual asset picker.

## ADDED Requirements

### Requirement: Seamless Scroll-Triggered Progressive Loading
The public catalogue grid (`/katalog`) SHALL load items progressively in batches (default: 8 items per batch) as the user scrolls, maintaining smooth frame rates and avoiding full-dataset DOM dumps.

#### Scenario: Initial catalogue page batch rendering
- **WHEN** a user loads the `/katalog` page
- **THEN** the system SHALL render only the first batch of matching cards (e.g., 8 cards) without locking the main thread.

#### Scenario: Scrolling near bottom loads subsequent batch
- **WHEN** the user scrolls within 300px of the bottom of the grid
- **THEN** the system SHALL seamlessly append the next batch of items into the view with zero layout jitter.

#### Scenario: Search and filtering resets lazy load window
- **WHEN** a user modifies the search query or clicks a lab/category filter
- **THEN** the displayed batch SHALL reset to the first page of the newly filtered results, preserving progressive loading for the remaining subset.

### Requirement: Strict Standardized Discipline Taxonomy
The system SHALL restrict craft prototype categories to a closed, authoritative list of Zealand Labs disciplines, preventing administrators from entering unverified, fluffy, or duplicate free-text categories.

#### Scenario: Category selection via controlled enum
- **WHEN** an administrator creates or edits a prototype in the PoS
- **THEN** the category field SHALL be presented as a strict dropdown containing only recognized disciplines (`Tekstil & Beklædning`, `3D Print & Prototyping`, `Laserskæring & CNC`, `Print & Storformat`, `Vinyl & Skilte`, `Elektronik & IoT`, `Keramik & Sublimation`).

#### Scenario: Admin cannot input arbitrary custom categories
- **WHEN** an administrator interacts with the category selector
- **THEN** arbitrary text input SHALL be disabled, enforcing consistent taxonomy across all created articles.

#### Scenario: Preset tag selector chips
- **WHEN** an administrator edits tags
- **THEN** the interface SHALL provide one-click clickable chips for standardized tags (e.g. `merch`, `folie`, `dtg`, `træ`, `akryl`, `pla`, `sensor`, `cad`), preventing inconsistent spelling and duplicates.

### Requirement: Zero-Friction Image Upload & Visual Asset Picker
The PoS Craft Manager SHALL provide automated local image file upload and a visual asset gallery, eliminating the need to manually enter raw file paths.

#### Scenario: Drag-and-drop / file picker upload in PoS
- **WHEN** an administrator selects an image file from their computer
- **THEN** the server action SHALL store the file in `/public/images/craft/` locally, generate an optimized safe URL, and assign it to the article without manual file management.

#### Scenario: Choosing from visual asset library gallery
- **WHEN** an administrator clicks "Vælg fra bibliotek"
- **THEN** the system SHALL display a visual gallery modal of existing lab photos and thumbnails, allowing 1-click selection of the desired photo.
