// Generates a branded 1200×630 Open Graph image: the OO Travel wordmark on the
// dark "void" brand background with a subtle indigo/gold aura. Run with sharp:
//   npm install --no-save sharp && node scripts/gen-og.js && npm prune
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const LOGO = path.join(ROOT, 'public', 'brand', 'oo-travel-logo.png');
const OUT_DIR = path.join(ROOT, 'public', 'og');
const W = 1200;
const H = 630;

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Dark background with brand auras + a thin gold baseline, as an SVG layer.
  const bg = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <rect width="${W}" height="${H}" fill="#08080F"/>
      <defs>
        <radialGradient id="indigo" cx="50%" cy="0%" r="75%">
          <stop offset="0%" stop-color="#6366F1" stop-opacity="0.20"/>
          <stop offset="60%" stop-color="#6366F1" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="gold" cx="85%" cy="100%" r="60%">
          <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.14"/>
          <stop offset="70%" stop-color="#F59E0B" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#indigo)"/>
      <rect width="${W}" height="${H}" fill="url(#gold)"/>
      <rect x="450" y="470" width="300" height="2" rx="1" fill="#F59E0B" opacity="0.55"/>
      <text x="600" y="512" text-anchor="middle" font-family="Georgia, serif"
            font-size="30" fill="#94A3B8" letter-spacing="1">
        Independent Travel Agent · São Paulo
      </text>
    </svg>`);

  // Logo scaled to ~620px wide, centered slightly above the tagline.
  const logo = await sharp(LOGO).resize({ width: 620 }).toBuffer();
  const meta = await sharp(logo).metadata();
  const left = Math.round((W - (meta.width || 620)) / 2);
  const top = Math.round(H * 0.30 - (meta.height || 0) / 2);

  const out = path.join(OUT_DIR, 'og-default.png');
  await sharp(bg)
    .composite([{ input: logo, left, top }])
    .png()
    .toFile(out);

  console.log('wrote', out);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
