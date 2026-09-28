## Why

Following the initial reskin of the Admin POS dashboard based on Figma node `79:827`, three key refinements are required to elevate the operator experience:
1. The welcome greeting was displaying a static name instead of resolving the actual authenticated administrator's display name.
2. The `RETUNÉRING` mode selection button in the active session workspace was using a blue active state instead of the primary brand yellow (`#ffd900` / `#FFED00`), which is the unified active accent for mode toggles.
3. The top-right KPI stat numbers (`Aktive lån`, `Overskredet Returneringer`, and `Ledigt udstyr`) should animate up from 0 to their actual database values using an exponential/spring easing curve to convey live telemetry upon loading.

## What Changes

- **Dynamic Authenticated Greeting**: Update greeting to dynamically read "Velkommen, [Name]" from the active session (fetching the authenticated admin username or profile name, with fallback only when unauthenticated).
- **Yellow Active Accent for RETUNÉRING**: Change the selected state of the `RETUNÉRING` button in `ActiveSessionPanel` from blue (`#009FE3`) to yellow (`#ffd900` / `#FFED00` with dark text `#000000`), matching `UDLEJNING`.
- **Animated KPI Counters**: Implement an exponential count-up animation component (`AnimatedCounter` or motion-based interpolation) for the three KPI metric numbers (`activeLoansCount`, `overdueLoansCount`, and `availableGearCount`), smoothly rolling from 0 to their final target numbers.

## Capabilities

### Modified Capabilities
- `equipment-pos-dashboard`: Update requirements to specify dynamic authenticated greeting presentation, brand yellow active state for both action mode toggles in the active session console, and exponential count-up animations for the top KPI metric numbers.

## Impact

- `components/pos/EquipmentPOS.tsx`: Pass resolved admin name and replace static numbers with animated roll-up numbers.
- `components/pos/ActiveSessionPanel.tsx`: Update `RETUNÉRING` active button color tokens.
- `components/pos/AnimatedCounter.tsx` (or embedded animated number hook): Smooth exponential count-up from 0.
