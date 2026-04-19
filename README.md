# VAIDHURYA Commerce Architecture

VAIDHURYA is a premium jewelry e-commerce platform evolving from the current luxury-themed storefront into a complete commerce system. The existing bridal and everyday visual identity stays intact; the work ahead expands the platform into catalog, pricing, checkout, payment, shipping, bespoke orders, and operational tooling without redesigning the theme language already present in the app.

## Product Direction

- Preserve the current premium jewelry theme, including the existing typography, palette, header treatment, collection cards, and luxury surface styling.
- Expand the storefront into a modular commerce platform with guest checkout, optional customer accounts, dynamic metal pricing, provider-agnostic card payments, shipment tracking, and a built-in admin suite.
- Support both ready-stock product sales and inquiry-led bespoke/custom jewelry orders managed through quoting and operations workflows.

## Current State

The repository currently contains a Next.js storefront prototype with:

- a themed landing page for bridal and everyday collections
- luxury styling tokens and imagery already established in the UI
- no production catalog model, no cart state, no checkout, no order management, and no admin surface yet

## Target Architecture

The target system is a modular `Next.js 16` monolith using the App Router, backed by a Supabase-style foundation for Postgres, Auth, and Storage. Commerce domains stay clearly separated so pricing, checkout, orders, shipping, bespoke quotes, and admin workflows can later be extracted into services if scale requires it.

Key architecture decisions:

- guest checkout with optional post-purchase account creation
- dynamic metal pricing during browse, with price lock at checkout submission/payment intent creation
- card-first payment architecture behind a provider adapter
- multiple shipments per order with public and authenticated tracking
- inquiry-based bespoke order flow with admin-managed quote revisions
- built-in CMS and role-based staff admin for merchandising and operations

## Tech Baseline

- Framework: `Next.js 16` with App Router
- UI runtime: `React 19`
- Styling baseline: global CSS and luxury theme tokens already implemented in the storefront
- Target backend foundation: Supabase-style `Postgres + Auth + Storage`
- Target data access layer: relational schema managed by an ORM such as Drizzle, with schema validation at system boundaries

## Documentation Map

The architecture is documented in the files below:

- [Docs Hub](./docs/README.md) for reading order and scope
- [Architecture Overview](./docs/architecture-overview.md) for system shape, route groups, and module boundaries
- [Domain Model](./docs/domain-model.md) for entities, relationships, and lifecycle rules
- [Commerce Flows](./docs/commerce-flows.md) for shopper, checkout, bespoke, and post-purchase journeys
- [Integrations and Operations](./docs/integrations-and-ops.md) for provider adapters, async jobs, idempotency, and operational rules
- [Admin and CMS](./docs/admin-and-cms.md) for staff roles, admin modules, and content ownership
- [Implementation Roadmap](./docs/implementation-roadmap.md) for phased delivery and acceptance criteria

## Immediate Build Priorities

The next implementation sequence should follow this order:

1. establish the domain model and persistence foundation
2. introduce storefront routes for catalog, PDP, cart, and checkout
3. implement price locking, payment orchestration, and order creation
4. add shipping operations, tracking, and post-purchase self-service
5. deliver bespoke quote workflows and the role-based admin suite

The roadmap document expands those phases into concrete outputs and acceptance criteria.
