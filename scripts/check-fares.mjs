/**
 * RideYeah · Fare consistency guard
 * ---------------------------------
 * Runs at the start of the build. scripts/fares-data.mjs is the single source of
 * truth for fixed fares; this asserts every place that shows a price still
 * matches it — the chat assistant KB (functions/api/chat.js), the inline copy in
 * rideyeah-home.html (EN + ES), the home "Popular routes" grid, popular-routes.html
 * and the Malibu answer in faq.html. If anything drifts, the build FAILS with the
 * exact file + city, so a price change can never go live half-applied.
 */
import { readFileSync } from "node:fs";
import { CHAT_FARES, faresSemicolon, faresBullets, FARE_OF } from "./fares-data.mjs";
import { ROUTES } from "./routes-data.mjs";

const read = (p) => readFileSync(p, "utf8");
const errors = [];

// 1) Chat assistant backend KB (functions/api/chat.js) — exact PRICING line.
if (!read("functions/api/chat.js").includes(faresSemicolon())) {
  errors.push(`functions/api/chat.js PRICING line is stale.\n      expected: ${faresSemicolon()}`);
}

// 2) Home inline chat KB bullets — language-neutral, must appear in BOTH EN & ES copies.
// The home stores the KB inside a JS string literal, so newlines are the escaped
// two-char sequence "\n" rather than real line breaks — compare against that form.
const home = read("rideyeah-home.html");
const bullets = faresBullets().replace(/\n/g, "\\n");
const found = home.split(bullets).length - 1;
if (found < 2) {
  errors.push(`rideyeah-home.html inline chat KB fares stale (found ${found}/2 EN+ES blocks).`);
}

// 3) Displayed route prices (home grid + popular-routes.html) must match routes-data.
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const popular = read("popular-routes.html");
for (const r of ROUTES) {
  for (const [name, html] of [
    ["rideyeah-home.html", home],
    ["popular-routes.html", popular],
  ]) {
    const m = html.match(new RegExp("LAX ⇄ " + esc(r.city) + "[^$]{0,200}?\\$(\\d+(?:\\.\\d+)?)"));
    if (m && Number(m[1]) !== r.price) {
      errors.push(`${name}: LAX ⇄ ${r.city} shows $${m[1]} but routes-data says $${r.price}`);
    }
  }
}

// 4) faq.html Malibu answer must use the canonical Malibu fare.
if (!read("faq.html").includes(`fixed, all-in fare from $${FARE_OF["Malibu"]}`)) {
  errors.push(`faq.html Malibu answer is stale (expected $${FARE_OF["Malibu"]}).`);
}

if (errors.length) {
  console.error("✗ Fare consistency check FAILED:\n  - " + errors.join("\n  - "));
  console.error(
    "\n  Fix prices in scripts/routes-data.mjs (route cities) or scripts/fares-data.mjs" +
      " (extra cities), then update the file(s) above to match, and rebuild."
  );
  process.exit(1);
}
console.log(
  `✓ Fares consistent (chat KB, home, popular-routes, FAQ) · ${CHAT_FARES.length} cities`
);
