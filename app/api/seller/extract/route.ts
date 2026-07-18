import { NextResponse } from "next/server.js";
import { deriveListingFromDescription, listingSchema } from "../../../../lib/seller-schema.ts";

const responseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" }, category: { type: "string" }, jewelryType: { type: "string" },
    metal: { type: "string", enum: ["silver", "gold", "platinum", "mixed", "unknown"] },
    purity: { type: "string" }, certification: { type: "string" },
    grossWeightGrams: { type: ["number", "null"] }, netWeightGrams: { type: ["number", "null"] },
    stones: { type: "string" }, finish: { type: "string" }, price: { type: ["number", "null"] },
    currency: { type: "string" }, inventory: { type: ["integer", "null"] }, sku: { type: "string" },
    description: { type: "string" }, confidence: { type: "number" },
    missingFields: { type: "array", items: { type: "string" } }, warnings: { type: "array", items: { type: "string" } },
  },
  required: ["title", "category", "jewelryType", "metal", "purity", "certification", "grossWeightGrams", "netWeightGrams", "stones", "finish", "price", "currency", "inventory", "sku", "description", "confidence", "missingFields", "warnings"],
};

export async function POST(request: Request) {
  let input: { description?: string };
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const description = input.description?.trim();
  if (!description) return NextResponse.json({ error: "Description is required" }, { status: 400 });

  const fallback = deriveListingFromDescription(description);
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return NextResponse.json({ listing: fallback, source: "local", notice: "AI is unavailable; review the extracted fields manually." });

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: AbortSignal.timeout(30_000),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://www.vaidhurya.com/",
        "X-OpenRouter-Title": "VAIDHURYA Seller",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [
          { role: "system", content: "Extract jewelry listing facts. Never invent price, purity, weight, certification, or inventory. Use empty strings/nulls for unknown values and list every required unknown in missingFields. Flag contradictions in warnings." },
          { role: "user", content: description },
        ],
        response_format: { type: "json_schema", json_schema: { name: "vaidhurya_listing", strict: true, schema: responseSchema } },
        provider: { require_parameters: true },
        temperature: 0.1,
      }),
    });
    if (!response.ok) throw new Error(`OpenRouter returned ${response.status}`);
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }>; model?: string; id?: string };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("OpenRouter returned no structured content");
    const parsed = listingSchema.parse(JSON.parse(content));
    return NextResponse.json({ listing: parsed, source: "openrouter", model: payload.model, requestId: payload.id });
  } catch {
    return NextResponse.json({ listing: fallback, source: "local", notice: "AI could not finish. Your draft is safe; review the fields manually." });
  }
}
