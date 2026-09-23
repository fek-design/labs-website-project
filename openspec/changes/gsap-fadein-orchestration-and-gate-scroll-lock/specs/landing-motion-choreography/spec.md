## Purpose

Establishes deliberate, human-paced GSAP ScrollTrigger entrance choreography across landing page sections while enforcing single-instance first-time campus gate presentation with strict background scroll locking.

## ADDED Requirements

### Requirement: Page-Wide Coordinated GSAP Scroll Choreography
The landing page SHALL orchestrate deliberate, human-paced entrance fade-ins across all major sections using `gsap` and `@gsap/react` (`useGSAP`), ensuring elements reveal with hardware-accelerated opacity and subtle vertical displacement as they enter the viewport.

#### Scenario: User loads the landing page
- **WHEN** the landing page initial render occurs
- **THEN** the Hero section elements (headline, description, actions, and status badges) reveal via a coordinated, staggered timeline without visual jank

#### Scenario: User scrolls down through subsequent sections
- **WHEN** sections (Prototype Carousel, Hotspot Showcase, Campus Lab Explorer, Machine Telemetry) enter the viewport trigger range
- **THEN** their respective titles, cards, and interactive viewports execute smooth, coordinated fade-in reveals with gentle easing

### Requirement: Single-Instance First-Time Campus Gate Prompt
The system SHALL present the location selection gate (`FirstTimeCampusGate`) only on the user's initial visit when no existing selection is stored in `localStorage` under `STORAGE_KEY_CAMPUS`.

#### Scenario: User visits the site for the very first time
- **WHEN** a user loads the landing page with no stored campus preference
- **THEN** the campus selection gate is displayed over the landing page

#### Scenario: User selects a campus and clicks TRÆD IND
- **WHEN** the user selects a campus and clicks "TRÆD IND"
- **THEN** the selection is saved to `localStorage`, the gate dismisses, and the gate does not display again on subsequent page visits or reloads

#### Scenario: Returning user visits the landing page
- **WHEN** a user who previously selected a campus visits the landing page
- **THEN** the campus selection gate does not open, displaying the landing page directly with the user's saved campus preference

### Requirement: Background Scroll Locking on Active Gate Modal
The system SHALL lock background page scrolling whenever the campus selection gate is active, preventing accidental scroll interactions on the page underneath.

#### Scenario: Gate modal is active
- **WHEN** the campus selection gate is displayed on the screen
- **THEN** scrolling on `document.body` and `document.documentElement` is disabled

#### Scenario: Gate modal is dismissed
- **WHEN** the user clicks "TRÆD IND" and the gate closes
- **THEN** full scroll capability is cleanly restored to the page
