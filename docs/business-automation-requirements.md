# Business automation requirements and decision register

Captured: 25 October 2026 from the owner interview. Read [business operations reference](./business-operations-reference.md) first. This file translates the interview into future automation constraints; none of the rows below prove implementation or production readiness.

## Authority and scope

Confirmed owner requirements govern business intent. The [platform roadmap](./platform-roadmap.md) governs current implementation/release scope. [Operations automation plan](./operations-automation-plan.md) contains candidate solutions. Resolve differences explicitly before changing live behavior.

Known differences to resolve include manual UPI approval versus the roadmap's authoritative Razorpay paid state; ordinary no-cancellation/no-return policy versus existing cancellation/refund capabilities; made-to-order business requirements versus deferred bespoke launch scope; and ERP authority proposals versus the current Supabase architecture. Keep commercial policy, provider evidence, and software release scope distinct.

## Approval matrix

| Action | Confirmed requirement |
| --- | --- |
| Instagram standard initial response | May be automatic when product and answer are reliable |
| WhatsApp reply | Owner approval required before sending for now, including follow-up replies; do not silently exempt transactional replies |
| Payment verification | Owner checks actual receipt and approves every payment |
| Advance under 50% | Explicit owner approval; generally prefer full payment or 50% |
| Manufacturer assignment/order placement | Owner approval |
| QC acceptance | Owner approval following physical checks |
| Refund | Owner approval |
| Unusual customer response | Owner review and personal handoff |
| Negotiated discount/free shipping | No complete automatic rule authorized; require owner decision until profit floor and thresholds are defined |

Approval must bind to the exact version of the action/message/specification. If amount, recipient, bank reference, address, product, size, or message changes, the proposed control is to invalidate affected approval and request review again.

## End-to-end operating workflow

| Stage | Required business data/action | Proposed error control |
| --- | --- | --- |
| Reel inquiry | Shared reel/link/screenshot, language, customer, mapped product | Avoid guessing if ambiguous; ask for clarification or hand off |
| Product response | Relevant details, approximate or approved price, availability, exact product page | Never substitute an unrelated product or invent price/stock |
| Order capture | Name, phone, complete address/PIN, product/variant, size, colour, customization, quote | Required fields and explicit specification confirmation |
| Payment | Expected amount, screenshot, transaction reference, bank receipt, verification | Detect repeated references; screenshot alone cannot unlock order |
| Fulfillment decision | Available exact variant or manufacturable requirement | Reserve stock once; prevent negative stock/double allocation |
| Production | Approved manufacturer/job, accepted specs, cost, dates, advance/payable | Due-date queue; preserve customer and manufacturer promises separately |
| Receiving/QC | Actual weight, actual size, finish, stones, colour, damage, customization, hallmark | Receipt does not mean QC passed; failed QC routes to rework |
| Final balance/price | Silver fixed quote; gold recalculation under approved rule; full payment | Block dispatch when balance or gold approval unresolved |
| Packing/dispatch | Correct item/specs, address, invoice, parcel details, carrier, tracking | Match item/order/recipient and preserve owner QC approval |
| Transit | Latest carrier event, event time, last movement, delivery evidence | Alert on stalled/missing updates; do not infer delivery from time elapsed |
| Delivered/review | Delivered timestamp, review/photo request, communication approval | Send request once, at agreed interval; WhatsApp approval still applies |
| Exception/repair | Issue, evidence, owner decision, repair/rework/refund costs, linked shipment | Separate repair, manufacturing rework, and shipment-loss workflows |

These are proposed implementation controls supporting confirmed intent, not claims that the owner already operates them.

## Minimum durable records

Use stable internal IDs even though customers do not use product codes. Preserve history instead of overwriting finalized transactions.

| Record | Essential fields |
| --- | --- |
| Product/design | Internal ID, name/category, photos, reel mappings, material, purity, stones, manufacturability, manufacturer options |
| Variant | Product ID, size label and size system/unit, colour, material/quality, customization constraints, price context |
| Stock movement/count | Variant, quantity, reservation/order reference, movement reason, location, counted quantity, date, correction approval |
| Customer/inquiry | Contact, language, channel IDs, reel/product context, status, owner handoff; consent/communication permissions where applicable |
| Order/line | Unique order ID, source, customer/address snapshot, exact specifications, quantity, fixed/recalculable quote, promised dates, statuses |
| Quote | Version, metal rate/date, estimated/final weight, making/stone costs, margin, tax, shipping, discount, validity, acceptance |
| Payment | Order, method, expected/received amount, transaction reference, evidence, receipt date, owner verification, allocations and balance |
| Manufacturer/job | Manufacturer, order line, approved specification version, assigned/accepted/promised/received dates, weight/cost quote, status/rework |
| Supplier payment/payable | Manufacturer/job/bill, amount owed, amount paid, dates, references, outstanding balance |
| QC | Item/order, actual measurements, checklist/evidence, result, owner, timestamp, rework linkage |
| Shipment | Order, from/to snapshot, compliant carrier, declared value/coverage, booking/pickup, tracking, event history, delivery, incident |
| Invoice/accounting | Verified entity details, number/year, order, HSN, weight/purity/hallmark, taxable values, GST components, costs and ledger links |
| Repair/refund | Original order/item, reason, receipt/rework, approved amount, repair price/shipping inclusion, return shipment/refund reference |
| Approval/alert | Action/object version, approver, reason, timestamps, status, retry/escalation and resolution evidence |

