// Emit posts.json + schedule.csv for the 9-route series (method-agnostic).
import fs from 'node:fs';
import path from 'node:path';

const ROUTES = [
  { slug: 'downtown-la', dest: 'Downtown LA', fare: 150 },
  { slug: 'long-beach', dest: 'Long Beach', fare: 200 },
  { slug: 'pasadena', dest: 'Pasadena', fare: 200 },
  { slug: 'calabasas', dest: 'Calabasas', fare: 200 },
  { slug: 'anaheim', dest: 'Anaheim', fare: 250 },
  { slug: 'simi-valley', dest: 'Simi Valley', fare: 250 },
  { slug: 'thousand-oaks', dest: 'Thousand Oaks', fare: 250 },
  { slug: 'camarillo', dest: 'Camarillo', fare: 300 },
  { slug: 'santa-barbara', dest: 'Santa Barbara', fare: 400 },
];

// cadence: Tue & Thu, 09:00 America/Los_Angeles, starting Tue 2026-06-23
const pad = (n) => String(n).padStart(2, '0');
const days = [];
let d = new Date(Date.UTC(2026, 5, 23, 12, 0, 0));
while (days.length < ROUTES.length) {
  const wd = d.getUTCDay();
  if (wd === 2 || wd === 4) days.push(new Date(d));
  d = new Date(d.getTime() + 24 * 3600 * 1000);
}

const rows = [['date_local', 'time_local', 'timezone', 'route', 'platforms', 'image_feed', 'image_story', 'link', 'caption_file']];
const posts = [];
ROUTES.forEach((r, i) => {
  const num = pad(i + 1);
  const dt = days[i];
  const dateLocal = `2026-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
  const feed = `feed/${num}_LAX-${r.slug}_feed.png`;
  const story = `story/${num}_LAX-${r.slug}_story.png`;
  const cap = `captions/${num}_LAX-${r.slug}.txt`;
  const link = `https://rideyeah.com/lax-to-${r.slug}`;
  const route = `LAX <> ${r.dest}`;
  rows.push([dateLocal, '09:00', 'America/Los_Angeles', route, 'Instagram;FacebookPage', feed, story, link, cap]);
  posts.push({ order: i + 1, route, slug: r.slug, fare: r.fare, scheduled_local: `${dateLocal} 09:00`, timezone: 'America/Los_Angeles', platforms: ['instagram', 'facebook_page'], feed_image: feed, story_image: story, caption_file: cap, link, status: 'pending' });
});

const csv = rows.map((r) => r.map((c) => (/[,;"]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c)).join(',')).join('\n') + '\n';
for (const base of ['social/routes', 'C:/Users/reyna/Downloads/RideYeah_Routes']) {
  fs.writeFileSync(path.join(base, 'schedule.csv'), csv, 'utf8');
  fs.writeFileSync(path.join(base, 'posts.json'), JSON.stringify(posts, null, 2), 'utf8');
}
console.log(csv);
