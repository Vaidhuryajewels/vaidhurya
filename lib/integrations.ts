import {
  adminMetrics,
  cmsSections,
  getOrderByNumber,
  metalRates,
  sampleOrders,
  type CartItem,
} from "./commerce-data.ts";

export type RateSnapshot = {
  version: string;
  silverRatePerGram: number;
  goldCoatingRatePerGram: number;
  source: string;
  freshness: "fresh" | "stale";
};

export type PaymentAttemptResult = {
  id: string;
  provider: string;
  status: "requires_confirmation" | "authorized" | "failed";
  amount: number;
  idempotencyKey: string;
};

export type TrackingSyncResult = {
  shipmentCount: number;
  status: "synced" | "queued";
  lastSyncAt: string;
};

export type QuotePaymentLinkResult = {
  quoteId: string;
  paymentUrl: string;
  expiresAt: string;
};

export type PricingRateProvider = {
  fetchLatestRates: () => Promise<RateSnapshot>;
  validateSnapshot: (snapshot: RateSnapshot) => Promise<{ valid: boolean }>;
  storeSnapshot: (snapshot: RateSnapshot) => Promise<{ stored: boolean }>;
  markSnapshotFreshness: (
    version: string,
    freshness: RateSnapshot["freshness"],
  ) => Promise<{ version: string; freshness: RateSnapshot["freshness"] }>;
};

export type PaymentGateway = {
  createPaymentAttempt: (payload: {
    items: CartItem[];
    amount: number;
    email: string;
  }) => Promise<PaymentAttemptResult>;
  confirmPaymentAttempt: (
    attemptReference: string,
  ) => Promise<{ id: string; status: "authorized" | "failed" }>;
  reconcileWebhook: (eventPayload: unknown) => Promise<{ reconciled: boolean }>;
  refundPayment: (refundRequest: {
    orderNumber: string;
    amount: number;
  }) => Promise<{ status: "queued" | "processed" }>;
  createQuotePaymentLink: (quoteContext: {
    quoteId: string;
    amount: number;
  }) => Promise<QuotePaymentLinkResult>;
};

export type ShippingGateway = {
  createShipment: (shipmentRequest: { orderNumber: string }) => Promise<{
    created: boolean;
    shipmentCount: number;
  }>;
  cancelShipment: (shipmentReference: string) => Promise<{ canceled: boolean }>;
  syncTracking: (trackingNumbers: string[]) => Promise<TrackingSyncResult>;
  normalizeTrackingEvent: (
    providerEvent: Record<string, unknown>,
  ) => Promise<{ normalized: boolean; receivedAt: string }>;
};

export type NotificationGateway = {
  sendOrderConfirmation: (orderNumber: string) => Promise<{ delivered: boolean }>;
  sendShipmentUpdate: (orderNumber: string) => Promise<{ delivered: boolean }>;
  sendQuoteIssued: (quoteId: string) => Promise<{ delivered: boolean }>;
  sendRefundUpdate: (orderNumber: string) => Promise<{ delivered: boolean }>;
  sendFailureAlert: (message: string) => Promise<{ queued: boolean }>;
};

export type CMSService = {
  getPublishedSection: (
    placement: string,
    theme: string,
  ) => Promise<(typeof cmsSections)[number] | undefined>;
  previewDraftSection: (
    sectionId: string,
  ) => Promise<(typeof cmsSections)[number] | undefined>;
  publishSection: (
    sectionId: string,
    actorId: string,
  ) => Promise<{ published: boolean; actorId: string }>;
};

export const pricingRateProvider: PricingRateProvider = {
  async fetchLatestRates() {
    return {
      ...metalRates,
      source: "VAIDHURYA pricing simulator",
      freshness: "fresh",
    };
  },
  async validateSnapshot(snapshot) {
    return { valid: Boolean(snapshot.version) && snapshot.silverRatePerGram > 0 };
  },
  async storeSnapshot() {
    return { stored: true };
  },
  async markSnapshotFreshness(version, freshness) {
    return { version, freshness };
  },
};

export const paymentGateway: PaymentGateway = {
  async createPaymentAttempt(payload) {
    return {
      id: `pay_${Date.now()}`,
      provider: "card-gateway-stub",
      status: "requires_confirmation",
      amount: payload.amount,
      idempotencyKey: `idem_${payload.email}_${payload.amount}`,
    };
  },
  async confirmPaymentAttempt(attemptReference) {
    return { id: attemptReference, status: "authorized" };
  },
  async reconcileWebhook() {
    return { reconciled: true };
  },
  async refundPayment() {
    return { status: "queued" };
  },
  async createQuotePaymentLink(quoteContext) {
    return {
      quoteId: quoteContext.quoteId,
      paymentUrl: `https://pay.vaidhurya.example/quote/${quoteContext.quoteId}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  },
};

export const shippingGateway: ShippingGateway = {
  async createShipment(shipmentRequest) {
    const order = getOrderByNumber(shipmentRequest.orderNumber);
    return { created: true, shipmentCount: order?.shipments.length ?? 1 };
  },
  async cancelShipment() {
    return { canceled: true };
  },
  async syncTracking(trackingNumbers) {
    return {
      shipmentCount: trackingNumbers.length,
      status: "synced",
      lastSyncAt: new Date().toISOString(),
    };
  },
  async normalizeTrackingEvent() {
    return { normalized: true, receivedAt: new Date().toISOString() };
  },
};

export const notificationGateway: NotificationGateway = {
  async sendOrderConfirmation() {
    return { delivered: true };
  },
  async sendShipmentUpdate() {
    return { delivered: true };
  },
  async sendQuoteIssued() {
    return { delivered: true };
  },
  async sendRefundUpdate() {
    return { delivered: true };
  },
  async sendFailureAlert() {
    return { queued: true };
  },
};

export const cmsService: CMSService = {
  async getPublishedSection(placement, theme) {
    return cmsSections.find(
      (section) =>
        section.placement === placement &&
        section.status === "Published" &&
        (section.theme === theme || section.theme === "global"),
    );
  },
  async previewDraftSection(sectionId) {
    return cmsSections.find((section) => section.id === sectionId);
  },
  async publishSection(_sectionId, actorId) {
    return { published: true, actorId };
  },
};

export function getOperationsSnapshot() {
  return {
    metrics: adminMetrics,
    orders: sampleOrders,
    cmsSections,
    rates: metalRates,
  };
}
