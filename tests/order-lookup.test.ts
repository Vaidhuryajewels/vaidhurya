import assert from "node:assert/strict";
import test from "node:test";
import { fetchOrderByNumber, fetchTrackedOrder } from "../lib/order-lookup.ts";

const sampleOrder = {
  orderNumber: "VDY24050001",
  customerName: "Lookup Buyer",
  customerEmail: "lookup@example.com",
  placedAt: "2026-04-19T04:00:00.000Z",
  snapshotVersion: "APR-18-2026",
  priceLockedAt: "2026-04-19T04:00:00.000Z",
  priceLockExpiresAt: "2026-04-19T04:15:00.000Z",
  paymentStatus: "Authorized",
  orderStatus: "Confirmed",
  total: 12000,
  lines: [],
  shipments: [],
  addressSummary: "22 Temple Road",
  cardLast4: "1111",
};

test("order lookup helper returns parsed order payloads", async () => {
  const order = await fetchOrderByNumber(
    "VDY24050001",
    (async () =>
      new Response(JSON.stringify({ order: sampleOrder }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })) as typeof fetch,
  );
  const trackedOrder = await fetchTrackedOrder(
    "VDY24050001",
    (async () =>
      new Response(JSON.stringify({ order: sampleOrder }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })) as typeof fetch,
  );

  assert.equal(order?.customerEmail, "lookup@example.com");
  assert.equal(trackedOrder?.orderNumber, "VDY24050001");
});

test("order lookup helper returns null for 404 results", async () => {
  const order = await fetchOrderByNumber(
    "UNKNOWN",
    (async () => new Response(null, { status: 404 })) as typeof fetch,
  );
  const trackedOrder = await fetchTrackedOrder(
    "UNKNOWN",
    (async () => new Response(null, { status: 404 })) as typeof fetch,
  );

  assert.equal(order, null);
  assert.equal(trackedOrder, null);
});
