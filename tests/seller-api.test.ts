import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../app/api/seller/extract/route.ts";

test("seller extraction validates missing description", async () => {
  const response = await POST(new Request("http://localhost/api/seller/extract", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }));
  assert.equal(response.status, 400);
});

test("seller extraction returns safe local structured output without a key", async () => {
  const original = process.env.OPENROUTER_API_KEY; delete process.env.OPENROUTER_API_KEY;
  try {
    const response = await POST(new Request("http://localhost/api/seller/extract", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ description: "925 silver bracelet, 14 grams, ₹2,299" }) }));
    const body = await response.json() as { source: string; listing: { metal: string; price: number } };
    assert.equal(response.status, 200); assert.equal(body.source, "local"); assert.equal(body.listing.metal, "silver"); assert.equal(body.listing.price, 2299);
  } finally { if (original) process.env.OPENROUTER_API_KEY = original; }
});
