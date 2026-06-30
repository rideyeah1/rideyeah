# Auto-posting setup — Facebook Page + Instagram (Graph API)

This wires up `.github/workflows/social-routes.yml` so the 9 route posts publish
themselves (Tue & Thu, 9 AM PT). You do this **once**. ~20 minutes.

## What runs
A weekly GitHub Action reads `social/routes/posts.json`, takes the next **due** route,
posts it to the **Facebook Page** (feed) and **Instagram** (feed + story), marks it
`posted`, and commits the queue back. Images are served from this public repo via
`raw.githubusercontent.com`, so no extra hosting is needed.

---

## Prerequisites
1. A **Facebook Page** for RideYeah (not a personal profile).
2. An **Instagram Business or Creator** account, **connected to that Page**
   (IG app → Settings → *Account type and tools* → switch to Professional;
   then Page → Settings → *Linked accounts* → Instagram).
3. You are an **admin** of both the Page and the Meta app you'll create below.
   *(With admin/developer/tester roles you can post to your own Page/IG without full
   App Review — App Review is only needed to post on behalf of accounts you don't own.)*

## Step 1 — Create a Meta app
1. Go to **developers.facebook.com → My Apps → Create App → "Business"**.
2. In the app, add the **Instagram Graph API** and **Facebook Login** products
   (Facebook Login just to mint tokens in the Graph Explorer).

## Step 2 — Get a long-lived Page access token + the 3 IDs
Use **Graph API Explorer** (developers.facebook.com/tools/explorer):
1. Pick your app (top-right), click **Generate Access Token**, and grant these scopes:
   `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`,
   `instagram_basic`, `instagram_content_publish`, `business_management`.
2. **Find your Page ID + Page token** — run:
   `GET /me/accounts`
   → copy the Page's `id` (**= META_PAGE_ID**) and its `access_token`.
3. **Make the token long-lived** (Page tokens derived from a long-lived user token don't
   expire). First exchange the user token:
   `GET /oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&fb_exchange_token=USER_TOKEN`
   then re-run `GET /me/accounts` with the long-lived user token and copy the Page
   `access_token` (**= META_ACCESS_TOKEN**).
4. **Find the Instagram user ID** — run:
   `GET /{META_PAGE_ID}?fields=instagram_business_account`
   → copy `instagram_business_account.id` (**= META_IG_USER_ID**).

> Sanity check the token: `GET /{META_IG_USER_ID}?fields=username` should return the IG handle.

## Step 3 — Add the 3 GitHub secrets
Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Value |
|--------|-------|
| `META_ACCESS_TOKEN` | the long-lived **Page** access token (Step 2.3) |
| `META_PAGE_ID`      | the Facebook Page ID (Step 2.2) |
| `META_IG_USER_ID`   | the Instagram business user ID (Step 2.4) |

## Step 4 — Make sure the images are public
The route images must be on the **default branch** so `raw.githubusercontent.com` serves
them. Commit & push `social/` (images + scripts + posts.json) and the workflow file.
Verify one URL opens in a browser, e.g.:
`https://raw.githubusercontent.com/rideyeah1/rideyeah/main/social/routes/feed/01_LAX-downtown-la_feed.png`

## Step 5 — Test, then let it run
Repo → **Actions → "Social — auto-post routes" → Run workflow**:
- First do a **dry run**: set `dry_run = true`, `force_next = true` → it logs what it *would*
  post without calling the API.
- Then a **real test**: `dry_run = false`, `force_next = true` → it posts route #1 now and
  marks it posted. Check the Page + IG.
- After that, leave it alone — the cron posts the rest on the scheduled Tue/Thu dates.

## Notes
- **One post per run**, drained in `posts.json` order. Reorder/repause by editing
  `status` (`pending`/`posted`) or `scheduled_local` in `social/routes/posts.json`.
- **Stories:** on by default; turn off per-run with the `post_story` input. (If IG story
  publishing errors, the run still posts the feed and just logs the story as skipped.)
- **Daylight saving:** cron is `16:00 UTC` = 9 AM PT in summer (PDT). The whole campaign is
  Jun–Jul, so it's correct. For winter reuse, change the hour to `17`.
- **Token health:** a Page token from a long-lived user token is effectively non-expiring,
  but if posting suddenly 401s, regenerate it (Step 2) and update `META_ACCESS_TOKEN`.
- **Re-generate the posts** anytime: `node social/src/routes-build.mjs` then
  `node social/src/routes-schedule.mjs` (resets the queue).
