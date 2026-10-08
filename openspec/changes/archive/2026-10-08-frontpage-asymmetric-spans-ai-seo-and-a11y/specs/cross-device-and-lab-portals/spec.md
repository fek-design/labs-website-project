## Purpose

Ensures seamless cross-device interactivity across mobile phones and external local area network computers, restores dedicated laboratory portal pages for Makerspace and Medialab, and stabilizes Playwright browser automation drivers.

## ADDED Requirements

### Requirement: Cross-Device Client Hydration and Touch Interactivity
The system SHALL ensure clean React client hydration across all client devices (including mobile phones, tablets, and secondary PCs connecting over local network IP addresses), guaranteeing that all click handlers, touch interactions, drawer toggles, and modal dismissals attach and function immediately without hydration mismatch bailouts.

#### Scenario: Mobile visitor loads landing page over LAN IP
- **WHEN** a visitor accesses the application from a smartphone or secondary PC using a local network address (e.g. `http://192.168.x.x:3000`)
- **THEN** client components hydrate cleanly without runtime hydration exceptions, and tapping interactive buttons (such as the hamburger menu, tab switchers, or catalogue filters) executes immediately.

### Requirement: Local Area Network Server Action Origin Permissions
The system SHALL configure Next.js Server Action allowed origins in `next.config.ts` to permit invocations originating from local network IPv4 ranges (`192.168.*`, `10.*`, `127.0.0.1`, and `localhost`), ensuring database queries and server actions execute without origin rejection errors.

#### Scenario: Submitting server action from secondary computer
- **WHEN** a user on a secondary device on the local network invokes a Server Action or triggers database mutations
- **THEN** Next.js processes the request without origin mismatch or 403 Forbidden errors.

### Requirement: Dedicated Makerspace Laboratory Portal
The system SHALL provide a dedicated public portal page at `/makerspace` detailing the physical prototyping facility, 3D printers, laser cutters, vinyl cutting, heat presses, workshop opening hours, safety SOPs, and direct navigation into relevant equipment and prototype guides.

#### Scenario: Visitor navigates to makerspace portal
- **WHEN** a visitor visits `/makerspace`
- **THEN** the system displays the dedicated Makerspace facility portal featuring equipment inventories, safety guidelines, and active opening schedules.

### Requirement: Dedicated Medialab Laboratory Portal
The system SHALL provide a dedicated public portal page at `/medialab` detailing media production and gear loan facilities, 4K camera equipment, podcast audio, studio lighting, borrowing guidelines, and direct links to the equipment catalogue.

#### Scenario: Visitor navigates to medialab portal
- **WHEN** a visitor visits `/medialab`
- **THEN** the system displays the dedicated Medialab facility portal featuring AV hardware listings, loan rules, and direct links to `/katalog`.

### Requirement: Playwright Local Automation and Testing Reliability
The system SHALL support local browser automation testing by ensuring Playwright and test scripts can execute reliably in offline and local development environments without unhandled CDN binary download failures.

#### Scenario: Running browser automation tests
- **WHEN** automated test scripts or browser validation agents run against the application
- **THEN** the test environment utilizes installed browser binaries or resilient test fallbacks without blocking on remote driver download errors.
