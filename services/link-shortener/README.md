# Nim Dvir link shortener

Small branded URL shortener deployed separately from the Astro/GitHub Pages site.

## Architecture

- **Vercel**: Next.js redirect route and private admin dashboard
- **Supabase**: `short_links` and `short_link_clicks`
- **DNS**: `dr.nimdvir.com` (canonical since 2026-11-25), plus the older aliases `d.nimdvir.com` and `n.nimdvir.com` (CNAME records at Squarespace, Vercel project `nimdvir-links`)

The main Astro site remains deployed by GitHub Pages. Vercel builds only this folder.

## Public address

Every new short link is `https://dr.nimdvir.com/<name>`, whichever host the request came through. The address lives in one place, `lib/public-origin.js` (`PUBLIC_ORIGIN`), and the admin page, the connector and `/api/yourls` all use it.

- All three hosts serve the same links, so `d.nimdvir.com/<name>` and `n.nimdvir.com/<name>` keep redirecting. Never remove an alias from the Vercel project.
- OAuth does **not** use `PUBLIC_ORIGIN`. Issuer, resource and endpoints follow the request host (`originOf` in `lib/oauth.js`), so a connector set up on any host keeps validating.
- Default copy format everywhere: `Title - https://dr.nimdvir.com/<name>` (just the URL when there is no title). The admin page's **URL** button copies only the URL.

## Environment variables

Set these only on the Vercel project:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SHORTENER_ADMIN_SECRET`
- `YOURLS_SIGNATURE` (optional): a separate token for the tmplat endpoint. If unset, tmplat uses the admin passcode.

The Supabase publishable key is intentionally low privilege. Row Level Security controls access. The admin secret is never exposed to browser JavaScript except when Nim types it into the admin page; the dashboard keeps it in session storage for the current tab/session.

## Privacy

Click logging stores:

- timestamp
- referrer when provided by the browser
- user-agent
- coarse device/browser/OS
- Vercel country/region/city headers when available

It does **not** store the visitor's raw IP address.

## Admin-secret rotation

The database RLS policies contain only the SHA-256 hash of the admin secret. To rotate it:

1. Set the new `SHORTENER_ADMIN_SECRET` for Production and Preview (`vercel env add ... --force --sensitive`).
2. Redeploy production. Vercel only applies a new value to new deployments.
3. Right away, `alter policy` each admin policy to the new hash, and update the hash in `supabase/schema.sql`.
4. Check with a real request: `GET /api/admin` with the new secret returns 200, and creating then deleting a test link works. A loading `/admin` page proves nothing.

Last rotated on 2026-11-23. The right-click tool keeps its copy in `%LOCALAPPDATA%\nim-short-link\passcode.dat`, encrypted for the Windows user.

## Admin page

- **Top links** at the top: the five most-clicked links this week or of all time, each with a Copy button.
- Each link is a card with **Copy** (`Title - link`) and **URL** buttons beside the short address.
- Tap a link's stats row to open it: its clicks (latest 200), and editing of its short name, title and topic, plus Pause, Archive and Delete. Renaming the short name breaks the old address (the page warns first).
- **My order** (sort menu): drag links by their handle to arrange them within a group. The order is saved in `short_links.position`; links never placed (such as new ones) show first.
- **Archive** hides a link from the list but keeps it redirecting (`short_links.archived_at`). Archived links sit in a closed section at the bottom, where they can be restored.
- Links can be searched, grouped (topic, website, made with, or none) and sorted. Topic groups can be renamed with the pencil next to their name, which renames the topic on all their links. Grouping and sort are remembered in the browser.
- **Topic** is an optional `short_links.topic` column (max 40 characters).

## Link types

- `url` (default): `/<slug>` redirects with HTTP 302.
- `path`: stores a local Windows path (`G:\...`). `/<slug>` returns just the path as plain text, because a browser can't open a local file from a web link. Anyone with the short link can read the path.

## AI chats (connector)

Claude, ChatGPT and Gemini can create and list short links through the MCP connector at `https://dr.nimdvir.com/mcp`. They can't delete or pause links. Connectors set up earlier on `https://d.nimdvir.com/mcp` keep working and also return `dr.nimdvir.com` links.

