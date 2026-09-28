## ADDED Requirements

### Requirement: Active Lab Synchronization for Machine Hub
The Makerspace Machine Hub (`/admin` under Makerspace) SHALL accept the active lab context passed from the parent console and query static machines accordingly, allowing technicians to inspect and manage machines across facilities without hardcoded lab bindings.

#### Scenario: Switching active lab updates displayed machines
- **WHEN** an administrator switches the active lab in the navigation dock or passes a different `activeLab` context
- **THEN** the Machine Hub queries static machines matching that lab slug and updates the machine catalog view.
