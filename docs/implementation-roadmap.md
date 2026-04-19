# Implementation Roadmap

This roadmap turns the architecture into a practical build sequence. Each phase assumes the decisions documented in [Architecture Overview](./architecture-overview.md), [Domain Model](./domain-model.md), [Commerce Flows](./commerce-flows.md), [Integrations and Operations](./integrations-and-ops.md), and [Admin and CMS](./admin-and-cms.md).

## Phase 1: Documentation Baseline

### Outputs

- finalized architecture doc set in the repo
- shared understanding of current state versus target system
- approved implementation order and constraints

### Dependencies

- none beyond the current repo baseline

### Acceptance criteria

- README clearly explains the product and links the docs
- engineers can identify the fixed architecture decisions without re-planning

## Phase 2: Domain And Data Foundation

### Outputs

- relational schema for catalog, pricing, carts, checkout, orders, shipments, bespoke, customers, staff, and audit logs
- ORM setup and migration baseline
- validation layer for domain inputs and integration payloads

### Dependencies

- Phase 1 documentation
- Supabase-style Postgres/Auth/Storage environment selection

### Acceptance criteria

- every core entity in the domain model has a durable persistence plan
- guest carts, price locks, orders, shipments, quotes, and audit entries can all be stored without schema gaps

## Phase 3: Storefront Route Expansion

### Outputs

- collection and product-detail routes
- reusable theme-preserving UI primitives for PDP, cart entry points, and merchandising blocks
- CMS-backed content reads for homepage and collection surfaces

### Dependencies

- catalog and CMS data structures from Phase 2

### Acceptance criteria

- the current luxury theme remains visually consistent
- storefront routes can read real catalog and CMS content rather than hard-coded placeholders

## Phase 4: Cart And Checkout

### Outputs

- guest and authenticated cart persistence
- checkout session creation
- address capture, tax/shipping quote calculation, and price-lock creation

### Dependencies

- pricing, cart, and address models from Phase 2
- storefront routing from Phase 3

### Acceptance criteria

- a guest shopper can move from PDP to checkout without account creation
- checkout always recalculates totals and creates a durable price lock before payment

## Phase 5: Payment And Order Creation

### Outputs

- payment gateway adapter
- payment attempt tracking, confirmation, reconciliation, and failure recovery
- order creation with immutable line-item snapshots

### Dependencies

- checkout session and price-lock foundation from Phase 4
- integration contracts from [Integrations and Operations](./integrations-and-ops.md)

### Acceptance criteria

- successful payment creates exactly one order
- failed or duplicated payment submissions do not create duplicate orders
- confirmation surfaces order summary and tracking entry points

## Phase 6: Shipping, Tracking, And Post-Purchase Service

### Outputs

- shipment creation and multi-package fulfillment support
- public and authenticated tracking pages
- return request intake and refund orchestration

### Dependencies

- order domain from Phase 5
- shipping and notification adapters

### Acceptance criteria

- one order can produce multiple shipment timelines
- tracking updates are visible to both guests and signed-in customers
- returns and refunds follow explicit policy and state progression

## Phase 7: Bespoke Inquiry And Quote Flow

### Outputs

- bespoke request submission flow with file upload support
- admin quote issuance, revision history, and acceptance flow
- payment path for accepted quotes

### Dependencies

- customer/contact capture, storage, payment adapter, and order foundation from prior phases

### Acceptance criteria

- custom requests no longer rely on off-platform handling
- quote revisions are versioned and auditable
- accepted quotes can convert into the same downstream order and shipment system used by standard purchases

## Phase 8: Admin Suite And CMS

### Outputs

- role-based staff admin routes and permission checks
- modules for catalog, pricing, inventory, orders, shipments, returns, promotions, CRM, CMS, and analytics
- preview and publish flow for premium content blocks

### Dependencies

- all core domains operational enough to surface in admin
- staff auth and role model from Phase 2

### Acceptance criteria

- merchandisers and operations teams can manage daily workflows without code changes
- CMS updates preserve the current visual language by using bounded section types and shared design primitives
- all sensitive actions are auditable

## Phase 9: Analytics, Reliability, And Polish

### Outputs

- outbox processing, retry handling, and operational dashboards
- analytics views for conversion, fulfillment health, returns, and bespoke funnel performance
- UX polish on recovery states, loading states, and premium post-purchase communication

### Dependencies

- prior phases delivering real commerce events and admin workflows

### Acceptance criteria

- failures in payments, shipping, or notifications are observable and retryable
- operational dashboards answer the core questions defined in [Admin and CMS](./admin-and-cms.md)
- the product feels like one cohesive premium commerce experience rather than a landing page plus bolt-ons
