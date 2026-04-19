# VAIDHURYA Docs Hub

This documentation set translates the current premium jewelry storefront into an implementation-ready commerce architecture. It is written for product, design, and engineering collaborators who need a single source of truth before code expansion begins.

## Current Vs Target

| Area | Current repo state | Target architecture |
| --- | --- | --- |
| Storefront | Luxury landing page with bridal and everyday themes | Full shopper experience with catalog, PDP, cart, checkout, account, and tracking |
| Commerce logic | Not implemented | Dynamic pricing, checkout, payments, orders, shipments, returns, refunds |
| Custom orders | Not implemented | Inquiry-led bespoke flow with admin quote revisions and payment |
| Operations | Not implemented | Admin suite for catalog, inventory, orders, shipping, promotions, CRM, CMS, analytics |
| Content management | Hard-coded landing content | Built-in CMS that preserves the current theme language |

## Reading Order

For most readers, this is the recommended order:

1. [Architecture Overview](./architecture-overview.md)
2. [Domain Model](./domain-model.md)
3. [Commerce Flows](./commerce-flows.md)
4. [Integrations and Operations](./integrations-and-ops.md)
5. [Admin and CMS](./admin-and-cms.md)
6. [Implementation Roadmap](./implementation-roadmap.md)

## Audience Guide

- Product and stakeholders:
  Start with [Architecture Overview](./architecture-overview.md), then [Commerce Flows](./commerce-flows.md), then [Implementation Roadmap](./implementation-roadmap.md).
- Design and UX:
  Start with [Architecture Overview](./architecture-overview.md) and [Commerce Flows](./commerce-flows.md), with special attention to the non-redesign theme constraint.
- Engineering:
  Read the full set in order, especially [Domain Model](./domain-model.md), [Integrations and Operations](./integrations-and-ops.md), and [Admin and CMS](./admin-and-cms.md).

## Architecture Invariants

These decisions are fixed across the docs:

- The app remains a modular `Next.js` monolith for v1.
- The backend foundation is Supabase-style `Postgres + Auth + Storage`.
- Checkout allows guests and optional accounts.
- Jewelry pricing is dynamic during browse and locked at checkout.
- Payment is card-first and provider-agnostic.
- Orders may split into multiple shipments.
- Bespoke orders follow inquiry plus admin-managed quote flow.
- Admin and CMS are built into the product with role-based staff access.
- New pages must reuse the existing luxury tokens, typography, palette, header treatment, and premium card language already present in the storefront.

## Cross-References

- The system shape in [Architecture Overview](./architecture-overview.md) depends on the entity rules defined in [Domain Model](./domain-model.md).
- Shopper and operations behavior in [Commerce Flows](./commerce-flows.md) relies on the provider seams in [Integrations and Operations](./integrations-and-ops.md).
- Staff workflows in [Admin and CMS](./admin-and-cms.md) are implemented in phases described in [Implementation Roadmap](./implementation-roadmap.md).
