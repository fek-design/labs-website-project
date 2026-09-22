## Purpose

Defines the presentation, copy, and geometry for the Zealand Labs campus selection gate, ensuring authentic database-aligned locations, architectural square CTA styling, and clear contextual copy.

## ADDED Requirements

### Requirement: Database-Aligned Regional Campus Selection
The system SHALL restrict regional campus selection options in the onboarding gate, `CampusContext`, and `LandingHeader` strictly to campuses backed by records in the database (`Køge` and `Roskilde`). Placeholder or unseeded mock campuses (e.g., Næstved, Holbæk) SHALL NOT be displayed.

#### Scenario: User views campus options in the onboarding gate
- **WHEN** the campus selection gate mounts
- **THEN** it displays exactly the two active database locations ("Køge" and "Roskilde") with clear active indicator feedback

#### Scenario: Dynamic campus headline readout
- **WHEN** the user switches between "Køge" and "Roskilde"
- **THEN** the large dynamic headline immediately updates to the selected campus name without layout shifting

### Requirement: Architectural Square Geometry for Primary Entry CTA
The primary action button labeled *"TRÆD IND"* SHALL feature sharp corners (`rounded-none` / `border-radius: 0px`) and compact dimensions (`px-8 py-3 text-sm tracking-wider uppercase font-semibold`), adhering strictly to Tier 1 of the project's Scandinavian functionalist geometry hierarchy.

#### Scenario: User views "TRÆD IND" CTA styling
- **WHEN** the onboarding gate renders on screen
- **THEN** the *"TRÆD IND"* button displays with square corners (`rounded-none`), white fill, dark uppercase typography, and a compact visual footprint

#### Scenario: User activates "TRÆD IND"
- **WHEN** the user presses or clicks *"TRÆD IND"*
- **THEN** the button delivers subtle scale feedback (`active:scale-95`), saves the chosen campus, and animates out with spring physics

### Requirement: Authentic Innovation Lab Context Copy
The onboarding gate SHALL present professional, authentic Danish copy describing Zealand Labs' open prototyping and media production facilities, clarifying that selecting a campus configures real-time machine availability, gear checkout, and workshop hours.

#### Scenario: User reads onboarding gate description
- **WHEN** the onboarding gate renders
- **THEN** it presents concise, informative copy explaining: *"Zealand Labs er åbne værksteder for prototyping, medieproduktion og fabrikation. Vælg dit primære campus for live maskinstatus, udstyrsudlån og lokale faciliteter."*
