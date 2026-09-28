## ADDED Requirements

### Requirement: Frontpage Featured Prototype Curation
The Admin PoS Console (`/admin` under Crafts) SHALL allow administrators and technicians to curate which craft prototypes appear in the frontpage prototype carousel, enforcing a maximum limit of 5 featured cards with immediate toggle controls.

#### Scenario: Featuring a prototype for the frontpage
- **WHEN** an administrator clicks the "Fremhæv på forside" toggle or star icon on a craft prototype in `CraftItemsManager`
- **THEN** the system sets `isFeaturedOnFrontpage: true` on the item, persists the update, and renders the item in the frontpage carousel.

#### Scenario: Enforcing the 5-item curation cap
- **WHEN** an administrator attempts to feature a 6th craft prototype while 5 items are already featured
- **THEN** the system prevents the action, alerts the administrator that the maximum of 5 frontpage cards has been reached, and prompts them to unfeature an existing item first.
