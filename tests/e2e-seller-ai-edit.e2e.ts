import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";
import test from "node:test";
import { chromium } from "playwright";

const port = 3112;
const baseUrl = `http://127.0.0.1:${port}`;
const workspace = "/Users/dpvenkatesh/Desktop/vaidhurya";

async function waitForServer() {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try { if ((await fetch(baseUrl)).ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error("Seller AI edit test server timed out");
}

test("seller can autofill an existing listing from natural language", { timeout: 120_000 }, async () => {
  const server = spawn("/Applications/Codex.app/Contents/Resources/cua_node/bin/node", [path.join("node_modules", "next", "dist", "bin", "next"), "dev", "--webpack", "--hostname", "127.0.0.1", "--port", String(port)], { cwd: workspace, env: { ...process.env, CI: "1", SELLER_DEMO_MODE: "1", OPENROUTER_API_KEY: "", NEXT_TEST_WASM_DIR: path.join(workspace, "node_modules", "@next", "swc-wasm-nodejs") }, stdio: "ignore" });
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null;
  try {
    await waitForServer();
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`${baseUrl}/seller/listings/chandraharam-mangalasutra?mode=edit`);
    await page.getByLabel("Description").fill("BIS certified 925 silver necklace, 82 grams, ₹23,793");
    await page.getByRole("button", { name: "Autofill form with AI" }).click();
    await page.getByRole("status").filter({ hasText: /AI is unavailable|autofilled the form/ }).waitFor();
    assert.equal(await page.getByLabel("Material").inputValue(), "925 silver");
    assert.equal(await page.getByLabel("Weight (g)").inputValue(), "82");
    assert.match(await page.getByLabel("Price").inputValue(), /23,793/);
  } finally {
    await browser?.close();
    if (server.exitCode === null) { server.kill("SIGTERM"); await once(server, "exit"); }
  }
});
