## Context

See `proposal.md` for motivation. The landing page showcases prototypes in `PrototypeCarousel.tsx` (T-shirt, Kop, Mulepose), but clicking on them does not navigate to an in-depth breakdown. Figma frame `144:203` specifies a dedicated craft item page showcasing the creation process, prerequisites, required machinery, and community examples.

## Goals / Non-Goals

**Goals:**
- Implement `/craft/[slug]` dynamic route supporting `t-shirt` (and prepared for `kop` and `mulepose`).
- Replicate the layout, hierarchy, and tokens from Figma frame `144:203`:
  - Hero photography banner and title.
  - Location availability card (Køge Makerspace, Roskilde Dimselab) with opening hours.
  - High-visibility Cyan (`#009FE3`) prerequisites block.
  - Interactive process type switcher (`Print` vs. `Broderi`) with machine spec cards.
  - Laboratory marquee ticker divider.
  - "Andre har lavet" inspiration showcase with process and time badges.
  - "Relevante Manualer" machinery SOP guide cards.
- Orchestrate user attention using `motion/react` spring physics, layoutId indicators, and scroll-triggered reveals.
- Link `PrototypeCarousel.tsx` cards on the landing page to `/craft/[slug]`.

**Non-Goals:**
- Creating a commercial shopping cart or payment gateway (Zealand Labs is a university educational facility).
- Altering the Prisma database schema (craft configuration is statically typed in `lib/craft-data.ts`).

## Decisions

### 1. Route Architecture & Dynamic Param Resolution
- **Choice**: Use Next.js App Router dynamic segment `app/craft/[slug]/page.tsx` with `generateStaticParams()` returning `['t-shirt', 'kop', 'mulepose']`.
- **Rationale**: Enables instant static generation (SSG) with fast edge performance while allowing dynamic routing for any future prototype additions.

### 2. Craft Data Modeling (`lib/craft-data.ts`)
- **Choice**: Store structured craft definitions in a dedicated catalog module `lib/craft-data.ts`:
  ```ts
  export interface CraftProcessMachine {
    name: string;
    model: string;
    image: string;
    maxSize: string;
    fileFormat: string;
    time: string;
    description: string;
    finishDetails: string;
  }

  export interface CraftProcess {
    id: string;
    name: string;
    iconImage?: string;
    machines: CraftProcessMachine[];
  }

  export interface CraftInspirationItem {
    id: string;
    title: string;
    process: string;
    time: string;
    image: string;
    isLarge?: boolean;
  }

  export interface CraftManualReference {
    id: string;
    title: string;
    model: string;
    image?: string;
    href?: string;
  }

  export interface CraftItemData {
    slug: string;
    title: string;
    heroImage: string;
    locations: { name: string; hours: string }[];
    prerequisites: {
      materials: string;
      estimatedTime: string;
      difficulty: string;
    };
    processes: CraftProcess[];
    inspiration: CraftInspirationItem[];
    manuals: CraftManualReference[];
  }
  ```
- **Rationale**: Isolates domain content cleanly from presentation components, allowing easy editing, translation, or database expansion.

### 3. Motion & Attention Orchestration via `motion/react`
- **Choice**:
  - **Process switcher**: Animate indicator using `layoutId="activeProcessUnderline"` with spring physics (`stiffness: 450, damping: 32`).
  - **Machine cards**: Animate exit/enter transitions (`AnimatePresence mode="wait"`) when toggling between processes.
  - **Prerequisites block**: Subtle entrance elevation and ambient pulse on key warnings.
  - **Inspiration cards**: Hover scaling (`scale: 1.02`) and micro-badge transitions.
- **Rationale**: Fulfills the user requirement "orchestrate attention and keeping it with motion.js animations" without causing layout jank or distraction.

### 4. Integration with Global Design Tokens & Navigation
- **Choice**: Incorporate `LandingHeader` and `LandingFooter` directly on `/craft/[slug]`, wrapped in `CampusProvider` so campus selection remains sticky across pages.
- **Rationale**: Ensures uninterrupted visual identity and cohesive campus context (`køge` vs. `roskilde`).

## Risks / Trade-offs

- **[Unmatched craft slug]** User navigates to `/craft/random-slug`.
  → *Mitigation*: Call Next.js `notFound()` to render a dedicated, branded 404 screen with a prominent button back to the home page.
- **[Missing image files in public assets]**
  → *Mitigation*: Extract and verify all necessary images from Figma (`product_page_figma_144_203.png`, carousel assets, and existing lab photos in `public/images/`).
