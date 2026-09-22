## Purpose

Specifies the hero-overlaid navigation bar that unhooks and becomes non-transparent upon scrolling, and the white background styling for the photographic showcase gallery.

## ADDED Requirements

### Requirement: Hero-Overlaid Navbar with Scroll-Triggered Sticky Transition
The navigation bar SHALL render on initial page load as a seamless, transparent overlay directly over the Hero photography without consuming preceding document flow height. When the user scrolls down past the Hero section threshold, the navbar SHALL transition to a non-transparent frosted dark backdrop (`bg-black/85 backdrop-blur-md border-b border-white/10 shadow-2xl`) and remain fixed/sticky to the top of the viewport.

#### Scenario: Initial page load within the Hero section
- **WHEN** the visitor opens the landing page at scroll position 0
- **THEN** the navbar renders as a transparent overlay directly on top of the Hero image with no artificial background or top border

#### Scenario: Scrolling down past the Hero section
- **WHEN** the visitor scrolls down past the Hero threshold (`scrollY > 120px`)
- **THEN** the navbar smoothly transitions into a frosted translucent dark surface with a subtle bottom border and shadow, maintaining sticky visibility

#### Scenario: Scrolling back to the top
- **WHEN** the visitor scrolls back to the top of the page (`scrollY <= 120px`)
- **THEN** the navbar smoothly reverts to a fully transparent overlay over the Hero

### Requirement: White Background for Images Showcase Section
The photographic showcase section (`HotspotShowcase.tsx`) SHALL render on a pure white background (`#FFFFFF`) forming a unified white showcase band with the adjacent prototype carousel.

#### Scenario: Viewing the photographic showcase section
- **WHEN** a visitor scrolls from the prototype carousel into the image showcase section
- **THEN** the section background continues on pure white (`#FFFFFF`), with photographic cards framed against the light surface and high-contrast typography

#### Scenario: Interacting with hotspot beacons on white background
- **WHEN** a visitor hovers over or taps a hotspot beacon on an image card
- **THEN** the beacon and tooltip display clearly with high contrast against the image and surrounding white section
