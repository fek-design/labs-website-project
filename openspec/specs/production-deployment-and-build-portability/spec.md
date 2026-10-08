# production-deployment-and-build-portability Specification

## Purpose
Ensures the repository installs, builds, and runs reproducibly on any clean development machine or self-hosted Linux VM server without missing dependencies, manual workarounds, or runtime pathing failures.

## Requirements

### Requirement: Clean Clone Automatic Type Generation
The build system SHALL guarantee that `@prisma/client` types and models are automatically generated whenever dependencies are installed.

#### Scenario: Fresh repository installation
- **WHEN** a developer or CI runner executes `npm install` on a freshly cloned repository
- **THEN** the `postinstall` hook executes `prisma generate` and populates `@prisma/client` with all schema types prior to any build execution

### Requirement: Environment Configuration Availability
The repository SHALL provide a tracked `.env.example` template covering all required runtime variables.

#### Scenario: New machine environment setup
- **WHEN** a clean repository is cloned
- **THEN** `.env.example` is present on disk and contains explicit keys and instructions for `DATABASE_URL`, `SESSION_SECRET`, and `NEXTAUTH_SECRET` without sensitive production values

### Requirement: Turbopack Build Isolation
The build system SHALL build production bundles without dynamic server tracing warnings or project-wide directory inclusion.

#### Scenario: Production build compilation
- **WHEN** `npm run build` is executed
- **THEN** compilation completes with zero filesystem tracing warnings and creates optimized standalone chunks
