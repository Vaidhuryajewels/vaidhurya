"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { type StoredOrder, formatCurrency } from "@/lib/commerce-data";
import { fetchOrderByNumber } from "@/lib/order-lookup";
import { SiteShell } from "@/components/site-shell";

export function OrderDetailPageClient({ orderNumber }: { orderNumber: string }) {
  const { orders } = useCart();
  const sessionOrder = orders.find((entry) => entry.orderNumber === orderNumber) ?? null;
  const [fetchedOrder, setFetchedOrder] = useState<StoredOrder | null>(null);
  const [isLoading, setIsLoading] = useState(sessionOrder === null);
  const [loadError, setLoadError] = useState("");
  const order = sessionOrder ?? fetchedOrder;

  useEffect(() => {
    if (sessionOrder) {
      return;
    }

    let active = true;

    async function loadOrder() {
      try {
        setIsLoading(true);
        setLoadError("");
        const resolved = await fetchOrderByNumber(orderNumber);

        if (active) {
          setFetchedOrder(resolved);
        }
      } catch (error) {
        if (active) {
          setLoadError(
            error instanceof Error ? error.message : "Unable to load that order right now.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadOrder();

    return () => {
      active = false;
    };
  }, [orderNumber, sessionOrder]);

  return (
    <SiteShell
      theme="bridal"
      pageEyebrow="Order detail"
      pageTitle={order ? `Order ${order.orderNumber}` : "Order not found"}
      pageIntro="The detail view keeps payments, shipments, and line items aligned under one premium post-purchase experience."
    >
      <section className="content-shell stack-lg">
        {isLoading ? (
          <div className="content-card empty-state-stack">
            <p className="empty-state">Loading order details…</p>
          </div>
        ) : !order ? (
          <div className="content-card empty-state-stack">
            <p className="empty-state">
              {loadError || "We couldn&apos;t find that order."}
            </p>
            <Link className="primary-button" href="/account/orders">
              Back to orders
            </Link>
          </div>
        ) : (
          <>
            <article className="content-card">
              <div className="order-card-head">
                <div>
                  <p className="product-badge">{order.orderStatus}</p>
                  <h2 className="section-title font-display">Order summary</h2>
                  <p className="field-help">{order.addressSummary}</p>
                </div>
                <div className="order-card-total">
                  <strong>{formatCurrency(order.total)}</strong>
                  <span>Card ending {order.cardLast4}</span>
                </div>
              </div>

              <div className="stack-md">
                {order.lines.map((line) => (
                  <div className="summary-line" key={line.variantId}>
                    <div>
                      <strong>{line.title}</strong>
                      <p>
                        {line.variantLabel} • Qty {line.quantity}
                        {line.giftWrap ? " • Gift wrap" : ""}
                      </p>
                    </div>
                    <strong>{formatCurrency(line.lineTotal)}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="content-card stack-lg">
              <div className="section-heading section-heading-left">
                <p className="section-kicker">Shipment tracking</p>
                <h2 className="section-title font-display">Package timelines</h2>
              </div>

              {order.shipments.map((shipment) => (
                <div className="timeline-card" key={shipment.id}>
                  <div className="order-card-head">
                    <div>
                      <strong>{shipment.label}</strong>
                      <p className="field-help">
                        {shipment.carrier} • {shipment.trackingNumber}
                      </p>
                    </div>
                    <div className="order-card-total">
                      <strong>{shipment.status}</strong>
                      <span>{shipment.etaLabel}</span>
                    </div>
                  </div>

                  <div className="timeline-list">
                    {shipment.events.map((event) => (
                      <div className="timeline-row" key={`${shipment.id}-${event.label}-${event.at}`}>
                        <div className="timeline-dot" />
                        <div>
                          <strong>{event.label}</strong>
                          <p>{event.detail}</p>
                          <span className="field-help">
                            {new Date(event.at).toLocaleString("en-IN")} • {event.location}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </article>
          </>
        )}
      </section>
    </SiteShell>
  );
}
