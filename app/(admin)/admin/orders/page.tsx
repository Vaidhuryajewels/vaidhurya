import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { sampleOrders } from "@/lib/commerce-data";

export default function AdminOrdersPage() {
  return (
    <SiteShell
      theme="bridal"
      pageEyebrow="Admin • Orders"
      pageTitle="Order operations and payment review"
      pageIntro="Operations can inspect price locks, payment state, shipment splits, and return pathways from one command surface."
    >
      <section className="content-shell stack-lg">
        {sampleOrders.map((order) => (
          <article className="content-card order-card" key={order.orderNumber}>
            <div className="order-card-head">
              <div>
                <p className="product-badge">{order.paymentStatus}</p>
                <h2 className="section-title font-display">{order.orderNumber}</h2>
                <p className="field-help">
                  Locked at {new Date(order.priceLockedAt).toLocaleString("en-IN")} • {order.snapshotVersion}
                </p>
              </div>
              <Link className="secondary-button" href={`/account/orders/${order.orderNumber}`}>
                Open customer-facing detail
              </Link>
            </div>

            <div className="order-chip-row">
              {order.shipments.map((shipment) => (
                <span className="status-chip" key={shipment.id}>
                  {shipment.status}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
