// Auto-publish the next due RideYeah "Routes" post to Facebook Page + Instagram
// via the Meta Graph API. Driven by social/routes/posts.json (the queue).
//
// Run by .github/workflows/social-routes.yml on a weekly cron. Each run publishes
// the EARLIEST post that is `pending` AND whose scheduled date is due (<= now PT),
// then marks it `posted` and the workflow commits posts.json back.
//
// Env (GitHub secrets): META_ACCESS_TOKEN, META_PAGE_ID, META_IG_USER_ID
// Optional env: POST_STORY=true|false (default true) · DRY_RUN=true · FORCE_NEXT=true
//   IMAGE_BASE_URL (default: GitHub raw of this repo) · API_VERSION (default v21.0)
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const ROUTES_DIR = path.join(ROOT, 'social', 'routes');
const POSTS_JSON = path.join(ROUTES_DIR, 'posts.json');

const API = process.env.API_VERSION || 'v21.0';
const GRAPH = `https://graph.facebook.com/${API}`;
const TOKEN = process.env.META_ACCESS_TOKEN || '';
const PAGE_ID = process.env.META_PAGE_ID || '';
const IG_USER_ID = process.env.META_IG_USER_ID || '';
const IMAGE_BASE = (process.env.IMAGE_BASE_URL || 'https://raw.githubusercontent.com/rideyeah1/rideyeah/main/social/routes').replace(/\/$/, '');
const POST_STORY = (process.env.POST_STORY ?? 'true') !== 'false';
const DRY_RUN = process.env.DRY_RUN === 'true';
const FORCE_NEXT = process.env.FORCE_NEXT === 'true';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(...a);

// PT "now" as a YYYY-MM-DD string (handles PDT/PST automatically)
function todayPT() {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' });
  return f.format(new Date()); // e.g. 2026-06-23
}

async function graph(url, body) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) throw new Error(`Graph ${res.status}: ${JSON.stringify(json.error || json)}`);
  return json;
}

// Build the post text: caption + hashtags, minus the separator line.
async function buildMessage(captionFile) {
  const raw = await readFile(path.join(ROUTES_DIR, captionFile), 'utf8');
  return raw.split('\n').filter((l) => !/^[\s—-]*$/.test(l) || l.trim() === '').join('\n')
    .replace(/\n{3,}/g, '\n\n').trim();
}

// ---- Facebook Page: photo post ----
async function postFacebookPhoto(imageUrl, message) {
  if (DRY_RUN) { log('  [dry-run] FB Page photo:', imageUrl); return { id: 'dry' }; }
  return graph(`${GRAPH}/${PAGE_ID}/photos`, { url: imageUrl, caption: message, published: true, access_token: TOKEN });
}

// ---- Instagram: create container → poll → publish ----
async function postInstagram(imageUrl, caption, isStory = false) {
  if (DRY_RUN) { log(`  [dry-run] IG ${isStory ? 'story' : 'feed'}:`, imageUrl); return { id: 'dry' }; }
  const body = { image_url: imageUrl, access_token: TOKEN };
  if (isStory) body.media_type = 'STORIES'; else body.caption = caption;
  const container = await graph(`${GRAPH}/${IG_USER_ID}/media`, body);
  // poll container readiness (image containers are usually instant)
  for (let i = 0; i < 8; i++) {
    const st = await fetch(`${GRAPH}/${container.id}?fields=status_code&access_token=${encodeURIComponent(TOKEN)}`).then((r) => r.json()).catch(() => ({}));
    if (st.status_code === 'FINISHED') break;
    if (st.status_code === 'ERROR') throw new Error(`IG container error: ${JSON.stringify(st)}`);
    await sleep(3000);
  }
  return graph(`${GRAPH}/${IG_USER_ID}/media_publish`, { creation_id: container.id, access_token: TOKEN });
}

async function main() {
  if (!DRY_RUN && (!TOKEN || !PAGE_ID || !IG_USER_ID)) {
    console.error('Missing required env: META_ACCESS_TOKEN, META_PAGE_ID, META_IG_USER_ID');
    process.exit(1);
  }
  const posts = JSON.parse(await readFile(POSTS_JSON, 'utf8'));
  const today = todayPT();

  const pending = posts.filter((p) => p.status === 'pending');
  if (!pending.length) { log('Nothing left to post — all 9 routes are done. 🎉'); return; }

  const due = FORCE_NEXT ? pending : pending.filter((p) => p.scheduled_local.slice(0, 10) <= today);
  if (!due.length) {
    const next = pending[0];
    log(`Nothing due yet (today PT = ${today}). Next: ${next.route} on ${next.scheduled_local}.`);
    return;
  }
  due.sort((a, b) => a.order - b.order);
  const post = due[0];
  log(`Publishing #${post.order} — ${post.route}  (scheduled ${post.scheduled_local})`);

  const message = await buildMessage(post.caption_file);
  const feedUrl = `${IMAGE_BASE}/${post.feed_image}`;
  const storyUrl = `${IMAGE_BASE}/${post.story_image}`;

  // Facebook Page feed
  const fb = await postFacebookPhoto(feedUrl, message);
  log('  ✓ Facebook Page:', fb.post_id || fb.id);
  // Instagram feed
  const ig = await postInstagram(feedUrl, message, false);
  log('  ✓ Instagram feed:', ig.id);
  // Instagram story (optional)
  if (POST_STORY) {
    try {
      const igs = await postInstagram(storyUrl, '', true);
      log('  ✓ Instagram story:', igs.id);
    } catch (e) {
      log('  ⚠ Instagram story skipped:', e.message);
    }
  }

  post.status = DRY_RUN ? 'pending' : 'posted';
  post.posted_at = DRY_RUN ? null : new Date().toISOString();
  if (!DRY_RUN) {
    await writeFile(POSTS_JSON, JSON.stringify(posts, null, 2) + '\n', 'utf8');
    log(`Marked #${post.order} as posted. ${posts.filter((p) => p.status === 'pending').length} remaining.`);
  } else {
    log('[dry-run] Would mark posted; posts.json unchanged.');
  }
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
