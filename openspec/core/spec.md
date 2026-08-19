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