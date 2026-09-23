# pos-craft-blog-management Specification

## Purpose
Enables lab administrators and technicians to curate, publish, and manage physical craft prototype guides and blog articles directly from the PoS console, ensuring instant synchronization and reactive dynamic fetching across the public catalogue.

## Requirements

### Requirement: PoS Crafts and Articles Tab
The Admin PoS Console (`/admin`) SHALL include a dedicated master navigation tab for managing craft prototypes and blog articles distinct from physical equipment inventory.

#### Scenario: Technician opens the Crafts & Artikler tab
- **WHEN** an authenticated technician selects "Crafts & Artikler" in the master PoS navigation
- **THEN** the system SHALL display the craft articles management table showing all prototype guides, their active campuses, lab assignments, categories, and tags.

#### Scenario: Creating or editing a craft prototype article
- **WHEN** a technician submits a prototype entry with title, slug, category, tags, campus availability, prerequisites, and machinery linkages
- **THEN** the system SHALL persist the craft article via server action, write an audit log entry, and immediately make it available to the public catalogue.

#### Scenario: Deleting or unpublishing a craft prototype
- **WHEN** a technician deletes an article
- **THEN** the system SHALL remove the article from public discovery and record the removal in the audit history.

### Requirement: Dynamic Item Fetching and Public Catalogue Synchronization
The public catalogue page (`/katalog`) SHALL dynamically fetch craft prototype items and reactively filter them according to the active campus context (`køge` or `roskilde`).

#### Scenario: Catalogue dynamically fetches items based on active campus
- **WHEN** a student or visitor views `/katalog` with campus set to "køge"
- **THEN** the system SHALL dynamically fetch available craft articles and render all prototypes configured for Køge campus facilities.

#### Scenario: Campus switching updates displayed crafts reactively
- **WHEN** the user switches campus from "køge" to "roskilde" via the navigation header
- **THEN** the catalogue grid SHALL immediately re-evaluate available prototypes without dropping into an empty zero-item error state.

#### Scenario: Offline fallback loading
- **WHEN** the server database is booting or unreachable
- **THEN** the system SHALL gracefully fall back to the bundled static `CRAFT_CATALOG` seed items, ensuring zero downtime or blank catalogue states.
