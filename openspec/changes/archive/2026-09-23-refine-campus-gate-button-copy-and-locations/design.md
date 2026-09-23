## Context

The initial campus selection gate displayed four mockup locations (Køge, Roskilde, Næstved, Holbæk). However, the actual Zealand Labs database models and seeds only two physical campus sites: **Køge Campus** and **Roskilde Campus**. Additionally, the *"TRÆD IND"* button used an oversized pill geometry (`rounded-full`), conflicting with the established Scandinavian functionalist Tier 1 rule (which mandates sharp `rounded-none` styling on primary action CTAs like "UDFORSK"). Finally, the introductory descriptive text was a brief placeholder and requires elevated, realistic copy.

## Goals / Non-Goals

**Goals:**
- Restrict campus options across `CampusContext.tsx`, `FirstTimeCampusGate.tsx`, and `LandingHeader.tsx` to authentic database locations: **Køge** and **Roskilde**.
- Redesign the *"TRÆD IND"* CTA to use sharp architectural geometry (`rounded-none`) with a slightly smaller, more refined footprint (`px-8 py-3 text-sm sm:text-base tracking-wider uppercase font-semibold`).
- Write professional Danish copy explaining the practical benefits of choosing a campus (live machine telemetry, gear checkout, and open workshop access).
- Ensure safe fallback if an existing client has an obsolete campus stored in `localStorage`.

**Non-Goals:**
- Altering the Prisma database schema or adding new database tables.
- Removing the persistent location switcher in `LandingHeader`.

## Decisions

### 1. Database Alignment: Køge & Roskilde
- **Choice**: Limit `CampusKey` to `"køge" | "roskilde"`. Remove synthetic placeholder entries ("næstved", "holbæk") from `CAMPUS_DATA`.
- **Rationale**: Keeps the UI 100% in sync with real database records (`Lab` entities in `prisma/seed.ts`).
- **Safety**: In `CampusContext.tsx`, check `if (saved && saved in CAMPUS_DATA)` before restoring from `localStorage`; fallback to `"køge"` if an invalid key is encountered.

### 2. Tier 1 Functionalist Geometry for "TRÆD IND" CTA
- **Choice**: Apply `rounded-none` (`border-radius: 0px`) to the *"TRÆD IND"* button, matching the Hero CTA ("UDFORSK").
- **Dimensions**: Reduce padding from `px-10 sm:px-14 py-4` to `px-8 py-3`, using `text-sm sm:text-base tracking-wider uppercase font-semibold` with subtle arrow motion.
- **Rationale**: Implements the IKEA-inspired design language rule established in `openspec/specs/visual-toolkits/spec.md`.

### 3. Professional Danish Copywriting
- **Headline**: *"Vælg Campus nærest dig:"*
- **Descriptive Body**:
  *"Zealand Labs er åbne faciliteter til hurtig prototyping, medieproduktion og digital fabrikation. Vælg din lokation for at se tilgængeligt udstyr, live maskinstatus og værkstedsressourcer."*
- **Help text**: *"Du kan til enhver tid skifte lokation øverst i menuen."*

## Risks / Trade-offs

- **[Existing stored campus key]** A client browser might have "næstved" or "holbæk" stored from the previous test.
  → *Mitigation*: Fallback check in `CampusProvider` and `FirstTimeCampusGate` resets to `"køge"` if the key does not exist in `CAMPUS_DATA`.
