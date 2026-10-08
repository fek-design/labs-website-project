## Purpose

Establishes an automated testing pipeline using Vitest and React Testing Library to verify authentication logic, checkout state machines, input bounds, and UI resilience against regressions.

## ADDED Requirements

### Requirement: Automated Unit Testing Harness
The project SHALL provide an automated test runner script executable via standard package commands.

#### Scenario: Running the test suite
- **WHEN** a developer or CI pipeline executes `npm test`
- **THEN** Vitest executes all test sheets and outputs a deterministic summary of passing and failing tests

### Requirement: Core Business Logic Test Coverage
The test suite SHALL validate authentication security, POS loan transactions, and input validation schemas.

#### Scenario: Loan checkout validation tests
- **WHEN** the test suite simulates checking out a broken or already-loaned serialized asset
- **THEN** the transaction test asserts that the operation is rejected and database stock remains unchanged

#### Scenario: Session token tampering tests
- **WHEN** the test suite modifies the HMAC payload or signature of a session token
- **THEN** the token verification test asserts that the session is rejected as null
