## Purpose

Provides local MySQL database infrastructure, schema migration management, baseline dataset seeding, and database connectivity for the Zealand Labs system under a strict zero-cloud dependency model.

## ADDED Requirements

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
