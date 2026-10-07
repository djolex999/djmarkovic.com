// Enforces the site's performance contract against the built output in dist/.
// Fails on: any .js/.mjs file, any external stylesheet, any executable <script>,
// any HTML page over the gzip budget, an og:image / twitter:image that does
// not exist in dist/ (for example a post published without running npm run og),
// or a page whose total weight (HTML plus every file it makes the browser
// fetch: fonts, preloads, favicon, images) exceeds the page budget.
import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, extname } from "node:path";
import { gzipSync } from "node:zlib";

const DIST = new URL("../dist/", import.meta.url).pathname;
const SITE_ORIGIN = "https://djmarkovic.com";
const HTML_BUDGET_BYTES = 10 * 1024;
const PAGE_BUDGET_BYTES = 100 * 1024;
const ALLOWED_SCRIPT_TYPES = new Set(["application/ld+json"]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : [full];
    }),
  );
  return files.flat();
}

function scriptViolations(html) {
  const found = [];
  for (const match of html.matchAll(/<script\b([^>]*)>/gi)) {
    const attrs = match[1] ?? "";
    const type = /\btype\s*=\s*["']?([^"'\s>]+)/i.exec(attrs)?.[1]?.toLowerCase();
    if (type === undefined || !ALLOWED_SCRIPT_TYPES.has(type)) {
      found.push(`executable <script${attrs}>`);
    }
  }
  return found;
}

function stylesheetViolations(html) {
  const found = [];
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    if (/\brel\s*=\s*["']?stylesheet/i.test(match[0])) {
      found.push(`external stylesheet ${match[0]}`);
    }
  }
  return found;
}

async function missingSocialImages(html) {
  const found = [];
  const re = /<meta\b[^>]*(?:property|name)="(?:og:image|twitter:image)"[^>]*content="([^"]+)"/gi;
  const urls = new Set([...html.matchAll(re)].map((m) => new URL(m[1], SITE_ORIGIN).href));
  for (const href of urls) {
    const url = new URL(href);
    if (url.origin !== SITE_ORIGIN) {
      found.push(`social image on another origin: ${url.href}`);
      continue;
    }
    try {
      await stat(join(DIST, decodeURIComponent(url.pathname)));
    } catch {
      found.push(`social image missing from dist: ${url.pathname} (run npm run og)`);
    }
  }
  return found;
}

/**
 * Same-origin files a page makes the browser fetch on load: url() in inline
 * CSS (fonts), <link rel=preload|icon>, <img src>. Counted at their size on
 * disk, which is close to transfer size for already-compressed fonts and images.
 * An @font-face that is declared but unused would not download, so this is an
 * upper bound.
 */
function pageAssets(html) {
  const paths = new Set();
  for (const style of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    for (const m of (style[1] ?? "").matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
      if (m[1]) paths.add(m[1]);
    }
  }
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0];
    if (!/\brel="(?:preload|icon)"/i.test(tag)) continue;
    const href = /\bhref="([^"]+)"/i.exec(tag)?.[1];
    if (href) paths.add(href);
  }
  for (const m of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)) {
    if (m[1]) paths.add(m[1]);
  }
  return [...paths]
    .map((p) => new URL(p, SITE_ORIGIN))
    .filter((url) => url.origin === SITE_ORIGIN)
    .map((url) => decodeURIComponent(url.pathname));
}

async function assetBytes(html) {
  let bytes = 0;
  const missing = [];
  for (const path of pageAssets(html)) {
    try {
      bytes += (await stat(join(DIST, path))).size;
    } catch {
      missing.push(`referenced file missing from dist: ${path}`);
    }
  }
  return { bytes, missing };
}

const kb = (bytes) => `${(bytes / 1024).toFixed(2)} KB`;

async function main() {
  try {
    await stat(DIST);
  } catch {
    console.error("budget: dist/ not found. Run `astro build` first.");
    process.exit(1);
  }

  const files = await walk(DIST);
  const errors = [];
  const rows = [];

  for (const file of files) {
    const rel = relative(DIST, file);
    const ext = extname(file).toLowerCase();

    if (ext === ".js" || ext === ".mjs") {
      errors.push(`${rel}: JavaScript file in output`);
      continue;
    }
    if (ext === ".css") {
      errors.push(`${rel}: external CSS file in output`);
      continue;
    }
    if (ext !== ".html") continue;

    const html = await readFile(file, "utf8");
    const raw = Buffer.byteLength(html);
    const gz = gzipSync(html, { level: 9 }).length;
    const over = gz > HTML_BUDGET_BYTES;
    const assets = await assetBytes(html);
    const total = gz + assets.bytes;
    const totalOver = total > PAGE_BUDGET_BYTES;

    for (const v of [
      ...scriptViolations(html),
      ...stylesheetViolations(html),
      ...(await missingSocialImages(html)),
      ...assets.missing,
    ]) {
      errors.push(`${rel}: ${v}`);
    }
    if (over) {
      errors.push(`${rel}: ${kb(gz)} gzip exceeds ${kb(HTML_BUDGET_BYTES)} budget`);
    }
    if (totalOver) {
      errors.push(`${rel}: ${kb(total)} total page weight exceeds ${kb(PAGE_BUDGET_BYTES)} budget`);
    }
    rows.push({
      page: rel,
      raw: kb(raw),
      gzip: kb(gz),
      total: kb(total),
      budget: over || totalOver ? "OVER" : "ok",
    });
  }

  rows.sort((a, b) => a.page.localeCompare(b.page));
  console.log(
    `\nBudgets: HTML ${kb(HTML_BUDGET_BYTES)} gzip, total page weight ${kb(PAGE_BUDGET_BYTES)} (HTML gzip + fonts, preloads, favicon, images)\n`,
  );
  console.table(rows);

  if (rows.length === 0) {
    errors.push("no HTML pages found in dist/");
  }

  if (errors.length > 0) {
    console.error(`\nbudget: ${errors.length} violation(s)`);
    for (const e of errors) console.error(`  x ${e}`);
    process.exit(1);
  }
  console.log(`\nbudget: ${rows.length} page(s), 0 JS files, 0 external CSS, all within budget\n`);
}

await main();
