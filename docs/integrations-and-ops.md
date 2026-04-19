# Integrations And Operations

This document defines the provider seams and operational rules that sit around the core commerce domains. It complements [Architecture Overview](./architecture-overview.md), [Domain Model](./domain-model.md), and [Commerce Flows](./commerce-flows.md).

## Integration Principles

- Providers are replaceable; domain logic must not depend on vendor-specific payload shapes.
- External side effects must be idempotent and auditable.
- Shopper-facing transactions should use stored internal state as the source of truth, not live provider reads during page rendering.
- Async reconciliation is mandatory for payments, shipping, and notifications.

## Adapter Boundaries

### `PricingRateProvider`

Purpose:

- fetch the latest metal-rate inputs from the chosen market source
- normalize rates into internal `MetalRateSnapshot` records
- expose freshness metadata and source attribution

Expected capabilities:

- `fetchLatestRates()`
- `validateSnapshot(snapshot)`
- `storeSnapshot(snapshot)`
- `markSnapshotFreshness(snapshotVersion, status)`

Operational rules:

- browse pricing uses only persisted snapshots, never a raw third-party response
- stale-rate tolerance should be explicit and observable
- the rate refresh job must fail closed for checkout only when no valid snapshot exists

### `PaymentGateway`

Purpose:

- create payment attempts and confirm their outcome
- provide browser-safe client configuration when hosted fields or tokenization are required
- support refunds and quote-specific payment links

Expected capabilities:

- `createPaymentAttempt(checkoutContext)`
- `confirmPaymentAttempt(attemptReference)`
- `reconcileWebhook(eventPayload)`
- `refundPayment(refundRequest)`
- `createQuotePaymentLink(quoteContext)`

Operational rules:

- no raw card data is stored in app persistence
- each attempt carries an internal idempotency key
- order creation happens only after the attempt reaches the required success state
- webhook reconciliation must be safe to replay

### `ShippingGateway`

Purpose:

- create shipments, acquire tracking references, and sync carrier status
- support multi-package orders and canceled or replaced shipments

Expected capabilities:

- `createShipment(shipmentRequest)`
- `cancelShipment(shipmentReference)`
- `syncTracking(trackingNumbers[])`
- `normalizeTrackingEvent(providerEvent)`

Operational rules:

- order fulfillment screens must read internal `Shipment` and `TrackingEvent` records
- carrier polling or webhook ingestion may update tracking asynchronously
- shipment replacement creates a new shipment record rather than rewriting history

### `NotificationGateway`

Purpose:

- deliver transactional communications for order, shipping, return, refund, and quote events

Expected capabilities:

- `sendOrderConfirmation()`
- `sendShipmentUpdate()`
- `sendQuoteIssued()`
- `sendRefundUpdate()`
- `sendFailureAlert()`

Operational rules:

- email is required in v1
- notification dispatch is async and retryable
- customer-visible copy should come from structured templates or CMS content blocks where brand language matters

### `CMSService`

Purpose:

- resolve published content blocks that decorate the storefront and premium communications

Expected capabilities:

- `getPublishedSection(placement, theme)`
- `previewDraftSection(sectionId)`
- `publishSection(sectionId, actorId)`

Operational rules:

- CMS content cannot bypass the shared theme system
- content publishing should be versioned and auditable

## Event And Outbox Model

External work should be driven by internal domain events written to an outbox table and processed by retryable jobs.

Recommended event types:

- `metal_rate.snapshot_refreshed`
- `checkout.price_locked`
- `payment.attempt_created`
- `payment.confirmed`
- `payment.failed`
- `order.created`
- `shipment.created`
- `shipment.tracking_updated`
- `return.requested`
- `refund.processed`
- `bespoke.quote_issued`
- `cms.section_published`

Flow:

1. domain transaction commits internal state and an outbox event
2. background worker claims the event
3. worker performs the external call or projection
4. worker stores delivery result and retry metadata

This pattern keeps the platform resilient when provider APIs are slow or temporarily unavailable.

## Idempotency And Reconciliation

### Payment idempotency

- every payment attempt gets a unique internal idempotency key
- order creation is guarded by checkout and payment references
- webhook handlers must be replay-safe and ignore already-applied state transitions

### Shipping idempotency

- shipment creation must deduplicate against order package intent
- tracking events should be normalized and de-duplicated on carrier event identity plus timestamp

### Notification idempotency

- avoid sending the same customer-facing message twice for the same order event unless explicitly retried as a new communication

## Operational Policies

### Cancellations

- pre-fulfillment cancellations are allowed for standard items if payment state and production state permit it
- bespoke orders may require admin review because materials or production work may already be committed

### Returns

- standard items follow a defined eligibility window and item-state checks
- customized or bespoke items are usually exception-handled and may be non-returnable depending on approved policy

### Refunds

- refunds reference both the order and the originating payment attempt
- partial refunds are valid and should not collapse the whole order into a refunded state unless totals warrant it

### Auditability

- all staff actions that change pricing, inventory, order state, shipment state, quote state, promotions, or CMS publication status should write to `AuditLog`
- provider callbacks and retry history should also be inspectable for support and debugging

## Observability Expectations

At minimum, the implementation should support:

- structured logs for payment, shipping, and background job execution
- dashboard visibility into stale pricing snapshots, failed webhooks, stuck shipments, and notification retry queues
- admin-visible status explanations when provider sync is pending or failed
