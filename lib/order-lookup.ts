import type { StoredOrder } from "./commerce-data";

type OrderResponse = {
  order: StoredOrder;
};

export async function fetchOrderByNumber(
  orderNumber: string,
  fetchImpl: typeof fetch = fetch,
) {
  const response = await fetchImpl(`/api/orders/${orderNumber}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to load the requested order.");
  }

  const body = (await response.json()) as OrderResponse;

  return body.order;
}

export async function fetchTrackedOrder(
  orderNumber: string,
  fetchImpl: typeof fetch = fetch,
) {
  const response = await fetchImpl(`/api/tracking/${orderNumber}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to load tracking for the requested order.");
  }

  const body = (await response.json()) as OrderResponse;

  return body.order;
}
