## Context

See `proposal.md` for background. The project utilizes a strict Zero-Cloud architecture and high-fidelity agency design system (Brand Black base floor, CMYK accents, Stack Sans typography). To advance the agency animation capabilities and eliminate ambiguity across contributors and AI agents, the speckit requires:
1. Addition of `anime.js` (v3) alongside `motion/react` and `gsap` for SVG path drawing, numeric tickers, and complex staggered animations.
2. An authoritative documentation standard and decision matrix governing the 3 animation engines.
3. Explicit integration of the **Figma MCP Server** into `openspec/config.yaml` and the speckit workflow to inspect Figma nodes, verify layout tokens, and save assets locally.
4. An explicit architectural contract defining the boundary between **Figma Visual Mockup (UI fidelity)** and **Speckit Engineering (autonomous UX creation)**.

## Goals / Non-Goals

**Goals:**
- Install `animejs` and `@types/animejs` in `package.json`.
- Create `lib/anime.ts` with React 19/Next.js friendly utilities (`useAnime`, `drawSvgPath`, `animateCounter`, `staggerText`) and re-export via `lib/motion.ts`.
- Formulate a clean, comprehensive Animation Architecture Guide (`openspec/core/animation-architecture.md`) detailing when to use `motion/react`, `gsap`, or `animejs`.
- Update `openspec/config.yaml` to include explicit rules and operations guidance for Figma MCP inspection (`get_figma_data`), local asset saving (`download_figma_images`), and the UI-vs-UX contract.
- Clearly establish that Figma frames provide the visual UI mockup, while UX interactions, state transitions, validation, and feedback must be engineered in the codebase.
- Implement an interactive showcase / component verification displaying Anime.js blueprint SVG path drawing and an animated numeric metrics counter.

**Non-Goals:**
- Expecting Figma frames to specify complete UX flows, interaction states, or error handling.
- Replacing `motion/react` or `gsap`. All three libraries serve distinct, complementary purposes.
- Storing Figma image assets on external cloud CDNs (violates the Zero-Cloud mandate).
- Building an external documentation website (documentation lives natively within the repository and speckit).

## Decisions

### 1. 3-Way Animation Architecture Decision Matrix

| Engine | Primary Domain | Ideal Use Cases | Performance & Lifecycle Pattern |
| :--- | :--- | :--- | :--- |
| **`motion/react`** | Declarative React UI Micro-Physics | Modals, drawers, layout morphs (`layoutId`), hover/tap states, page transitions, spring physics (`springSnappy`, `springGentle`). | React-first lifecycle; declaratively tied to component tree and DOM presence (`AnimatePresence`). |
| **`gsap` + `@gsap/react`** | Macro-Scroll & Pinned Telemetry | ScrollTrigger timelines, scrubbed pinned containers, multi-scene interactive narratives across viewport scroll. | Imperative context via `useGSAP`; targets scroll scrub and complex macro timelines. |
| **`anime.js`** | SVG Vectors & Numerical Tickers | SVG stroke dashoffset line drawing (blueprints, laser traces), path morphing, numerical counters/metrics tickers, and granular character-level split typography. | Direct DOM/SVG property mutation; unmounted/cleaned up via `useAnime` hook or standard `useEffect`. |

### 2. Anime.js React Integration (`lib/anime.ts`)
- **SSR & React 19 Safety**: Anime.js directly mutates DOM/SVG properties. All Anime.js functions and hooks must run strictly within client components (`'use client'`).
- **Hook Design**:
  ```ts
  export function useAnime(
    animationFactory: (targets: HTMLElement | SVGElement | null) => anime.AnimeInstance | undefined,
    deps: React.DependencyList = []
  ): React.RefCallback<any>
  ```
- **Key Helper Functions**:
  - `drawSvgPath(target, options)`: Automatically computes path length and animates `strokeDashoffset` from `anime.setDashoffset` to `0`.
  - `animateCounter(target, from, to, options)`: Interpolates a numeric object value and updates target `textContent` with formatting.

### 3. Figma MCP Integration in Speckit (`openspec/config.yaml`)
- **Configuration Updates**:
  - Add to `context`:
    ```yaml
    Figma Integration: Figma MCP Server (figma-developer-mcp via stdio). Query get_figma_data for node inspection and download_figma_images for asset extraction.
    ```
  - Add to `rules`:
    ```yaml
    design_system:
      - Always verify layout geometry, dimensions, and typography tokens against the Figma MCP server when implementing screens matching Figma frames.
      - Never link to external Figma cloud images. Always download vector and raster assets locally to /public/images or openspec/mockups/ using download_figma_images.
    ```
  - Add to `operations.apply.guidance`:
    ```yaml
    - Query Figma MCP server for the target node ID to confirm exact flexbox layout, padding, gap, and color codes before writing UI components.
    ```

### 4. Figma as Visual Mockup vs. Speckit UX Engineering (Bridging the UX Gap)

The Figma file is a static design artifact (mockup), not an interactive UX prototype.

| Layer | Source of Truth | What is Provided | What Must Be Engineered in Code |
| :--- | :--- | :--- | :--- |
| **Visual UI** | **Figma Canvas (via MCP)** | Color tokens, typography hierarchy, card paddings, bento grid structures, borders, icons, brand aesthetics. | Pixel-accurate translation into Tailwind and CSS variables (`app/globals.css`). |
| **Interactive UX** | **OpenSpec Speckit & Code** | *None (missing from Figma)* | - Hover, active, focus-visible states (CMYK token flips)<br>- Loading skeletons and asynchronous progress spinners<br>- Form validations, field feedback, and error boundaries<br>- Optimistic updates and transient notifications/toasts<br>- Micro-interactions with `motion/react` & `anime.js`<br>- Accessible keyboard navigation (`Tab`, `Escape`, `Enter`) |

**Core Rule for Developers & AI Agents**:
Never pause implementation or assume a feature is incomplete simply because Figma does not illustrate error states, loading skeletons, or interactive micro-flows. The Figma MCP provides the visual layout target; engineering the interactive UX is the deliberate responsibility of the code implementation.

## Risks / Trade-offs

- **[Bundle Size]** → `animejs` is ~14KB minified, introducing negligible bundle overhead while providing comprehensive SVG path and numerical tweening capabilities.
- **[Ref vs Selector Targeting]** → Prefer React refs over string CSS selectors (e.g. `.class`) in `useAnime` to avoid collision in modular components.
- **[Zero-Cloud Mandate]** → Ensure all Figma MCP asset downloads are explicitly verified to reside in `public/images/` or `openspec/mockups/` before committing.
- **[UX Divergence Risk]** → Without written UX guidelines, different engineers might implement conflicting interaction patterns. The `animation-architecture.md` guide and `openspec/config.yaml` rules standardize these UX patterns.
