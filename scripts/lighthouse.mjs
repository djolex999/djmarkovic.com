// Runs Lighthouse (mobile) against the built site and enforces the scores the
// README promises. dist/ is served with the headers from vercel.json, so the
// audit sees the production CSP. Run after `astro build`.
//
//   Accessibility, Best Practices, SEO: 100
//   Performance: >= 95 on the median of RUNS runs (CI machines are noisy)
//
// 404 is audited too, but not for SEO: it is noindex by design.
import { createServer } from "node:http";
import { readdir, readFile, appendFile } from "node:fs/promises";
import { extname, join } from "node:path";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const ROOT = new URL("../", import.meta.url).pathname;
const DIST = join(ROOT, "dist");
const RUNS = 3;
const MIN = { performance: 0.95, accessibility: 1, "best-practices": 1, seo: 1 };
const CATEGORIES = Object.keys(MIN);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

/** Header rules from vercel.json, minus HSTS (the local server is plain HTTP). */
async function headerRules() {
  const config = JSON.parse(await readFile(join(ROOT, "vercel.json"), "utf8"));
  return config.headers.map(({ source, headers }) => ({
    pattern: new RegExp(`^${source.replace("(.*)", ".*")}$`),
    headers: Object.fromEntries(
      headers.filter((h) => h.key !== "Strict-Transport-Security").map((h) => [h.key, h.value]),
    ),
  }));
}

async function serve() {
  const rules = await headerRules();
  const server = createServer(async (req, res) => {
    const path = new URL(req.url ?? "/", "http://localhost").pathname;
    const headers = Object.assign({}, ...rules.filter((r) => r.pattern.test(path)).map((r) => r.headers));
    // Same resolution as Vercel cleanUrls: /writing -> writing.html, / -> index.html.
    const file = path === "/" ? "index.html" : extname(path) ? path.slice(1) : `${path.slice(1)}.html`;
    try {
      const body = await readFile(join(DIST, decodeURIComponent(file)));
      res.writeHead(200, { ...headers, "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404, { ...headers, "Content-Type": TYPES[".html"] });
      res.end(await readFile(join(DIST, "404.html")));
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (address === null || typeof address === "string") throw new Error("lighthouse: server has no port");
  return { server, origin: `http://127.0.0.1:${address.port}` };
}

async function pages() {
  const entries = await readdir(DIST, { recursive: true });
  return entries
    .filter((f) => f.endsWith(".html"))
    .map((f) => "/" + f.replace(/\.html$/, "").replace(/^index$/, ""))
    .sort();
}

const pct = (score) => Math.round(score * 100);

async function main() {
  const { server, origin } = await serve();
  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless=new", ...(process.env.CI ? ["--no-sandbox"] : [])],
  });
  const rows = [];
  const failures = [];

  try {
    for (const path of await pages()) {
      const runs = [];
      for (let i = 0; i < RUNS; i++) {
        const result = await lighthouse(`${origin}${path}`, {
          port: chrome.port,
          logLevel: "error",
          onlyCategories: CATEGORIES,
        });
        if (!result) throw new Error(`lighthouse: no result for ${path}`);
        runs.push(result.lhr);
      }
      runs.sort((a, b) => (a.categories.performance?.score ?? 0) - (b.categories.performance?.score ?? 0));
      const median = runs[Math.floor(runs.length / 2)];
      if (!median) throw new Error(`lighthouse: no runs for ${path}`);

      const row = { page: path };
      for (const key of CATEGORIES) {
        const score = median.categories[key]?.score ?? 0;
        row[key] = pct(score);
        const exempt = key === "seo" && path === "/404";
        if (!exempt && score < MIN[key]) {
          failures.push(`${path}: ${key} ${pct(score)} < ${pct(MIN[key])}`);
        }
      }
      rows.push(row);
    }
  } finally {
    await chrome.kill();
    server.close();
  }

  console.log(`\nLighthouse (mobile), median of ${RUNS} runs, production headers\n`);
  console.table(rows);

  if (process.env.GITHUB_STEP_SUMMARY) {
    const lines = [
      `### Lighthouse (mobile, median of ${RUNS} runs)`,
      "",
      "| Page | Performance | Accessibility | Best Practices | SEO |",
      "| --- | --- | --- | --- | --- |",
      ...rows.map((r) => `| \`${r.page}\` | ${r.performance} | ${r.accessibility} | ${r["best-practices"]} | ${r.seo}${r.page === "/404" ? " (noindex)" : ""} |`),
      "",
    ];
    await appendFile(process.env.GITHUB_STEP_SUMMARY, lines.join("\n"));
  }

  if (failures.length > 0) {
    console.error(`\nlighthouse: ${failures.length} score(s) below threshold`);
    for (const f of failures) console.error(`  x ${f}`);
    process.exit(1);
  }
  console.log(`\nlighthouse: ${rows.length} page(s) meet the thresholds\n`);
}

await main();
