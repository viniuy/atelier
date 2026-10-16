#!/usr/bin/env node
/**
 * Generates placeholder JPGs for every image slot (and thumbnail) declared in
 * templates/<category>/<slug>/meta.ts. Existing files are left alone, so it's
 * safe to re-run after dropping in real images. Pass --force to regenerate all.
 *
 *   npm run placeholders
 *   npm run placeholders -- --force
 */
import { readdir, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const force = process.argv.includes("--force");

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

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

const esc = (s) => s.replace(/[<>&"]/g, (ch) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[ch]);

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function svg({ width, height, title, subtitle, palette }) {
  // Flat, quiet frame: the lightest palette color as the field, the darkest
  // for the label. Easy to spot as "image goes here" without shouting.
  const sorted = Object.values(palette).sort((a, b) => luminance(a) - luminance(b));
  const dark = sorted[0];
  const light = sorted[sorted.length - 1];
  const s = Math.min(width, height);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${light}"/>
  <rect width="100%" height="100%" fill="${dark}" fill-opacity=".07"/>
  <rect x="${s * 0.03}" y="${s * 0.03}" width="${width - s * 0.06}" height="${height - s * 0.06}" fill="none" stroke="${dark}" stroke-opacity=".12" stroke-width="${Math.max(1, s * 0.003)}"/>
  <g font-family="Segoe UI, Helvetica, Arial, sans-serif" fill="${dark}" text-anchor="middle">
    <text x="50%" y="${height / 2}" font-size="${s * 0.06}" font-weight="600" fill-opacity=".55">${esc(title)}</text>
    <text x="50%" y="${height / 2 + s * 0.07}" font-size="${s * 0.032}" fill-opacity=".4">${esc(subtitle)}</text>
  </g>
</svg>`;
}

async function write(file, opts) {
  const out = path.join(root, "public", file);
  if (!force && (await exists(out))) return false;
  await mkdir(path.dirname(out), { recursive: true });
  await sharp(Buffer.from(svg(opts))).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  return true;
}

const metas = await findMetaFiles(path.join(root, "templates"));
let created = 0;

for (const file of metas) {
  const { default: meta } = await import(pathToFileURL(file).href);
  for (const [slot, img] of Object.entries(meta.images)) {
    if (
      await write(img.src, {
        width: img.width,
        height: img.height,
        title: `${meta.name} · ${slot}`,
        subtitle: `${img.width}×${img.height} · ${path.basename(img.src)}`,
        palette: meta.palette,
      })
    ) {
      created++;
      console.log("  +", img.src);
    }
  }
  if (
    await write(meta.thumbnail, {
      width: 1600,
      height: 1000,
      title: meta.name,
      subtitle: "Run `npm run thumbnails` for a real screenshot",
      palette: meta.palette,
    })
  ) {
    created++;
    console.log("  +", meta.thumbnail);
  }
  if (
    meta.thumbnailMobile &&
    (await write(meta.thumbnailMobile, {
      width: 393,
      height: 852,
      title: meta.name,
      subtitle: "npm run thumbnails",
      palette: meta.palette,
    }))
  ) {
    created++;
    console.log("  +", meta.thumbnailMobile);
  }
}

console.log(`\n${created} placeholder${created === 1 ? "" : "s"} written (${metas.length} templates scanned).`);
