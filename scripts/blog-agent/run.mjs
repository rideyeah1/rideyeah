/**
 * RideYeah · Weekly blog agent (draft generator)
 * ----------------------------------------------
 * Picks the next unpublished topic from QUEUE (scripts/blog-data.mjs), asks the
 * Claude API to draft it as a structured post object (matching the blog-data
 * schema), validates it, and APPENDS it to content/blog-generated.json.
 *
 * It never touches authored posts. The GitHub Actions workflow
 * (.github/workflows/blog-weekly.yml) runs this weekly and opens a Pull Request
 * with the change for human approval before it goes live.
 *
 * Requires env ANTHROPIC_API_KEY (added by the owner as a GitHub secret).
 * Without it, the script is a graceful no-op so the weekly cron never fails.
 *
 *   node scripts/blog-agent/run.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { QUEUE, POSTS } from "../blog-data.mjs";
import { ROUTES, DISCLAIMER_EN } from "../routes-data.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const GEN_PATH = join(HERE, "..", "..", "content", "blog-generated.json");
const KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_VERSION = "2023-06-01";

// Resolve the model at runtime: use BLOG_AGENT_MODEL if set, otherwise ask the
// API which models this key can use and pick the newest Sonnet (then Haiku).
// This avoids hard-coding a model id that may be renamed or retired.
async function resolveModel() {
  if (process.env.BLOG_AGENT_MODEL) return process.env.BLOG_AGENT_MODEL;
  const res = await fetch("https://api.anthropic.com/v1/models?limit=100", {
    headers: { "x-api-key": KEY, "anthropic-version": ANTHROPIC_VERSION },
  });
  if (!res.ok) throw new Error(`Anthropic models API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const { data } = await res.json();
  const ids = (data || []).map((m) => m.id); // newest first
  const pick = ids.find((id) => /sonnet/i.test(id)) || ids.find((id) => /haiku/i.test(id)) || ids[0];
  if (!pick) throw new Error("No models available for this API key");
  return pick;
}

const ok = (msg) => {
  console.log(msg);
  process.exit(0);
};

if (!KEY) ok("ℹ No ANTHROPIC_API_KEY set — skipping (add the secret to enable the weekly agent).");

// 1) pick the next queued topic that isn't published yet
const published = new Set(POSTS.map((p) => p.slug));
const topic = QUEUE.find((q) => !published.has(q.slug));
if (!topic) ok("ℹ QUEUE is empty (all topics published) — nothing to draft.");

// 2) inject real route facts so the model never invents prices/distances
const routeFacts = (topic.related || [])
  .map((slug) => ROUTES.find((r) => r.slug === slug))
  .filter(Boolean)
  .map(
    (r) =>
      `- LAX ⇄ ${r.city}: fixed fare $${r.price}, ${r.driveLong}, ${r.miles}. Landmarks: ${r.landmarks}. Route page: /lax-to-${r.slug}.html`,
  )
  .join("\n");

const SCHEMA = `{
  "metaTitle": "string <=60 chars, ends with ' | RideYeah'",
  "metaDescription": "string 150-160 chars, includes the keyword naturally",
  "excerpt": "string 1-2 sentences for the blog index card",
  "readMin": number,
  "heroAlt": "string, descriptive alt text including 'luxury black SUV' where natural",
  "body": [
    { "p": "paragraph, may contain inline <a href=\\"/airport-transfers.html\\">, <strong>, <em>" },
    { "h2": "section heading" },
    { "h3": "optional sub-heading" },
    { "ul": ["item", "item"] },
    { "ol": ["step", "step"] },
    { "quote": "one short pull-quote" },
    { "cta": { "label": "button text", "href": "/#book" } }
  ],
  "faq": [ { "q": "question", "a": "answer" }, { "q": "...", "a": "..." }, { "q": "...", "a": "..." } ]
}`;

const system = `You are the content writer for RideYeah, a luxury chauffeur / black-SUV service in Los Angeles & Orange County (rideyeah.com).
Write one SEO blog article as STRICT JSON only — no markdown, no commentary, no code fences. The JSON must match this shape exactly:
${SCHEMA}

BRAND & STYLE
- Premium, calm, confident. Plain, concrete English; short paragraphs. American spelling.
- Vehicle is always a "luxury black SUV" (never "Suburban"/"sedan"). Phone: (805) 285-1570. Email: info@rideyeah.com.
- Booking CTAs always use href "/#book". Put 2 {cta} blocks in the body (one mid-article, one at the end).
- Include 3-5 internal links inside paragraphs using these EXACT paths (the build strips .html):
  /airport-transfers.html, /black-car-service.html, /hourly-chauffeur.html, /popular-routes.html, and the related route page(s) below.
- Open the first paragraph by directly answering the topic in 2-3 sentences (featured-snippet friendly).
- 1100-1600 words across the body. Exactly 3 FAQ items. Use 5-8 {h2} sections.

ACCURACY (critical — do not invent)
- Use ONLY the route prices/distances provided below. Never invent fares, distances, fleet sizes, ratings, review counts or stats.
- Fares are fixed and all-in (tolls + gratuity, no surge). When you state a price, add that fares may change without notice and to use the booking search for an exact quote. Reference: "${DISCLAIMER_EN}"
- No fake testimonials or numeric claims you can't support.`;

const user = `TOPIC
- Working title: ${topic.title}
- Target keyword: ${topic.keyword}
- Category: ${topic.category}
- Angle / brief: ${topic.brief}

RELATED ROUTE FACTS (use these exact numbers; link to the route page):
${routeFacts || "- (no specific route; link to /popular-routes.html for pricing)"}

Return ONLY the JSON object.`;

// 3) call the Claude API
async function draft(model) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": KEY,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model,
      max_tokens: 4000,
      temperature: 0.6,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${(await res.text()).slice(0, 400)}`);
  const data = await res.json();
  const text = (data.content || []).map((c) => c.text || "").join("").trim();
  const jsonStr = text.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```\s*$/, "").trim();
  return JSON.parse(jsonStr);
}

function validate(d) {
  const errs = [];
  if (!d || typeof d !== "object") errs.push("not an object");
  if (!d.metaTitle) errs.push("missing metaTitle");
  if (!d.metaDescription) errs.push("missing metaDescription");
  if (!Array.isArray(d.body) || d.body.length < 6) errs.push("body too short");
  if (!Array.isArray(d.faq) || d.faq.length !== 3) errs.push("faq must have exactly 3 items");
  const allowed = new Set(["p", "h2", "h3", "ul", "ol", "quote", "cta"]);
  if (Array.isArray(d.body)) {
    for (const b of d.body) {
      const keys = Object.keys(b || {});
      if (keys.length !== 1 || !allowed.has(keys[0])) errs.push(`bad block: ${JSON.stringify(b).slice(0, 60)}`);
    }
  }
  const hasCta = Array.isArray(d.body) && d.body.some((b) => b.cta);
  if (!hasCta) errs.push("body needs at least one {cta}");
  return errs;
}

const wordCount = (body) =>
  body
    .flatMap((b) => (b.p ? [b.p] : b.h2 ? [b.h2] : b.h3 ? [b.h3] : b.ul || b.ol || (b.quote ? [b.quote] : [])))
    .join(" ")
    .replace(/<[^>]+>/g, "")
    .split(/\s+/).length;

try {
  const model = await resolveModel();
  console.log(`• Using model: ${model}`);
  const d = await draft(model);
  const errs = validate(d);
  if (errs.length) throw new Error("Validation failed: " + errs.join("; "));

  const today = new Date().toISOString().slice(0, 10);
  const post = {
    slug: topic.slug,
    category: topic.category,
    date: today,
    readMin: d.readMin && d.readMin > 0 ? d.readMin : Math.max(4, Math.round(wordCount(d.body) / 220)),
    hero: topic.hero,
    heroAlt: d.heroAlt || `${topic.title} — RideYeah luxury black SUV`,
    related: topic.related || [],
    title: topic.title,
    metaTitle: d.metaTitle,
    metaDescription: d.metaDescription,
    keyword: topic.keyword,
    excerpt: d.excerpt || d.metaDescription,
    body: d.body,
    faq: d.faq,
    generated: true,
  };

  let arr = [];
  try {
    arr = JSON.parse(readFileSync(GEN_PATH, "utf8"));
    if (!Array.isArray(arr)) arr = [];
  } catch {
    arr = [];
  }
  if (arr.some((p) => p.slug === post.slug)) ok(`ℹ "${post.slug}" already in blog-generated.json — nothing to do.`);
  arr.push(post);
  writeFileSync(GEN_PATH, JSON.stringify(arr, null, 2) + "\n", "utf8");

  console.log(`✓ Drafted "${post.title}" (${wordCount(d.body)} words) → content/blog-generated.json`);
  console.log(`  slug: ${post.slug}`);
} catch (e) {
  console.error("✗ Blog agent failed:", e.message);
  process.exit(1);
}
