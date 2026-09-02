## Context

Zealand Labs requires high-end agency visual polish across all interactions and workflows. By formalizing motion patterns (`motion/react`, `gsap`) and design system tokens in Tailwind CSS v4, along with establishing a dedicated `openspec/mockups/` visual asset library, all present and future changes achieve cohesive, intentional aesthetics without haphazard inline overrides.

## Goals / Non-Goals

**Goals:**
- Create `lib/motion.ts` with standardized spring transitions, diagonal wave coordinate calculators, staggered lists, and count-up easing functions.
- Enhance `app/globals.css` with CSS variables for CMYK accents (`--color-brand-yellow`, `--color-brand-pink`, `--color-brand-cyan`), surfaces, and font tokens.
- Establish `openspec/mockups/` supporting `.png`, `.jpg`, `.jpeg`, `.webp`, `.svg`, and `.pdf` files.
- Document the visual mockups workflow in `openspec/config.yaml` and `openspec/core/spec.md`.

**Non-Goals:**
- No alteration to database schemas or backend APIs.

## Decisions

### 1. Motion Toolkit (`lib/motion.ts`)
- **Springs**:
  - `snappy`: `{ type: "spring", stiffness: 400, damping: 28 }`
  - `gentle`: `{ type: "spring", stiffness: 200, damping: 24 }`
  - `bouncy`: `{ type: "spring", stiffness: 500, damping: 18 }`
- **Helpers**:
  - `diagonalWave(row, col, baseDelay = 0.015)`
  - `fadeInUp`, `scaleIn`, `slideInFromRight`, `cardHover`

### 2. Design System Tokens (`app/globals.css`)
- Bind CMYK colors, surface blacks (`#000000`, `#09090b`, `#141416`), borders (`#262626`), and `Stack Sans` font families.

### 3. OpenSpec Mockups Directory (`openspec/mockups/`)
- A shared location for visual PDFs and screenshots, registered in `openspec/config.yaml` to ensure deliberate, pixel-accurate replication.
