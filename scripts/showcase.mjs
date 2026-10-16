#!/usr/bin/env node
/**
 * Screenshots every site in data/showcase.ts into public/showcase/<slug>.jpg
 * (1440×900, top of the page). Tries to dismiss cookie banners first.
 *
 *   npm run showcase              # all sites
 *   npm run showcase -- teko      # one site
 */
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { launch } from "./browser.mjs";

const root = path.resolve(import.meta.dirname, "..");
const only = process.argv.slice(2);

// data/showcase.ts imports types only, so pull the entries out with a regex
// instead of compiling TypeScript.
const source = await readFile(path.join(root, "data/showcase.ts"), "utf8");
const entries = [...source.matchAll(/^\s*\{\s*\n\s*slug: "([^"]+)",\s*\n\s*name: "[^"]*",\s*\n\s*url: "([^"]+)"/gm)]
  .map(([, slug, url]) => ({ slug, url }))
  .filter((e) => !only.length || only.includes(e.slug));

const browser = await launch();
await mkdir(path.join(root, "public/showcase"), { recursive: true });

for (const { slug, url } of entries) {
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  );
  await page.setViewport({ width: 1440, height: 900 });
  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
  } catch (e) {
    console.log(`  ! ${slug}: ${e.message} (capturing anyway)`);
  }
  await new Promise((r) => setTimeout(r, 2500));
  // Accept / close cookie and chat popups so the screenshot shows the site.
  await page.evaluate(() => {
    const words = /^(accept|i accept|i accept the terms|accept all|ok|got it|agree|allow all)$/i;
    for (const el of document.querySelectorAll("button, a")) {
      if (words.test(el.textContent.trim())) el.click();
    }
  });
  await new Promise((r) => setTimeout(r, 1200));
  const out = path.join(root, "public/showcase", `${slug}.jpg`);
  await page.screenshot({ path: out, type: "jpeg", quality: 82 });
  await page.close();
  console.log(`  ✓ /showcase/${slug}.jpg`);
}

await browser.close();
