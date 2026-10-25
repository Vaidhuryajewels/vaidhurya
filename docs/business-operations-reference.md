# VAIDHURYA business operations reference

Captured: 25 October 2026. Source: the owner's interview and subsequent corrections in this conversation. This file preserves business context for future conversations and automation; it is not evidence that a feature or integration is implemented.

## How to use this reference

- Owner statements below are the business baseline unless explicitly marked tentative or unresolved.
- Later explicit owner corrections supersede earlier interview answers. Preserve the correction history when changing a rule.
- [Automation requirements and decisions](./business-automation-requirements.md) separates confirmed requirements, proposed controls, and open decisions.
- [Operations automation plan](./operations-automation-plan.md) contains researched options and rollout proposals. Its vendor choices are recommendations, not owner approvals or verified deployments.
- [Platform roadmap](./platform-roadmap.md) remains the source for implementation scope/status. A business requirement does not automatically expand the current software release.
- Where the roadmap and interview differ, flag the discrepancy before changing behavior. Do not silently treat either a proposed architecture or an existing implementation as the owner's business policy.
- This reference contains business policies, not credentials, customer addresses, payment evidence, or a live inventory register. Store actual operational records in the approved private system.

## Business, owner, and objectives

| Topic | Owner-provided context |
| --- | --- |
| Brand | VAIDHURYA; interview spelling/transcription variants refer to the same business |
| Correct domain | `vaidhurya.com`; earlier domain spellings were corrected by the owner |
| Business | Precious jewellery, including silver and gold; bangles, earrings, men's bracelets, and other designs |
| Operator | One owner, no staff currently |
| Catalogue | Approximately 35–40 active product designs |
| Channels | Instagram professional business account, WhatsApp Business, and WhatsApp Business API |
| Demand | Around 500 Instagram inquiries and 50–60 WhatsApp inquiries when a reel is posted; approximate, not a measured daily average |
| Conversion observation | Owner reports converting over 80% of about 20 personally answered, already-filtered inquiries; do not apply this rate to all leads or forecast it as established performance |
| Primary problem | Too many inquiries to answer; notes and follow-ups scattered; orders, inventory, manufacture, payments, and shipment progress lack one organized system |
| Desired daily work | Pack orders, perform physical QC, handle exceptions, and reconcile stock at store closing |
| Main objective | Automate quickly, prevent errors, surface potential errors, minimize setup effort, technical work, administration, and recurring/rework cost |
| Ownership preference | Retain control and portability of records; willing to start with cheaper existing tools and replace them when worthwhile |
| Reporting | End-of-day dashboard preferred over a WhatsApp summary |

The owner does not want recommendations based merely on their preferences or prior purchases. Evaluate cost, fit, operating effort, portability, and maintenance objectively.

## Acquisition and customer communication

1. Owner posts product reels, usually showing GST-inclusive pricing to filter out inquiries outside the price range.
2. Customers share the reel into Instagram DMs, or send a screenshot/link through Instagram or WhatsApp.
3. Preferred future Instagram flow: identify the shared reel, send product-specific approximate pricing/details, and direct the customer to the exact website product page.
4. Customers should browse and place orders on the website with limited conversation. Doubts or exceptional questions can move to WhatsApp and the owner.
5. Customer-facing product codes are explicitly unwanted. Internal design/variant IDs are acceptable and necessary for reliable records; the owner is comfortable assigning them.
6. Telugu is mandatory because most customers speak Telugu. Support English and Hindi, with natural bilingual/regional communication when appropriate.
7. Standard first responses can be automated on Instagram. WhatsApp must request owner approval before sending replies at the current stage.
8. Unusual or complex conversations need owner review and personal interaction.

Reel-to-product mapping, screenshot identification accuracy, and platform support for the exact DM trigger remain implementation questions. Do not claim a tool handles them until tested. Comment-keyword flows were assistant suggestions, not a replacement approved by the owner.

## Products, sizes, and inventory

- Available assets: photos, reel links, categories, sizes, prices, manufacturer details, costs, and stock information; completeness has not been verified.
- Prices and costs vary with design, size, metal/material, colour, stones, weight, quality, and customization.
- Women's standard bangle sizes: `2-4`, `2-6`, `2-8`. Preserve these as jewellery size labels, not decimal numbers or arithmetic.
- Men's bracelet range: approximately 6–8.5 inches; standard sizes stated as 6.5, 7.5, and 8.5 inches. Do not confuse bracelet inches with bangle size labels.
- Current stock is counted broadly by category, rather than reliably by exact variant. The owner corrected an initial statement suggesting separate counts.
- The business avoids excessive ready stock because gold/silver tie up capital. Made-to-order is central to the model.
- Ready stock is normally promised dispatch within the next two days, subject to payment and checks.
- A manufacturable unavailable standard size or other item is normally quoted 10–15 days. This describes production/receipt expectations, not a guaranteed customer delivery SLA.
- Inventory will be physically checked and updated at store closing. The owner can provide initial inventory quickly.

