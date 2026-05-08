import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.SHOT_BASE || "http://localhost:4173";
const OUT = process.env.SHOT_OUT || "screenshots";

const PAGES = [
  ["root", "/"],
  ["login", "/login"],
  ["signup", "/signup"],
  ["signup-attachment-survey", "/signup/attachment-survey"],
  ["mypage-profile", "/mypage/profile"],
  ["mypage-statistics", "/mypage/statistics"],
  ["mypage-records", "/mypage/records"],
  ["mypage-friends", "/mypage/friends"],
  ["mypage-settings", "/mypage/settings"],
  ["mediation-start", "/mediation/start"],
  ["mediation-input", "/mediation/input"],
  ["mediation-waiting", "/mediation/waiting"],
  ["mediation-analyzing", "/mediation/analyzing"],
  ["mediation-result", "/mediation/result"],
  ["mediation-complete", "/mediation/complete"],
];

const FILTER = process.argv.slice(2);

async function run() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const targets = FILTER.length
    ? PAGES.filter(([slug]) => FILTER.includes(slug))
    : PAGES;
  for (const [slug, route] of targets) {
    const url = BASE + route;
    process.stdout.write(`shot ${slug.padEnd(28)} ${url} ... `);
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
    } catch (err) {
      await page.goto(url, { waitUntil: "load", timeout: 15000 });
    }
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(OUT, `${slug}.png`),
      fullPage: true,
    });
    console.log("ok");
  }
  await browser.close();
}

run().catch((err) => {
  console.error("FAIL", err);
  process.exit(1);
});
