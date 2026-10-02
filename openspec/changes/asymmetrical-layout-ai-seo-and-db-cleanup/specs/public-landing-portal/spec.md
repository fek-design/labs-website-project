## ADDED Requirements

### Requirement: Asymmetrical Span Allocations and Human Attention Optimization
The Public Landing Portal SHALL structure core editorial sections (Hero, Machine Telemetry, Prototyping Support) using asymmetrical grid span allocations (such as 35/65 or 40/60) where textual copy is strictly bound to ergonomic reading measures (45–65 characters / `max-w-prose`) and graphic/interactive components occupy the primary visual space.

#### Scenario: Rendering hero section on desktop viewports
- **WHEN** a visitor views the landing page on viewports >= 1024px
- **THEN** text copy and call-to-actions are constrained to a tight left column while interactive visual showcases and telemetry graphics dominate the larger right column.

#### Scenario: Reading comfort on large screens
- **WHEN** long-form descriptions or guidelines are displayed
- **THEN** line lengths SHALL NOT exceed 65 characters, preventing eye fatigue and horizontal head scanning.

### Requirement: AI-First Structured Data and Machine Discoverability
The Public Landing Portal SHALL embed Schema.org JSON-LD graph objects defining the facility, equipment capabilities, and operational taxonomy for AI search agents and semantic web parsers.

#### Scenario: AI crawler parses landing page
- **WHEN** an AI crawler or search engine inspects `/`
- **THEN** a valid `<script type="application/ld+json">` block is present in the DOM containing `EducationalOrganization`, active facility names ("Makerspace", "Medialab"), campus address ("Køge"), and primary public capabilities.

### Requirement: Accessibility and Disability Compliance (WCAG 2.2 AA)
The Public Landing Portal SHALL provide high-visibility keyboard focus indicators, accessible ARIA descriptions, and support for reduced-motion preferences across all interactive elements.

#### Scenario: Navigating with keyboard tab sequence
- **WHEN** a user navigates interactive buttons, links, or drawer triggers using `Tab`
- **THEN** each element displays an unmistakable focus ring (`focus-visible:ring-2 focus-visible:ring-[#FFED00]`) with at least 4.5:1 contrast against adjacent surfaces.

#### Scenario: Reduced motion preference enabled
- **WHEN** a user has system preference `prefers-reduced-motion: reduce` enabled
- **THEN** hero animations, marquee ribbon motion, and parallax transitions are disabled or replaced with immediate non-distracting cross-fades.
