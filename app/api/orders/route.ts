import { NextResponse } from "next/server.js";
import {
  type CartItem,
  type CheckoutInput,
} from "../../../lib/commerce-data.ts";
import { createStoredOrder, listOrders } from "../../../lib/order-store.ts";

export function GET() {
  return NextResponse.json({ orders: listOrders() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    items?: CartItem[];
    checkoutInput?: CheckoutInput;
  };

  const items = body.items ?? [];
  const checkoutInput = body.checkoutInput;

  if (!checkoutInput) {
    return NextResponse.json(
      { error: "Checkout input is required." },
      { status: 400 },
    );
  }

  const createdOrder = createStoredOrder(items, checkoutInput);

  if (!createdOrder) {
    return NextResponse.json(
      { error: "A valid cart is required before order creation." },
      { status: 422 },
    );
  }

  return NextResponse.json({ order: createdOrder }, { status: 201 });
}
