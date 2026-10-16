#!/usr/bin/env node
/**
 * Replaces each template's thumbnail with a real screenshot of its
 * /preview/<slug> page. Needs the site running (npm run build && npm start,
 * or npm run dev) and a local Chrome or Edge.
 *
 *   npm run thumbnails                       # against http://localhost:3000
 *   BASE_URL=http://localhost:3123 npm run thumbnails
 *   npm run thumbnails -- crisp-cool         # one template only
 */
import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { capture, launch } from "./browser.mjs";

const root = path.resolve(import.meta.dirname, "..");
const base = process.env.BASE_URL ?? "http://localhost:3000";
const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));

async function findMetaFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await findMetaFiles(full)));
    else if (entry.name === "meta.ts") out.push(full);
  }
  return out;
}

const browser = await launch();
try {
  for (const file of await findMetaFiles(path.join(root, "templates"))) {
    const { default: meta } = await import(pathToFileURL(file).href);
    if (only.length && !only.includes(meta.slug)) continue;
    const url = `${base}/preview/${meta.slug}`;

    const desktop = path.join(root, "public", meta.thumbnail);
    await capture(browser, url, { width: 1440, height: 900, out: desktop });
    console.log("  ✓", meta.thumbnail);

    if (meta.thumbnailMobile) {
      const mobile = path.join(root, "public", meta.thumbnailMobile);
      await capture(browser, url, { width: 393, height: 852, mobile: true, out: mobile });
      console.log("  ✓", meta.thumbnailMobile);
    }
  }
} finally {
  await browser.close();
}
