## Purpose

Provides a first-time onboarding gate for devices that have not visited Zealand Labs before, establishing brand identity and prompting users to choose their nearest campus before entering the site.

## ADDED Requirements

### Requirement: First-Time Visit Detection and Onboarding Gate
The system SHALL detect whether the visiting device has previously selected a campus location or visited the site via client-side storage (`localStorage` key `zealand_labs_campus_selected`). If no record exists, the system SHALL present the full-screen campus onboarding gate before displaying the landing page.

#### Scenario: New device arrives with no saved campus
- **WHEN** a user visits the root page `/` from a browser or device without a stored campus preference
- **THEN** the system displays the full-screen onboarding gate overlay preventing premature access to the landing page content

#### Scenario: Returning device arrives with existing campus preference
- **WHEN** a user visits the root page `/` from a device with a previously stored campus preference in `localStorage`
- **THEN** the system bypasses the onboarding gate directly into the personalized landing page matching the stored campus

### Requirement: Visual Fidelity and Zealand Labs Brand Identity
The onboarding gate SHALL strictly reproduce the visual aesthetics of Figma node `144:462` ("Intro") while emphasizing the authentic Zealand Labs identity. The screen SHALL feature:
1. Deep black atmospheric background (`#000000`) with a dark translucent video/image backdrop (`rgba(0, 0, 0, 0.81)` with subtle blur).
2. Prominent Zealand Labs header branding (`Stack Sans Notch` typography with high-contrast white text).
3. Primary instruction heading *"Vælg Campus nærest dig:"* accompanied by a prominent dynamic display of the currently active campus name.
4. Clean architectural styling adhering to the design system tokens.

#### Scenario: Viewing branding and atmospheric background
- **WHEN** the onboarding gate mounts on screen
- **THEN** it renders a dark cinematic backdrop with the prominent Zealand Labs header and crisp typography

#### Scenario: Dynamic campus headline display
- **WHEN** a campus is highlighted or chosen in the selection row
- **THEN** the headline area dynamically updates to showcase the selected campus name in large high-contrast type (`Stack Sans Text`)

### Requirement: Interactive Campus Location Selection
The system SHALL provide an interactive selection control presenting all regional Zealand campuses (`Køge`, `Roskilde`, `Næstved`, `Holbæk`). The currently chosen campus SHALL be styled with active visual prominence (bold typography, white fill, subtle indicator), while inactive campuses remain subdued (`opacity-60` / extra light weight) and respond to tap/click interactions.

#### Scenario: User clicks or taps a campus option
- **WHEN** the user selects "Roskilde", "Næstved", or "Holbæk"
- **THEN** the system updates the active selection state immediately, updating both the campus row indicator and the main heading display

#### Scenario: Keyboard accessibility
- **WHEN** a user navigates between campus options using arrow keys or Tab
- **THEN** focus indicators clearly identify the current option and pressing Space or Enter selects it

### Requirement: Gate Departure and State Persistence
The system SHALL provide a primary action button labeled *"TRÆD IND"* styled with high-contrast white fill and dark text. Activating *"TRÆD IND"* SHALL:
1. Save the chosen campus to client-side `localStorage` (`zealand_labs_campus_selected`).
2. Update the shared `CampusContext` across the application so that header telemetry, lab inventories, and machine hubs reflect the chosen campus.
3. Animate the gate out using smooth spring transition physics (`motion/react`), seamlessly revealing the landing page.

#### Scenario: User clicks "TRÆD IND"
- **WHEN** the user clicks the *"TRÆD IND"* button
- **THEN** the selection is saved to persistent storage, `CampusContext` is updated, and the gate smoothly animates out to display the main landing portal

#### Scenario: Re-opening campus selector from the site
- **WHEN** the user later desires to switch their campus
- **THEN** the user can switch campuses at any time via the persistent campus switcher in `LandingHeader`, which synchronizes back to `localStorage`
