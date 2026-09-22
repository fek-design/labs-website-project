## Why

The landing page currently uses a continuous dark surface across all sections. To match the authentic Zealand Labs visual identity and provide visual contrast, the section starting from *Prototyping & Understøttelse* downward needs a clean white background with inverted typography, card surfaces, and borders. Additionally, the machine telemetry list currently expands as a static list of cards; it must be fixed to exactly ~3 visible cards in height with content clipping (`overflow-hidden`) and a smooth continuous vertical auto-scroll (no manual user scrollbar). The vector pixel transition will be paused, and each lab must be assigned a distinct CMYK accent color (Makerspace: Cyan, Medialab: Magenta/Pink, Dimselab: Yellow) to reinforce campus lab identity.

## What Changes

- **Halt Pixel Transition**: Temporarily remove the SVG pixel transition to allow a crisp section break into the new white background.
- **Section Color Theme Architecture**:
  - Define structured light and dark semantic color tokens (`surface`, `surface-card`, `surface-card-hover`, `text-primary`, `text-secondary`, `text-muted`, `border-subtle`, `border-strong`).
  - Set the background from *Prototyping & Understøttelse* (`CampusLabExplorer`) down through the machine telemetry section and footer to pure white (`#FFFFFF`).
  - Invert text, cards, borders, and pills in the light-themed sections for high contrast and readability.
- **Dedicated Lab CMYK Identity**:
  - Assign each lab its dedicated CMYK token:
    - **Makerspace**: CMYK Cyan (`#009FE3`)
    - **Medialab**: CMYK Magenta / Brand Pink (`#E6007E`)
    - **Dimselab**: CMYK Yellow (`#FFED00`)
  - Apply these CMYK tokens to lab indicator lines, spotlight badge tags, active states, and telemetry accents.
- **Autoscrolling Clipped Machine Telemetry**:
  - Constrain the machine list component to a fixed height of approximately 3 cards (~240px–280px depending on spacing).
  - Enforce content clipping (`overflow-hidden`) so it is NOT a scrollable element (no mouse/touch scrollbar or user scroll container).
  - Implement continuous, buttery-smooth vertical auto-scrolling with duplicated tracks to showcase all machines without layout elongation.

## Capabilities

### New Capabilities
- `landing-light-theme-and-autoscroll-telemetry`: Covers the dual-theme section architecture (dark hero to light content sections), CMYK lab color coding, and the autoscrolling clipped 3-card machine telemetry list.

### Modified Capabilities
<!-- None -->

## Impact

- `components/landing/CampusLabExplorer.tsx`: Converted to light background styling with inverted text and CMYK accent color matching.
- `components/landing/HotspotShowcase.tsx`: Pixel transition paused; converted to light theme styling.
- `components/landing/MachineTelemetrySection.tsx`: Height constrained to 3 cards, scrollbar removed, smooth infinite vertical auto-scroll ticker added, light card theme applied.
- `components/landing/CampusContext.tsx`: Lab definitions updated with assigned CMYK color tokens.
- `app/globals.css`: Added keyframes for vertical autoscroll translation and semantic theme variables.
