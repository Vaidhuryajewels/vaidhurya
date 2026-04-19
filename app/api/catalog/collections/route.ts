import { NextResponse } from "next/server.js";
import { collections } from "../../../../lib/commerce-data.ts";

export function GET() {
  return NextResponse.json({ collections });
}
