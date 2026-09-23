## 1. Fix Context Binding & Dynamic Catalogue Fetching

- [x] 1.1 Fix `CampusContext` consumption in `components/catalogue/CatalogueGrid.tsx` by using `campus` instead of `activeCampus`.
- [x] 1.2 Connect `CatalogueGrid.tsx` to dynamically fetch published craft items from server actions with instant fallback to `CRAFT_CATALOG`.

## 2. Server Actions & Data Store for Crafts / Blog Items

- [x] 2.1 Implement `data/crafts.json` local store with automated seed initialization from `CRAFT_CATALOG`.
- [x] 2.2 Create server actions in `app/actions/crafts.ts` (`getCraftArticles`, `saveCraftArticle`, `deleteCraftArticle`) with authentication and audit logging.

## 3. PoS Admin Console Crafts Tab & Manager UI

- [x] 3.1 Add `CRAFTS` ("Crafts & Artikler") tab to master navigation in `app/admin/pos/AdminConsoleClient.tsx` with Magenta `#E6007E` active styling.
- [x] 3.2 Create `components/admin/CraftItemsManager.tsx` with item listing, search, category/lab filters, and create/edit modal form for craft prototype guides.

## 4. Verification & Sync

- [x] 4.1 Verify `/katalog` immediately displays all items for Køge and Roskilde.
- [x] 4.2 Verify creating/editing a craft item in the PoS updates the entry in `data/crafts.json` and syncs with the public catalogue.
- [x] 4.3 Verify craft cards navigate seamlessly to `/craft/[slug]`.
