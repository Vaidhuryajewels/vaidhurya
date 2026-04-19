import { NextResponse } from "next/server.js";
import { calculateCartTotals, type CartItem } from "../../../../lib/commerce-data.ts";

export async function POST(request: Request) {
  const body = (await request.json()) as { items?: CartItem[] };
  const items = body.items ?? [];
  const totals = calculateCartTotals(items);

  return NextResponse.json({
    lock: {
      snapshotVersion: totals.snapshotVersion,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      grandTotal: totals.grandTotal,
      lineCount: totals.lines.length,
    },
  });
}
