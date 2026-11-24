# Nim Dvir link shortener

Small branded URL shortener deployed separately from the Astro/GitHub Pages site.

## Architecture

- **Vercel**: Next.js redirect route and private admin dashboard
- **Supabase**: `short_links` and `short_link_clicks`
- **DNS**: `d.nimdvir.com` and `n.nimdvir.com` (CNAME records at Squarespace, Vercel project `nimdvir-links`)

The main Astro site remains deployed by GitHub Pages. Vercel builds only this folder.

## Environment variables

Set these only on the Vercel project:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SHORTENER_ADMIN_SECRET`

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

## Link types

- `url` (default): `/<slug>` redirects with HTTP 302.
- `path`: stores a local Windows path (`G:\...`). `/<slug>` returns just the path as plain text, because a browser can't open a local file from a web link. Anyone with the short link can read the path.

## AI chats (connector)

Claude, ChatGPT and Gemini can create and list short links through the MCP connector at `https://d.nimdvir.com/mcp`. They can't delete or pause links.

- **Sign-in:** standard OAuth 2.1 with PKCE. A chat registers itself (`/oauth/register`), then opens `/oauth/authorize`, where Nim types the admin passcode once and clicks Allow. The chat gets its own token (30 days, renewed automatically; refresh tokens rotate). Only Claude, ChatGPT, Google and localhost return addresses can register.
- **Disconnect:** in `/admin`, under "Connected AI chats". It takes effect at once, and reconnecting needs the passcode again.
- **Source column:** links record who made them (`claude`, `chatgpt`, `gemini`, `right-click`, `admin`).
- Names follow the same rules as the right-click tool (`lib/links.js`). Leave the name out to get one suggested from the title, and the chosen name always wins.

Setup in each app (address `https://d.nimdvir.com/mcp`):

1. **Claude:** Settings > Connectors > Add custom connector. Name it "Short links", paste the address, then Connect and approve with the passcode.
2. **ChatGPT:** Settings > Apps & Connectors > Advanced > turn on Developer mode, then create a connector with the address and OAuth. Developer mode may require a Business, Enterprise or Edu plan.
3. **Gemini:** on gemini.google.com, Settings > Connected apps > add a custom app with the address (personal US accounts with Keep Activity on).

## Routes

- `/<slug>` redirects with HTTP 302 (or shows the path for path links)
- `/admin` opens the private dashboard
- `/api/admin` powers admin CRUD and statistics
- `/mcp` is the AI connector (bearer token required)
- `/oauth/register`, `/oauth/authorize` and `/oauth/token` handle sign-in. `/.well-known/oauth-protected-resource` and `/.well-known/oauth-authorization-server` describe it.
