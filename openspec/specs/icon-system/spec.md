# Icon System Capability Specification

## Purpose

Establishes a unified, accessible, and coherent iconography standard across Zealand Labs applications, replacing unstandardized Unicode emojis and loose character glyphs with standardized vector icons.

## Requirements

### Requirement: Elimination of Raw Unicode Emojis and Ad-hoc Glyphs
The system SHALL NOT render raw Unicode emojis or ad-hoc text glyphs (such as ⚠️, 🎓, 🏛️, 📚, 🔍, 📕, 📄, 🗑️, ⚡, ✓, ✕, ✎, +) as visual icons in user interface chrome, badges, tables, alerts, or interactive triggers. All such visual representations SHALL be rendered as vector icon components from the project's standardized icon pack (`@phosphor-icons/react`).

#### Scenario: Rendering status alerts and prerequisites
- **WHEN** prerequisite alerts, warnings, or educational indicators render in craft or equipment interfaces
- **THEN** the interface renders dedicated semantic vector icons (such as `Warning` or `GraduationCap`) in place of raw Unicode emojis

#### Scenario: Rendering location and category tags
- **WHEN** inventory locations, machine hubs, or manuals display lab affiliations or resource categories
- **THEN** the system renders vector icons (such as `Buildings`, `Books`, or `FileText`) styled via theme color tokens

#### Scenario: Rendering confirmation and dismiss actions
- **WHEN** user interfaces render checkmarks, dismiss/close controls, or edit toggles
- **THEN** they render vector components (such as `Check`, `X`, `PencilSimple`) instead of raw text characters like ✓ or ✕

### Requirement: Standardized Icon Scale and Weight Hierarchy
The system SHALL constrain icon dimensions and line weights to an established token hierarchy: compact inline badges (14px–16px), standard buttons and input adornments (20px), primary navigation or prominent action headers (24px), and spotlight/empty-state icons (32px+). Icon weights SHALL default to `regular` for default states, `bold` for active or emphatic states, and `fill` for filled indicators.

#### Scenario: Sizing inline list items and action buttons
- **WHEN** an icon renders inside a button, filter chip, or table row
- **THEN** it renders with a standardized size token (16px or 20px) preventing line height displacement or misaligned baselines

#### Scenario: Active state weight transition
- **WHEN** an interactive tab or selectable item transitions between inactive and active states
- **THEN** the icon weight transitions predictably (e.g. from `regular` to `bold` or `fill`) in coordination with accent colors

### Requirement: Icon Accessibility and Contrast Conformance
All vector icons used as decorative adornment adjacent to visible text SHALL include `aria-hidden="true"` so screen readers do not announce redundant symbols. Any icon-only interactive trigger (such as modal close buttons or quick action triggers) SHALL supply an accessible name via `aria-label` or `title`. All icons SHALL inherit color via `currentColor` or deliberate semantic color classes.

#### Scenario: Decorative icon rendered next to text
- **WHEN** an icon is displayed alongside visible label text (e.g. "Check out initiated")
- **THEN** the icon element contains `aria-hidden="true"` to prevent redundant assistive readout

#### Scenario: Icon-only interactive trigger
- **WHEN** a button contains only an icon without accompanying text (such as a modal close button)
- **THEN** the button element provides an explicit `aria-label` or `title` describing the action (e.g. `aria-label="Luk modal"`)
