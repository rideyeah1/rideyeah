// Download brand fonts (Fraunces + Manrope) from Google Fonts as woff2,
// save locally and emit a fonts.css that references the local files.
import { writeFile } from 'node:fs/promises';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const CSS_URL =
  'https://fonts.googleapis.com/css2?' +
  'family=Manrope:wght@400;500;600;700;800&' +
  'family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&' +
  'display=swap';

const css = await (await fetch(CSS_URL, { headers: { 'User-Agent': UA } })).text();

const urls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g)].map(
  (m) => m[1],
);
console.log('found', urls.length, 'woff2 files');

let out = css;
let i = 0;
for (const url of [...new Set(urls)]) {
  const name = `f${i++}.woff2`;
  const buf = Buffer.from(await (await fetch(url, { headers: { 'User-Agent': UA } })).arrayBuffer());
  await writeFile(new URL(`./fonts/${name}`, import.meta.url), buf);
  out = out.split(url).join(`./fonts/${name}`);
  console.log('saved', name, (buf.length / 1024).toFixed(1) + 'kb', '<-', url.split('/').pop());
}

await writeFile(new URL('./fonts.css', import.meta.url), out);
console.log('wrote fonts.css');
