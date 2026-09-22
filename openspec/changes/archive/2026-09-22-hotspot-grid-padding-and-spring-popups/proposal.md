## Why

The hotspot showcase section currently has tight vertical padding, causing the showcase grid to feel crowded between the prototype carousel and the dark campus explorer. Furthermore, the parent showcase cards have an `overflow-hidden` restriction that clips the interactive beacon popover cards when they render at their natural anchor positions. Finally, the popup cards lack tactile, lively motion physics when triggered.

## What Changes

- **Spacious Section Spacing**: Increase top and bottom padding on `#showcase` (e.g., `pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-24`) for clean, deliberate vertical breathing room.
- **Unrestricted Popover Display (No Overflow Clipping)**: Remove the `overflow-hidden` restriction on the outer showcase card containers so interactive beacon popup cards can render naturally at their defined coordinate anchors without clipping, while keeping background photos properly bounded.
- **Springy Popover Motion**: Upgrade the popup cards in `HotspotShowcase.tsx` from standard linear timing to agency spring physics (`springBouncy` with calibrated damping and stiffness) for a snappy, tactile pop on hover/tap.

## Capabilities

### Modified Capabilities
- `visual-toolkits`: Establishes unclipped interactive overlay card behavior on media showcases, enhanced vertical section breathing room, and tactile spring motion for beacon inspection cards.

## Impact

- `components/landing/HotspotShowcase.tsx`: Section padding, parent overflow structure, and popover spring motion.
