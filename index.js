import { parse } from "opentype.js";
import sharp from "sharp";
import fs from "fs/promises";

async function main() {
  const buf = (await fs.readFile("vscode-codicon.ttf")).buffer;
  const font = parse(buf);
  font.glyphNames.names.forEach((name, index) => {
    const glyph = font.glyphs.get(index);
    if (!glyph.unicode) return;
    const path = glyph.getPath(glyph.xMax, glyph.yMax, 100);
    const { x1, x2, y1, y2 } = path.getBoundingBox();
    const w = x2 - x1;
    const h = y2 - y1;
    const pathString = path.toSVG();
    const svg = `<svg width="${w}" fill="white" height="${h}" viewBox="${x1} ${y1} ${w} ${h}">
      ${pathString}
    </svg>`;
    sharp(Buffer.from(svg))
      .png()
      .toFile(`./dump/${name}.png`, err => {
        if (err) return console.error(err);
        console.info(`Successfully converted glyph ${name} to PNG!`);
      });
  });
}

main();