Do not store live customer records, transaction screenshots, secrets, or API tokens in these documentation files. Do not embed private customer addresses in publicly accessible shipping or tracking projections.

## Alert backlog

Owner confirmed the need for errors/potential errors to surface and specifically requested shipment alerts after two/three days without movement. Other alerts below are derived proposals to validate during rollout.

| Priority | Alert/condition | Required response |
| --- | --- | --- |
| First | Payment evidence pending, inconsistent receipt, duplicate reference | Owner review; no paid-state assumption |
| First | Missing address, PIN, size, customization, or unmatched product | Complete/confirm before fulfillment |
| First | Insufficient exact-variant stock or count mismatch | Stop conflicting allocation and reconcile |
| First | QC missing/failed, unpaid balance, unresolved gold quote | Hold dispatch and show reason |
| First | Tracking absent, stale feed, or no movement for configured two/three days | Distinguish feed failure from genuine stall; create owner task/customer-update draft |
| Next | Manufacturer has not accepted, promise overdue, or revised promise conflicts with customer date | Owner follows up; draft accurate customer update |
| Next | Invoice missing/inconsistent, unexplained payable, negative/low margin | Owner/CA review |
| Next | Failed integration, rejected import, duplicate order, backup/export failure | Visible retry/reconciliation task; never mark success silently |
| Next | Delivered order has no review request after approved interval | Queue one request with channel approval rules |

Alerts need an owner, actionable reason, linked record, creation time, resolution state, and deduplication. A dashboard should distinguish actions awaiting the owner from provider/system failures.

## Tool and architecture decisions

| Item | Status from this conversation |
| --- | --- |
| Current website/domain | Owner confirmed `vaidhurya.com`; says built with Codex; repository has custom commerce implementation |
| Excel toolkit | Procured; useful structures/assets, not evidence of integrated automation |
| Single editing authority | Owner requested one editing location at any given time, with intact portable data |
| Microsoft/Google storage | Requested alternatives for backup/sync; no purchase, account configuration, or restore test confirmed |
| Excel/platform two-way editing | Requested idea; later advice favors platform authority with validated Excel imports; final choice not approved |
| ERPNext on Frappe Cloud | Latest researched recommendation: sandbox/pilot; no owner selection, setup, subscription, or cutover confirmed |
| Odoo/Zoho | Alternatives/fallbacks requiring scope and cost comparison; not selected |
| “Presto” | Assistant assumed PrestaShop; exact intended product never confirmed |
| BVC/Sequel | Researched carrier candidates; no contract, pickup trial, insurance acceptance, or integration confirmed |
| Interakt/Manychat | Instagram automation candidates; exact shared-reel trigger needs verification |
| Razorpay/payment links | Researched integration route; current owner practice remains UPI/bank/manual approval |
| Self-hosting | Owner wants easy management and ownership; infrastructure operation has not been authorized or chosen |
| Rebuilding tools later | Optional strategy; only worthwhile if measured economics and missing functionality justify it |

Provider prices researched earlier are time-sensitive. Recheck official prices, plan limits, implementation/support costs, backups, and export terms before purchase; do not treat past starting prices as all-inclusive production budgets.

## Open decisions and missing inputs

1. Final operational system and implementation budget; recurring support budget and responsible maintainer.
2. Verified GST identity and CA-approved example invoices, HSN/tax rules, numbering, and accounting treatment.
3. Initial exact-variant stock, open orders, received advances, balances, manufacturer payables, and in-transit shipments.
4. Exact weight-based making-charge units/formula, minimum margin, discount thresholds, and free-shipping approval rules.
5. Gold metal-rate locking, final-weight adjustment, customer approval, extra collection, and overpayment/refund rules.
6. Production promise: calendar/business days, start event, buffer, manufacturer acknowledgement, and delay escalation.
7. Size measurement equipment, measurement guide, customer confirmation, and actual-item tolerance/QC criteria.
8. Shipping agreement, pickup/serviceability, jewellery acceptance, insurance/claims, packaging, and tracking access.
9. Stall threshold: two or three days, business/calendar treatment, and separate stale-feed alert.
10. Review timing: immediate/one/two days; message templates and permission to reuse customer photos separately.
11. Customer repair, damage, wrong item, RTO, cancellation and refund exception rules; reconcile with approved platform policies.
12. WhatsApp API provider/coexistence, templates, approved message workflow, Meta access, and reel mapping reliability.
13. Backup retention, recovery-point/time targets, encryption/account ownership, export schedule, and restore procedure.
14. Locate the actual working “Vaidhurya Business Manager” workbook before any consolidation or migration; purchased templates are not presumed live data.

Do not ask the owner to repeat confirmed interview answers. Ask only for unresolved choices or current records required for the next bounded implementation slice.

## Rollout acceptance

The first operating slice should demonstrate one ready-stock and one made-to-order order, owner-verified payment/advance, exact size/variant, manufacturer assignment when needed, QC, balance-before-dispatch, invoice, shipment/tracking, stalled-delivery handling, and a queued review request. Confirm exact totals and a recoverable export before cutover.

Roll out orders/deliveries and initial inventory first, then broaden messaging, accounting automation, manufacturer portals, and quotation/CAD workflows. Preserve the current premium brand experience. Keep physical packing, stocktake, quality judgments, and required approvals with the owner.

## Maintenance log

- 25 October 2026: extracted owner facts, corrections, business rules, proposed controls, unresolved decisions, and tool-selection status from the interview. No vendor adoption, production deployment, payment-policy change, or operational data migration was performed.
