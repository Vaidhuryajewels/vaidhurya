import { NextResponse } from "next/server.js";
import { getProductBySlug } from "../../../../../lib/commerce-data.ts";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ product });
}
