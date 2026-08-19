# Zealand Labs - Core Architecture Specification (v1.5)

## I. Core Infrastructure (The Engine)
This platform operates on a strict "Zero Cloud Dependency" mandate to ensure institutional longevity.
* **Frontend:** Next.js (App Router), React, Tailwind CSS.
* **Animation Engines (Dual-Stack):**
  * `motion/react`: Dedicated to local component UI micro-interactions and layout state transitions.
  * `gsap` & `@gsap/react`: Dedicated to macro-level viewport orchestration, scroll-scrubbing, and complex SVG path rendering.
* **Database:** Local MySQL Server accessed exclusively via Prisma ORM.
* **Authentication:** Local NextAuth.js (Credentials Provider). **Admin only.** Zero student accounts.

## II. Data Architecture (The Prisma Contract)
The database structure is decoupled from user authentication. Operational states dictate workflows.

### Domain Rules
1. **The Inventory Rule:** All physical assets (cameras, 3D printers) live in a unified `Inventory` table. Their workflow is dictated by the `HardwareType` Enum (`STATIC_MACHINE` vs `BORROWABLE_GEAR`).
   * **Medialab Extension:** Assets support extended metadata, including local image URIs (`imageUrl`), flexible JSON arrays (`customFields`), and linked `RepairLog` tracking.
2. **The Medialab Workflow (Loans):** Driven by the `Loan` transaction engine. Requires an authenticated Admin to scan an asset barcode and an unauthenticated `Patron` (Student ID).
   * **Overdue Protocol:** Automated background cron jobs are strictly prohibited to maintain Zero Cloud dependency. Overdue identification is executed manually via native Prisma timestamp queries on the Admin dashboard.
3. **The Makerspace Workflow (Walk-In):** Bookings are strictly banned. Operations rely entirely on live telemetry via the `OperationalStatus` Enum (`AVAILABLE`, `MAINTENANCE`, `BROKEN`).
4. **The Taxonomy Engine:** Tags (Use-cases, Study Paths, Materials) use a strict many-to-many junction table (`InventoryTag`) to ensure normalized filtering.

## III. The Component Registry (The Logic Bridge)
The UI separates global consistency from local operational modules.

* **The Immutable Shell:** `app/labs/[slug]/page.tsx`. This dynamic route is locked. It exclusively handles the Global Navbar, Fast-Track Strip, and CSS Grid Containers. No custom UI logic is allowed here.
* **Slot Injection:** The database `Lab` entry dictates which custom React modules load into the shell's slots:
  * `CapabilityBento`: The asymmetrical Makerspace grid.
  * `EquipmentPOS`: The Medialab checkout scanner.
  * `ManualViewer`: The accordion document library.

## IV. The Spec Kit (The Visual Contract)
The UI adheres to a brutalist CMYK design system, merging high-end editorial layouts with a dark-mode institutional identity. Deviations are blocked at the `tailwind.config.ts` level.

### 1. Palette & Surfaces
* **Base Floor:** `#000000` (Brand Black). white backgrounds are allowed, but only if used as accent and pattern breaking.
* **Surface Cards:** `#141414` with `#262626` borders.
* **CMYK Accents:** Yellow (`#FFED00`), Pink (`#E6007E`), Cyan (`#009FE3`). Used exclusively for telemetry, hover states, active buttons, and organic ribbons.

### 2. Typography & Content
* **Primary Font:** `Stack Sans Notch`.
* **Hero Typography:** Lab names and primary headers abandon standard web sizing. They utilize massive scaling (`text-6xl` to `text-8xl`), aggressive tracking, and overlay blending (`mix-blend-mode`) directly over darkened photographic lab assets.
* **Hierarchy:** Standard headers (`H2`/`H3`) are Bold/High-Contrast. Body text is muted (`text-gray-400`).

### 3. Geometry, Layout & Textures
* **Buttons:** Must be full pill (`rounded-full`). Hover states must flip CMYK pairs.
* **The Bento Grid:** Strict asymmetrical layouts using Tailwind CSS Grid. High-value operational data (e.g., primary machines) use massive 2x2 spans; secondary data use 1x1 spans. Cards use `1.25rem` (`rounded-3xl`) radius with high-contrast accent borders on hover.
* **Telemetry Ribbons (GSAP):** To break grid rigidity, the background utilizes organic, serpentine SVG ribbons with CMYK gradients. These weave behind and between the rigid Bento cards. They must be animated exclusively using GSAP ScrollTrigger and the `@gsap/react` `useGSAP()` hook to ensure proper React unmount cleanup.