// Auto-capture the CodeGuard gallery from the running local app (http://localhost:8080)
// Drives the always-on `demo/payments` sandbox so shots are instant + deterministic.
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const APP_URL = process.env.SHOOT_URL || "http://localhost:8080";
const OUT = new URL("./screenshots/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: "new",
  args: ["--no-sandbox", "--hide-scrollbars", "--force-color-profile=srgb"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

async function shot(name) { await page.screenshot({ path: OUT + name }); console.log("  ✔", name); }

await page.goto(APP_URL, { waitUntil: "networkidle2" });
await sleep(700);
await shot("01-dashboard.png");

// Run a review on the sandbox (fresh page → clean inputs)
await page.type("#pid", "demo/payments");
await page.type("#iid", "247");
await page.click("#reviewBtn");
await page.waitForSelector("#verdictCard", { timeout: 8000 });
await sleep(700);
await shot("02-review.png");

// Approval bar focus
await page.waitForSelector("#approval.show", { timeout: 3000 });
await sleep(200);
await shot("03-approval.png");

// Auto-fix MR card
await page.waitForSelector("#fixBtn", { timeout: 3000 });
await page.click("#fixBtn");
await page.waitForSelector("#fixCard", { timeout: 6000 });
await page.evaluate(() => window.scrollTo({ top: 0 }));
await sleep(700);
await shot("04-autofix.png");

// Approve -> populate ledger, then capture evidence + ledger
await page.click("#approveBtn");
await sleep(900);
await page.evaluate(() => document.querySelector("#evidenceCard")?.scrollIntoView({ block: "start" }));
await sleep(600);
await shot("05-evidence.png");
await page.evaluate(() => document.querySelector("#ledgerCard")?.scrollIntoView({ block: "start" }));
await sleep(600);
await shot("07-ledger.png");

// Judge Mode coach panel — fresh reload so inputs are clean
await page.goto(APP_URL, { waitUntil: "networkidle2" });
await sleep(500);
await page.click("button.judge");
await page.waitForSelector("#coach.show", { timeout: 5000 });
await sleep(900);
await shot("06-judge-mode.png");

await browser.close();
console.log("done →", OUT);
