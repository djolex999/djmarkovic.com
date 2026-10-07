// Enforces the site's performance contract against the built output in dist/.
// Fails on: any .js/.mjs file, any external stylesheet, any executable <script>,
// any HTML page over the gzip budget, or an og:image / twitter:image that does
// not exist in dist/ (for example a post published without running npm run og).
import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, extname } from "node:path";
import { gzipSync } from "node:zlib";

const DIST = new URL("../dist/", import.meta.url).pathname;
const SITE_ORIGIN = "https://djmarkovic.com";
const HTML_BUDGET_BYTES = 10 * 1024;
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

    for (const v of [
      ...scriptViolations(html),
      ...stylesheetViolations(html),
      ...(await missingSocialImages(html)),
    ]) {
      errors.push(`${rel}: ${v}`);
    }
    if (over) {
      errors.push(`${rel}: ${kb(gz)} gzip exceeds ${kb(HTML_BUDGET_BYTES)} budget`);
    }
    rows.push({ page: rel, raw: kb(raw), gzip: kb(gz), budget: over ? "OVER" : "ok" });
  }

  rows.sort((a, b) => a.page.localeCompare(b.page));
  console.log(`\nHTML budget: ${kb(HTML_BUDGET_BYTES)} gzip per page\n`);
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
