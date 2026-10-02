# database-setup Specification

## Purpose
Provides local MySQL database infrastructure, schema migration management, baseline dataset seeding, and database connectivity for the Zealand Labs system under a strict zero-cloud dependency model.

## Requirements

### Requirement: Local Database Environment Configuration
The system SHALL support containerized local MySQL database execution via Docker Compose and provide valid environment variables for local client connectivity.

#### Scenario: Running local database container
- **WHEN** Docker Compose is started with `docker compose up -d`
- **THEN** a MySQL 8.0 instance is accessible on port 3306 with the configured credentials and database `zealand_labs`

#### Scenario: Missing environment configuration
- **WHEN** the application starts without a valid `DATABASE_URL` in `.env`
- **THEN** the system fails with a descriptive database connection configuration error

### Requirement: Schema Migration and Synchronization
The system SHALL provide commands to synchronize the Prisma data schema with the local MySQL database instance without data corruption.

#### Scenario: Applying database schema migrations
- **WHEN** a migration command is executed against the running database
- **THEN** tables for Admin, AuditLog, Patron, Lab, Inventory, RepairLog, Tag, InventoryTag, and Loan are created or updated to match `schema.prisma`

### Requirement: Baseline Data Seeding
The system SHALL provide an automated seed script that populates the database with initial baseline operational entities including Labs, default Admin accounts with secure password hashes, taxonomy Tags, and representative Inventory records.

#### Scenario: Executing database seed
- **WHEN** the seed command is run against an initialized database
- **THEN** default Labs ("makerspace", "medialab"), initial taxonomy Tags, Super Admin account, and baseline inventory items are inserted into the database idempotently

### Requirement: Global Prisma Client Instance
The application runtime SHALL export a singleton Prisma Client instance that prevents duplicate connections in development environments and provides structured ORM access across Server Actions and server components.

#### Scenario: Querying database via singleton client
- **WHEN** a server component or Server Action queries the database through `lib/prisma.ts`
- **THEN** the query executes against the singleton Prisma client instance without exhausting database connection pools

### Requirement: Database Test Content Purge and Clean Production Seeding
The database tooling SHALL provide an automated, safe purge capability to remove mock/test entities and a production-grade seed script that establishes a pristine baseline.

#### Scenario: Purging test loans and mock patrons
- **WHEN** the clean test data script is executed
- **THEN** all test loans, placeholder repair logs, mock patrons, and dummy assets created during testing are safely removed while preserving foundational Lab entities, Super Admin credentials, and taxonomy Tags.

#### Scenario: Running clean production seed
- **WHEN** `npm run db:seed` is executed
- **THEN** only authentic Køge campus facilities (Makerspace & Medialab), verified taxonomy tags, real equipment presets, and legitimate administrative profiles are seeded idempotently.

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
