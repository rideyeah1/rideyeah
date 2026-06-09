/**
 * RideYeah · sitemap generator
 * ----------------------------
 * Writes sitemap.xml from the static page list + scripts/routes-data.mjs, so
 * the route URLs (EN + ES, with hreflang) stay in sync automatically.
 * Imported by scripts/build.mjs. EN locs keep ".html"; the build's clean-URL
 * pass strips it in dist/.
 */
import { writeFileSync } from "node:fs";
import { ROUTES } from "./routes-data.mjs";
import { POSTS } from "./blog-data.mjs";
import { CITIES } from "./cities-data.mjs";

const B = "https://rideyeah.com";
const triAlt = (en, es) =>
  `    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>\n    <xhtml:link rel="alternate" hreflang="es" href="${es}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>\n`;
const esAlt = (loc, en) =>
  `    <xhtml:link rel="alternate" hreflang="es" href="${loc}"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${en}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${en}"/>\n`;
const u = (loc, altblk, cf, pr) =>
  `  <url>\n    <loc>${loc}</loc>\n${altblk}    <changefreq>${cf}</changefreq>\n    <priority>${pr}</priority>\n  </url>`;

const p = [];
p.push(u(`${B}/`, triAlt(`${B}/`, `${B}/es/`), "weekly", "1.0"));
p.push(u(`${B}/airport-transfers.html`, triAlt(`${B}/airport-transfers.html`, `${B}/es/traslados-aeropuerto-lax`), "monthly", "0.9"));
p.push(u(`${B}/black-car-service.html`, triAlt(`${B}/black-car-service.html`, `${B}/es/servicio-black-car`), "monthly", "0.9"));
p.push(u(`${B}/hourly-chauffeur.html`, triAlt(`${B}/hourly-chauffeur.html`, `${B}/es/chofer-por-horas`), "monthly", "0.8"));
p.push(u(`${B}/popular-routes.html`, triAlt(`${B}/popular-routes.html`, `${B}/es/rutas-populares`), "monthly", "0.8"));
p.push(u(`${B}/fleet.html`, triAlt(`${B}/fleet.html`, `${B}/es/flota`), "monthly", "0.8"));
p.push(u(`${B}/about.html`, triAlt(`${B}/about.html`, `${B}/es/nosotros`), "monthly", "0.7"));
p.push(u(`${B}/careers.html`, triAlt(`${B}/careers.html`, `${B}/es/empleo`), "monthly", "0.6"));
for (const r of ROUTES) p.push(u(`${B}/lax-to-${r.slug}.html`, triAlt(`${B}/lax-to-${r.slug}.html`, `${B}/es/lax-a-${r.slug}`), "monthly", "0.8"));
p.push(u(`${B}/es/`, `    <xhtml:link rel="alternate" hreflang="es" href="${B}/es/"/>\n    <xhtml:link rel="alternate" hreflang="en" href="${B}/"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${B}/"/>\n`, "weekly", "0.9"));
p.push(u(`${B}/es/traslados-aeropuerto-lax`, esAlt(`${B}/es/traslados-aeropuerto-lax`, `${B}/airport-transfers.html`), "monthly", "0.8"));
p.push(u(`${B}/es/servicio-black-car`, esAlt(`${B}/es/servicio-black-car`, `${B}/black-car-service.html`), "monthly", "0.8"));
p.push(u(`${B}/es/flota`, esAlt(`${B}/es/flota`, `${B}/fleet.html`), "monthly", "0.8"));
p.push(u(`${B}/es/chofer-por-horas`, esAlt(`${B}/es/chofer-por-horas`, `${B}/hourly-chauffeur.html`), "monthly", "0.7"));
p.push(u(`${B}/es/rutas-populares`, esAlt(`${B}/es/rutas-populares`, `${B}/popular-routes.html`), "monthly", "0.7"));
p.push(u(`${B}/es/nosotros`, esAlt(`${B}/es/nosotros`, `${B}/about.html`), "monthly", "0.6"));
p.push(u(`${B}/es/empleo`, esAlt(`${B}/es/empleo`, `${B}/careers.html`), "monthly", "0.5"));
for (const r of ROUTES) p.push(u(`${B}/es/lax-a-${r.slug}`, esAlt(`${B}/es/lax-a-${r.slug}`, `${B}/lax-to-${r.slug}.html`), "monthly", "0.7"));
// Corporate service page (EN-only, clean URL)
p.push(u(`${B}/corporate-transportation`, "", "monthly", "0.8"));
// City service-area pages (EN-only, clean URLs)
p.push(u(`${B}/service-areas`, "", "monthly", "0.8"));
for (const c of CITIES) p.push(u(`${B}/${c.slug}`, "", "monthly", "0.8"));
// FAQ hub (EN-only, clean URL)
p.push(u(`${B}/faq`, "", "monthly", "0.6"));
// Blog (EN-only, clean URLs)
p.push(u(`${B}/blog/`, "", "weekly", "0.7"));
for (const post of POSTS) p.push(u(`${B}/blog/${post.slug}`, "", "monthly", "0.6"));

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${p.join("\n")}\n</urlset>\n`;
writeFileSync("sitemap.xml", xml, "utf8");
console.log(`✓ Generated sitemap.xml (${p.length} URLs)`);
