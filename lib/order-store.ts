import {
  createOrderFromCart,
  getOrderByNumber as getSeededOrderByNumber,
  sampleOrders,
  type CartItem,
  type CheckoutInput,
  type StoredOrder,
} from "./commerce-data.ts";

declare global {
  var __vaidhuryaTransientOrders: StoredOrder[] | undefined;
}

const transientOrders = globalThis.__vaidhuryaTransientOrders ?? [];
globalThis.__vaidhuryaTransientOrders = transientOrders;

export function listOrders() {
  return [...transientOrders, ...sampleOrders];
}

export function getOrderByNumber(orderNumber: string) {
  return transientOrders.find((order) => order.orderNumber === orderNumber)
    ?? getSeededOrderByNumber(orderNumber);
}

export function createStoredOrder(items: CartItem[], checkoutInput: CheckoutInput) {
  const created = createOrderFromCart(items, checkoutInput);

  if (!created) {
    return null;
  }

  transientOrders.unshift(created);

  return created;
}

export function resetOrderStore() {
  transientOrders.length = 0;
}