- **Sign-in:** standard OAuth 2.1 with PKCE. A chat registers itself (`/oauth/register`), then opens `/oauth/authorize`, where Nim types the admin passcode once and clicks Allow. The chat gets its own token (30 days, renewed automatically; refresh tokens rotate). Only Claude, ChatGPT, Google and localhost return addresses can register.
- **Disconnect:** in `/admin`, under "Connected AI chats". It takes effect at once, and reconnecting needs the passcode again.
- **Source column:** links record who made them (`claude`, `chatgpt`, `gemini`, `right-click`, `admin`).
- Names follow the same rules as the right-click tool (`lib/links.js`). Nim's chosen name always wins; otherwise the chat picks a short descriptive name, or leaves it out to get one suggested from the title.
- **Replies:** the first line of a created link is `Title - https://dr.nimdvir.com/<name>`, and chats reply with that line (just the URL when Nim asks).

Setup in each app (address `https://dr.nimdvir.com/mcp`):

1. **Claude:** Settings > Connectors > Add custom connector. Name it "Short links", paste the address, then Connect and approve with the passcode.
2. **ChatGPT:** Settings > Apps & Connectors > Advanced > turn on Developer mode, then create a connector with the address and OAuth. Developer mode may require a Business, Enterprise or Edu plan.
3. **Gemini:** on gemini.google.com, Settings > Connected apps > add a custom app with the address (personal US accounts with Keep Activity on).

## tmplat (browser extension)

`/api/yourls` speaks the YOURLS API, so tmplat's `{#shorten}{url}{/shorten}` makes `dr.nimdvir.com` links (also when tmplat still points at the old `d.nimdvir.com` address). It only creates links (`action=shorturl`). It can't list, change or delete them.

- **Auth:** YOURLS "advanced" mode. tmplat sends a timestamp and `sha256(timestamp + token)`, where the token is the admin passcode (or `YOURLS_SIGNATURE` if set), so the token itself never travels. Signatures expire after 12 hours.
- **Names:** taken from the end of the URL path, or the site name. Opaque IDs and words like `edit` are skipped. Otherwise a fun pair is suggested.
- **Repeats:** a URL that already has a short link gets that link back, so running a template twice doesn't create duplicates.
- **Source column:** `tmplat`.
- **Choosing the name:** tmplat can only send a URL, so templates add a marker to its end, which is removed before saving:
  - `#~name=<name>` uses that name (tmplat sends the selected text, kebab-cased). Names follow the usual rules; one that's taken by another destination is refused.
  - `#~random` always makes a new link with a random name such as `sleepy-otter`.

Setup in tmplat (Options > Settings > URL shorteners):

1. Service: **YOURLS**.
2. URL: `https://dr.nimdvir.com/api/yourls`.
3. Authentication: **signature token** (advanced), with the admin passcode as the token.

When the admin passcode is rotated, update it in tmplat too. To give tmplat its own token instead, set `YOURLS_SIGNATURE` and redeploy.

## Routes

- `/<slug>` redirects with HTTP 302 (or shows the path for path links)
- `/admin` opens the private dashboard. `/admin?url=…&title=…&slug=…` opens it with the create form filled in (used by the "Short link (name it)" bookmarklet); after Create, `Title - https://dr.nimdvir.com/<name>` is copied to the clipboard
- `/api/admin` powers admin CRUD and statistics
- `/mcp` is the AI connector (bearer token required)
- `/api/yourls` is the YOURLS-compatible endpoint for tmplat (signature required)
- `/oauth/register`, `/oauth/authorize` and `/oauth/token` handle sign-in. `/.well-known/oauth-protected-resource` and `/.well-known/oauth-authorization-server` describe it.
