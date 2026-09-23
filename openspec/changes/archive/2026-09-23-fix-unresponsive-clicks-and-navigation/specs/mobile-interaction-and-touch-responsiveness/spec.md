## Purpose

Ensures all interactive elements, navigation components, buttons, and campus selection triggers respond immediately to touch and click events across physical mobile devices without latency or event swallowing.

## ADDED Requirements

### Requirement: Immediate Touch and Click Dispatch
All interactive buttons, navigation links, and dropdown triggers SHALL immediately register and dispatch touch events (`onClick`, `onTouchEnd`) without delays, synthetic event cancellations, or interference from text-selection prevention rules.

#### Scenario: User taps hamburger menu on mobile
- **WHEN** user taps the hamburger navigation toggle on a touch device
- **THEN** the mobile navigation drawer immediately animates open and transitions the hamburger icon into an active state

#### Scenario: User taps campus selector
- **WHEN** user taps the campus badge dropdown in the navigation header
- **THEN** the campus selection popover opens without delay and allows selecting between Køge and Roskilde

### Requirement: Touch Action and Tap Latency Optimization
All interactive controls across the landing page SHALL utilize `touch-action: manipulation` to disable double-tap-to-zoom gestures on controls, guaranteeing zero 300ms tap latency and immediate touch feedback.

#### Scenario: Tapping call-to-action button in hero
- **WHEN** user taps the "UDFORSK" button in the hero section
- **THEN** the browser smoothly scrolls down to the prototypes section immediately upon touch release

#### Scenario: Tapping lab indicator tabs
- **WHEN** user taps an inactive lab indicator tab in the lab explorer section
- **THEN** the active lab switches immediately, updating bullet points and spotlight color without requiring multiple taps

### Requirement: Mobile LAN Dev Server Asset Accessibility
The development server configuration SHALL bind to all network interfaces (`0.0.0.0`) so that mobile devices connecting via local Wi-Fi or LAN receive all Next.js hydration chunks and Fast Refresh updates without connection timeouts.

#### Scenario: Mobile device connects to dev server on LAN
- **WHEN** a phone browser connects to `http://<lan-ip>:3000`
- **THEN** all static chunks and scripts load completely, completing React hydration and activating client-side event listeners
