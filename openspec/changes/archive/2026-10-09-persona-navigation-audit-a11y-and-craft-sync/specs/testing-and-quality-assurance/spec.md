## ADDED Requirements

### Requirement: Fallback Component Resilience Unit Tests
The test suite SHALL verify that UI fallback components render deterministic fallback icons and labels without throwing uncaught exceptions when provided missing, empty, or error-triggering asset sources.

#### Scenario: SafeImageBox handles missing image gracefully
- **WHEN** `SafeImageBox` receives an empty `src` or an image loading error occurs
- **THEN** the component renders the designated fallback icon and accessible text label within the specified aspect ratio container without breaking the layout
