## Context

See `proposal.md` for motivation. Following the initial reskin of the POS dashboard matching Figma node `79:827`, three UX polish items are needed:
1. Display the actual authenticated user's name instead of the placeholder "Hemi".
2. Ensure both `UDLEJNING` and `RETUNÉRING` buttons take the brand yellow (`#ffd900` / `#FFED00`) active color when selected.
3. Animate the top-right KPI stat numbers up from 0 to their actual database values using an exponential count-up easing.

## Goals / Non-Goals

**Goals:**
- **Dynamic Operator Greeting**: Resolve the authenticated operator's identity via `getAuthSession()` and format their display name properly (e.g., "Velkommen, Felix" or "Velkommen, Admin").
- **Consistent Active State Color**: Set `RETUNÉRING` active state to `#ffd900` with black text, matching `UDLEJNING`.
- **Exponential Counter Animation**: Implement an exponential easing count-up (`AnimatedCounter`) from 0 to target values for `Aktive lån`, `Overskredet Returneringer`, and `Ledigt udstyr`.

**Non-Goals:**
- Altering database schema or modifying backend mutations.
- Adding heavyweight external charting or animation libraries beyond `motion/react`.

## Decisions

### Decision 1: Authenticated User Display Name
- **Choice**: Retrieve session via `getAuthSession()`. Capitalize the username (e.g. `felix` → `Felix`, `admin` → `Admin`). Fallback to "Administrator" or "Operator" only if unauthenticated.
- **Rationale**: Removes the hardcoded name "Hemi" from the Figma mockup while ensuring personal greeting for whoever is logged in.

### Decision 2: Action Button Active Style Unification
- **Choice**: In `components/pos/ActiveSessionPanel.tsx`, when `sessionMode === "RETUNERING"`, apply:
  `bg-[#ffd900] text-black shadow-lg shadow-[#ffd900]/10`
  identical to `UDLEJNING`.
- **Rationale**: Eliminates the blue divergence and unifies the active action button style on the brand yellow token.

### Decision 3: Exponential Counter Animation
- **Choice**: Build a reusable `AnimatedCounter` component using `requestAnimationFrame` with an exponential ease-out curve ($f(t) = 1 - 2^{-10t}$):
  $$\text{current} = \text{Math.round}(\text{target} \times (1 - 2^{-10 \times \text{progress}}))$$
- **Rationale**: Exponential easing starts fast and decelerates smoothly toward the exact integer value without stuttering, creating a high-end agency telemetry feel with zero external dependencies.

## Risks / Trade-offs

- **Risk**: Rapid state refresh causing the counter to re-trigger repeatedly.
  - **Mitigation**: Animate only on initial mount or when the target number changes, smoothly interpolating from the previous number instead of resetting to 0 on subsequent background refreshes.
