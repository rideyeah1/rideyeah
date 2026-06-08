# RideYeah · Weekly blog agent

Automatically drafts one SEO blog article a week and opens a **Pull Request** for
review. Nothing publishes without a human merge.

## How it works

```
Monday 14:00 UTC  →  GitHub Actions (.github/workflows/blog-weekly.yml)
   1. node scripts/blog-agent/run.mjs
        • picks the next unpublished topic from QUEUE (scripts/blog-data.mjs)
        • injects real route facts (price/distance) from routes-data.mjs
        • asks the Claude API to draft it as a structured post (JSON)
        • validates it and APPENDS to content/blog-generated.json
   2. npm run build           (proves the new article renders)
   3. gh pr create            (opens a PR for review)
        → you read it, tweak if needed, and MERGE to publish
        → the merge pushes to main → the Deploy workflow ships it live
```

Authored articles in `scripts/blog-data.mjs` (`AUTHORED`) are **never touched** —
the agent only ever appends to `content/blog-generated.json`, which is merged
into `POSTS` at build time.

## Enable it (owner, one-time)

1. Create an Anthropic API key at <https://console.anthropic.com>.
2. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `ANTHROPIC_API_KEY`
   - Value: your key
3. Done. The next Monday run will open a PR. To test immediately:
   **Actions tab → "Weekly blog draft" → Run workflow**.

Until the secret exists, the workflow runs but is a **graceful no-op** (it never
fails or spams you).

**Cost:** roughly a few US cents per article (one Claude API call, ~4k tokens).
Optional: set a `BLOG_AGENT_MODEL` repo variable to pin a specific model
(default `claude-3-5-sonnet-latest`).

## Manage the topic queue

Edit `QUEUE` in `scripts/blog-data.mjs`. Each entry:

```js
{
  slug: "url-slug",            // becomes /blog/<slug>
  title: "Working Title",
  keyword: "target keyword",
  category: "Airport Transfers",
  related: ["thousand-oaks"],  // route slugs → real prices injected + linked
  hero: "band_highway",        // an image base name in images/
  brief: "Angle + key points + which page to funnel to.",
}
```

The agent always drafts the **first** queue item that isn't already published,
so order = priority. Add new ideas to the bottom; the queue never runs dry as
long as you keep topping it up.

## Higher-quality / research-backed drafts

The automated pipeline drafts from the brief + real route facts (no live web
search). For deeper, research-backed pieces, run a Claude Code session and ask
it to write the next `QUEUE` item — it has web search and can add it to
`content/blog-generated.json` (or straight into `AUTHORED`) the same way.

## Editing or rejecting a draft

- **Tweak:** edit the post object in `content/blog-generated.json` on the PR
  branch, then merge.
- **Reject:** close the PR and delete the branch. Remove or rephrase the topic
  in `QUEUE` so it isn't drafted again.
- **Unpublish later:** delete the post's object from `content/blog-generated.json`.
