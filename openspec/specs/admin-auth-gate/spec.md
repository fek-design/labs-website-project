# admin-auth-gate Specification

## Purpose
Provides a secure, fully Danish-localized authentication gate for administrative personnel entering the Zealand Labs staff console, ensuring blank default inputs and the complete elimination of temporary demo credentials.

## Requirements

### Requirement: Danish Localized Interface and Action Triggers
The administrative authentication gate SHALL render all user-facing interface copy in professional Danish, including screen titles, field labels, status messages, and the primary submission action button labeled "Log ind".

#### Scenario: Viewing login gate interface
- **WHEN** an unauthenticated operator accesses the administrative console
- **THEN** the screen displays the title "Personale Login", subtitle "Zealand Labs Offline Administrationsprotokol (Køge)", field labels "Brugernavn" and "Adgangskode", and a primary submission button labeled "Log ind".

#### Scenario: Submitting authentication credentials
- **WHEN** an operator clicks "Log ind" with valid credentials
- **THEN** the button displays "Logger ind..." with an animated loading indicator while the server action processes the request.

#### Scenario: Verification loader copy
- **WHEN** the authentication gate initializes while verifying existing session tokens
- **THEN** the loading screen displays "Verificerer lokal sikkerhedstoken...".

### Requirement: Complete Removal of Temporary Demo Credentials
The administrative login gate SHALL NOT display any hardcoded demo credentials, helper badges, or placeholder usernames/passwords, and SHALL initialize all form input fields to blank strings.

#### Scenario: Operator lands on login gate
- **WHEN** the login screen renders
- **THEN** both the username and password fields are completely blank without pre-filled values, and no "Temporary Demo Credentials" notification box is visible.

#### Scenario: Neutral input focus styling
- **WHEN** an operator focuses on the username or password input field
- **THEN** the field outline transitions to a neutral border (`focus:border-[#555555]`) without colored accent rings.