Automation needs exact variant identity and saleable/reserved quantities even though the current manual practice does not have them. Physical stock remains subject to owner verification.

## Pricing and discounts

The owner's stated components are metal weight × current metal rate, making charges, stones, margin, and GST. Exact calculation order, units, and tax treatment need confirmation before implementation.

- Small items of around 3–4 grams: often double the manufacturer's making charge.
- Heavier items: often add ₹50–₹100 to making charges; whether this is per gram or per item was not made clear.
- Margins may reduce on heavier items; there is no complete deterministic margin formula yet.
- **Silver:** keep the accepted quoted price fixed despite small actual-weight differences, typically around 1–2 grams, because the owner normally absorbs them within margin. Do not automatically reprice silver at dispatch.
- **Gold:** actual-weight changes require recalculating the quote. The rate-lock date and customer approval/payment flow are unresolved.
- Current reel prices include GST. A future move to GST-exclusive base pricing was considered, not adopted.
- Owner stated 3% GST for their jewellery. Treat this as a business input pending CA validation for applicable items and transactions, rather than tax advice.
- Negotiation is occasional. Typical reductions are around ₹300–₹500; free shipping is occasionally offered as a discretionary concession.
- Orders above ₹5,000 may receive consideration for a discount, but there is no automatic entitlement.
- Later examples: heavier orders above roughly 15–20 grams or three/four pieces can sometimes justify ₹500–₹600 discount, provided a decent profit remains.
- Discount limits are examples, not a machine-executable policy. A minimum profit amount/percentage and unambiguous approval threshold have not been set.

## Payments and checkout information

- Current payment methods: UPI, sometimes bank transfer. No COD, payment links, or automatic bank matching in the described current process.
- Prefer full payment upfront. Where necessary, accept an owner-selected advance, generally 50%; 30–40% is exceptional, with below-50% approval mandatory.
- Production starts after the agreed advance is received and verified.
- Full payment is required before dispatch.
- Customer uploads a payment screenshot and transaction/reference number. Screenshot receipt alone is not payment verification.
- Owner checks the actual UPI/bank receipt and approves every payment verification.
- Capture customer name, phone, full address, PIN code, exact product, size, colour, customization, and other specifications clearly.
- Balance collection occurs when the item is ready, before shipment. Reminders should reduce repeated manual chasing.

Payment gateway adoption and automatic reconciliation were researched options. They have not replaced the owner's current manual-verification requirement.

## Manufacturers, procurement, and production

- Approximately four/five manufacturers; different manufacturers specialize in different items.
- Current orders are written WhatsApp messages/notes, not a portal or automated integration.
- Create internal manufacturer records and assign work even if manufacturers do not sign up or actively use the system.
- Manufacturer assignment/order placement requires owner approval.
- Job specification: product photo, design, size, material, colour, customization, quality requirement, target weight, and due date.
- Record order date, agreed/accepted date, promised date, dispatch from manufacturer, receipt date, cost, amounts paid, payment dates, and remaining payable.
- Lead times are unreliable: orders expected around 15 days have sometimes taken 30 days. Track promised versus actual dates and overdue work.
- Future portal: manufacturers receive assigned orders and report progress/fulfillment directly.
- CAD files are currently often retained by manufacturers. Owner wants to own design/CAD files, compare quotes across manufacturers, and may hire designers. This is a future sourcing objective, not current ownership or an existing asset library.

## Receiving and quality control

- Owner checks weight, finish, stones, colour, damage, customization, and hallmark.
- Owner currently lacks appropriate tools for reliable size measurement and plans to obtain them. Do not describe physical size verification as already consistently performed.
- Correct customer size is important; future QC must verify both the ordered specification and the actual manufactured item.
- QC approval requires the owner and cannot be inferred from a receipt date or manufacturer assurance.
- Failed QC: contact manufacturer, return for repair/rework, receive and recheck.
- Tell the customer there was a manufacturing issue and shipment is delayed; avoid an unsupported new delivery promise.

## Shipping and delivery

