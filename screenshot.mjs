import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOT_DIR = path.join(ROOT, "temporary screenshots");

if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR);

const url = process.argv[2] || "http://localhost:3001";
const label = process.argv[3] || "";

const existing = fs.readdirSync(SCREENSHOT_DIR).filter(f => f.endsWith(".png"));
const next = existing.length + 1;
const filename = label
  ? `screenshot-${next}-${label}.png`
  : `screenshot-${next}.png`;
const outPath = path.join(SCREENSHOT_DIR, filename);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle2" });

// Force all scroll-reveal elements visible (IntersectionObserver doesn't fire reliably in headless)
await page.evaluate(() => {
  document.querySelectorAll('.reveal, .fade-in').forEach(el => {
    el.classList.add('show', 'visible');
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
});
await new Promise(r => setTimeout(r, 200));

await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Saved: temporary screenshots/${filename}`);
