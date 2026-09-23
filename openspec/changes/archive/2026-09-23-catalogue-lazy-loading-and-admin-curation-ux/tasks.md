## 1. Public Catalogue Progressive Scroll Loading

- [x] 1.1 Implement progressive batching and `IntersectionObserver` sentinel in `components/catalogue/CatalogueGrid.tsx` (initial batch: 8 items, seamless increments on scroll).
- [x] 1.2 Ensure filter changes and search queries reset the progressive load counter to the initial batch with smooth transitions.

## 2. Strict Discipline Taxonomy

- [x] 2.1 Define canonical discipline categories (`CANONICAL_CRAFT_CATEGORIES`) and standard tag presets (`STANDARD_CRAFT_TAGS`) in `lib/craft-data.ts`.
- [x] 2.2 Update `data/crafts.json` and static seed data to adhere to the canonical categories.
- [x] 2.3 Refactor `components/admin/CraftItemsManager.tsx` to replace the free-text category input with a locked dropdown selector and add preset tag badge chips.

## 3. Automated Local Image Upload & Visual Asset Picker

- [x] 3.1 Implement server actions `uploadCraftImage` and `getAvailableCraftAssets` in `app/actions/crafts.ts` for safe local saving and asset library listing.
- [x] 3.2 Add drag-and-drop file upload and visual "Vælg fra bibliotek" asset gallery modal in `components/admin/CraftItemsManager.tsx`, eliminating manual path typing.

## 4. Verification & Polish

- [x] 4.1 Verify seamless progressive card loading when scrolling on `/katalog`.
- [x] 4.2 Verify creating/editing a prototype in the PoS only accepts canonical categories and supports preset tag chips.
- [x] 4.3 Verify uploading an image and picking an existing photo from the visual library assigns the image with 1 click.

