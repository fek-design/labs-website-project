## ADDED Requirements

### Requirement: Full-Bleed Carousel Cards with Integrated Action Button
The prototype carousel component (`PrototypeCarousel.tsx`) SHALL present prototype items using full-bleed photo cards where the product photography spans 100% of the card surface, featuring an integrated action button at the bottom that houses the prototype name and interaction affordance (`→`).

#### Scenario: User views prototype carousel
- **WHEN** the prototype carousel mounts
- **THEN** each card displays a full-bleed photo background with an overlaid bottom button containing the item name and an arrow indicator

### Requirement: Interactive Spacious Hotspot Popover Cards
The hotspot showcase component (`HotspotShowcase.tsx`) SHALL present hotspot popovers with generous internal padding (`p-4` to `p-5`) and SHALL enable direct click/tap navigation to related lab sections (`#support-pillars`) with active hover and focus styles.

#### Scenario: User clicks a hotspot popover
- **WHEN** user taps or clicks an open hotspot popover card
- **THEN** the browser smoothly navigates to the destination section with clear interactive feedback

### Requirement: Font Hierarchy with Geometric Grotesque Fallbacks
The system SHALL configure display headers to use `Stack Sans Notch` with a fallback stack anchored by `Space Grotesk`, and body typography to use `Stack Sans Text` with a fallback stack anchored by `Inter`, hosted locally without external runtime cloud dependencies.

#### Scenario: Rendering display headings and text
- **WHEN** headlines and body text render across the application
- **THEN** headlines utilize `Stack Sans Notch` / `Space Grotesk` and body copy utilizes `Stack Sans Text` / `Inter`
