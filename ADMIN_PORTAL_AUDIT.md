# Foami Mágico Admin Portal — Architecture Audit

## Current architecture

- React + TanStack Start + TanStack Router.
- Server-side SQL abstraction in `src/lib/db.ts`: Neon/PostgreSQL when `DATABASE_URL` exists; PGlite fallback for local/preview.
- SQL migrations in `migrations/*.sql`; Better Auth schema is currently under `migrations/auth/` and is not part of the normal app-data migration glob.
- Public pages are file routes under `src/routes/`; the catalog is rendered from a hardcoded `PRODUCTS` array.
- Shared UI uses the existing Foami Mágico Tailwind theme, `StitchCard`, `Button`, inputs, labels, and toast notifications.

## Relevant database and auth findings

- No product, inventory, category, or administrator tables currently exist in the app-data migrations.
- Better Auth sessions/users are persisted through the existing auth configuration and can be checked server-side.
- `requireUserId`/auth middleware currently supports authenticated identity checks, but there is no admin authorization model.
- The deployed path uses `DATABASE_URL`; preview falls back to PGlite. New migrations must be compatible with both.

## Product-data flow

- `src/lib/products.ts` defines categories, product fields, prices, lead times, minimum quantities, images, and featured flags.
- Public catalog, product details, cards, quote calculation, and cart all import that hardcoded data directly.
- A safe migration must seed the existing catalog into persistent tables without inventing or deleting business data, then switch public readers to the database-backed source while preserving the current quote rules.

## Files expected to change

- New app-data migration for categories, products, and inventory movements.
- New server-only admin repository/service with parameterized SQL and authorization checks.
- New `/admin` route and admin UI components.
- Product loading and quote/cart integration modules.
- Auth role/administrator provisioning and tests.
- Route manifest, README, and focused tests.

## Proposed schema

- `product_categories`: stable category id, name, blurb, tint, timestamps, archived flag.
- `products`: stable id, slug, all existing catalog fields, price in NIO, publication/availability state, inventory mode, stock, minimum stock, SKU, timestamps, archived flag.
- `inventory_movements`: product id, quantity delta, before/after quantities, reason, actor user id, timestamp.
- `admin_users`: user id, role, created timestamp; no self-service role assignment.

Products with `MADE_TO_ORDER` or `NOT_TRACKED` inventory modes are not treated as out of stock. Stock changes use a transaction and never allow negative stock.

## Risks and mitigations

- **Auth provisioning:** no existing trusted admin mechanism. Admin access will fail closed unless a server-side allowlist/bootstrap configuration identifies an administrator; no first-user promotion or universal password.
- **Data migration:** existing catalog is source data. The migration will use idempotent stable slugs and preserve the current values.
- **PGlite parity:** use PostgreSQL-compatible SQL and app-data migration conventions.
- **Public behavior:** preserve quote calculation and cart contracts while replacing only the product read source.

## Implementation sequence

1. Create feature branch and migration/seed strategy.
2. Add server-only repository, validation, admin authorization, and protected operations.
3. Add `/admin` dashboard, product editor, publication/availability controls, and inventory adjustment UI.
4. Switch public catalog/product/quote data to persistent reads with safe fallback behavior during migration.
5. Add tests and run typecheck, lint, focused tests, and production build.

## Scope note

This branch will not be merged into `main` without explicit authorization. Production database migration execution remains a deployment decision and is not run from this sandbox.
