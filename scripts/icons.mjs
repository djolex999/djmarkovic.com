// Single source for the ĐM mark. Writes public/favicon.svg (letters scaled up
// to stay legible at 16px) and public/apple-touch-icon.png (180x180, original
// proportions, square tile because iOS applies its own mask).
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const PUBLIC = new URL("../public/", import.meta.url).pathname;
const SIZE = 1254;
const TILE = "#1b1b1b";
const INK = "#fbfbfa";
const ACCENT = "#b93c0b";

// Glyph geometry on a 1254 grid. Bounding box of the mark: x 200..1015, y 406..866.
const mark = `<g fill="${INK}"><path fill-rule="evenodd" d="M242 406h173c110 0 175 74 175 190s-65 190-175 190H242zm83 74v232h87c58 0 93-45 93-116s-35-116-93-116z"/><path d="M200 558h220v66H200z"/><path d="M635 406h87l99 184 107-184h87v380h-85V558l-94 162h-31l-87-160v226h-83z"/></g><path fill="${ACCENT}" d="M242 828h773v38H242z"/>`;

function icon({ scale, radius }) {
  const center = SIZE / 2;
  const transform = `translate(${center} ${center}) scale(${scale}) translate(-607.5 -636)`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}"><rect width="${SIZE}" height="${SIZE}" rx="${radius}" fill="${TILE}"/><g transform="${transform}">${mark}</g></svg>\n`;
}

const favicon = icon({ scale: 1.3, radius: 150 });
await writeFile(`${PUBLIC}favicon.svg`, favicon);

const touch = await sharp(Buffer.from(icon({ scale: 1, radius: 0 })))
  .resize(180, 180)
  .png({ compressionLevel: 9 })
  .toFile(`${PUBLIC}apple-touch-icon.png`);

console.log(`icons: favicon.svg (${Buffer.byteLength(favicon)} B), apple-touch-icon.png (${touch.size} B)`);
