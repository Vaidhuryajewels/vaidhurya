import assert from "node:assert/strict";
import test from "node:test";
import { GET as getAdminDashboard } from "../app/api/admin/dashboard/route.ts";
import {
  GET as getBespokeServices,
  POST as createBespokeRequest,
} from "../app/api/bespoke/route.ts";
import { GET as getCollections } from "../app/api/catalog/collections/route.ts";
import { GET as getProductByRoute } from "../app/api/catalog/products/[slug]/route.ts";
import { GET as getCmsSections } from "../app/api/cms/sections/route.ts";
import { POST as createCheckoutLock } from "../app/api/checkout/lock/route.ts";
import { GET as getOrders, POST as createOrder } from "../app/api/orders/route.ts";
import {
  GET as getOrderByRoute,
} from "../app/api/orders/[orderNumber]/route.ts";
import { GET as getRates } from "../app/api/rates/latest/route.ts";
import { GET as getTrackingByOrder } from "../app/api/tracking/[orderNumber]/route.ts";
import { resetOrderStore } from "../lib/order-store.ts";

test.beforeEach(() => {
  resetOrderStore();
});

test("checkout lock route returns a snapshot-backed lock response", async () => {
  const request = new Request("http://localhost/api/checkout/lock", {
    method: "POST",
    body: JSON.stringify({
      items: [{ variantId: "v-chandra-heirloom", quantity: 1, giftWrap: true }],
    }),
    headers: { "content-type": "application/json" },
  });

  const response = await createCheckoutLock(request);
  const body = (await response.json()) as {
    lock: { lineCount: number; grandTotal: number; snapshotVersion: string };
  };

  assert.equal(response.status, 200);
  assert.equal(body.lock.lineCount, 1);
  assert.ok(body.lock.grandTotal > 0);
  assert.match(body.lock.snapshotVersion, /APR-18-2026/);
});

test("order route resolves a seeded order payload", async () => {
  const response = await getOrderByRoute(new Request("http://localhost/api/orders/VDY24041801"), {
    params: Promise.resolve({ orderNumber: "VDY24041801" }),
  });
  const body = (await response.json()) as {
    order: { orderNumber: string; shipments: unknown[] };
  };

  assert.equal(response.status, 200);
  assert.equal(body.order.orderNumber, "VDY24041801");
  assert.ok(body.order.shipments.length >= 1);
});

test("catalog collection and product routes expose storefront browsing data", async () => {
  const collectionsResponse = await getCollections();
  const collectionsBody = (await collectionsResponse.json()) as {
    collections: Array<{ slug: string }>;
  };
  const productResponse = await getProductByRoute(
    new Request("http://localhost/api/catalog/products/chandraharam-mangalasutra"),
    {
      params: Promise.resolve({ slug: "chandraharam-mangalasutra" }),
    },
  );
  const productBody = (await productResponse.json()) as {
    product: { slug: string; variants: unknown[] };
  };

  assert.equal(collectionsResponse.status, 200);
  assert.ok(collectionsBody.collections.some((entry) => entry.slug === "brides-collection"));
  assert.equal(productResponse.status, 200);
  assert.equal(productBody.product.slug, "chandraharam-mangalasutra");
  assert.ok(productBody.product.variants.length >= 1);
});

test("product and tracking routes return 404 for missing entities", async () => {
  const missingProduct = await getProductByRoute(
    new Request("http://localhost/api/catalog/products/missing-piece"),
    {
      params: Promise.resolve({ slug: "missing-piece" }),
    },
  );
  const missingTracking = await getTrackingByOrder(
    new Request("http://localhost/api/tracking/UNKNOWN"),
    {
      params: Promise.resolve({ orderNumber: "UNKNOWN" }),
    },
  );

  assert.equal(missingProduct.status, 404);
  assert.equal(missingTracking.status, 404);
});

test("rates, tracking, and orders routes expose commerce operations data", async () => {
  const ratesResponse = await getRates();
  const trackingResponse = await getTrackingByOrder(
    new Request("http://localhost/api/tracking/VDY24041801"),
    {
      params: Promise.resolve({ orderNumber: "VDY24041801" }),
    },
  );
  const ordersResponse = await getOrders();

  const ratesBody = (await ratesResponse.json()) as {
    rates: { version: string; silverRatePerGram: number };
  };
  const trackingBody = (await trackingResponse.json()) as {
    order: { orderNumber: string; shipments: unknown[] };
  };
  const ordersBody = (await ordersResponse.json()) as {
    orders: Array<{ orderNumber: string }>;
  };

  assert.equal(ratesResponse.status, 200);
  assert.match(ratesBody.rates.version, /APR-18-2026/);
  assert.ok(ratesBody.rates.silverRatePerGram > 0);
  assert.equal(trackingResponse.status, 200);
  assert.equal(trackingBody.order.orderNumber, "VDY24041801");
  assert.ok(trackingBody.order.shipments.length >= 1);
  assert.equal(ordersResponse.status, 200);
  assert.ok(ordersBody.orders.some((order) => order.orderNumber === "VDY24041801"));
});

