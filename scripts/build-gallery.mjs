// Generira <picture> markup galerije iz public/img/manifest.json u public/index.html
// (izmedju <!--gallery:start--> i <!--gallery:end-->). Pokretanje: node scripts/build-gallery.mjs
import fs from 'fs';
const m = JSON.parse(fs.readFileSync('public/img/manifest.json', 'utf8'));
const alts = {
  g01: 'Parket u riblju kost, svijetli hrast', g02: 'Lakirani hrastov parket u dnevnom boravku',
  g03: 'Sjajno lakirani parket u riblju kost', g04: 'Chevron parket u svijetlim tonovima',
  g05: 'Parket uz zaobljeni zid, precizno rezanje', g06: 'Parket u sivo-bež tonu nakon brušenja',
  g07: 'Lakirani parket u riblju kost', g08: 'Lijepljenje parketa na pripremljenu podlogu',
  g09: 'Visokosjajno lakirani parket', g10: 'Hrastov parket i zaobljeni zid',
  g11: 'Podovi u svijetlom hrastu', g12: 'Parket uz mramorne pločice',
};
const VISIBLE = 8;
const rows = Object.keys(alts).map((k, i) => {
  const d = m[k], ws = d.widths.filter(x => x.w <= 800);
  const ss = ext => ws.map(x => `/img/${k}-${x.w}.${ext} ${x.w}w`).join(', ');
  const sizes = '(min-width:900px) 280px, 50vw';
  const hidden = i >= VISIBLE ? ' data-extra hidden' : '';
  return `                <figure class="gallery-item"${hidden}>
                    <button type="button" class="gallery-btn" data-full="/img/${k}-1280.webp" aria-label="Povećaj sliku: ${alts[k]}">
                        <picture>
                            <source type="image/avif" srcset="${ss('avif')}" sizes="${sizes}">
                            <img src="/img/${k}-400.webp" srcset="${ss('webp')}" sizes="${sizes}" width="${ws[0].w}" height="${ws[0].h}" alt="${alts[k]}" loading="lazy" decoding="async">
                        </picture>
                    </button>
                </figure>`;
}).join('\n');
let html = fs.readFileSync('public/index.html', 'utf8');
html = html.replace(/<!--gallery:start-->[\s\S]*?<!--gallery:end-->/, `<!--gallery:start-->\n${rows}\n<!--gallery:end-->`);
fs.writeFileSync('public/index.html', html);
console.log('gallery items', Object.keys(alts).length);
