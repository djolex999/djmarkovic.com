// Renders public/og.png (1200x630) from an inline SVG. Run with `npm run og`
// whenever the name, role or featured projects change.
import sharp from "sharp";

const OUT = new URL("../public/og.png", import.meta.url).pathname;

const bg = "#121212";
const text = "#e8e8e6";
const muted = "#a3a3a3";
const accent = "#fb923c";
const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'DejaVu Sans Mono', monospace";
const sans = "system-ui, -apple-system, 'Helvetica Neue', Arial, 'DejaVu Sans', sans-serif";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${bg}"/>
  <rect x="0" y="0" width="14" height="630" fill="${accent}"/>
  <text x="96" y="150" font-family="${mono}" font-size="34" fill="${accent}">// djmarkovic.com</text>
  <text x="96" y="300" font-family="${sans}" font-size="92" font-weight="700" fill="${text}">Djordje Marković</text>
  <text x="96" y="372" font-family="${sans}" font-size="40" fill="${muted}">Full-stack &amp; AI engineer · Belgrade</text>
  <line x1="96" y1="478" x2="1104" y2="478" stroke="#2a2a2a" stroke-width="2"/>
  <text x="96" y="540" font-family="${mono}" font-size="32" fill="${muted}">pripremi.rs · vir</text>
</svg>`;

const info = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(OUT);
console.log(`og: wrote ${OUT} (${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KB)`);
