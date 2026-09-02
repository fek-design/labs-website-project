# Visual Toolkits Capability Specification

## Requirements

### Requirement: Agency Motion and Visual Toolkits
The system SHALL provide a centralized visual and motion architecture library (`lib/motion.ts` and `app/globals.css`) exposing standard motion variants, spring configurations, diagonal wave coordinate calculators, and GSAP macro animation helpers for `motion/react` and `gsap`.

#### Scenario: Using deliberate spring transitions
- **WHEN** UI elements animate, enter, or morph
- **THEN** components utilize predefined agency physics presets (`springGentle`, `springSnappy`, `springBouncy`) with consistent damping and stiffness

#### Scenario: Diagonal coordinate wave stagger
- **WHEN** grid or matrix components (such as calendar heatmaps or bento cards) mount
- **THEN** the system provides coordinate-based delay calculation `getDiagonalWaveDelay(row, col, factor)` ensuring smooth 60fps wave transitions

### Requirement: OpenSpec Visual Mockup Reference Directory
The system SHALL maintain a dedicated `openspec/mockups/` folder supporting PDF and image formats (PNG, JPG, WEBP, SVG), and the OpenSpec configuration SHALL reference this directory in global prompts to ensure pixel-accurate UI recreation.

#### Scenario: Referencing mockups during proposals and implementation
- **WHEN** an OpenSpec change is proposed or applied
- **THEN** the AI agent inspects available mockups in `openspec/mockups/` to replicate layouts, typography, and color contracts accurately
