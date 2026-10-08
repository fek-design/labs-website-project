## ADDED Requirements

### Requirement: Apple Editorial Narrow Container Width Layout
The administrative console and POS workspace SHALL align to the canonical editorial narrow container constraint (`max-w-5xl` / 1024px) matching the public frontpage design standard.

#### Scenario: Admin console rendering on desktop
- **WHEN** an administrator views `/admin` on a widescreen desktop monitor
- **THEN** the console layout wraps within a centered `max-w-5xl` boundary with comfortable margins, preventing excessive line lengths and eye fatigue

### Requirement: Transaction Test Verification
The POS transaction engine SHALL be backed by automated test coverage validating status transitions and inventory consistency.

#### Scenario: Running automated POS tests
- **WHEN** the test suite executes POS unit tests
- **THEN** tests assert single-loan serialized invariants, bulk item stock tracking, and return status updates without interacting with external network services
