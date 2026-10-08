# Project Tasks & Game Plan Roadmap

> **Exploration & Execution Blueprint**  
> Formulated during OpenSpec exploration mode (`/opsx-explore`).

---

## 🎯 Executive Game Plan: The 3 Bundles

To deliver maximum value with minimal context switching, the 5 requested tasks are grouped into 3 strategic bundles ordered from easiest/highest visual synergy to core engineering depth:

```
┌────────────────────────────────────────────────────────────────────────┐
│  BUNDLE 1: Frontpage UX & Visual Streamline (Easiest / High Synergy)   │
│  ├─ Task 1: Apple.com-style narrow column container setup              │
│  ├─ Task 2: Graceful image fallback box (no console/image errors)      │
│  └─ Task 3: Dual-persona (Student/Teacher) sitemap & nav deduplication │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│  BUNDLE 2: Micro-Documentation & User Manual (Content / Fast Retention)│
│  └─ Task 4: TikTok-generation bite-sized user manual & guide           │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│  BUNDLE 3: Quality Assurance & Error Hardening (Engineering Rigor)     │
│  └─ Task 5: Vitest unit test suite, test execution & error hardening   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Bundle 1: Frontpage UX & Visual Streamline (Recommended First Pass)
*All three tasks modify the frontpage layout, header, footer, and image containers simultaneously. Doing them together eliminates redundant edits.*

### Task 1: Apple.com-Style Narrow Column Setup
- **Goal:** Replace wide `max-w-7xl` (1280px) containers with Apple's iconic centered narrow layout (`max-w-5xl` / 1024px or `max-w-[980px]`).
- **Why it matters:** 
  - Prevents eye fatigue on wide desktop screens (keeps line lengths within 45–65 characters).
  - Gives generous, luxurious breathing room (white/black margins) around media and typography.
  - Aligns with the project's design system rule for asymmetric, focused editorial layout.
- **Affected Components:**
  - `components/landing/LandingHeader.tsx` (header bar constraint)
  - `components/landing/HeroSection.tsx` (centered hero content)
  - `components/landing/PrototypeCarousel.tsx` (carousel header & track container)
  - `components/landing/HotspotShowcase.tsx` (interactive showcase frame)
  - `components/landing/CampusLabExplorer.tsx` (lab tabs & spotlight card)
  - `components/landing/MachineTelemetrySection.tsx` (telemetry stats & auto-scroll list)
  - `components/landing/LandingFooter.tsx` (footer content width)

### Task 2: Graceful Image Box Fallback (Zero Broken Errors)
- **Goal:** When an item has no image, an empty string, or an invalid URL, a clean physical container/box still appears without triggering broken image icons or browser console errors.
- **Implementation Strategy:**
  - Build a lightweight `SafeImageBox` or wrapper component with an `onError` fallback state.
  - When `src` is missing or fails to load, render a dark tactile glassmorphic box (`bg-[#18181b] border border-[#262626]`) with a subtle glyph (e.g. Phosphor `Image`, `Wrench`, or `Cube`) or brand gradient.
  - Maintain the exact aspect ratio and card dimensions so layout never shifts or collapses.

### Task 3: Dual-Persona Sitemap (Student & Teacher) & Navigation Cleanup
- **Goal:** Walk through the site from the perspective of our two primary user groups, remove repetitive dead links (e.g. duplicate `#support-pillars`), and create a clean sitemap and navigation/footer structure.
- **Persona Journeys:**
  1. **Student Persona:**
     - *Primary Needs:* "Can I borrow a camera for my project?", "Is the 3D printer free right now?", "How do I make a t-shirt print?", "What are the opening hours?"
     - *Key Routes:* Catalogue (`/katalog`), Craft Guides (`/craft/[slug]`), Live Machine Status (`#machines`), Lab Overview (`#support-pillars`).
  2. **Teacher Persona:**
     - *Primary Needs:* "Can I book a workshop for my class?", "Where are the safety manuals and equipment lists?", "Where do I log into the admin/inventory system?"
     - *Key Routes:* Catalogue & Bundles (`/katalog`), Machine Manuals, Direct Admin Portal (`/admin`), Campus Contact.
- **Sitemap & Navigation Fixes:**
  - In `LandingHeader` drawer: Add clear direct links to `/katalog` (Equipment & Craft), `#machines` (Live Status), `#support-pillars` (Labs), and `/admin` (Staff & Teachers).
  - In `LandingFooter`: Disentangle Makerspace and Medialab links from repeating the same `#support-pillars` hash; add direct links to the catalogue and clear persona paths.

---

## 📱 Bundle 2: Micro-Documentation & User Manual (TikTok-Generation Edition)

### Task 4: Snappy, High-Retention User Manual
- **Goal:** Create short, punchy documentation in natural everyday language ("normal lingo") tailored for quick reading and modern short attention spans.
- **Format Principles:**
  - **Zero corporate fluff:** Direct, bold, humorous, and clear.
  - **3-step rules:** Never more than 3 steps to accomplish any task.
  - **Visual emoji / icons:** Quick visual anchors for immediate skimming.
  - **High scannability:** Large headings, bold action verbs, callout boxes.
- **Content Outline:**
  1. **Student Quickstart (Borrowing & Making):**
     - Step 1: Browse gear on `/katalog`.
     - Step 2: Show up at the lab, say hi, scan the item.
     - Step 3: Return it on time so your teacher doesn't hunt you down.
  2. **Teacher Quickstart (Class Kits & Safety):**
     - Step 1: Check inventory status before planning the assignment.
     - Step 2: Grab the machine safety manual in 1 click.
     - Step 3: Admin access for logging student gear.
  3. **Admin Quickstart (Checkout, Barcodes & User Management):**
     - Scan barcode → Select student → Done (3 seconds).
     - Adding gear → Auto-generate barcode → Print label.
     - Managing users via CLI (`npm run users:list`, `users:create`).

---

## 🧪 Bundle 3: Quality Assurance & Engineering Standards

### Task 5: Industry-Standard Unit Test Suite & Error Hardening
- **Goal:** Install and configure modern unit testing (Vitest + React Testing Library) tailored for Next.js 16 and React 19, test critical business logic, fix any existing bugs uncovered by tests, and harden error handling.
- **Test Matrix / Critical Test Areas:**
  1. **Auth & RBAC:**
     - Role checks (SUPERADMIN vs ADMIN vs USER).
     - Password hashing & verification (`bcryptjs`).
     - AuthGate redirect behavior for unauthorized access.
  2. **Inventory & POS Server Actions:**
     - Checkout transaction logic (decrementing available count, logging history).
     - Return verification (ensuring item status returns to AVAILABLE).
     - Barcode format & uniqueness validation.
  3. **Catalogue & Craft Data:**
     - Slug lookup and fallback resolution.
     - Filtering by lab, campus, and category.
  4. **Error Handling & Return Hardening:**
     - Ensure server actions return structured errors `{ success: false, error: string }` instead of unhandled promise rejections or 500 crashes.
     - Add descriptive error boundaries to client pages.

---

## 🚀 Recommended Immediate Next Step

When ready to begin implementation, we can exit explore mode and launch an OpenSpec change proposal for **Bundle 1**:

```bash
# Example OpenSpec change to propose:
openspec new change "frontpage-apple-layout-image-fallback-and-sitemap"
```

This will implement:
1. Apple.com narrow container width standard across the landing page.
2. Graceful `SafeImageBox` fallback for missing/broken images.
3. Dual-persona sitemap & deduplicated navigation/footer links.
