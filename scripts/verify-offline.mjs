import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const fileUrl = pathToFileURL(path.resolve("portfolio-offline.html")).href;
console.log("Opening:", fileUrl);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const consoleErrors = [];
const pageErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => {
  pageErrors.push(String(err));
});

await page.goto(fileUrl, { waitUntil: "load" });
await page.waitForTimeout(1000);
console.log("Initial Console Errors:", consoleErrors);
console.log("Initial Page Errors:", pageErrors);

// 1. Check images loaded
const imgStats = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll("img"));
  const broken = imgs
    .filter((i) => !i.complete || i.naturalWidth === 0)
    .map((i) => i.alt || i.src.slice(0, 60));
  return { total: imgs.length, broken };
});
console.log("Images:", imgStats);

// 2. Test 3D Rocker Switch via its visible label
const switchLabel = page.locator("label.uiv-rocker-switch");
const switchCb = page.locator("input.uiv-rocker-cb");
await switchLabel.click();
await page.waitForTimeout(400);
const isChecked = await switchCb.isChecked();
console.log("Rocker switch checked:", isChecked);

// 3. Test Md, IA, Pq, Ed, Sw buttons
for (const code of ["Md", "IA", "Pq", "Ed", "Sw"]) {
  const btn = page.locator(`#atuacao button:has-text("${code}")`);
  await btn.click();
  await page.waitForTimeout(150);
  const pressed = await btn.getAttribute("aria-pressed");
  console.log(`Axis ${code} aria-pressed:`, pressed);
}

// 4. Test STAR Modal open & close
const starBtn = page.locator('button:has-text("ver método STAR")').first();
await starBtn.click();
await page.waitForTimeout(350);
const dialogVisible = await page.locator('[role="dialog"]').isVisible();
const modalTitle = dialogVisible
  ? await page.locator("#modal-star-titulo").textContent()
  : null;
console.log("STAR Modal visible:", dialogVisible, "Title:", modalTitle);

let dialogAfterClose = false;
if (dialogVisible) {
  const closeBtn = page.locator(
    '[role="dialog"] button[aria-label="Fechar detalhes do projeto"]',
  );
  await closeBtn.click();
  await page.waitForTimeout(350);
  dialogAfterClose = await page.locator('[role="dialog"]').isVisible();
}
console.log("STAR Modal after close:", dialogAfterClose);

console.log("Console Errors:", consoleErrors);
console.log("Page Errors:", pageErrors);

await browser.close();
if (
  consoleErrors.length > 0 ||
  pageErrors.length > 0 ||
  !dialogVisible ||
  dialogAfterClose
) {
  process.exit(1);
}
