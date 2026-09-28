## 1. Dynamic Authenticated Greeting

- [x] 1.1 Update `EquipmentPOS.tsx` to dynamically extract and capitalize the authenticated administrator's username from `getAuthSession()` and display "Velkommen, [Name]" with proper fallback.

## 2. Yellow Active State for Returnering Button

- [x] 2.1 Update `components/pos/ActiveSessionPanel.tsx` so the `RETUNÉRING` button takes the brand yellow active style (`bg-[#ffd900] text-black shadow-lg shadow-[#ffd900]/10`) when selected, matching `UDLEJNING`.

## 3. Exponential Counter Animations

- [x] 3.1 Create `components/pos/AnimatedCounter.tsx` with an exponential easing curve ($1 - 2^{-10t}$) animating numbers up from 0 to their actual database values.
- [x] 3.2 Update the three top KPI metric counters in `EquipmentPOS.tsx` (`Aktive lån`, `Overskredet Returneringer`, and `Ledigt udstyr`) to render using `AnimatedCounter`.

## 4. Verification & Polish

- [x] 4.1 Run TypeScript verification (`npx tsc --noEmit`) to ensure zero typing regressions.
- [x] 4.2 Verify in browser that greeting displays user name, Returnering button turns yellow on select, and KPI numbers roll up exponentially from 0.
