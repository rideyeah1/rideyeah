# RideYeah — "Routes" social series (9 posts)

Bilingual-free, **English-only** Instagram + Facebook content for the 9 published LAX routes,
each as a **feed post (1080×1080)** and a **story (1080×1920)**, with a caption + hashtags.
Routes are **bidirectional** — *to OR from LAX* (one-way or round-trip), shown as `LAX ⇄ Destination`.

Regenerate any time with: `node social/src/routes-build.mjs` (images + captions) and
`node social/src/routes-schedule.mjs` (schedule.csv + posts.json).

## Folder structure
```
social/routes/
├── feed/        9× 1080×1080 PNG  → Instagram feed + Facebook feed
├── story/       9× 1080×1920 PNG  → Instagram story + Facebook story
├── captions/    9× .txt           → caption + hashtag block (English)
├── schedule.csv                   → date · platform · image · caption (for schedulers)
├── posts.json                     → same data, for a code pipeline
└── README.md
```
A copy of everything is also in **`Downloads/RideYeah_Routes/`** for easy uploading.

## The 9 routes
| # | Post | Fixed fare | Time | Distance | Landing page |
|---|------|-----------|------|----------|--------------|
| 01 | LAX ⇄ Downtown LA  | from $150 | ~25 min   | 18 mi | /lax-to-downtown-la |
| 02 | LAX ⇄ Long Beach   | from $200 | ~30 min   | 22 mi | /lax-to-long-beach |
| 03 | LAX ⇄ Pasadena     | from $200 | ~40 min   | 28 mi | /lax-to-pasadena |
| 04 | LAX ⇄ Calabasas    | from $200 | ~40 min   | 30 mi | /lax-to-calabasas |
| 05 | LAX ⇄ Anaheim      | from $250 | ~40 min   | 35 mi | /lax-to-anaheim |
| 06 | LAX ⇄ Simi Valley  | from $250 | ~55 min   | 45 mi | /lax-to-simi-valley |
| 07 | LAX ⇄ Thousand Oaks| from $250 | ~55 min   | 45 mi | /lax-to-thousand-oaks |
| 08 | LAX ⇄ Camarillo    | from $300 | ~1h 5m    | 55 mi | /lax-to-camarillo |
| 09 | LAX ⇄ Santa Barbara| from $400 | ~1h 50m   | 95 mi | /lax-to-santa-barbara |

## Suggested cadence
2 posts/week (**Tue & Thu, 9:00 AM PT**) → the series runs **Jun 23 → Jul 21, 2026**.
Post the **feed** image with its caption; post the **story** image the same day (add the
`rideyeah.com` link sticker to the story). Exact dates are in `schedule.csv`.

> Tip for Instagram: put the link only in the **story** (link sticker) — IG feed captions
> aren't clickable, so the caption says "Book at rideyeah.com" and drives people to the bio link.

---

# Auto-publishing — how to make these post themselves

## Step 0 — prerequisites (required by EVERY method)
1. A **Facebook Page** must exist (a personal profile can't be auto-posted to). *(This is the
   step currently blocked by Facebook's "too many attempts" rate-limit — wait it out, then
   create the Page once from desktop.)*
2. An **Instagram Business or Creator account** (free to switch in the IG app:
   Settings → Account type) **connected to that Facebook Page**.
   Personal IG accounts cannot be posted to by any tool or API.

Once those two exist, all options below work.

## Option A — Self-hosted scheduler (Postiz)  ·  *recommended, no code to maintain*
Postiz is **open-source and self-hostable** (fits the "no third-party SaaS" preference). You
connect the FB Page + IG once, upload the 9 feed/story images, paste each caption, and set the
dates from `schedule.csv`. It then posts automatically. Easiest to run and to change later.

## Option B — Meta Graph API + GitHub Actions cron  ·  *fully automated, free, code-owned*
Fits the existing stack (GitHub + Cloudflare). The images already live in this repo and deploy
to `rideyeah.com`, so they're reachable by public URL (the Graph API needs a public image URL).
A weekly **GitHub Actions** workflow reads `posts.json`, takes the next `pending` route, and:
- **Facebook Page:** `POST /{page-id}/photos` with `url` + `caption`.
- **Instagram feed:** `POST /{ig-user-id}/media` (image_url + caption) → `POST /{ig-user-id}/media_publish`.
- **Instagram story:** same, with `media_type=STORIES`.
Then it flips that route to `posted` and commits. One-time setup: a long-lived **Page access
token**, the **Page ID** and **IG user ID**, stored as GitHub repo secrets. *(Claude can build
the whole workflow + publish script; you only paste the 3 secrets once the Page/IG are ready.)*

## Option C — Free no-code scheduler with CSV bulk-import (Publer / Metricool / Later)
Upload the 9 images + import `schedule.csv`; the tool schedules everything in ~15 min. Zero code,
zero tokens. Downside: it's a third-party SaaS holding the posting tokens.

## Option D — Meta Business Suite Planner  ·  *built-in, free, but manual*
Facebook/Instagram's own **Planner** (business.facebook.com) lets you schedule each post by hand.
No extra tools, but it's manual (not true automation).

### Recommendation
- Want it **hands-off and owned by you**, on your GitHub/Cloudflare stack → **Option B**.
- Want it **running today with the least fuss** and don't mind a tool → **Option A (Postiz)**.
Either way, **Step 0 must be done first** (Page live + IG Business connected).
