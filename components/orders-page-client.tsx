"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { SiteShell } from "@/components/site-shell";
import { formatCurrency } from "@/lib/commerce-data";

export function OrdersPageClient() {
  const { orders } = useCart();

  return (
    <SiteShell
      theme="everyday"
      pageEyebrow="Account"
      pageTitle="Order history and shipment visibility"
      pageIntro="Guest and authenticated orders share the same tracking and post-purchase structure."
    >
      <section className="content-shell stack-lg">
        {orders.map((order) => (
          <article className="content-card order-card" key={order.orderNumber}>
            <div className="order-card-head">
              <div>
                <p className="product-badge">{order.orderStatus}</p>
                <h2 className="section-title font-display">{order.orderNumber}</h2>
                <p className="field-help">
                  Price lock snapshot {order.snapshotVersion} • Card ending {order.cardLast4}
                </p>
              </div>
              <div className="order-card-total">
                <strong>{formatCurrency(order.total)}</strong>
                <span>{new Date(order.placedAt).toLocaleDateString("en-IN")}</span>
              </div>
            </div>

            <div className="order-chip-row">
              {order.shipments.map((shipment) => (
                <span className="status-chip" key={shipment.id}>
                  {shipment.label}: {shipment.status}
                </span>
              ))}
            </div>

            <div className="button-row">
              <Link className="secondary-button" href={`/account/orders/${order.orderNumber}`}>
                View order detail
              </Link>
              <Link className="primary-button" href={`/track?order=${order.orderNumber}`}>
                Track shipment
              </Link>
            </div>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}
