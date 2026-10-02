## ADDED Requirements

### Requirement: Equipment Creation Deduplication Guardrail
The system SHALL verify that no identical equipment record exists in the same lab before inserting a new inventory item.

#### Scenario: Accidental double-submission of new inventory
- **WHEN** an administrator submits an equipment creation request with an identical name, lab, and location within 60 seconds of a previous creation
- **THEN** the server action detects the duplication candidate and rejects the redundant creation with an informative warning

### Requirement: Database Unique Constraint Exception Interceptor
The system SHALL intercept Prisma `P2002` unique constraint violations and translate them into user-friendly localized error responses.

#### Scenario: Duplicate patron studentId or assetTag insertion
- **WHEN** a creation or update operation violates a unique database index
- **THEN** the system returns a sanitized error message stating which field conflicts, preventing uncaught 500 crashes and schema leakage