test("orders route creates an order and makes it readable by order and tracking lookups", async () => {
  const request = new Request("http://localhost/api/orders", {
    method: "POST",
    body: JSON.stringify({
      items: [{ variantId: "v-cuff-petite", quantity: 1, giftWrap: false }],
      checkoutInput: {
        customerName: "API Buyer",
        customerEmail: "api@example.com",
        addressLine: "22 Temple Road",
        city: "Chennai",
        state: "Tamil Nadu",
        postalCode: "600001",
        cardholderName: "API Buyer",
        cardNumber: "4111111111111111",
      },
    }),
    headers: { "content-type": "application/json" },
  });

  const createResponse = await createOrder(request);
  const createBody = (await createResponse.json()) as {
    order: { orderNumber: string; customerEmail: string };
  };
  const orderResponse = await getOrderByRoute(
    new Request(`http://localhost/api/orders/${createBody.order.orderNumber}`),
    {
      params: Promise.resolve({ orderNumber: createBody.order.orderNumber }),
    },
  );
  const trackingResponse = await getTrackingByOrder(
    new Request(`http://localhost/api/tracking/${createBody.order.orderNumber}`),
    {
      params: Promise.resolve({ orderNumber: createBody.order.orderNumber }),
    },
  );
  const ordersResponse = await getOrders();

  const orderBody = (await orderResponse.json()) as {
    order: { orderNumber: string; customerEmail: string };
  };
  const trackingBody = (await trackingResponse.json()) as {
    order: { orderNumber: string };
  };
  const ordersBody = (await ordersResponse.json()) as {
    orders: Array<{ orderNumber: string }>;
  };

  assert.equal(createResponse.status, 201);
  assert.equal(createBody.order.customerEmail, "api@example.com");
  assert.equal(orderResponse.status, 200);
  assert.equal(orderBody.order.orderNumber, createBody.order.orderNumber);
  assert.equal(trackingResponse.status, 200);
  assert.equal(trackingBody.order.orderNumber, createBody.order.orderNumber);
  assert.ok(ordersBody.orders.some((order) => order.orderNumber === createBody.order.orderNumber));
});

test("orders route validates missing checkout input", async () => {
  const response = await createOrder(
    new Request("http://localhost/api/orders", {
      method: "POST",
      body: JSON.stringify({ items: [] }),
      headers: { "content-type": "application/json" },
    }),
  );
  const body = (await response.json()) as { error: string };

  assert.equal(response.status, 400);
  assert.match(body.error, /Checkout input is required/);
});

test("bespoke route returns an accepted request and quote payment link", async () => {
  const request = new Request("http://localhost/api/bespoke", {
    method: "POST",
    body: JSON.stringify({
      customerName: "Meera",
      occasion: "Wedding gifting capsule",
    }),
    headers: { "content-type": "application/json" },
  });

  const response = await createBespokeRequest(request);
  const body = (await response.json()) as {
    requestAccepted: boolean;
    quoteId: string;
    paymentLink: { paymentUrl: string };
  };

  assert.equal(response.status, 200);
  assert.equal(body.requestAccepted, true);
  assert.match(body.quoteId, /QUOTE-/);
  assert.match(body.paymentLink.paymentUrl, /pay\.vaidhurya\.example/);
});

test("bespoke services, admin dashboard, and cms routes expose operating surfaces", async () => {
  const bespokeResponse = await getBespokeServices();
  const adminResponse = await getAdminDashboard();
  const cmsResponse = await getCmsSections();

  const bespokeBody = (await bespokeResponse.json()) as {
    services: Array<{ title: string }>;
  };
  const adminBody = (await adminResponse.json()) as {
    modules: Array<{ title: string }>;
    integrations: Array<{ title: string }>;
    snapshot: {
      metrics: Array<{ label: string }>;
      cmsSections: Array<{ id: string }>;
    };
  };
  const cmsBody = (await cmsResponse.json()) as {
    sections: Array<{ status: string }>;
  };

  assert.equal(bespokeResponse.status, 200);
  assert.ok(bespokeBody.services.length >= 1);
  assert.equal(adminResponse.status, 200);
  assert.ok(adminBody.modules.length >= 1);
  assert.ok(adminBody.integrations.length >= 1);
  assert.ok(adminBody.snapshot.metrics.length >= 1);
  assert.ok(adminBody.snapshot.cmsSections.length >= 1);
  assert.equal(cmsResponse.status, 200);
  assert.ok(cmsBody.sections.some((section) => section.status === "Published"));
});
