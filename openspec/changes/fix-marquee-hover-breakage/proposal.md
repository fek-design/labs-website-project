## Why

The laboratory running marquee ribbon breaks severely when hovered. Because `:hover` was attached to individual track elements (`.animate-marquee-track:hover`), hovering pauses only one track while its sibling track continues in motion, causing the two tracks to collide, overlap text, and fracture the infinite loop. Additionally, child text nodes trigger rapid hit-testing enter/leave cycles while in motion, resulting in violent visual shuddering and flickering.

## What Changes

- **Synchronized Parent-Level Pause**: Move the hover pause behavior from individual track elements to the parent container (`.marquee-container:hover .animate-marquee-track` / `group-hover`), ensuring Track A and Track B freeze and resume in unified lockstep without desynchronization.
- **Hit-Testing Flutter Elimination**: Add `pointer-events-none` to all internal text and bullet elements so the mouse hovering over moving characters never triggers micro enter/leave flicker loops.
- **Hardware Acceleration & Smooth Motion**: Add `will-change: transform` to `.animate-marquee-track` in `app/globals.css` to prevent subpixel jitter during pause and resume transitions.
- **Selection & Drag Shielding**: Enforce `select-none`, `cursor-default`, and `touch-pan-y` across the ribbon to prevent accidental mouse text drag selections.

## Capabilities

### New Capabilities
- `marquee-stability-and-hover-behavior`: Defines unified container-level hover synchronization and flutter-free infinite loop behavior for marquee ribbons.

### Modified Capabilities
None.

## Impact

- `app/globals.css`: Replaces individual `.animate-marquee-track:hover` rule with container-scoped hover pause and adds `will-change: transform`.
- `components/landing/MarqueeRibbon.tsx`: Adds container grouping, pointer-event shielding on text items, and interaction safety classes.
