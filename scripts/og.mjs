// Renders Open Graph images (1200x630) from inline SVG. Run with `npm run og`
// whenever the name, role, featured projects or a post title change.
//
//   public/og.png                  site-wide card
//   public/og/writing/<slug>.png   one card per published post
//
// Images are committed rather than rendered during the deploy build: SVG text
// uses the fonts installed on the rendering machine, and the build image does
// not guarantee any.
import { mkdir, readdir, readFile } from "node:fs/promises";
import { basename, extname } from "node:path";
import sharp from "sharp";

const PUBLIC = new URL("../public/", import.meta.url).pathname;
const POSTS = new URL("../src/content/writing/", import.meta.url).pathname;

const W = 1200;
const H = 630;
const X = 96;
const MAX_TEXT_WIDTH = W - 2 * X;
const TITLE_CENTER = 310;

const bg = "#121212";
const text = "#e8e8e6";
const muted = "#a3a3a3";
const line = "#2a2a2a";
const accent = "#fb923c";
const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'DejaVu Sans Mono', monospace";
const sans = "system-ui, -apple-system, 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif";

const escapeXml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function card(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${bg}"/>
  <rect x="0" y="0" width="14" height="${H}" fill="${accent}"/>
  ${body}
  <line x1="${X}" y1="478" x2="${W - X}" y2="478" stroke="${line}" stroke-width="2"/>
</svg>`;
}

async function render(svg, out) {
  const info = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
  console.log(`og: ${out.replace(PUBLIC, "public/")} (${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB)`);
}

/** Rendered width in px of one line of bold sans text, measured with the same renderer. */
async function measure(str, size) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="4000" height="${size * 2}"><text x="0" y="${size * 1.4}" font-family="${sans}" font-size="${size}" font-weight="700" fill="#fff">${escapeXml(str)}</text></svg>`;
  const { info } = await sharp(Buffer.from(svg)).trim().toBuffer({ resolveWithObject: true });
  return info.width;
}

/** Greedy word wrap by measured width. */
async function wrap(str, size) {
  const lines = [];
  let current = "";
  for (const word of str.split(/\s+/)) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && (await measure(candidate, size)) > MAX_TEXT_WIDTH) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// Largest size first. Big sizes only allow two lines so a long title never
// crowds the label above it.
const TITLE_STEPS = [
  { size: 76, maxLines: 2 },
  { size: 62, maxLines: 3 },
  { size: 54, maxLines: 3 },
  { size: 48, maxLines: 3 },
];

async function fitTitle(title) {
  for (const { size, maxLines } of TITLE_STEPS) {
    const lines = await wrap(title, size);
    if (lines.length <= maxLines) return { size, lines };
  }
  throw new Error(`og: title too long for the card: "${title}"`);
}

/** Minimal frontmatter reader for the flat keys posts use (plain, "double" or 'single' quoted). */
function frontmatter(source, file) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
  if (!match?.[1]) throw new Error(`og: no frontmatter in ${file}`);
  const data = {};
  for (const raw of match[1].split(/\r?\n/)) {
    const m = /^([A-Za-z_][\w-]*):\s*(.*?)\s*(?:#.*)?$/.exec(raw);
    if (!m) continue;
    let value = m[2];
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1).replace(/\\(["\\])/g, "$1");
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1).replace(/''/g, "'");
    }
    data[m[1]] = value;
  }
  if (!data.title || !data.date) throw new Error(`og: ${file} needs title and date`);
  return { title: data.title, date: data.date.slice(0, 10), draft: data.draft === "true" };
}

async function siteCard() {
  const body = `
  <text x="${X}" y="150" font-family="${mono}" font-size="34" fill="${accent}">// djmarkovic.com</text>
  <text x="${X}" y="300" font-family="${sans}" font-size="92" font-weight="700" fill="${text}">Djordje Marković</text>
  <text x="${X}" y="372" font-family="${sans}" font-size="40" fill="${muted}">Full-stack &amp; AI engineer · Belgrade</text>
  <text x="${X}" y="540" font-family="${mono}" font-size="32" fill="${muted}">pripremi.rs · vir</text>`;
  await render(card(body), `${PUBLIC}og.png`);
}

async function postCards() {
  const outDir = `${PUBLIC}og/writing/`;
  await mkdir(outDir, { recursive: true });
  const files = (await readdir(POSTS)).filter((f) => extname(f) === ".md").sort();

  for (const file of files) {
    const post = frontmatter(await readFile(`${POSTS}${file}`, "utf8"), file);
    if (post.draft) continue;

    const { size, lines } = await fitTitle(post.title);
    // Center the title block on the baseline the site card uses for the name.
    const lineHeight = size * 1.12;
    const firstBaseline = TITLE_CENTER - ((lines.length - 1) * lineHeight) / 2;
    const titleSvg = lines
      .map(
        (l, i) =>
          `<text x="${X}" y="${Math.round(firstBaseline + i * lineHeight)}" font-family="${sans}" font-size="${size}" font-weight="700" fill="${text}">${escapeXml(l)}</text>`,
      )
      .join("\n  ");
    const body = `
  <text x="${X}" y="150" font-family="${mono}" font-size="34" fill="${accent}">// writing</text>
  ${titleSvg}
  <text x="${X}" y="540" font-family="${mono}" font-size="32" fill="${muted}">Djordje Marković · ${escapeXml(post.date)}</text>`;
    await render(card(body), `${outDir}${basename(file, ".md")}.png`);
  }
}

await siteCard();
await postCards();
