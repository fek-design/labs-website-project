## MODIFIED Requirements

### Requirement: Audit Log and History Telemetry
The system SHALL provide a filterable audit log viewer (`LABS Logs`) matching Figma node `86:4299` with brand cyan accent (`#009FE3`), displaying a top search and refresh toolbar, main surface container (`#151517` with `#333333` border), subheader with record counter and `TYPE` dropdown filter, segmented horizontal metadata cards (`#202021` with `#444444` border and `#333333` dividers) showing `TIDSPUNKT`, `TYPE`, `AKTØR`, and `TARGET`, and an action toggle (`Se Ændring ▼`) revealing expandable JSON delta changes.

#### Scenario: Inspecting audit logs
- **WHEN** an administrator views the History & Audit tab
- **THEN** the system lists all system mutations sorted chronologically in high-contrast segmented cards matching Figma frame 86:4299 with expandable JSON payload deltas.

#### Scenario: Filtering logs by action type
- **WHEN** an administrator selects an action type from the `TYPE` dropdown filter (e.g. "LOAN_CREATE", "RETURN_LOAN", or "ALLE")
- **THEN** the system immediately updates the displayed log cards to include only matching mutations and synchronizes the total count badge.

#### Scenario: Real-time search query filtering
- **WHEN** an administrator enters a text query in the "Søg logs..." search bar
- **THEN** the system filters audit records across actor names, entity IDs, and action keywords in real time.

#### Scenario: Refreshing log telemetry
- **WHEN** an administrator clicks the "Refresh" action button in the toolbar
- **THEN** the system re-fetches the latest audit log entries and updates the feed with fresh database records.
