// ponytail: one-off converter. The three supplied line drawings already carry their own
// alpha, so this only upscales and re-encodes to WebP. Re-run only if the artwork is redrawn.
// Sources are 179-481px tall; the hero renders the cane at ~55vh, so on a 2x screen it needs
// ~1100px. 3x lanczos gets there, and the unsharp mask puts back the edge the upscale eats —
// it cannot add detail the 235px original never had.
const sharp = require('sharp');

const SRC = 'C:/Users/Asmita/Downloads/';
const OUT = 'public/images/hero/frame/';
const FILES = { cane: 'GP (24).png', hemp: 'GP (23).png', mushrooms: 'GP (25).png' };
const SCALE = 3;

(async () => {
  for (const [name, file] of Object.entries(FILES)) {
    const img = sharp(SRC + file);
    const { width, height } = await img.metadata();
    const info = await img
      .resize(width * SCALE, height * SCALE, { kernel: 'lanczos3' })
      // sigma ~1.2 suits line art: tightens the stroke edge without ringing the flat fills
      .sharpen({ sigma: 1.2, m1: 0.6, m2: 2.2 })
      .webp({ quality: 90, alphaQuality: 100 })
      .toFile(OUT + name + '.webp');
    console.log(name, info.width + 'x' + info.height, Math.round(info.size / 1024) + 'KB');
  }
})();
