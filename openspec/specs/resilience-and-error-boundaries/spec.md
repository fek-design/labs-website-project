# resilience-and-error-boundaries Specification

## Purpose
Provides comprehensive client-facing error fallbacks, branded offline database recovery interfaces, and zero-cloud in-memory rate limiting to ensure robust uptime across local campus network operations.

## Requirements

### Requirement: Root Application Error Boundary
The system SHALL provide a branded root error fallback boundary in `app/error.tsx` catching unhandled runtime exceptions.

#### Scenario: Uncaught runtime exception on public route
- **WHEN** an unhandled error occurs during rendering or data fetching on public routes
- **THEN** the system displays a dark-themed error screen (`#09090b` canvas) with a Danish explanation and a "Prøv igen" retry button calling `reset()`

### Requirement: Admin POS & Inventory Offline Recovery Boundary
The system SHALL provide a specialized error boundary in `app/admin/error.tsx` tailored for local network glitches and database connection drops.

#### Scenario: Database connection drop during POS operation
- **WHEN** a database connection error occurs in the administrative POS or inventory dashboard
- **THEN** the administrative boundary renders a diagnostic recovery view detailing local connectivity troubleshooting without leaking raw database stack traces or SQL strings

### Requirement: Custom Brand 404 Page
The system SHALL render a custom `app/not-found.tsx` matching the Zealand Labs design system.

#### Scenario: User navigates to non-existent route
- **WHEN** a client requests an undefined route
- **THEN** the system displays a styled 404 page featuring `font-notch` typography and navigation links returning to `/admin/pos` and `/katalog`

### Requirement: In-Memory Action Rate Limiter
The system SHALL enforce sliding-window rate limiting on sensitive server actions without external cloud services.

#### Scenario: Barcode scanner flood or rapid automated requests
- **WHEN** a client IP exceeds 60 requests per minute on search actions or 30 requests per minute on checkout mutations
- **THEN** the server action returns a structured rate limit error `{ success: false, error: "For mange forespørgsler. Vent et øjeblik.", code: "RATE_LIMITED" }`
