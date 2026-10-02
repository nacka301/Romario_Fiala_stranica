// Pretvara odabrane originale iz public/images u AVIF + WebP u više širina (public/img)
// i upisuje public/img/manifest.json (širine/visine za width/height atribute).
// Pokretanje: node scripts/optimize-images.mjs
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = 'source-images';
const OUT = 'public/img';
const sets = {
  hero:    { widths: [480, 800, 1280, 1920], items: { hero: 'posao_3/IMG-20251028-WA0020.jpg' } },
  about:   { widths: [480, 800], items: { about: 'services/brusenje.jpg' } },
  service: { widths: [400, 800], items: {
    parket: 'services/parket.jpg', laminat: 'services/laminat.jpg',
    vinil: 'services/vinil.jpg', brusenje: 'services/brusenje.jpg' } },
  gallery: { widths: [400, 800, 1280], items: {
    'g01': 'posao_1/WhatsApp Slika 2025-10-28 u 21.53.41_4a8a1299.jpg',
    'g02': 'posao_2/IMG-20251028-WA0007.jpg',
    'g03': 'posao_3/IMG-20251028-WA0019.jpg',
    'g04': 'posao_5/WhatsApp Slika 2025-11-23 u 15.58.06_945849b0.jpg',
    'g05': 'posao_6/WhatsApp Slika 2025-11-23 u 16.00.43_3c2ac77c.jpg',
    'g06': 'posao_3/IMG-20251028-WA0014.jpg',
    'g07': 'posao_3/IMG-20251028-WA0024.jpg',
    'g08': 'posao_7/WhatsApp Slika 2025-11-23 u 16.01.47_81c9f3f1.jpg',
    'g09': 'posao_1/WhatsApp Slika 2025-10-28 u 21.53.46_7cdaf441.jpg',
    'g10': 'posao_6/WhatsApp Slika 2025-11-23 u 16.00.43_117b8887.jpg',
    'g11': 'posao_3/IMG-20251028-WA0017.jpg',
    'g12': 'posao_5/WhatsApp Slika 2025-11-23 u 15.58.06_69cd3e37.jpg' } },
};
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const manifest = {};
for (const [setName, { widths, items }] of Object.entries(sets)) {
  for (const [name, rel] of Object.entries(items)) {
    const file = path.join(SRC, rel);
    const meta = await sharp(file).rotate().metadata();
    const ratio = meta.height / meta.width;
    manifest[name] = { set: setName, w: meta.width, h: meta.height, widths: [] };
    for (const w of widths) {
      if (w > meta.width && w !== widths[0]) continue;
      const tw = Math.min(w, meta.width);
      const base = sharp(file).rotate().resize({ width: tw });
      await base.clone().avif({ quality: 50, effort: 4 }).toFile(path.join(OUT, `${name}-${w}.avif`));
      await base.clone().webp({ quality: 74 }).toFile(path.join(OUT, `${name}-${w}.webp`));
      manifest[name].widths.push({ w, h: Math.round(tw * ratio) });
    }
  }
}
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1));
let total = 0; for (const f of fs.readdirSync(OUT)) total += fs.statSync(path.join(OUT, f)).size;
console.log('files', fs.readdirSync(OUT).length, 'total KB', total / 1024 | 0);
