import { NextResponse } from "next/server.js";
import { metalRates } from "../../../../lib/commerce-data.ts";

export function GET() {
  return NextResponse.json({ rates: metalRates });
}
