## ADDED Requirements

### Requirement: Graceful Image Box Fallback on Catalogue Cards
The catalogue item card SHALL render a tactile, dark fallback container with an icon whenever an item lacks a thumbnail image or when image loading fails, preventing console errors and broken image glyphs.

#### Scenario: Item with missing or invalid image URL
- **WHEN** a catalogue card is rendered for an item where `thumbnailImage` or `heroImage` is null, empty, or fails network loading
- **THEN** the card renders a styled tactile container (`#141416` with `#262626` border) with an icon and label without throwing browser image decode errors
