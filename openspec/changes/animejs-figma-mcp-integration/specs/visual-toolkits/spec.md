## MODIFIED Requirements

### Requirement: Agency Motion and Visual Toolkits
The system SHALL provide a centralized visual and motion architecture library (`lib/motion.ts`, `lib/anime.ts`, and `app/globals.css`) exposing standard motion variants, spring configurations, diagonal wave coordinate calculators, GSAP macro animation helpers, and Anime.js SVG/numerical tweening primitives for `motion/react`, `gsap`, and `animejs`.

#### Scenario: Using deliberate spring transitions
- **WHEN** UI elements animate, enter, or morph
- **THEN** components utilize predefined agency physics presets (`springGentle`, `springSnappy`, `springBouncy`) with consistent damping and stiffness

#### Scenario: Diagonal coordinate wave stagger
- **WHEN** grid or matrix components (such as calendar heatmaps or bento cards) mount
- **THEN** the system provides coordinate-based delay calculation `getDiagonalWaveDelay(row, col, factor)` ensuring smooth 60fps wave transitions

#### Scenario: SVG Path and Blueprint Line Drawing with Anime.js
- **WHEN** blueprint schematics, vector diagrams, machine outlines, or laser cut toolpaths render
- **THEN** the system provides Anime.js utilities (`drawSvgPath`) to execute high-performance stroke dashoffset line drawing with configurable easing and duration

#### Scenario: High-Precision Numeric Metrics Ticker
- **WHEN** dashboard metrics, statistics, inventory counts, or sensor readings update
- **THEN** the system uses Anime.js numeric interpolation helpers (`animateCounter`) to smoothly transition numerical values from start to target values without re-rendering unnecessary DOM trees

### Requirement: OpenSpec Visual Mockup and Figma MCP Integration
The system SHALL maintain a dedicated `openspec/mockups/` folder supporting PDF and image formats (PNG, JPG, WEBP, SVG), and the OpenSpec configuration SHALL reference both this directory and the **Figma MCP Server** (`get_figma_data`, `download_figma_images`) to ensure pixel-accurate UI recreation while upholding strict Zero Cloud Dependency.

#### Scenario: Referencing mockups during proposals and implementation
- **WHEN** an OpenSpec change is proposed or applied
- **THEN** the AI agent inspects available mockups in `openspec/mockups/` and queries the Figma MCP tool for specific node IDs to replicate layouts, typography, paddings, and color contracts accurately

#### Scenario: Zero-Cloud Asset Sync via Figma MCP
- **WHEN** design assets (SVGs, icons, raster illustrations) are required from Figma
- **THEN** the agent downloads the assets locally to `public/images/` or `openspec/mockups/` using `download_figma_images`, avoiding external cloud CDN URLs
