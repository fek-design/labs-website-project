## Purpose

Define the persistent data layer for Zealand Labs: domain entities, enums, relationships, and database lifecycle operations that power lab modules, inventory workflows, and admin authentication.

## ADDED Requirements

### Requirement: Local MySQL persistence via Prisma

The system SHALL persist all operational data in a local MySQL database accessed exclusively through Prisma ORM. The connection string MUST be supplied via environment variable (`DATABASE_URL`) and MUST NOT be hardcoded.

#### Scenario: Database connection from environment

- **WHEN** the application starts with a valid `DATABASE_URL` pointing to a local MySQL instance
- **THEN** Prisma connects successfully and all schema tables are reachable

#### Scenario: Missing connection string

- **WHEN** the application starts without `DATABASE_URL`
- **THEN** database initialization fails with a clear configuration error

### Requirement: Lab entity drives slot injection

The system SHALL store each lab as a `Lab` record with at minimum: unique slug, display name, description, and a module identifier that determines which React module loads in the immutable shell (`CapabilityBento`, `EquipmentPOS`, or `ManualViewer`).

#### Scenario: Lab lookup by slug

- **WHEN** a request targets `/labs/{slug}`
- **THEN** the system retrieves the matching `Lab` record and its module identifier

#### Scenario: Unknown lab slug

- **WHEN** a request targets a slug with no matching `Lab` record
- **THEN** the system returns a not-found result

### Requirement: Unified Inventory table with hardware type discrimination

The system SHALL store all physical assets in a single `Inventory` table. Each record MUST belong to exactly one `Lab`, MUST have a `HardwareType` of either `STATIC_MACHINE` or `BORROWABLE_GEAR`, and MUST carry a unique asset identifier suitable for barcode/QR scanning.

#### Scenario: Static machine in makerspace

- **WHEN** an inventory record has `HardwareType` = `STATIC_MACHINE`
- **THEN** it MUST have an `OperationalStatus` and MUST NOT participate in loan checkout

#### Scenario: Borrowable gear in medialab

- **WHEN** an inventory record has `HardwareType` = `BORROWABLE_GEAR`
- **THEN** it MUST be eligible for the loan workflow and MUST NOT require `OperationalStatus`

### Requirement: Makerspace operational status telemetry

The system SHALL track live machine status for `STATIC_MACHINE` inventory via an `OperationalStatus` enum with values `AVAILABLE`, `MAINTENANCE`, and `BROKEN`. Walk-in makerspace operations MUST NOT use booking records.

#### Scenario: Admin sets machine to maintenance

- **WHEN** an authenticated admin updates a static machine's status to `MAINTENANCE`
- **THEN** the updated status is persisted and readable by the CapabilityBento module

#### Scenario: Default status for new static machine

- **WHEN** a new `STATIC_MACHINE` inventory record is created without an explicit status
- **THEN** its `OperationalStatus` defaults to `AVAILABLE`

### Requirement: Medialab loan transaction engine

The system SHALL record equipment loans as `Loan` transactions linking a `BORROWABLE_GEAR` inventory item to a `Patron` (identified by student ID). Each loan MUST record checkout timestamp, and MUST support recording a return timestamp when the item is checked back in.

#### Scenario: Admin checks out borrowable gear

- **WHEN** an authenticated admin scans a borrowable asset and enters a valid patron student ID
- **THEN** a new `Loan` record is created with checkout timestamp and the inventory item is marked as on-loan

#### Scenario: Admin returns borrowed gear

- **WHEN** an authenticated admin scans a borrowed asset that has an active loan
- **THEN** the active loan's return timestamp is set and the inventory item is marked as available

#### Scenario: Double checkout prevented

- **WHEN** an authenticated admin attempts to check out an asset that already has an active (unreturned) loan
- **THEN** the system rejects the checkout with an error indicating the item is already on loan

### Requirement: Patron records are unauthenticated identifiers

The system SHALL store patrons by student ID without login credentials. Patron records MUST be creatable on first checkout if the student ID does not yet exist.

#### Scenario: First-time patron checkout

- **WHEN** an admin checks out gear for a student ID not yet in the database
- **THEN** a new `Patron` record is created and linked to the loan

### Requirement: Normalized tag taxonomy via junction table

The system SHALL store tags (use-cases, study paths, materials) in a `Tag` table and associate them with inventory items through an `InventoryTag` many-to-many junction table. Tags MUST be reusable across multiple inventory items.

#### Scenario: Filter inventory by tag

- **WHEN** a query requests inventory items tagged with a specific tag
- **THEN** the system returns only items linked via `InventoryTag`

#### Scenario: Multiple tags on one item

- **WHEN** an inventory item is associated with multiple tags
- **THEN** all tag associations are persisted independently in `InventoryTag`

### Requirement: Admin authentication persistence

The system SHALL store admin credentials separately from patron data. Only admin accounts MAY authenticate via NextAuth Credentials Provider. The database MUST NOT store student/patron passwords.

#### Scenario: Admin login

- **WHEN** valid admin credentials are submitted through the auth provider
- **THEN** the system verifies against stored admin credentials and grants an authenticated session

#### Scenario: Patron cannot authenticate

- **WHEN** a patron student ID is submitted as login credentials
- **THEN** the system MUST NOT grant an authenticated admin session

### Requirement: Schema migrations are version-controlled

The system SHALL manage schema changes through Prisma migrations stored in version control. The initial migration MUST create all domain tables and enums.

#### Scenario: Fresh database setup

- **WHEN** a developer runs the migration command against an empty MySQL database
- **THEN** all tables, enums, indexes, and foreign keys are created matching the Prisma schema

#### Scenario: Migration replay on existing database

- **WHEN** migrations are applied to a database that already has the latest migration
- **THEN** no destructive changes occur and the command completes successfully

### Requirement: Development seed data

The system SHALL provide a seed script that populates representative development data: at least two labs (one makerspace, one medialab), sample inventory of both hardware types, tags with associations, one admin account, and sample patrons.

#### Scenario: Seed on empty database

- **WHEN** a developer runs the seed command after migrations
- **THEN** the database contains queryable sample data for all core entities without duplicate key errors on re-run
