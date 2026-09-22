## ADDED Requirements

### Requirement: Showcase Section Breathing Room and Unclipped Interactive Overlays
The system SHALL provide generous vertical padding across the editorial showcase section (`#showcase` having `pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-24`) to ensure visual separation between the prototype carousel and dark telemetry modules. Parent showcase card containers SHALL NOT apply `overflow-hidden` constraints to interactive popovers, allowing beacon popup cards to render at their exact anchor coordinates without being clipped by card borders.

#### Scenario: User views showcase section spacing
- **WHEN** the showcase section renders on the landing page
- **THEN** it displays with spacious top and bottom vertical padding (`pt-8 sm:pt-12 md:pt-16` and `pb-16 sm:pb-24`), creating clear breathing room between adjacent sections

#### Scenario: User interacts with beacons near container boundaries
- **WHEN** a user activates a beacon located near the top or lateral edges of a showcase card
- **THEN** the popup inspection card renders fully visible at its natural anchor position without clipping by the parent card's boundary

### Requirement: Tactile Spring Physics for Hotspot Popovers
The system SHALL animate hotspot inspection popovers using spring physics from `motion/react` (utilizing `springBouncy` or high-stiffness low-damping spring curves) to deliver a lively, tactile bounce upon mounting and dismounting.

#### Scenario: Hotspot beacon trigger activated
- **WHEN** a user hovers or taps on an interactive hotspot beacon
- **THEN** the popover card scales and translates into view with responsive spring physics settling with a crisp bounce
