## MODIFIED Requirements

### Requirement: Hero Section and Navigation
The system SHALL present a responsive hero section featuring the Zealand Labs header, campus indicator scoped dynamically to active campuses (defaulting and constrained currently to Køge Campus), hamburger drawer trigger, and an exploration call-to-action button, without presenting a blocking first-time campus gate modal. The top navigation bar SHALL automatically hide on scroll down and smoothly reappear on scroll up. The underlying multi-campus architecture SHALL remain intact for future campus expandability.

#### Scenario: User visits the root landing page
- **WHEN** a visitor navigates to `/`
- **THEN** the system displays the top navigation with `LABS` brand, the active campus indicator showing "KØGE CAMPUS", and the `Zealands Kreative hjørne` hero banner with the `UDFORSK` button, without prompting the visitor with a blocking multi-campus selection modal.

#### Scenario: User scrolls down the page
- **WHEN** a visitor scrolls downward past the header threshold (60px)
- **THEN** the system smoothly translates the top navigation bar upward out of view (`-translate-y-full`).

#### Scenario: User scrolls up after scrolling down
- **WHEN** a visitor scrolls upward while anywhere down the page
- **THEN** the system immediately and smoothly slides the top navigation bar back into view (`translate-y-0`).

### Requirement: Infinite Lab Marquee
The system SHALL display an infinite running marquee ribbon transitioning across the active Køge lab pillars.

#### Scenario: Continuous marquee presentation
- **WHEN** the hero section is in view
- **THEN** the system continuously scrolls the label sequence `MAKERSPACE • MEDIALAB •` with seamless looped animation, omitting any reference to Dimselab.

### Requirement: Brand Footer and Navigation Directory
The system SHALL render a branded footer with lab index navigation and operating ethos scoped to active Køge facilities.

#### Scenario: Footer index navigation
- **WHEN** the visitor reaches the bottom of the page
- **THEN** the system renders the cyan footer with `LABS` typography, mission statement, and direct links strictly to Makerspace and Medialab directories, omitting Dimselab and Roskilde references.
