"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { type StoredOrder } from "@/lib/commerce-data";
import { fetchTrackedOrder } from "@/lib/order-lookup";
import { SiteShell } from "@/components/site-shell";

export function TrackPageClient() {
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("order") ?? "VDY24041801");
  const [match, setMatch] = useState<StoredOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!search.trim()) {
      return;
    }

    let active = true;

    async function loadTracking() {
      try {
        setIsLoading(true);
        setLoadError("");
        const order = await fetchTrackedOrder(search.trim());

        if (active) {
          setMatch(order);
        }
      } catch (error) {
        if (active) {
          setMatch(null);
          setLoadError(
            error instanceof Error ? error.message : "Unable to load tracking right now.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadTracking();

    return () => {
      active = false;
    };
  }, [search]);

  return (
    <SiteShell
      theme="everyday"
      pageEyebrow="Tracking"
      pageTitle="Track an order or shipment"
      pageIntro="Search by order number to see split-package updates, status transitions, and carrier references."
    >
      <section className="content-shell stack-lg">
        <div className="content-card">
          <label className="form-stack" htmlFor="track-order">
            <span className="field-label">Order number</span>
            <input
              className="luxury-input"
              id="track-order"
              value={search}
              onChange={(event) => {
                const nextValue = event.target.value;
                setSearch(nextValue);

                if (!nextValue.trim()) {
                  setMatch(null);
                  setLoadError("");
                }
              }}
            />
          </label>
          <p className="field-help">
            Try the sample order <button className="text-button" onClick={() => setSearch("VDY24041801")} type="button">VDY24041801</button>
          </p>
        </div>

        {isLoading ? (
          <div className="content-card empty-state-stack">
            <p className="empty-state">Loading tracking updates…</p>
          </div>
        ) : !match ? (
          <div className="content-card empty-state-stack">
            <p className="empty-state">{loadError || "No order matched that reference."}</p>
          </div>
        ) : (
          <article className="content-card stack-lg">
            <div className="order-card-head">
              <div>
                <p className="product-badge">{match.orderStatus}</p>
                <h2 className="section-title font-display">{match.orderNumber}</h2>
                <p className="field-help">{match.customerName}</p>
              </div>
              <Link className="secondary-button" href={`/account/orders/${match.orderNumber}`}>
                Open full order detail
              </Link>
            </div>

            {match.shipments.map((shipment) => (
              <div className="timeline-card" key={shipment.id}>
                <strong>{shipment.label}</strong>
                <p className="field-help">
                  {shipment.carrier} • {shipment.trackingNumber} • {shipment.status}
                </p>
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
        )}
      </section>
    </SiteShell>
  );
}
