import { existsSync } from "node:fs";
import puppeteer from "puppeteer-core";

/** Finds a locally installed Chromium-based browser (Chrome or Edge). */
export function findBrowser() {
  const candidates = [
    process.env.BROWSER_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found) {
    throw new Error("No Chrome/Edge found. Set BROWSER_PATH to your browser executable.");
  }
  return found;
}

export function launch() {
  return puppeteer.launch({ executablePath: findBrowser(), headless: true });
}

/** Screenshot a URL at a device viewport. */
export async function capture(browser, url, { width, height, mobile = false, fullPage = false, out, wait = 1200 }) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
  await page.goto(url, { waitUntil: "networkidle0" });
  // Let entrance animations settle.
  await new Promise((r) => setTimeout(r, wait));
  if (fullPage) {
    // Trigger in-view animations by scrolling through the page once.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await new Promise((r) => setTimeout(r, 600));
  }
  // Drop the Next.js dev-tools badge if the site is running under `next dev`.
  await page.evaluate(() => document.querySelectorAll("nextjs-portal").forEach((el) => el.remove()));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  await page.screenshot({ path: out, fullPage, type: out.endsWith(".png") ? "png" : "jpeg", ...(out.endsWith(".png") ? {} : { quality: 85 }) });
  await page.close();
  return { overflow };
}
