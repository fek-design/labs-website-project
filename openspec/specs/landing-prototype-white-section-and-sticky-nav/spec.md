# landing-prototype-white-section-and-sticky-nav Specification

## Purpose
Specifies the high-contrast white prototype carousel section, restoration of dark floor styling for lower sections, and a scroll-responsive sticky navigation header.

## Requirements

### Requirement: Dedicated White Background for Prototype Showcase
The system SHALL render the *"Din næste prototype starter her"* carousel section on a pure white background (`#FFFFFF`) with high-contrast pitch-black notch typography (`text-zinc-950`) and clearly delimited card surfaces, ensuring complete legibility without white-on-white text conflicts.

#### Scenario: Viewing the prototype showcase section
- **WHEN** a visitor views the *"Din næste prototype starter her"* section
- **THEN** the section background displays pure white (`#FFFFFF`), the headline displays in dark typography (`#09090b`), and each product card displays with contrasting borders and dark product labels

#### Scenario: Inspecting prototype product cards
- **WHEN** a visitor views product cards in the carousel (T-Shirt, Kop, Mulepose)
- **THEN** the cards render with defined borders (`border-zinc-300` / `#D4D4D8`), tinted card surfaces (`bg-zinc-100`), and dark text labels (`text-zinc-900`)

### Requirement: Dark Floor for Prototyping & Understøttelse and Telemetry
The system SHALL render the *"Prototyping & Understøttelse"* section and the Machine Telemetry section on the authentic dark floor (`#000000` / `#09090b`) with light typography (`text-white` / `text-zinc-300`) and CMYK lab accents.

#### Scenario: Viewing Prototyping & Understøttelse section
- **WHEN** a visitor scrolls to the *"Prototyping & Understøttelse"* section
- **THEN** the background displays dark (`#000000`), the headline and bullets display in white and light zinc, and the active lab step indicator and spotlight card render with the active lab's CMYK color

### Requirement: Sticky Header with Dynamic Scroll Background
The navigation header SHALL be fixed or sticky at the top of the viewport (`sticky top-0 z-50`) and dynamically transition its background styling based on scroll position.

#### Scenario: Viewing navbar at top of page
- **WHEN** the scroll position is within the initial Hero zone (`scrollY <= 60px`)
- **THEN** the navbar renders with a transparent background and transparent border

#### Scenario: Scrolling down past Hero section
- **WHEN** the visitor scrolls down past the Hero threshold (`scrollY > 60px`)
- **THEN** the navbar smoothly transitions into a frosted translucent dark surface (`bg-black/80 backdrop-blur-md border-b border-white/10 shadow-lg`), maintaining legibility of the logo, campus switcher, and POS console action
