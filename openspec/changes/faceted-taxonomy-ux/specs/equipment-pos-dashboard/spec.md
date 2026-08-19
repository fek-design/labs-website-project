## MODIFIED Requirements

### Requirement: Equipment Loan Calendar Schedule
The system SHALL provide an interactive calendar schedule of equipment loans showing active checkouts, expected returns, and overdue items organized by date with status color-coding, which automatically synchronizes and updates immediately when an administrator performs a checkout, return, or loan modification.

#### Scenario: Monthly loan calendar overview
- **WHEN** an administrator navigates to the POS calendar view
- **THEN** the system displays a monthly grid where expected return dates align precisely with the selected calendar day without a 1-day offset

#### Scenario: Date selection and loan inspector
- **WHEN** an administrator clicks on a calendar day cell or loan event badge
- **THEN** the system displays a detailed inspection modal showing the borrower patron student ID, equipment asset tag, "checked out" status, checkout timestamp, expected return date, actual check-in date comparison if returned, and check-in actions

#### Scenario: Calendar month navigation
- **WHEN** an administrator triggers previous/next month navigation or selects 'Today'
- **THEN** the system queries loan records within the active date range and updates the calendar grid without full page reload

#### Scenario: Live calendar update on equipment checkout
- **WHEN** an administrator confirms checkout for equipment at the front desk
- **THEN** the system immediately propagates the mutation to the loan schedule calendar, updating day event badges and agenda items without requiring a page refresh
