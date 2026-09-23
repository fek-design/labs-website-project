## MODIFIED Requirements

### Requirement: Agency Motion and Visual Toolkits
The system SHALL provide a centralized visual and motion architecture library (`lib/motion.ts` and `app/globals.css`) exposing standard motion variants, spring configurations, diagonal wave coordinate calculators, and GSAP macro animation helpers strictly using `motion/react` and `gsap`. The system SHALL NOT depend on or include `anime.js` in the client runtime or build bundle.

#### Scenario: Using deliberate spring transitions
- **WHEN** UI elements animate, enter, or morph
- **THEN** components utilize predefined agency physics presets (`springGentle`, `springSnappy`, `springBouncy`) from `motion/react` with consistent damping and stiffness

#### Scenario: Diagonal coordinate wave stagger
- **WHEN** grid or matrix components (such as calendar heatmaps or bento cards) mount
- **THEN** the system provides coordinate-based delay calculation `getDiagonalWaveDelay(row, col, factor)` ensuring smooth 60fps wave transitions

#### Scenario: Exclusion of Anime.js
- **WHEN** inspecting client imports, component trees, and runtime dependencies
- **THEN** no module or component imports from `animejs`, `@types/animejs`, or legacy `lib/anime.ts`
