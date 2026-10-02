## ADDED Requirements

### Requirement: Accessible Catalogue Layout and Payload Optimization
The catalogue page (`/katalog`) SHALL implement asymmetrical visual-to-metadata hierarchy, lightweight client payload delivery, and keyboard-first accessibility.

#### Scenario: Asymmetrical catalogue card layout
- **WHEN** catalogue cards render on desktop viewports
- **THEN** high-density visual photography and equipment tags receive dominant visual weighting over abbreviated, high-contrast typography.

#### Scenario: Optimized dynamic payload loading
- **WHEN** visitors browse `/katalog`
- **THEN** heavy interactive dependencies and modals are dynamically imported via route splitting (`next/dynamic`), maintaining fast First Contentful Paint.

### Requirement: AI-First Catalogue Schema Markup
The catalogue page SHALL inject item-level Schema.org JSON-LD definitions representing the physical fabrication prototypes and machines available in the labs.

#### Scenario: Inspecting catalogue item schemas
- **WHEN** an indexing engine or AI agent requests `/katalog`
- **THEN** the DOM contains an `@graph` array of `CreativeWork` and `Product` schemas detailing title, process tags, campus location, and difficulty.

#### Scenario: Screen reader announcements on dynamic filtering
- **WHEN** a user with a screen reader selects or clears a filter
- **THEN** an `aria-live="polite"` region announces the updated matching count (e.g. "Viser 8 projekter") without jarring focus shifts.
