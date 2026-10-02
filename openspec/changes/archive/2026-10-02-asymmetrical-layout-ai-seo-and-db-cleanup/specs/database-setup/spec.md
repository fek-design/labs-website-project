## ADDED Requirements

### Requirement: Database Test Content Purge and Clean Production Seeding
The database tooling SHALL provide an automated, safe purge capability to remove mock/test entities and a production-grade seed script that establishes a pristine baseline.

#### Scenario: Purging test loans and mock patrons
- **WHEN** the clean test data script is executed
- **THEN** all test loans, placeholder repair logs, mock patrons, and dummy assets created during testing are safely removed while preserving foundational Lab entities, Super Admin credentials, and taxonomy Tags.

#### Scenario: Running clean production seed
- **WHEN** `npm run db:seed` is executed
- **THEN** only authentic Køge campus facilities (Makerspace & Medialab), verified taxonomy tags, real equipment presets, and legitimate administrative profiles are seeded idempotently.
