const sharp = require('sharp');
const pngToIco = require('png-to-ico').default;
const fs = require('fs');
const path = require('path');

const SRC = 'C:\\Users\\lenovo\\Downloads\\Omar website\\Favicon_Final__500_x_500_px_-removebg-preview.png';
const ROOT = path.resolve(__dirname, '..');
const OUT_ICONS = path.join(ROOT, 'public', 'icons');
const APP_DIR = path.join(ROOT, 'app');
const PUBLIC = path.join(ROOT, 'public');

async function main() {
  fs.mkdirSync(OUT_ICONS, { recursive: true });

  const sizes = [16, 32, 48, 180, 192, 512];
  const buffers = {};

  for (const size of sizes) {
    const buf = await sharp(SRC)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    buffers[size] = buf;
    const outPath = path.join(OUT_ICONS, `icon-${size}.png`);
    fs.writeFileSync(outPath, buf);
    console.log('wrote', outPath, buf.length, 'bytes');
  }

  // Apple touch icon expects an opaque background (transparent renders as
  // black on iOS home screens). This logo mark is near-black, so it needs a
  // light background to stay visible — use white rather than the dark void.
  const appleBuf = await sharp({
    create: { width: 180, height: 180, channels: 4, background: '#FFFFFF' },
  })
    .composite([{ input: buffers[180], top: 0, left: 0 }])
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(PUBLIC, 'apple-touch-icon.png'), appleBuf);
  console.log('wrote apple-touch-icon.png');

  // favicon.ico bundling 16/32/48
  const icoBuf = await pngToIco([buffers[16], buffers[32], buffers[48]]);
  fs.writeFileSync(path.join(APP_DIR, 'favicon.ico'), icoBuf);
  console.log('wrote app/favicon.ico', icoBuf.length, 'bytes');

  // app/icon.png — Next.js metadata file convention fallback.
  fs.writeFileSync(path.join(APP_DIR, 'icon.png'), buffers[32]);
  console.log('wrote app/icon.png');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
