## MODIFIED Requirements

### Requirement: Interactive Project Hotspots
The system SHALL present showcase cards containing interactive hotspot beacons that reveal specific equipment or process details exclusively upon explicit click or tap interaction, removing passive hover activation.

#### Scenario: Triggering an equipment hotspot
- **WHEN** the visitor clicks or taps on a pulsing hotspot beacon over a project showcase card
- **THEN** an informative popover card is revealed with tactile spring physics, remaining open until toggled off or dismissed.

#### Scenario: Hovering without clicking
- **WHEN** the visitor hovers their pointer over a hotspot beacon without clicking
- **THEN** the popover card SHALL NOT mount or open, preventing accidental obstruction while browsing images.

### Requirement: Prototype Inspiration Carousel
The system SHALL provide a horizontally scrollable carousel displaying prototype product categories for student inspiration, concluding with a streamlined catalogue navigation card where "Udforsk hele kataloget" serves as the primary header without secondary subtext clutter.

#### Scenario: Browsing prototype categories
- **WHEN** the visitor scrolls to the "Din næste prototype starter her" section
- **THEN** the system displays interactive product category cards (such as Kop, Mulepose, and T-Shirt) that can be horizontally navigated.

#### Scenario: Viewing streamlined catalogue CTA card
- **WHEN** the visitor navigates to the end of the prototype carousel
- **THEN** the catalogue terminal card SHALL display "Udforsk hele kataloget" at the top replacing "Katalog", omit redundant explanatory body subtext, and offer a direct navigation action to `/katalog`.
