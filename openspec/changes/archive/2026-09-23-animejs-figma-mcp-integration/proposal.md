## Why

The Zealand Labs web platform has a robust design system and animation setup powered by `motion/react` (for component transitions, modals, and micro-interactions) and `gsap` (for macro-scroll telemetry). However, three critical gaps currently exist:

1. **Complex SVG, Path & Ticker Motion Gap**: Certain high-fidelity agency animations—such as complex SVG stroke dashoffset drawing (e.g. machine blueprints, CNC toolpaths, laser cut vectors), numeric metric counters/tickers, and staggered typography split-text animations—are either verbose or cumbersome in `motion/react` and trigger licensing or setup overhead in `gsap`. `anime.js` (v3) provides a lightweight, dependency-free, and high-performance engine tailored for these exact SVG and numerical tweening scenarios.
2. **Speckit Documentation Deficit**: There is no authoritative, documented decision matrix in the OpenSpec speckit explaining when developers should reach for `motion/react`, `gsap`, or `anime.js`. This creates ambiguity in component implementations and risks overlapping animation libraries.
3. **Figma MCP Integration in the Speckit Contract**: While OpenSpec currently references local image mockups in `openspec/mockups/`, the project has now configured the **Figma MCP Server** (`figma-developer-mcp` with tools `get_figma_data` and `download_figma_images`). The OpenSpec speckit rules (`openspec/config.yaml`), delta specs, and proposal workflows must explicitly respect and leverage the Figma MCP server to inspect exact frame dimensions, typography, layout modes, and CMYK accents directly from the Figma canvas, while maintaining the strict "Zero Cloud Dependency" mandate by downloading assets locally into the repository.
4. **Figma Mockup UI vs. UX Engineering Boundary**: The Figma file is strictly a **visual mockup**, not an interactive prototype; all user experience (UX) flows, states, and behaviors are completely missing from the Figma canvas. The system must replicate the visual UI (tokens, geometry, typography, palette) from Figma with high fidelity, while the speckit and engineering architecture must deliberately engineer the missing UX (interactive micro-states, loading skeletons, error boundaries, optimistic UI, keyboard navigation, and form feedback) rather than expecting Figma to specify UX behavior.

## What Changes

### 1. Anime.js Animation Toolkit Integration
- Introduce `animejs` and `@types/animejs` into `package.json`.
- Create a dedicated helper module `lib/anime.ts` (and expose via `lib/motion.ts`) providing React hooks and agency presets:
  - **`useAnime`**: React 19/Next.js client hook managing animation lifecycle, cleanups, and target references.
  - **`drawSvgPath`**: `drawSvgPath(target, options)` for machine blueprint outlines, laser cut path animations, and circuit traces.
  - **`animateCounter`**: `animateCounter(target, from, to, options)` for real-time inventory statistics, sensor telemetry, and front desk metrics.
  - **Staggered Text & Grid Pulses**: Coordinated character wave staggers complementing existing diagonal wave helpers.

### 2. Comprehensive Animation Architecture Documentation
- Establish explicit developer guidelines and a clear 3-way animation decision matrix:
  - **`motion/react`**: Component lifecycle (mount/unmount), layout animations (`layoutId`), modals, drawers, and interactive micro-physics.
  - **`gsap` & `@gsap/react`**: Macro-level scroll-driven timelines, scrubbed pinned containers, and long-form narrative telemetry.
  - **`anime.js`**: Complex SVG path drawing/morphing, numeric counters/metric tickers, canvas/DOM property tweening, and granular staggered sequences.
- Mandate TSDoc/JSDoc documentation for all shared motion primitives.

### 3. Figma MCP Integration in the OpenSpec Speckit Contract
- Update `openspec/config.yaml` to formalize the Figma MCP protocol within the OpenSpec design contract:
  - **Inspection**: The AI agent and developers must query the Figma MCP server (`get_figma_data`) using Figma node IDs (e.g. `#87:5314` for `Dashboard - Indstillinger`, `#79:827` for `Dashboard - Frontpanel`) to extract authoritative layout modes, padding, gap, colors, and typography.
  - **Zero-Cloud Local Asset Synchronization**: Use `download_figma_images` to save SVGs and PNG assets directly to `public/images/` or `openspec/mockups/`, strictly prohibiting external cloud CDN image links.
  - **Bidirectional Traceability**: Change proposals, specs, and component headers must document the corresponding Figma node ID and frame title.

### 4. Figma Mockup UI Fidelity vs. Speckit UX Engineering Contract
- Formalize the architectural distinction in `openspec/config.yaml` and speckit guides:
  - **UI Fidelity (from Figma via MCP)**: The visual structure, spacing, color tokens, typography, borders, and bento geometry must mirror the Figma frames.
  - **UX Engineering (from Speckit)**: Because Figma contains no prototype logic or UX flows, developers and AI agents must proactively design and implement the interaction layer:
    - Interactive micro-states: hover, active, focus-visible, and disabled states.
    - Asynchronous feedback: skeleton loaders, optimistic UI updates, action spinners, and error toasts.
    - Transactional flows: server action mutations, session verifications, and audit logging.
    - Accessibility: keyboard navigation, ARIA roles, and screen-reader semantics.

## Capabilities

### New Capabilities
- `speckit-documentation-standards`: Authoritative developer documentation rules, the 3-way animation decision matrix (`motion/react` vs `gsap` vs `animejs`), Figma MCP workflow protocols, and the Mockup UI vs. UX Engineering specification.

### Modified Capabilities
- `visual-toolkits`: Extended to include Anime.js animation primitives, SVG path drawing/counter helpers, and mandatory Figma MCP design token extraction.

## Impact

- **Dependencies**: `package.json` adds `animejs` (`^3.2.2`) and `@types/animejs` (`^3.1.12`).
- **Core Libraries**: New module `lib/anime.ts`, re-exports in `lib/motion.ts`.
- **OpenSpec Configuration**: `openspec/config.yaml` updated with animation rules, Figma MCP inspection commands, zero-cloud asset download workflows, and the UI-vs-UX contract.
- **Documentation**: New architecture guide in `openspec/core/animation-architecture.md`.
- **Zero Cloud Mandate**: Preserved. All Figma assets fetched via MCP are saved strictly to the local filesystem (`public/images/` and `openspec/mockups/`).