- Current described carrier: DTDC; owner dissatisfied with responsiveness. Delhivery was mentioned as a possible alternative, not selected.
- India Post was considered, but lack of convenient pickup is a concern.
- Current method: WhatsApp new-order labels, handwritten address, packing, and calling the carrier for pickup.
- Shipping charge: **₹150 anywhere in India**. The owner immediately corrected an initial spoken ₹1,500.
- No automatic free shipping above ₹5,000; this explicitly corrects an earlier implication. An occasional owner-approved concession is separate.
- After shipping, send parcel/address details or label/slip and the tracking number to that customer only.
- Desired monitoring: track progress until delivered, alert owner after roughly two/three days without movement, and provide useful customer updates/expected delivery when supported by carrier evidence.
- Current practice does not routinely monitor progress; customer complaints trigger manual carrier contact.
- Request a review and customer photo after delivery, ideally about one day later; the owner accepts immediately or within two days. Exact schedule remains configurable.
- BVC/Sequel and commodity/insurance checks were assistant research recommendations. No carrier onboarding or commercial approval is established by this conversation.

## Cancellation, return, exchange, repair, and loss

- Owner's stated ordinary policy: no cancellations, returns, or exchanges, including incorrect-size exchanges for custom-made items.
- This is the owner's commercial policy; do not infer it resolves statutory rights or override approved production policies without review.
- Repairs are accepted. Customer sends the item to VAIDHURYA; repair price charged to the customer incorporates outward return-shipping cost.
- No stated warranty period; owner supplies care/maintenance instructions and expects careful use.
- Failed manufacturing QC is a manufacturer rework flow, distinct from a customer repair request.
- One historical lost shipment was fully refunded to the customer. Lost-shipment handling is case-by-case; refunds always need owner approval.
- No prior shipment damage or return-to-origin cases were reported. Their workflows and charging rules remain undecided.

## GST, accounting, and profitability

- Owner states the business is GST registered; legal entity name, GSTIN, registered state/address, and invoice numbering need actual verified inputs.
- No proper accounting/GST application was used in the described process. Invoices were sometimes generated with ChatGPT when requested; do not assume completeness or statutory correctness.
- Desired invoice: HSN, jewellery weight, purity (transcribed once as impurity), hallmark information, and separate appropriate GST components. CA can provide one/two reference invoices.
- Record purchase metal rate/cost, manufacturer's making charges, stone charges, manufacturer total, amount and date paid, balance payable, customer sale/payment dates, production/shipping dates, tax, discounts, shipping, and final profit.
- GST collected, input tax, remittance/filing, inventory cost, and cash received are different facts; exact accounting configuration and margin definition need CA approval.

## Owner priorities

| Capability | Stated importance / sequencing |
| --- | --- |
| Orders and deliveries | First operational implementation priority |
| Inventory | 5/5; initial details can be supplied quickly |
| Instagram automatic responses | 5/5; critical inquiry bottleneck |
| GST invoices/accounting | 5/5 |
| Website catalogue and checkout | Very important; no distinct numeric rating confirmed |
| Order/payment dashboard | Important; no distinct numeric rating confirmed |
| Shipping/delivery monitoring | 4/5 |
| Manufacturer tracking | 3/5 for now; manual communication acceptable initially |

## Existing files and data ownership preference

- Procured assets: `/Users/dpvenkatesh/Downloads/All jewellery tools 30/`.
- User calls the intended working tool “Vaidhurya Business Manager”; do not confuse that with an unrelated Excel file or claim a consolidated workbook exists without locating it.
- Earlier assistant inspection reported 31 workbooks, one exact CRM duplicate, sample data, and no external workbook formula links. These are inspection findings, not owner declarations; recheck actual files before imports.
- Reuse useful layouts/calculators without treating purchased templates as a connected ERP or live business records.
- Owner asked about local data, Google Drive/Microsoft cloud backup, hybrid ownership, and Excel/platform synchronization with only one editing location at a time.
- The subsequent cost discussion prioritizes ease of setup/management and low recurring cost over attachment to Excel. Managed open source is a recommendation under evaluation; self-hosting is an option to assess, not an approved deployment.

## Corrections that future work must preserve

| Earlier ambiguity | Final owner statement |
| --- | --- |
| Multiple spoken domain spellings | `vaidhurya.com` |
| Customer must enter a product code | No customer-facing code; shared reel identifies the product |
| Stock already tracked separately | Current broad category counts; exact variant tracking is a needed improvement |
| Shipping ₹1,500 | ₹150 |
| Free shipping above ₹5,000 | No automatic waiver |
| Silver repriced on final weight | Accepted silver quote remains fixed for normal variation |
| All replies automatically sent | WhatsApp replies require owner approval for now |
| Owning data requires rebuilding software | Owner wants ownership/portability and low burden; rebuilding was an option, not a committed requirement |
