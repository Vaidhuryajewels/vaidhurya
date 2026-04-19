import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";
import test from "node:test";
import { chromium } from "playwright";

const port = 3106;
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

test("launch-day homepage spotlights the new editorial flow and routes into collections", { timeout: 120_000 }, async () => {
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

    await page.goto(baseUrl);
    await page.getByText("Launch day at VAIDHURYA", { exact: true }).waitFor();

    assert.equal(
      await page
        .getByText("Ceremonial signatures, silver gifting, and the first price-locked orders all begin here.", {
          exact: true,
        })
        .isVisible(),
      true,
    );
    assert.equal(await page.getByText("The first signatures to go live", { exact: true }).isVisible(), true);
    assert.equal(
      await page.getByRole("link", { name: /Bride's Collection/i }).first().isVisible(),
      true,
    );
    assert.equal(await page.getByText("Victorian Polki Set", { exact: true }).isVisible(), true);

    await page.getByRole("link", { name: "Shop the launch collection" }).click();
    await page.waitForURL(`${baseUrl}/collections/brides-collection`);
    await page.getByText("Shop by Category", { exact: true }).waitFor();
  } finally {
    await browser?.close();
    server.kill("SIGTERM");
    await once(server, "exit");
  }
});
