// Read and write UTF-8 text in PNG files via iTXt chunks (PNG spec 11.3.4.5).
// Used to stamp each OG card with the post data it was rendered from, so CI
// can tell when a card is stale.
import { crc32 } from "node:zlib";

/** Keyword for the "title\ndate" stamp on per-post OG cards. */
export const OG_SOURCE_KEYWORD = "djm:source";

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typeAndData = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([length, typeAndData, crc]);
}

/** Returns a copy of `png` with an uncompressed iTXt chunk inserted before IEND. */
export function withText(png, keyword, text) {
  if (!png.subarray(0, 8).equals(SIGNATURE)) throw new Error("png-text: not a PNG");
  const data = Buffer.concat([
    Buffer.from(keyword, "latin1"),
    Buffer.from([0, 0, 0]), // keyword terminator, compression flag, compression method
    Buffer.from([0, 0]), // empty language tag, empty translated keyword
    Buffer.from(text, "utf8"),
  ]);
  const iendAt = png.length - 12;
  if (png.toString("latin1", iendAt + 4, iendAt + 8) !== "IEND") throw new Error("png-text: IEND not last");
  return Buffer.concat([png.subarray(0, iendAt), chunk("iTXt", data), png.subarray(iendAt)]);
}

/** Text of the first uncompressed iTXt chunk with this keyword, or null. */
export function readText(png, keyword) {
  if (!png.subarray(0, 8).equals(SIGNATURE)) throw new Error("png-text: not a PNG");
  let offset = 8;
  while (offset + 8 <= png.length) {
    const length = png.readUInt32BE(offset);
    const type = png.toString("latin1", offset + 4, offset + 8);
    const data = png.subarray(offset + 8, offset + 8 + length);
    if (type === "iTXt") {
      const end = data.indexOf(0);
      if (data.toString("latin1", 0, end) === keyword && data[end + 1] === 0) {
        const langEnd = data.indexOf(0, end + 3);
        const translatedEnd = data.indexOf(0, langEnd + 1);
        return data.subarray(translatedEnd + 1).toString("utf8");
      }
    }
    if (type === "IEND") break;
    offset += 12 + length;
  }
  return null;
}
