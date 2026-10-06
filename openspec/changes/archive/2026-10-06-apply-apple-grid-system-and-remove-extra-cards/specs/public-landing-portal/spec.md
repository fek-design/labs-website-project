## MODIFIED Requirements

### Requirement: Hero Section and Navigation
The system SHALL present a centered responsive hero section featuring the Zealand Labs header, campus indicator scoped to Køge Campus, hamburger drawer trigger, and an exploration call-to-action button, structured within a standard 12-column responsive layout grid without forced highlight borders, fabricated status cards, or secondary descriptive paragraphs. The top navigation bar SHALL automatically hide on scroll down and smoothly reappear on scroll up. The underlying multi-campus architecture SHALL remain intact for future campus expandability.

#### Scenario: User visits the root landing page
- **WHEN** a visitor navigates to `/`
- **THEN** the system displays the top navigation with `LABS` brand, the active campus indicator showing "Køge Campus", and the centered `Zealands Kreative hjørne` hero banner with the `UDFORSK` button, arranged within a clean 12-column layout grid without yellow highlight borders, simulated campus status boxes, or extraneous paragraph text.

#### Scenario: User scrolls down the page
- **WHEN** a visitor scrolls downward past the header threshold (60px)
- **THEN** the system smoothly translates the top navigation bar upward out of view (`-translate-y-full`).

#### Scenario: User scrolls up after scrolling down
- **WHEN** a visitor scrolls upward while anywhere down the page
- **THEN** the system immediately and smoothly slides the top navigation bar back into view (`translate-y-0`).
