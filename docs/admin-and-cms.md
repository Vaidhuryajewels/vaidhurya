# Admin And CMS

The VAIDHURYA admin suite is the operational control plane for catalog, orders, shipping, content, and customer support. It is intentionally part of the same product so merchandising and operations can move quickly without introducing a separate platform too early.

## Admin Objectives

- manage premium jewelry commerce without depending on source-code edits
- keep catalog, pricing, fulfillment, and content workflows aligned with the existing storefront theme
- support distinct internal teams with role-based permissions and traceable changes

## Admin Modules

| Module | Primary responsibilities | Key outputs |
| --- | --- | --- |
| Catalog | products, variants, media, certificates, gift eligibility, publish state | shopper-visible assortment |
| Pricing and rates | metal-rate snapshots, formula inputs, margin rules, override review | browse prices and checkout locks |
| Inventory | stock levels, sellability, reservation state, made-to-order availability | add-to-cart and fulfillment eligibility |
| Orders | order review, payment state inspection, cancellation handling, exception notes | clean order lifecycle management |
| Shipments | package creation, carrier submission, tracking review, replacement shipment handling | fulfillment execution |
| Returns and refunds | eligibility review, approval workflow, refund orchestration | post-purchase operations |
| Promotions | campaign rules, collection promotions, gifting incentives | merchandising and conversion support |
| CRM and customers | customer profiles, guest-to-account linking, support notes, order history | support visibility |
| CMS | homepage sections, banners, curated collection content, gifting/certification copy | brand-managed content |
| Analytics | sales, conversion, fulfillment health, quote conversion, content impact | operational reporting |

## Staff Roles

The v1 permission model is role-based rather than fully object-level.

| Role | Responsibilities | Permissions focus |
| --- | --- | --- |
| `super_admin` | platform oversight, governance, emergency access | full access across admin, integrations, and CMS |
| `merchandiser` | assortment, pricing inputs, collection order, storytelling content | catalog, promotions, CMS, limited analytics |
| `operations_manager` | order handling, shipments, returns, refunds, inventory coordination | orders, shipping, inventory, operational analytics |
| `support_agent` | customer assistance, order lookup, return intake, quote follow-up | read-mostly catalog, CRM, orders, returns, bespoke support actions |

Permission expectations:

- destructive or financially sensitive actions should be limited to appropriate roles
- publication and pricing changes should always be audited
- support agents should not be able to silently alter locked economic records

## CMS Scope

The built-in CMS exists to control premium content without undermining design consistency.

Managed content should include:

- homepage hero and launch sections
- announcement bars and campaign banners
- curated collection intros and landing-page blocks
- gifting copy and premium packaging language
- certification, authenticity, and care-content modules
- post-purchase message fragments used in confirmations and shipping updates

CMS constraints:

- editors can change content and media, not the underlying visual system
- section types should map to predesigned components that reuse the current luxury tokens and layout language
- draft, preview, publish, and rollback states should be supported

## Admin Workflow Rules

### Catalog and pricing

- publishable products require media, material details, and pricing rules to be complete
- rate-driven pricing should not be manually rewritten into product descriptions
- certificates and gifting capabilities must be visible in both admin and storefront contexts

### Orders and fulfillment

- operations staff can split orders into multiple shipments
- shipment exceptions should remain attached to the order timeline
- cancellations, returns, and refunds should always preserve historical reasoning and actor attribution

### Bespoke support

- support or merchandising staff can triage inbound inquiries
- only authorized roles should issue or revise quotes
- quote revision history must be visible to both operations and support staff

### CMS publishing

- editorial changes should preview in the real theme context before publish
- publishing premium content should not require engineer intervention for normal merchandising updates

## Analytics Expectations

The initial analytics surface should help answer:

- which collections and PDPs drive add-to-cart
- where checkout failures occur
- how dynamic pricing affects conversion
- shipment delay rate and delivery performance
- return and refund patterns
- bespoke inquiry-to-quote and quote-to-order conversion
- CMS campaign impact on shopper engagement

## Audit Requirements

Every meaningful staff mutation should write an audit entry, especially:

- price rule changes
- inventory adjustments
- order-state changes
- shipment cancellations or replacements
- refund approvals
- quote issuance and revision
- CMS publication events
