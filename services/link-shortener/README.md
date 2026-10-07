# Nim Dvir link shortener

Small branded URL shortener deployed separately from the Astro/GitHub Pages site.

## Architecture

- **Vercel**: Next.js redirect route and private admin dashboard
- **Supabase**: `short_links` and `short_link_clicks`
- **DNS**: intended custom host such as `n.nimdvir.com`

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

The database RLS policies contain only the SHA-256 hash of the admin secret. When rotating `SHORTENER_ADMIN_SECRET`, update the hash in the policies in `supabase/schema.sql` and re-apply the policies.

## Routes

- `/<slug>` redirects with HTTP 302
- `/admin` opens the private dashboard
- `/api/admin` powers admin CRUD and statistics
