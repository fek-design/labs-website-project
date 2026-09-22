# Zealand Labs — Production Development Guidelines

These guidelines define the engineering and visual standards for Zealand Labs web applications. All features must be built for actual end-user deployment and real campus workloads, not just as static prototypes or temporary MVPs.

---

## 1. Asset & Media Optimization (Zero Cloud Mandate)

All assets run strictly on a local offline-first campus network. No external image CDNs (S3, Cloudinary, Figma CDN) may be referenced at runtime.

- **Format & Compression**:
  - Convert all photographic assets to modern **WebP** or **AVIF** formats.
  - No photographic image should exceed **200 KB** on disk.
  - Vector illustrations and logos must be served as inline SVG or clean `.svg` files, minified and stripped of Figma editor metadata.
- **Next.js `<Image />` Usage**:
  - Always provide accurate `sizes` attributes (e.g. `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`).
  - Use `priority` **only** for the single hero LCP element.
  - Set `quality={80}` or `quality={85}` for optimal size/clarity balance.

---

## 2. Core Web Vitals & Runtime Performance

- **Largest Contentful Paint (LCP)**: < 1.2s on campus Wi-Fi.
- **Interaction to Next Paint (INP)**: < 100ms. Keep React client component trees lightweight.
- **Cumulative Layout Shift (CLS)**: < 0.05. Always reserve spatial dimensions (fixed aspect ratios or CSS min-height) for images, dynamic tabs, and async cards.
- **Marquee & Loops**:
  - Continuous loops must use pure CSS keyframe translations (`transform: translate3d(...)`) with dual-track repetition to guarantee GPU acceleration and zero CPU thread blocking.
  - Never allow marquee banners to run out of text on ultra-wide viewports (>=1440px).

---

## 3. Database & Network Resiliency

- **Non-Blocking Telemetry Queries**:
  - Database queries in public-facing routes must be non-blocking with resilient `try ... catch` fallbacks.
  - A stopped database container or network pool timeout must **never** trigger a 500 error page for public visitors.
  - Cache static counts using Next.js route caching (`revalidate`) where appropriate.
- **Server Component First**:
  - Keep route files (`app/page.tsx`, `app/admin/page.tsx`) as Server Components.
  - Restrict `"use client"` exclusively to interactive islands (drawers, carousels, hotspot popovers, tab switchers).

---

## 4. Visual Fidelity vs. UX Engineering Contract

- **Figma as Source of Truth**:
  - Replicate exact layout geometry, spacing tokens, and custom brand typography (`Stack Sans Notch`, `Stack Sans Text`).
  - Use authentic Figma SVG vector assets (such as pixel dither transitions) rather than synthetic approximations.
- **Engineering the Missing UX**:
  - Static mockups do not specify interaction details. Engineers must deliberately build:
    - Pulsing hotspot indicators with accessible hover/focus/tap tooltips.
    - Campus location switching that dynamically adjusts facility counts and lab lists.
    - Synchronized tab navigation with smooth cross-fades.
    - Accessible ARIA labels on all interactive triggers.
