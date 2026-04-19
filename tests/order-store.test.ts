import assert from "node:assert/strict";
import test from "node:test";
import {
  createStoredOrder,
  getOrderByNumber,
  listOrders,
  resetOrderStore,
} from "../lib/order-store.ts";

test.beforeEach(() => {
  resetOrderStore();
});

test("order store creates and resolves a transient order", () => {
  const created = createStoredOrder(
    [{ variantId: "v-cuff-petite", quantity: 1, giftWrap: false }],
    {
      customerName: "Server Buyer",
      customerEmail: "server@example.com",
      addressLine: "5 Mint Street",
      city: "Chennai",
      state: "Tamil Nadu",
      postalCode: "600001",
      cardholderName: "Server Buyer",
      cardNumber: "4111111111111881",
    },
  );

  assert.ok(created);
  assert.equal(getOrderByNumber(created.orderNumber)?.customerEmail, "server@example.com");
  assert.equal(listOrders()[0]?.orderNumber, created.orderNumber);
});

test("order store falls back to seeded sample orders and can reset transient data", () => {
  const seeded = getOrderByNumber("VDY24041801");

  assert.ok(seeded);

  createStoredOrder(
    [{ variantId: "v-cuff-petite", quantity: 1, giftWrap: false }],
    {
      customerName: "Reset Buyer",
      customerEmail: "reset@example.com",
      addressLine: "5 Mint Street",
      city: "Chennai",
      state: "Tamil Nadu",
      postalCode: "600001",
      cardholderName: "Reset Buyer",
      cardNumber: "4111111111111881",
    },
  );
  resetOrderStore();

  assert.equal(listOrders().some((order) => order.customerEmail === "reset@example.com"), false);
  assert.ok(getOrderByNumber("VDY24041801"));
});
