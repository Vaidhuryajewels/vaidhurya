import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";
import test from "node:test";
import { chromium } from "playwright";

const port = 3105;
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

test("poc route preserves the bridal page and restores the everyday switch", { timeout: 120_000 }, async () => {
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
    await page.getByText("VAIDHURYA", { exact: true }).waitFor();
    assert.equal(await page.locator("[data-poc-theme]").getAttribute("data-poc-theme"), "bridal");
    assert.equal(await page.getByText("Chandraharam Mangalasutra", { exact: true }).isVisible(), true);

    await page.goto(`${baseUrl}/poc`);
    await page.getByText("VAIDHURYA", { exact: true }).waitFor();

    assert.equal(await page.getByText("Where to Deliver?", { exact: true }).first().isVisible(), true);
    assert.equal(await page.getByText("ACCOUNT", { exact: true }).first().isVisible(), true);
    const visibleActionIconCount = await page.locator("[data-poc-action-icon]").evaluateAll((nodes) => {
      return nodes.filter((node) => {
        const element = node as HTMLElement;
        const styles = window.getComputedStyle(element);
        return styles.visibility !== "hidden" && styles.display !== "none" && element.getClientRects().length > 0;
      }).length;
    });
    assert.equal(visibleActionIconCount, 3);
    await page.getByText("APRIL 19, 2026", { exact: true }).waitFor();
    assert.equal(await page.getByText(/Shop by Category/i).isVisible(), true);
    assert.equal(await page.getByText(/Bride.?s Collection/i).first().isVisible(), true);
    const firstBridalCard = page.locator("#brides-collection article").first();
    const secondBridalCard = page.locator("#brides-collection article").nth(1);
    const thirdBridalCard = page.locator("#brides-collection article").nth(2);
    assert.equal(await firstBridalCard.getByText("23,793/-", { exact: true }).isVisible(), true);
    assert.equal(await firstBridalCard.getByText("inc GST", { exact: true }).count(), 0);
    assert.equal(await secondBridalCard.getByText("42,895/-", { exact: true }).isVisible(), true);
    assert.equal(await thirdBridalCard.getByText("17,069/-", { exact: true }).isVisible(), true);
    assert.equal(await page.getByRole("button", { name: "Add to Cart" }).count(), 0);
    const firstWhatsappLink = firstBridalCard.getByRole("link", { name: "Order now" });
    assert.equal(await firstWhatsappLink.isVisible(), true);
    const firstWhatsappHref = (await firstWhatsappLink.getAttribute("href")) ?? "";
    assert.match(firstWhatsappHref, /wa\.me\/917026651789/);
    assert.match(firstWhatsappHref, /Value%3A%2023%2C793%2F-/);
    assert.match(firstWhatsappHref, /%2Fpoc%23product-chandraharam/);
    const firstBridalCardWidth = await firstBridalCard.evaluate((element) => element.getBoundingClientRect().width);
    assert.equal(firstBridalCardWidth, 320);

    const bridalTab = page.getByRole("tab", { name: "Bridal" });
    const everydayTab = page.getByRole("tab", { name: "Everyday Elegance" });

    assert.equal(await bridalTab.getAttribute("aria-selected"), "true");
    assert.equal(await everydayTab.getAttribute("aria-selected"), "false");

    await everydayTab.click();
    await page.getByText("GRAND LAUNCH", { exact: true }).waitFor();
    await page.getByText("Nose Pin", { exact: true }).waitFor();
    const firstEverydayCard = page.locator('[data-poc-theme="everyday"] article').first();
    const secondEverydayCard = page.locator('[data-poc-theme="everyday"] article').nth(1);
    const thirdEverydayCard = page.locator('[data-poc-theme="everyday"] article').nth(2);
    const fourthEverydayCard = page.locator('[data-poc-theme="everyday"] article').nth(3);
    assert.equal(await firstEverydayCard.getByText("Nose Pin", { exact: true }).isVisible(), true);
    assert.equal(await firstEverydayCard.getByText("₹321", { exact: true }).isVisible(), true);
    assert.equal(await firstEverydayCard.getByText(/Wt:/i).count(), 0);
    await secondEverydayCard.hover();
    await page.waitForTimeout(250);
    const firstEverydayHoverStyle = await secondEverydayCard.locator("img").nth(1).evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        transform: styles.transform,
      };
    });
    assert.notEqual(firstEverydayHoverStyle.transform, "none");
    assert.equal(await secondEverydayCard.getByText("₹2,299", { exact: true }).isVisible(), true);
    assert.equal(await thirdEverydayCard.getByText("₹3,000", { exact: true }).isVisible(), true);
    assert.equal(await fourthEverydayCard.getByText("₹2,500", { exact: true }).isVisible(), true);
    assert.equal(await thirdEverydayCard.getByText("Sold Out", { exact: true }).isVisible(), true);
    assert.equal(await fourthEverydayCard.getByText("Sold Out", { exact: true }).isVisible(), true);
    assert.equal(await page.locator("[data-poc-theme]").getAttribute("data-poc-theme"), "everyday");
    const everydayHeaderBackground = await page.locator("header").evaluate((element) => {
      return window.getComputedStyle(element).backgroundImage;
    });
    assert.match(everydayHeaderBackground, /rgb\(0, 54, 58\)|rgb\(4, 37, 40\)/);
    assert.equal(await everydayTab.getAttribute("aria-selected"), "true");
    assert.equal(await bridalTab.getAttribute("aria-selected"), "false");
    assert.equal(await page.getByText(/Search "Silver Bracelets"/i).first().isVisible(), true);
    const searchIconNode = page.locator('[class*="searchCard"] svg').first();
    assert.equal(await searchIconNode.isVisible(), true);
    assert.equal(await page.getByText("AKSHAYA TRITIYA", { exact: true }).first().isVisible(), true);
    assert.equal(await page.getByText("GRAND LAUNCH", { exact: true }).first().isVisible(), true);
    assert.equal(await page.getByText("FAST DISPATCH", { exact: true }).count(), 0);
    assert.equal(await page.locator("[data-poc-category-carousel]").getByText("For Him", { exact: true }).isVisible(), true);
    assert.equal(await page.locator("[data-poc-category-carousel]").getByText("For Her", { exact: true }).isVisible(), true);

    await bridalTab.click();
    await page.getByText("APRIL 19, 2026", { exact: true }).waitFor();
    await page.getByText("Chandraharam Mangalasutra", { exact: true }).waitFor();
    assert.equal(await page.locator("[data-poc-theme]").getAttribute("data-poc-theme"), "bridal");
    assert.equal(await bridalTab.getAttribute("aria-selected"), "true");
    const victorianCard = page.locator("#victorian-jewellery article").first();
    assert.equal(await victorianCard.getByText("9,900/-", { exact: true }).isVisible(), true);
    assert.equal(await victorianCard.getByText("Wt: 18gms", { exact: true }).isVisible(), true);
    assert.equal(await victorianCard.getByText("inc GST", { exact: true }).count(), 0);
    const victorianCardWidth = await victorianCard.evaluate((element) => element.getBoundingClientRect().width);
    assert.equal(victorianCardWidth, 320);
    const victorianPriceTagStyle = await victorianCard.locator("a span").first().evaluate((element) => {
      const styles = window.getComputedStyle(element);
      return {
        borderColor: styles.borderTopColor,
      };
    });
    assert.equal(victorianPriceTagStyle.borderColor, "rgba(214, 184, 112, 0.9)");
    const victorianCardMedia = page.locator("#victorian-jewellery article").first();
    await victorianCardMedia.hover();
    await page.waitForTimeout(250);
    const victorianHoverStyle = await page.locator("#victorian-jewellery article img").nth(1).evaluate((element) => {
      const image = element as HTMLImageElement;
      const styles = window.getComputedStyle(image);
      return {
        objectPosition: image.style.objectPosition,
        transform: styles.transform,
      };
    });
    assert.equal(victorianHoverStyle.objectPosition, "center top");
    assert.notEqual(victorianHoverStyle.transform, "none");
  } finally {
    await browser?.close();
    server.kill("SIGTERM");
    await once(server, "exit");
  }
});

