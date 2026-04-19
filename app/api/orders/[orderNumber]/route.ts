import { NextResponse } from "next/server.js";
import { getOrderByNumber } from "../../../../lib/order-store.ts";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  const { orderNumber } = await params;
  const order = getOrderByNumber(orderNumber);

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
