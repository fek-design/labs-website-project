## MODIFIED Requirements

### Requirement: Database Test Content Purge and Clean Production Seeding
The database tooling SHALL provide an automated, safe purge capability to remove all mock/test entities, completely wiping placeholder inventory items, and establishing a 100% clean baseline.

#### Scenario: Purging test loans and mock patrons
- **WHEN** the clean test data script is executed
- **THEN** all test loans, placeholder repair logs, mock patrons, and dummy assets created during testing are safely removed while preserving foundational Lab entities, Super Admin credentials, and taxonomy Tags.

#### Scenario: Complete dummy data wipe
- **WHEN** the clean all dummy data script (`prisma/clean-all-dummy-data.ts`) is executed
- **THEN** all placeholder inventory items, test tags, and mock bundles are purged from the database, establishing a pristine blank slate while preserving foundational lab facilities and SuperAdmin accounts.

#### Scenario: Running clean production seed
- **WHEN** `npm run db:seed` is executed
- **THEN** only authentic Køge campus facilities (Makerspace & Medialab), verified taxonomy tags, and legitimate administrative profiles are seeded idempotently without placeholder hardware.