test("poc route moves utility cards into a burger menu on mobile", { timeout: 120_000 }, async () => {
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
    const page = await browser.newPage({
      viewport: {
        width: 430,
        height: 932,
      },
    });

    await page.goto(`${baseUrl}/poc`);
    await page.getByText("VAIDHURYA", { exact: true }).waitFor();

    const menuButton = page.getByRole("button", { name: /open menu/i });
    const mobileMenu = page.locator("[data-poc-mobile-menu]");

    assert.equal(await menuButton.isVisible(), true);
    assert.equal(await menuButton.getAttribute("aria-expanded"), "false");
    assert.equal(await mobileMenu.getAttribute("data-poc-mobile-menu"), "closed");

    await menuButton.click();
    await mobileMenu.getByText("Where to Deliver?", { exact: true }).waitFor();

    assert.equal(await page.getByRole("button", { name: /close menu/i }).getAttribute("aria-expanded"), "true");
    assert.equal(await mobileMenu.getAttribute("data-poc-mobile-menu"), "open");
    assert.equal(await mobileMenu.getByText("Select Delivery Location", { exact: true }).isVisible(), true);
    assert.equal(await mobileMenu.getByText("ACCOUNT", { exact: true }).isVisible(), true);

    const categoryCarousel = page.locator("[data-poc-category-carousel]");
    const carouselMetrics = await categoryCarousel.evaluate((element) => {
      const firstCard = element.firstElementChild as HTMLElement | null;
      return {
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        scrollLeft: element.scrollLeft,
        firstCardWidth: firstCard?.getBoundingClientRect().width ?? 0,
      };
    });
    assert.ok(carouselMetrics.scrollWidth > carouselMetrics.clientWidth);
    assert.equal(carouselMetrics.scrollLeft, 0);
    assert.ok(carouselMetrics.firstCardWidth < carouselMetrics.clientWidth * 0.4);

    const leftScrollButton = page.getByRole("button", { name: "Scroll categories left" });
    const rightScrollButton = page.getByRole("button", { name: "Scroll categories right" });

    assert.equal(await leftScrollButton.isVisible(), false);
    assert.equal(await rightScrollButton.isVisible(), true);

    await rightScrollButton.click();
    await page.waitForTimeout(250);

    const scrolledRight = await categoryCarousel.evaluate((element) => element.scrollLeft);
    assert.ok(scrolledRight > carouselMetrics.scrollLeft);
    assert.equal(await leftScrollButton.isVisible(), true);
    const scrollLeftAfterRight = await categoryCarousel.evaluate((element) => element.scrollLeft);
    await leftScrollButton.click();
    await page.waitForTimeout(250);

    const scrolledBackLeft = await categoryCarousel.evaluate((element) => element.scrollLeft);
    assert.ok(scrolledBackLeft < scrollLeftAfterRight);
  } finally {
    await browser?.close();
    server.kill("SIGTERM");
    await once(server, "exit");
  }
});
