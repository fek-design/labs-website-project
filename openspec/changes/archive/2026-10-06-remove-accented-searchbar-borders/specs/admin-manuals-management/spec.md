## MODIFIED Requirements

### Requirement: Centralized Manuals Dashboard
The system SHALL provide a dedicated top-level admin page (`LABS Manualer`) matching Figma frame 86:4076 with brand yellow `#FFED00` accent styling corresponding to Tab 4 in the cyclic navigation scheme, live document counters, search toolbar featuring neutral focus border styling without yellow rings, and 3-column card grid.

#### Scenario: Viewing manuals dashboard
- **WHEN** an authenticated administrator opens the Manuals tab
- **THEN** the system displays the `LABS Manualer` header with yellow accent styling, search toolbar with neutral focus borders, live available manual count, and a responsive grid of document cards.

#### Scenario: Empty state handling
- **WHEN** no manuals match the current search or filter criteria
- **THEN** the system displays an informative zero-data state with a prompt to upload a new manual or clear active filters.
