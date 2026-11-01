// Prints the résumé page (/print/resume) to public/resume.pdf with headless Chrome.
// Usage: start the app (`npm run dev` or `npm start`), then `npm run resume:pdf`.
// Env: RESUME_URL (default http://localhost:3000/print/resume), CHROME_PATH.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const url = process.env.RESUME_URL ?? "http://localhost:3000/print/resume";
const out = fileURLToPath(new URL("../public/resume.pdf", import.meta.url));

const candidates = [
   process.env.CHROME_PATH,
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
   "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
   "/usr/bin/google-chrome",
   "/usr/bin/chromium",
   "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) {
   console.error("Chrome not found. Set CHROME_PATH to a Chrome or Chromium executable.");
   process.exit(1);
}

execFileSync(
   chrome,
   [
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      "--virtual-time-budget=8000",
      `--print-to-pdf=${out}`,
      url,
   ],
   { stdio: "inherit" }
);
console.log(`Saved ${out}`);
