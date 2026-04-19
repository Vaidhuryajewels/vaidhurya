import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";
import test from "node:test";
import { chromium } from "playwright";

const port = 3101;
const baseUrl = `http://127.0.0.1:${port}`;
const workspace = "/Users/dpvenkatesh/Desktop/vaidhurya";

async function waitForServer(url: string, getOutput: () => string, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(2_000),
      });

      if (response.ok) {
        return;
      }
    } catch {
      // Poll until the dev server is available.
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  throw new Error(`Timed out waiting for Next dev server.\n${getOutput()}`);
}

test("guest shopper can lock price and complete checkout", { timeout: 120_000 }, async () => {
  let serverOutput = "";
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null;
  const server = spawn(
    "/Applications/Codex.app/Contents/Resources/node",
    [
      path.join("node_modules", "next", "dist", "bin", "next"),
      "dev",
      "--webpack",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    {
      cwd: workspace,
      env: {
        ...process.env,
        CI: "1",
        NEXT_TEST_WASM_DIR: path.join(
          workspace,
          "node_modules",
          "@next",
          "swc-wasm-nodejs",
        ),
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  server.stdout?.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });
  server.stderr?.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });

  try {
    await waitForServer(baseUrl, () => serverOutput);

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(`${baseUrl}/products/chandraharam-mangalasutra`);
    await page.getByText("Price lock and payment", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Add to cart" }).click();
    await page.getByText(/Added to cart\. Price will lock at checkout\./i).waitFor();

    await page.goto(`${baseUrl}/cart`);
    await page.getByRole("link", { name: "Proceed to checkout" }).waitFor();
    await page.getByRole("link", { name: "Proceed to checkout" }).click();
    await page.getByText("Secure card payment and price lock").waitFor();

    await page.getByLabel("Customer name").fill("E2E Buyer");
    await page.getByLabel("Email").fill("e2e@example.com");
    await page.getByLabel("Address").fill("22 Temple Road");
    await page.getByLabel("City").fill("Chennai");
    await page.getByLabel("State").fill("Tamil Nadu");
    await page.getByLabel("Postal code").fill("600001");
    await page.getByLabel("Cardholder name").fill("E2E Buyer");
    await page.getByLabel("Card number").fill("4111111111111111");

    await page.getByRole("button", { name: /Lock today/i }).click();
    await page.getByText(/Price lock created using snapshot/i).waitFor();

    await page.getByRole("button", { name: "Confirm payment and create order" }).click();
    await page.waitForURL(/\/checkout\/confirmation\/VDY\d+/);

    await page.getByText("Order summary").waitFor();
    assert.match(page.url(), /\/checkout\/confirmation\/VDY\d+/);
    assert.equal(await page.getByText("Card ending 1111").isVisible(), true);
    assert.equal(await page.getByText("Shipment tracking", { exact: true }).isVisible(), true);

    const orderNumber = page.url().split("/").pop();
    assert.ok(orderNumber);

    await page.goto(`${baseUrl}/track?order=${orderNumber}`);
    await page.getByText(orderNumber, { exact: true }).waitFor();
    assert.equal(await page.getByText("Track an order or shipment").isVisible(), true);
  } finally {
    await browser?.close();
    server.kill("SIGTERM");
    await once(server, "exit");
  }
});
