import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateCartTotals,
  createOrderFromCart,
  getOrderByNumber,
  getProductsBySlugs,
} from "../lib/commerce-data.ts";

test("calculateCartTotals computes browse totals and free shipping threshold", () => {
  const totals = calculateCartTotals([
    { variantId: "v-chandra-heirloom", quantity: 1, giftWrap: true },
    { variantId: "v-cuff-petite", quantity: 1, giftWrap: false },
  ]);

  assert.equal(totals.lines.length, 2);
  assert.equal(totals.totalQuantity, 2);
  assert.equal(totals.shippingEstimate, 0);
  assert.match(totals.snapshotVersion, /APR-18-2026/);
  assert.ok(totals.grandTotal > totals.subtotal - 1);
});

test("createOrderFromCart snapshots payment and shipment structure", () => {
  const order = createOrderFromCart(
    [{ variantId: "v-floral-daylight", quantity: 1, giftWrap: true }],
    {
      customerName: "Test Buyer",
      customerEmail: "test@example.com",
      addressLine: "22 Temple Road",
      city: "Chennai",
      state: "Tamil Nadu",
      postalCode: "600001",
      cardholderName: "Test Buyer",
      cardNumber: "4111111111111111",
    },
  );

  assert.ok(order);
  assert.equal(order?.cardLast4, "1111");
  assert.equal(order?.paymentStatus, "Authorized");
  assert.ok((order?.shipments.length ?? 0) >= 1);
  assert.equal(order?.lines[0]?.giftWrap, true);
});

test("product and order helpers resolve known entities safely", () => {
  const products = getProductsBySlugs([
    "chandraharam-mangalasutra",
    "does-not-exist",
    "celestial-cuff-bracelet",
  ]);

  assert.deepEqual(
    products.map((product) => product.slug),
    ["chandraharam-mangalasutra", "celestial-cuff-bracelet"],
  );

  const order = getOrderByNumber("VDY24041801");
  assert.ok(order);
  assert.equal(order?.customerName, "Ananya Rao");
});
