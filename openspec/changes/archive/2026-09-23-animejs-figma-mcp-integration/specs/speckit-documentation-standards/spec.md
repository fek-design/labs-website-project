## NEW Requirements

### Requirement: Motion Engine Selection Matrix and TSDoc Documentation
The system SHALL document and enforce an authoritative 3-way animation matrix across `motion/react`, `gsap`, and `animejs`, requiring TSDoc annotations for all shared animation presets, hooks, and helpers.

#### Scenario: Choosing the appropriate animation engine
- **WHEN** a developer or AI agent implements animated UI features
- **THEN** they follow the established decision matrix:
  - Use `motion/react` for component mount/unmount, interactive micro-physics, layout morphs (`layoutId`), modals, and drawers
  - Use `gsap` for macro-scroll telemetry, scrubbed pinned containers, and long-scroll narrative timelines
  - Use `animejs` for SVG path stroke drawing, SVG morphing, numeric counter tickers, and complex multi-property staggered element choreographies

#### Scenario: Documenting custom animations and variants
- **WHEN** new animation variants, spring constants, or hooks are added to `lib/motion.ts` or `lib/anime.ts`
- **THEN** functions and variants include TSDoc comments specifying parameters, return types, physical stiffness/damping semantics, and expected 60fps performance considerations

### Requirement: Figma MCP Node Traceability and Speckit Rules
The OpenSpec configuration (`openspec/config.yaml`) and workflow artifacts SHALL enforce bidirectional traceability between Figma nodes and codebase components, integrating Figma MCP queries into spec-driven development.

#### Scenario: Traceable UI recreation from Figma frames
- **WHEN** an OpenSpec proposal or design document introduces or updates UI screens
- **THEN** the proposal and design documents cite the specific Figma node IDs (e.g. `#87:5314`, `#79:827`) extracted via the Figma MCP server

#### Scenario: Speckit rule enforcement for Figma MCP
- **WHEN** the OpenSpec agent proposes or applies changes
- **THEN** `openspec/config.yaml` rules instruct the agent to inspect Figma tokens via the Figma MCP server before generating UI markup and save all referenced visual assets locally to guarantee Zero Cloud Dependency

### Requirement: Figma Mockup UI Fidelity vs. Autonomous UX Engineering
The system SHALL recognize that the Figma design file is a static visual mockup rather than a functional prototype. The implementation SHALL strictly replicate the visual UI (layout structure, spacing, color tokens, typography, borders, and bento geometry) extracted from Figma via the MCP server, while autonomously engineering the missing UX layer.

#### Scenario: Replicating UI styling while implementing missing UX interactions
- **WHEN** an agent or developer implements a component from a Figma mockup frame
- **THEN** the visual styling (colors, fonts, padding, borders, shadows) matches the Figma frame tokens
- **AND** the component deliberately implements essential interactive UX absent from the static mockup:
  - Micro-interactions (hover, active, focus-visible states using CMYK token flips)
  - Asynchronous loading states and skeleton fallbacks
  - Form validation errors and input feedback
  - Optimistic UI updates, toast notifications, and accessible keyboard navigation (`Tab`, `Enter`, `Escape`)
