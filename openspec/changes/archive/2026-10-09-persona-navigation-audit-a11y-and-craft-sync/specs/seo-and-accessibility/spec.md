## ADDED Requirements

### Requirement: WCAG AA Keyboard Focus Indicators
The system SHALL display high-contrast visible focus rings (`focus-visible:ring-2 focus-visible:ring-[#009FE3] focus-visible:outline-none`) across all interactive inputs, search filters, navigation drawer links, and buttons when navigated via keyboard.

#### Scenario: User navigates interactives via keyboard Tab key
- **WHEN** a user tabs into any interactive button, input field, or link
- **THEN** the element renders a distinct 2px cyan (`#009FE3`) focus ring that satisfies WCAG AA contrast against dark background floors

### Requirement: Persona-Aligned Navigation Landmarks and Labels
The system SHALL provide distinct semantic landmarks with explicit `aria-label` annotations separating primary navigation, student prototyping links, and staff administrative routes across both mobile and desktop viewports.

#### Scenario: Screen-reader user navigates landmark structure
- **WHEN** a screen-reader user queries landmark regions
- **THEN** navigation sections clearly announce their roles and labels (e.g. `aria-label="Studerende navigation"` and `aria-label="Sidefod og navigation"`) without repetitive announcements
