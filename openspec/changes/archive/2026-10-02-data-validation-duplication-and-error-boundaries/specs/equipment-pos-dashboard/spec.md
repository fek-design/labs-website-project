## ADDED Requirements

### Requirement: Transactional Checkout Concurrency Lock
The system SHALL execute gear checkouts inside atomic database transactions verifying operational status before loan creation.

#### Scenario: Concurrent checkout attempt on same asset
- **WHEN** two checkout requests target the same serialized equipment item simultaneously
- **THEN** only the first transaction completes, while the second transaction rejects with a clear message stating the item is no longer available

### Requirement: Runtime Schema Validation on POS Operations
The system SHALL validate all checkout, return, and patron mutation inputs against strict Zod schemas before processing database queries.

#### Scenario: Malformed checkout payload
- **WHEN** a client submits a checkout request with missing asset IDs, an invalid patron UUID, or a return date beyond the 30-day policy
- **THEN** the server action rejects the payload with a structured validation error and does not touch the database
