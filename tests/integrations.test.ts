import assert from "node:assert/strict";
import test from "node:test";
import {
  cmsService,
  notificationGateway,
  paymentGateway,
  pricingRateProvider,
  shippingGateway,
} from "../lib/integrations.ts";

test("pricingRateProvider returns a valid stored snapshot shape", async () => {
  const snapshot = await pricingRateProvider.fetchLatestRates();
  const validation = await pricingRateProvider.validateSnapshot(snapshot);
  const freshness = await pricingRateProvider.markSnapshotFreshness(
    snapshot.version,
    snapshot.freshness,
  );

  assert.equal(validation.valid, true);
  assert.equal(freshness.version, snapshot.version);
  assert.equal(snapshot.source, "VAIDHURYA pricing simulator");
});

test("payment and shipping gateways expose provider-ready mock seams", async () => {
  const paymentAttempt = await paymentGateway.createPaymentAttempt({
    items: [{ variantId: "v-cuff-petite", quantity: 1, giftWrap: false }],
    amount: 5500,
    email: "shopper@example.com",
  });
  const confirmation = await paymentGateway.confirmPaymentAttempt(paymentAttempt.id);
  const refund = await paymentGateway.refundPayment({
    orderNumber: "VDY24041801",
    amount: 1200,
  });
  const link = await paymentGateway.createQuotePaymentLink({
    quoteId: "QUOTE-101",
    amount: 18000,
  });
  const tracking = await shippingGateway.syncTracking(["BD94828114"]);
  const message = await notificationGateway.sendOrderConfirmation("VDY24041801");

  assert.equal(paymentAttempt.status, "requires_confirmation");
  assert.equal(confirmation.status, "authorized");
  assert.equal(refund.status, "queued");
  assert.match(link.paymentUrl, /QUOTE-101/);
  assert.equal(tracking.status, "synced");
  assert.equal(message.delivered, true);
});

test("cmsService can resolve published and previewable sections", async () => {
  const published = await cmsService.getPublishedSection("Homepage hero", "bridal");
  const preview = await cmsService.previewDraftSection("cms-everyday-editorial");
  const publish = await cmsService.publishSection("cms-gifting-copy", "admin-1");

  assert.equal(published?.status, "Published");
  assert.equal(preview?.status, "Draft");
  assert.equal(publish.published, true);
});
