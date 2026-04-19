import { NextResponse } from "next/server.js";
import { featuredBespokeServices } from "../../../lib/commerce-data.ts";
import { paymentGateway } from "../../../lib/integrations.ts";

export function GET() {
  return NextResponse.json({ services: featuredBespokeServices });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    customerName?: string;
    occasion?: string;
  };

  const quoteId = `QUOTE-${Date.now().toString().slice(-6)}`;
  const paymentLink = await paymentGateway.createQuotePaymentLink({
    quoteId,
    amount: 18000,
  });

  return NextResponse.json({
    requestAccepted: true,
    quoteId,
    customerName: body.customerName ?? "Guest customer",
    occasion: body.occasion ?? "Custom jewelry inquiry",
    paymentLink,
  });
}
